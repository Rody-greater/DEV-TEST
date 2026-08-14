import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
const require = createRequire('/tmp/claude-0/-home-user-DEV-TEST/dd5645eb-851d-58bf-8b63-14a7edb279f7/scratchpad/geo/');
const { feature } = require('topojson-client');
const topo = require('world-atlas/countries-50m.json');

const SP = '/tmp/claude-0/-home-user-DEV-TEST/dd5645eb-851d-58bf-8b63-14a7edb279f7/scratchpad/';
const data = JSON.parse(readFileSync(SP + 'points.json', 'utf8'));

// If a real routing run has been done (route_segments.py -> routed_total.json),
// stamp the TRUE routed distance and drop the estimate label automatically.
let routed = null;
try { routed = JSON.parse(readFileSync(SP + 'routed_total.json', 'utf8')); } catch { /* estimate mode */ }
const fmtKm = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const heroKm = routed ? fmtKm(routed.total_road_km) : '≈ 2 720';
const heroLabel = routed ? 'KM · TOTAL ROAD DISTANCE' : 'KM · ROAD DISTANCE (EST.)';
const heroFoot = routed
  ? 'Road distance routed per logged GPS segment (' + (routed.method || 'OSRM driving') + ').'
  : 'Road distance estimated from logged GPS points via calibrated per-segment detour factors (no live routing engine available in this environment).';
const pts = data.points;
const home = data.home;
const route = [...pts.map(p => [p.lat, p.lng]), [home[0], home[1]]]; // close to Almere

// ---------- projection ----------
const RAD = Math.PI / 180;
function merc(lat, lng) {
  return [lng * RAD, Math.log(Math.tan(Math.PI / 4 + (lat * RAD) / 2))];
}
const mroute = route.map(([la, ln]) => merc(la, ln));
let minx = Math.min(...mroute.map(p => p[0])), maxx = Math.max(...mroute.map(p => p[0]));
let miny = Math.min(...mroute.map(p => p[1])), maxy = Math.max(...mroute.map(p => p[1]));
const dx = maxx - minx, dy = maxy - miny;

const W = 1080, H = 1350;
const MX0 = 58, MY0 = 250, MX1 = 1022, MY1 = 1004;
const mw = MX1 - MX0, mh = MY1 - MY0;
const scale = Math.min(mw / dx, mh / dy) * 0.80;   // leave margin so country shapes show
const cx0 = (minx + maxx) / 2, cy0 = (miny + maxy) / 2;
const mapCX = (MX0 + MX1) / 2, mapCY = (MY0 + MY1) / 2;
function P(lat, lng) {
  const [mx, my] = merc(lat, lng);
  return [mapCX + (mx - cx0) * scale, mapCY - (my - cy0) * scale];
}
const nodes = route.map(([la, ln]) => P(la, ln));

// ---------- countries ----------
const geo = feature(topo, topo.objects.countries);
const primary = new Set(['Netherlands', 'Germany', 'Switzerland', 'Italy', 'Austria']);
const context = new Set(['France', 'Belgium', 'Luxembourg', 'Czechia', 'Slovenia', 'Liechtenstein', 'Denmark', 'Poland', 'Croatia', 'Hungary', 'United Kingdom']);

function ringToPath(ring) {
  // ring: array of [lng,lat]
  let d = '';
  for (let i = 0; i < ring.length; i++) {
    const [lng, lat] = ring[i];
    const [x, y] = P(lat, lng);
    d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1);
  }
  return d + 'Z';
}
function geomPath(g) {
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  let d = '';
  for (const poly of polys) for (const ring of poly) d += ringToPath(ring);
  return d;
}

const parts = [];
parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Helvetica, Arial, sans-serif">`);
parts.push(`<defs>
<radialGradient id="bg" cx="50%" cy="28%" r="90%">
 <stop offset="0%" stop-color="#12151b"/><stop offset="50%" stop-color="#0b0d11"/><stop offset="100%" stop-color="#050608"/>
</radialGradient>
<linearGradient id="road" x1="0" y1="0" x2="0.35" y2="1">
 <stop offset="0%" stop-color="#f4d9a6"/><stop offset="45%" stop-color="#d8ac72"/><stop offset="100%" stop-color="#b0824a"/>
</linearGradient>
<radialGradient id="alp" cx="50%" cy="45%" r="60%">
 <stop offset="0%" stop-color="#333a45" stop-opacity="0.85"/><stop offset="100%" stop-color="#333a45" stop-opacity="0"/>
</radialGradient>
<radialGradient id="vig" cx="50%" cy="45%" r="78%">
 <stop offset="58%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.5"/>
</radialGradient>
<filter id="glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<clipPath id="mapclip"><rect x="${MX0}" y="${MY0}" width="${mw}" height="${mh}" rx="10"/></clipPath>
</defs>`);
parts.push(`<rect width="${W}" height="${H}" fill="url(#bg)"/>`);

// ---- map group (clipped) ----
parts.push(`<g clip-path="url(#mapclip)">`);
// sea rect subtle
parts.push(`<rect x="${MX0}" y="${MY0}" width="${mw}" height="${mh}" fill="#080a0e"/>`);

// context countries (fill + border)
for (const f of geo.features) {
  if (!context.has(f.properties.name)) continue;
  parts.push(`<path d="${geomPath(f.geometry)}" fill="#0e1116" stroke="#1b1f27" stroke-width="0.8"/>`);
}
// primary countries (slightly warmer fill + a touch brighter border)
for (const f of geo.features) {
  if (!primary.has(f.properties.name)) continue;
  parts.push(`<path d="${geomPath(f.geometry)}" fill="#13171e" stroke="#333a45" stroke-width="1.0"/>`);
}

// Alps subtle relief — a soft band along the route's alpine section
const alpIdx = [11, 12, 13, 19, 20, 22, 24, 26, 28, 29, 31, 33, 34];
for (const i of alpIdx) {
  const [x, y] = nodes[i];
  parts.push(`<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="86" ry="52" fill="url(#alp)"/>`);
}

// ---- route ----
const dpath = 'M' + nodes.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L');
parts.push(`<path d="${dpath}" fill="none" stroke="#d8ac72" stroke-opacity="0.22" stroke-width="11" filter="url(#glow)" stroke-linejoin="round" stroke-linecap="round"/>`);
parts.push(`<path d="${dpath}" fill="none" stroke="url(#road)" stroke-width="3.6" stroke-linejoin="round" stroke-linecap="round"/>`);
for (const [x, y] of nodes) parts.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.1" fill="#f4dcb0" opacity="0.75"/>`);

// pass markers (small gold triangles)
const passes = [
  { i: 12, name: 'Gotthard' }, { i: 21, name: 'Costalunga' }, { i: 24, name: 'Sella' },
  { i: 27, name: 'Gardena' }, { i: 33, name: 'Fernpass' }
];
for (const p of passes) {
  const [x, y] = nodes[p.i];
  parts.push(`<path d="M${(x).toFixed(1)} ${(y-5.5).toFixed(1)} L${(x+4.8).toFixed(1)} ${(y+3.5).toFixed(1)} L${(x-4.8).toFixed(1)} ${(y+3.5).toFixed(1)} Z" fill="#e9c versize"/>`.replace('#e9c versize','#eac37e'));
}
parts.push(`</g>`); // end map clip

// ---- labels (curated; Würzburg removed) ----
// side: 'L' or 'R'
const labels = [
  { i: 0, t: 'ALMERE', s: 'START / FINISH', side: 'L' },
  { i: 2, t: 'MONSCHAU', s: null, side: 'L' },
  { i: 5, t: 'BERNKASTEL', s: 'MOSEL', side: 'L' },
  { i: 10, t: 'RHEINFALL', s: null, side: 'L' },
  { i: 11, t: 'WEGGIS', s: 'VIERWALDSTÄTTERSEE', side: 'L' },
  { i: 12, t: 'GOTTHARDPASS', s: '2106 M', side: 'L' },
  { i: 17, t: 'LAGO DI GARDA', s: null, side: 'L' },
  { i: 24, t: 'PASSO SELLA', s: '2244 M · HIGHEST', side: 'R' },
  { i: 29, t: "CORTINA D'AMPEZZO", s: null, side: 'R' },
  { i: 33, t: 'SAN CANDIDO', s: null, side: 'R' },
  { i: 34, t: 'FERNPASS', s: 'REUTTE', side: 'R' },
];
const placed = { L: [], R: [] };
function placeY(side, y) {
  y = Math.max(MY0 + 16, Math.min(MY1 - 8, y));
  let ok = false;
  while (!ok) {
    ok = true;
    for (const py of placed[side]) if (Math.abs(py - y) < 33) { y = py + 33; ok = false; break; }
  }
  placed[side].push(y);
  return y;
}
const esc = s => s.replace(/&/g, '&amp;');
const FS = 16;
const sorted = [...labels].sort((a, b) => nodes[a.i][1] - nodes[b.i][1]);
for (const L of sorted) {
  const [nx, ny] = nodes[L.i];
  const ly = placeY(L.side, ny);
  const anchor = L.side === 'L' ? 'end' : 'start';
  const tx = L.side === 'L' ? nx - 13 : nx + 13;
  const lx2 = L.side === 'L' ? nx - 11 : nx + 11;
  if (L.i === 0) {
    parts.push(`<circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="7.5" fill="none" stroke="#f4d9a6" stroke-width="2.6"/><circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="3" fill="#f4d9a6"/>`);
  } else {
    parts.push(`<circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="3.3" fill="#f4d9a6"/>`);
  }
  parts.push(`<line x1="${nx.toFixed(1)}" y1="${ny.toFixed(1)}" x2="${lx2.toFixed(1)}" y2="${ly.toFixed(1)}" stroke="#6f665a" stroke-width="1"/>`);
  const hi = L.s && L.s.includes('HIGHEST');
  parts.push(`<text x="${tx.toFixed(1)}" y="${ly.toFixed(1)}" fill="#efe9df" font-size="${FS}" font-weight="700" letter-spacing="1.2" text-anchor="${anchor}">${esc(L.t)}</text>`);
  if (L.s) parts.push(`<text x="${tx.toFixed(1)}" y="${(ly + 14).toFixed(1)}" fill="${hi ? '#e0b878' : '#8f887b'}" font-size="10.5" font-weight="${hi ? 700 : 400}" letter-spacing="1.5" text-anchor="${anchor}">${esc(L.s)}</text>`);
}

// ---- vignette ----
parts.push(`<rect width="${W}" height="${H}" fill="url(#vig)"/>`);

// ---- title ----
parts.push(`<text x="540" y="126" text-anchor="middle" fill="#f4efe6" font-size="66" font-weight="800" letter-spacing="7">ROADTRIP 2026</text>`);
parts.push(`<text x="540" y="165" text-anchor="middle" fill="#d8ac72" font-size="18" font-weight="600" letter-spacing="7.5">THE ROAD WAS THE DESTINATION</text>`);
parts.push(`<line x1="335" y1="190" x2="745" y2="190" stroke="#2c2f36" stroke-width="1"/>`);
parts.push(`<text x="540" y="214" text-anchor="middle" fill="#847d70" font-size="13" letter-spacing="6">4 — 13 AUGUST 2026</text>`);

// ---- stats block ----
const BY = 1050;
parts.push(`<line x1="58" y1="${BY - 26}" x2="1022" y2="${BY - 26}" stroke="#23262c" stroke-width="1"/>`);
parts.push(`<text x="58" y="${BY - 4}" fill="#d8ac72" font-size="14" font-weight="800" letter-spacing="5">ROADTRIP 2026 · STATISTICS</text>`);

// hero row
function big(x, y, val, lab, sub) {
  parts.push(`<text x="${x}" y="${y}" fill="#f4efe6" font-size="54" font-weight="800" letter-spacing="0.5">${val}</text>`);
  parts.push(`<text x="${x}" y="${y + 23}" fill="#8f887b" font-size="12.5" font-weight="600" letter-spacing="2.5">${lab}</text>`);
}
big(58, BY + 50, heroKm, heroLabel);
big(560, BY + 50, '39H 08M', 'BEHIND THE WHEEL');

// second row: 10 / 5 / 2244
const r2 = BY + 138;
function med(x, val, lab) {
  parts.push(`<text x="${x}" y="${r2}" fill="#f4efe6" font-size="46" font-weight="800">${val}</text>`);
  parts.push(`<text x="${x}" y="${r2 + 22}" fill="#8f887b" font-size="12.5" font-weight="600" letter-spacing="2.5">${lab}</text>`);
}
med(58, '10', 'DAYS');
med(235, '5', 'COUNTRIES');
med(430, '2 244', 'M · HIGHEST POINT');
parts.push(`<text x="430" y="${r2 + 38}" fill="#6f685c" font-size="10.5" letter-spacing="1.5">PASSO SELLA, DOLOMITEN</text>`);

// country line
const cl = r2 + 70;
parts.push(`<text x="58" y="${cl}" fill="#a99f8c" font-size="14.5" font-weight="700" letter-spacing="3">NETHERLANDS &#8226; GERMANY &#8226; SWITZERLAND &#8226; ITALY &#8226; AUSTRIA</text>`);
parts.push(`<text x="58" y="${cl + 22}" fill="#5c574d" font-size="10" letter-spacing="1.1">${heroFoot}</text>`);

parts.push(`</svg>`);
writeFileSync(SP + 'roadtrip2.svg', parts.join('\n'));
console.log('poster2 svg written; nodes', nodes.length, 'route dy/dx', (dy/dx).toFixed(2), 'scale', scale.toFixed(0));
