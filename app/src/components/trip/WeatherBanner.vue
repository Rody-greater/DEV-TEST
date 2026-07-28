<script setup lang="ts">
import { computed } from 'vue'
import type { Day } from '@/types/trip'
import { useWeather, isBadWeather } from '@/composables/useWeather'

const props = defineProps<{ day: Day }>()

// Weather at the day's endpoint (hotel), falling back to the first stop with a coord.
const coord = computed(() =>
  props.day.hotel?.coord ?? props.day.stops.find(s => s.coord)?.coord ?? null
)
const date = computed(() => props.day.date)
const { weather } = useWeather(coord, date)

const bad = computed(() => isBadWeather(weather.value))
// On a mountain "epic" day, bad weather is a real reason to prefer the comfort route.
const passAdvice = computed(() =>
  bad.value && props.day.isEpic && props.day.driveComfort
    ? `Bij deze omstandigheden: kies de comfort-route (${props.day.driveComfort}) i.p.v. de epic-variant.`
    : null
)
</script>

<template>
  <!-- Live conditions when available -->
  <template v-if="weather">
    <div class="rounded-xl2 border border-bronze-soft bg-gradient-to-br from-[#241d13] to-[#1a1610] px-4 py-3 text-sm text-[#e9d3b4]">
      <div class="flex items-center gap-2">
        <span class="text-lg">{{ weather.emoji }}</span>
        <span><b class="text-ink">Weer vandaag:</b> {{ weather.text }},
          <span class="tabular-nums">{{ weather.tMax }}° / {{ weather.tMin }}°</span>
          <span class="text-[#c9a878]"> · {{ weather.precipProb }}% neerslagkans</span>
        </span>
        <span class="ml-auto text-[10px] font-extrabold uppercase tracking-wide text-bonus">live</span>
      </div>
    </div>
    <div v-if="bad && (day.badWeather || passAdvice)"
      class="rounded-xl2 border border-[#244566] bg-[#12202f] px-4 py-3 text-sm text-[#a9cdf3] space-y-1">
      <div v-if="day.badWeather">🌧️ <b class="text-ink">Bij slecht weer:</b> {{ day.badWeather }}</div>
      <div v-if="passAdvice">🏔️ <b class="text-ink">Bergpas:</b> {{ passAdvice }}</div>
    </div>
  </template>

  <!-- Offline / unavailable: fall back to the static trip text -->
  <template v-else>
    <div v-if="day.weather" class="rounded-xl2 border border-bronze-soft bg-gradient-to-br from-[#241d13] to-[#1a1610] px-4 py-3 text-sm text-[#e9d3b4]">
      <b class="text-ink">Weer:</b> {{ day.weather }}
    </div>
    <div v-if="day.badWeather" class="rounded-xl2 border border-[#244566] bg-[#12202f] px-4 py-3 text-sm text-[#a9cdf3]">
      🌧️ <b class="text-ink">Bij slecht weer:</b> {{ day.badWeather }}
    </div>
  </template>
</template>
