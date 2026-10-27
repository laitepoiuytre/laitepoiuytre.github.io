# Te Lai (赖特) - Personal Academic Economics Website

This repository contains the complete, self-contained personal academic website for **Te Lai (赖特)**, predoctoral researcher in applied microeconomics, environmental & energy economics, innovation economics, and cyber-physical systems.

---

## 🚀 Quick Start (Local Preview)

### Method 1: Double-Click Launcher (Recommended for Windows)
Simply double-click **`start_website.bat`**.  
It will automatically launch a local web server and open your browser at:
```
http://localhost:8000
```

### Method 2: Command Line
Open PowerShell or Terminal in this directory and run:
```bash
python start_server.py
```
Or use Python's built-in HTTP server:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in any browser.

---

## 📂 Directory Structure

```
D:\academic_website/
├── index.html                  # Main responsive personal website
├── start_website.bat           # One-click Windows desktop launcher
├── start_server.py             # Python local HTTP server & browser auto-opener
├── verify_links.py             # Automated asset & hyperlink validator
├── README.md                   # Site documentation & deployment guide
├── assets/
│   ├── css/
│   │   └── style.css           # Ivy-League academic typography & styling
│   ├── js/
│   │   └── main.js             # Modal lightbox, BibTeX copy, bilingual switcher
│   ├── images/
│   │   ├── Te_Lai.jpg          # Professional academic portrait
│   │   ├── Te_Lai_casual.jpg   # High-res casual portrait
│   │   ├── Fig1_bipartite_network.png
│   │   ├── Fig2_semantic_distance_collapse.png
│   │   ├── Fig3_placebo_trajectory.png
│   │   ├── Fig4_oem_platform_transition.png
│   │   ├── Fig5_tier1_boundary.png
│   │   └── EV_Pipeline_Flowchart_EN.png
│   └── docs/
│       ├── CV_TeLai_Academic.pdf                                # Academic CV (English)
│       ├── CV_TeLai_Chinese.pdf                                 # Academic CV (Chinese)
│       ├── Technical_Architecture_and_Embodied_AI_Trilogy_Proposal.pdf # Master Working Paper Trilogy (EN)
│       ├── Technical_Architecture_and_Embodied_AI_Trilogy_Proposal_CN.pdf # Master Working Paper Trilogy (CN)
│       ├── presentation_academic_en.pdf                         # Academic Slides (English)
│       ├── presentation_academic.pdf                            # Academic Slides (Chinese)
│       ├── greennetwork_paper.pdf                               # Patent Network Paper (AAERE)
│       ├── AAERE_Conference_Slides.pdf                          # AAERE Conference Slide Deck
│       ├── Recommendation_Letter_Yang_Zheng.pdf                 # Letter of Recommendation (Dr. Yang Zheng)
│       ├── oem_platform_master_v1.xlsx                          # 25 Automakers, 152 Platforms Replication Data
│       └── oem_platform_master_v1.csv
└── dashboards/
    ├── autodriving_technology_diffusion_sankey.html             # Interactive Global Diffusion Sankey
    ├── index_12theme_dashboard.html                             # DeepSeek 49K Sample 12-Theme Big Screen
    ├── patent_data_pipeline_diagram_en.html                     # End-to-End Data Pipeline Architecture
    └── charts/                                                  # 12-Theme charts (chart1 - chart12)
```

---

## 🌐 How to Deploy Online (Free & Permanent)

### Option A: GitHub Pages (Recommended, e.g. `telai.github.io`)
1. Create a repository on GitHub named `<username>.github.io` (e.g. `telai.github.io`).
2. Push the contents of this folder (`D:\academic_website`) to the `main` branch.
3. In GitHub repo Settings -> **Pages**, ensure source is set to `Deploy from a branch` -> `main` / `/(root)`.
4. Your website is immediately live worldwide with a free custom domain or `.github.io` URL!

### Option B: Cloudflare Pages / Vercel / Netlify
1. Drag and drop the `D:\academic_website` directory into Cloudflare Pages or Vercel dashboard.
2. It will deploy within 10 seconds as a ultra-fast static site.

---

## 📑 Included Research & Assets Inventory

1. **Flagship Working Paper Trilogy (2026)**:
   - *Title*: "Technical Architecture, Knowledge Recombination, and the Vertical Boundary of the Firm: Empirical Evidence from Cyber-Physical Innovation in the Automotive Industry"
   - Study 1: Macro Paradigm Symbiosis (*PNAS / Nature Energy*)
   - Study 2: Intra-Firm Architectural Reorganization (*Research Policy / Management Science*)
   - Study 3: Inter-Firm Innovation Chains (*SMJ / Research Policy*)
2. **Co-authored Working Papers**:
   - "Global Carbon Pricing and Clean Energy Innovation" (with Jingbo Cui & Yang Zheng, 2026)
   - "The Evolution of The Network: The Evidence from China" (with Jingbo Cui, AAERE Conference)
3. **Data Assets & Frontier ML**:
   - LLM-based Patent Classification Pipeline (80% accuracy vs 25% IEA baseline across 5M+ patents).
   - Global OEM Platform & Architecture Database (25 OEMs, 152 platform generations).
   - PatentSBERTa 768-D semantic space calculations.
4. **Interactive Dashboards**:
   - Cross-border technology diffusion interactive Sankey diagram.
   - 12-dimension patent intelligence screen for 49,246 verified patents.
   - End-to-end data pipeline architecture diagram.
5. **Credentials & Background**:
   - M.S. in Applied Economics, University of Michigan (GPA 4.0/4.0).
   - B.A. in Political Economy, Duke Kunshan University (GPA 3.8/4.0, Dean's List).
   - CFA Level 3 Candidate, FRM Level 1.
   - Strong Letter of Recommendation from Dr. Yang Zheng (Aston / LSE).
