// Cloudflare Pages Function — GET /api/tts?q=<text>
// Synthesizes Japanese speech and returns MP3 so the app speaks Japanese without
// the visitor installing a local voice.
//
// Source: Google Translate's free `translate_tts` endpoint (no API key, no
// account). Calling it from the BROWSER rate-limits a single IP after a few
// dozen plays — which is exactly the wall we hit before. Proxying it here fixes
// that two ways: (1) requests come from Cloudflare's rotating edge IPs, not one
// device, and (2) every result is edge-cached per (text), so repeated terms are
// served from cache and never re-hit Google. No env var / secret required.
//
// Abuse protection: a best-effort per-IP rate limit (below) blunts a single
// client hammering uncached terms; upstream errors are never echoed verbatim.

// --- Best-effort per-IP rate limiting ---------------------------------------
// Cloudflare runs many isolates per colo, so this in-memory counter is a SOFT
// throttle (per-isolate / per-colo, reset on isolate recycle) layered on top of
// the edge cache. It slows a single IP that floods *uncached* terms. For a hard
// global cap, add a Cloudflare WAF rate-limiting rule on the /api/tts path.
const RL_WINDOW_MS = 60000; // fixed 1-minute window
const RL_MAX = 60;          // max uncached requests per IP per window
const rlHits = new Map();   // ip -> { count, reset }

function rateLimit(ip) {
  const now = Date.now();
  let e = rlHits.get(ip);
  if (!e || now >= e.reset) {
    e = { count: 0, reset: now + RL_WINDOW_MS };
    rlHits.set(ip, e);
  }
  e.count++;
  // Opportunistic sweep so the Map can't grow unbounded under many distinct IPs.
  if (rlHits.size > 5000) {
    for (const [k, v] of rlHits) { if (now >= v.reset) rlHits.delete(k); }
  }
  return {
    ok: e.count <= RL_MAX,
    retryAfter: Math.max(1, Math.ceil((e.reset - now) / 1000)),
  };
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const text = (url.searchParams.get("q") || "").trim().slice(0, 200);

  if (!text) return new Response("missing q", { status: 400 });

  const cache = caches.default;
  const cacheKey = new Request(url.toString());
  // Cache hits cost nothing, so serve them WITHOUT consuming the rate-limit
  // budget — only uncached requests below are throttled.
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  // This request will hit Google — apply the per-IP throttle.
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const rl = rateLimit(ip);
  if (!rl.ok) {
    return new Response("rate limit exceeded — slow down", {
      status: 429,
      headers: { "Retry-After": String(rl.retryAfter) },
    });
  }

  // translate_tts caps at ~200 chars per call; `text` is already sliced to 200.
  const src = "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ja&q=" +
    encodeURIComponent(text);

  try {
    const gres = await fetch(src, {
      headers: {
        // translate_tts rejects requests with no/standard fetch UA.
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        "Referer": "https://translate.google.com/",
      },
    });
    if (!gres.ok) {
      // Log upstream detail to the edge but never return it to the client.
      console.error("translate_tts " + gres.status);
      return new Response("tts upstream error", { status: 502 });
    }
    const bytes = await gres.arrayBuffer();
    if (!bytes || bytes.byteLength < 200) {
      console.error("translate_tts tiny/empty body: " + (bytes ? bytes.byteLength : 0));
      return new Response("tts upstream error", { status: 502 });
    }

    const resp = new Response(bytes, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=604800", // a week
      },
    });
    context.waitUntil(cache.put(cacheKey, resp.clone()));
    return resp;
  } catch (e) {
    console.error("tts error: " + (e && e.message ? e.message : String(e)));
    return new Response("tts error", { status: 500 });
  }
}
