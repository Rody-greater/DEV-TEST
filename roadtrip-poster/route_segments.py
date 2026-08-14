#!/usr/bin/env python3
"""
Compute REAL routed road distance for Roadtrip 2026 from roadtrip_segments.csv.

Run this on any machine WITH internet (it is blocked inside the Claude sandbox),
or against a local routing engine. Standard library only — no pip install needed.

USAGE
-----
# 1) Zero-setup, uses the public OSRM demo server (car profile):
python3 route_segments.py

# 2) Against your own local OSRM / Valhalla-compatible OSRM endpoint:
python3 route_segments.py --osrm-url http://localhost:5000

# 3) Slower/polite for the public demo (avoid rate limiting):
python3 route_segments.py --sleep 0.6

OUTPUT
------
- roadtrip_routed_segments.csv   (per segment: routed_km, ratio vs straight-line, flag)
- roadtrip_routed_days.csv        (per day totals)
- routed_total.json               ({ "total_road_km": ..., "method": "OSRM ...", ... })
  -> hand routed_total.json back to genposter2.mjs to stamp the REAL number on the poster.

NOTES
-----
- OSRM 'driving' returns the fastest route and may pick tunnels on LONG legs, but the
  log's short segments start/end ON the pass roads, so passes are largely preserved.
  Any segment whose routed/straight ratio looks off is FLAGGED for a manual look —
  it is never silently trusted.
- For guaranteed pass routing, run a local OSRM/Valhalla built from a Geofabrik
  extract of the Alps/Central Europe; see README for the Docker recipe.
"""
import argparse, csv, json, sys, time, urllib.request, urllib.error, math

def haversine(la1, lo1, la2, lo2):
    R = 6371.0088
    p1, p2 = math.radians(la1), math.radians(la2)
    dp = math.radians(la2 - la1); dl = math.radians(lo2 - lo1)
    a = math.sin(dp/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2*R*math.asin(math.sqrt(a))

def route_osrm(base, la1, lo1, la2, lo2, profile, retries=4):
    url = f"{base}/route/v1/{profile}/{lo1},{la1};{lo2},{la2}?overview=false&alternatives=false&steps=false"
    last = None
    for k in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "roadtrip2026/1.0"})
            with urllib.request.urlopen(req, timeout=30) as r:
                j = json.load(r)
            if j.get("code") == "Ok" and j.get("routes"):
                return j["routes"][0]["distance"] / 1000.0  # meters -> km
            last = j.get("code", "no-route")
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as e:
            last = str(e)
        time.sleep(2 ** k)
    return None  # failed

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--osrm-url", default="https://router.project-osrm.org")
    ap.add_argument("--profile", default="driving")
    ap.add_argument("--sleep", type=float, default=0.3, help="pause between calls (public demo)")
    ap.add_argument("--in", dest="infile", default="roadtrip_segments.csv")
    args = ap.parse_args()

    rows = list(csv.DictReader(open(args.infile)))
    print(f"Routing {len(rows)} segments via {args.osrm_url} ({args.profile}) ...", file=sys.stderr)

    out = []
    total = 0.0
    failures = []
    for i, r in enumerate(rows):
        la1, lo1 = float(r["start_lat"]), float(r["start_lon"])
        la2, lo2 = float(r["end_lat"]), float(r["end_lon"])
        sl = haversine(la1, lo1, la2, lo2)
        km = route_osrm(args.osrm_url, la1, lo1, la2, lo2, args.profile)
        ratio = (km / sl) if (km and sl > 0.05) else None
        flag = ""
        if km is None:
            flag = "ROUTING_FAILED"; failures.append(i)
        elif ratio and (ratio > 3.5 or ratio < 1.0):
            flag = "CHECK_RATIO"  # implausible: inspect this leg by hand
        if km is not None:
            total += km
        out.append({**r, "straight_line_km": round(sl, 1),
                    "routed_km": round(km, 1) if km is not None else "",
                    "ratio": round(ratio, 2) if ratio else "", "flag": flag})
        print(f"  {i:2d} {r['date']} {r['start_time']}  sl {sl:6.1f}  routed "
              f"{('%6.1f' % km) if km is not None else '  FAIL'}  {flag}", file=sys.stderr)
        time.sleep(args.sleep)

    # write per-segment
    with open("roadtrip_routed_segments.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(out[0].keys())); w.writeheader(); w.writerows(out)

    # per day
    days = {}
    for r in out:
        d = days.setdefault(r["date"], {"km": 0.0, "min": 0})
        if r["routed_km"] != "":
            d["km"] += float(r["routed_km"])
    with open("roadtrip_routed_days.csv", "w", newline="") as f:
        w = csv.writer(f); w.writerow(["date", "routed_road_km"])
        for dt in sorted(days): w.writerow([dt, round(days[dt]["km"], 1)])

    summary = {
        "total_road_km": round(total),
        "method": f"OSRM {args.profile} routing per logged GPS segment ({args.osrm_url})",
        "segments_routed": len(rows) - len(failures),
        "segments_failed": failures,
        "note": "Segments flagged CHECK_RATIO or ROUTING_FAILED need a manual look before use.",
    }
    json.dump(summary, open("routed_total.json", "w"), indent=2)
    print("\n==============================", file=sys.stderr)
    print(f"TOTAL ROAD DISTANCE: {round(total)} km", file=sys.stderr)
    if failures: print(f"FAILED segments (rows): {failures}", file=sys.stderr)
    print("Wrote roadtrip_routed_segments.csv, roadtrip_routed_days.csv, routed_total.json", file=sys.stderr)

if __name__ == "__main__":
    main()
