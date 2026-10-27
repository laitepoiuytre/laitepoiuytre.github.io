/**
 * Te Lai — academic homepage scripts
 *
 * 1. Figure lightbox
 * 2. BibTeX copy-to-clipboard
 * 3. Section highlighting in the sticky nav
 *
 * No external dependencies. Image paths are resolved from this script's own
 * URL so the lightbox keeps working regardless of which page embeds it.
 */

document.addEventListener("DOMContentLoaded", function () {
  /* ---------------------------------------------------------------
   * 1. Figure lightbox
   * ------------------------------------------------------------- */

  var modal = document.getElementById("figureModal");
  var modalImg = document.getElementById("modalImage");
  var modalTitle = document.getElementById("modalTitle");
  var modalDesc = document.getElementById("modalDescription");
  var modalClose = document.getElementById("modalClose");

  // main.js lives in assets/js/; figures live in assets/images/.
  // Resolve against this script's URL rather than the document's, so the
  // path is correct even if the page is served from a sub-directory.
  var scriptEl = document.querySelector('script[src$="assets/js/main.js"]');
  var IMG = scriptEl
    ? new URL("../images/", scriptEl.src).href
    : new URL("assets/images/", window.location.href).href;

  var figureData = {
    fig1: {
      src: IMG + "Fig1_bipartite_network.png",
      title: "Bipartite Knowledge Recombination Network",
      desc: "Empirical bipartite network mapping co-occurrences between electric-powertrain patents, internal-combustion patents and autonomous-driving algorithm patents. Internal-combustion vehicles show orthogonal separation, whereas native EV platforms show dense phase-transition recombination."
    },
    fig2: {
      src: IMG + "Fig2_semantic_distance_collapse.png",
      title: "PatentSBERTa Semantic Distance",
      desc: "768-dimensional semantic embedding distance between chassis electromechanical hardware and cognitive planning algorithms, 2008–2024."
    },
    fig3: {
      src: IMG + "Fig3_placebo_trajectory.png",
      title: "Placebo Disentanglement and Cognitive Algorithm Trajectory",
      desc: "Compares high-coordination planning and control domains with low-coordination perception and infotainment modules, separating the architectural feedback mechanism from secular digital technology trends."
    },
    fig4: {
      src: IMG + "Fig4_oem_platform_transition.png",
      title: "Native Platform Transitions and the Counterfactual Window",
      desc: "Chronological transition timeline across 25 global automotive groups and 152 platform generations. Identifies the 2–10 year conversion-EV retrofitting window as a within-firm natural experiment."
    },
    fig5: {
      src: IMG + "Fig5_tier1_boundary.png",
      title: "Vertical Boundary Reorganisation and Tier-1 Commoditisation",
      desc: "Dyad citation and knowledge-flow analysis between OEMs and the top-10 chassis suppliers, showing OEM intrusion into vehicle motion control and horizontal supplier semantic homogenisation."
    },
    fig_event: {
      src: IMG + "Fig4_event_study.png",
      title: "Event Study — True Event versus Placebo",
      desc: "Dynamic treatment-effect estimates for architectural centralisation on the true native-platform event (left) versus the modular-retrofit placebo event (right). True-event coefficients rise from about 0.04 at k=0 to about 0.19 at k=5; the placebo trajectory stays flat around zero, supporting the parallel-trends assumption behind the staggered DID design."
    },
    fig_paradigm: {
      src: IMG + "Fig1_sankey_paradigm.png",
      title: "Technology Portfolio Composition, 2008–2024",
      desc: "Share of patent families by technology family across the application window: native EV platforms and chassis-by-wire, modular ADAS and standalone algorithms, and legacy ICE powertrains with mechanical control."
    },
    fig_pipeline: {
      src: IMG + "EV_Pipeline_Flowchart_EN.png",
      title: "End-to-End Patent Data Engineering Pipeline",
      desc: "Full-stack data pipeline integrating DuckDB, Lens, USPTO, EPO and Orbis records with LLM-assisted verification and high-dimensional semantic vectorisation."
    },
    fig1b: {
      src: IMG + "Fig1b_cognitive_growth.png",
      title: "Subsystem Patent Volume and Decision Share, 2008–2024",
      desc: "Panel (a) plots annual applications in four automotive subsystems: cognitive decision and planning, vehicle control and actuation, environmental perception, and connected support systems. Panel (b) reports the decision share of patents together with growth indices relative to 2008, documenting the roughly eleven-fold expansion of cognitive decision patents relative to the other subsystems."
    },
    fig_crossborder: {
      src: IMG + "Fig6_crossborder_flows.png",
      title: "Cross-Border Technology Flows in Energy-Storage Patents",
      desc: "Sankey diagram tracing 77,245 originating patent families to 438,040 subsequent filings across jurisdictions. Origin shares: Japan 32.4%, Germany 19.1%, United States 15.6%, rest of world 13.6%, Korea 13.5%, China 5.9%. Filing shares: United States 29.1%, rest of world 21.6%, China 18.8%, Europe 18.5%, Japan 6.9%, Korea 5.0%."
    }
  };

  function openModal(key) {
    var data = figureData[key];
    if (!data || !modal) return;
    modalImg.src = data.src;
    modalImg.alt = data.title;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    if (modalClose) modalClose.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "";
    modalImg.src = "";
  }

  // The clickable element is the .frame wrapper; the key lives on the <img>.
  document.querySelectorAll("figure .frame").forEach(function (frame) {
    var img = frame.querySelector("img[data-figure]");
    if (!img) return;
    var key = img.getAttribute("data-figure");

    frame.addEventListener("click", function () {
      openModal(key);
    });

    frame.setAttribute("tabindex", "0");
    frame.setAttribute("role", "button");
    frame.setAttribute("aria-label", "Enlarge figure");
    frame.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(key);
      }
    });
  });

  if (modalClose) modalClose.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  /* ---------------------------------------------------------------
   * 2. BibTeX copy
   * ------------------------------------------------------------- */

  var bibtexDict = {
    bib_trilogy: [
      "@techreport{lai2026architecture,",
      "  title   = {Technical Architecture, Knowledge Recombination, and the Vertical Boundary of the Firm: Empirical Evidence from Cyber-Physical Innovation in the Automotive Industry},",
      "  author  = {Lai, Te},",
      "  year    = {2026},",
      "  month   = {October},",
      "  type    = {Working Paper},",
      "  note    = {Job market paper},",
      "  address = {Kunshan, China},",
      "  institution = {Duke Kunshan University}",
      "}"
    ].join("\n"),
    bib_carbon: [
      "@techreport{cui2026carbon,",
      "  title  = {Global Carbon Pricing and Clean Energy Innovation},",
      "  author = {Cui, Jingbo and Lai, Te and Zheng, Yang},",
      "  year   = {2026},",
      "  type   = {Working Paper},",
      "  institution = {Duke Kunshan University and Aston University}",
      "}"
    ].join("\n"),
    bib_network: [
      "@inproceedings{cui2021network,",
      "  title  = {The Evolution of the Network: The Evidence from China},",
      "  author = {Cui, Jingbo and Lai, Te},",
      "  year   = {2021},",
      "  booktitle = {Proceedings of the 6th East Asian Association of Environmental and Resource Economics (AAERE) Conference},",
      "  address = {Seoul National University, South Korea}",
      "}"
    ].join("\n")
  };

  var toast = document.getElementById("toast");

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
  }

  document.querySelectorAll("[data-bibtex]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var citation = bibtexDict[this.getAttribute("data-bibtex")];
      if (!citation) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(citation).then(
          function () { showToast("BibTeX copied to clipboard"); },
          function () { showToast("Copy failed — select the citation manually"); }
        );
      } else {
        var ta = document.createElement("textarea");
        ta.value = citation;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
          showToast("BibTeX copied to clipboard");
        } catch (err) {
          showToast("Copy failed");
        }
        document.body.removeChild(ta);
      }
    });
  });

  /* ---------------------------------------------------------------
   * 3. Nav highlighting
   * ------------------------------------------------------------- */

  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll("nav.site-nav a[href^='#']");

  if (sections.length && navLinks.length) {
    var onScroll = function () {
      var pos = window.scrollY + 140;
      var current = "";
      sections.forEach(function (s) {
        if (s.offsetTop <= pos) current = s.id;
      });
      navLinks.forEach(function (link) {
        var isActive = link.getAttribute("href") === "#" + current;
        link.classList.toggle("active", isActive);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
});
