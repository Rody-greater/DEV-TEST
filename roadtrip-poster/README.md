# Roadtrip 2026 — Poster & Statistics

A premium automotive-style poster of the August 2026 road trip (Almere →
Germany → Switzerland → Italy → Austria → Germany → Almere), plus the
reproducible statistics computed from the ride log `Trips.csv.pdf`.

## Final deliverables

| File | What it is |
|------|-----------|
| `roadtrip_2026_final_1080x1350.png` | Instagram-portrait poster (1080×1350). |
| `roadtrip_2026_final_highres.png` | High-res poster (2160×2700). |
| `roadtrip_2026_final.svg` | Vector source of the poster. |
| `roadtrip_stats.json` | Machine-readable statistics. |
| `roadtrip_segments.csv` | Every logged drive segment (internal detail). |
| `roadtrip_days.csv` | Per-calendar-day aggregates. |
| `points.json` | Ordered GPS points extracted from the PDF. |
| `genposter2.mjs`, `analyze.py`, `build_data.py` | Generator + analysis scripts. |

(`roadtrip_poster.*` and `roadtrip_stats.txt` are the earlier first version, kept for reference.)

## Headline numbers (all double-checked against the log)

- **≈ 2 720 km** — estimated road distance (see method below).
- **39h 08m behind the wheel** — sum of (end − start) per drive. Matches the control value exactly.
- **10 days**, 4 → 13 August 2026.
- **5 countries** — Netherlands, Germany, Switzerland, Italy, Austria (confirmed from the country in every location string).
- **Highest point ≈ 2 244 m — Passo Sella** (the log records the car on the SS242 "Val Gardena e Passo Sella"). This is higher than the Gotthard Pass (2106 m), which the first poster wrongly implied was the top.
- **Longest driving day** — 13 August, 11h 56m and ≈ 1 048 km (the drive home from San Candido to Almere).
- **5 major Alpine passes** proven from the road names in the log: Gotthard, Passo di Costalunga/Karerpass, Passo Sella, Passo Gardena/Grödner Joch, Fernpass.

## Distance method (important, honest)

The PDF contains only start/end GPS coordinates — no distance column. A real
routing engine (OSRM / OpenRouteService / GraphHopper) would give true road
kilometres, but **no routing engine was reachable** in this environment (the
network policy denies every routing and elevation host; only package
registries are open, and offline routing is impossible without the European
road-network data that lives on those same blocked hosts).

So `2 720 km` is an **estimate**, computed as each segment's straight-line
(geodesic) distance × a calibrated detour factor by segment type (short
alpine hairpins ×1.85, other transalpine legs ×1.35, pure motorway ×1.13,
motorway-dominant ×1.22, short local hops ×1.40, mixed ×1.33). It is
**not** turn-by-turn routed distance and **not** raw straight-line distance.
The measured straight-line lower bound is 2 131 km. Validation against known
legs: Almere→Heerlen est 206 km (real ~200), San Candido→Reutte est 194 km
(real ~185), return day est 1 048 km (real ~1 050).

### Getting the REAL routed distance (on a machine with internet)

Routing can't run inside the Claude sandbox (network policy blocks every
routing host and the OSM data servers), but it's a one-liner anywhere with
internet — including from a local coding agent (Codex / Claude Code) on your
own machine.

```bash
cd roadtrip-poster

# Option 1 — zero setup, public OSRM demo server (car profile):
python3 route_segments.py --sleep 0.6

# Option 2 — your own local OSRM built from a Geofabrik extract (offline once built):
#   docker run -t -v "$PWD:/data" ghcr.io/project-osrm/osrm-backend osrm-extract -p /opt/car.lua /data/alps-latest.osm.pbf
#   ... osrm-partition / osrm-customize ... then:  osrm-routed --algorithm mld /data/alps-latest.osrm
python3 route_segments.py --osrm-url http://localhost:5000
```

This writes `routed_total.json`, `roadtrip_routed_segments.csv` and
`roadtrip_routed_days.csv`. Because the log is cut into short segments whose
endpoints already sit on the pass roads (Gotthard hospice, SS242/SS243, …),
point-to-point routing follows the passes rather than tunnels; any segment
with an implausible routed/straight ratio is **flagged**, never silently
trusted.

Then just re-run the generator — it auto-detects `routed_total.json`, stamps
the true number, and drops the "(EST.)" label:

```bash
node genposter2.mjs        # hero becomes "X XXX KM · TOTAL ROAD DISTANCE"
```

(No `routed_total.json` present → it stays in labelled-estimate mode.)

## Map

Country outlines are real (Natural Earth 50 m via the `world-atlas` package,
installed from npm), projected in Web Mercator to match the GPS route, so the
shape of the Netherlands, Germany, Switzerland, Northern Italy and Austria is
geographically credible. The gold route uses the actual chronological GPS
points and closes back to Almere.

## Regenerate

```bash
node genposter2.mjs        # writes roadtrip2.svg from points.json + world-atlas
python3 analyze.py         # segment/day analysis -> analysis.json
python3 build_data.py      # writes roadtrip_stats.json + the two CSVs
# render the SVG to PNG with any SVG renderer (Chromium/Playwright used here)
```
