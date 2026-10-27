#!/usr/bin/env python3
"""
verify_links.py - 资源引用完整性校验

扫描站点内所有 HTML / JS / CSS 文件，提取本地资源引用并逐一校验存在性。
相比旧版本的关键改进：
  1. 不再只检查 index.html，而是递归扫描所有 .html / .js / .css
  2. 解析 JS 中的字符串路径（lightbox 图片等旧版完全漏检）
  3. 用「引用方所在目录」而非站点根目录做相对路径解析，能捕获路径 bug
  4. 可选 --strict 模式：报告未被任何文件引用的孤儿资源
  5. 检测残留的外部 CDN 依赖

用法:
    python verify_links.py            # 常规校验
    python verify_links.py --strict   # 额外报告孤儿文件
"""

import os
import re
import sys
from pathlib import Path

SITE_ROOT = Path(__file__).resolve().parent

# 参与扫描的文件类型
SCAN_EXTS = {'.html', '.htm', '.js', '.css'}
# 可被引用的资源类型（用于孤儿检测）
ASSET_EXTS = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg',
              '.pdf', '.css', '.js', '.xlsx', '.csv', '.woff2', '.woff', '.ttf'}
# 跳过目录
SKIP_DIRS = {'.git', 'node_modules', '__pycache__', '.chrome-tmp',
             '_unused', '_publish', '_backup_v1_portfolio'}
# 不对外发布、不进引用链的仓库内文件（工具脚本、保密材料）
IGNORE_FILES = {'smoke_test.js', 'verify_links.py', 'start_server.py',
                'Recommendation_Letter_Yang_Zheng.pdf'}

# 硬编码路径 / 外部协议，不参与本地校验
EXTERNAL_PREFIXES = ('http://', 'https://', '//', 'mailto:', 'tel:', 'data:', '#', 'javascript:')

# 提取 HTML 属性引用: src="..." href="..." poster="..."
HTML_REF_RE = re.compile(r'(?:src|href|poster)\s*=\s*["\']([^"\']+)["\']', re.I)
# 提取 CSS url(...)
CSS_URL_RE = re.compile(r'url\(\s*["\']?([^"\')\s]+)["\']?\s*\)', re.I)
# 提取 JS 中的字面量路径（必须以资源扩展名结尾，避免误抓普通字符串）
JS_ASSET_RE = re.compile(r'["\']([^"\'\s]+\.(?:png|jpe?g|webp|gif|svg|pdf|xlsx|csv|json|html|woff2?|ttf))["\']', re.I)
# 匹配形如  IMG + "Fig1_x.png"  的动态拼接（前缀变量 + 文件名）
JS_CONCAT_RE = re.compile(r'([A-Za-z_$][\w$]*)\s*\+\s*["\']([^"\']+\.(?:png|jpe?g|webp|gif|svg))["\']', re.I)
# 匹配基准变量定义，例如  const IMG = new URL("../images/", ...)
JS_BASE_RE = re.compile(r'(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*new\s+URL\(\s*["\']([^"\']+)["\']', re.I)


def iter_scan_files():
    for path in SITE_ROOT.rglob('*'):
        if not path.is_file():
            continue
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.suffix.lower() in SCAN_EXTS:
            yield path


def extract_refs(path: Path):
    """
    从单个文件提取引用的原文字符串。
    对 JS 文件，会把  IMG + "x.png"  这类动态拼接还原成相对本文件的真实路径，
    例如  ../images/x.png ，避免误报为缺失。
    """
    try:
        text = path.read_text(encoding='utf-8', errors='ignore')
    except OSError as exc:
        print(f'  [WARN] 无法读取 {path.name}: {exc}')
        return []

    refs = []
    suffix = path.suffix.lower()
    if suffix in ('.html', '.htm'):
        refs += HTML_REF_RE.findall(text)
        refs += CSS_URL_RE.findall(text)   # <style> 块中的 url()
    elif suffix == '.css':
        refs += CSS_URL_RE.findall(text)
    elif suffix == '.js':
        # 先记录基准变量（形如 const IMG = new URL("../images/", ...)）
        bases = dict(JS_BASE_RE.findall(text))
        concat_spans = []
        for m in JS_CONCAT_RE.finditer(text):
            var, fname = m.group(1), m.group(2)
            concat_spans.append(m.span())
            base = bases.get(var)
            if base is not None:
                # 把基准目录与文件名拼成相对本脚本的路径
                refs.append(base + fname)
            # 若基准未知则跳过，交由普通字面量规则处理
        for m in JS_ASSET_RE.finditer(text):
            # 已被拼接规则覆盖的片段不再重复计入
            if any(s <= m.start() and m.end() <= e for s, e in concat_spans):
                continue
            raw = m.group(1)
            if raw.startswith(('../', './')):
                refs.append(raw)
            elif '/' not in raw:
                # 裸文件名且未出现在拼接表达式中，无法确定基准，标记待人工确认
                refs.append(f'__BARE__{raw}')
            else:
                refs.append(raw)
    return refs


def resolve(ref: str, referrer: Path):
    """
    以引用方所在目录为基准解析相对路径。
    main.js 里的 "assets/images/x.png" 会解析成 assets/js/assets/images/x.png，
    这样能真实复现浏览器的解析行为，捕获旧版漏掉的路径 bug。
    """
    ref = ref.split('?')[0].split('#')[0].strip()
    if not ref or ref.startswith(EXTERNAL_PREFIXES):
        return None
    if ref.startswith('/'):
        # 站点根绝对路径
        return (SITE_ROOT / ref.lstrip('/')).resolve()
    return (referrer.parent / ref).resolve()


def main():
    strict = '--strict' in sys.argv
    print(f'站点根目录: {SITE_ROOT}\n')

    checked = 0
    ok = 0
    missing = []
    external = []
    bare = []
    referenced_files = set()

    for src_file in sorted(iter_scan_files()):
        refs = extract_refs(src_file)
        if not refs:
            continue
        rel_src = src_file.relative_to(SITE_ROOT)
        for raw in dict.fromkeys(refs):
            raw_s = raw.strip()
            if raw_s.startswith('__BARE__'):
                # 无法静态确定基准的裸文件名，交由手动/浏览器验证
                bare.append((rel_src, raw_s.replace('__BARE__', '')))
                continue
            if raw_s.startswith(EXTERNAL_PREFIXES):
                # 只有以资源扩展名结尾的外部 URL 才算「资源依赖」；
                # 指向他人主页/论文 DOI 的普通超链接不算。
                if raw_s.startswith(('http://', 'https://', '//')):
                    clean = raw_s.split('?')[0].split('#')[0].lower()
                    if clean.endswith(tuple(ASSET_EXTS)):
                        external.append((rel_src, raw_s))
                continue
            target = resolve(raw_s, src_file)
            if target is None:
                continue
            checked += 1
            try:
                target.relative_to(SITE_ROOT)
            except ValueError:
                missing.append((rel_src, raw_s, '引用了站点目录之外的文件'))
                continue
            if target.is_file():
                ok += 1
                referenced_files.add(target)
            else:
                missing.append((rel_src, raw_s, '文件不存在'))

    print(f'检查本地引用: {checked} 个  (OK {ok} / 缺失 {len(missing)})')

    if missing:
        print('\n缺失引用:')
        for src, raw, why in missing:
            print(f'  [MISSING] {src}  ->  {raw}   ({why})')

    if bare:
        print(f'\n无法静态解析基准的裸文件名: {len(bare)} 处')
        for src, raw in bare:
            print(f'  [BARE] {src}  ->  {raw}')

    if external:
        print(f'\n外部网络依赖: {len(external)} 处')
        for src, url in external:
            print(f'  [EXTERNAL] {src}  ->  {url}')
        print('  提示: 外部依赖在断网或受限网络下会失效，静态学术主页通常应自包含。')

    # ---- 孤儿资源检测 ----
    orphans = []
    for path in SITE_ROOT.rglob('*'):
        if not path.is_file():
            continue
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.suffix.lower() not in ASSET_EXTS:
            continue
        if path.name in IGNORE_FILES:
            continue
        if path.resolve() not in referenced_files:
            orphans.append(path.relative_to(SITE_ROOT))

    if orphans:
        label = '孤儿文件（未被任何页面引用）' if strict else '孤儿文件（仅供参考，加 --strict 视为失败）'
        print(f'\n{label}: {len(orphans)} 个')
        for o in sorted(orphans):
            size = (SITE_ROOT / o).stat().st_size
            print(f'  [ORPHAN] {o}  ({size:,} bytes)')

    # ---- 结果 ----
    failed = bool(missing) or bool(external) or (strict and bool(orphans))
    print()
    if failed:
        print('校验未通过。')
        return 1
    print('全部资源引用校验通过。')
    return 0


if __name__ == '__main__':
    sys.exit(main())
