<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTripStore } from '@/stores/trip'
import { BuildingOffice2Icon, ArrowRightIcon } from '@heroicons/vue/24/solid'

const trip = useTripStore()
// hotel -> which day labels use it
const rows = computed(() => trip.hotels.map(h => ({
  hotel: h,
  labels: trip.days.filter(d => d.hotel?.id === h.id).map(d => d.tabLabel).join(', ')
})))
</script>

<template>
  <div class="space-y-4">
    <header class="pt-2">
      <div class="text-xs font-extrabold uppercase tracking-[0.12em] text-bronze">Overnachtingen</div>
      <h1 class="text-2xl font-extrabold mt-1">Hotels</h1>
    </header>

    <RouterLink
      v-for="r in rows" :key="r.hotel.id"
      :to="r.hotel.id.includes('leitlhof') ? '/leitlhof' : `/hotel/${r.hotel.id}`"
      class="block card p-4 animate-fadeUp tap"
    >
      <div class="flex items-center gap-3">
        <BuildingOffice2Icon class="w-6 h-6 text-bronze shrink-0" />
        <div class="flex-1 min-w-0">
          <div class="font-extrabold truncate">{{ r.hotel.name }}</div>
          <div class="text-xs text-muted truncate">{{ r.labels }} · {{ r.hotel.address }}</div>
        </div>
        <span v-if="r.hotel.booked" class="text-[11px] font-extrabold text-bonus shrink-0">✓</span>
        <ArrowRightIcon class="w-4 h-4 text-faint shrink-0" />
      </div>
    </RouterLink>
  </div>
</template>
