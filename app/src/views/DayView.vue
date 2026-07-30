<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useTripStore } from '@/stores/trip'
import { useUserStore } from '@/stores/user'
import { useRoadCaptain } from '@/composables/useRoadCaptain'
import { dutchDate } from '@/utils/time'
import ExploreGuide from '@/components/trip/ExploreGuide.vue'
import RouteCard from '@/components/trip/RouteCard.vue'
import RoadCaptain from '@/components/trip/RoadCaptain.vue'
import WeatherBanner from '@/components/trip/WeatherBanner.vue'
import StopCard from '@/components/trip/StopCard.vue'
import HotelCard from '@/components/trip/HotelCard.vue'
import TimelineView from '@/components/trip/TimelineView.vue'
import ChipLinks from '@/components/trip/ChipLinks.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import { ChevronLeftIcon } from '@heroicons/vue/24/solid'

const route = useRoute()
const trip = useTripStore()
const user = useUserStore()
const day = computed(() => trip.dayById(route.params.id as string) || trip.days[0])
const arrivedStop = computed(() => day.value.stops.find(s => user.statusOf(s.id) === 'arrived') || null)

// Shared priority-aware plan so each stop card shows its include/fit state.
const { result: captain } = useRoadCaptain(day)
const planById = computed(() => Object.fromEntries(captain.value.stops.map(s => [s.id, s])))

const groups = computed(() => {
  const d = day.value
  if (d.isPool) return [{ key: 'pool', label: '📍 Kies je bestemmingen', color: 'text-nice', dot: 'bg-nice', stops: d.stops }]
  return [
    { key: 'must', label: '🟥 Must do', color: 'text-must', dot: 'bg-must', stops: d.stops.filter(s => s.category === 'must') },
    { key: 'nice', label: '🟧 Leuk / nice to have', color: 'text-nice', dot: 'bg-nice', stops: d.stops.filter(s => s.category === 'nice') },
    { key: 'bonus', label: '🟩 Bonus', color: 'text-bonus', dot: 'bg-bonus', stops: d.stops.filter(s => s.category === 'bonus') }
  ].filter(g => g.stops.length)
})
</script>

<template>
  <div class="space-y-4">
    <RouterLink to="/days" class="inline-flex items-center gap-1 text-sm font-bold text-muted tap">
      <ChevronLeftIcon class="w-4 h-4" /> Alle dagen
    </RouterLink>

    <!-- hero -->
    <header>
      <div class="text-xs font-extrabold uppercase tracking-[0.12em] text-bronze">{{ day.eyebrow }}</div>
      <h1 class="text-2xl font-extrabold mt-1.5 leading-tight">{{ day.title }}</h1>
      <p class="text-sm text-muted">{{ day.subtitle }}</p>
      <p class="text-xs text-faint mt-1">{{ day.isPool ? '7 – 10 augustus' : dutchDate(day.date) }}</p>
    </header>

    <!-- Explore Mode: verschijnt zodra je bij een stop bent aangekomen -->
    <ExploreGuide v-if="arrivedStop" :day="day" :stop="arrivedStop" :key="arrivedStop.id" />

    <!-- stat strip -->
    <div v-if="!day.isPool" class="grid grid-cols-4 gap-2">
      <div class="rounded-xl2 border border-line bg-card py-2.5 text-center">
        <div class="text-[10px] font-extrabold uppercase text-faint">Afstand</div><div class="text-sm font-black text-bronze mt-0.5">{{ day.km }}</div>
      </div>
      <div class="rounded-xl2 border border-line bg-card py-2.5 text-center">
        <div class="text-[10px] font-extrabold uppercase text-faint">Rijtijd</div><div class="text-sm font-black mt-0.5">{{ day.drive }}</div>
      </div>
      <div class="rounded-xl2 border border-line bg-card py-2.5 text-center">
        <div class="text-[10px] font-extrabold uppercase text-faint">Vertrek</div><div class="text-sm font-black text-nav mt-0.5">{{ day.depart }}</div>
      </div>
      <div class="rounded-xl2 border border-line bg-card py-2.5 text-center">
        <div class="text-[10px] font-extrabold uppercase text-faint">Aankomst</div><div class="text-sm font-black mt-0.5">{{ day.arrive }}</div>
      </div>
    </div>

    <RouteCard :day="day" />

    <!-- depart advice -->
    <div v-if="day.departAdvice" class="flex items-center gap-3 rounded-xl2 border border-bronze-deep bg-gradient-to-br from-bronze-soft to-transparent px-4 py-3">
      <div><div class="text-[10px] font-extrabold uppercase text-faint">Aanbevolen vertrek</div><div class="text-2xl font-black text-bronze">{{ day.departAdvice.time }}</div></div>
      <p class="text-xs text-ink/85 leading-snug">{{ day.departAdvice.text }}</p>
    </div>

    <!-- banners -->
    <WeatherBanner :day="day" />
    <div v-if="day.advice" class="rounded-xl2 border border-bronze-soft bg-gradient-to-br from-[#241d13] to-[#1a1610] px-4 py-3 text-sm text-[#e9d3b4]">
      <b class="text-ink">Mijn keuze:</b> {{ day.advice }}
    </div>

    <!-- Road Captain -->
    <RoadCaptain v-if="day.planning" :day="day" />

    <!-- Timeline (day 12) -->
    <template v-if="day.timeline">
      <SectionTitle label="⏱ Tijdlijn van de dag" />
      <div class="card p-4"><TimelineView :items="day.timeline" /></div>
    </template>

    <!-- pool intro -->
    <div v-if="day.poolIntro" class="card p-4 text-sm text-muted leading-relaxed">
      <b class="text-ink">Zo werkt het:</b> {{ day.poolIntro }}
    </div>

    <!-- stops grouped -->
    <template v-for="g in groups" :key="g.key">
      <div class="flex items-center gap-2 mt-6 mb-3 text-xs font-extrabold uppercase tracking-[0.09em]" :class="g.color">
        <span class="w-2.5 h-2.5 rounded-full" :class="g.dot" />{{ g.label }}
      </div>
      <div class="space-y-2.5">
        <StopCard v-for="s in g.stops" :key="s.id" :stop="s" :plan="planById[s.id]" />
      </div>
    </template>

    <!-- lists -->
    <template v-if="day.restaurants.length"><SectionTitle label="🍝 Restauranttips" /><ChipLinks :items="day.restaurants" /></template>
    <template v-if="day.gopro.length"><SectionTitle label="🎬 GoPro-momenten" /><ChipLinks :items="day.gopro" /></template>
    <template v-if="day.fotospots.length"><SectionTitle label="📸 Fotospots" /><ChipLinks :items="day.fotospots" /></template>

    <template v-if="day.fuel">
      <SectionTitle label="⛽ Tankadvies" />
      <div class="rounded-xl2 border border-line border-l-4 border-l-bronze bg-card px-4 py-3 text-sm text-ink/85 leading-relaxed">{{ day.fuel }}</div>
    </template>

    <!-- wellness link (Leitlhof) -->
    <RouterLink v-if="day.wellness" to="/leitlhof" class="block card p-4 mt-4 tap">
      <div class="flex items-center justify-between">
        <span class="font-extrabold flex items-center gap-2">🧖 Leitlhof Spa &amp; Wellbeing</span>
        <span class="text-xs font-extrabold text-bronze">Open →</span>
      </div>
    </RouterLink>

    <!-- hotel -->
    <template v-if="day.hotel">
      <SectionTitle label="🏨 Overnachting" />
      <HotelCard :hotel="day.hotel" link />
    </template>
  </div>
</template>
