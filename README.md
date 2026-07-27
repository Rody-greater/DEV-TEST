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
| **`Roadtrip-Companion-2026.html`** | **👉 Dit openen op je telefoon.** Één zelfstandig bestand — alle inhoud, CSS, JS en icoon zitten erin. |
| `index.html` | Zelfde inhoud, maar verwijst naar de losse `styles.css` / `script.js` (voor ontwikkelen) |
| `styles.css` | Volledige premium dark-theme styling |
| `script.js` | Progressive-enhancement laag (voortgang opslaan, swipe, GPS-knoppen) |
| `data.js` | Alle reisdata (dagen, stops, hotels, checklists) — de enige bron |
| `build.mjs` | Bouwt `index.html` + het standalone bestand vanuit `data.js` |
| `assets/icon.svg` | App-icoon (favicon / touch-icon) |
| `README.md` | Deze uitleg |

Geen backend, geen frameworks. Puur **HTML5 + CSS + vanilla JavaScript**.

### Werkt óók zonder JavaScript

De hele inhoud staat vooraf in de HTML (pre-rendered). De dagtabs (CSS-radio's), de
uitklap-kaarten (native `<details>`), de checkboxes en alle Google Maps-links werken **zonder
JavaScript** — dus ook in een in-app bestandsviewer die geen scripts uitvoert. JavaScript voegt
alleen extra's toe: voortgang bewaren, swipe-navigatie, actieve-tab-sync en de GPS-snelacties.

## Gebruiken — belangrijk

Gebruik **`Roadtrip-Companion-2026.html`**: dat is één losstaand bestand dat je overal kunt
openen zonder de andere bestanden ernaast.

1. Download / AirDrop het bestand naar je iPhone.
2. Open het **in Safari of Chrome** (Bestanden-app → tik op het bestand → open in browser).
3. Optioneel: *Deel → Zet op beginscherm* voor een volledig-schermse offline app.

> ⚠️ Zie je alleen de **broncode** in plaats van de pagina? Dan bekijk je het bestand als
> tekst (bijv. de GitHub-bronweergave of een tekst-/preview-viewer). Download het bestand en
> open het in een **webbrowser** — dan rendert de pagina.

## Aanpassen & opnieuw bouwen

Alle inhoud staat in **`data.js`** (de `DAYS`-array en `CHECKLISTS`). Wijzig daar een dag,
stop, hotel of tijd, en bouw daarna opnieuw:

```
node build.mjs
```

Dat genereert `index.html` én `Roadtrip-Companion-2026.html` opnieuw. Google Maps-links komen uit
echte plaatsnamen via `mapsSearch()` / `mapsDir()` — geen placeholders.

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
