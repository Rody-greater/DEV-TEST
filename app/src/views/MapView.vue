<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTripStore } from '@/stores/trip'
import TripMap from '@/components/map/TripMap.vue'

const trip = useTripStore()
const selected = ref<string | null>(null)

const days = computed(() => selected.value ? trip.days.filter(d => d.id === selected.value) : trip.days)
</script>

<template>
  <div class="space-y-3">
    <header class="pt-2 flex items-end justify-between">
      <div>
        <div class="text-xs font-extrabold uppercase tracking-[0.12em] text-bronze">Overzicht</div>
        <h1 class="text-2xl font-extrabold mt-1">Kaart</h1>
      </div>
    </header>

    <!-- day filter -->
    <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      <button type="button" class="shrink-0 rounded-full px-3.5 py-2 text-sm font-bold border tap"
        :class="selected === null ? 'bg-bronze text-[#1a1206] border-bronze' : 'bg-card border-line text-muted'"
        @click="selected = null">Alles</button>
      <button v-for="d in trip.days" :key="d.id" type="button"
        class="shrink-0 rounded-full px-3.5 py-2 text-sm font-bold border tap"
        :class="selected === d.id ? 'bg-bronze text-[#1a1206] border-bronze' : 'bg-card border-line text-muted'"
        @click="selected = d.id">{{ d.tabLabel }}</button>
    </div>

    <div class="h-[68vh]">
      <TripMap :days="days" :focus="selected" :key="selected || 'all'" />
    </div>

    <div class="flex flex-wrap gap-3 text-xs text-muted justify-center">
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-must" /> Must</span>
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-nice" /> Nice</span>
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-bonus" /> Bonus</span>
      <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-bronze" /> Hotel</span>
    </div>
  </div>
</template>
