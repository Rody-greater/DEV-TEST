#!/usr/bin/env python3
import json, math
from datetime import datetime

d = json.load(open('points.json'))
pts = d['points']
home = d['home']  # [lat,lng]

# Build segments: each pt is a drive with begin coord + times. End coord = next begin, last = home.
def haversine(a, b):
    R = 6371.0088
    la1, lo1, la2, lo2 = map(math.radians, [a[0], a[1], b[0], b[1]])
    dla = la2-la1; dlo = lo2-lo1
    h = math.sin(dla/2)**2 + math.cos(la1)*math.cos(la2)*math.sin(dlo/2)**2
    return 2*R*math.asin(math.sqrt(h))

def clean(s):
    return (s.replace('§','ß').replace('þ','').replace('Itali','Italië')
             .replace(',,',',').strip().strip(','))

# country from location string
def country_of(loc):
    l = loc.lower()
    if 'nederland' in l: return 'Netherlands'
    if 'duitsland' in l: return 'Germany'
    if 'zwitserland' in l: return 'Switzerland'
    if 'itali' in l: return 'Italy'
    if 'oostenrijk' in l: return 'Austria'
    return '?'

segs = []
for i, p in enumerate(pts):
    start = (p['lat'], p['lng'])
    end = (pts[i+1]['lat'], pts[i+1]['lng']) if i+1 < len(pts) else (home[0], home[1])
    endloc = pts[i+1]['loc'] if i+1 < len(pts) else 'Dagobertstraat, Almere, Nederland'
    slk = haversine(start, end)
    segs.append({
        'i': i,
        'date': p['b'][:10],
        'start_time': p['b'][11:16],
        'end_time': p['e'][11:16],
        'start_location': clean(p['loc']),
        'end_location': clean(endloc),
        'start_lat': round(start[0],6), 'start_lon': round(start[1],6),
        'end_lat': round(end[0],6), 'end_lon': round(end[1],6),
        'driving_min': p['dur'],
        'straight_km': slk,
        'country': country_of(p['loc']),
    })

# totals
total_min = sum(s['driving_min'] for s in segs)
total_sl = sum(s['straight_km'] for s in segs)
print('segments:', len(segs))
print('total driving time: %dh%02dm  (%d min)' % (total_min//60, total_min%60, total_min))
print('straight-line total: %.1f km' % total_sl)

# countries
countries = []
for s in segs:
    if s['country'] not in countries and s['country'] != '?':
        countries.append(s['country'])
print('countries in order of first appearance:', countries)

# per calendar day
days = {}
for s in segs:
    dd = days.setdefault(s['date'], {'min':0,'sl':0.0,'first':None,'last':None,'segs':0})
    dd['min'] += s['driving_min']; dd['sl'] += s['straight_km']; dd['segs'] += 1
    if dd['first'] is None: dd['first'] = s['start_time']
    dd['last'] = s['end_time']
print('\n--- PER DAY ---')
for dt in sorted(days):
    x = days[dt]
    print('%s  drive %2dh%02dm  sl %6.1f km  %s->%s  (%d segs)' % (
        dt, x['min']//60, x['min']%60, x['sl'], x['first'], x['last'], x['segs']))

# longest day by time and by straight-line
ld_time = max(days.items(), key=lambda kv: kv[1]['min'])
ld_km = max(days.items(), key=lambda kv: kv[1]['sl'])
print('\nLONGEST DAY BY TIME:', ld_time[0], '%dh%02dm' % (ld_time[1]['min']//60, ld_time[1]['min']%60))
print('LONGEST DAY BY STRAIGHT-KM:', ld_km[0], '%.1f km' % ld_km[1]['sl'])

# number of distinct calendar days & span
alldates = sorted(days)
print('\ndistinct driving dates:', len(alldates), alldates[0], '->', alldates[-1])

# alpine pass evidence from location strings
print('\n--- ALPINE PASS / HIGH-ROUTE EVIDENCE (from location names in data) ---')
keys = ['gottardo','gotthard','sella','gardena','carezza','costalunga','pordoi','fedaia',
        'fernpass','falzarego','giau','valparola','stelvio','bernina','furka','grimsel',
        'cortina','braies','canazei','passo']
for s in segs:
    ll = (s['start_location']+' '+s['end_location']).lower()
    hit = [k for k in keys if k in ll]
    if hit:
        print('  seg %2d %s %s  %s -> %s   [%s]' % (
            s['i'], s['date'], s['start_time'], s['start_location'][:34], s['end_location'][:30], ','.join(sorted(set(hit)))))

json.dump({'segments':segs,'days':days,'total_min':total_min,'total_sl':total_sl,
           'countries':countries}, open('analysis.json','w'), indent=1, ensure_ascii=False)
