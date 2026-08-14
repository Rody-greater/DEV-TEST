# Roadtrip 2026 — Poster & Statistics

A premium automotive-style poster of the August 2026 road trip, plus the
reproducible statistics computed from the ride log.

## Files

| File | What it is |
|------|-----------|
| `roadtrip_poster.png` | Final poster, 1080×1350 (Instagram portrait), rendered at 2× (2160×2700). |
| `roadtrip_poster.svg` | Vector source of the poster. |
| `roadtrip_stats.json` | Machine-readable statistics. |
| `roadtrip_stats.txt` | Human-readable statistics summary. |
| `points.json` | Ordered GPS points extracted from `Trips.csv.pdf`. |
| `genposter.py` | Regenerates the SVG from `points.json`. |

## Source

The single source of truth is the supplied **`Trips.csv.pdf`** (41 logged
drives). The PDF has no distance column — only start/end GPS coordinates —
and had to be parsed directly from its content streams (no PDF tooling was
available in this environment).

## The numbers (all verified twice against the log)

- **41 drives** — one per row.
- **39h 08m total driving time** — sum of (end − start) per drive. Matches the control value exactly.
- **10 days**, 4 → 13 August 2026.
- **5 countries** — Netherlands, Germany, Switzerland, Italy, Austria.
- **2 131 km** — see the distance caveat below.

## ⚠️ Distance method (important)

The PDF contains **no distance data**, only coordinates. A real routing
engine (OSRM / OpenRouteService / GraphHopper) would give true road
kilometres, but **no routing engine was reachable in this offline
environment**.

The `2 131 km` figure is therefore the **straight-line (geodesic) minimum**
between logged points — a *lower bound*. The real driven road distance is
higher. This is labelled as such everywhere and is **never presented as
actual driven kilometres**, per the brief.

To obtain true road km later, feed the coordinate pairs in `points.json`
through a driving-profile routing engine and replace the distance field.

## Regenerate

```bash
python3 genposter.py            # writes roadtrip_poster.svg
# then render the SVG to PNG with any SVG renderer (Chromium/Playwright used here)
```
