// Cloudflare Pages Function — GET /api/tts?q=<text>
// Synthesizes Japanese speech via Google Cloud Text-to-Speech and returns MP3,
// so the app speaks Japanese without the visitor installing any voice.
//
// Requires an environment variable on the Pages project:
//   Cloudflare dashboard → Pages → anpi → Settings → Variables and Secrets →
//   Add → name: GOOGLE_TTS_KEY → value: <your Google Cloud API key> → Secret → Save.
//
// Responses are edge-cached per (text) so repeated terms don't re-bill the API.
//
// Abuse protection: a best-effort per-IP rate limit (below) blunts a single
// client hammering uncached terms and burning the Google TTS key/quota, and
// upstream errors are never echoed verbatim to the client (they could disclose
// project/quota details). The Google key lives only in env and never leaves the
// edge — only audio bytes are returned to the browser.

// --- Best-effort per-IP rate limiting ---------------------------------------
// Cloudflare runs many isolates per colo, so this in-memory counter is a SOFT
// throttle (scoped per-isolate / per-colo, reset on isolate recycle) layered on
// top of the edge cache. It exists to slow a single IP that floods *uncached*
// terms — the only requests that actually bill Google. For a hard, global cap,
// add a Cloudflare WAF rate-limiting rule on the /api/tts path in the dashboard
// (that can't be expressed in code from a Direct-Upload Pages project).
const RL_WINDOW_MS = 60000; // fixed 1-minute window
const RL_MAX = 20;          // max billable (uncached) requests per IP per window
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
  const key = env.GOOGLE_TTS_KEY;
  if (!key) return new Response("GOOGLE_TTS_KEY not configured", { status: 503 });

  const cache = caches.default;
  const cacheKey = new Request(url.toString());
  // Cache hits cost nothing, so serve them WITHOUT consuming the rate-limit
  // budget — only uncached (billable) requests below are throttled.
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

  try {
    const gres = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize?key=" + key, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: "ja-JP", name: "ja-JP-Neural2-B" },
        audioConfig: { audioEncoding: "MP3", speakingRate: 0.95 },
      }),
    });
    if (!gres.ok) {
      // Log upstream detail to the edge (visible in Cloudflare logs) but never
      // return it — the body can disclose project/quota internals to the client.
      const errTxt = await gres.text();
      console.error("google tts " + gres.status + ": " + errTxt.slice(0, 400));
      return new Response("tts upstream error", { status: 502 });
    }
    const j = await gres.json();
    const b64 = j && j.audioContent;
    if (!b64) return new Response("tts upstream error", { status: 502 });

    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
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
