const SCRIPT = `
(function () {
  var doc = document;
  var root = doc.documentElement;
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var cleanup = [];

  function on(target, type, fn, opts) {
    target.addEventListener(type, fn, opts);
    cleanup.push(function () { target.removeEventListener(type, fn, opts); });
  }

  function teardown() {
    for (var i = 0; i < cleanup.length; i++) cleanup[i]();
    cleanup = [];
  }

  /* ---------- 1. scroll progress bar ---------- */
  function initProgress() {
    if (reduced) return;
    var bar = doc.createElement("div");
    bar.className = "ez-progress";
    bar.setAttribute("aria-hidden", "true");
    doc.body.appendChild(bar);
    var ticking = false;
    function update() {
      var max = doc.documentElement.scrollHeight - innerHeight;
      var p = max > 0 ? scrollY / max : 0;
      bar.style.transform = "scaleX(" + p + ")";
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    on(doc, "scroll", onScroll, { passive: true });
    on(win(), "resize", onScroll, { passive: true });
    update();
    cleanup.push(function () { bar.remove(); });
  }

  function win() { return window; }

  /* ---------- 2. scroll reveal (hero uses pure CSS keyframes, excluded) ---------- */
  var revealSel = [
    ".ez-cards .ez-card",
    ".ez-note-strip",
    ".markdown-rendered > h2",
    ".markdown-rendered > h3",
    ".markdown-rendered > pre",
    ".markdown-rendered > blockquote",
    ".markdown-rendered > figure",
    ".markdown-rendered > table",
    ".article-title",
    ".article-meta",
    ".article-tags",
  ].join(",");

  function initReveal() {
    if (reduced || !("IntersectionObserver" in window)) return;
    root.classList.add("ez-motion");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("ez-seen");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    function scan() {
      var groups = new Map();
      doc.querySelectorAll(revealSel).forEach(function (el) {
        if (el.classList.contains("ez-in") || el.classList.contains("ez-seen")) return;
        el.classList.add("ez-in");
        var parent = el.parentElement;
        var idx = groups.get(parent) || 0;
        el.style.setProperty("--ez-i", idx);
        groups.set(parent, idx + 1);
        io.observe(el);
      });
    }
    scan();
    cleanup.push(function () {
      io.disconnect();
      root.classList.remove("ez-motion");
    });
    return scan;
  }

  /* ---------- 3. SPA page transition ---------- */
  function initTransition(scan) {
    if (reduced) return;
    on(doc, "nav", function () {
      var center = doc.querySelector(".page .center") || doc.querySelector(".center");
      if (center) {
        center.classList.remove("ez-nav-in");
        void center.offsetWidth;
        center.classList.add("ez-nav-in");
      }
      scrollTo(0, 0);
      if (scan) requestAnimationFrame(scan);
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    teardown();
    initProgress();
    var scan = initReveal();
    initTransition(scan);
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
`;

export default function EzMotion() {
  return {
    name: "EzMotion",
    // identity transform — satisfies the transformer category check
    // (config-loader validateCategory: textTransform | markdownPlugins | htmlPlugins).
    // NOTE: engine calls textTransform(ctx, src) — both params required, see parse.ts.
    textTransform: (_ctx, html) => html,
    externalResources: () => ({
      js: [
        {
          loadTime: "afterDOMReady",
          contentType: "inline",
          script: SCRIPT,
        },
      ],
    }),
  };
}
