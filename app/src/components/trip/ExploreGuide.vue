<script setup lang="ts">
import { toRef, computed } from 'vue'
import type { Stop, Day } from '@/types/trip'
import { useRoadCaptain } from '@/composables/useRoadCaptain'
import { useExploreAdvice } from '@/composables/useExploreAdvice'
import { useNow } from '@/composables/useNow'
import { mapsSearch, openExternal } from '@/composables/useMaps'
import {
  SparklesIcon, StarIcon, CameraIcon, InformationCircleIcon,
  MapPinIcon, ClockIcon
} from '@heroicons/vue/24/solid'

/** Explore Mode card — shown while a stop has status 'arrived'. */
const props = defineProps<{ day: Day; stop: Stop }>()
const stopRef = toRef(props, 'stop')
const dayRef = toRef(props, 'day')
const now = useNow(1000)

// Shared time source: the same Road Captain computation, no duplicate logic.
const { result } = useRoadCaptain(dayRef, now)
const { advice } = useExploreAdvice(stopRef, result, now)

const catIcon: Record<string, string> = {
  city: '🏙️', nature: '🌊', bridge: '🌉', mountain: '🏔️', lake: '💧',
  hotel: '🏨', viewpoint: '📸', wine: '🍷', historic: '🏰'
}
const paceLabel = computed(() => ({
  relaxed: 'Alle rust', normal: 'Op schema', compact: 'Wat compacter', 'skip-extra': 'Kern van de stop'
}[advice.value.pace]))

function photo(q: string) { openExternal(mapsSearch(q)) }
</script>

<template>
  <section v-if="advice.active" class="rounded-xl2 border border-bronze/40 bg-gradient-to-br from-[#1c1a14] to-card p-4 shadow-soft animate-fadeUp">
    <!-- welcome -->
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="text-[10px] font-extrabold uppercase tracking-[0.12em] text-bronze flex items-center gap-1.5">
          <SparklesIcon class="w-3.5 h-3.5" /> Explore Mode
        </div>
        <h3 class="text-xl font-extrabold mt-1 flex items-center gap-2">
          <span>{{ catIcon[stop.guideCategory || 'city'] }}</span>{{ advice.welcome }}
        </h3>
      </div>
      <span class="shrink-0 rounded-full border border-line bg-card2 px-2.5 py-1 text-[10px] font-extrabold text-muted whitespace-nowrap">{{ paceLabel }}</span>
    </div>

    <!-- time line (calm) -->
    <p class="mt-2 text-sm text-ink/90 leading-relaxed">{{ advice.timeLine }}</p>
    <p v-if="advice.elapsedLine" class="mt-1 text-sm text-bronze/90 leading-relaxed flex items-start gap-1.5">
      <ClockIcon class="w-4 h-4 mt-0.5 shrink-0" />{{ advice.elapsedLine }}
    </p>
    <p v-if="advice.planNote" class="mt-1 text-sm text-bonus/90 leading-relaxed">{{ advice.planNote }}</p>

    <!-- hard deadline — the only firm note, only when a booked appointment is at risk -->
    <div v-if="advice.hardDeadline" class="mt-3 rounded-xl2 border border-[#f97316]/40 bg-[#f97316]/10 px-3 py-2.5 text-sm text-[#f9a35a]">
      ⏳ {{ advice.hardDeadline }}
    </div>

    <!-- why -->
    <div class="mt-3 rounded-xl2 border border-line bg-bg2/50 px-3 py-2.5 text-sm text-muted leading-relaxed">
      {{ stop.guide?.why }}
    </div>

    <!-- essentials -->
    <div class="mt-4">
      <div class="text-xs font-extrabold uppercase tracking-wide text-bonus flex items-center gap-1.5 mb-2">
        <StarIcon class="w-4 h-4" /> Niet missen
      </div>
      <ul class="space-y-1.5">
        <li v-for="h in advice.essentials" :key="h.title" class="flex items-start gap-2 text-sm">
          <span class="text-bonus mt-0.5">•</span>
          <span class="min-w-0">
            <b class="text-ink">{{ h.title }}</b>
            <span v-if="h.estimatedMinutes" class="text-faint"> · ~{{ h.estimatedMinutes }} min</span>
            <span v-if="h.description" class="block text-muted">{{ h.description }}</span>
          </span>
        </li>
      </ul>
    </div>

    <!-- extras -->
    <div v-if="advice.extras.length" class="mt-4">
      <div class="text-xs font-extrabold uppercase tracking-wide text-nice flex items-center gap-1.5 mb-2">
        Als je nog tijd hebt
      </div>
      <ul class="space-y-1.5" :class="advice.showExtras ? '' : 'opacity-60'">
        <li v-for="h in advice.extras" :key="h.title" class="flex items-start gap-2 text-sm">
          <span class="text-nice mt-0.5">◦</span>
          <span class="min-w-0">
            <b class="text-ink/90">{{ h.title }}</b>
            <span v-if="h.estimatedMinutes" class="text-faint"> · ~{{ h.estimatedMinutes }} min</span>
            <span v-if="h.description" class="block text-muted">{{ h.description }}</span>
          </span>
        </li>
      </ul>
      <p v-if="advice.extrasNote" class="mt-1.5 text-xs text-muted italic">{{ advice.extrasNote }}</p>
    </div>

    <!-- photo tip -->
    <div v-if="advice.photoSpots.length" class="mt-4">
      <div class="text-xs font-extrabold uppercase tracking-wide text-nav flex items-center gap-1.5 mb-2">
        <CameraIcon class="w-4 h-4" /> Fototip
      </div>
      <button
        v-for="ph in advice.photoSpots" :key="ph.title" type="button"
        class="w-full text-left rounded-xl2 border border-line bg-card2 px-3 py-2.5 mb-1.5 tap"
        @click="photo(ph.title + ' ' + stop.nav)"
      >
        <div class="flex items-center justify-between gap-2">
          <b class="text-sm text-ink">{{ ph.title }}</b>
          <span class="flex items-center gap-1 text-[11px] font-extrabold text-nav shrink-0"><MapPinIcon class="w-3.5 h-3.5" /> Maps</span>
        </div>
        <span class="block text-xs text-muted mt-0.5">{{ ph.description }}</span>
      </button>
    </div>

    <!-- food -->
    <div v-if="advice.food.length" class="mt-4">
      <div class="text-xs font-extrabold uppercase tracking-wide text-faint mb-2">🍽️ Eten & drinken</div>
      <div class="flex flex-wrap gap-1.5">
        <span v-for="f in advice.food" :key="f" class="rounded-full border border-line bg-card2 px-3 py-1.5 text-xs text-ink/85">{{ f }}</span>
      </div>
    </div>

    <!-- practical -->
    <div v-if="advice.practical.length" class="mt-4">
      <div class="text-xs font-extrabold uppercase tracking-wide text-faint flex items-center gap-1.5 mb-2">
        <InformationCircleIcon class="w-4 h-4" /> Praktisch
      </div>
      <ul class="space-y-1">
        <li v-for="p in advice.practical" :key="p" class="text-sm text-muted flex items-start gap-2"><span class="mt-0.5">–</span>{{ p }}</li>
        <li v-if="advice.walkingTime" class="text-sm text-muted flex items-start gap-2"><span class="mt-0.5">–</span>Wandelen: {{ advice.walkingTime }}</li>
      </ul>
    </div>

    <!-- captain tip -->
    <div class="mt-4 rounded-xl2 border border-bronze-deep bg-bronze-soft/40 px-3 py-3 text-sm">
      <b class="text-bronze">Tip van Road Captain</b>
      <p class="text-ink/90 mt-0.5 leading-relaxed">{{ advice.captainTip }}</p>
    </div>
  </section>
</template>
