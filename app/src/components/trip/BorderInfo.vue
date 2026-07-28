<script setup lang="ts">
// Static border / toll / fuel reference for this NL → DE → CH → IT → AT → DE route.
// Domain knowledge, deliberately kept local (not in the generated trip data).
// Prices are indicative for 2026 — the app always tells the user to verify.
interface Row { icon: string; title: string; text: string }
const rows: Row[] = [
  { icon: '⛽', title: 'Tanken', text: 'Tank vol in NL of DE (goedkoop) vóór je Zwitserland in rijdt — CH is fors duurder. Luxemburg is de goedkoopste omweg als je route dat toelaat.' },
  { icon: '🇨🇭', title: 'Zwitserland — vignet', text: 'Autobahnvignette verplicht: CHF 40 (sticker of e-vignette), geldig heel 2026. Koop vóór de grens op dag 2.' },
  { icon: '🇦🇹', title: 'Oostenrijk — vignet', text: 'Voor de terugreis via de Brenner: 10-dagenvignet ± € 12 (digitaal of sticker). De Brennerpas-tol zelf is apart.' },
  { icon: '🇮🇹', title: 'Italië — tol', text: 'Autostrada per rit betalen (kaart of contant). Een Telepass/Fulli-badge maakt de tolpoorten een stuk soepeler.' },
  { icon: '🆘', title: 'Noodgeval', text: '112 werkt in de hele EU én Zwitserland. Houd je verzekerings-/pechhulp-app en de groene kaart bij de hand.' }
]
</script>

<template>
  <div class="card overflow-hidden">
    <div class="px-4 pt-4 pb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-bronze">
      Grens · tol · tanken
    </div>
    <ul class="divide-y divide-line">
      <li v-for="r in rows" :key="r.title" class="flex gap-3 px-4 py-3">
        <span class="text-lg leading-none pt-0.5">{{ r.icon }}</span>
        <div class="min-w-0">
          <div class="text-sm font-extrabold text-ink">{{ r.title }}</div>
          <p class="text-sm text-muted leading-snug mt-0.5">{{ r.text }}</p>
        </div>
      </li>
    </ul>
    <p class="px-4 py-2.5 text-[11px] text-faint border-t border-line">
      Prijzen indicatief voor 2026 — controleer altijd de actuele regels.
    </p>
  </div>
</template>
