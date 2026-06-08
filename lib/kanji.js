/* lib/kanji.js — KanjiVG stroke-order loader + animator.
 * Loads a character's KanjiVG SVG (local assets first, jsdelivr CDN fallback),
 * rebuilds it as a clean <svg>, and animates each stroke sequentially using
 * stroke-dashoffset. Works for hiragana, katakana and kanji. Exposes a small
 * global `KanjiStrokes` API. No build step / framework required.
 */
window.KanjiStrokes = (function () {
  const cache = {}; // hex -> svg source string (or null if unavailable)
  let loopTimer = null; // handle for the continuous replay loop
  let cycles = 0;       // how many times the current diagram has redrawn (debug/tests)
  const LOOP_PAUSE_MS = 1500; // pause after the last stroke before restarting

  function stop() { clearTimeout(loopTimer); loopTimer = null; }

  function codepoint(ch) {
    // Single Unicode scalar value, lower-case hex, zero-padded to 5 (KanjiVG).
    return ch.codePointAt(0).toString(16).padStart(5, "0");
  }

  // KanjiVG only has glyphs for single characters (yōon like きゃ are 2 chars).
  function isSupported(ch) {
    return !!ch && Array.from(ch).length === 1;
  }

  function injectScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src; s.async = true;
      s.onload = () => resolve(true);
      s.onerror = () => reject(new Error("inject fail " + src));
      document.head.appendChild(s);
    });
  }

  async function fetchSVG(ch) {
    if (!isSupported(ch)) return null;
    const hex = codepoint(ch);
    if (hex in cache) return cache[hex];

    // 1) fetch the local SVG (works when the app is served over http)
    try {
      const r = await fetch("assets/kanjivg/" + hex + ".svg");
      if (r.ok) {
        const txt = await r.text();
        if (txt.indexOf("<svg") !== -1) { cache[hex] = txt; return txt; }
      }
    } catch (_) { /* file:// blocks fetch — fall through */ }

    // 2) fallback for file://: load assets/kanjivg/<hex>.js which sets window.KVG[hex]
    if (!(window.KVG && window.KVG[hex])) {
      try { await injectScript("assets/kanjivg/" + hex + ".js"); } catch (_) {}
    }
    if (window.KVG && window.KVG[hex]) { cache[hex] = window.KVG[hex]; return window.KVG[hex]; }

    // 3) last resort: KanjiVG CDN (works online from any origin)
    try {
      const r = await fetch("https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji/" + hex + ".svg");
      if (r.ok) {
        const txt = await r.text();
        if (txt.indexOf("<svg") !== -1) { cache[hex] = txt; return txt; }
      }
    } catch (_) {}

    cache[hex] = null;
    return null;
  }

  const SVGNS = "http://www.w3.org/2000/svg";

  function animate(paths, speed) {
    speed = speed || 1;
    let delay = 0;
    for (const p of paths) {
      let len = 1;
      try { len = p.getTotalLength() || 1; } catch (_) {}
      const dur = Math.max(0.25, (len / 200) / speed);
      // reset (no transition)
      p.style.transition = "none";
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      p.style.opacity = "1";
      // force reflow so the reset is committed before we animate
      void p.getBoundingClientRect();
      p.style.transition = "stroke-dashoffset " + dur + "s linear";
      p.style.transitionDelay = delay + "s";
      p.style.strokeDashoffset = "0";
      delay += dur + 0.12;
    }
    return delay;
  }

  /* Render the stroke diagram for `ch` into `container` and animate it on a
   * seamless, continuous loop (draw all strokes → pause ~1.5s → restart).
   * No user interaction needed. Returns true if a glyph was found. */
  async function render(container, ch) {
    stop(); // cancel any in-flight loop from a previous card
    container.innerHTML = "";
    const raw = await fetchSVG(ch);
    if (!raw) return false;

    const doc = new DOMParser().parseFromString(raw, "image/svg+xml");
    const src = doc.querySelector("svg");
    if (!src) return false;
    const viewBox = src.getAttribute("viewBox") || "0 0 109 109";
    const srcPaths = Array.from(doc.querySelectorAll("path"));
    if (!srcPaths.length) return false;

    const svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("class", "stroke-svg");

    const myPaths = srcPaths.map((sp, i) => {
      const np = document.createElementNS(SVGNS, "path");
      np.setAttribute("d", sp.getAttribute("d"));
      np.setAttribute("class", "stroke-path");
      np.style.setProperty("--stroke-i", i);
      svg.appendChild(np);
      return np;
    });

    container.appendChild(svg);
    cycles = 0;
    // Loop forever: draw all strokes, pause ~1.5s after the last one, repeat.
    const cycle = () => {
      cycles++;
      const total = animate(myPaths, 1); // seconds to draw every stroke
      loopTimer = setTimeout(cycle, total * 1000 + LOOP_PAUSE_MS);
    };
    // defer one frame so getTotalLength is valid (element is laid out)
    requestAnimationFrame(cycle);
    return true;
  }

  return { render, fetchSVG, codepoint, isSupported, stop, getCycles: () => cycles };
})();
