/* ============================================================
 *  lib/badges.js — Badge / achievement system (OWNED BY THE BADGE AGENT)
 *  ------------------------------------------------------------
 *  Self-contained module. A LEAF: app.js calls it through exactly one
 *  hook in renderStats() (window.Badges.renderInto / .summary); nothing
 *  else references it, so it loads safely after app.js.
 *
 *  Data sources (READ-ONLY — never written here):
 *   - localStorage "anpiStats"  : { days:{YYYY-MM-DD:true}, gamesPlayed,
 *       bestGameScore (string BigInt), bestGameStreak, cardsAnswered,
 *       cardsCorrect } — owned by app.js.
 *   - localStorage "anpiLearn"  : { level, done:{unitId:true} } — lesson
 *       completion, owned by app.js.
 *   - window.CURRICULUM         : { units:[{id,stage}], journey:[{id,region}] }
 *       — used for stage-completion and map-region badges.
 *
 *  This module's OWN persistence: localStorage "anpiBadges" = { id: ts }
 *  (the moment each badge was first unlocked). Used to show earned dates
 *  and to detect *newly* earned badges for a toast.
 *
 *  All badge logic lives here + a fenced CSS block at the END of style.css.
 * ============================================================ */
(function () {
  "use strict";

  var STATS_KEY = "anpiStats";   // read-only (owned by app.js)
  var LEARN_KEY = "anpiLearn";   // read-only (owned by app.js)
  var BADGE_KEY = "anpiBadges";  // this module's own persistence

  /* ---- storage readers ---- */
  function readStats() {
    try { return JSON.parse(localStorage.getItem(STATS_KEY)) || {}; } catch (e) { return {}; }
  }
  function readLearn() {
    try { return JSON.parse(localStorage.getItem(LEARN_KEY)) || {}; } catch (e) { return {}; }
  }
  function readUnlocked() {
    try { return JSON.parse(localStorage.getItem(BADGE_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveUnlocked(map) {
    try { localStorage.setItem(BADGE_KEY, JSON.stringify(map)); } catch (e) {}
  }
  function badgesSeeded() {
    try { return localStorage.getItem(BADGE_KEY) !== null; } catch (e) { return true; }
  }

  /* ---- curriculum accessors (guarded — curriculum.js may be absent) ---- */
  function curUnits()   { return (window.CURRICULUM && window.CURRICULUM.units)   || []; }
  function curJourney() { return (window.CURRICULUM && window.CURRICULUM.journey) || []; }

  /* ---- date / streak helpers (mirror app.js exactly; read-only) ---- */
  function dayStr(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function todayStr() { return dayStr(new Date()); }
  function prevDay(str) {
    var p = str.split("-").map(Number);
    var dt = new Date(p[0], p[1] - 1, p[2]);
    dt.setDate(dt.getDate() - 1);
    return dayStr(dt);
  }
  function currentStreak(s) {
    var days = (s && s.days) || {};
    var n = 0, d = todayStr();
    if (!days[d]) d = prevDay(d);          // today not logged yet → count through yesterday
    while (days[d]) { n++; d = prevDay(d); }
    return n;
  }
  function longestStreak(s) {
    var keys = Object.keys((s && s.days) || {}).sort();
    var best = 0, cur = 0, prev = null;
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      cur = (prev && prevDay(k) === prev) ? cur + 1 : 1;
      if (cur > best) best = cur;
      prev = k;
    }
    return best;
  }

  /* BigInt-safe ">=" for the game-score tiers (bestGameScore is a string). */
  function scoreAtLeast(str, threshold) {
    try { return BigInt(str || 0) >= threshold; } catch (e) { return false; }
  }

  /* ------------------------------------------------------------------
   *  Context — computed ONCE per evaluate/render, then handed to every
   *  badge test() so tests stay cheap and declarative.
   * ------------------------------------------------------------------ */
  // Stage display strings, ordered Foundations → N1 (must match curriculum.js).
  var STAGES = [
    { key: "Foundations",          icon: "🪜", label: "Foundations" },
    { key: "Beginner · N5",        icon: "🟢", label: "N5" },
    { key: "Elementary · N4",      icon: "🔵", label: "N4" },
    { key: "Intermediate · N3",    icon: "🟡", label: "N3" },
    { key: "Upper-Intermediate · N2", icon: "🟠", label: "N2" },
    { key: "Advanced · N1",        icon: "🔴", label: "N1" },
  ];
  // Map regions, ordered south → north (must match curriculum.js journey).
  var REGIONS = [
    { key: "Okinawa",  icon: "🏝️" },
    { key: "Kyūshū",   icon: "⛩️" },
    { key: "Shikoku",  icon: "🍊" },
    { key: "Chūgoku",  icon: "⛰️" },
    { key: "Kansai",   icon: "🏯" },
    { key: "Chūbu",    icon: "🗻" },
    { key: "Kantō",    icon: "🗼" },
    { key: "Tōhoku",   icon: "🌾" },
    { key: "Hokkaidō", icon: "❄️" },
  ];

  function buildContext() {
    var stats = readStats();
    var learn = readLearn();
    var done = learn.done || {};

    var units = curUnits();
    var doneCount = 0;
    for (var id in done) { if (done[id] && Object.prototype.hasOwnProperty.call(done, id)) doneCount++; }

    // Stage completion: every unit of a stage is done (and the stage has units).
    var stageTotals = {}, stageDoneN = {};
    units.forEach(function (u) {
      stageTotals[u.stage] = (stageTotals[u.stage] || 0) + 1;
      if (done[u.id]) stageDoneN[u.stage] = (stageDoneN[u.stage] || 0) + 1;
    });
    var stagesDone = {};
    STAGES.forEach(function (st) {
      stagesDone[st.key] = (stageTotals[st.key] || 0) > 0 && stageDoneN[st.key] === stageTotals[st.key];
    });

    // Region reached: ≥1 done lesson whose journey.region matches.
    var regionsReached = {};
    curJourney().forEach(function (j) { if (done[j.id]) regionsReached[j.region] = true; });

    var totalUnits = units.length;

    return {
      streak: Math.max(currentStreak(stats), longestStreak(stats)),
      gamesPlayed: stats.gamesPlayed || 0,
      bestGameStreak: stats.bestGameStreak || 0,
      bestGameScore: stats.bestGameScore || "0",
      doneCount: doneCount,
      stagesDone: stagesDone,
      regionsReached: regionsReached,
      journeyComplete: totalUnits > 0 && doneCount >= totalUnits,
      nonMetaEarned: 0, // filled in during the two-pass evaluate
    };
  }

  /* ------------------------------------------------------------------
   *  Catalogue. Each badge: { id, cat, icon, name, desc, test(ctx) }.
   *  `desc` doubles as the unlock condition shown on locked badges.
   *  Categories render in this order; `meta` tests read ctx.nonMetaEarned.
   * ------------------------------------------------------------------ */
  function stageBadges() {
    return STAGES.map(function (st) {
      return {
        id: "stage-" + st.label.toLowerCase().replace(/[^a-z0-9]/g, ""),
        cat: "stages", icon: st.icon,
        name: st.label + " Cleared",
        desc: "Finish every lesson in " + st.label,
        test: function (c) { return !!c.stagesDone[st.key]; },
      };
    });
  }
  function regionBadges() {
    return REGIONS.map(function (r) {
      return {
        id: "region-" + r.key.toLowerCase().replace(/[^a-z0-9]/g, ""),
        cat: "regions", icon: r.icon,
        name: r.key,
        desc: "Reach " + r.key + " on the journey map",
        test: function (c) { return !!c.regionsReached[r.key]; },
      };
    });
  }

  // Flat catalogue, in render order. stageBadges()/regionBadges() are spread
  // inline so adding a badge near a boundary is unambiguous.
  var BADGES = [
    /* Onboarding */
    { id: "first-lesson", cat: "onboarding", icon: "🌱", name: "First Step",
      desc: "Complete your first lesson", test: function (c) { return c.doneCount >= 1; } },
    { id: "first-game", cat: "onboarding", icon: "🚀", name: "Liftoff",
      desc: "Play your first game", test: function (c) { return c.gamesPlayed >= 1; } },

    /* Streak */
    { id: "streak3",   cat: "streak", icon: "🔥",  name: "On Fire",       desc: "3-day streak",   test: function (c) { return c.streak >= 3; } },
    { id: "streak7",   cat: "streak", icon: "🔥",  name: "Week Warrior",  desc: "7-day streak",   test: function (c) { return c.streak >= 7; } },
    { id: "streak14",  cat: "streak", icon: "🔥",  name: "Fortnight",     desc: "14-day streak",  test: function (c) { return c.streak >= 14; } },
    { id: "streak30",  cat: "streak", icon: "📅",  name: "Devoted",       desc: "30-day streak",  test: function (c) { return c.streak >= 30; } },
    { id: "streak100", cat: "streak", icon: "💯",  name: "Centurion",     desc: "100-day streak", test: function (c) { return c.streak >= 100; } },

    /* Lessons (counts) */
    { id: "lessons5",   cat: "lessons", icon: "📗", name: "Getting Started", desc: "Finish 5 lessons",   test: function (c) { return c.doneCount >= 5; } },
    { id: "lessons10",  cat: "lessons", icon: "📘", name: "Studious",        desc: "Finish 10 lessons",  test: function (c) { return c.doneCount >= 10; } },
    { id: "lessons25",  cat: "lessons", icon: "📚", name: "Bookworm",        desc: "Finish 25 lessons",  test: function (c) { return c.doneCount >= 25; } },
    { id: "lessons50",  cat: "lessons", icon: "📖", name: "Dedicated",       desc: "Finish 50 lessons",  test: function (c) { return c.doneCount >= 50; } },
    { id: "lessons100", cat: "lessons", icon: "🧠", name: "Scholar",         desc: "Finish 100 lessons", test: function (c) { return c.doneCount >= 100; } },

    /* Stage completion (6) + journey complete */
    ...stageBadges(),
    { id: "journey-complete", cat: "stages", icon: "🏁", name: "Reached Hokkaidō",
      desc: "Complete every lesson in the journey", test: function (c) { return c.journeyComplete; } },

    /* Map regions (9) */
    ...regionBadges(),

    /* Game */
    { id: "games10",   cat: "game", icon: "🎮", name: "Gamer",          desc: "Play 10 games",         test: function (c) { return c.gamesPlayed >= 10; } },
    { id: "games50",   cat: "game", icon: "👾", name: "Arcade Regular", desc: "Play 50 games",         test: function (c) { return c.gamesPlayed >= 50; } },
    { id: "games100",  cat: "game", icon: "🕹️", name: "Arcade Legend",  desc: "Play 100 games",        test: function (c) { return c.gamesPlayed >= 100; } },
    { id: "combo50",   cat: "game", icon: "⚡", name: "Combo Master",   desc: "50× streak in a game",  test: function (c) { return c.bestGameStreak >= 50; } },
    { id: "combo100",  cat: "game", icon: "💥", name: "Unstoppable",    desc: "100× streak in a game", test: function (c) { return c.bestGameStreak >= 100; } },
    { id: "score100k", cat: "game", icon: "✨", name: "Sharpshooter",   desc: "Score 100K in a game",  test: function (c) { return scoreAtLeast(c.bestGameScore, 100000n); } },
    { id: "score500k", cat: "game", icon: "🌟", name: "High Roller",    desc: "Score 500K in a game",  test: function (c) { return scoreAtLeast(c.bestGameScore, 500000n); } },
    { id: "score1m",   cat: "game", icon: "💎", name: "Millionaire",    desc: "Score 1M in a game",    test: function (c) { return scoreAtLeast(c.bestGameScore, 1000000n); } },
    { id: "score10m",  cat: "game", icon: "👑", name: "Ten-Million Club", desc: "Score 10M in a game", test: function (c) { return scoreAtLeast(c.bestGameScore, 10000000n); } },

    /* Meta (read ctx.nonMetaEarned) */
    { id: "meta10", cat: "meta", icon: "🏅", name: "Collector",  desc: "Earn 10 badges", test: function (c) { return c.nonMetaEarned >= 10; } },
    { id: "meta25", cat: "meta", icon: "🏆", name: "Completionist", desc: "Earn 25 badges", test: function (c) { return c.nonMetaEarned >= 25; } },
  ];

  var BY_ID = {};
  BADGES.forEach(function (b) { BY_ID[b.id] = b; });

  // Category display order + headers.
  var CATS = [
    { key: "onboarding", icon: "🌱", label: "Getting Started" },
    { key: "streak",     icon: "🔥", label: "Streaks" },
    { key: "lessons",    icon: "📚", label: "Lessons" },
    { key: "stages",     icon: "🎓", label: "Stages & Journey" },
    { key: "regions",    icon: "🗾", label: "Regions of Japan" },
    { key: "game",       icon: "🎮", label: "Arcade" },
    { key: "meta",       icon: "🏅", label: "Milestones" },
  ];

  /* ------------------------------------------------------------------
   *  Evaluation. Two passes so meta badges can count the others.
   *  Returns the set of currently-earned ids + the context used.
   * ------------------------------------------------------------------ */
  // Cache the earned-set computation keyed on the raw inputs (anpiStats +
  // anpiLearn). A single Stats-view render triggers computeEarned() up to 3×
  // (summary() + evaluate() + renderInto's display pass); the cache collapses
  // those to one full pass, and auto-invalidates the moment the underlying
  // stats/lesson state changes. CURRICULUM is static; anpiBadges only affects
  // unlock dates (not the earned set), so neither is part of the key.
  var _cache = null, _cacheKey = null;
  function inputKey() {
    var a, b;
    try { a = localStorage.getItem(STATS_KEY); } catch (e) { a = null; }
    try { b = localStorage.getItem(LEARN_KEY); } catch (e) { b = null; }
    return (a || "") + " " + (b || "");
  }
  function computeEarned() {
    var key = inputKey();
    if (_cache && _cacheKey === key) return _cache;
    var ctx = buildContext();
    var earned = {};
    BADGES.forEach(function (b) {
      if (b.cat === "meta") return;
      var ok = false;
      try { ok = !!b.test(ctx); } catch (e) {}
      if (ok) earned[b.id] = true;
    });
    ctx.nonMetaEarned = Object.keys(earned).length;
    BADGES.forEach(function (b) {
      if (b.cat !== "meta") return;
      var ok = false;
      try { ok = !!b.test(ctx); } catch (e) {}
      if (ok) earned[b.id] = true;
    });
    _cache = { earned: earned, ctx: ctx };
    _cacheKey = key;
    return _cache;
  }

  /* Persist unlocks; return badges newly earned since last call (for a
     toast). On the very first run (no anpiBadges key yet) we seed silently
     so existing progress doesn't trigger a flood of toasts. */
  function evaluate() {
    var seeded = badgesSeeded();
    var earned = computeEarned().earned;
    var unlocked = readUnlocked();
    var now = Date.now();
    var fresh = [];
    Object.keys(earned).forEach(function (id) {
      if (!unlocked[id]) {
        unlocked[id] = now;
        if (seeded) fresh.push(BY_ID[id]);
      }
    });
    saveUnlocked(unlocked);
    return fresh;
  }

  /* "earned/total" for the Stats BADGES tile. */
  function summary() {
    var earned = computeEarned().earned;
    return Object.keys(earned).length + "/" + BADGES.length;
  }

  /* ---- rendering ---- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmtDate(ts) {
    try {
      var d = new Date(ts);
      return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch (e) { return ""; }
  }

  function renderInto(el) {
    if (!el) return;
    var fresh = evaluate();                 // persist + detect new unlocks
    var earned = computeEarned().earned;
    var unlocked = readUnlocked();
    var earnedTotal = Object.keys(earned).length;

    var html =
      '<div class="bw">' +
        '<div class="bw-head">' +
          '<div class="bw-title">🏅 BADGES</div>' +
          '<div class="bw-count"><b>' + earnedTotal + '</b> of ' + BADGES.length + ' earned</div>' +
        '</div>';

    CATS.forEach(function (cat) {
      var inCat = BADGES.filter(function (b) { return b.cat === cat.key; });
      if (!inCat.length) return;
      var gotN = inCat.filter(function (b) { return earned[b.id]; }).length;
      html +=
        '<section class="bw-cat">' +
          '<div class="bw-cat-head">' +
            '<span class="bw-cat-ico">' + cat.icon + '</span>' +
            '<span class="bw-cat-name">' + esc(cat.label) + '</span>' +
            '<span class="bw-cat-tally">' + gotN + '/' + inCat.length + '</span>' +
          '</div>' +
          '<div class="bw-grid">';
      inCat.forEach(function (b) {
        var got = !!earned[b.id];
        var when = got && unlocked[b.id] ? fmtDate(unlocked[b.id]) : "";
        var aria = got ? (b.name + " — earned" + (when ? " " + when : "")) : (b.name + " — locked: " + b.desc);
        html +=
          '<div class="bw-badge ' + (got ? "is-earned" : "is-locked") + '" role="listitem" aria-label="' + esc(aria) + '">' +
            '<div class="bw-ico">' + b.icon + '</div>' +
            '<div class="bw-name">' + esc(b.name) + '</div>' +
            '<div class="bw-desc">' + esc(got ? ("Earned" + (when ? " · " + when : "")) : b.desc) + '</div>' +
            (got ? '<div class="bw-check" aria-hidden="true">✓</div>' : '') +
          '</div>';
      });
      html += '</div></section>';
    });

    html += '</div>';
    el.innerHTML = html;

    if (fresh.length) showToast(fresh);
  }

  /* Subtle "new badge!" toast. Respects prefers-reduced-motion via CSS. */
  function showToast(fresh) {
    try {
      var host = document.getElementById("bwToast");
      if (!host) {
        host = document.createElement("div");
        host.id = "bwToast";
        document.body.appendChild(host);
      }
      var shown = fresh.slice(0, 4);
      var more = fresh.length - shown.length;
      var card = document.createElement("div");
      card.className = "bw-toast";
      card.setAttribute("role", "status");
      card.innerHTML =
        '<div class="bw-toast-hd">🎉 NEW BADGE' + (fresh.length > 1 ? "S" : "") + "!</div>" +
        shown.map(function (b) {
          return '<div class="bw-toast-row"><span class="bw-toast-ico">' + b.icon + '</span><span>' + esc(b.name) + '</span></div>';
        }).join("") +
        (more > 0 ? '<div class="bw-toast-more">+' + more + ' more</div>' : "");
      host.appendChild(card);
      // force reflow then animate in
      void card.offsetWidth;
      card.classList.add("show");
      setTimeout(function () {
        card.classList.remove("show");
        setTimeout(function () { if (card.parentNode) card.parentNode.removeChild(card); }, 400);
      }, 4200);
    } catch (e) {}
  }

  function init() {
    // Seed/refresh unlock history at load so progress made before this
    // feature shipped is recorded silently (no toast flood on first view).
    try { evaluate(); } catch (e) {}
  }

  // Public API (app.js hooks renderInto + summary from renderStats()).
  window.Badges = {
    BADGES: BADGES,
    evaluate: evaluate,
    summary: summary,
    renderInto: renderInto,
    init: init,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
