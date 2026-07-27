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

export { enc, mapsSearch, mapsDir, gsearch, booking, DAYS, CHECKLISTS };
