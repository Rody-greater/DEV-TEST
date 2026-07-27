# Roadtrip Companion — PWA

Een premium, **offline-first Progressive Web App** voor een roadtrip door Duitsland,
Zwitserland en Noord-Italië (Gardameer & Dolomieten). Gebouwd als echte webapp — geen
losse HTML-pagina.

**Stack:** Vue 3 · Vite · TypeScript · Tailwind CSS · Vue Router · Pinia · vite-plugin-pwa ·
Leaflet + OpenStreetMap · Heroicons. Geen backend — volledig statisch te hosten.

---

## Snel starten

```bash
cd app
npm install
npm run dev          # ontwikkelserver op http://localhost:5173
```

Andere scripts:

```bash
npm run build        # type-check (vue-tsc) + productie-build naar dist/
npm run preview      # bekijk de productie-build lokaal
npm run data         # genereer src/data/trip.json opnieuw uit ../standalone/data.js
```

## Deployen naar je eigen ontwikkelserver

```bash
npm run build
```

Upload de inhoud van **`dist/`** naar een willekeurige statische webserver (Nginx, Caddy,
Apache, of `npx serve dist`). De app gebruikt **hash-routing** en een relatieve `base`, dus
hij werkt vanuit elke (sub)map zonder server-side rewrites. De service worker en het
web-app-manifest worden automatisch meegebouwd, waardoor de app **installeerbaar** is op
iPhone en Android en **offline** blijft werken.

> Tip iPhone: open de gehoste URL in Safari → *Deel → Zet op beginscherm*.

## Projectstructuur

```
app/
├── index.html
├── vite.config.ts            # Vite + PWA-config (manifest, service worker, tile-cache)
├── tailwind.config.js        # dark theme + Land Rover Bronze palet
├── scripts/generate-trip.mjs # bouwt trip.json (content + coördinaten + planning)
├── public/
│   ├── favicon.svg
│   └── icons/                # PWA-iconen (192/512/maskable/apple-touch)
└── src/
    ├── main.ts, App.vue
    ├── router/               # Vue Router (hash history)
    ├── stores/               # Pinia: trip (data) + user (voortgang, favorieten, notities)
    ├── composables/          # useRoadCaptain, useTripStatus, useNow, useMaps
    ├── components/           # ui/ · trip/ · map/ · layout/
    ├── views/                # Home, Days, Day, Map, Hotels, Hotel, Leitlhof,
    │                         #   Checklists, Favorites, Stats, Practical, More
    ├── data/trip.json        # alle routegegevens (gegenereerd)
    └── types/trip.ts         # TypeScript-types
```

## Functionaliteit

- **Dashboard (Home):** reisvoortgang, dagnummer, hotel van vandaag, volgende stop,
  vertrek/ETA, voortgangsring, countdown naar het Wellbeing Ritual en een **planningstatus**
  (groen “op schema” / oranje “krap” / rood “sla bonusstops over”).
- **Reisdagen:** elke dag een eigen pagina met samenvatting, route (comfort + epic met
  rijtijden), must/nice/bonus, restaurants, GoPro-momenten, fotospots, hotel en checklists.
- **Road Captain (live):** vul je **werkelijke vertrektijd** in en geef per stop de status
  (niet bezocht / aangekomen / vertrokken / overgeslagen). De app rekent live opnieuw:
  verwachte aankomst, speling, resterende stops en contextuele adviezen. Status volgt de
  speling (🟢 ruim > 60 min · 🟢 op schema 30–60 · 🟡 let op 15–30 · 🟠 krap 0–15 ·
  🔴 achter < 0), dus op de standaardvertrektijd nooit “krap” bij positieve speling.
  Optioneel GPS: binnen ~100 m van een stop stelt de app “ben je aangekomen?” voor
  (bevestiging vereist, werkt offline). Aankomst-/vertrektijden en verblijftijd worden
  lokaal bewaard.
- **Kaart (Leaflet):** alle stops, hotels en parkeerplaatsen met echte coördinaten;
  klik op een marker voor navigeren/parkeren. Tiles worden offline gecachet.
- **Leitlhof-highlight:** Wellbeing Ritual (17:00, geboekt) met countdown, spa/sauna/zwembad,
  textielvrije uitleg, massage-tip en vertrekadvies.
- **Dag 12:** speciale tijdlijn (07:30 → 17:00) met realtime Road-Captain-advies.
- **Favorieten, beoordelingen & notities** per stop; **statistieken** na de reis.
- **Checklists** per dag en algemeen (documenten, auto, tol) — alles lokaal opgeslagen.

## Data

Alle inhoud staat in `src/data/trip.json`. De bron is `../standalone/data.js`;
`npm run data` genereert de JSON opnieuw en verrijkt met geverifieerde coördinaten en
Road-Captain-planning. Google Maps opent altijd extern met echte locaties — geen placeholders.

## Offline

Voortgang, favorieten, beoordelingen, notities en ingevulde vertrektijden staan in
LocalStorage. De app-shell en kaarttiles worden door de service worker gecachet, zodat de
hele app offline werkt. Alleen Google Maps opent extern.
