/* lib/supabase-sync.js — optional Supabase auth + cross-device sync.
 *
 * This layer is fully ADDITIVE. When the user is signed out (or Supabase is
 * unreachable for any reason) the app behaves EXACTLY as before, backed by
 * localStorage. When signed in, study session reports, game high scores and
 * per-card progress are mirrored to Supabase so they sync across devices.
 *
 * Design notes:
 *  - We never make the app's synchronous storage functions async. Instead we
 *    (a) hydrate localStorage from the cloud once on sign-in, so existing
 *    synchronous reads (getHigh / loadResults) transparently see merged data,
 *    and (b) write-through to the cloud (fire-and-forget) on every save.
 *  - Every network call is wrapped so a failure silently falls back to the
 *    local-only behaviour. Nothing here can break the guest experience.
 *  - Only the publishable key is used. No secret key is present in the client.
 */
(function () {
  "use strict";

  var SUPABASE_URL = "https://sgmsiythssuwgzwcyjti.supabase.co";
  var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnbXNpeXRoc3N1d2d6d2N5anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NTQzMDAsImV4cCI6MjA5NjMzMDMwMH0.SSlKQuhEVynDjfX7UMfK0JuFUPRREK7A_UacFi0p3Kw";

  // Create the client only if the CDN script loaded (offline / file:// without
  // internet → sb stays null → app runs in pure guest mode).
  var sb = null;
  try {
    if (window.supabase && typeof window.supabase.createClient === "function") {
      sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
  } catch (e) { sb = null; }

  var user = null;          // current auth user, or null for guests
  var profileName = null;   // profiles.username (falls back to email)
  var displayName = null;   // profiles.display_name (public leaderboard name)
  var pendingMigration = null;
  var lastPush = Promise.resolve(); // promise of the most recent high-score push
  var lastPushOk = true;            // did that push succeed? (false → DB not set up)

  var REPORTS_KEY = "kanaFlashcardResults";  // matches app.js STORE_KEY
  var HIGH_PREFIX = "kanaGameHigh_";          // matches app.js highKey()

  function $(id) { return document.getElementById(id); }
  function noop() {}
  function ready() { return !!(sb && user); }
  function toBig(v) { try { return BigInt(v || "0"); } catch (e) { return 0n; } }

  // --- Input hardening for cloud writes -------------------------------------
  // Everything written below is the user's OWN data (RLS scopes writes to their
  // row), but we still validate before sending. Most important: score must be
  // digits-only, because the leaderboard RPCs sort by score::numeric across ALL
  // users -- a single non-numeric value would error that query for everyone.
  // Bounding the other string/int fields stops a tampered client from storing
  // unbounded junk in its row.
  function clampStr(v, n) { return String(v == null ? "" : v).slice(0, n); }
  function digitsOnly(v, n) { var s = String(v == null ? "" : v).replace(/\D/g, "").slice(0, n); return s || "0"; }
  function clampInt(v) { var n = parseInt(v, 10); if (!isFinite(n) || n < 0) n = 0; return Math.min(n, 1e9); }

  // ==========================================================================
  // Public hooks — invoked by the app (write-through, fire-and-forget).
  // ==========================================================================
  var KanaSync = {
    isReady: ready,
    currentUser: function () { return user; },
    // Global leaderboards (read works for guests too; writes need sign-in).
    fetchLeaderboard: function (deckKey, diff, limit) { return fetchLeaderboard(deckKey, diff, limit); },
    fetchMyRank: function (deckKey, diff) { return fetchMyRank(deckKey, diff); },
    fetchGlobalLeaderboard: function (diff, deck, limit) { return fetchGlobalLeaderboard(diff, deck, limit); },
    fetchMyPodiums: function () { return fetchMyPodiums(); },
    flush: function () { return lastPush; },     // awaitable: resolves when the latest score push finishes
    scoreSaved: function () { return lastPushOk; }, // false if the last push failed (e.g. DB not set up)
    onHighScore: function (deckKey, mode, value, streak) {
      if (!ready()) return;
      lastPush = pushHighScore(deckKey, mode, String(value), streak);
    },
    onReport: function (record) {
      if (!ready()) return;
      pushReport(record).catch(noop);
    },
    onDeckComplete: function (deckId, cards) {
      if (!ready()) return;
      pushProgress(deckId, cards).catch(noop);
    }
  };
  window.KanaSync = KanaSync;

  // ==========================================================================
  // Cloud writers
  // ==========================================================================
  async function pushHighScore(deckKey, mode, value, streak) {
    if (!ready()) return;
    var streakN = clampInt(streak);
    var scoreStr = digitsOnly(value, 30); // digits only -> safe for score::numeric
    var deckId = clampStr(deckKey, 64);
    var diff = clampStr(mode, 32);
    try {
      var res = await sb.from("high_scores")
        .select("id,score")
        .eq("user_id", user.id).eq("deck_id", deckId).eq("difficulty", diff)
        .limit(1);
      if (res.error) throw res.error;
      var row = res.data && res.data[0];
      if (row) {
        if (toBig(scoreStr) > toBig(row.score)) {
          var u = await sb.from("high_scores")
            .update({ score: scoreStr, best_streak: streakN, achieved_at: new Date().toISOString() })
            .eq("id", row.id);
          if (u.error) throw u.error;
        }
      } else {
        var ins = await sb.from("high_scores").insert({
          user_id: user.id, deck_id: deckId, difficulty: diff, score: scoreStr, best_streak: streakN
        });
        if (ins.error) throw ins.error;
      }
      lastPushOk = true;
    } catch (e) { lastPushOk = false; } // e.g. high_scores table not set up yet
  }

  async function pushReport(record) {
    if (!ready() || !record) return;
    try {
      var total = clampInt(record.total);
      var correct = Math.min(clampInt(record.correct), total);
      await sb.from("reports").insert({
        user_id: user.id,
        deck_id: clampStr(record.deck, 64),
        total_cards: total,
        correct_count: correct,
        incorrect_count: Math.max(0, total - correct),
        report_data: record
      });
    } catch (e) { /* silent */ }
  }

  async function pushProgress(deckId, cards) {
    if (!ready() || !cards || !cards.length) return;
    deckId = clampStr(deckId, 64);
    try {
      var res = await sb.from("progress")
        .select("id,card_id,correct_count,incorrect_count")
        .eq("user_id", user.id).eq("deck_id", deckId);
      var existing = {};
      (res.data || []).forEach(function (r) { existing[r.card_id] = r; });

      var inserts = [], updates = [];
      cards.forEach(function (c) {
        if (!c || c.correct == null) return; // unanswered/skipped card
        var ok = c.correct ? 1 : 0;
        var bad = c.correct ? 0 : 1;
        var cid = clampStr(c.id, 128);
        var row = existing[cid];
        if (row) {
          updates.push({
            id: row.id,
            correct_count: (row.correct_count || 0) + ok,
            incorrect_count: (row.incorrect_count || 0) + bad
          });
        } else {
          inserts.push({
            user_id: user.id, deck_id: deckId, card_id: cid,
            correct_count: ok, incorrect_count: bad
          });
        }
      });

      if (inserts.length) await sb.from("progress").insert(inserts);
      for (var i = 0; i < updates.length; i++) {
        var u = updates[i];
        await sb.from("progress").update({
          correct_count: u.correct_count,
          incorrect_count: u.incorrect_count,
          last_studied: new Date().toISOString()
        }).eq("id", u.id);
      }
    } catch (e) { /* silent */ }
  }

  // ==========================================================================
  // Hydration — pull cloud data into localStorage after sign-in so the app's
  // existing synchronous reads see the merged result.
  // ==========================================================================
  async function hydrateFromCloud() {
    if (!ready()) return;
    // High scores: keep the larger of local vs cloud, per deck + difficulty.
    try {
      var hs = await sb.from("high_scores")
        .select("deck_id,difficulty,score").eq("user_id", user.id);
      (hs.data || []).forEach(function (r) {
        var key = HIGH_PREFIX + r.deck_id + "_" + r.difficulty;
        if (toBig(r.score) > toBig(localStorage.getItem(key))) {
          try { localStorage.setItem(key, toBig(r.score).toString()); } catch (e) {}
        }
      });
    } catch (e) { /* silent */ }

    // Reports: merge cloud + local, de-duplicate, write back locally.
    try {
      var rep = await sb.from("reports")
        .select("report_data,session_date").eq("user_id", user.id)
        .order("session_date", { ascending: true });
      var cloud = (rep.data || []).map(function (r) { return r.report_data; }).filter(Boolean);
      var merged = dedupeReports(readLocalReports().concat(cloud));
      try { localStorage.setItem(REPORTS_KEY, JSON.stringify(merged)); } catch (e) {}
    } catch (e) { /* silent */ }
  }

  function readLocalReports() {
    try { return JSON.parse(localStorage.getItem(REPORTS_KEY) || "[]"); }
    catch (e) { return []; }
  }
  function dedupeReports(list) {
    var seen = {}, out = [];
    list.forEach(function (r) {
      if (!r) return;
      var k = [r.date || "", r.deck || "", r.correct || 0, r.total || 0].join("|");
      if (seen[k]) return;
      seen[k] = 1;
      out.push(r);
    });
    return out;
  }

  // ==========================================================================
  // Migration — push guest data captured BEFORE hydration into the account.
  // ==========================================================================
  function snapshotLocal() {
    var highs = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (!key || key.indexOf(HIGH_PREFIX) !== 0) continue;
        var rest = key.slice(HIGH_PREFIX.length);
        var us = rest.lastIndexOf("_");
        if (us < 0) continue;
        highs.push({
          deckId: rest.slice(0, us),
          difficulty: rest.slice(us + 1),
          score: localStorage.getItem(key) || "0"
        });
      }
    } catch (e) {}
    return { reports: readLocalReports(), highs: highs };
  }

  function hasLocalData() {
    var s = snapshotLocal();
    return s.reports.length > 0 || s.highs.length > 0;
  }

  async function runMigration() {
    var snap = pendingMigration;
    pendingMigration = null;
    if (!snap || !ready()) { hideMigratePrompt(); return; }
    setMsg("Migrating your progress…");
    try {
      for (var i = 0; i < snap.highs.length; i++) {
        await pushHighScore(snap.highs[i].deckId, snap.highs[i].difficulty, snap.highs[i].score);
      }
      for (var j = 0; j < snap.reports.length; j++) {
        await pushReport(snap.reports[j]);
      }
      setMsg("Migrated! Your guest progress is now saved to your account.", false);
    } catch (e) {
      setMsg("Some items couldn't be migrated, but you're signed in.", true);
    }
    hideMigratePrompt();
    setTimeout(closeModal, 1200);
  }

  // ==========================================================================
  // Auth flows
  // ==========================================================================
  async function fetchProfileName() {
    if (!ready()) return;
    try {
      // select("*") so this still works if the leaderboard column isn't added yet.
      var r = await sb.from("profiles").select("*").eq("id", user.id).limit(1);
      var row = r.data && r.data[0];
      if (row) {
        if (row.username) profileName = row.username;
        displayName = row.display_name || "";
        var inp = $("authDisplayName"); if (inp) inp.value = displayName;
        renderAuthState();
      }
    } catch (e) {}
  }

  async function saveDisplayName() {
    if (!ready()) { setMsg("Sign in first to set a username.", true); return; }
    var inp = $("authDisplayName"); if (!inp) return;
    // display_name is shown publicly on leaderboards. Strip angle brackets and
    // control chars so it can't carry markup -- defense in depth in case a
    // renderer ever interpolates it without escaping (the real fix is to escape
    // on output, but usernames never legitimately need < > either).
    var name = (inp.value || "").replace(/[<>\u0000-\u001F\u007F]/g, "").trim().slice(0, 24);
    setMsg("Saving username…");
    try {
      // upsert so it works even if this user has no profiles row yet.
      var r = await sb.from("profiles").upsert({ id: user.id, display_name: name }, { onConflict: "id" });
      if (r.error) {
        var m = r.error.message || "";
        if (/schema cache|does not exist|find the table/i.test(m)) {
          m = "The accounts database isn't set up yet — run supabase-schema.sql in Supabase, then try again.";
        }
        setMsg(m, true); return;
      }
      displayName = name;
      setMsg(name ? "Username saved!" : "Username cleared.", false);
    } catch (e) { setMsg("Couldn't save your username right now.", true); }
  }

  // Top scores for a deck + difficulty across all users (guests can read too).
  async function fetchLeaderboard(deckKey, diff, limit) {
    if (!sb) return null;
    try {
      var r = await sb.rpc("get_leaderboard", { p_deck: String(deckKey), p_diff: String(diff), p_limit: limit || 10 });
      if (r.error) return null;
      return (r.data || []).map(function (row) {
        return { userId: row.user_id, name: row.name, score: row.score, rank: Number(row.rank),
                 isYou: !!(user && row.user_id === user.id) };
      });
    } catch (e) { return null; }
  }
  // The signed-in user's own rank (useful when they're outside the visible top-N).
  async function fetchMyRank(deckKey, diff) {
    if (!ready()) return null;
    try {
      var r = await sb.rpc("get_my_rank", { p_deck: String(deckKey), p_diff: String(diff) });
      if (r.error || !r.data || !r.data[0]) return null;
      var d = r.data[0];
      return { rank: Number(d.rank), total: Number(d.total), score: d.score };
    } catch (e) { return null; }
  }

  // Every score across all decks, ranked together; optional difficulty filter.
  async function fetchGlobalLeaderboard(diff, deck, limit) {
    if (!sb) return null;
    try {
      var r = await sb.rpc("get_global_leaderboard", { p_diff: diff || null, p_deck: deck || null, p_limit: limit || 50 });
      if (r.error) return null;
      return (r.data || []).map(function (row) {
        return { userId: row.user_id, name: row.name, deck: row.deck_id, difficulty: row.difficulty,
                 score: row.score, streak: Number(row.best_streak) || 0, rank: Number(row.rank),
                 isYou: !!(user && row.user_id === user.id) };
      });
    } catch (e) { return null; }
  }
  // The caller's top-3 finishes (deck + difficulty), for profile badges.
  async function fetchMyPodiums() {
    if (!ready()) return null;
    try {
      var r = await sb.rpc("get_my_podiums");
      if (r.error) return null;
      return (r.data || []).map(function (d) {
        return { deck_id: d.deck_id, difficulty: d.difficulty, rank: Number(d.rank), score: d.score };
      });
    } catch (e) { return null; }
  }

  // ----- Profile podium badges (modal + the little medal on the account button) -
  var MODE_LABELS = { easy: "Easy", medium: "Medium", hard: "Hard", insane: "Insane" };
  function escapeText(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  async function refreshBadges() {
    var listEl = $("authBadges"), btnBadge = $("accountBadge");
    if (!ready()) {
      if (listEl) listEl.innerHTML = "";
      if (btnBadge) btnBadge.hidden = true;
      return;
    }
    var podiums = (await fetchMyPodiums()) || [];
    if (btnBadge) btnBadge.hidden = podiums.length === 0;
    if (!listEl) return;
    if (!podiums.length) {
      listEl.innerHTML = '<div class="badges-title">🏅 Podium badges</div>' +
        '<div class="badges-empty">No top-3 finishes yet — climb a leaderboard to earn one!</div>';
      return;
    }
    var medals = ["🥇", "🥈", "🥉"];
    var deckLabel = window.deckLabel || function (k) { return k; };
    listEl.innerHTML = '<div class="badges-title">🏅 Podium badges (' + podiums.length + ')</div>' +
      '<div class="badges-list">' + podiums.map(function (p) {
        var medal = medals[(p.rank || 3) - 1] || "🏅";
        return '<div class="badge-item diff-' + escapeText(p.difficulty) + '">' +
          '<span class="badge-medal">' + medal + '</span>' +
          '<span class="badge-where">' + escapeText(deckLabel(p.deck_id)) +
          ' · <b>' + escapeText(MODE_LABELS[p.difficulty] || p.difficulty) + '</b></span></div>';
      }).join("") + '</div>';
  }

  async function onSignedIn(u, offerMigrate) {
    user = u || null;
    profileName = null;
    if (!user) { renderAuthState(); return; }
    fetchProfileName();
    // Snapshot guest data BEFORE hydration so migration only pushes guest-origin
    // rows (otherwise hydrated cloud reports would be re-inserted as duplicates).
    pendingMigration = offerMigrate ? snapshotLocal() : null;
    await hydrateFromCloud();
    renderAuthState();
    refreshBadges();
    if (pendingMigration && (pendingMigration.reports.length || pendingMigration.highs.length)) {
      setMsg("Signed in as " + (user.email || profileName || "you") + ".", false);
      showMigratePrompt();
    } else {
      pendingMigration = null;
      setMsg("Signed in — your progress now syncs across devices.", false);
      setTimeout(closeModal, 1100);
    }
  }

  async function doSignIn() {
    if (!sb) { setMsg("Cloud sync is unavailable right now — you can keep using guest mode.", true); return; }
    var email = ($("authEmail").value || "").trim();
    var pass = $("authPass").value || "";
    if (!email || !pass) { setMsg("Enter your email and password.", true); return; }
    setMsg("Signing in…");
    try {
      var r = await sb.auth.signInWithPassword({ email: email, password: pass });
      if (r.error) {
        var m = r.error.message || "Sign-in failed.";
        if (/not confirmed|confirm your email/i.test(m)) {
          m = "This account's email isn't confirmed yet. Confirm it from your inbox, or turn off email confirmation in Supabase.";
        }
        setMsg(m, true);
        return;
      }
      await onSignedIn(r.data.user, true);
    } catch (e) {
      setMsg("Couldn't reach the server. The app still works in guest mode.", true);
    }
  }

  async function doSignUp() {
    if (!sb) { setMsg("Cloud sync is unavailable right now — you can keep using guest mode.", true); return; }
    var email = ($("authEmail").value || "").trim();
    var pass = $("authPass").value || "";
    if (!email || !pass) { setMsg("Enter an email and a password.", true); return; }
    if (pass.length < 6) { setMsg("Password must be at least 6 characters.", true); return; }
    setMsg("Creating your account…");
    try {
      var r = await sb.auth.signUp({
        email: email,
        password: pass,
        // Current production origin. Must NOT be the retired anpi.pages.dev — if
        // that freed project name were re-claimed, confirmation links (and their
        // tokens) would be redirected to a domain we no longer control.
        options: { emailRedirectTo: "https://anpi-learning.pages.dev" }
      });
      if (r.error) { setMsg(r.error.message, true); return; }
      // Confirmation OFF → signUp returns a live session → sign straight in.
      if (r.data.session) { await onSignedIn(r.data.user, true); return; }
      // No session: confirmation may be required, OR it's off and the session
      // just wasn't returned. Try an immediate password sign-in — it succeeds
      // when confirmation is disabled, and fails cleanly when it isn't.
      var si = await sb.auth.signInWithPassword({ email: email, password: pass });
      if (!si.error && si.data && si.data.session) { await onSignedIn(si.data.user, true); return; }
      setMsg("Account created! Check your email to confirm, then sign in.", false);
    } catch (e) {
      setMsg("Couldn't reach the server. The app still works in guest mode.", true);
    }
  }

  async function doSignOut() {
    try { if (sb) await sb.auth.signOut(); } catch (e) {}
    user = null;
    profileName = null;
    displayName = null;
    pendingMigration = null;
    renderAuthState();
    refreshBadges();
    hideMigratePrompt();
    setMsg("Signed out. You're now in guest mode (this device only).", false);
  }

  // ==========================================================================
  // UI
  // ==========================================================================
  function setMsg(text, isError) {
    var el = $("authMsg");
    if (!el) return;
    el.textContent = text || "";
    el.className = "auth-msg" + (text ? (isError ? " err" : " ok") : "");
  }
  function openModal() { var o = $("authOverlay"); if (o) o.classList.add("show"); setMsg(""); refreshBadges(); }
  function closeModal() { var o = $("authOverlay"); if (o) o.classList.remove("show"); }
  function showMigratePrompt() { var m = $("authMigrate"); if (m) m.hidden = false; }
  function hideMigratePrompt() { var m = $("authMigrate"); if (m) m.hidden = true; }

  function shortName(name) {
    if (!name) return "👤";
    var at = name.indexOf("@");
    var base = at > 0 ? name.slice(0, at) : name;
    return base.length > 14 ? base.slice(0, 13) + "…" : base;
  }

  function renderAuthState() {
    var btn = $("accountBtn");
    if (!btn) return;
    var loggedOut = $("authLoggedOut"), loggedIn = $("authLoggedIn");
    var title = $("authTitle"), label = $("accountLabel");
    if (user) {
      var name = profileName || user.email || "Account";
      if (loggedOut) loggedOut.hidden = true;
      if (loggedIn) loggedIn.hidden = false;
      if ($("authUser")) $("authUser").textContent = name;
      if (title) title.textContent = "Your account";
      if (label) label.textContent = shortName(name);
      btn.classList.add("authed");
      btn.title = "Signed in as " + name;
    } else {
      if (loggedOut) loggedOut.hidden = false;
      if (loggedIn) loggedIn.hidden = true;
      if (title) title.textContent = "Sign in to sync";
      if (label) label.textContent = "👤";
      btn.classList.remove("authed");
      btn.title = "Account — sign in to sync across devices";
    }
  }

  // ==========================================================================
  // Wrap the app's storage functions so signed-in writes also reach the cloud.
  // (Top-level function declarations in app.js are writable globals, so
  // reassigning them transparently updates the app's own internal calls too.)
  // ==========================================================================
  function wrapAppFns() {
    // NOTE: high-score cloud sync is now driven explicitly from endGame() (it
    // pushes the local best every game, so the cloud catches up even for highs
    // set before sign-in / before the DB existed). We no longer wrap setHigh.
    if (typeof window.saveResult === "function" && !window.saveResult.__synced) {
      var _saveResult = window.saveResult;
      window.saveResult = function (record) {
        var n = _saveResult.apply(this, arguments);
        try { KanaSync.onReport(record); } catch (e) {}
        return n;
      };
      window.saveResult.__synced = true;
    }
  }

  // ==========================================================================
  // Init
  // ==========================================================================
  function on(id, ev, fn) { var el = $(id); if (el) el.addEventListener(ev, fn); }

  function bindUI() {
    on("accountBtn", "click", openModal);
    on("authClose", "click", closeModal);
    on("signInBtn", "click", doSignIn);
    on("signUpBtn", "click", doSignUp);
    on("signOutBtn", "click", doSignOut);
    on("saveNameBtn", "click", saveDisplayName);
    var nameInp = $("authDisplayName");
    if (nameInp) nameInp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); saveDisplayName(); } });
    on("migrateYes", "click", runMigration);
    on("migrateNo", "click", function () {
      pendingMigration = null;
      hideMigratePrompt();
      setMsg("Skipped. Only new progress will sync from now on.", false);
      setTimeout(closeModal, 900);
    });
    var overlay = $("authOverlay");
    if (overlay) overlay.addEventListener("click", function (e) { if (e.target === overlay) closeModal(); });
    var pass = $("authPass");
    if (pass) pass.addEventListener("keydown", function (e) { if (e.key === "Enter") doSignIn(); });
  }

  function init() {
    bindUI();
    wrapAppFns();
    renderAuthState();
    if (sb) {
      sb.auth.getSession().then(function (r) {
        var sess = r && r.data && r.data.session;
        if (sess && sess.user) onSignedIn(sess.user, false);
      }).catch(noop);
      try {
        sb.auth.onAuthStateChange(function (_evt, session) {
          if (session && session.user) {
            if (!user) { user = session.user; fetchProfileName(); renderAuthState(); }
          } else {
            user = null; profileName = null; renderAuthState();
          }
        });
      } catch (e) {}
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
