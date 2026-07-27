/* =========================================================
   generate-trip.mjs
   Bouwt src/data/trip.json vanuit de bron ../data.js en verrijkt
   met echte coördinaten, dagdatums en Road-Captain planning.
   Run:  npm run data
   ========================================================= */
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const { DAYS, CHECKLISTS } = await import(resolve(__dirname, '../../data.js'))

/* ---- echte coördinaten (geverifieerde, bekende locaties) ---- */
const COORDS = {
  'Monschau Altstadt': [50.5528, 6.2447],
  'Nürburgring — Boulevard': [50.3350, 6.9470],
  'Cochem aan de Moezel': [50.1461, 7.1673],
  'Geierlay hangbrug': [50.0161, 7.4136],
  'Burgblickhotel': [49.9130, 7.0706],
  'Rheinfall': [47.6779, 8.6151],
  'Luzern — Kapellbrücke & meer': [47.0516, 8.3076],
  'Baden-Baden': [48.7606, 8.2396],
  'Weggis Seepromenade': [47.0336, 8.4333],
  'Hotel Alpenblick': [47.0338, 8.4310],
  'Gotthardpas': [46.5556, 8.5656],
  'Oude Tremola': [46.5350, 8.5650],
  'Axenstrasse / Flüelen': [46.9019, 8.6247],
  'Menaggio (Comomeer)': [46.0206, 9.2380],
  'Lecco waterfront': [45.8566, 9.3977],
  'Hotel Aquila d’Oro': [45.4692, 10.5357],
  'Sirmione': [45.4959, 10.6068],
  'Limone sul Garda': [45.8130, 10.7920],
  'Malcesine': [45.7658, 10.8078],
  'Monte Baldo (kabelbaan)': [45.7647, 10.8090],
  'Riva del Garda': [45.8856, 10.8407],
  'Lago di Tenno': [45.9182, 10.8280],
  'Lago di Molveno': [46.1408, 10.9640],
  'Lago di Carezza': [46.4090, 11.5770],
  'Passo di Costalunga': [46.4083, 11.6110],
  'Passo Sella': [46.5107, 11.7580],
  'Val di Fassa / Canazei dorp': [46.4767, 11.7700],
  'Chalet Vites': [46.4767, 11.7700],
  'Passo Gardena (Grödner Joch)': [46.5497, 11.8100],
  'Passo Falzarego': [46.5192, 12.0110],
  'Lago di Misurina': [46.5822, 12.2540],
  'Lago di Braies — P2 geboekt': [46.7000, 12.0850],
  'Lagazuoi kabelbaan': [46.5192, 12.0100],
  'Rifugio-stop naar keuze': [46.5180, 12.0050],
  'Naturhotel Leitlhof': [46.7360, 12.2790],
  'Innsbruck — lunchstop': [47.2692, 11.4041],
  'Heidelberg — Altstadt & Schloss': [49.4106, 8.7156],
  'Vipiteno / Sterzing': [46.8969, 11.4300],
  'Alte Brücke Heidelberg': [49.4128, 8.7106],
  'Berggasthof Königstuhl': [49.3986, 8.7264],
  'Köln — Dom & Rijnboulevard': [50.9413, 6.9583],
  'Designer Outlet Roermond': [51.1889, 5.9770],
  'Thuis in Almere': [52.3508, 5.2647],
  'Thuis · Almere': [52.3508, 5.2647]
}

/* dag → datum (ISO). De pool-dag beslaat 7 t/m 10 aug. */
const DATES = ['2026-08-04','2026-08-05','2026-08-06','2026-08-07','2026-08-11','2026-08-12','2026-08-13','2026-08-14']
const END_DATES = { 'gardapool': '2026-08-10' }

/* ---- helpers ---- */
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
const num = s => { const m = String(s).match(/\d+(?:[.,]\d+)?/g); return m ? m.map(x => parseFloat(x.replace(',','.'))) : [] }

function dwellMinutes(time){
  if (!time) return 45
  const t = time.toLowerCase()
  if (t.includes('—') || t === '-' ) return 0
  if (t.includes('halve dag')) return 240
  if (t.includes('als tijd over') || t.includes('naar keuze')) return 45
  if (t.includes('avond')) return 90
  const n = num(t)
  if (t.includes('uur')) { const v = n.length ? (n.reduce((a,b)=>a+b,0)/n.length) : 1; return Math.round(v*60) }
  if (t.includes('min')) { const v = n.length ? (n.reduce((a,b)=>a+b,0)/n.length) : 45; return Math.round(v) }
  return n.length ? Math.round(n.reduce((a,b)=>a+b,0)/n.length) : 45
}
function driveMinutes(str){
  if (!str) return 0
  const hM = str.match(/(\d+)\s*u(?:\s*(\d+))?/)
  if (hM) return parseInt(hM[1],10)*60 + (hM[2]?parseInt(hM[2],10):0)
  const rangeH = str.match(/(\d+)\s*[–-]\s*(\d+)\s*u/)
  if (rangeH) return Math.round(((+rangeH[1]) + (+rangeH[2]))/2*60)
  return 0
}
function toClock(str){ const m = String(str).match(/(\d{1,2}):(\d{2})/); return m ? `${m[1].padStart(2,'0')}:${m[2]}` : null }

/* ---- transformeer één stop ---- */
function stop(dayId, category, s){
  return {
    id: `${dayId}:${slug(s.title)}`,
    title: s.title,
    emoji: s.emoji,
    category,                       // must | nice | bonus | pool
    stars: s.stars,
    time: s.time,
    dwellMin: dwellMinutes(s.time),
    best: s.best || null,
    weather: s.weather || null,
    warning: s.warning || null,
    desc: s.desc,
    tip: s.tip || null,
    nav: s.nav || s.title.split(/ — | \/ | \(/)[0].trim(),
    parking: s.parking || null,
    photo: s.photo || null,
    special: s.special || null,
    coord: COORDS[s.title] || null
  }
}

/* ---- bouw dagen ---- */
const days = DAYS.map((d, i) => {
  const stops = []
  if (d.isPool) {
    d.pool.forEach(s => stops.push(stop(d.id, 'pool', s)))
  } else {
    ;(d.cats.must  || []).forEach(s => stops.push(stop(d.id, 'must',  s)))
    ;(d.cats.nice  || []).forEach(s => stops.push(stop(d.id, 'nice',  s)))
    ;(d.cats.bonus || []).forEach(s => stops.push(stop(d.id, 'bonus', s)))
  }

  const hotel = d.hotel ? {
    id: slug(d.hotel.name),
    name: d.hotel.name,
    booked: !!d.hotel.booked,
    bookedLabel: d.hotel.bookedLabel || 'geboekt',
    address: d.hotel.address,
    mapsQuery: d.hotel.mapsQuery,
    website: d.hotel.website || null,
    bookingQuery: d.hotel.bookingQuery || null,
    checkin: d.hotel.checkin,
    parking: d.hotel.parking,
    ev: d.hotel.ev,
    restaurant: d.hotel.restaurant,
    wellness: d.hotel.wellness,
    coord: COORDS[d.hotel.name] || null
  } : null

  // Road-Captain planning (niet voor de vrije pool-dag)
  let planning = null
  if (!d.isPool && d.route) {
    planning = {
      departDefault: toClock(d.depart) || '08:00',
      targetArrival: toClock(d.arrive) || null,
      driveMin: driveMinutes(d.driveEpic) || driveMinutes(d.drive),
      buffer: 30,
      appointment: d.wellness ? { label: 'Wellbeing Ritual', time: d.wellness.ritualTime } : null,
      stops: stops.map(s => ({ id: s.id, title: s.title, category: s.category, dwellMin: s.dwellMin, optional: s.category !== 'must' }))
    }
  }

  return {
    id: d.id,
    index: i,
    tabNumber: d.tab.n,
    tabLabel: d.tab.label,
    date: DATES[i],
    endDate: END_DATES[d.id] || DATES[i],
    isPool: !!d.isPool,
    isEpic: !!d.isEpic,
    eyebrow: d.eyebrow,
    title: d.title,
    subtitle: d.subtitle,
    poolIntro: d.poolIntro || null,
    km: d.km,
    drive: d.drive,
    driveComfort: d.driveComfort || null,
    driveEpic: d.driveEpic || null,
    depart: toClock(d.depart) || d.depart,
    arrive: d.arrive,
    weather: d.weather || null,
    badWeather: d.badWeather || null,
    advice: d.advice || null,
    departAdvice: d.departAdvice || null,
    route: d.route ? { origin: d.route.origin, dest: d.route.dest, epic: d.route.epic } : null,
    timeline: d.timeline || null,
    wellness: d.wellness || null,
    stops,
    restaurants: d.restaurants || [],
    gopro: d.gopro || [],
    fotospots: d.fotospots || [],
    fuel: d.fuel || null,
    hotel,
    planning
  }
})

const trip = {
  meta: {
    title: 'Roadtrip Companion 2026',
    subtitle: 'Duitsland · Zwitserland · Noord-Italië',
    startDate: '2026-08-04',
    endDate: '2026-08-14',
    car: 'Range Rover Sport'
  },
  days,
  checklists: CHECKLISTS.map(g => ({ id: slug(g.title), icon: g.icon, title: g.title, items: g.items }))
}

mkdirSync(resolve(__dirname, '../src/data'), { recursive: true })
writeFileSync(resolve(__dirname, '../src/data/trip.json'), JSON.stringify(trip, null, 2))
const stopCount = days.reduce((a, d) => a + d.stops.length, 0)
console.log(`trip.json geschreven — ${days.length} dagen, ${stopCount} stops, ${trip.checklists.length} checklists`)
