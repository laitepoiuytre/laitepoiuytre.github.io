/**
 * Te Lai - Academic Economics Website JavaScript
 */

document.addEventListener("DOMContentLoaded", function () {
  // 1. Modal Lightbox for Figures
  const modal = document.getElementById("figureModal");
  const modalImg = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDescription");
  const modalClose = document.getElementById("modalClose");

  // Resolve figure paths from this script's own URL, not the page URL.
  // main.js lives in assets/js/, so a bare relative path to a figure would
  // resolve under assets/js/ and 404 inside the lightbox.
  // Locate the <script> tag explicitly because document.currentScript is null
  // inside a DOMContentLoaded handler.
  const scriptEl = document.querySelector('script[src$="assets/js/main.js"]');
  const IMG = scriptEl
    ? new URL("../images/", scriptEl.src).href
    : new URL("assets/images/", window.location.href).href;

  const figureData = {
    fig1: {
      title: "Figure 1: Bipartite Knowledge Recombination Network (Electric vs. ICE Powertrain)",
      src: IMG + "Fig1_bipartite_network.png",
      desc: "Empirical bipartite network mapping co-occurrences between 3.2M electric powertrain patents, 5.8M internal combustion patents, and 510K autonomous driving algorithms. Demonstrates the orthogonal separation in ICE vehicles versus the high-density phase-transition recombination in native EV platforms."
    },
    fig2: {
      title: "Figure 2: PatentSBERTa High-Dimensional Semantic Distance Collapse (2008–2024)",
      src: IMG + "Fig2_semantic_distance_collapse.png",
      desc: "Tracks the 768-dimensional semantic embedding distance between chassis electromechanical hardware and cognitive planning algorithms over time. Documents a statistically sharp 15.6% distributional collapse following architectural modularization."
    },
    fig3: {
      title: "Figure 3: Placebo Disentanglement & Cognitive Algorithm Trajectory",
      src: IMG + "Fig3_placebo_trajectory.png",
      desc: "Compares high-coordination planning & control domains (+11.1x growth) against low-coordination perception modules (vision +5.9x, in-cabin infotainment +4.4x), isolating the architectural feedback mechanism from secular digital technology trends."
    },
    fig4: {
      title: "Figure 4: Global Automaker Native Platform Transitions & Counterfactual Window",
      src: IMG + "Fig4_oem_platform_transition.png",
      desc: "Chronological transition timeline across 25 global automotive groups and 152 platform generations. Identifies the 2–10 year 'Conversion EV' modular retrofitting window as a within-firm natural experiment counterfactual."
    },
    fig5: {
      title: "Figure 5: Vertical Boundary Reorganization & Tier-1 Supplier Commoditization",
      src: IMG + "Fig5_tier1_boundary.png",
      desc: "Dyad citation and knowledge flow analysis between OEMs and top-10 chassis mega-suppliers (Bosch, Continental, ZF). Reveals OEM upward intrusion into vehicle motion control (VMC) and horizontal supplier semantic homogenization."
    },
    fig_pipeline: {
      title: "Figure 6: Global EV & Autonomous Driving Data Engineering Pipeline",
      src: IMG + "EV_Pipeline_Flowchart_EN.png",
      desc: "Full-stack data pipeline integrating DuckDB, Lens, USPTO, EPO, and Orbis records with LLM-assisted verification and high-dimensional semantic vectorization."
    },
    fig_event: {
      title: "Figure 6: Event Study — True Event vs. Placebo Dynamics",
      src: IMG + "Fig4_event_study.png",
      desc: "Dynamic treatment-effect estimates (β_k) for architectural centralization on the true native-platform event (panel a) versus the modular retrofit 'Conversion EV' placebo event (panel b). The true-event coefficients rise monotonically from ~0.04 at k=0 to ~0.19 at k=5 with a wide but consistently positive 95% CI, while the placebo trajectory stays flat around zero — supporting the parallel-trends assumption underlying the staggered DID design."
    },
    fig_paradigm: {
      title: "Figure 7: Technology Portfolio Composition (2008–2024)",
      src: IMG + "Fig1_sankey_paradigm.png",
      desc: "Share of patent families by technology family over the 2008–2024 application window: native EV platforms and chassis-by-wire, modular ADAS and standalone algorithms, and legacy ICE powertrains with mechanical control. Documents the macro-level paradigm coexistence and the reallocation of innovative effort across the three families."
    }
  };

  document.querySelectorAll("[data-figure]").forEach(function (el) {
    el.addEventListener("click", function () {
      const figKey = this.getAttribute("data-figure");
      const data = figureData[figKey];
      if (data) {
        modalImg.src = data.src;
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener("click", function () {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  }

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    });
  }

  // 2. BibTeX Copy
  const bibtexDict = {
    bib_trilogy: `@article{lai2026architecture,
  title={Technical Architecture, Knowledge Recombination, and the Vertical Boundary of the Firm: Empirical Evidence from Cyber-Physical Innovation in the Automotive Industry},
  author={Lai, Te},
  journal={Working Paper Series on Innovation and Technical Change},
  year={2026},
  institution={Duke Kunshan University}
}`,
    bib_carbon: `@article{cui2026carbon,
  title={Global Carbon Pricing and Clean Energy Innovation},
  author={Cui, Jingbo and Lai, Te and Zheng, Yang},
  journal={Working Paper},
  year={2026},
  institution={Duke Kunshan University and Aston University}
}`,
    bib_network: `@inproceedings{cui2021evolution,
  title={The Evolution of The Network: The Evidence from China},
  author={Cui, Jingbo and Lai, Te},
  booktitle={Proceedings of the 6th East Asian Association of Environmental and Resource Economics (AAERE) Conference},
  year={2021},
  address={Seoul National University, South Korea}
}`
  };

  const toast = document.getElementById("toast");

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(function () {
      toast.classList.remove("show");
    }, 3000);
  }

  document.querySelectorAll("[data-bibtex]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const bibKey = this.getAttribute("data-bibtex");
      const citation = bibtexDict[bibKey];
      if (citation) {
        navigator.clipboard.writeText(citation).then(function () {
          showToast("BibTeX citation copied to clipboard!");
        }).catch(function () {
          showToast("Copied citation!");
        });
      }
    });
  });

  // 3. Language Switcher (EN / CN)
  const langEnBtn = document.getElementById("langEn");
  const langCnBtn = document.getElementById("langCn");

  function setLanguage(lang) {
    if (lang === "cn") {
      document.body.classList.add("lang-cn");
      document.querySelectorAll("[data-en]").forEach(function (el) {
        el.setAttribute("data-original-en", el.innerHTML);
        if (el.getAttribute("data-cn")) {
          el.innerHTML = el.getAttribute("data-cn");
        }
      });
      if (langCnBtn) langCnBtn.classList.add("active");
      if (langEnBtn) langEnBtn.classList.remove("active");
      localStorage.setItem("preferred_lang", "cn");
    } else {
      document.body.classList.remove("lang-cn");
      document.querySelectorAll("[data-original-en]").forEach(function (el) {
        el.innerHTML = el.getAttribute("data-original-en");
      });
      if (langEnBtn) langEnBtn.classList.add("active");
      if (langCnBtn) langCnBtn.classList.remove("active");
      localStorage.setItem("preferred_lang", "en");
    }
  }

  if (langEnBtn && langCnBtn) {
    langEnBtn.addEventListener("click", function () { setLanguage("en"); });
    langCnBtn.addEventListener("click", function () { setLanguage("cn"); });
  }

  // 4. Smooth Nav Link Highlighting
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", function () {
    let current = "";
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  });
});

