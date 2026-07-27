<script setup lang="ts">
import type { Day } from '@/types/trip'
import { routeComfort, routeEpic, openExternal } from '@/composables/useMaps'

const props = defineProps<{ day: Day }>()
</script>

<template>
  <div v-if="day.route" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
    <button
      type="button"
      class="flex flex-col items-start justify-center gap-0.5 rounded-xl2 px-4 py-3 min-h-[60px] font-extrabold text-white tap bg-gradient-to-br from-[#1f6b4a] to-[#17583c]"
      @click="openExternal(routeComfort(props.day.route!))"
    >
      🟢 Comfort route
      <small class="text-[11px] font-bold opacity-85">{{ day.driveComfort || 'Snelste weg' }} · snelste weg</small>
    </button>
    <button
      type="button"
      class="flex flex-col items-start justify-center gap-0.5 rounded-xl2 px-4 py-3 min-h-[60px] font-extrabold tap bg-gradient-to-br from-bronze to-bronze-deep text-[#1a1206]"
      @click="openExternal(routeEpic(props.day.route!))"
    >
      🔥 Epic route
      <small class="text-[11px] font-bold opacity-90">{{ day.driveEpic || 'Langs de highlights' }} · langs highlights</small>
    </button>
  </div>
</template>
