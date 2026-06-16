/* Character in the PROFILE. The user's 3D character lives inside the existing profile/account button —
   not a separate button. On the main app there's a real account modal (.auth-modal, shown by #accountBtn,
   displays user info + podium badges); we fold the rotatable character into the TOP of that modal. On the
   standalone pages (no account modal exists there) we provide a single profile button whose popover holds
   the same character, plus a link into the app for the full profile. The model is the real /character page
   in an isolated iframe (/character?embed=1), lazy-loaded on first reveal. Drag the figure to rotate.
   Include with: <script defer src="/lib/profile-widget.js"></script> */
(function () {
  if (window.__anpiProfile) return; window.__anpiProfile = true;
  if (/[?&]embed=1/.test(location.search)) return;   // don't run inside the embedded model itself

  function styles() {
    var css = document.createElement("style");
    css.textContent = [
      // shared character block (used both inside the account modal and the standalone popover)
      ".apc-wrap{margin:0 0 14px}",
      ".apc-stage{width:100%;height:230px;border-radius:14px;overflow:hidden;",
        "background:radial-gradient(420px 320px at 50% 8%,#2c1f5e,#140f28 60%,#0b0916)}",
      ".apc-stage iframe{width:100%;height:100%;border:0;display:block}",
      ".apc-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px}",
      ".apc-xp{font:800 1.05rem/1 ui-monospace,monospace;color:#ffe14d;background:#ffe14d14;",
        "border:1px solid #ffe14d44;border-radius:11px;padding:8px 14px;white-space:nowrap}",
      ".apc-open{text-decoration:none;font-weight:800;font-size:.82rem;color:#e7ddff;background:#2a1f47;",
        "border:1px solid #b98bff66;border-radius:999px;padding:5px 12px}",
      ".apc-open:hover{background:#36285c;border-color:#b98bff}",
      ".apc-hint{color:#8a82ad;font-size:.72rem;text-align:center;margin:6px 0 0}",
      // standalone-only profile button (styled like the app's account button) + its popover
      "#anpiProfileFixed{position:fixed;top:12px;right:12px;z-index:99998}",
      "#anpiProfileBtn{height:40px;min-width:40px;padding:0 12px;display:inline-flex;align-items:center;",
        "gap:6px;font:600 .9rem/1 system-ui,-apple-system,'Segoe UI',sans-serif;border-radius:10px;",
        "background:#1c2138;border:1px solid #3a4166;color:#eef1ff;cursor:pointer}",
      "#anpiProfileBtn:hover{border-color:#7c9cff}",
      "#anpiProfilePanel{position:fixed;z-index:99999;width:300px;max-width:94vw;background:#171430;",
        "border:1px solid #ffffff22;border-radius:16px;box-shadow:0 18px 50px #000a;color:#ece9f6;",
        "font:14px/1.5 system-ui,-apple-system,'Segoe UI',sans-serif;padding:12px}",
      "#anpiProfilePanel[hidden]{display:none}",
      "#anpiProfilePanel .app-hd{display:flex;align-items:center;justify-content:space-between;font-weight:800;margin-bottom:10px}",
      "#anpiProfilePanel .app-x{background:none;border:0;color:#b8b0d8;font-size:1rem;cursor:pointer;padding:2px 6px;border-radius:8px}",
      "#anpiProfilePanel .app-x:hover{background:#ffffff14;color:#fff}"
    ].join("");
    document.head.appendChild(css);
  }

  function charBlock(openLabel, openHref) {
    var wrap = document.createElement("div");
    wrap.className = "apc-wrap";
    wrap.innerHTML =
      '<div class="apc-stage"><iframe title="Your character (drag to rotate)" data-src="/character?embed=1"></iframe></div>' +
      '<div class="apc-row"><span class="apc-xp">✦ … XP</span>' +
        '<a class="apc-open" href="' + openHref + '">' + openLabel + '</a></div>' +
      '<div class="apc-hint">drag the figure to spin it</div>';
    return wrap;
  }
  function reveal(wrap) {
    var f = wrap.querySelector("iframe"); if (f && !f.src) f.src = f.dataset.src;   // lazy-load the 3D model
    try { var xp = (JSON.parse(localStorage.getItem("anpiLearn") || "{}").xp) || 0;
      var el = wrap.querySelector(".apc-xp"); if (el) el.textContent = "✦ " + xp.toLocaleString() + " XP"; } catch (e) {}
  }

  function init() {
    styles();
    var modal = document.querySelector(".auth-modal");

    if (modal) {
      // ---- MAIN APP: fold the character into the existing profile/account modal (no extra button) ----
      var block = charBlock("Customize →", "/character");
      var title = modal.querySelector("#authTitle");
      if (title) title.insertAdjacentElement("afterend", block); else modal.insertBefore(block, modal.firstChild);
      // Lazy-load the model the first time the modal is opened (and refresh XP each open).
      var ov = document.getElementById("authOverlay");
      if (ov) new MutationObserver(function () { if (ov.classList.contains("show")) reveal(block); })
        .observe(ov, { attributes: true, attributeFilter: ["class"] });
      return;
    }

    // ---- STANDALONE PAGES: one profile button → popover holding the character ----
    var fx = document.createElement("div"); fx.id = "anpiProfileFixed";
    var btn = document.createElement("button");
    btn.id = "anpiProfileBtn"; btn.type = "button"; btn.title = "Your profile & character";
    btn.setAttribute("aria-label", "Your profile and character");
    btn.textContent = "👤";   // 👤
    fx.appendChild(btn); document.body.appendChild(fx);

    var panel = document.createElement("div"); panel.id = "anpiProfilePanel"; panel.hidden = true;
    panel.innerHTML = '<div class="app-hd"><span>👤 Your profile</span><button class="app-x" type="button" title="Close">✕</button></div>';
    var block2 = charBlock("Open full profile →", "/?account=1");   // opens the app AND auto-opens the profile/account modal
    panel.appendChild(block2);
    document.body.appendChild(panel);

    function place() {
      var r = btn.getBoundingClientRect();
      panel.style.top = Math.min(r.bottom + 8, window.innerHeight - panel.offsetHeight - 8) + "px";
      var w = panel.offsetWidth;
      panel.style.left = Math.max(8, Math.min(r.right - w, window.innerWidth - w - 8)) + "px";
    }
    function open() { reveal(block2); panel.hidden = false; place(); window.addEventListener("resize", onResize); }
    function close() { panel.hidden = true; window.removeEventListener("resize", onResize); }
    function onResize() { if (!panel.hidden) place(); }

    // NO auto-close paths at all: the button only OPENS (never toggles), there is no outside-click
    // close. The panel can ONLY be dismissed by the ✕ button or the Escape key. This makes it
    // impossible for any touch "ghost click" / stray event to dismiss it on the opening tap.
    btn.addEventListener("click", function (e) { e.stopPropagation(); if (panel.hidden) open(); });
    panel.querySelector(".app-x").addEventListener("click", function (e) { e.stopPropagation(); close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) close(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
