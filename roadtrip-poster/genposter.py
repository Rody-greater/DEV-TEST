#!/usr/bin/env python3
import json, math

d = json.load(open('points.json'))
pts = d['points']
home = d['home']  # [lat,lng] Almere

# Close the loop back to Almere (final arrival is Dagobertstraat, Almere)
route = [(p['lat'], p['lng']) for p in pts] + [(home[0], home[1])]

# ---- Web Mercator projection ----
def merc(lat, lng):
    x = math.radians(lng)
    y = math.log(math.tan(math.pi/4 + math.radians(lat)/2))
    return x, y

proj = [merc(la, ln) for la, ln in route]
xs = [p[0] for p in proj]; ys = [p[1] for p in proj]
minx, maxx = min(xs), max(xs)
miny, maxy = min(ys), max(ys)
dx = maxx - minx; dy = maxy - miny

# Map rectangle on canvas
W, H = 1080, 1350
MX0, MY0, MX1, MY1 = 74, 250, 1006, 1016
mw, mh = MX1 - MX0, MY1 - MY0

# Aspect-preserving fit (note: SVG y grows downward, mercator y grows upward)
scale = min(mw / dx, mh / dy) * 0.94
usedw = dx * scale; usedh = dy * scale
offx = MX0 + (mw - usedw) / 2
offy = MY0 + (mh - usedh) / 2

def to_xy(la, ln):
    mxp, myp = merc(la, ln)
    X = offx + (mxp - minx) * scale
    Y = offy + (maxy - myp) * scale   # flip
    return X, Y

nodes = [to_xy(la, ln) for la, ln in route]

# ---- Curated labels: (route_index, text, subtext, side)  side: 'L' or 'R' or 'auto'
labels = [
    (0,  'ALMERE',        'START / FINISH', 'L'),
    (2,  'MONSCHAU',      None,             'L'),
    (5,  'BERNKASTEL',    'MOSEL',          'L'),
    (10, 'RHEINFALL',     None,             'L'),
    (11, 'WEGGIS',        'VIERWALDSTÄTTERSEE', 'L'),
    (12, 'GOTTHARD',      '2106 M',         'L'),
    (17, 'LAGO DI GARDA', None,             'L'),
    (26, 'CANAZEI',       'DOLOMITEN',      'R'),
    (33, 'SAN CANDIDO',   'INNICHEN',       'R'),
    (34, 'REUTTE',        'TIROL',          'R'),
    (37, 'WÜRZBURG',      None,             'R'),
]

# ---- Build SVG ----
def esc(s): return s.replace('&','&amp;')

parts = []
parts.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Helvetica, Arial, sans-serif">')
parts.append('''<defs>
<radialGradient id="bg" cx="50%" cy="30%" r="85%">
 <stop offset="0%" stop-color="#161a20"/><stop offset="52%" stop-color="#0d0f13"/><stop offset="100%" stop-color="#060708"/>
</radialGradient>
<linearGradient id="road" x1="0" y1="0" x2="0.4" y2="1">
 <stop offset="0%" stop-color="#f0d09a"/><stop offset="50%" stop-color="#cf a06a"/><stop offset="100%" stop-color="#a97c46"/>
</linearGradient>
<radialGradient id="alp" cx="50%" cy="42%" r="60%">
 <stop offset="0%" stop-color="#2b313a" stop-opacity="0.9"/><stop offset="100%" stop-color="#2b313a" stop-opacity="0"/>
</radialGradient>
<radialGradient id="vig" cx="50%" cy="46%" r="75%">
 <stop offset="60%" stop-color="#000000" stop-opacity="0"/><stop offset="100%" stop-color="#000000" stop-opacity="0.55"/>
</radialGradient>
<filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
 <feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
</defs>''')
parts.append(f'<rect width="{W}" height="{H}" fill="url(#bg)"/>')

# ---- Alpine relief: cluster soft ridges around the Alps portion of the route ----
# Alps roughly between Gotthard(12) and San Candido(33)
import hashlib
def rnd(seed):
    h = int(hashlib.md5(str(seed).encode()).hexdigest(), 16)
    return (h % 100000) / 100000.0

alp_center_indices = [11,12,13,19,20,22,26,28,29,30,33,34]
parts.append('<g>')
blobs = []
for k, idx in enumerate(alp_center_indices):
    cx, cy = nodes[idx]
    for j in range(3):
        ox = (rnd((k,j,'x'))-0.5)*150
        oy = (rnd((k,j,'y'))-0.5)*120
        rx = 40 + rnd((k,j,'rx'))*70
        ry = rx*0.62
        bx, by = cx+ox, cy+oy
        blobs.append((bx,by,rx,ry))
# draw larger first
for bx,by,rx,ry in sorted(blobs, key=lambda b:-b[2]):
    parts.append(f'<ellipse cx="{bx:.0f}" cy="{by:.0f}" rx="{rx:.0f}" ry="{ry:.0f}" fill="url(#alp)"/>')
    parts.append(f'<path d="M{bx-rx:.0f} {by+ry*0.2:.0f} Q{bx:.0f} {by-ry:.0f} {bx+rx:.0f} {by+ry*0.2:.0f}" stroke="#3d444e" stroke-width="1.3" fill="none" opacity="0.45"/>')
parts.append('</g>')

# ---- faint graticule ----
parts.append('<g stroke="#171b21" stroke-width="1" opacity="0.6">')
for gx in range(MX0, MX1+1, 90):
    parts.append(f'<line x1="{gx}" y1="{MY0}" x2="{gx}" y2="{MY1}"/>')
for gy in range(MY0, MY1+1, 90):
    parts.append(f'<line x1="{MX0}" y1="{gy}" x2="{MX1}" y2="{gy}"/>')
parts.append('</g>')

# ---- route path ----
dpath = 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in nodes)
parts.append(f'<path d="{dpath}" fill="none" stroke="#cf a06a" stroke-opacity="0.22" stroke-width="11" filter="url(#glow)" stroke-linejoin="round" stroke-linecap="round"/>')
parts.append(f'<path d="{dpath}" fill="none" stroke="url(#road)" stroke-width="3.6" stroke-linejoin="round" stroke-linecap="round"/>')

# ---- node dots ----
for x, y in nodes:
    parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="2.2" fill="#f2d9b0" opacity="0.8"/>')

# ---- labels with vertical anti-collision per side ----
placed = {'L': [], 'R': []}
FS = 16.5
def place_y(side, y):
    y = max(MY0+18, min(MY1-6, y))
    for py in placed[side]:
        if abs(py - y) < 30:
            y = py + 30
    placed[side].append(y)
    return y

# sort labels top-to-bottom for stable stacking
labels_sorted = sorted(labels, key=lambda L: nodes[L[0]][1])
for idx, text, sub, side in labels_sorted:
    nx, ny = nodes[idx]
    ly = place_y(side, ny)
    if side == 'L':
        tx = nx - 14; anchor = 'end'; lx2 = nx - 12
    else:
        tx = nx + 14; anchor = 'start'; lx2 = nx + 12
    # start/finish ring for Almere
    if idx == 0:
        parts.append(f'<circle cx="{nx:.1f}" cy="{ny:.1f}" r="7.5" fill="none" stroke="#f0d09a" stroke-width="2.6"/>')
        parts.append(f'<circle cx="{nx:.1f}" cy="{ny:.1f}" r="3" fill="#f0d09a"/>')
    else:
        parts.append(f'<circle cx="{nx:.1f}" cy="{ny:.1f}" r="3.4" fill="#f0d09a"/>')
    parts.append(f'<line x1="{nx:.1f}" y1="{ny:.1f}" x2="{lx2:.1f}" y2="{ly:.1f}" stroke="#6b6256" stroke-width="1"/>')
    parts.append(f'<text x="{tx:.1f}" y="{ly:.1f}" fill="#efe9df" font-size="{FS}" font-weight="700" letter-spacing="1.3" text-anchor="{anchor}">{esc(text)}</text>')
    if sub:
        parts.append(f'<text x="{tx:.1f}" y="{ly+14:.1f}" fill="#8c8578" font-size="10.5" letter-spacing="1.6" text-anchor="{anchor}">{esc(sub)}</text>')

# ---- vignette over map ----
parts.append(f'<rect width="{W}" height="{H}" fill="url(#vig)"/>')

# ---- title block ----
parts.append(f'<text x="540" y="128" text-anchor="middle" fill="#f4efe6" font-size="66" font-weight="800" letter-spacing="7">ROADTRIP 2026</text>')
parts.append(f'<text x="540" y="167" text-anchor="middle" fill="#cf a06a" font-size="18" font-weight="600" letter-spacing="7.5">THE ROAD WAS THE DESTINATION</text>')
parts.append(f'<line x1="330" y1="192" x2="750" y2="192" stroke="#2c2f36" stroke-width="1"/>')
parts.append(f'<text x="540" y="216" text-anchor="middle" fill="#847d70" font-size="13" letter-spacing="6">4 — 13 AUGUST 2026</text>')

# ---- dashboard block bottom ----
BY = 1058
parts.append(f'<line x1="74" y1="{BY-28}" x2="1006" y2="{BY-28}" stroke="#23262c" stroke-width="1"/>')
parts.append(f'<text x="74" y="{BY-6}" fill="#cf a06a" font-size="14" font-weight="800" letter-spacing="5">ROADTRIP 2026 · STATISTICS</text>')

# row 1: big KM + driving time
parts.append(f'<text x="74" y="{BY+52}" fill="#f4efe6" font-size="56" font-weight="800" letter-spacing="1">2 131</text>')
parts.append(f'<text x="74" y="{BY+74}" fill="#8c8578" font-size="12.5" font-weight="600" letter-spacing="2.5">KM · GPS STRAIGHT-LINE MIN.</text>')
parts.append(f'<text x="470" y="{BY+52}" fill="#f4efe6" font-size="56" font-weight="800" letter-spacing="1">39H 08M</text>')
parts.append(f'<text x="470" y="{BY+74}" fill="#8c8578" font-size="12.5" font-weight="600" letter-spacing="2.5">TOTAL DRIVING TIME</text>')

# row 2: drives / days / countries
r2 = BY + 148
parts.append(f'<text x="74" y="{r2}" fill="#f4efe6" font-size="48" font-weight="800">41</text>')
parts.append(f'<text x="74" y="{r2+22}" fill="#8c8578" font-size="12.5" font-weight="600" letter-spacing="2.5">DRIVES</text>')
parts.append(f'<text x="255" y="{r2}" fill="#f4efe6" font-size="48" font-weight="800">10</text>')
parts.append(f'<text x="255" y="{r2+22}" fill="#8c8578" font-size="12.5" font-weight="600" letter-spacing="2.5">DAYS</text>')
parts.append(f'<text x="410" y="{r2}" fill="#f4efe6" font-size="48" font-weight="800">5</text>')
parts.append(f'<text x="410" y="{r2+22}" fill="#8c8578" font-size="12.5" font-weight="600" letter-spacing="2.5">COUNTRIES</text>')
parts.append(f'<text x="565" y="{r2}" fill="#f4efe6" font-size="48" font-weight="800">57</text>')
parts.append(f'<text x="565" y="{r2+22}" fill="#8c8578" font-size="12.5" font-weight="600" letter-spacing="2.5">AVG MIN / DRIVE</text>')

# country line
cl = r2 + 62
parts.append(f'<text x="74" y="{cl}" fill="#a99f8c" font-size="14.5" font-weight="700" letter-spacing="3">NETHERLANDS · GERMANY · SWITZERLAND · ITALY · AUSTRIA</text>')
parts.append(f'<text x="74" y="{cl+24}" fill="#5c574d" font-size="10.5" letter-spacing="1.2">* Straight-line GPS minimum between logged points — real road distance is higher (no routing engine available offline).</text>')

parts.append('</svg>')

svg = '\n'.join(parts)
# fix accidental spaces in color tokens I typed
svg = svg.replace('#cf a06a', '#cfa06a')
open('roadtrip_poster.svg', 'w').write(svg)
print('written; nodes', len(nodes), 'labels', len(labels))
print('map data used w/h', round(usedw), round(usedh))
