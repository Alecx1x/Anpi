/* Shared navigation for the standalone pages (Guided Learning, Kanji Road, lessons, pilots).
   These live outside index.html and would otherwise lose the app menu. Rather than re-create
   the sidebar, this injects the REAL one: it fetches index.html + style.css (the single source
   of truth) and mounts the actual <aside class="sidebar"> + ☰ toggle inside a Shadow DOM, so it
   looks pixel-identical to the main app yet style.css can't disturb the host page (and the page's
   CSS can't disturb the nav). The sidebar's buttons normally live in app.js, which isn't loaded
   here, so clicks are routed into the app via deep links (/?deck=, /?go=game|tour, /guided-learning).
   Include with: <script defer src="/lib/appnav.js"></script> */
(function () {
  if (document.getElementById("sidebar")) return;            // already in the app itself
  if (/[?&]embed=1/.test(location.search)) return;           // embedded (e.g. profile popover) — no chrome
  var COLLAPSE_KEY = "anpiNavCollapsed", NARROW = 720;

  Promise.all([
    fetch("/").then(function (r) { return r.text(); }),
    fetch("/style.css").then(function (r) { return r.text(); })
  ]).then(function (res) {
    var html = res[0], css = res[1];
    var doc = new DOMParser().parseFromString(html, "text/html");
    var sidebar = doc.getElementById("sidebar");
    var toggle = doc.getElementById("sidebarToggle");
    if (!sidebar || !toggle) return;

    // Host + shadow root → full style isolation in both directions.
    var host = document.createElement("div");
    host.id = "anpiNavHost";
    host.style.cssText = "position:fixed;top:0;left:0;bottom:0;z-index:9000;width:0;overflow:hidden;";
    var sh = host.attachShadow({ mode: "open" });

    // Re-expose the :root custom properties on :host so the shadowed style.css resolves var()s,
    // and neutralise the flex/sticky layout the sidebar normally gets from .app in index.html.
    var rootVars = (css.match(/:root\s*\{([\s\S]*?)\}/) || ["", ""])[1];
    var override =
      ":host{" + rootVars + "}" +
      ".sidebar{position:static;flex:none;width:256px;height:100vh;height:100dvh;transition:none}" +
      ".sidebar.collapsed{width:256px;padding:56px 12px 24px;overflow-y:auto}";  // we drive collapse via the host
    sh.innerHTML = "<style>" + css + "</style><style>" + override + "</style>";
    sh.appendChild(toggle.cloneNode(true));
    sh.appendChild(sidebar.cloneNode(true));
    document.body.appendChild(host);

    // Mobile overlay backdrop.
    var backdrop = document.createElement("div");
    backdrop.style.cssText = "position:fixed;inset:0;z-index:8999;background:rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .2s;";
    document.body.appendChild(backdrop);

    function narrow() { return window.innerWidth <= NARROW; }
    var collapsed, saved = null;
    try { saved = localStorage.getItem(COLLAPSE_KEY); } catch (e) {}
    collapsed = saved === "1" ? true : saved === "0" ? false : narrow();   // open on desktop, closed on mobile

    function apply() {
      var open = !collapsed;
      host.style.transition = "width .25s ease";
      host.style.width = open ? "256px" : "0px";
      document.body.style.marginLeft = (open && !narrow()) ? "256px" : "";
      backdrop.style.opacity = (open && narrow()) ? "1" : "0";
      backdrop.style.pointerEvents = (open && narrow()) ? "auto" : "none";
    }
    function set(v) { collapsed = v; try { localStorage.setItem(COLLAPSE_KEY, v ? "1" : "0"); } catch (e) {} apply(); }
    apply();
    setTimeout(function () { document.body.style.transition = "margin-left .25s ease"; }, 30);
    backdrop.addEventListener("click", function () { set(true); });
    window.addEventListener("resize", apply);

    // The sidebar's real handlers live in app.js (absent here) → translate clicks into deep links.
    sh.addEventListener("click", function (e) {
      if (e.target.closest("#sidebarToggle")) { set(!collapsed); return; }
      var summary = e.target.closest("summary");
      if (summary) return;                                   // let <details> expand/collapse natively
      if (e.target.closest("#sideBrand")) { e.preventDefault(); location.href = "/"; return; }
      if (e.target.closest("#learnNav")) { e.preventDefault(); location.href = "/guided-learning"; return; }
      if (e.target.closest("#tutorialReplay")) { e.preventDefault(); location.href = "/?go=tour"; return; }
      var gameBtn = e.target.closest(".deck[data-game]");
      if (gameBtn) { e.preventDefault(); location.href = "/?go=game"; return; }
      var deckBtn = e.target.closest(".deck[data-deck], .deck[data-sel]");
      if (deckBtn) { e.preventDefault(); location.href = "/?deck=" + (deckBtn.dataset.sel || deckBtn.dataset.deck); return; }
      // real <a href> links (e.g. Kanji Road) navigate natively
    });
  }).catch(function () { /* offline / fetch blocked — no nav, page still works */ });
})();
