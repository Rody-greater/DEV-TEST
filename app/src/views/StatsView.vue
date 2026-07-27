<script setup lang="ts">
import { computed } from 'vue'
import { useTripStore } from '@/stores/trip'
import { useUserStore } from '@/stores/user'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'

const trip = useTripStore()
const user = useUserStore()

const totalStops = computed(() => trip.allStops.length)
const doneStops = computed(() => trip.allStops.filter(s => user.isChecked(s.id)).length)
const pct = computed(() => totalStops.value ? Math.round(doneStops.value / totalStops.value * 100) : 0)

const daysDone = computed(() => trip.days.filter(d => d.stops.length && d.stops.every(s => user.isChecked(s.id))).length)
const favCount = computed(() => user.favoriteIds.length)

const topRated = computed(() => {
  const rated = trip.allStops
    .map(s => ({ s, r: user.ratingOf(s.id) }))
    .filter(x => x.r > 0)
    .sort((a, b) => b.r - a.r)
  return rated[0] || null
})

const bestFavorite = computed(() => {
  const f = trip.allStops.filter(s => user.isFavorite(s.id))
  return f.sort((a, b) => user.ratingOf(b.id) - user.ratingOf(a.id))[0] || null
})

const tiles = computed(() => [
  { k: 'Dagen voltooid', v: `${daysDone.value}/${trip.days.length}` },
  { k: 'Stops afgevinkt', v: `${doneStops.value}/${totalStops.value}` },
  { k: 'Favorieten', v: String(favCount.value) },
  { k: 'Beoordeeld', v: String(trip.allStops.filter(s => user.ratingOf(s.id) > 0).length) }
])
</script>

<template>
  <div class="space-y-4">
    <header class="pt-2">
      <div class="text-xs font-extrabold uppercase tracking-[0.12em] text-bronze">Jouw reis</div>
      <h1 class="text-2xl font-extrabold mt-1">Statistieken</h1>
    </header>

    <div class="card p-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-bold text-muted">Totale voortgang</span>
        <span class="text-lg font-black text-bronze">{{ pct }}%</span>
      </div>
      <ProgressBar :value="pct" />
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div v-for="t in tiles" :key="t.k" class="card p-4 text-center">
        <div class="text-2xl font-black text-bronze">{{ t.v }}</div>
        <div class="text-[11px] font-extrabold uppercase text-faint mt-1">{{ t.k }}</div>
      </div>
    </div>

    <SectionTitle label="Hoogtepunten" />
    <div class="card p-4 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted">Best beoordeelde stop</span>
        <span class="font-extrabold">{{ topRated ? `${topRated.s.emoji} ${topRated.s.title}` : '—' }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted">Favoriete plek</span>
        <span class="font-extrabold">{{ bestFavorite ? `${bestFavorite.emoji} ${bestFavorite.title}` : '—' }}</span>
      </div>
    </div>

    <p class="text-center text-xs text-faint">Statistieken vullen zich vanzelf terwijl je stops afvinkt, beoordeelt en bewaart.</p>
  </div>
</template>
