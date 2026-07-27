<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useTripStore } from '@/stores/trip'
import { useUserStore } from '@/stores/user'
import { ArrowRightIcon } from '@heroicons/vue/24/solid'

const trip = useTripStore()
const user = useUserStore()

const doneOf = (id: string) => {
  const d = trip.dayById(id)!
  const done = d.stops.filter(s => user.isChecked(s.id)).length
  return { done, total: d.stops.length }
}
</script>

<template>
  <div class="space-y-4">
    <header class="pt-2">
      <div class="text-xs font-extrabold uppercase tracking-[0.12em] text-bronze">4 – 14 augustus</div>
      <h1 class="text-2xl font-extrabold mt-1">Reisdagen</h1>
    </header>

    <RouterLink
      v-for="d in trip.days" :key="d.id" :to="`/day/${d.id}`"
      class="block card p-4 animate-fadeUp tap"
    >
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl2 grid place-items-center font-black text-lg shrink-0"
          :class="d.isEpic ? 'bg-gradient-to-br from-bronze to-bronze-deep text-[#1a1206]' : 'bg-card2 border border-line text-bronze'">
          {{ d.tabNumber }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-[11px] font-bold uppercase tracking-wide text-faint">{{ d.tabLabel }} <span v-if="d.isEpic" class="text-bronze">· hoogtepunt</span></div>
          <div class="font-extrabold truncate">{{ d.title }}</div>
          <div class="text-xs text-muted truncate">{{ d.isPool ? d.subtitle : `${d.km} · ${d.driveEpic || d.drive}` }}</div>
        </div>
        <div class="text-right shrink-0">
          <div class="text-xs font-black text-bronze tabular-nums">{{ doneOf(d.id).done }}/{{ doneOf(d.id).total }}</div>
          <ArrowRightIcon class="w-4 h-4 text-faint inline-block mt-1" />
        </div>
      </div>
    </RouterLink>
  </div>
</template>
