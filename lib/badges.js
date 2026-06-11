/* ============================================================
 *  lib/badges.js — Badge / achievement system (OWNED BY THE BADGE AGENT)
 *  ------------------------------------------------------------
 *  This is a self-contained module so multiple agents can work in
 *  parallel without colliding in app.js. It is a LEAF: nothing in
 *  app.js references it, so it loads safely after app.js and self-
 *  initialises on DOMContentLoaded.
 *
 *  Integration points (read these before extending):
 *   - Activity/stats are already tracked in app.js under localStorage
 *     key "anpiStats" (see the "Stats & Achievements" section of app.js:
 *     loadStats()/saveStats(), daily streak, totals). READ that data;
 *     don't duplicate the tracking.
 *   - app.js already renders a basic achievements "flex wall" in the
 *     Stats view. Decide whether to EXTEND that or render badges into a
 *     new container. If you add a container, add it to index.html and
 *     render into it from Badges.renderInto(el).
 *   - Persist unlock state under a NEW key ("anpiBadges") so you never
 *     clobber "anpiStats".
 *
 *  Keep ALL badge logic in this file + a clearly-fenced CSS block at the
 *  END of style.css. Touch app.js only if you must add a single hook —
 *  if so, coordinate (it's a shared file).
 * ============================================================ */
(function () {
  "use strict";

  var STATS_KEY = "anpiStats";   // read-only here (owned by app.js)
  var BADGE_KEY = "anpiBadges";  // this module's own persistence

  function readStats() {
    try { return JSON.parse(localStorage.getItem(STATS_KEY)) || {}; } catch (e) { return {}; }
  }
  function readUnlocked() {
    try { return JSON.parse(localStorage.getItem(BADGE_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveUnlocked(map) {
    try { localStorage.setItem(BADGE_KEY, JSON.stringify(map)); } catch (e) {}
  }

  /* Badge catalogue — extend this. Each badge: { id, name, desc, icon,
     test(stats) -> boolean }. `stats` is the parsed anpiStats object. */
  var BADGES = [
    // Examples to replace/expand:
    // { id: "first-steps", name: "First Steps", desc: "Finish your first study session",
    //   icon: "🌱", test: function (s) { return (s.totalReviews || 0) >= 1; } },
    // { id: "streak-7", name: "Week Warrior", desc: "7-day streak",
    //   icon: "🔥", test: function (s) { return (s.streak || 0) >= 7; } },
  ];

  /* Evaluate the catalogue against current stats; persist + return newly
     unlocked badges (so the caller can show a toast/celebration). */
  function evaluate() {
    var stats = readStats();
    var unlocked = readUnlocked();
    var fresh = [];
    BADGES.forEach(function (b) {
      if (!unlocked[b.id]) {
        var ok = false;
        try { ok = !!b.test(stats); } catch (e) {}
        if (ok) { unlocked[b.id] = Date.now(); fresh.push(b); }
      }
    });
    if (fresh.length) saveUnlocked(unlocked);
    return fresh;
  }

  /* Render all badges (locked + unlocked) into a container element.
     Implement the markup/styles (CSS goes in style.css). */
  function renderInto(el) {
    if (!el) return;
    // TODO (badge agent): build the badge wall here.
  }

  function init() {
    // Safe no-op until the badge agent builds it out.
    // Typical flow: evaluate() after sessions/games, then renderInto(container).
    try { evaluate(); } catch (e) {}
  }

  // Public API
  window.Badges = {
    BADGES: BADGES,
    evaluate: evaluate,
    renderInto: renderInto,
    init: init,
  };

  // Self-init once the DOM + other scripts are ready (no app.js edit needed).
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
