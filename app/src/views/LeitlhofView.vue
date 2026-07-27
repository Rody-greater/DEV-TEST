<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTripStore } from '@/stores/trip'
import HotelDetail from '@/components/trip/HotelDetail.vue'
import CountdownPill from '@/components/ui/CountdownPill.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import { ChevronLeftIcon, SparklesIcon } from '@heroicons/vue/24/solid'

const trip = useTripStore()
const day = computed(() => trip.days.find(d => d.wellness))
const hotel = computed(() => day.value?.hotel || null)
const w = computed(() => day.value?.wellness || null)

const spa = computed(() => w.value ? [
  { k: 'Spa openingstijden', v: w.value.spa },
  { k: 'Zwembad', v: w.value.pool },
  { k: 'Sauna', v: w.value.sauna },
  { k: 'Textielvrij', v: w.value.textileFree }
] : [])
</script>

<template>
  <div v-if="day && w && hotel" class="space-y-4">
    <RouterLink to="/hotels" class="inline-flex items-center gap-1 text-sm font-bold text-muted tap">
      <ChevronLeftIcon class="w-4 h-4" /> Hotels
    </RouterLink>

    <div class="text-xs font-extrabold uppercase tracking-[0.12em] text-bronze">Hoogtepunt · 12 augustus</div>

    <!-- ritual highlight -->
    <section class="rounded-xl2 border border-[#2f6b57] bg-gradient-to-br from-[#141c1a] to-card p-5 animate-fadeUp">
      <h1 class="text-xl font-extrabold flex items-center gap-2"><SparklesIcon class="w-6 h-6 text-bonus" /> Wellbeing Ritual</h1>
      <div class="mt-3 flex items-center justify-between rounded-xl2 border border-[#2f6b57] bg-gradient-to-br from-[#1c3a30] to-[#15251f] px-4 py-3.5">
        <div>
          <div class="text-sm font-bold">Vaste afspraak</div>
          <div class="text-xs text-muted mt-0.5">Naturhotel Leitlhof</div>
        </div>
        <div class="text-right">
          <div class="text-3xl font-black text-bonus leading-none">{{ w.ritualTime }}</div>
          <span class="inline-block mt-1 rounded-full border border-bonus/50 bg-bonus/20 px-2.5 py-0.5 text-[11px] font-extrabold text-bonus">✓ geboekt</span>
        </div>
      </div>
      <div class="mt-3">
        <CountdownPill :date-i-s-o="day.date" :time="w.ritualTime" label="Aftellen naar het ritual" />
      </div>
    </section>

    <!-- vertrekadvies -->
    <div v-if="day.departAdvice" class="flex items-center gap-3 rounded-xl2 border border-bronze-deep bg-gradient-to-br from-bronze-soft to-transparent px-4 py-3">
      <div><div class="text-[10px] font-extrabold uppercase text-faint">Vertrek</div><div class="text-2xl font-black text-bronze">{{ day.departAdvice.time }}</div></div>
      <p class="text-xs text-ink/85 leading-snug">{{ day.departAdvice.text }}</p>
    </div>

    <!-- spa info -->
    <SectionTitle label="🧖 Spa & sauna" />
    <div class="grid grid-cols-1 gap-2">
      <div v-for="f in spa" :key="f.k" class="rounded-xl2 border border-line bg-card2 px-4 py-3">
        <div class="text-[10px] font-extrabold uppercase text-faint">{{ f.k }}</div>
        <div class="text-sm text-ink/90 mt-0.5">{{ f.v }}</div>
      </div>
      <div class="rounded-xl2 border border-line border-l-4 border-l-bronze bg-card px-4 py-3 text-sm text-ink/85">
        <b class="text-bronze">Massage-tip</b> — {{ w.massage }}
      </div>
    </div>

    <!-- planning link -->
    <RouterLink :to="`/day/${day.id}`" class="block card p-4 tap">
      <div class="flex items-center justify-between">
        <span class="font-extrabold">Planning &amp; Road Captain van dag 12</span>
        <span class="text-xs font-extrabold text-nav">Open →</span>
      </div>
    </RouterLink>

    <SectionTitle label="🏨 Hotelinfo" />
    <HotelDetail :hotel="hotel" />
  </div>
</template>
