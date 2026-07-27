/* =========================================================
   Roadtrip Companion 2026 — progressive enhancement
   The page is fully pre-rendered and works with ZERO JavaScript
   (CSS radio-tabs + native <details> + real Maps links).
   This script only ADDS: saved progress, active-tab sync,
   swipe navigation and GPS-based quick actions.
   ========================================================= */
'use strict';
(function(){
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  /* ---------- LocalStorage persistence for every checkbox ---------- */
  const KEY = 'roadtrip2026.v2';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e){ saved = {}; }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch(e){} };

  const checks = $$('.stop-check, .cl-check');
  checks.forEach(cb => {
    if (saved[cb.id] === true) cb.checked = true;
    syncDone(cb);
    cb.addEventListener('change', () => {
      saved[cb.id] = cb.checked;
      persist(); syncDone(cb); updateProgress(); updateClCount(cb);
      toast(cb.checked ? '✓ Afgevinkt' : 'Vinkje weg');
    });
  });
  function syncDone(cb){
    const stop = cb.closest('.stop');
    if (stop) stop.classList.toggle('done', cb.checked);
  }

  /* Tapping the checkbox inside a <summary> should NOT open/close the card */
  $$('.stop-summary').forEach(sum => {
    sum.addEventListener('click', e => {
      if (e.target.closest('.check')) {
        e.preventDefault();
        const cb = sum.querySelector('.stop-check');
        if (cb){ cb.checked = !cb.checked; cb.dispatchEvent(new Event('change', {bubbles:true})); }
      }
    });
  });

  /* Checklist group counters */
  function updateClCount(cb){
    const group = cb.closest('.checklist-group');
    if (!group) return;
    const all = $$('.cl-check', group);
    const done = all.filter(c => c.checked).length;
    const el = $('.cl-count', group);
    if (el) el.textContent = `${done}/${all.length}`;
  }

  /* ---------- Progress ring (day-stops only) ---------- */
  function updateProgress(){
    const stopChecks = $$('.stop-check');
    const done = stopChecks.filter(c => c.checked).length;
    const pct = stopChecks.length ? Math.round(done / stopChecks.length * 100) : 0;
    const ring = $('#progressRing');
    if (ring) ring.style.setProperty('--p', pct + '%');
    const t = $('#progressPct'); if (t) t.textContent = pct + '%';
  }

  /* ---------- Tabs: sync active label + subtitle + scroll ---------- */
  const radios = $$('.tabstate');
  const tabs = $$('.day-tab');
  const tabsWrap = $('#dayTabs');

  function currentIndex(){ return Math.max(0, radios.findIndex(r => r.checked)); }

  function syncTab(scroll){
    const i = currentIndex();
    tabs.forEach((t, ti) => t.classList.toggle('active', ti === i));
    const sub = radios[i] && radios[i].dataset.sub;
    const st = $('#headerSubtitle'); if (st && sub) st.textContent = sub;
    if (tabs[i]) tabs[i].scrollIntoView({inline:'center', block:'nearest', behavior:'smooth'});
    if (scroll) window.scrollTo({top:0, behavior:'smooth'});
  }
  radios.forEach(r => r.addEventListener('change', () => syncTab(true)));

  function goTo(i){
    if (i < 0 || i >= radios.length) return;
    radios[i].checked = true;
    radios[i].dispatchEvent(new Event('change', {bubbles:true}));
  }

  /* Progress ring jumps to the Practical/overview tab */
  const ring = $('#progressRing');
  if (ring) ring.addEventListener('click', () => goTo(radios.length - 1));

  /* ---------- Swipe between days ---------- */
  const main = $('#main') || $('main');
  if (main){
    let x0=null, y0=null, t0=0;
    main.addEventListener('touchstart', e => { const t=e.changedTouches[0]; x0=t.clientX; y0=t.clientY; t0=Date.now(); }, {passive:true});
    main.addEventListener('touchend', e => {
      if (x0===null) return;
      const t=e.changedTouches[0], dx=t.clientX-x0, dy=t.clientY-y0, dt=Date.now()-t0;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)*1.8 && dt < 600){
        goTo(currentIndex() + (dx < 0 ? 1 : -1));
      }
      x0=y0=null;
    }, {passive:true});
  }

  /* ---------- FAB quick actions with geolocation ---------- */
  const fabState = $('#fabState');
  const enc = s => encodeURIComponent(s);
  const nearURL = (kind, c) => {
    const q = {here:'', food:'restaurants', coffee:'coffee', fuel:'tankstation', photo:'viewpoint'}[kind];
    if (c) return `https://www.google.com/maps/search/?api=1&query=${enc((q?q+' near ':'') + c.lat+','+c.lng)}`;
    return null; // fall back to the anchor's own generic href
  };
  $$('.fab-item').forEach(btn => {
    btn.addEventListener('click', e => {
      if (fabState) fabState.checked = false;              // close menu
      if (!navigator.geolocation) return;                  // let anchor href proceed
      e.preventDefault();
      toast('📍 Locatie ophalen…');
      navigator.geolocation.getCurrentPosition(
        pos => window.open(nearURL(btn.dataset.quick, {lat:pos.coords.latitude, lng:pos.coords.longitude}), '_blank', 'noopener'),
        ()  => { toast('Zonder GPS — algemene zoekopdracht'); window.open(btn.href, '_blank', 'noopener'); },
        {enableHighAccuracy:true, timeout:8000, maximumAge:60000}
      );
    });
  });

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg){
    const t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 1900);
  }

  /* ---------- init ---------- */
  updateProgress();
  syncTab(false);
})();
