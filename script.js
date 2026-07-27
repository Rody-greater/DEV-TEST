/* =========================================================
   Roadtrip Companion 2026
   Vanilla JS · offline · LocalStorage · data-driven renderer
   ========================================================= */
'use strict';

/* ---------- Google Maps helpers (echte locaties, geen placeholders) ---------- */
const enc = s => encodeURIComponent(s);
const mapsSearch = q => `https://www.google.com/maps/search/?api=1&query=${enc(q)}`;
const mapsDir = (origin, destination, waypoints) => {
  let u = `https://www.google.com/maps/dir/?api=1&origin=${enc(origin)}&destination=${enc(destination)}&travelmode=driving`;
  if (waypoints && waypoints.length) u += `&waypoints=${waypoints.map(enc).join('|')}`;
  return u;
};
const gsearch = q => `https://www.google.com/search?q=${enc(q)}`;
const booking = q => `https://www.booking.com/searchresults.nl.html?ss=${enc(q)}`;

/* ---------- Hotel factory ---------- */
const hotel = o => o;

/* =========================================================
   DATA — de complete reis
   ========================================================= */
const DAYS = [

/* ============ DAG 1 · 4 augustus ============ */
{
  tab:{n:'1', label:'4 aug'}, id:'d1',
  eyebrow:'Dinsdag 4 augustus · Dag 1',
  title:'Almere → Bernkastel-Kues',
  subtitle:'Warmdraaien door de Eifel en de Moezel',
  route:{origin:'Almere, Nederland', dest:'Burgblickhotel, Bernkastel-Kues, Duitsland',
         epic:['Monschau, Duitsland','Nürburgring, Nürburg, Duitsland','Cochem, Duitsland']},
  km:'± 415 km', drive:'4 u 20 (rijden)', depart:'08:30', arrive:'± 16:30',
  weather:'Zomers en warm in het dal (25–30°). In de Eifel kan het rond de middag onweren — plan Monschau daarom vroeg.',
  badWeather:'Bij regen: sla Geierlay over (glad op de brug) en maak van Cochem je overdekte koffie- en lunchstop.',
  advice:'Monschau en de Nürburgring altijd meepakken. Cochem alleen als je energie over hebt — anders rechtstreeks naar de Moezel.',
  cats:{
    must:[
      {emoji:'🏘️', title:'Monschau Altstadt', stars:5, time:'60–75 min', best:'Ochtend, vóór de bussen',
       parking:'Parkhaus Au Monschau', photo:'Rotes Haus Monschau',
       desc:'Perfecte eerste stop: vakwerkhuizen tegen de rotswand, de Rur die dwars door het stadje loopt en compact genoeg om niet je halve dag te kosten.',
       tip:'Parkeer bij P Au en loop langs de rivier het centrum in — mooiste aanblik en je auto staat in de schaduw.'},
      {emoji:'🏁', title:'Nürburgring — Boulevard', stars:5, time:'45–60 min', best:'Late ochtend',
       parking:'Nürburgring Grand-Prix-Strecke Parkplatz', photo:'Nürburgring Boulevard',
       desc:'Je rijdt een Range Rover Sport door de Eifel en komt er praktisch langs. Even de Boulevard op, de pitstraat ruiken en verder. Overslaan zou raar zijn.',
       tip:'GoPro: monteer de suction mount op de motorkap vóór je de aanrijroute door het bos neemt — dat stuk is filmisch.'}
    ],
    nice:[
      {emoji:'🏰', title:'Cochem aan de Moezel', stars:4, time:'60–90 min', best:'Namiddag',
       parking:'Parkplatz Endertplatz Cochem', photo:'Reichsburg Cochem',
       desc:'Reichsburg hoog boven de Moezel, een compact wijnstadje en de eerste echte vakantie-vibe. Fijne plek voor een late lunch.',
       tip:'Rijd de Moezelroute (B49) langs het water i.p.v. de snelweg — het laatste half uur naar het hotel is dan al genieten.'}
    ],
    bonus:[
      {emoji:'🌉', title:'Geierlay hangbrug', stars:4, time:'75–90 min', best:'Droog, helder weer',
       parking:'Besucherzentrum Geierlay Mörsdorf', photo:'Geierlay Hängeseilbrücke',
       weather:'Alleen bij droog weer',
       desc:'360 meter hangbrug over een groen dal. Spectaculair, maar je bent relatief veel tijd kwijt aan parkeren en de wandeling er naartoe.',
       tip:'Alleen doen als je vóór 15:00 bij Mörsdorf bent — anders schuift het diner te ver op.'}
    ]
  },
  restaurants:[
    {t:'Lunch · Monschau', q:'restaurant Altstadt Monschau'},
    {t:'Moezel-diner · Bernkastel', q:'restaurant Altstadt Bernkastel-Kues'},
    {t:'Wijnstube', q:'Weinstube Bernkastel-Kues'}
  ],
  gopro:[
    {t:'Aanrijroute Nürburgring (bos)', q:'Nürburgring Nordschleife'},
    {t:'Moezelroute B49 langs het water', q:'Moezelroute B49 Cochem'}
  ],
  fotospots:[
    {t:'Rurbrücke Monschau', q:'Rurbrücke Monschau'},
    {t:'Reichsburg viewpoint', q:'Reichsburg Cochem viewpoint'},
    {t:'Wijngaarden bij Bernkastel', q:'Bernkasteler Doctor Weinberg'}
  ],
  fuel:'Tank vol in Nederland of vlak over de grens — brandstof in NL/DE is deze dag het voordeligst. Ligt de route langs Luxemburg, dan is dáár tanken het goedkoopst van de hele reis.',
  hotel: hotel({
    name:'Burgblickhotel', booked:true,
    address:'Bernkastel-Kues, Moezel · Duitsland',
    mapsQuery:'Burgblickhotel Bernkastel-Kues',
    website:'Burgblickhotel Bernkastel-Kues', bookingQuery:'Burgblickhotel Bernkastel-Kues',
    checkin:'vanaf 15:00', parking:'Eigen parkeerplaats', ev:'Laadpunten in Bernkastel-Kues centrum',
    restaurant:'Regionale Moezelkeuken', wellness:'—'
  })
},

/* ============ DAG 2 · 5 augustus ============ */
{
  tab:{n:'2', label:'5 aug'}, id:'d2',
  eyebrow:'Woensdag 5 augustus · Dag 2',
  title:'Bernkastel-Kues → Weggis',
  subtitle:'Van de Moezel naar het Vierwoudstrekenmeer',
  route:{origin:'Bernkastel-Kues, Duitsland', dest:'Hotel Alpenblick, Weggis, Zwitserland',
         epic:['Baden-Baden, Duitsland','Rheinfall, Schaffhausen, Zwitserland','Luzern, Zwitserland']},
  km:'± 490 km', drive:'5 u (rijden)', depart:'08:00', arrive:'± 17:30',
  weather:'Kans op stapelwolken boven de Alpen in de namiddag. Rheinfall is ook bij bewolking indrukwekkend; Luzern het mooist met avondlicht.',
  badWeather:'Bij aanhoudende regen: sla de Rheinfall-lus over, rijd door de tunnel richting Luzern en check vroeg in bij Alpenblick.',
  advice:'Rheinfall is de hoofdstop. Luzern compact meepakken (Kapellbrücke + meer), anders wordt dit een lange dag.',
  cats:{
    must:[
      {emoji:'🌊', title:'Rheinfall', stars:5, time:'45–60 min', best:'Rond het middaguur',
       parking:'Rheinfall Parkplatz Schloss Laufen', photo:'Schloss Laufen am Rheinfall',
       desc:'De grootste waterval van Europa, en precies het soort natuurgeweld waarvoor je zo’n reis maakt. Vanaf Schloss Laufen sta je er bovenop.',
       tip:'Parkeer aan de Schloss-Laufen-kant (zuid) — rustiger, mooiste uitzichtplatforms en direct aan de A4.'},
      {emoji:'🏙️', title:'Luzern — Kapellbrücke & meer', stars:5, time:'60–90 min', best:'Namiddag / avondlicht',
       parking:'Parkhaus Altstadt Luzern', photo:'Kapellbrücke Luzern',
       desc:'Houten Kapellbrücke, de oude stad en het meer met bergpanorama in één compacte stop. De ideale opmaat naar Weggis.',
       tip:'Vignette-check: je hebt de Zwitserse autobahnvignette nodig vóór de grens (zie tab Praktisch).'}
    ],
    nice:[
      {emoji:'♨️', title:'Baden-Baden', stars:3, time:'45–60 min', best:'Late ochtend',
       parking:'Parkgarage Kurhaus Baden-Baden', photo:'Lichtentaler Allee Baden-Baden',
       desc:'Een beschaafde koffiestop met een wandeling door de Lichtentaler Allee — veel prettiger dan een tankstation langs de A5.',
       tip:'Kort houden: even benen strekken, koffie, en door richting de grens.'}
    ],
    bonus:[
      {emoji:'🌅', title:'Weggis Seepromenade', stars:4, time:'30–45 min', best:'Bij aankomst / zonsondergang',
       parking:'Weggis Seepromenade', photo:'Weggis Seepromenade Rigi',
       desc:'Na het inchecken even uitwaaien aan het water met de Rigi op de achtergrond. Rustig landen na een lange rijdag.',
       tip:'Reserveer een tafel met meerzicht — de zonsondergang over het meer is de beloning van deze dag.'}
    ]
  },
  restaurants:[
    {t:'Meerzicht-diner · Weggis', q:'restaurant Weggis lake view'},
    {t:'Lunch · Luzern oude stad', q:'restaurant Altstadt Luzern'},
    {t:'Koffie · Rheinfall', q:'café Schloss Laufen Rheinfall'}
  ],
  gopro:[
    {t:'Afdaling richting Vierwoudstrekenmeer', q:'Küssnacht am Rigi'},
    {t:'Seestrasse langs het meer naar Weggis', q:'Seestrasse Weggis'}
  ],
  fotospots:[
    {t:'Schloss Laufen platform', q:'Schloss Laufen am Rheinfall'},
    {t:'Kapellbrücke bij avond', q:'Kapellbrücke Luzern'},
    {t:'Rigi-panorama Weggis', q:'Weggis Rigi viewpoint'}
  ],
  fuel:'Brandstof in Zwitserland is fors duurder. Tank vol in Duitsland vóór de grens (rond Freiburg / Basel). In Zwitserland alleen bijvullen als het echt nodig is.',
  hotel: hotel({
    name:'Hotel Alpenblick', booked:true,
    address:'Weggis · Vierwoudstrekenmeer · Zwitserland',
    mapsQuery:'Hotel Alpenblick Weggis',
    website:'Hotel Alpenblick Weggis', bookingQuery:'Hotel Alpenblick Weggis',
    checkin:'vanaf 15:00', parking:'Hotelparking', ev:'Laadpunt navragen bij receptie',
    restaurant:'Terras met meerzicht', wellness:'Kleine spa / sauna'
  })
},

/* ============ DAG 3 · 6–10 augustus · GARDAMEER (modulair) ============ */
{
  tab:{n:'3', label:'6–10 aug'}, id:'gardapool', isPool:true,
  eyebrow:'6 t/m 10 augustus · Basiskamp',
  title:'Gardameer — vijf vrije dagen',
  subtitle:'Basis: Hotel Aquila d’Oro, Desenzano del Garda',
  poolIntro:'Geen vaste planning. Dit zijn vijf dagen vanuit één basis — kies elke ochtend op gevoel en op het weer. Hieronder staan de beste bestemmingen; vink af wat je hebt gedaan. Alles is dagtrip-afstand vanaf Desenzano.',
  km:'Vrij', drive:'Naar keuze', depart:'—', arrive:'—',
  weather:'Hoogzomer aan het meer: 30°+ en broeierig in het dal. Combineer laag (dorpen, water) met hoog (Monte Baldo) op de heetste dagen.',
  badWeather:'Bij regen of onweer: Sirmione en Malcesine hebben overdekte steegjes en terrassen; stel Monte Baldo uit tot een heldere dag.',
  pool:[
    {emoji:'🏰', title:'Sirmione', stars:5, time:'2–3 uur', best:'Vroege ochtend (vóór 10:30)',
     parking:'Parcheggio Monte Baldo Sirmione', photo:'Castello Scaligero Sirmione',
     weather:'Vroeg = druktevrij',
     desc:'Scaliger-waterkasteel, smalle straatjes en water aan drie kanten. Het meest iconische dorp van het zuidelijke meer.',
     tip:'Parkeer bij Monte Baldo (auto’s mogen het centrum niet in) en loop het schiereiland op naar Grotte di Catullo & Jamaica Beach.'},
    {emoji:'🍋', title:'Limone sul Garda', stars:5, time:'2–3 uur', best:'Ochtend of late namiddag',
     parking:'Parcheggio Limone sul Garda', photo:'Limone sul Garda porto',
     desc:'Citroenhuizen tegen de rotswand, een fotogeniek haventje en bergen die recht uit het meer lijken te rijzen.',
     tip:'De aanrijroute langs de westoever (SS45bis) met zijn tunnels is zelf al een belevenis — GoPro aan.'},
    {emoji:'🏰', title:'Malcesine', stars:5, time:'2–3 uur', best:'Ochtend',
     parking:'Parcheggio Malcesine centro', photo:'Castello Scaligero Malcesine',
     desc:'Kasteel op een rots, een middeleeuwse haven en het startpunt van de kabelbaan naar Monte Baldo. Een van de mooiste dorpen aan het meer.',
     tip:'Combineer met Monte Baldo: ’s ochtends dorp, daarna omhoog als het zicht helder is.'},
    {emoji:'🚠', title:'Monte Baldo (kabelbaan)', stars:5, time:'2–3 uur', best:'Heldere ochtend',
     parking:'Funivia Malcesine Monte Baldo', photo:'Monte Baldo vetta panorama',
     weather:'Alleen bij helder zicht',
     desc:'Draaiende gondel vanaf Malcesine naar 1.760 m: van meerniveau naar alpien panorama in tien minuten. Boven is het 10–15° koeler.',
     tip:'Ga vroeg of reserveer online — bij mooi weer lopen de wachtrijen op. Neem een laag mee, boven waait het.'},
    {emoji:'🌊', title:'Riva del Garda', stars:4, time:'halve dag', best:'Ochtend',
     parking:'Parcheggio Riva del Garda centro', photo:'Riva del Garda porto',
     desc:'De noordpunt van het meer, omringd door steile rotswanden. Levendige promenade, mooie haven en frisser dan het zuiden.',
     tip:'Combineer met Lago di Tenno vlak erboven — samen een perfecte halve dag.'},
    {emoji:'💎', title:'Lago di Tenno', stars:5, time:'1–2 uur', best:'Zon = turquoise water',
     parking:'Parcheggio Lago di Tenno', photo:'Lago di Tenno',
     weather:'Mooist bij zon',
     desc:'Onwerkelijk turquoise bergmeertje boven Riva. Bij zonlicht lijkt het water te gloeien — een van de mooiste fotostops van de streek.',
     tip:'Neem eventueel het middeleeuwse dorpje Canale di Tenno mee, op loopafstand.'},
    {emoji:'🏔️', title:'Lago di Molveno', stars:5, time:'halve dag', best:'Heldere dag',
     parking:'Parcheggio Lido Molveno', photo:'Lago di Molveno',
     desc:'Kristalhelder meer aan de voet van de Brenta-Dolomieten. Verder rijden (± 1u15), maar een adembenemende dagtrip weg van de meerdrukte.',
     tip:'Alleen op een heldere dag doen — de Brenta-toppen máken hier het plaatje.'}
  ],
  restaurants:[
    {t:'Meerzicht · Desenzano haven', q:'restaurant Porto Vecchio Desenzano del Garda'},
    {t:'Pizza · Sirmione', q:'pizzeria Sirmione lake view'},
    {t:'Aperitivo · Desenzano', q:'wine bar Desenzano del Garda'},
    {t:'Gelato', q:'gelateria Desenzano del Garda'}
  ],
  gopro:[
    {t:'Westoever SS45bis (tunnels)', q:'Strada della Forra Tremosine'},
    {t:'Draaigondel Monte Baldo', q:'Funivia Malcesine Monte Baldo'}
  ],
  fotospots:[
    {t:'Jamaica Beach Sirmione', q:'Jamaica Beach Sirmione'},
    {t:'Haventje Limone', q:'Porto Vecchio Limone sul Garda'},
    {t:'Panorama Monte Baldo', q:'Monte Baldo vetta panorama'}
  ],
  fuel:'Tank in Italië buiten de dorpskernen (bij een “self” pomp langs de SS) — goedkoper dan de bemande pompen in de toeristendorpen.',
  hotel: hotel({
    name:'Hotel Aquila d’Oro', booked:true, bookedLabel:'betaald',
    address:'Desenzano del Garda · Gardameer · Italië',
    mapsQuery:'Hotel Aquila d\'Oro Desenzano del Garda',
    website:'Hotel Aquila d\'Oro Desenzano del Garda', bookingQuery:'Hotel Aquila d\'Oro Desenzano del Garda',
    checkin:'vanaf 14:00', parking:'Parkeren navragen — centrum Desenzano is beperkt',
    ev:'Laadpalen in Desenzano centrum', restaurant:'Ontbijt inbegrepen', wellness:'—'
  })
},

/* ============ DAG 4 · 11 augustus ============ */
{
  tab:{n:'4', label:'11 aug'}, id:'d4',
  eyebrow:'Dinsdag 11 augustus · Dag 4',
  title:'Desenzano → Canazei',
  subtitle:'Van het meer de Dolomieten in',
  route:{origin:'Desenzano del Garda, Italië', dest:'Chalet Vites, Canazei, Italië',
         epic:['Riva del Garda, Italië','Lago di Carezza, Italië','Passo di Costalunga, Italië','Passo Sella, Italië']},
  km:'± 240 km', drive:'4 u (met passen)', depart:'08:30', arrive:'± 16:30',
  weather:'Beneden warm, boven fris. In de Dolomieten kan het na 15:00 onweren — plan de passen daarom vóór de middag/vroege middag.',
  badWeather:'Bij laaghangende bewolking op de passen: neem de dalroute via Bolzano en bewaar Passo Sella voor morgen (dan rijd je ’m sowieso).',
  advice:'Lange, mooie dag. Riva + Lago di Carezza + één pas is genoeg — probeer niet alles af te vinken, morgen is de grote passendag.',
  cats:{
    must:[
      {emoji:'🌊', title:'Riva del Garda', stars:4, time:'45–60 min', best:'Ochtend',
       parking:'Parcheggio Riva del Garda centro', photo:'Riva del Garda porto',
       desc:'Laatste blik op het Gardameer met de dramatische rotswanden eromheen. Perfecte koffie- en benen-strekken-stop voor je klimt.',
       tip:'Vanaf hier begint het echt te klimmen — controleer koelvloeistof niet, maar geniet wél van de haarspelden.'},
      {emoji:'💠', title:'Lago di Carezza', stars:5, time:'45–60 min', best:'Ochtend, windstil water',
       parking:'Parcheggio Lago di Carezza', photo:'Lago di Carezza Latemar',
       desc:'Het “regenboogmeer” met de Latemar-toppen erin weerspiegeld. Klein, maar een van de meest gefotografeerde plekken van de Dolomieten.',
       tip:'Windstil = spiegelbeeld. Ga vroeg; na de middag steekt vaak de wind op en verdwijnt de reflectie.'},
      {emoji:'🏔️', title:'Passo di Costalunga', stars:4, time:'20–30 min', best:'Vóór de middag',
       parking:'Passo di Costalunga', photo:'Passo Costalunga viewpoint',
       desc:'De pas net boven Carezza — vloeiende bochten en je eerste echte Dolomieten-panorama. Mooie opwarmer voor Passo Sella.',
       tip:'Even stoppen bij de passhöhe voor koffie en het uitzicht over het Latemar-massief.'},
      {emoji:'🏔️', title:'Passo Sella', stars:5, time:'30–45 min', best:'Vroege middag',
       parking:'Passo Sella', photo:'Passo Sella Sassolungo',
       weather:'Alleen bij goed zicht',
       desc:'Recht onder de Sassolungo-torens door. Een van de indrukwekkendste passen van de Alpen — en morgen rijd je ’m opnieuw als opener.',
       tip:'GoPro op de motorkap richting de Sassolungo. De laatste klim naar de top is hét beeld van de dag.'}
    ],
    nice:[
      {emoji:'🏞️', title:'Lago di Molveno', stars:5, time:'als tijd over', best:'Alleen bij ruime tijd',
       parking:'Parcheggio Lido Molveno', photo:'Lago di Molveno',
       desc:'Optioneel: het schitterende Molveno-meer ligt op de vroege route. Alleen meenemen als je ruim op schema ligt — anders bewaar je energie voor de passen.',
       tip:'Kort houden bij twijfel; de passen van vandaag en morgen zijn de hoofdact.'}
    ],
    bonus:[
      {emoji:'🌲', title:'Val di Fassa / Canazei dorp', stars:4, time:'30–45 min', best:'Bij aankomst',
       parking:'Parcheggio Canazei centro', photo:'Canazei Dolomiti',
       desc:'Gezellig bergdorp op 1.450 m, omringd door de Sella- en Marmolada-massieven. Fijn rondje voor het diner.',
       tip:'Vroeg inchecken bij Chalet Vites en op een terras in het dorp de eerste bergavond vieren.'}
    ]
  },
  restaurants:[
    {t:'Berghut-diner · Canazei', q:'restaurant Canazei Val di Fassa'},
    {t:'Lunch · Lago di Carezza', q:'restaurant Lago di Carezza'},
    {t:'Koffie · Riva del Garda', q:'café Riva del Garda porto'}
  ],
  gopro:[
    {t:'Haarspelden boven Riva', q:'Passo Ballino'},
    {t:'Klim naar Passo Sella', q:'Passo Sella'}
  ],
  fotospots:[
    {t:'Spiegeling Lago di Carezza', q:'Lago di Carezza Latemar'},
    {t:'Sassolungo bij Passo Sella', q:'Passo Sella Sassolungo'},
    {t:'Canazei bergpanorama', q:'Canazei Dolomiti'}
  ],
  fuel:'Tank vol in het dal (rond Bolzano/Bozen) vóór je de passen in gaat — boven zijn pompen schaars en duurder. Met een volle tank rij je zorgeloos twee passendagen.',
  hotel: hotel({
    name:'Chalet Vites', booked:true,
    address:'Canazei · Val di Fassa · Dolomieten · Italië',
    mapsQuery:'Chalet Vites Canazei',
    website:'Chalet Vites Canazei', bookingQuery:'Chalet Vites Canazei',
    checkin:'vanaf 15:00', parking:'Eigen parkeerplaats bij het chalet',
    ev:'Laadpunten in Canazei centrum', restaurant:'Alpiene keuken', wellness:'Sauna / relaxruimte'
  })
},

/* ============ DAG 5 · 12 augustus · DE MOOISTE DAG ============ */
{
  tab:{n:'5', label:'12 aug'}, id:'d5', isEpic:true,
  eyebrow:'Woensdag 12 augustus · Dag 5 · Hoogtepunt',
  title:'Canazei → San Candido',
  subtitle:'De Grote Dolomieten-dag: vier passen en twee bergmeren',
  route:{origin:'Canazei, Italië', dest:'Naturhotel Leitlhof, Innichen (San Candido), Italië',
         epic:['Passo Sella, Italië','Passo Gardena, Italië','Passo Falzarego, Italië','Lago di Misurina, Italië','Lago di Braies, Italië']},
  km:'± 185 km', drive:'5–6 u (met passen & stops)', depart:'08:30', arrive:'± 16:00',
  weather:'Vroeg de passen op: helder ochtendlicht en nog geen wolken op de toppen. Onweer bouwt vaak na 15:00 op — dan wil je al richting Braies/hotel zijn.',
  badWeather:'Bij dichte bewolking op de hoogste passen: Passo Falzarego kan in de wolken hangen. Val Gardena → Val Badia door het dal blijft dan de mooie backup naar Braies.',
  departAdvice:{time:'08:30', text:'Vertrek uiterlijk 08:30. Met de vier passen en twee meren kom je dan rond 16:00 relaxed aan — ruim vóór het Wellbeing Ritual van 17:00.'},
  timeline:[
    {time:'08:30', title:'Vertrek Canazei', note:'Volle tank, GoPro geladen, koffie mee.', cls:''},
    {time:'09:00', title:'Passo Sella', note:'Onder de Sassolungo door — ochtendlicht.', cls:''},
    {time:'09:45', title:'Passo Gardena', note:'Groene weiden onder de Sella-torens.', cls:''},
    {time:'11:30', title:'Passo Falzarego', note:'Hoogste punt; kabelbaan Lagazuoi optioneel.', cls:''},
    {time:'13:00', title:'Lago di Misurina', note:'Lunch aan het meer met Dolomieten-decor.', cls:''},
    {time:'14:30', title:'Lago di Braies — P2', note:'Geboekte parking. Rondje langs het water.', cls:'key'},
    {time:'16:00', title:'Aankomst Naturhotel Leitlhof', note:'Inchecken, rustig aan.', cls:'end'},
    {time:'17:00', title:'Wellbeing Ritual', note:'Vaste afspraak — geboekt.', cls:'end'}
  ],
  advice:'Rijd de passen in deze volgorde: Sella → Gardena → Falzarego → Misurina → Braies. Tre Cime en Santa Maddalena laten we bewust weg — die kosten te veel tijd voor vandaag.',
  cats:{
    must:[
      {emoji:'🏔️', title:'Passo Sella', stars:5, time:'30 min', best:'09:00 — ochtendlicht',
       parking:'Passo Sella', photo:'Passo Sella Sassolungo',
       desc:'De opener. Recht onder de getande Sassolungo-torens door, met ochtendlicht op de rotsen. De mooiste start die je je kunt wensen.',
       tip:'Stop bij de passhöhe voor het klassieke beeld van de weg die naar de torens kronkelt.'},
      {emoji:'🏔️', title:'Passo Gardena (Grödner Joch)', stars:5, time:'30 min', best:'Late ochtend',
       parking:'Passo Gardena', photo:'Passo Gardena Grödner Joch',
       desc:'Glooiende alpenweiden onder de verticale wanden van het Sella-massief. Zachter en groener dan Sella, minstens zo fotogeniek.',
       tip:'Ideale koffiestop bij de bergpost op de top voor je doorrijdt naar Falzarego.'},
      {emoji:'⛰️', title:'Passo Falzarego', stars:5, time:'45 min', best:'± 11:30',
       parking:'Passo Falzarego', photo:'Passo Falzarego Lagazuoi',
       weather:'Kan in de wolken hangen',
       desc:'Het hoogste punt van de dag (2.105 m), kaal en groots. Optioneel: kabelbaan Lagazuoi omhoog voor een 360°-panorama over de Dolomieten.',
       tip:'Even uit de auto: op deze hoogte is de lucht scherp en het uitzicht eindeloos. Warme laag mee.'},
      {emoji:'🏞️', title:'Lago di Misurina', stars:5, time:'lunch · 60–75 min', best:'13:00 — lunchstop',
       parking:'Parcheggio Lago di Misurina', photo:'Lago di Misurina',
       desc:'Rustig bergmeer op 1.750 m met de Dolomieten weerspiegeld in het water. De perfecte lunchstop op de route — zonder de drukte en de tijd van Tre Cime.',
       tip:'Terras aan het water pakken; hiervandaan is het nog maar een dik half uur naar Braies.'},
      {emoji:'💙', title:'Lago di Braies — P2 geboekt', stars:5, time:'75–90 min', best:'14:30 — vóór de middagdrukte wegtrekt',
       parking:'Parcheggio P2 Lago di Braies Prags', photo:'Lago di Braies',
       desc:'Het smaragdgroene kroonjuweel van de Dolomieten, met de houten roeibootjes en de Seekofel erachter. Je P2-parking is gereserveerd — geen zoekstress.',
       tip:'Gebruik de aparte knop “Navigeer naar P2” hieronder. Loop het meer (deels) rond voor het beste licht op het water.',
       special:'p2'}
    ],
    nice:[
      {emoji:'🚡', title:'Lagazuoi kabelbaan', stars:4, time:'60–90 min', best:'Alleen bij helder weer',
       parking:'Rifugio Lagazuoi funivia Passo Falzarego', photo:'Rifugio Lagazuoi panorama',
       weather:'Alleen bij helder zicht',
       desc:'Optioneel vanaf Falzarego: omhoog naar 2.750 m voor het meest weidse uitzicht van de dag. Alleen als je ruim op schema ligt.',
       tip:'Houd de klok in de gaten — het Wellbeing Ritual om 17:00 staat vast.'}
    ],
    bonus:[
      {emoji:'☕', title:'Rifugio-stop naar keuze', stars:4, time:'30 min', best:'Onderweg',
       nav:'Passo Valparola', parking:'Passo Valparola', photo:'Passo Valparola',
       desc:'Tussen de passen liggen tal van berghutten (rifugi) voor een espresso met uitzicht. Pak er eentje waar het je aanstaat.',
       tip:'Kleine, on-toeristische rifugi net naast de pas zijn vaak het lekkerst én het rustigst.'}
    ]
  },
  restaurants:[
    {t:'Lunch aan het water · Misurina', q:'restaurant Lago di Misurina'},
    {t:'Rifugio · Passo Gardena', q:'rifugio Passo Gardena'},
    {t:'Diner · Naturhotel Leitlhof', q:'Naturhotel Leitlhof Innichen restaurant'}
  ],
  gopro:[
    {t:'Sella → Gardena serpentines', q:'Passo Gardena'},
    {t:'Afdaling Falzarego', q:'Passo Falzarego'},
    {t:'Aankomst Lago di Braies', q:'Lago di Braies'}
  ],
  fotospots:[
    {t:'Sassolungo vanaf Passo Sella', q:'Passo Sella Sassolungo'},
    {t:'Sella-torens vanaf Gardena', q:'Passo Gardena Grödner Joch'},
    {t:'Roeibootjes Lago di Braies', q:'Lago di Braies boats'},
    {t:'Spiegeling Lago di Misurina', q:'Lago di Misurina'}
  ],
  fuel:'Cruciaal: vertrek met een vólle tank uit Canazei. Tussen de passen zijn pompen schaars. Zo rij je de hele dag zonder omweg of stress.',
  wellness:{
    ritualTime:'17:00',
    spa:'Spa doorgaans 12:00–20:00 (check exact bij de receptie)',
    pool:'Verwarmd binnen- en buitenzwembad met bergzicht',
    sauna:'Finse sauna, biosauna en stoombad in het saunapark',
    textileFree:'De saunaruimte is doorgaans textielvrij (bloot) — neem een grote handdoek mee; badkleding mag wél bij het zwembad.',
    massage:'Boek een massage bij het inchecken (16:00) zodat je die ná het 17:00-ritual kunt plannen — populaire slots zijn ’s avonds snel vol.'
  },
  hotel: hotel({
    name:'Naturhotel Leitlhof', booked:true,
    address:'Innichen / San Candido · Zuid-Tirol · Italië',
    mapsQuery:'Naturhotel Leitlhof Innichen',
    website:'Naturhotel Leitlhof', bookingQuery:'Naturhotel Leitlhof San Candido',
    checkin:'vanaf 15:00 · Wellbeing Ritual 17:00',
    parking:'Eigen parkeerplaats / garage', ev:'EV-laadpunten aanwezig bij het hotel',
    restaurant:'Duurzaam fine-dining (halfpension)', wellness:'Groot spa- & saunapark met bergzicht'
  })
},

/* ============ DAG 6 · 13 augustus ============ */
{
  tab:{n:'6', label:'13 aug'}, id:'d6',
  eyebrow:'Donderdag 13 augustus · Dag 6',
  title:'San Candido → Heidelberg',
  subtitle:'De lange terugrit — met een mooi slot',
  route:{origin:'Innichen (San Candido), Italië', dest:'Berggasthof Königstuhl, Heidelberg, Duitsland',
         epic:['Brennerpass, Italië/Oostenrijk','Innsbruck, Oostenrijk','Heidelberg Altstadt, Duitsland']},
  km:'± 600 km', drive:'6 u (rijden)', depart:'08:00', arrive:'± 18:00',
  weather:'Wisselend onderweg. Deze dag draait om kilometers maken; bewaar je energie voor de avond in Heidelberg.',
  badWeather:'Regen op de A-wegen? Geen bezwaar — dit is een transitdag. Plan gewoon een langere, droge lunchstop in Innsbruck.',
  advice:'Efficiënt doorrijden via Brenner en Innsbruck. Één goede lunchstop, en ’s avonds Heidelberg als beloning.',
  cats:{
    must:[
      {emoji:'🏙️', title:'Innsbruck — lunchstop', stars:4, time:'75–90 min', best:'Middag',
       parking:'Parkgarage Altstadt Innsbruck', photo:'Goldenes Dachl Innsbruck',
       desc:'Perfect gelegen halverwege: bergstad met een compacte oude stad, het Goldene Dachl en bergen aan alle kanten. Ideaal om de benen te strekken.',
       tip:'Kort en krachtig: parkeer in de Altstadt-garage, lunch, en weer door — nog een flinke rit te gaan.'},
      {emoji:'🏰', title:'Heidelberg — Altstadt & Schloss', stars:5, time:'avond', best:'Avondlicht',
       parking:'Parkhaus P12 Kornmarkt/Schloss Heidelberg', photo:'Heidelberger Schloss',
       desc:'Aankomst met stijl: het beroemde kasteel boven de Neckar en de Alte Brücke in avondlicht. Mooie afsluiter van de reis.',
       tip:'Berggasthof Königstuhl ligt bóven de stad — geniet eerst van het uitzicht en rijd daarna omhoog naar het hotel.'}
    ],
    nice:[
      {emoji:'⛪', title:'Vipiteno / Sterzing', stars:3, time:'30–40 min', best:'Ochtend',
       parking:'Parkplatz Sterzing Zentrum', photo:'Zwölferturm Sterzing',
       desc:'Kleurrijk Zuid-Tirools stadje net vóór de Brenner. Fijne koffiestop om de laatste keer echt Italië te proeven.',
       tip:'Laatste kans op een goede Italiaanse espresso en Speck voor onderweg.'}
    ],
    bonus:[
      {emoji:'🌉', title:'Alte Brücke Heidelberg', stars:4, time:'30 min', best:'Zonsondergang',
       parking:'Parkhaus P12 Kornmarkt/Schloss Heidelberg', photo:'Alte Brücke Heidelberg',
       desc:'De klassieke wandeling over de oude brug met zicht op kasteel en rivier. Rustig uitwaaien na een dag rijden.',
       tip:'Even naar de overkant (Philosophenweg-zijde) lopen voor het beroemde ansichtkaart-uitzicht.'}
    ]
  },
  restaurants:[
    {t:'Lunch · Innsbruck Altstadt', q:'restaurant Altstadt Innsbruck'},
    {t:'Diner · Heidelberg Altstadt', q:'restaurant Altstadt Heidelberg'},
    {t:'Uitzicht · Königstuhl', q:'Berggasthof Königstuhl Heidelberg restaurant'}
  ],
  gopro:[
    {t:'Afdaling Brennerpas', q:'Brennerpass'},
    {t:'Klim naar Königstuhl', q:'Königstuhl Heidelberg'}
  ],
  fotospots:[
    {t:'Goldenes Dachl Innsbruck', q:'Goldenes Dachl Innsbruck'},
    {t:'Heidelberger Schloss', q:'Heidelberger Schloss'},
    {t:'Alte Brücke bij avond', q:'Alte Brücke Heidelberg'}
  ],
  fuel:'Let op de tol: Oostenrijk vereist een vignette (Brenner heeft daarnaast aparte Maut). Tank het voordeligst in Oostenrijk of net over de Duitse grens — goedkoper dan Italië en Zwitserland.',
  hotel: hotel({
    name:'Berggasthof Königstuhl', booked:true,
    address:'Königstuhl · boven Heidelberg · Duitsland',
    mapsQuery:'Berggasthof Königstuhl Heidelberg',
    website:'Berggasthof Königstuhl Heidelberg', bookingQuery:'Berggasthof Königstuhl Heidelberg',
    checkin:'vanaf 15:00', parking:'Eigen parkeerplaats bij de berggasthof',
    ev:'Laadpunten in Heidelberg (dal)', restaurant:'Duitse keuken met uitzicht', wellness:'—'
  })
},

/* ============ DAG 7 · 14 augustus ============ */
{
  tab:{n:'7', label:'14 aug'}, id:'d7',
  eyebrow:'Vrijdag 14 augustus · Dag 7',
  title:'Heidelberg → Almere',
  subtitle:'Rustig naar huis',
  route:{origin:'Heidelberg, Duitsland', dest:'Almere, Nederland',
         epic:['Köln, Duitsland','Almere, Nederland']},
  km:'± 500 km', drive:'5 u (rijden)', depart:'09:00', arrive:'± 15:00',
  weather:'Ontspannen slotdag. Eén frisse stop onderweg en dan naar huis.',
  badWeather:'Bij druk terugkeerverkeer (vrijdag!): vertrek liever wat vroeger of las de Köln-stop in om de spits te ontlopen.',
  advice:'Geen haast. Eén koffiestop bij Köln om de rit te breken, daarna in één ruk naar Almere.',
  cats:{
    must:[
      {emoji:'⛪', title:'Köln — Dom & Rijnboulevard', stars:4, time:'60–75 min', best:'Late ochtend',
       parking:'Parkhaus Am Dom Köln', photo:'Kölner Dom',
       desc:'De ideale beenstrek-stop op de weg naar huis: de imposante Dom, een espresso aan de Rijn en dan het laatste stuk naar Nederland.',
       tip:'Parkeer bij Am Dom/Groß St. Martin — je staat dan direct bij de Dom en de boulevard.'}
    ],
    nice:[
      {emoji:'🛍️', title:'Designer Outlet Roermond', stars:3, time:'naar keuze', best:'Alleen als je zin hebt',
       parking:'Designer Outlet Roermond parking', photo:'Designer Outlet Roermond',
       desc:'Vlak over de grens: handig als je de reis met een laatste stop wil rekken. Alleen doen als iedereen er zin in heeft.',
       tip:'Bij druk vrijdagverkeer eerder overslaan en doorrijden naar huis.'}
    ],
    bonus:[
      {emoji:'🏡', title:'Thuis in Almere', stars:5, time:'—', best:'Middag',
       nav:'Almere', parking:'Almere', photo:'Almere',
       desc:'Einde van een onvergetelijke roadtrip. Auto uitladen, foto’s terugkijken en nagenieten.',
       tip:'GoPro-kaarten meteen back-uppen — je wilt deze beelden niet kwijtraken.'}
    ]
  },
  restaurants:[
    {t:'Koffie · Köln Rijnboulevard', q:'café Rheinboulevard Köln'},
    {t:'Lunch onderweg', q:'restaurant A3 Autohof'}
  ],
  gopro:[
    {t:'Rijnbrug bij Köln', q:'Hohenzollernbrücke Köln'}
  ],
  fotospots:[
    {t:'Kölner Dom', q:'Kölner Dom'},
    {t:'Rijnboulevard', q:'Rheinboulevard Köln'}
  ],
  fuel:'Tank het laatst voordelig in Duitsland vóór de grens (of net in Nederland). Vermijd de dure snelweg-tankstations.',
  hotel: hotel({
    name:'Thuis · Almere', booked:false, bookedLabel:'',
    address:'Almere · Nederland',
    mapsQuery:'Almere', website:'', bookingQuery:'',
    checkin:'—', parking:'Eigen oprit', ev:'Thuislader', restaurant:'—', wellness:'Eigen bank 🛋️'
  })
}
];

/* =========================================================
   PRAKTISCH — checklists
   ========================================================= */
const CHECKLISTS = [
  {icon:'🪪', title:'Documenten', items:[
    'Paspoort','Rijbewijs','Kentekenbewijs','Groene kaart (verzekering)','Creditcard','Contant geld (euro)'
  ]},
  {icon:'🚗', title:'Auto', items:[
    'Bandenspanning gecontroleerd','Oliepeil','Koelvloeistof','Ruitensproeiervloeistof',
    'GoPro','SD-kaarten (leeg & extra)','USB-kabels','Powerbank','Laadkabels (auto & telefoon)',
    'EHBO-set','Gevarendriehoek','Veiligheidshesje(s)'
  ]},
  {icon:'🛣️', title:'Tol & vignetten', items:[
    'Zwitserse vignette','Oostenrijkse vignette','Fulli / Telepass badge Italië'
  ]}
];

/* =========================================================
   STORE — LocalStorage
   ========================================================= */
const STORE_KEY = 'roadtrip2026.v1';
const store = (() => {
  let data = {};
  try { data = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch(e){ data = {}; }
  return {
    get: k => !!data[k],
    set: (k, v) => { data[k] = v; try{ localStorage.setItem(STORE_KEY, JSON.stringify(data)); }catch(e){} },
    all: () => data
  };
})();

/* =========================================================
   RENDER helpers
   ========================================================= */
const el = (tag, cls, html) => { const n = document.createElement(tag); if(cls) n.className = cls; if(html!=null) n.innerHTML = html; return n; };
const stars = n => '★★★★★☆☆☆☆☆'.slice(5-n, 10-n);
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

function stopKey(dayId, cat, stop){ return `${dayId}-${cat}-${slug(stop.title)}`; }

function renderStop(dayId, cat, stop){
  const key = stopKey(dayId, cat, stop);
  const done = store.get(key);
  const card = el('article', 'stop' + (done ? ' done' : ''));
  card.dataset.key = key;

  // ---- summary (clickable to open, checkbox toggles done) ----
  const sub = [];
  sub.push(`<span class="stars">${stars(stop.stars)}</span>`);
  sub.push(`<span>⏱ ${stop.time}</span>`);
  const summary = el('div', 'stop-summary');
  summary.innerHTML = `
    <label class="check" aria-label="Afvinken">
      <input type="checkbox" ${done?'checked':''}>
      <span class="box"></span>
    </label>
    <span class="stop-emoji">${stop.emoji}</span>
    <div class="stop-main">
      <div class="stop-title">${stop.title}</div>
      <div class="stop-sub">${sub.join('')}</div>
    </div>
    <span class="chev">▾</span>`;
  card.appendChild(summary);

  // ---- body ----
  const body = el('div', 'stop-body');
  const pills = [];
  if (stop.best) pills.push(`<span class="pill best">☀️ ${stop.best}</span>`);
  if (stop.weather) pills.push(`<span class="pill weather">🌦️ ${stop.weather}</span>`);
  let bodyHtml = '';
  if (pills.length) bodyHtml += `<div class="info-row">${pills.join('')}</div>`;
  bodyHtml += `<p>${stop.desc}</p>`;
  if (stop.tip) bodyHtml += `<div class="tip"><b>Tip &nbsp;</b><span>${stop.tip}</span></div>`;

  // actions: parking, navigate, photo (+ optional special P2)
  let acts = '<div class="actions">';
  if (stop.special === 'p2'){
    acts += `<a class="action nav" href="${mapsSearch('Parcheggio P2 Lago di Braies Prags')}" target="_blank" rel="noopener">
      <span class="lead"><span class="ic">🅿️</span> Navigeer naar P2 <em style="color:var(--muted);font-style:normal">· geboekt</em></span><span class="go">Maps →</span></a>`;
  }
  if (stop.parking){
    acts += `<a class="action" href="${mapsSearch(stop.parking)}" target="_blank" rel="noopener">
      <span class="lead"><span class="ic">🚗</span> Parkeren</span><span class="go">Maps →</span></a>`;
  }
  const navQuery = stop.nav || stop.title.split(/ — | \/ | \(/)[0].trim();
  acts += `<a class="action nav" href="${mapsSearch(navQuery)}" target="_blank" rel="noopener">
      <span class="lead"><span class="ic">🧭</span> Navigeer hierheen</span><span class="go">Maps →</span></a>`;
  if (stop.photo){
    acts += `<a class="action" href="${mapsSearch(stop.photo)}" target="_blank" rel="noopener">
      <span class="lead"><span class="ic">📸</span> Fotospot</span><span class="go">Maps →</span></a>`;
  }
  acts += '</div>';
  bodyHtml += acts;
  body.innerHTML = bodyHtml;
  card.appendChild(body);

  // ---- interactions ----
  const input = summary.querySelector('input');
  input.addEventListener('click', e => e.stopPropagation());
  input.addEventListener('change', () => {
    store.set(key, input.checked);
    card.classList.toggle('done', input.checked);
    updateProgress();
    toast(input.checked ? '✓ Afgevinkt' : 'Vinkje weggehaald');
  });
  summary.addEventListener('click', e => {
    if (e.target.closest('.check')) return;
    card.classList.toggle('open');
  });
  return card;
}

function catBlock(dayId, cat, label, stops){
  if (!stops || !stops.length) return null;
  const frag = document.createDocumentFragment();
  const head = el('div', `cat-head cat-${cat}`, `<span class="cat-dot"></span>${label}`);
  frag.appendChild(head);
  stops.forEach(s => frag.appendChild(renderStop(dayId, cat, s)));
  return frag;
}

function miniBlock(title, items){
  if (!items || !items.length) return null;
  const b = el('div', 'mini-block');
  b.appendChild(el('h4', null, title));
  const list = el('div', 'chiplist');
  items.forEach(it => {
    const a = el('a', 'chip');
    a.href = mapsSearch(it.q); a.target = '_blank'; a.rel = 'noopener';
    a.innerHTML = `<span class="ic">📍</span>${it.t}`;
    list.appendChild(a);
  });
  b.appendChild(list);
  return b;
}

function renderHotel(h){
  if (!h) return null;
  const card = el('section', h.wellness && h.name.includes('Leitlhof') ? 'hotel' : 'hotel');
  const bookedTag = h.booked ? `<span class="tag-booked">✓ ${h.bookedLabel || 'geboekt'}</span>` : '';
  let feats = '';
  const addFeat = (k,v)=>{ if(v && v!=='—') feats += `<div class="feat-item"><b>${k}</b>${v}</div>`; };
  addFeat('Inchecken', h.checkin);
  addFeat('Parkeren', h.parking);
  addFeat('EV laden', h.ev);
  addFeat('Restaurant', h.restaurant);
  addFeat('Wellness', h.wellness);

  let acts = '<div class="actions" style="margin-top:14px">';
  acts += `<a class="action nav" href="${mapsSearch(h.mapsQuery)}" target="_blank" rel="noopener">
    <span class="lead"><span class="ic">🧭</span> Navigeer naar hotel</span><span class="go">Maps →</span></a>`;
  acts += `<a class="action" href="${mapsSearch(h.mapsQuery)}" target="_blank" rel="noopener">
    <span class="lead"><span class="ic">📞</span> Adres & telefoon</span><span class="go">Maps →</span></a>`;
  if (h.website) acts += `<a class="action book" href="${gsearch(h.website + ' officiële website')}" target="_blank" rel="noopener">
    <span class="lead"><span class="ic">🌐</span> Website</span><span class="go">Zoek →</span></a>`;
  if (h.bookingQuery) acts += `<a class="action book" href="${booking(h.bookingQuery)}" target="_blank" rel="noopener">
    <span class="lead"><span class="ic">🛏️</span> Booking</span><span class="go">Open →</span></a>`;
  acts += '</div>';

  card.innerHTML = `
    <div class="hotel-head"><h3>🏨 ${h.name}</h3>${bookedTag}</div>
    <p class="addr">${h.address}</p>
    ${feats ? `<div class="feat">${feats}</div>` : ''}
    ${acts}`;
  return card;
}

function renderWellness(w){
  const card = el('section', 'wellness-card');
  card.innerHTML = `
    <h3>🧖 Leitlhof Spa & Wellbeing</h3>
    <div class="ritual">
      <div><div class="t">Wellbeing Ritual</div><div style="color:var(--muted);font-size:12.5px;margin-top:2px">Vaste afspraak</div></div>
      <div style="text-align:right"><div class="time">${w.ritualTime}</div><span class="tag-booked">✓ geboekt</span></div>
    </div>
    <div class="feat">
      <div class="feat-item"><b>Spa openingstijden</b>${w.spa}</div>
      <div class="feat-item"><b>Zwembad</b>${w.pool}</div>
      <div class="feat-item"><b>Sauna</b>${w.sauna}</div>
      <div class="feat-item"><b>Textielvrij</b>${w.textileFree}</div>
    </div>
    <div class="tip" style="margin-top:12px"><b>Massage &nbsp;</b><span>${w.massage}</span></div>`;
  return card;
}

function renderTimeline(items){
  const wrap = el('div', 'mini-block');
  wrap.appendChild(el('h4', null, '⏱ Tijdlijn van de dag'));
  const tl = el('div', 'timeline');
  items.forEach(it => {
    const item = el('div', 'tl-item' + (it.cls ? ' ' + it.cls : ''));
    item.innerHTML = `<div class="tl-time">${it.time}</div><div class="tl-title">${it.title}</div>${it.note?`<div class="tl-note">${it.note}</div>`:''}`;
    tl.appendChild(item);
  });
  wrap.appendChild(tl);
  return wrap;
}

/* ---------- Full day panel ---------- */
function renderDay(day, index){
  const panel = el('section', 'panel');
  panel.dataset.index = index;
  panel.id = 'panel-' + day.id;

  // hero
  const hero = el('div', 'day-hero');
  hero.innerHTML = `<div class="day-eyebrow">${day.eyebrow}</div>
    <h2>${day.title}</h2><p class="subtitle">${day.subtitle}</p>`;
  panel.appendChild(hero);

  // stat strip (skip for pool day)
  if (!day.isPool){
    const strip = el('div', 'stat-strip');
    strip.innerHTML = `
      <div class="stat accent"><span class="k">Afstand</span><span class="v">${day.km}</span></div>
      <div class="stat"><span class="k">Rijtijd</span><span class="v">${day.drive}</span></div>
      <div class="stat nav"><span class="k">Vertrek</span><span class="v">${day.depart}</span></div>
      <div class="stat"><span class="k">Aankomst</span><span class="v">${day.arrive}</span></div>`;
    panel.appendChild(strip);
  }

  // routes
  if (day.route){
    const routes = el('div', 'routes');
    const comfort = mapsDir(day.route.origin, day.route.dest);
    const epic = mapsDir(day.route.origin, day.route.dest, day.route.epic);
    routes.innerHTML = `
      <a class="route-btn route-comfort" href="${comfort}" target="_blank" rel="noopener">🟢 Comfort route<small>Snelste weg</small></a>
      <a class="route-btn route-epic" href="${epic}" target="_blank" rel="noopener">🔥 Epic route<small>Langs de highlights</small></a>`;
    panel.appendChild(routes);
  }

  // depart advice (day 12)
  if (day.departAdvice){
    const da = el('div', 'depart-advice');
    da.innerHTML = `<div><div class="lbl">Aanbevolen vertrek</div><div class="big">${day.departAdvice.time}</div></div>
      <div class="txt">${day.departAdvice.text}</div>`;
    panel.appendChild(da);
  }

  // weather + advice banners
  if (day.weather) panel.appendChild(el('div', 'banner banner-advice', `<strong>Weer:</strong> ${day.weather}`));
  if (day.badWeather) panel.appendChild(el('div', 'banner banner-weather', `<strong>Bij slecht weer:</strong> ${day.badWeather}`));
  if (day.advice) panel.appendChild(el('div', 'banner banner-advice', `<strong>Mijn keuze:</strong> ${day.advice}`));

  // timeline (day 12)
  if (day.timeline) panel.appendChild(renderTimeline(day.timeline));

  // ----- POOL day (Garda) -----
  if (day.isPool){
    if (day.poolIntro) panel.appendChild(el('div', 'pool-intro', `<b>Zo werkt het:</b> ${day.poolIntro}`));
    panel.appendChild(el('div', 'cat-head cat-nice', '<span class="cat-dot"></span>Kies je bestemmingen'));
    day.pool.forEach(s => panel.appendChild(renderStop(day.id, 'pool', s)));
  } else {
    // ----- normal categories -----
    const must = catBlock(day.id, 'must', '🟥 Must do', day.cats.must);
    const nice = catBlock(day.id, 'nice', '🟧 Leuk / nice to have', day.cats.nice);
    const bonus = catBlock(day.id, 'bonus', '🟩 Bonus', day.cats.bonus);
    if (must) panel.appendChild(must);
    if (nice) panel.appendChild(nice);
    if (bonus) panel.appendChild(bonus);
  }

  // mini-blocks
  const mb = miniBlock('🍝 Restauranttips', day.restaurants); if (mb) panel.appendChild(mb);
  const gp = miniBlock('🎬 GoPro-momenten', day.gopro); if (gp) panel.appendChild(gp);
  const fs = miniBlock('📸 Fotospots', day.fotospots); if (fs) panel.appendChild(fs);
  if (day.fuel){
    const f = el('div', 'mini-block');
    f.appendChild(el('h4', null, '⛽ Tankadvies'));
    f.appendChild(el('div', 'fuel-note', day.fuel));
    panel.appendChild(f);
  }

  // wellness (Leitlhof)
  if (day.wellness) panel.appendChild(renderWellness(day.wellness));

  // hotel
  const h = renderHotel(day.hotel); if (h) panel.appendChild(h);

  return panel;
}

/* ---------- Practical tab ---------- */
function renderPractical(){
  const panel = el('section', 'panel');
  panel.id = 'panel-practical';
  panel.dataset.index = DAYS.length;
  const hero = el('div', 'day-hero');
  hero.innerHTML = `<div class="day-eyebrow">Voor vertrek · onderweg</div>
    <h2>Roadtrip Checklist</h2><p class="subtitle">Afvinken wat klaar is — opgeslagen op dit toestel</p>`;
  panel.appendChild(hero);

  CHECKLISTS.forEach((g, gi) => {
    const group = el('div', 'checklist-group' + (gi===0?' open':''));
    const key = `cl-${slug(g.title)}`;
    const doneCount = g.items.filter((_,i)=>store.get(`${key}-${i}`)).length;
    const head = el('div', 'cl-head');
    head.innerHTML = `<h3><span>${g.icon}</span> ${g.title}</h3><span class="cl-count">${doneCount}/${g.items.length}</span>`;
    group.appendChild(head);
    const bodyWrap = el('div', 'cl-body');
    g.items.forEach((label, i) => {
      const ik = `${key}-${i}`;
      const done = store.get(ik);
      const item = el('label', 'cl-item');
      item.innerHTML = `<input type="checkbox" ${done?'checked':''}><span class="box"></span><span class="lbl">${label}</span>`;
      const input = item.querySelector('input');
      input.addEventListener('change', () => {
        store.set(ik, input.checked);
        const dc = g.items.filter((_,j)=>store.get(`${key}-${j}`)).length;
        head.querySelector('.cl-count').textContent = `${dc}/${g.items.length}`;
      });
      bodyWrap.appendChild(item);
    });
    group.appendChild(bodyWrap);
    head.addEventListener('click', () => group.classList.toggle('open'));
    panel.appendChild(group);
  });

  panel.appendChild(el('div', 'foot',
    'Roadtrip Companion 2026 · werkt volledig offline · alle voortgang staat lokaal op dit toestel.<br>Controleer bij vertrek altijd actuele weers- en verkeersinfo.'));
  return panel;
}

/* =========================================================
   TABS + navigation
   ========================================================= */
let current = 0;
const panels = [];
const tabsEl = document.getElementById('dayTabs');
const mainEl = document.getElementById('main');

function buildTabs(){
  DAYS.forEach((day, i) => {
    const b = el('button', 'day-tab' + (i===0?' active':''), `${day.tab.n}<span>${day.tab.label}</span>`);
    b.dataset.index = i;
    b.addEventListener('click', () => go(i));
    tabsEl.appendChild(b);
  });
  // practical tab
  const p = el('button', 'day-tab practical', `⚙️<span>Praktisch</span>`);
  p.dataset.index = DAYS.length;
  p.addEventListener('click', () => go(DAYS.length));
  tabsEl.appendChild(p);
}

function buildPanels(){
  DAYS.forEach((day, i) => { const panel = renderDay(day, i); panels.push(panel); mainEl.appendChild(panel); });
  const prac = renderPractical(); panels.push(prac); mainEl.appendChild(prac);
}

function go(i){
  if (i < 0 || i >= panels.length || i === current) {
    // still allow re-scroll to top on same tab
    if (i === current) window.scrollTo({top:0, behavior:'smooth'});
    return;
  }
  panels[current].classList.remove('active');
  panels[i].classList.add('active');
  current = i;

  [...tabsEl.children].forEach((t, ti) => t.classList.toggle('active', ti === i));
  // keep active tab visible in the scroller
  const activeTab = tabsEl.children[i];
  if (activeTab) activeTab.scrollIntoView({inline:'center', block:'nearest', behavior:'smooth'});

  // subtitle
  const st = document.getElementById('headerSubtitle');
  if (i < DAYS.length) st.textContent = DAYS[i].eyebrow;
  else st.textContent = 'Checklist & praktische info';

  window.scrollTo({top:0, behavior:'smooth'});
}

/* ---------- Swipe between tabs ---------- */
function initSwipe(){
  let x0=null, y0=null, t0=0;
  mainEl.addEventListener('touchstart', e => {
    const t = e.changedTouches[0]; x0 = t.clientX; y0 = t.clientY; t0 = Date.now();
  }, {passive:true});
  mainEl.addEventListener('touchend', e => {
    if (x0===null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - x0, dy = t.clientY - y0, dt = Date.now() - t0;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)*1.8 && dt < 600){
      if (dx < 0) go(Math.min(current+1, panels.length-1));
      else go(Math.max(current-1, 0));
    }
    x0 = y0 = null;
  }, {passive:true});
}

/* =========================================================
   PROGRESS ring (telt alle stops over alle dagen)
   ========================================================= */
function allStopKeys(){
  const keys = [];
  DAYS.forEach(day => {
    if (day.isPool){ day.pool.forEach(s => keys.push(stopKey(day.id,'pool',s))); }
    else if (day.cats){
      ['must','nice','bonus'].forEach(cat => (day.cats[cat]||[]).forEach(s => keys.push(stopKey(day.id,cat,s))));
    }
  });
  return keys;
}
function updateProgress(){
  const keys = allStopKeys();
  const done = keys.filter(k => store.get(k)).length;
  const pct = keys.length ? Math.round(done/keys.length*100) : 0;
  const ring = document.getElementById('progressRing');
  ring.style.setProperty('--p', pct + '%');
  document.getElementById('progressPct').textContent = pct + '%';
}

/* =========================================================
   FLOATING quick actions (met geolocatie)
   ========================================================= */
function initFab(){
  const dock = document.getElementById('fabDock');
  const toggle = document.getElementById('fabToggle');
  const menu = document.getElementById('fabMenu');
  toggle.addEventListener('click', () => {
    const open = dock.classList.toggle('open');
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
  });
  document.addEventListener('click', e => {
    if (!dock.contains(e.target)) { dock.classList.remove('open'); menu.setAttribute('aria-hidden','true'); }
  });

  const queries = {
    here:  {label:'je locatie',    build: (c)=> c ? mapsSearch(`${c.lat},${c.lng}`) : mapsSearch('mijn locatie')},
    food:  {label:'restaurants',   build: (c)=> c ? mapsSearch(`restaurants near ${c.lat},${c.lng}`) : mapsSearch('restaurant in de buurt')},
    coffee:{label:'koffie',        build: (c)=> c ? mapsSearch(`coffee near ${c.lat},${c.lng}`) : mapsSearch('koffie in de buurt')},
    fuel:  {label:'tankstations',  build: (c)=> c ? mapsSearch(`tankstation near ${c.lat},${c.lng}`) : mapsSearch('tankstation in de buurt')},
    photo: {label:'fotospots',     build: (c)=> c ? mapsSearch(`viewpoint near ${c.lat},${c.lng}`) : mapsSearch('scenic viewpoint in de buurt')}
  };

  menu.querySelectorAll('.fab-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = queries[btn.dataset.quick];
      dock.classList.remove('open'); menu.setAttribute('aria-hidden','true');
      if (navigator.geolocation){
        toast(`📍 Locatie ophalen…`);
        navigator.geolocation.getCurrentPosition(
          pos => openMaps(q.build({lat:pos.coords.latitude, lng:pos.coords.longitude})),
          ()  => { toast('Zonder GPS — algemene zoekopdracht'); openMaps(q.build(null)); },
          {enableHighAccuracy:true, timeout:8000, maximumAge:60000}
        );
      } else {
        openMaps(q.build(null));
      }
    });
  });
}
function openMaps(url){ window.open(url, '_blank', 'noopener'); }

/* =========================================================
   TOAST
   ========================================================= */
let toastTimer;
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1900);
}

/* =========================================================
   BOOT
   ========================================================= */
function boot(){
  buildTabs();
  buildPanels();
  panels[0].classList.add('active');
  document.getElementById('headerSubtitle').textContent = DAYS[0].eyebrow;
  initSwipe();
  initFab();
  updateProgress();

  // progress ring jumps to first unfinished-ish day: go to today if within range? keep day 1.
  document.getElementById('progressRing').addEventListener('click', () => go(DAYS.length)); // -> praktisch/overzicht
}
document.addEventListener('DOMContentLoaded', boot);
