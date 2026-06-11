// Reads the full-resolution Japan prefecture GeoJSON and produces a compact,
// embeddable SVG outline → lib/japan-map.js (window.JAPAN_MAP). Run once:
//   node build-japan-map.js   (needs data/_japan_raw.geojson)
const fs = require("fs");
const path = require("path");
const SRC = path.join(__dirname, "data", "_japan_raw.geojson");
const OUT = path.join(__dirname, "lib", "japan-map.js");

const gj = JSON.parse(fs.readFileSync(SRC, "utf8"));

// --- iterative Douglas–Peucker (planar on lng/lat; fine at this scale) ---
function perp(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1e-12;
  return Math.abs((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / len;
}
// open-polyline Douglas–Peucker (distinct endpoints required)
function simplify(pts, eps) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop();
    let dmax = 0, idx = -1;
    for (let i = s + 1; i < e; i++) { const d = perp(pts[i], pts[s], pts[e]); if (d > dmax) { dmax = d; idx = i; } }
    if (dmax > eps && idx > 0) { keep[idx] = 1; stack.push([s, idx], [idx, e]); }
  }
  const out = []; for (let i = 0; i < pts.length; i++) if (keep[i]) out.push(pts[i]);
  return out;
}
// closed-ring simplify: split at the point farthest from the start so DP has
// two distinct-endpoint halves (a closed ring's first==last breaks plain DP).
function simplifyRing(ring, eps) {
  let r = ring;
  if (r.length > 1) { const a = r[0], b = r[r.length - 1]; if (a[0] === b[0] && a[1] === b[1]) r = r.slice(0, -1); }
  if (r.length < 6) return ring;
  let fi = 0, fd = -1;
  for (let i = 1; i < r.length; i++) { const dx = r[i][0] - r[0][0], dy = r[i][1] - r[0][1], d = dx * dx + dy * dy; if (d > fd) { fd = d; fi = i; } }
  const h1 = simplify(r.slice(0, fi + 1), eps);
  const h2 = simplify(r.slice(fi).concat([r[0]]), eps);
  return h1.concat(h2.slice(1));
}
function ringBBoxArea(r) {
  let mnx = 1e9, mny = 1e9, mxx = -1e9, mxy = -1e9;
  for (const p of r) { if (p[0] < mnx) mnx = p[0]; if (p[0] > mxx) mxx = p[0]; if (p[1] < mny) mny = p[1]; if (p[1] > mxy) mxy = p[1]; }
  return (mxx - mnx) * (mxy - mny);
}

const EPS = 0.012;        // simplification tolerance in degrees (~1.2 km)
const MIN_AREA = 0.004;   // drop islands whose bbox area (deg²) is below this

// collect exterior rings of every polygon, simplified, big-enough
let rings = [];
for (const f of gj.features) {
  const g = f.geometry; if (!g) continue;
  const polys = g.type === "MultiPolygon" ? g.coordinates : g.type === "Polygon" ? [g.coordinates] : [];
  for (const poly of polys) {
    const ext = poly[0]; if (!ext || ext.length < 4) continue;
    if (ringBBoxArea(ext) < MIN_AREA) continue;       // skip tiny islets
    const s = simplifyRing(ext, EPS);
    if (s.length >= 4) rings.push(s);
  }
}

// bbox over kept rings
let minLng = 1e9, minLat = 1e9, maxLng = -1e9, maxLat = -1e9;
for (const r of rings) for (const p of r) {
  if (p[0] < minLng) minLng = p[0]; if (p[0] > maxLng) maxLng = p[0];
  if (p[1] < minLat) minLat = p[1]; if (p[1] > maxLat) maxLat = p[1];
}
const midLat = (minLat + maxLat) / 2;
const kx = Math.cos(midLat * Math.PI / 180);
const W = 1000;
const S = W / ((maxLng - minLng) * kx);
const H = Math.round((maxLat - minLat) * S);
const px = (lng) => +(((lng - minLng) * kx * S).toFixed(1));
const py = (lat) => +(((maxLat - lat) * S).toFixed(1));

const paths = rings.map(r => "M" + r.map(p => px(p[0]) + " " + py(p[1])).join("L") + "Z");

const data = {
  viewBox: `0 0 ${W} ${H}`, W, H,
  proj: { minLng, maxLat, kx: +kx.toFixed(6), S: +S.toFixed(4) },
  paths,
};
fs.writeFileSync(OUT, "window.JAPAN_MAP=" + JSON.stringify(data) + ";\n");
const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
console.log(`rings: ${rings.length}  viewBox: ${data.viewBox}  size: ${kb} KB`);
console.log(`bbox lng ${minLng.toFixed(2)}..${maxLng.toFixed(2)}  lat ${minLat.toFixed(2)}..${maxLat.toFixed(2)}`);
