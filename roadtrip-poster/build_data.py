#!/usr/bin/env python3
import json, csv

a = json.load(open('analysis.json'))
segs = a['segments']
PASS = {11,12,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34}

def factor(s):
    sl = s['straight_km']; i = s['i']
    # Steep multiplier ONLY for genuinely short alpine hairpin sections; long legs
    # that merely start/end near a pass are mostly valley/motorway road.
    if i in PASS and sl < 25:  return 1.85   # true switchback sections
    if i in PASS:              return 1.35   # transalpine haul (valley + some winding)
    if sl >= 120:              return 1.13   # pure motorway
    if sl >= 60:               return 1.22   # motorway-dominant
    if sl < 10:                return 1.40   # short local hops
    return 1.33                               # mixed cross-country

# ---- segments.csv ----
tot_est = 0.0
with open('roadtrip_segments.csv', 'w', newline='') as f:
    w = csv.writer(f)
    w.writerow(['date','start_time','end_time','start_location','end_location',
                'start_lat','start_lon','end_lat','end_lon',
                'driving_time','straight_line_km','estimated_road_km','detour_factor'])
    for s in segs:
        fac = factor(s)
        est = s['straight_km'] * fac
        tot_est += est
        dm = int(s['driving_min'])
        w.writerow([s['date'], s['start_time'], s['end_time'],
                    s['start_location'], s['end_location'],
                    s['start_lat'], s['start_lon'], s['end_lat'], s['end_lon'],
                    '%dh%02dm' % (dm//60, dm%60),
                    round(s['straight_km'],1), round(est,1), fac])

# ---- days.csv ----
days = {}
for s in segs:
    fac = factor(s)
    d = days.setdefault(s['date'], {'min':0,'sl':0.0,'est':0.0,'first':None,'last':None})
    d['min'] += s['driving_min']; d['sl'] += s['straight_km']; d['est'] += s['straight_km']*fac
    if d['first'] is None: d['first'] = s['start_time']
    d['last'] = s['end_time']
with open('roadtrip_days.csv','w',newline='') as f:
    w = csv.writer(f)
    w.writerow(['date','total_straight_line_km','total_estimated_road_km',
                'total_driving_time','first_departure','final_arrival'])
    for dt in sorted(days):
        d = days[dt]; m = int(d['min'])
        w.writerow([dt, round(d['sl'],1), round(d['est'],1),
                    '%dh%02dm' % (m//60, m%60), d['first'], d['last']])

# longest day (13 Aug) est km
longest = max(days.items(), key=lambda kv: kv[1]['min'])
ld_date, ld = longest
ld_min = int(ld['min'])

# ---- stats.json ----
stats = {
  "title": "Roadtrip 2026",
  "subtitle": "The road was the destination",
  "period": "4 — 13 August 2026",
  "source": "Trips.csv.pdf",
  "total_distance_km": round(tot_est),
  "distance_method": ("Estimated road distance. No live routing engine (OSRM/ORS/GraphHopper) "
     "was reachable in this offline environment, so each logged GPS segment's straight-line "
     "(geodesic) distance was multiplied by a calibrated detour factor by segment type: "
     "short alpine hairpin sections (<25 km) x1.85, other transalpine legs x1.35, "
     "pure motorway (>=120 km) x1.13, motorway-dominant (>=60 km) x1.22, short local hops (<10 km) x1.40, "
     "mixed cross-country x1.33. This is an estimate, NOT turn-by-turn routed distance and "
     "NOT raw straight-line distance. Measured straight-line lower bound = %d km. "
     "Validation: Almere->Heerlen est 206 km (real ~200), San Candido->Reutte est 194 km (real ~185), "
     "return day est 1048 km (real ~1050)." % round(a['total_sl'])),
  "straight_line_km_lower_bound": round(a['total_sl']),
  "total_driving_time": "39h08m",
  "total_driving_time_minutes": int(a['total_min']),
  "number_of_days": 10,
  "countries": ["Netherlands","Germany","Switzerland","Italy","Austria"],
  "number_of_countries": 5,
  "first_departure": "2026-08-04 08:02",
  "final_arrival": "2026-08-13 21:05",
  "highest_point_m": 2244,
  "highest_point_location": "Passo Sella / Sellajoch (SS242), Dolomites, Italy",
  "highest_point_method": ("Published road-summit elevation of the highest NAMED pass proven driven in "
     "the GPS log (the log records the car on 'Strada Statale di Val Gardena e Passo Sella'). "
     "Higher than the Gotthard Pass (2106 m) shown on the previous poster."),
  "longest_day_date": ld_date,
  "longest_day_driving_time": "%dh%02dm" % (ld_min//60, ld_min%60),
  "longest_day_estimated_road_km": round(ld['est']),
  "longest_day_straight_line_km": round(ld['sl']),
  "major_alpine_passes": [
    {"name":"Gotthardpass / Passo del San Gottardo","date":"2026-08-06","max_elevation_m":2106,
     "evidence":"Log point 'Ospizio San Gottardo, 6780 Airolo' (pass hospice at summit)"},
    {"name":"Passo di Costalunga / Karerpass","date":"2026-08-11","max_elevation_m":1745,
     "evidence":"Log road 'Strada Carezza, Nova Levante' (SS241 pass road)"},
    {"name":"Passo Sella / Sellajoch","date":"2026-08-11","max_elevation_m":2244,
     "evidence":"Log road 'Strada Statale di Val Gardena e Passo Sella' (SS242), crossed both ways"},
    {"name":"Passo Gardena / Grödner Joch","date":"2026-08-12","max_elevation_m":2121,
     "evidence":"Log road 'Strada Statale del Passo Gardena' (SS243)"},
    {"name":"Fernpass","date":"2026-08-13","max_elevation_m":1216,
     "evidence":"Log 'Fernpassstraße 25, 6600 Reutte' (B179 pass road)"}
  ],
  "number_of_alpine_passes": 5
}
json.dump(stats, open('roadtrip_stats.json','w'), indent=2, ensure_ascii=False)

print('total estimated road km:', round(tot_est))
print('longest day:', ld_date, '%dh%02dm' % (ld_min//60, ld_min%60), 'est', round(ld['est']),'km  sl',round(ld['sl']),'km')
print('files: roadtrip_stats.json, roadtrip_segments.csv, roadtrip_days.csv')
