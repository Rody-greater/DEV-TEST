<script setup lang="ts">
import { RouterLink } from 'vue-router'
import {
  BuildingOffice2Icon, ClipboardDocumentCheckIcon, ChartBarIcon,
  WrenchScrewdriverIcon, SparklesIcon, MapIcon, ChevronRightIcon
} from '@heroicons/vue/24/solid'

const links = [
  { to: '/hotels', icon: BuildingOffice2Icon, label: 'Hotels', sub: 'Alle overnachtingen' },
  { to: '/leitlhof', icon: SparklesIcon, label: 'Leitlhof · Wellbeing', sub: 'Ritual, spa & sauna' },
  { to: '/checklists', icon: ClipboardDocumentCheckIcon, label: 'Checklists per dag', sub: 'Afvinken onderweg' },
  { to: '/practical', icon: WrenchScrewdriverIcon, label: 'Praktisch', sub: 'Documenten, auto, tol' },
  { to: '/stats', icon: ChartBarIcon, label: 'Statistieken', sub: 'Voortgang & hoogtepunten' },
  { to: '/map', icon: MapIcon, label: 'Kaart', sub: 'Alle stops & hotels' }
]
</script>

<template>
  <div class="space-y-4">
    <header class="pt-2">
      <div class="text-xs font-extrabold uppercase tracking-[0.12em] text-bronze">Alles</div>
      <h1 class="text-2xl font-extrabold mt-1">Meer</h1>
    </header>

    <RouterLink v-for="l in links" :key="l.to" :to="l.to" class="block card p-4 animate-fadeUp tap">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl2 grid place-items-center bg-card2 border border-line shrink-0">
          <component :is="l.icon" class="w-6 h-6 text-bronze" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-extrabold">{{ l.label }}</div>
          <div class="text-xs text-muted">{{ l.sub }}</div>
        </div>
        <ChevronRightIcon class="w-5 h-5 text-faint" />
      </div>
    </RouterLink>

    <p class="text-center text-xs text-faint pt-2">Roadtrip Companion 2026 · offline-first PWA</p>
  </div>
</template>
