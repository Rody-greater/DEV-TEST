<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTripStore } from '@/stores/trip'
import { useUserStore } from '@/stores/user'
import { useNow } from '@/composables/useNow'
import { useTripStatus } from '@/composables/useTripStatus'
import { useRoadCaptain } from '@/composables/useRoadCaptain'
import { useWeather } from '@/composables/useWeather'
import ExploreGuide from '@/components/trip/ExploreGuide.vue'
import { dutchDate, humanDuration } from '@/utils/time'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import CountdownPill from '@/components/ui/CountdownPill.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import {
  MapPinIcon, ClockIcon, BuildingOffice2Icon, ArrowRightIcon, FlagIcon
} from '@heroicons/vue/24/solid'

const trip = useTripStore()
const user = useUserStore()
const now = useNow(30_000)
const { phase, activeDay, dayNumber, totalDays, daysUntilStart, progressPct } = useTripStatus(now)

const { result } = useRoadCaptain(activeDay, now)

const arrivedStop = computed(() => activeDay.value.stops.find(s => user.statusOf(s.id) === 'arrived') || null)
const hotel = computed(() => activeDay.value.hotel)

// Live weather at today's endpoint (offline-degrading; shows nothing if unavailable)
const wxCoord = computed(() => activeDay.value.hotel?.coord ?? activeDay.value.stops.find(s => s.coord)?.coord ?? null)
const wxDate = computed(() => activeDay.value.date)
const { weather } = useWeather(wxCoord, wxDate)
const nextStop = computed(() => {
  const order = ['must', 'nice', 'pool', 'bonus']
  return [...activeDay.value.stops]
    .sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category))
    .find(s => !user.isChecked(s.id)) || activeDay.value.stops[0] || null
})

// The trip's fixed highlight appointment (Leitlhof ritual)
const ritualDay = computed(() => trip.days.find(d => d.wellness))
const doneStops = computed(() => trip.days.reduce((n, d) => n + d.stops.filter(s => user.isChecked(s.id)).length, 0))
const totalStops = computed(() => trip.days.reduce((n, d) => n + d.stops.length, 0))
</script>

<template>
  <div class="space-y-4">
    <!-- header -->
    <header class="pt-2 flex items-start justify-between">
      <div>
        <div class="text-xs font-extrabold uppercase tracking-[0.12em] text-bronze">{{ trip.meta.car }} · 2026</div>
        <h1 class="text-2xl font-extrabold mt-1">Roadtrip Companion</h1>
        <p class="text-sm text-muted">{{ dutchDate(activeDay.date) }}</p>
      </div>
      <RouterLink to="/stats" class="w-14 h-14 rounded-full grid place-items-center border border-line bg-card tap"
        :style="{ background: `radial-gradient(closest-side, #191919 76%, transparent 77%), conic-gradient(#c79a63 ${progressPct}%, #2a2a2a 0)` }">
        <span class="text-xs font-black">{{ progressPct }}%</span>
      </RouterLink>
    </header>

    <!-- Explore Mode: als je nu bij een stop bent aangekomen -->
    <ExploreGuide v-if="arrivedStop" :day="activeDay" :stop="arrivedStop" :key="arrivedStop.id" />

    <!-- pre-trip banner -->
    <div v-if="phase === 'before'" class="card p-4 flex items-center justify-between animate-fadeUp">
      <div class="flex items-center gap-3">
        <FlagIcon class="w-6 h-6 text-bronze" />
        <div>
          <div class="font-extrabold">De reis begint bijna</div>
          <div class="text-sm text-muted">Nog {{ daysUntilStart }} {{ daysUntilStart === 1 ? 'dag' : 'dagen' }} tot vertrek</div>
        </div>
      </div>
      <RouterLink to="/practical" class="text-xs font-extrabold text-nav">Checklist →</RouterLink>
    </div>

    <!-- today card -->
    <RouterLink :to="`/day/${activeDay.id}`" class="block card p-4 animate-fadeUp tap">
      <div class="flex items-center justify-between">
        <span class="text-xs font-extrabold uppercase tracking-wide text-faint">
          {{ phase === 'before' ? 'Eerste dag' : phase === 'after' ? 'Laatste dag' : 'Vandaag' }} · Dag {{ dayNumber }}/{{ totalDays }}
        </span>
        <ArrowRightIcon class="w-4 h-4 text-bronze" />
      </div>
      <h2 class="text-xl font-extrabold mt-1">{{ activeDay.title }}</h2>
      <p class="text-sm text-muted">{{ activeDay.subtitle }}</p>
      <div v-if="weather" class="mt-1.5 inline-flex items-center gap-1.5 text-xs text-muted">
        <span class="text-sm">{{ weather.emoji }}</span>
        <span class="tabular-nums font-bold text-ink">{{ weather.tMax }}° / {{ weather.tMin }}°</span>
        <span class="text-faint">· {{ weather.text }} · {{ weather.precipProb }}% neerslag</span>
      </div>

      <div class="mt-3 grid grid-cols-3 gap-2 text-center">
        <div class="rounded-xl2 border border-line bg-bg2/60 py-2">
          <div class="text-[10px] font-extrabold uppercase text-faint">Afstand</div>
          <div class="text-sm font-black text-bronze">{{ activeDay.km }}</div>
        </div>
        <div class="rounded-xl2 border border-line bg-bg2/60 py-2">
          <div class="text-[10px] font-extrabold uppercase text-faint">Vertrek</div>
          <div class="text-sm font-black text-nav">{{ activeDay.depart }}</div>
        </div>
        <div class="rounded-xl2 border border-line bg-bg2/60 py-2">
          <div class="text-[10px] font-extrabold uppercase text-faint">Aankomst</div>
          <div class="text-sm font-black">{{ activeDay.arrive }}</div>
        </div>
      </div>
    </RouterLink>

    <!-- Road Captain dashboard -->
    <div v-if="activeDay.planning" class="card p-4 space-y-3 animate-fadeUp">
      <div class="flex items-center justify-between">
        <span class="text-xs font-extrabold uppercase tracking-wide text-faint">
          Road Captain <span v-if="result.mode === 'live'" class="text-bonus">· live</span>
        </span>
        <StatusBadge :level="result.level">{{ result.label }}</StatusBadge>
      </div>
      <Transition name="fade" mode="out-in">
        <p :key="result.advice" class="text-sm text-ink/90 leading-relaxed">{{ result.advice }}</p>
      </Transition>
      <div class="grid grid-cols-3 gap-2 text-center">
        <div class="rounded-xl2 border border-line bg-bg2/60 py-2">
          <div class="text-[10px] font-extrabold uppercase text-faint">Hotel ETA</div>
          <div class="text-sm font-black text-bronze tabular-nums">{{ result.hotelEta }}</div>
        </div>
        <div class="rounded-xl2 border border-line bg-bg2/60 py-2">
          <div class="text-[10px] font-extrabold uppercase text-faint">Speling</div>
          <div class="text-sm font-black tabular-nums" :class="result.slackMin != null && result.slackMin < 0 ? 'text-[#ef4444]' : 'text-bonus'">
            {{ result.slackMin != null ? (result.slackMin >= 0 ? '+' : '−') + humanDuration(Math.abs(result.slackMin)) : '—' }}
          </div>
        </div>
        <div class="rounded-xl2 border border-line bg-bg2/60 py-2">
          <div class="text-[10px] font-extrabold uppercase text-faint">Nog te rijden</div>
          <div class="text-sm font-black text-ink tabular-nums">{{ humanDuration(result.remainingDriveMin) }}</div>
        </div>
      </div>
      <div class="flex items-center justify-between text-xs">
        <span class="flex items-center gap-1.5 text-muted"><ClockIcon class="w-4 h-4 text-nav" /> Nog te bezoeken <b class="text-ink">{{ result.remainingStops }}</b></span>
        <span v-if="result.appointment" class="text-muted">Afspraak <b class="text-bronze">{{ result.appointment.time }}</b></span>
      </div>
      <RouterLink :to="`/day/${activeDay.id}`" class="block text-center text-xs font-extrabold text-nav pt-1">Open Road Captain →</RouterLink>
    </div>

    <!-- next stop -->
    <template v-if="nextStop">
      <SectionTitle label="Volgende stop" />
      <RouterLink :to="`/day/${activeDay.id}`" class="block card p-4 animate-fadeUp tap">
        <div class="flex items-center gap-3">
          <span class="text-2xl">{{ nextStop.emoji }}</span>
          <div class="flex-1 min-w-0">
            <div class="font-extrabold truncate">{{ nextStop.title }}</div>
            <div class="text-xs text-muted flex items-center gap-2">
              <MapPinIcon class="w-3.5 h-3.5 text-nav" /> {{ nextStop.best || nextStop.time }}
            </div>
          </div>
          <ArrowRightIcon class="w-4 h-4 text-bronze" />
        </div>
      </RouterLink>
    </template>

    <!-- hotel today -->
    <template v-if="hotel">
      <SectionTitle label="Hotel vandaag" />
      <RouterLink :to="hotel.id.includes('leitlhof') ? '/leitlhof' : `/hotel/${hotel.id}`" class="block card p-4 animate-fadeUp tap">
        <div class="flex items-center gap-3">
          <BuildingOffice2Icon class="w-6 h-6 text-bronze shrink-0" />
          <div class="flex-1 min-w-0">
            <div class="font-extrabold truncate">{{ hotel.name }}</div>
            <div class="text-xs text-muted truncate">{{ hotel.address }}</div>
          </div>
          <span v-if="hotel.booked" class="text-[11px] font-extrabold text-bonus">✓</span>
        </div>
      </RouterLink>
    </template>

    <!-- ritual countdown -->
    <template v-if="ritualDay && ritualDay.wellness">
      <SectionTitle label="Aftellen naar afspraak" />
      <CountdownPill :date-i-s-o="ritualDay.date" :time="ritualDay.wellness.ritualTime" label="Wellbeing Ritual · Leitlhof" />
    </template>

    <div class="text-center text-xs text-faint pt-2">
      {{ doneStops }}/{{ totalStops }} stops afgevinkt · werkt volledig offline
    </div>
  </div>
</template>
