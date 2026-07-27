/* =========================================================
   build.mjs — pre-renders the whole trip into static HTML.
   Emits:
     • index.html                     (links styles.css + script.js)
     • Roadtrip-Companion-2026.html    (self-contained, all inline)
   Content is baked into the HTML so it works WITHOUT JavaScript.
   Run:  node build.mjs
   ========================================================= */
import { readFileSync, writeFileSync } from 'fs';
import { DAYS, CHECKLISTS, mapsSearch, mapsDir, gsearch, booking } from './data.js';

/* ---------- helpers ---------- */
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const escA = s => esc(s).replace(/"/g,'&quot;');
const stars = n => '★★★★★☆☆☆☆☆'.slice(5-n, 10-n);
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
const A = (cls, href, lead, ic, go='Maps →') =>
  `<a class="action ${cls}" href="${href}" target="_blank" rel="noopener"><span class="lead"><span class="ic">${ic}</span> ${lead}</span><span class="go">${go}</span></a>`;

/* ---------- stop card ---------- */
function stopHTML(dayId, cat, stop){
  const key = `${dayId}-${cat}-${slug(stop.title)}`;
  const id = 'chk-' + key;
  const navQuery = stop.nav || stop.title.split(/ — | \/ | \(/)[0].trim();

  const pills = [];
  if (stop.best)    pills.push(`<span class="pill best">☀️ ${esc(stop.best)}</span>`);
  if (stop.weather) pills.push(`<span class="pill weather">🌦️ ${esc(stop.weather)}</span>`);

  let acts = '<div class="actions">';
  if (stop.special === 'p2')
    acts += A('nav', mapsSearch('Parcheggio P2 Lago di Braies Prags'),
              'Navigeer naar P2 <em style="color:var(--muted);font-style:normal">· geboekt</em>', '🅿️');
  if (stop.parking) acts += A('', mapsSearch(stop.parking), 'Parkeren', '🚗');
  acts += A('nav', mapsSearch(navQuery), 'Navigeer hierheen', '🧭');
  if (stop.photo) acts += A('', mapsSearch(stop.photo), 'Fotospot', '📸');
  acts += '</div>';

  return `<details class="stop" data-key="${escA(key)}">
  <summary class="stop-summary">
    <span class="check"><input type="checkbox" class="stop-check" id="${id}"><label class="box" for="${id}" aria-label="Afvinken"></label></span>
    <span class="stop-emoji">${stop.emoji}</span>
    <div class="stop-main"><div class="stop-title">${esc(stop.title)}</div>
      <div class="stop-sub"><span class="stars">${stars(stop.stars)}</span><span>⏱ ${esc(stop.time)}</span></div></div>
    <span class="chev">▾</span>
  </summary>
  <div class="stop-body">
    ${pills.length?`<div class="info-row">${pills.join('')}</div>`:''}
    <p>${esc(stop.desc)}</p>
    ${stop.tip?`<div class="tip"><b>Tip &nbsp;</b><span>${esc(stop.tip)}</span></div>`:''}
    ${stop.warning?`<div class="warning">⚠️ ${esc(stop.warning)}</div>`:''}
    ${acts}
  </div>
</details>`;
}

function catBlock(dayId, cat, label, stops){
  if (!stops || !stops.length) return '';
  return `<div class="cat-head cat-${cat}"><span class="cat-dot"></span>${label}</div>` +
         stops.map(s => stopHTML(dayId, cat, s)).join('');
}

function miniBlock(title, items){
  if (!items || !items.length) return '';
  const chips = items.map(it =>
    `<a class="chip" href="${mapsSearch(it.q)}" target="_blank" rel="noopener"><span class="ic">📍</span>${esc(it.t)}</a>`).join('');
  return `<div class="mini-block"><h4>${title}</h4><div class="chiplist">${chips}</div></div>`;
}

function hotelHTML(h){
  if (!h) return '';
  const booked = h.booked ? `<span class="tag-booked">✓ ${esc(h.bookedLabel || 'geboekt')}</span>` : '';
  let feats = '';
  const f = (k,v)=>{ if(v && v!=='—') feats += `<div class="feat-item"><b>${k}</b>${esc(v)}</div>`; };
  f('Inchecken',h.checkin); f('Parkeren',h.parking); f('EV laden',h.ev); f('Restaurant',h.restaurant); f('Wellness',h.wellness);

  let acts = '<div class="actions" style="margin-top:14px">';
  acts += A('nav', mapsSearch(h.mapsQuery), 'Navigeer naar hotel', '🧭');
  acts += A('', mapsSearch(h.mapsQuery), 'Adres &amp; telefoon', '📞');
  if (h.website)      acts += A('book', gsearch(h.website + ' officiële website'), 'Website', '🌐', 'Zoek →');
  if (h.bookingQuery) acts += A('book', booking(h.bookingQuery), 'Booking', '🛏️', 'Open →');
  acts += '</div>';

  return `<section class="hotel"><div class="hotel-head"><h3>🏨 ${esc(h.name)}</h3>${booked}</div>
    <p class="addr">${esc(h.address)}</p>
    ${feats?`<div class="feat">${feats}</div>`:''}${acts}</section>`;
}

function wellnessHTML(w){
  return `<section class="wellness-card"><h3>🧖 Leitlhof Spa &amp; Wellbeing</h3>
    <div class="ritual"><div><div class="t">Wellbeing Ritual</div>
      <div style="color:var(--muted);font-size:12.5px;margin-top:2px">Vaste afspraak</div></div>
      <div style="text-align:right"><div class="time">${esc(w.ritualTime)}</div><span class="tag-booked">✓ geboekt</span></div></div>
    <div class="feat">
      <div class="feat-item"><b>Spa openingstijden</b>${esc(w.spa)}</div>
      <div class="feat-item"><b>Zwembad</b>${esc(w.pool)}</div>
      <div class="feat-item"><b>Sauna</b>${esc(w.sauna)}</div>
      <div class="feat-item"><b>Textielvrij</b>${esc(w.textileFree)}</div></div>
    <div class="tip" style="margin-top:12px"><b>Massage &nbsp;</b><span>${esc(w.massage)}</span></div></section>`;
}

function timelineHTML(items){
  const rows = items.map(it =>
    `<div class="tl-item${it.cls?' '+it.cls:''}"><div class="tl-time">${esc(it.time)}</div>
      <div class="tl-title">${esc(it.title)}</div>${it.note?`<div class="tl-note">${esc(it.note)}</div>`:''}</div>`).join('');
  return `<div class="mini-block"><h4>⏱ Tijdlijn van de dag</h4><div class="timeline">${rows}</div></div>`;
}

/* ---------- one day panel ---------- */
function panelHTML(day){
  let h = `<div class="day-hero"><div class="day-eyebrow">${esc(day.eyebrow)}</div>
    <h2>${esc(day.title)}</h2><p class="subtitle">${esc(day.subtitle)}</p></div>`;

  if (!day.isPool){
    h += `<div class="stat-strip">
      <div class="stat accent"><span class="k">Afstand</span><span class="v">${esc(day.km)}</span></div>
      <div class="stat"><span class="k">Rijtijd</span><span class="v">${esc(day.drive)}</span></div>
      <div class="stat nav"><span class="k">Vertrek</span><span class="v">${esc(day.depart)}</span></div>
      <div class="stat"><span class="k">Aankomst</span><span class="v">${esc(day.arrive)}</span></div></div>`;
  }

  if (day.route){
    const comfort = mapsDir(day.route.origin, day.route.dest);
    const epic = mapsDir(day.route.origin, day.route.dest, day.route.epic);
    const cSub = day.driveComfort ? `${esc(day.driveComfort)} · snelste weg` : 'Snelste weg';
    const eSub = day.driveEpic ? `${esc(day.driveEpic)} · langs highlights` : 'Langs de highlights';
    h += `<div class="routes">
      <a class="route-btn route-comfort" href="${comfort}" target="_blank" rel="noopener">🟢 Comfort route<small>${cSub}</small></a>
      <a class="route-btn route-epic" href="${epic}" target="_blank" rel="noopener">🔥 Epic route<small>${eSub}</small></a></div>`;
  }

  if (day.departAdvice)
    h += `<div class="depart-advice"><div><div class="lbl">Aanbevolen vertrek</div>
      <div class="big">${esc(day.departAdvice.time)}</div></div><div class="txt">${esc(day.departAdvice.text)}</div></div>`;

  if (day.weather)    h += `<div class="banner banner-advice"><strong>Weer:</strong> ${esc(day.weather)}</div>`;
  if (day.badWeather) h += `<div class="banner banner-weather"><strong>Bij slecht weer:</strong> ${esc(day.badWeather)}</div>`;
  if (day.advice)     h += `<div class="banner banner-advice"><strong>Mijn keuze:</strong> ${esc(day.advice)}</div>`;

  if (day.timeline) h += timelineHTML(day.timeline);

  if (day.isPool){
    if (day.poolIntro) h += `<div class="pool-intro"><b>Zo werkt het:</b> ${esc(day.poolIntro)}</div>`;
    h += `<div class="cat-head cat-nice"><span class="cat-dot"></span>Kies je bestemmingen</div>`;
    h += day.pool.map(s => stopHTML(day.id, 'pool', s)).join('');
  } else {
    h += catBlock(day.id, 'must',  '🟥 Must do', day.cats.must);
    h += catBlock(day.id, 'nice',  '🟧 Leuk / nice to have', day.cats.nice);
    h += catBlock(day.id, 'bonus', '🟩 Bonus', day.cats.bonus);
  }

  h += miniBlock('🍝 Restauranttips', day.restaurants);
  h += miniBlock('🎬 GoPro-momenten', day.gopro);
  h += miniBlock('📸 Fotospots', day.fotospots);
  if (day.fuel) h += `<div class="mini-block"><h4>⛽ Tankadvies</h4><div class="fuel-note">${esc(day.fuel)}</div></div>`;
  if (day.wellness) h += wellnessHTML(day.wellness);
  h += hotelHTML(day.hotel);
  return h;
}

/* ---------- practical / checklist panel ---------- */
function practicalHTML(){
  let h = `<div class="day-hero"><div class="day-eyebrow">Voor vertrek · onderweg</div>
    <h2>Roadtrip Checklist</h2><p class="subtitle">Afvinken wat klaar is — opgeslagen op dit toestel</p></div>`;
  CHECKLISTS.forEach((g, gi) => {
    const key = 'cl-' + slug(g.title);
    const items = g.items.map((label, i) => {
      const id = `${key}-${i}`;
      return `<label class="cl-item"><input type="checkbox" class="cl-check" id="${id}"><span class="box"></span><span class="lbl">${esc(label)}</span></label>`;
    }).join('');
    h += `<details class="checklist-group"${gi===0?' open':''}>
      <summary class="cl-head"><h3><span>${g.icon}</span> ${esc(g.title)}</h3><span class="cl-count">0/${g.items.length}</span></summary>
      <div class="cl-body">${items}</div></details>`;
  });
  h += `<div class="foot">Roadtrip Companion 2026 · werkt volledig offline · alle voortgang staat lokaal op dit toestel.<br>Controleer bij vertrek altijd actuele weers- en verkeersinfo.</div>`;
  return h;
}

/* ---------- assemble body ---------- */
function buildBody(){
  // tabs
  let labels = DAYS.map((d,i) => `<label class="day-tab${i===0?' active':''}" for="day-${i}">${d.tab.n}<span>${esc(d.tab.label)}</span></label>`).join('');
  labels += `<label class="day-tab practical" for="day-${DAYS.length}">⚙️<span>Praktisch</span></label>`;

  // radios + panels (radio immediately before its panel → CSS shows it, no JS)
  let panels = DAYS.map((d,i) =>
    `<input class="tabstate" type="radio" name="day" id="day-${i}"${i===0?' checked':''} data-sub="${escA(d.eyebrow)}">
     <section class="panel" id="panel-${i}">${panelHTML(d)}</section>`).join('\n');
  panels += `\n<input class="tabstate" type="radio" name="day" id="day-${DAYS.length}" data-sub="Checklist &amp; praktische info">
     <section class="panel" id="panel-${DAYS.length}">${practicalHTML()}</section>`;

  const fabItems = [
    ['here','📍','Ik ben hier','mijn locatie'],
    ['food','🍝','Restaurant','restaurant in de buurt'],
    ['coffee','☕','Koffie','koffie in de buurt'],
    ['fuel','⛽','Tankstation','tankstation in de buurt'],
    ['photo','📸','Fotospot','scenic viewpoint in de buurt']
  ].map(([k,ic,label,q]) =>
    `<a class="fab-item" data-quick="${k}" href="${mapsSearch(q)}" target="_blank" rel="noopener"><span>${ic}</span> ${label}</a>`).join('');

  return `
  <header class="app-header" id="appHeader">
    <div class="header-inner">
      <div class="header-top">
        <div class="brand"><span class="brand-mark">▚</span>
          <div class="brand-text"><h1>Roadtrip Companion</h1><p id="headerSubtitle">${esc(DAYS[0].eyebrow)}</p></div></div>
        <button class="progress-ring" id="progressRing" type="button" title="Voortgang / Praktisch" aria-label="Voortgang"><span id="progressPct">0%</span></button>
      </div>
      <nav class="day-tabs" id="dayTabs" aria-label="Dagen">${labels}</nav>
    </div>
  </header>

  <main id="main">
${panels}
  </main>

  <div class="fab-dock" id="fabDock">
    <input type="checkbox" class="fab-state" id="fabState">
    <label class="fab fab-toggle" for="fabState" aria-label="Snelacties"><span class="fab-icon">⚡</span></label>
    <div class="fab-menu" id="fabMenu">${fabItems}</div>
  </div>

  <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}

/* ---------- generated CSS: correct active-tab highlight without JS (via :has) ---------- */
const activeSel = DAYS.map((_,i)=>`body:has(#day-${i}:checked) .day-tab[for="day-${i}"]`).join(',');
const activeSpan = DAYS.map((_,i)=>`body:has(#day-${i}:checked) .day-tab[for="day-${i}"] span`).join(',');
const pracIdx = DAYS.length;
const genCSS = `
/* no-JS active tab highlight */
${activeSel}{background:linear-gradient(155deg,var(--bronze),var(--bronze-deep));border-color:var(--bronze);color:#161009;box-shadow:0 6px 20px var(--bronze-glow)}
${activeSpan}{color:#3a2a15}
body:has(#day-${pracIdx}:checked) .day-tab.practical{background:linear-gradient(155deg,#e0e0dc,#b8b8b3);border-color:#cfcfc9;color:#161616}
body:has(#day-${pracIdx}:checked) .day-tab.practical span{color:#333}`;

/* ---------- write files ---------- */
const css  = readFileSync('./styles.css','utf8');
const js   = readFileSync('./script.js','utf8');
const icon = readFileSync('./assets/icon.svg','utf8');
const iconData = 'data:image/svg+xml;base64,' + Buffer.from(icon).toString('base64');
const body = buildBody();

const head = (styleTag, iconHref) => `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#111111">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="description" content="Premium offline roadtrip companion — Duitsland · Zwitserland · Noord-Italië · Dolomieten">
  <title>Roadtrip Companion 2026</title>
  <link rel="icon" type="image/svg+xml" href="${iconHref}">
  <link rel="apple-touch-icon" href="${iconHref}">
  ${styleTag}
</head>
<body>`;

// dev version — external css/js
const indexHtml = head('<link rel="stylesheet" href="styles.css">\n  <style>' + genCSS + '\n  </style>', 'assets/icon.svg') + body +
  '\n  <script src="script.js"></script>\n</body>\n</html>\n';

// standalone — everything inline, no external files at all
const standalone = head(`<style>\n${css}\n${genCSS}\n  </style>`, iconData) + body +
  `\n  <script>\n${js}\n  </script>\n</body>\n</html>\n`;

writeFileSync('./index.html', indexHtml);
writeFileSync('./Roadtrip-Companion-2026.html', standalone);
console.log('Built index.html (' + indexHtml.length + ' bytes) and Roadtrip-Companion-2026.html (' + standalone.length + ' bytes)');
