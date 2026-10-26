/**
 * smoke_test.js - 实际拉起本地 HTTP 服务并逐个请求页面与资源
 *
 * verify_links.py 只能静态检查路径是否存在；本脚本验证的是
 * 浏览器真去请求时服务器是否返回 200，能覆盖路径解析、大小写、
 * 静态服务器默认行为等静态分析看不到的问题。
 *
 * 用法: node smoke_test.js
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".csv": "text/csv; charset=utf-8"
};

const server = http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split("?")[0]);
  if (rel === "/") rel = "/index.html";
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end("forbidden"); return; }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404).end("not found"); return; }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream" });
    res.end(buf);
  });
});

function get(port, p) {
  return new Promise((resolve) => {
    http.get({ host: "127.0.0.1", port, path: p, timeout: 10000 }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const buf = Buffer.concat(chunks);
        resolve({ status: res.statusCode, size: buf.length, body: buf });
      });
    }).on("error", (e) => resolve({ status: 0, err: e.message }))
      .on("timeout", function () { this.destroy(); resolve({ status: 0, err: "timeout" }); });
  });
}

function collectAssets(html, baseDir) {
  const out = new Set();
  const re = /(?:src|href)\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html))) {
    const ref = m[1].trim();
    if (/^(https?:|mailto:|tel:|data:|#|javascript:|\/\/)/i.test(ref)) continue;
    out.add(path.posix.normalize(path.posix.join(baseDir, ref.split("#")[0].split("?")[0])));
  }
  return out;
}

(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const port = server.address().port;
  console.log("本地服务已启动: http://127.0.0.1:" + port + "\n");

  const pages = [
    "/index.html",
    "/dashboards/index_12theme_dashboard.html",
    "/dashboards/autodriving_technology_diffusion_sankey.html",
    "/dashboards/patent_data_pipeline_diagram_en.html"
  ];
  let fail = 0, tested = 0;
  const checked = new Set();

  for (const page of pages) {
    const r = await get(port, page);
    tested++;
    if (r.status !== 200) {
      console.log("  [FAIL] " + page + " -> " + r.status + " " + (r.err || ""));
      fail++;
      continue;
    }
    console.log("  [OK]   " + page + "  (" + r.size.toLocaleString() + " bytes)");
    const html = r.body.toString("utf8");
    const baseDir = path.posix.dirname(page);
    for (const asset of collectAssets(html, baseDir)) {
      if (checked.has(asset)) continue;
      checked.add(asset);
      const a = await get(port, "/" + asset);
      tested++;
      if (a.status !== 200) {
        console.log("    [FAIL] " + asset + " -> " + a.status + " " + (a.err || ""));
        fail++;
      }
    }
  }

  const mainJs = fs.readFileSync(path.join(ROOT, "assets/js/main.js"), "utf8");
  const figNames = [...mainJs.matchAll(/IMG\s*\+\s*"([^"]+\.(?:png|jpe?g|webp|gif|svg))"/gi)].map((m) => m[1]);
  console.log("\n  Lightbox 运行时图片 (" + figNames.length + " 张):");
  for (const n of figNames) {
    const asset = path.posix.normalize("assets/images/" + n);
    const a = await get(port, "/" + asset);
    tested++;
    if (a.status !== 200) {
      console.log("    [FAIL] " + asset + " -> " + a.status);
      fail++;
    } else {
      console.log("    [OK]   " + asset + "  (" + a.size.toLocaleString() + " bytes)");
    }
  }

  server.close();
  console.log("\n共测试 " + tested + " 个请求，失败 " + fail + " 个。");
  process.exit(fail ? 1 : 0);
})();
