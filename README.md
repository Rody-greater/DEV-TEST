# Roadtrip Companion 2026

Een premium, volledig **offline** roadtrip-gids voor mobiel gebruik tijdens een reis door
Duitsland → Zwitserland → Noord-Italië (Gardameer & Dolomieten) → terug via Heidelberg.

Gebouwd als een strakke, donkere companion-app in de geest van Apple, Porsche, Land Rover
en Google Maps — mobile-first, grote knoppen, perfect leesbaar in fel zonlicht.

> Rijd je zelf met de Range Rover Sport deze route? Dan is dit wat je onderweg wil kunnen
> aantikken: één tik naar de parking, de fotospot, het tankstation of het hotel.

---

## Bestanden

| Bestand | Inhoud |
|---|---|
| `index.html` | Structuur / shell (header, tabs, main, floating dock) |
| `styles.css` | Volledige premium dark-theme styling |
| `script.js` | Data-model van de hele reis + rendering-engine + logica |
| `assets/icon.svg` | App-icoon (favicon / touch-icon) |
| `README.md` | Deze uitleg |

Geen backend, geen frameworks, geen build-stap. Puur **HTML5 + CSS + vanilla JavaScript**.

## Gebruiken

Open `index.html` in een browser — that's it. Werkt op de iPhone via *Deel → Zet op
beginscherm* als volledig-schermse web-app (offline).

Alle bestanden zijn relatief gelinkt, dus de map werkt ook zonder internet.

## Functies

- **Dagtabs** met swipe-navigatie (veeg links/rechts) — 7 rijdagen + tab *Praktisch*.
- **Per dag:** afstand, rijtijd, vertrektijd, verwachte aankomst, weer-note, "bij slecht weer"-alternatief,
  comfort- én epic-route (Google Maps), restauranttips, tankadvies, GoPro-momenten en fotospots.
- **Elke stop** (accordion): ⭐-beoordeling, gemiddelde bezoektijd, beste moment van de dag,
  parkeerlocatie, navigatie-knop en fotospot-knop — allemaal echte Google Maps-links.
- **Must-do systeem:** 🟥 Must · 🟧 Leuk · 🟩 Bonus, met grote checkboxes.
- **Voortgang** wordt opgeslagen in `localStorage` (blijft bewaard op het toestel).
- **Modulaire Gardameer-dagen (6–10 aug):** geen vaste planning, een pool van bestemmingen
  (Sirmione, Limone, Malcesine, Monte Baldo, Riva del Garda, Lago di Tenno, Lago di Molveno)
  waaruit je zelf kiest.
- **Dag 12 (hoogtepunt):** extra uitgebreid met een tijdlijn, aanbevolen vertrektijd om
  relaxed vóór 16:00 aan te komen, en de aparte knop **"Navigeer naar P2"** voor de geboekte
  parking bij Lago di Braies.
- **Leitlhof wellness-kaart:** Wellbeing Ritual 17:00 (geboekt), spa-openingstijden, zwembad,
  sauna, textielvrij-uitleg en massage-tip.
- **Floating snelacties:** 📍 Ik ben hier · 🍝 Restaurant · ☕ Koffie · ⛽ Tankstation ·
  📸 Fotospot — openen Google Maps op basis van je huidige GPS-locatie.
- **Praktisch tabblad:** checklists voor documenten, auto en tol/vignetten.

## Reis in het kort

| Datum | Route | Hotel |
|---|---|---|
| 4 aug | Almere → Bernkastel-Kues | Burgblickhotel |
| 5 aug | Bernkastel → Weggis | Hotel Alpenblick |
| 6–10 aug | Gardameer (basis Desenzano) | Hotel Aquila d’Oro |
| 11 aug | Desenzano → Canazei | Chalet Vites |
| 12 aug | Canazei → San Candido *(de mooiste dag)* | Naturhotel Leitlhof |
| 13 aug | San Candido → Heidelberg | Berggasthof Königstuhl |
| 14 aug | Heidelberg → Almere | thuis |

## Aanpassen

Alle inhoud staat in één `DAYS`-array bovenaan `script.js`. Een dag of stop toevoegen/wijzigen
doe je daar; de UI bouwt zichzelf opnieuw op. Google Maps-links worden gegenereerd uit echte
plaatsnamen via de helpers `mapsSearch()` en `mapsDir()` — geen placeholders.

## Let op

Weer, openingstijden, wegen (passen!) en tolregels kunnen wijzigen. Controleer onderweg altijd
de actuele situatie; deze gids is bedoeld als slimme metgezel, niet als vervanging van live info.
