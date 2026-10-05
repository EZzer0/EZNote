const SCRIPT = `
(function () {
  var doc = document;
  var root = doc.documentElement;
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var cleanup = [];

  function on(target, type, fn, opts) {
    target.addEventListener(type, fn, opts);
    cleanup.push(function () { target.removeEventListener(type, fn, opts); });
  }

  function teardown() {
    for (var i = 0; i < cleanup.length; i++) cleanup[i]();
    cleanup = [];
  }

  /* ---------- 1. custom cursor (fine pointers only, opt-in class) ---------- */
  function initCursor() {
    if (!finePointer || reduced) return;
    var ring = doc.createElement("div");
    ring.className = "ez-cur-ring";
    var dot = doc.createElement("div");
    dot.className = "ez-cur-dot";
    ring.setAttribute("aria-hidden", "true");
    dot.setAttribute("aria-hidden", "true");
    doc.body.appendChild(ring);
    doc.body.appendChild(dot);
    root.classList.add("ez-cursor-on");

    var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, raf = 0;
    function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
      dot.style.transform = "translate3d(" + mx + "px," + my + "px,0)";
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    on(doc, "pointermove", function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    on(doc, "pointerover", function (e) {
      var hit = e.target.closest("a,button,input,textarea,select,summary,[data-cursor='grow']");
      root.classList.toggle("ez-cur-hot", !!hit);
    });
    on(doc, "pointerdown", function () { root.classList.add("ez-cur-press"); });
    on(doc, "pointerup", function () { root.classList.remove("ez-cur-press"); });
    on(doc, "mouseleave", function () { root.classList.add("ez-cur-out"); });
    on(doc, "mouseenter", function () { root.classList.remove("ez-cur-out"); });

    cleanup.push(function () {
      cancelAnimationFrame(raf);
      root.classList.remove("ez-cursor-on", "ez-cur-hot", "ez-cur-press", "ez-cur-out");
      ring.remove(); dot.remove();
    });
  }

  /* ---------- 2. scroll progress bar ---------- */
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

  /* ---------- 3. scroll reveal (hero uses pure CSS keyframes, excluded) ---------- */
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

  /* ---------- 4. SPA page transition ---------- */
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

  /* ---------- 5. magnetic + glare ---------- */
  function initMagnetic() {
    if (!finePointer || reduced) return;

    doc.querySelectorAll(".ez-card, .ez-cta, .ez-hero-badge").forEach(function (el) {
      var mx = 0, my = 0, cx = 0, cy = 0, active = false, raf = 0;
      function loop() {
        cx += (mx - cx) * 0.18;
        cy += (my - cy) * 0.18;
        el.style.setProperty("--ez-gx", cx.toFixed(2) + "px");
        el.style.setProperty("--ez-gy", cy.toFixed(2) + "px");
        if (Math.abs(mx - cx) > 0.1 || Math.abs(my - cy) > 0.1 || active) {
          raf = requestAnimationFrame(loop);
        } else { raf = 0; }
      }
      on(el, "pointermove", function (e) {
        var r = el.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width - 0.5) * 14;
        my = ((e.clientY - r.top) / r.height - 0.5) * 10;
        el.style.setProperty("--ez-mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
        el.style.setProperty("--ez-my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
        active = true;
        if (!raf) raf = requestAnimationFrame(loop);
      }, { passive: true });
      on(el, "pointerleave", function () {
        mx = 0; my = 0; active = false;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      on(el, "pointerenter", function () { el.classList.add("ez-hover"); });
      on(el, "pointerleave", function () { el.classList.remove("ez-hover"); });
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    teardown();
    initCursor();
    initProgress();
    var scan = initReveal();
    initTransition(scan);
    initMagnetic();
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
