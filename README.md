# 🚙 Roadtrip Companion 2026

Een premium, **offline-first** reisgids-app voor een roadtrip door **Duitsland · Zwitserland ·
Noord-Italië** (Gardameer & Dolomieten). Ontworpen voor dagelijks gebruik op de iPhone tijdens
de reis — mobile-first, dark theme, grote knoppen, perfect leesbaar in fel zonlicht, en met de
kwaliteit van Apple / Porsche / Google Maps in gedachten.

> Range Rover Sport · 4 – 14 augustus 2026

---

## Twee edities

Dit product wordt geleverd in twee edities die dezelfde reisinhoud delen:

| Editie | Map | Wat het is | Voor wie |
|---|---|---|---|
| **App (PWA)** | [`app/`](app/) | Volwaardige Progressive Web App — installeerbaar, offline, met dashboard, Road Captain, kaart en statistieken | Het vlaggenschip; hosten op een (dev)server of installeren op je telefoon |
| **Standalone** | [`standalone/`](standalone/) | Eén zelfstandig HTML-bestand dat overal opent, óók zonder JavaScript | Snel openen/AirDroppen zonder server of build |

Beide gebruiken **echte Google Maps-links** (geen placeholders) en werken **volledig offline**.

---

## App (PWA) — `app/`

De volwaardige webapp. **Stack:** Vue 3 · Vite · TypeScript · Tailwind CSS · Vue Router ·
Pinia · vite-plugin-pwa · Leaflet + OpenStreetMap · Heroicons. Geen backend, statisch te hosten.

```bash
cd app
npm install
npm run dev       # ontwikkelen op http://localhost:5173
npm run build     # productiebuild naar app/dist/
npm run preview   # productiebuild lokaal bekijken
```

**Kern:**
- **Dashboard** met reisvoortgang, dag van vandaag, hotel, volgende stop, ETA en een live
  planningstatus (groen op schema / oranje krap / rood sla bonus over).
- **Road Captain** — vul je werkelijke vertrektijd in en de app berekent aankomst, speling en
  welke stops beter geskipt kunnen worden.
- **Kaart** (Leaflet) met alle stops, hotels en parkeerplaatsen op geverifieerde coördinaten.
- **Per dag** een eigen pagina; **Leitlhof**-highlight met Wellbeing Ritual + countdown;
  **dag 12** met tijdlijn; favorieten, beoordelingen, notities, checklists en statistieken.
- **PWA**: installeerbaar op iPhone/Android, service worker, offline cache.

Details: zie [`app/README.md`](app/README.md).

## Standalone — `standalone/`

Eén bestand — **`standalone/Roadtrip-Companion-2026.html`** — met alle inhoud, CSS, JavaScript
en icoon erin. Open het in Safari/Chrome (of *Deel → Zet op beginscherm*). Werkt ook in viewers
die geen JavaScript uitvoeren. De losse bronbestanden (`index.html`, `styles.css`, `script.js`,
`data.js`) staan ernaast; `node build.mjs` bouwt het standalone bestand opnieuw.

Details: zie [`standalone/README.md`](standalone/README.md).

---

## Reis in het kort

| Datum | Route | Hotel |
|---|---|---|
| 4 aug | Almere → Bernkastel-Kues | Burgblickhotel |
| 5 aug | Bernkastel → Weggis | Hotel Alpenblick |
| 6 aug | Weggis → Desenzano *(Gotthard + Comomeer)* | Hotel Aquila d’Oro |
| 7–10 aug | Gardameer (vrije basisdagen) | Hotel Aquila d’Oro |
| 11 aug | Desenzano → Canazei | Chalet Vites |
| 12 aug | Canazei → San Candido *(de mooiste dag)* | Naturhotel Leitlhof |
| 13 aug | San Candido → Heidelberg | Berggasthof Königstuhl |
| 14 aug | Heidelberg → Almere | thuis |

## Repostructuur

```
.
├── app/          # PWA (Vue 3 + Vite + TS + Tailwind + Pinia + Leaflet)
├── standalone/   # single-file editie + bron (index.html, data.js, build.mjs, …)
└── README.md     # dit overzicht
```

De reisinhoud staat in `standalone/data.js` en wordt door `app/scripts/generate-trip.mjs`
(`npm run data`) omgezet naar `app/src/data/trip.json`, verrijkt met coördinaten en planning.

## Let op

Weer, openingstijden, passen en tolregels kunnen wijzigen — controleer onderweg altijd de
actuele situatie. Deze gids is een slimme metgezel, geen vervanging van live info.
