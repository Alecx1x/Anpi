// Cloudflare Pages Function — GET /api/tts?q=<text>
// Synthesizes Japanese speech via Google Cloud Text-to-Speech and returns MP3,
// so the app speaks Japanese without the visitor installing any voice.
//
// Requires an environment variable on the Pages project:
//   Cloudflare dashboard → Pages → anpi → Settings → Variables and Secrets →
//   Add → name: GOOGLE_TTS_KEY → value: <your Google Cloud API key> → Secret → Save.
//
// Responses are edge-cached per (text) so repeated terms don't re-bill the API.
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const text = (url.searchParams.get("q") || "").trim().slice(0, 200);

  if (!text) return new Response("missing q", { status: 400 });
  const key = env.GOOGLE_TTS_KEY;
  if (!key) return new Response("GOOGLE_TTS_KEY not configured", { status: 503 });

  const cache = caches.default;
  const cacheKey = new Request(url.toString());
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

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
      const errTxt = await gres.text();
      return new Response("google tts " + gres.status + ": " + errTxt.slice(0, 400), { status: 502 });
    }
    const j = await gres.json();
    const b64 = j && j.audioContent;
    if (!b64) return new Response("no audioContent in response", { status: 502 });

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
    return new Response("tts error: " + (e && e.message ? e.message : String(e)), { status: 500 });
  }
}
