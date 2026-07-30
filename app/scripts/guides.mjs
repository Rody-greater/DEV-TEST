/* =========================================================
   guides.mjs — Explore Mode reisgids per stop (build-time content).
   Gekoppeld op stop-id (zie generate-trip.mjs). Persoonlijke,
   korte toon: mooie autoroutes, fotografie, geen lange wandelingen,
   nooit haasten — de reis is onderdeel van de vakantie.
   ========================================================= */
export const GUIDES = {

  /* ===== DAG 1 ===== */
  'd1:monschau-altstadt': { category: 'historic', guide: {
    why: 'Sprookjesachtig vakwerkstadje in een groene kloof — perfecte eerste vakantiestop om even los te komen van de snelweg.',
    highlights: [
      { title: 'Marktplein & vakwerkhuizen', priority: 'essential', estimatedMinutes: 12 },
      { title: 'Wandeling langs de Rur', description: 'Kabbelend riviertje dwars door het centrum.', priority: 'essential', estimatedMinutes: 10 },
      { title: 'Rotes Haus', description: 'Het beroemde rode koopmanshuis.', priority: 'nice-to-have', estimatedMinutes: 8 }
    ],
    photoSpots: [
      { title: 'Bruggetje over de Rur', description: 'Vakwerkhuizen weerspiegeld in het water — mooiste plaatje van het stadje.', estimatedMinutes: 5 }
    ],
    food: ['Monschauer Dütchen bij een bakkerij', 'Terrasje aan het water'],
    practical: ['Parkeren bij P Au, dan te voet het autovrije centrum in'],
    walkingTime: 'kort, vlak',
    recommendedStayMinutes: 40, relaxedStayMinutes: 60,
    captainTip: 'Loop vanaf de parking meteen naar het water — daar staat het mooiste beeld op je te wachten.'
  }},
  'd1:n-rburgring-boulevard': { category: 'historic', guide: {
    why: 'Je rijdt een Range Rover Sport door de Eifel en komt er praktisch langs — even de legendarische racetempel proeven.',
    highlights: [
      { title: 'Boulevard & pitstraat-sfeer', priority: 'essential', estimatedMinutes: 15 },
      { title: 'Start/finish van de Nordschleife', priority: 'nice-to-have', estimatedMinutes: 10 }
    ],
    photoSpots: [
      { title: 'Auto voor de circuit-entree', description: 'Klassiek "wij waren hier"-shot met de ring op de achtergrond.', estimatedMinutes: 5 }
    ],
    practical: ['Ruime gratis parkeerplaats bij de Boulevard'],
    recommendedStayMinutes: 30, relaxedStayMinutes: 45,
    captainTip: 'De aanrijroute door het bos is minstens zo leuk als de stop zelf — GoPro alvast aan.'
  }},
  'd1:cochem-aan-de-moezel': { category: 'historic', guide: {
    why: 'Wijnstadje aan de Moezel met een burcht hoog boven het water — fijne plek voor een late lunch.',
    highlights: [
      { title: 'Rijkuierend over de boulevard', priority: 'essential', estimatedMinutes: 15 },
      { title: 'Blik omhoog naar Reichsburg', priority: 'essential', estimatedMinutes: 10 },
      { title: 'Marktplatz', priority: 'nice-to-have', estimatedMinutes: 15 }
    ],
    photoSpots: [
      { title: 'Reichsburg vanaf de Moezelbrug', description: 'Kasteel op de heuvel met de rivier ervoor.', estimatedMinutes: 8 }
    ],
    food: ['Moezelwijn op een terras aan het water', 'Flammkuchen'],
    practical: ['Parkeren op Endertplatz, 5 min lopen naar het centrum'],
    walkingTime: 'kort tot middel',
    recommendedStayMinutes: 60, relaxedStayMinutes: 90,
    captainTip: 'Rijd het laatste stuk over de Moezelweg B49 langs het water — veel mooier dan de snelweg.'
  }},
  'd1:geierlay-hangbrug': { category: 'bridge', guide: {
    why: 'Spectaculaire 360 m lange hangbrug over een groen dal — een echte kick, maar wel wat lopen.',
    highlights: [
      { title: 'Oversteek van de hangbrug', priority: 'essential', estimatedMinutes: 25 }
    ],
    photoSpots: [
      { title: 'Zijaanzicht van de brug', description: 'Vanaf het pad zie je de volle boog over het dal.', estimatedMinutes: 10 }
    ],
    practical: ['Vanaf de parking ± 20 min heen lopen naar de brug', 'Alleen leuk bij droog weer'],
    walkingTime: 'langer — reken op wandelen',
    recommendedStayMinutes: 80, relaxedStayMinutes: 100,
    captainTip: 'Dit kost het meeste loopwerk van de dag. Alleen doen als je ruim in je tijd zit; anders bewaar je ’m voor een keer met meer rust.'
  }},

  /* ===== DAG 2 ===== */
  'd2:rheinfall': { category: 'nature', guide: {
    why: 'De grootste waterval van Europa — donderend natuurgeweld, precies waarvoor je zo’n reis maakt.',
    highlights: [
      { title: 'Uitzichtplatforms bij Schloss Laufen', priority: 'essential', estimatedMinutes: 20 },
      { title: 'Kasteeltuin met waterval-blik', priority: 'nice-to-have', estimatedMinutes: 15 }
    ],
    photoSpots: [
      { title: 'Onderste platform Känzeli', description: 'Je staat er bovenop; het water spat bijna in beeld.', estimatedMinutes: 10 }
    ],
    practical: ['Parkeer aan de Schloss-Laufen-kant (zuid), direct aan de A4', 'Kleine entree voor de platforms'],
    walkingTime: 'kort, wel wat trappen',
    recommendedStayMinutes: 50, relaxedStayMinutes: 70,
    captainTip: 'Ga tot het onderste platform — daar voel je de kracht pas echt. Even nat worden hoort erbij.'
  }},
  'd2:luzern-kapellbr-cke-meer': { category: 'city', guide: {
    why: 'Compacte oude stad met een houten brug en bergmeer — de mooiste opmaat naar Weggis.',
    highlights: [
      { title: 'Kapellbrücke', description: 'Overdekte houten brug uit 1333.', priority: 'essential', estimatedMinutes: 15 },
      { title: 'Oude stad & pleintjes', priority: 'essential', estimatedMinutes: 20 },
      { title: 'Meerpromenade', priority: 'nice-to-have', estimatedMinutes: 15 }
    ],
    photoSpots: [
      { title: 'Kapellbrücke met bloembakken', description: 'Toren en brug weerspiegeld in de Reuss.', estimatedMinutes: 8 }
    ],
    food: ['Koffie met uitzicht aan het meer', 'Zwitserse chocolade voor onderweg'],
    practical: ['Parkhaus Altstadt, dan alles te voet', 'Vignette-check vóór de grens'],
    walkingTime: 'kort tot middel',
    recommendedStayMinutes: 70, relaxedStayMinutes: 100,
    captainTip: 'Houd Luzern compact: brug, een pleintje, koffie aan het water. Dan rijd je ontspannen door naar het hotel.'
  }},
  'd2:baden-baden': { category: 'city', guide: {
    why: 'Elegante kuurstad — een beschaafde koffiestop, veel prettiger dan een tankstation langs de A5.',
    highlights: [
      { title: 'Lichtentaler Allee', description: 'Statige parklaan langs het riviertje.', priority: 'essential', estimatedMinutes: 20 }
    ],
    photoSpots: [
      { title: 'Kurhaus met zuilengalerij', description: 'Klassieke grandeur, mooi symmetrisch shot.', estimatedMinutes: 6 }
    ],
    food: ['Koffie & taart in een grand café'],
    practical: ['Parkgarage Kurhaus, centraal'],
    walkingTime: 'kort',
    recommendedStayMinutes: 45, relaxedStayMinutes: 60,
    captainTip: 'Kort houden: benen strekken, een goede koffie, en weer richting de Alpen.'
  }},
  'd2:weggis-seepromenade': { category: 'lake', guide: {
    why: 'Rustig landen aan het Vierwoudstrekenmeer met de Rigi op de achtergrond.',
    highlights: [
      { title: 'Uitwaaien aan de promenade', priority: 'essential', estimatedMinutes: 20 }
    ],
    photoSpots: [
      { title: 'Steiger bij zonsondergang', description: 'Warm avondlicht over het meer en de bergen.', estimatedMinutes: 10 }
    ],
    food: ['Diner met meerzicht'],
    recommendedStayMinutes: 35, relaxedStayMinutes: 60,
    captainTip: 'Reserveer een tafel met zicht op het water — de zonsondergang is je beloning voor een lange rijdag.'
  }},

  /* ===== DAG 3 ===== */
  'd3:gotthardpas': { category: 'mountain', guide: {
    why: 'Klassieke bergpas op 2.106 m — veel mooier dan door de tunnel verdwijnen.',
    highlights: [
      { title: 'Passhöhe met bergmeertjes', priority: 'essential', estimatedMinutes: 15 },
      { title: 'Klein pas-museum', priority: 'nice-to-have', estimatedMinutes: 20 }
    ],
    photoSpots: [
      { title: 'Auto op de passhöhe', description: 'Kale bergtoppen en meertjes als decor.', estimatedMinutes: 8 }
    ],
    practical: ['Boven koud en winderig — warme laag mee', 'Kies bewust de pasroute, niet de tunnel'],
    walkingTime: 'nauwelijks — alles vanaf de auto',
    recommendedStayMinutes: 25, relaxedStayMinutes: 40,
    captainTip: 'Perfecte plek voor de eerste bergkoffie. Even uitstappen, de lucht opsnuiven, en genieten van het uitzicht.'
  }},
  'd3:oude-tremola': { category: 'mountain', guide: {
    why: 'Historische kasseienweg met eindeloze haarspelden — hét Range Rover-fotomoment van de heenreis.',
    highlights: [
      { title: 'Afdaling over de kasseien', priority: 'essential', estimatedMinutes: 20 }
    ],
    photoSpots: [
      { title: 'Haarspelden van bovenaf', description: 'De weg kronkelt als een lint door het dal — spectaculair beeld.', estimatedMinutes: 10 }
    ],
    practical: ['Zoek op "Tremola San Gottardo", niet de moderne hoofdweg', 'Rustig sturen op de kasseien'],
    walkingTime: 'geen — dit is een rij-highlight',
    recommendedStayMinutes: 30, relaxedStayMinutes: 45,
    captainTip: 'Dit is puur rijplezier. Stop bovenaan even voor de foto en geniet daarna van elke bocht naar beneden.'
  }},
  'd3:axenstrasse-fl-elen': { category: 'viewpoint', guide: {
    why: 'Korte fotostop aan het Urnersee met bergen en water — meteen Zwitserse roadtrip-sfeer.',
    highlights: [
      { title: 'Uitzicht over het meer', priority: 'essential', estimatedMinutes: 12 }
    ],
    photoSpots: [
      { title: 'Waterkant bij Flüelen', description: 'Spiegelglad meer met steile bergwanden.', estimatedMinutes: 8 }
    ],
    recommendedStayMinutes: 20, relaxedStayMinutes: 30,
    captainTip: 'Even benen strekken aan het water voor je gaat klimmen — heerlijk rustpunt.'
  }},
  'd3:menaggio-comomeer': { category: 'lake', guide: {
    why: 'Lunch aan het Comomeer zonder Como-stad in te hoeven — mooie promenade, eerste Italiaanse vibe.',
    highlights: [
      { title: 'Lungolago-promenade', priority: 'essential', estimatedMinutes: 20 },
      { title: 'Pleintje met terrasjes', priority: 'nice-to-have', estimatedMinutes: 25 }
    ],
    photoSpots: [
      { title: 'Bootjes aan de kade', description: 'Kleurige gevels en het meer met bergen erachter.', estimatedMinutes: 8 }
    ],
    food: ['Pasta of pizza aan het water', 'Gelato voor onderweg'],
    practical: ['Parcheggio in het centrum'],
    walkingTime: 'kort',
    recommendedStayMinutes: 65, relaxedStayMinutes: 90,
    captainTip: 'Pak een terras aan het water en neem de tijd — hierna is het nog maar zo’n twee uur naar Desenzano.'
  }},
  'd3:lecco-waterfront': { category: 'lake', guide: {
    why: 'Minder toeristische zuidpunt van het Comomeer — korte koffiestop als de dag soepel loopt.',
    highlights: [
      { title: 'Wandeling langs het water', priority: 'essential', estimatedMinutes: 15 }
    ],
    photoSpots: [
      { title: 'Bergen boven het meer', description: 'De Grigne-toppen rijzen recht uit het water op.', estimatedMinutes: 6 }
    ],
    food: ['Espresso aan de lungolago'],
    recommendedStayMinutes: 30, relaxedStayMinutes: 45,
    captainTip: 'Alleen meepakken als je lekker op schema ligt. Anders rijd je zonder spijt door naar het Gardameer.'
  }},

  /* ===== GARDAMEER POOL ===== */
  'gardapool:sirmione': { category: 'historic', guide: {
    why: 'Iconisch schiereiland met een waterkasteel en water aan drie kanten — het pareltje van het zuidelijke meer.',
    highlights: [
      { title: 'Castello Scaligero van buiten', priority: 'essential', estimatedMinutes: 20 },
      { title: 'Steegjes van het oude centrum', priority: 'essential', estimatedMinutes: 25 },
      { title: 'Jamaica Beach & Grotte di Catullo', description: 'Rotsplaten met helder water aan de punt.', priority: 'nice-to-have', estimatedMinutes: 40 }
    ],
    photoSpots: [
      { title: 'Kasteel met slotgracht', description: 'De ophaalbrug en kantelen weerspiegeld in het water.', estimatedMinutes: 10 }
    ],
    food: ['Gelato in het centrum', 'Aperitivo met meerzicht'],
    practical: ['Parkeer bij Monte Baldo — auto’s mogen het centrum niet in', 'Ga vroeg, na 10:30 wordt het druk'],
    walkingTime: 'middel — het schiereiland is compact maar je loopt wel',
    recommendedStayMinutes: 120, relaxedStayMinutes: 180,
    captainTip: 'Vroeg gaan is het geheim. Dan heb je de steegjes bijna voor jezelf en staat je auto in de schaduw.'
  }},
  'gardapool:limone-sul-garda': { category: 'lake', guide: {
    why: 'Citroenhuisjes tegen de rotswand en een fotogeniek haventje — plus een schitterende aanrijroute.',
    highlights: [
      { title: 'Oude haventje', priority: 'essential', estimatedMinutes: 20 },
      { title: 'Citroenterrassen (Limonaia)', priority: 'nice-to-have', estimatedMinutes: 25 }
    ],
    photoSpots: [
      { title: 'Haven met bergen erachter', description: 'Kleurige bootjes, pastelgevels, steile wand.', estimatedMinutes: 10 }
    ],
    food: ['Vis of pasta aan het water', 'Citroen-gelato — specialiteit'],
    practical: ['Parkeergarage aan de rand, dan te voet omlaag'],
    walkingTime: 'kort, wel wat trappetjes',
    recommendedStayMinutes: 90, relaxedStayMinutes: 150,
    captainTip: 'De westoever-route met tunnels hierheen is zelf al een belevenis — GoPro aan tijdens het rijden.'
  }},
  'gardapool:malcesine': { category: 'historic', guide: {
    why: 'Kasteel op een rots en een middeleeuws haventje — een van de mooiste dorpen aan het meer.',
    highlights: [
      { title: 'Castello Scaligero', priority: 'essential', estimatedMinutes: 25 },
      { title: 'Middeleeuwse haven', priority: 'essential', estimatedMinutes: 20 }
    ],
    photoSpots: [
      { title: 'Kasteeltoren boven de daken', description: 'Vanaf de haven omhoog kijken; toren tegen de bergen.', estimatedMinutes: 8 }
    ],
    food: ['Terras aan de haven', 'Gelato'],
    practical: ['Parcheggio centrale aan de rand'],
    walkingTime: 'middel',
    recommendedStayMinutes: 90, relaxedStayMinutes: 150,
    captainTip: 'Combineer met de kabelbaan naar Monte Baldo als het zicht helder is — eerst dorp, dan omhoog.'
  }},
  'gardapool:monte-baldo-kabelbaan': { category: 'mountain', guide: {
    why: 'Draaiende gondel van meerniveau naar 1.760 m — alpien panorama in tien minuten, en boven veel koeler.',
    highlights: [
      { title: 'Rondje bij het bergstation', priority: 'essential', estimatedMinutes: 40 },
      { title: 'Panorama over het hele meer', priority: 'essential', estimatedMinutes: 20 }
    ],
    photoSpots: [
      { title: 'Uitzicht vanaf de top', description: 'Het Gardameer als een blauw lint ver beneden je.', estimatedMinutes: 15 }
    ],
    practical: ['Reserveer online of ga vroeg — wachtrijen bij mooi weer', 'Neem een warme laag mee, boven waait het', 'Alleen bij helder zicht'],
    walkingTime: 'zo veel als je wilt — vlak rondom het station',
    recommendedStayMinutes: 120, relaxedStayMinutes: 180,
    captainTip: 'Check het zicht vóór je omhoog gaat. Bij wolken bewaar je ’m — de foto van boven máákt deze stop.'
  }},
  'gardapool:riva-del-garda': { category: 'lake', guide: {
    why: 'Noordpunt van het meer, omringd door steile rotswanden — levendig, mooi en frisser dan het zuiden.',
    highlights: [
      { title: 'Haven & Piazza III Novembre', priority: 'essential', estimatedMinutes: 25 },
      { title: 'Torre Apponale', priority: 'nice-to-have', estimatedMinutes: 15 }
    ],
    photoSpots: [
      { title: 'Haven met de Rocca', description: 'Waterburcht en bergen in één beeld.', estimatedMinutes: 8 }
    ],
    food: ['Lunch op de piazza', 'Gelato aan het water'],
    walkingTime: 'kort tot middel',
    recommendedStayMinutes: 90, relaxedStayMinutes: 150,
    captainTip: 'Combineer met Lago di Tenno er vlak boven — samen een perfecte, ontspannen halve dag.'
  }},
  'gardapool:lago-di-tenno': { category: 'lake', guide: {
    why: 'Onwerkelijk turquoise bergmeertje boven Riva — bij zon lijkt het water te gloeien.',
    highlights: [
      { title: 'Uitzicht op het meer', priority: 'essential', estimatedMinutes: 20 },
      { title: 'Middeleeuws dorpje Canale di Tenno', priority: 'nice-to-have', estimatedMinutes: 25 }
    ],
    photoSpots: [
      { title: 'Turquoise water met eilandje', description: 'Van bovenaf de weg heb je het mooiste kleurcontrast.', estimatedMinutes: 10 }
    ],
    practical: ['Parkeren bij het meer', 'Mooist bij zonlicht'],
    walkingTime: 'kort',
    recommendedStayMinutes: 60, relaxedStayMinutes: 90,
    captainTip: 'Ga bij helder weer — de kleur van het water is hier de hele reden. Even stoppen boven de weg voor het beste plaatje.'
  }},
  'gardapool:lago-di-molveno': { category: 'lake', guide: {
    why: 'Kristalhelder meer aan de voet van de Brenta-Dolomieten — een adembenemende dagtrip weg van de drukte.',
    highlights: [
      { title: 'Wandeling langs de oever', priority: 'essential', estimatedMinutes: 30 },
      { title: 'Lido met bergpanorama', priority: 'nice-to-have', estimatedMinutes: 40 }
    ],
    photoSpots: [
      { title: 'Meer met Brenta-toppen', description: 'Spiegelglad water met scherpe rotspieken erachter.', estimatedMinutes: 12 }
    ],
    practical: ['± 1u15 rijden — reken op een halve dag', 'Alleen op een heldere dag echt de moeite'],
    walkingTime: 'zo veel als je wilt',
    recommendedStayMinutes: 120, relaxedStayMinutes: 180,
    captainTip: 'De rit erheen door de bergen is de helft van de lol. Alleen doen bij helder weer — dan máken de toppen het plaatje.'
  }},

  /* ===== DAG 4 ===== */
  'd4:riva-del-garda': { category: 'lake', guide: {
    why: 'Laatste blik op het Gardameer met dramatische rotswanden — perfecte koffiestop voor je gaat klimmen.',
    highlights: [
      { title: 'Havenrondje', priority: 'essential', estimatedMinutes: 20 }
    ],
    photoSpots: [
      { title: 'Waterburcht Rocca', description: 'De burcht met het meer en de bergen.', estimatedMinutes: 8 }
    ],
    food: ['Koffie aan de haven'],
    recommendedStayMinutes: 40, relaxedStayMinutes: 60,
    captainTip: 'Even koffie en een laatste meerfoto — daarna begint het echte klimwerk richting de Dolomieten.'
  }},
  'd4:lago-di-carezza': { category: 'lake', guide: {
    why: 'Het "regenboogmeer" met de Latemar-toppen erin weerspiegeld — een van de meest gefotografeerde plekjes van de Dolomieten.',
    highlights: [
      { title: 'Uitzichtpunt aan het meer', priority: 'essential', estimatedMinutes: 20 }
    ],
    photoSpots: [
      { title: 'Spiegeling van de Latemar', description: 'Windstil water = perfecte reflectie van de bergwand.', estimatedMinutes: 12 }
    ],
    practical: ['Parkeren bij het meer, korte overkant naar het uitzicht', 'Windstil = spiegelbeeld; ga vroeg'],
    walkingTime: 'kort',
    recommendedStayMinutes: 45, relaxedStayMinutes: 60,
    captainTip: 'Ga vroeg — na de middag steekt vaak de wind op en verdwijnt de reflectie. Windstil is goud hier.'
  }},
  'd4:passo-di-costalunga': { category: 'mountain', guide: {
    why: 'Vloeiende pas net boven Carezza met je eerste echte Dolomieten-panorama — mooie opwarmer voor Passo Sella.',
    highlights: [
      { title: 'Passhöhe met uitzicht', priority: 'essential', estimatedMinutes: 12 }
    ],
    photoSpots: [
      { title: 'Latemar-massief vanaf de top', description: 'Kartelige toppen boven groene weiden.', estimatedMinutes: 6 }
    ],
    recommendedStayMinutes: 20, relaxedStayMinutes: 30,
    captainTip: 'Kort stoppen voor koffie en het uitzicht — daarna vloeiende bochten richting de grote passen.'
  }},
  'd4:passo-sella': { category: 'mountain', guide: {
    why: 'Recht onder de getande Sassolungo-torens door — een van de indrukwekkendste passen van de Alpen.',
    highlights: [
      { title: 'Passhöhe onder de Sassolungo', priority: 'essential', estimatedMinutes: 20 }
    ],
    photoSpots: [
      { title: 'Weg richting de torens', description: 'De asfaltlint kronkelt naar de rotsnaalden — episch.', estimatedMinutes: 10 }
    ],
    practical: ['Alleen bij goed zicht echt mooi'],
    walkingTime: 'nauwelijks',
    recommendedStayMinutes: 30, relaxedStayMinutes: 45,
    captainTip: 'GoPro op de motorkap richting de Sassolungo. Morgen rijd je ’m opnieuw als opener — dubbel genieten.'
  }},
  'd4:lago-di-molveno': { category: 'lake', guide: {
    why: 'Optioneel juweel op de vroege route — schitterend meer, maar alleen als je ruim op schema ligt.',
    highlights: [
      { title: 'Korte oeverwandeling', priority: 'nice-to-have', estimatedMinutes: 25 }
    ],
    photoSpots: [
      { title: 'Meer met Brenta-Dolomieten', description: 'Helder water, scherpe toppen.', estimatedMinutes: 10 }
    ],
    recommendedStayMinutes: 45, relaxedStayMinutes: 75,
    captainTip: 'Bij twijfel bewaar je ’m — de passen van vandaag en morgen zijn de hoofdact. Geen spijt als je doorrijdt.'
  }},
  'd4:val-di-fassa-canazei-dorp': { category: 'mountain', guide: {
    why: 'Gezellig bergdorp op 1.450 m, omringd door de Sella- en Marmolada-massieven — fijn rondje voor het diner.',
    highlights: [
      { title: 'Wandeling door het centrum', priority: 'essential', estimatedMinutes: 20 }
    ],
    photoSpots: [
      { title: 'Straatje met bergdecor', description: 'Houten balkons vol bloemen, toppen erachter.', estimatedMinutes: 6 }
    ],
    food: ['Zuid-Tiroolse specialiteiten op een terras'],
    recommendedStayMinutes: 40, relaxedStayMinutes: 60,
    captainTip: 'Vroeg inchecken bij Chalet Vites en op een terras de eerste bergavond vieren. Je bent er bijna.'
  }},

  /* ===== DAG 5 — de mooiste dag ===== */
  'd5:passo-sella': { category: 'mountain', guide: {
    why: 'De opener van de grote Dolomieten-dag: ochtendlicht op de Sassolungo-torens — de mooiste start die je je kunt wensen.',
    highlights: [
      { title: 'Passhöhe met ochtendlicht', priority: 'essential', estimatedMinutes: 20 }
    ],
    photoSpots: [
      { title: 'Weg naar de torens', description: 'Vroeg licht kleurt de rotsen goud.', estimatedMinutes: 10 }
    ],
    walkingTime: 'nauwelijks',
    recommendedStayMinutes: 25, relaxedStayMinutes: 35,
    captainTip: 'Vroeg is goud vandaag: helder licht, lege weg. Even stoppen voor het klassieke beeld en dan door.'
  }},
  'd5:passo-gardena-gr-dner-joch': { category: 'mountain', guide: {
    why: 'Glooiende alpenweiden onder de verticale Sella-wanden — zachter en groener dan Sella, minstens zo fotogeniek.',
    highlights: [
      { title: 'Passhöhe met bergpost', priority: 'essential', estimatedMinutes: 15 }
    ],
    photoSpots: [
      { title: 'Weiden onder de Sella-torens', description: 'Groen grasland met verticale rotswand.', estimatedMinutes: 8 }
    ],
    food: ['Koffie bij de bergpost op de top'],
    recommendedStayMinutes: 25, relaxedStayMinutes: 35,
    captainTip: 'Ideale koffiestop voor je doorrijdt naar Falzarego. Neem rustig een espresso met uitzicht.'
  }},
  'd5:passo-falzarego': { category: 'mountain', guide: {
    why: 'Het hoogste punt van de dag (2.105 m), kaal en groots — scherpe lucht en eindeloos uitzicht.',
    highlights: [
      { title: 'Passhöhe & bergpanorama', priority: 'essential', estimatedMinutes: 20 },
      { title: 'Kabelbaan Lagazuoi', description: 'Omhoog naar 2.750 m voor 360°-uitzicht.', priority: 'nice-to-have', estimatedMinutes: 75 }
    ],
    photoSpots: [
      { title: 'Kale toppen vanaf de pas', description: 'Rotsamfitheater rondom, groots en leeg.', estimatedMinutes: 8 }
    ],
    practical: ['Warme laag mee — op deze hoogte fris', 'Kan in de wolken hangen'],
    recommendedStayMinutes: 30, relaxedStayMinutes: 45,
    captainTip: 'Even uit de auto: de lucht is hier scherp en het uitzicht eindeloos. De kabelbaan alleen als je ruim in de tijd zit.'
  }},
  'd5:lago-di-misurina': { category: 'lake', guide: {
    why: 'Rustig bergmeer op 1.750 m met de Dolomieten weerspiegeld — de perfecte lunchstop, zonder de drukte van Tre Cime.',
    highlights: [
      { title: 'Lunch aan het water', priority: 'essential', estimatedMinutes: 45 },
      { title: 'Rondje langs het meer', priority: 'nice-to-have', estimatedMinutes: 25 }
    ],
    photoSpots: [
      { title: 'Spiegeling in het meer', description: 'Windstil water met de Sorapis-toppen erachter.', estimatedMinutes: 10 }
    ],
    food: ['Terras aan het meer voor pasta of een broodje'],
    walkingTime: 'kort',
    recommendedStayMinutes: 70, relaxedStayMinutes: 90,
    captainTip: 'Neem hier rustig je lunch — hierna is het nog maar een dik half uur naar Braies. Geen haast.'
  }},
  'd5:lago-di-braies-p2-geboekt': { category: 'lake', guide: {
    why: 'Het smaragdgroene kroonjuweel van de Dolomieten, met houten roeibootjes en de Seekofel erachter. Je P2-parking staat gereserveerd.',
    highlights: [
      { title: 'Uitzicht vanaf de botensteiger', priority: 'essential', estimatedMinutes: 25 },
      { title: 'Stuk langs de oever lopen', priority: 'nice-to-have', estimatedMinutes: 40 }
    ],
    photoSpots: [
      { title: 'Roeibootjes met bergwand', description: 'Het iconische beeld: houten bootjes, groen water, Seekofel.', estimatedMinutes: 15 }
    ],
    practical: ['Gebruik de knop "Navigeer naar P2" — parking is geboekt', 'Middaglicht trekt de drukte weg'],
    walkingTime: 'kort tot middel, vlak langs het water',
    recommendedStayMinutes: 75, relaxedStayMinutes: 100,
    captainTip: 'Loop een stukje langs het water weg van de steiger — daar wordt het meteen rustiger en het licht mooier.'
  }},
  'd5:lagazuoi-kabelbaan': { category: 'viewpoint', guide: {
    why: 'Optioneel vanaf Falzarego: omhoog naar 2.750 m voor het meest weidse uitzicht van de dag.',
    highlights: [
      { title: 'Panorama vanaf het terras', priority: 'nice-to-have', estimatedMinutes: 45 }
    ],
    photoSpots: [
      { title: 'Dolomieten-zee van boven', description: 'Golf na golf van toppen tot de horizon.', estimatedMinutes: 15 }
    ],
    practical: ['Alleen bij helder zicht', 'Houd de klok in de gaten i.v.m. het 17:00-ritual'],
    recommendedStayMinutes: 75, relaxedStayMinutes: 90,
    captainTip: 'Prachtig, maar het kost tijd. Alleen als je ruim voor ligt — anders bewaren we ’m en rijden we ontspannen door naar Braies.'
  }},
  'd5:rifugio-stop-naar-keuze': { category: 'mountain', guide: {
    why: 'Tussen de passen liggen tal van berghutten voor een espresso met uitzicht — pak er eentje waar het je aanstaat.',
    highlights: [
      { title: 'Espresso met bergpanorama', priority: 'nice-to-have', estimatedMinutes: 25 }
    ],
    photoSpots: [
      { title: 'Terras met uitzicht', description: 'Bergdecor vanaf een zonnig rifugio-terras.', estimatedMinutes: 6 }
    ],
    food: ['Kaiserschmarrn of een broodje speck'],
    recommendedStayMinutes: 30, relaxedStayMinutes: 45,
    captainTip: 'Kleine, on-toeristische rifugi net naast de pas zijn vaak het lekkerst én het rustigst. Puur bonus als er tijd is.'
  }},

  /* ===== DAG 6 ===== */
  'd6:innsbruck-lunchstop': { category: 'city', guide: {
    why: 'Bergstad met een compacte oude stad, het Goldene Dachl en bergen aan alle kanten — ideaal om halverwege de benen te strekken.',
    highlights: [
      { title: 'Altstadt & Goldenes Dachl', priority: 'essential', estimatedMinutes: 30 },
      { title: 'Maria-Theresien-Straße', priority: 'nice-to-have', estimatedMinutes: 20 }
    ],
    photoSpots: [
      { title: 'Goldenes Dachl', description: 'Het gouden dakje met bergen erboven aan het eind van de straat.', estimatedMinutes: 8 }
    ],
    food: ['Lunch in de Altstadt', 'Tiroolse Kaffee & Kuchen'],
    practical: ['Parkgarage Altstadt, centraal'],
    walkingTime: 'kort tot middel',
    recommendedStayMinutes: 75, relaxedStayMinutes: 100,
    captainTip: 'Kort en krachtig: parkeer centraal, lunch met bergzicht, en weer door. Nog een flinke rit te gaan vandaag.'
  }},
  'd6:heidelberg-altstadt-schloss': { category: 'historic', guide: {
    why: 'Aankomst met stijl: het beroemde kasteel boven de Neckar en een sfeervolle oude stad in avondlicht.',
    highlights: [
      { title: 'Slot & terras met uitzicht', priority: 'essential', estimatedMinutes: 40 },
      { title: 'Altstadt & Hauptstraße', priority: 'nice-to-have', estimatedMinutes: 30 }
    ],
    photoSpots: [
      { title: 'Slot boven de Neckar', description: 'Kasteelruïne met de rivier en rode daken eronder.', estimatedMinutes: 12 }
    ],
    food: ['Diner in de Altstadt'],
    practical: ['Parkhaus P12 bij het slot'],
    walkingTime: 'middel — wat klimmen naar het slot',
    recommendedStayMinutes: 90, relaxedStayMinutes: 120,
    captainTip: 'Berggasthof Königstuhl ligt bóven de stad — geniet eerst van het uitzicht en rijd daarna rustig omhoog.'
  }},
  'd6:vipiteno-sterzing': { category: 'historic', guide: {
    why: 'Kleurrijk Zuid-Tirools stadje net vóór de Brenner — laatste kans om echt Italië te proeven.',
    highlights: [
      { title: 'Hoofdstraat met Zwölferturm', priority: 'essential', estimatedMinutes: 20 }
    ],
    photoSpots: [
      { title: 'Zwölferturm boven de straat', description: 'Pastelgevels leiden naar de stadstoren.', estimatedMinutes: 6 }
    ],
    food: ['Laatste goede espresso & Speck voor onderweg'],
    recommendedStayMinutes: 30, relaxedStayMinutes: 45,
    captainTip: 'Even uitstappen voor een espresso en wat Speck voor de lange rit — klein maar heerlijk rustpunt.'
  }},
  'd6:alte-br-cke-heidelberg': { category: 'bridge', guide: {
    why: 'Klassieke wandeling over de oude brug met zicht op kasteel en rivier — rustig uitwaaien na een dag rijden.',
    highlights: [
      { title: 'Oversteek van de Alte Brücke', priority: 'essential', estimatedMinutes: 15 }
    ],
    photoSpots: [
      { title: 'Brug met kasteel', description: 'De brugpoort met de slotruïne erachter.', estimatedMinutes: 8 }
    ],
    walkingTime: 'kort',
    recommendedStayMinutes: 30, relaxedStayMinutes: 45,
    captainTip: 'Loop even naar de overkant (Philosophenweg-zijde) voor het beroemde ansichtkaart-uitzicht.'
  }},

  /* ===== DAG 7 ===== */
  'd7:k-ln-dom-rijnboulevard': { category: 'city', guide: {
    why: 'Ideale beenstrek-stop op de weg naar huis: de imposante Dom en een espresso aan de Rijn.',
    highlights: [
      { title: 'Kölner Dom van dichtbij', priority: 'essential', estimatedMinutes: 25 },
      { title: 'Rijnboulevard', priority: 'nice-to-have', estimatedMinutes: 20 }
    ],
    photoSpots: [
      { title: 'Dom-torens van onderaf', description: 'De gotische torens vullen je hele beeld.', estimatedMinutes: 8 }
    ],
    food: ['Koffie aan de Rijn'],
    practical: ['Parkhaus Am Dom, direct bij de kathedraal'],
    walkingTime: 'kort',
    recommendedStayMinutes: 60, relaxedStayMinutes: 80,
    captainTip: 'Laatste echte stop van de reis — neem rustig een koffie aan het water voor het laatste stuk naar huis.'
  }},
  'd7:designer-outlet-roermond': { category: 'city', guide: {
    why: 'Vlak over de grens: handig als je de reis met een laatste stop wil rekken.',
    highlights: [
      { title: 'Rondje langs de winkels', priority: 'nice-to-have', estimatedMinutes: 45 }
    ],
    practical: ['Grote parking bij de ingang', 'Bij druk vrijdagverkeer eerder overslaan'],
    recommendedStayMinutes: 45, relaxedStayMinutes: 90,
    captainTip: 'Alleen doen als iedereen er zin in heeft. Anders rijd je zonder spijt door naar huis.'
  }},
  'd7:thuis-in-almere': { category: 'city', guide: {
    why: 'Einde van een onvergetelijke roadtrip — auto uitladen, foto’s terugkijken en nagenieten.',
    highlights: [
      { title: 'Thuiskomen', priority: 'essential', estimatedMinutes: 10 }
    ],
    photoSpots: [
      { title: 'Laatste kilometerstand', description: 'Even vastleggen wat je hebt gereden.', estimatedMinutes: 3 }
    ],
    recommendedStayMinutes: 15,
    captainTip: 'Back-up je GoPro-kaarten meteen — die beelden wil je nooit kwijtraken. Welkom thuis.'
  }}
}
