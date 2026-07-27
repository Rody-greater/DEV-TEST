<script setup lang="ts">
import { toRef, computed, ref, watch } from 'vue'
import type { Day, LatLng } from '@/types/trip'
import { useRoadCaptain } from '@/composables/useRoadCaptain'
import { useGeo, distanceM } from '@/composables/useGeo'
import { humanDuration } from '@/utils/time'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { ArrowPathIcon, SignalIcon, SignalSlashIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{ day: Day }>()
const dayRef = toRef(props, 'day')
const { result, setDeparture, resetDeparture, arrive, depart, skip, resetStop } = useRoadCaptain(dayRef)

/* metadata (emoji + coord) per stop id, from the full day data */
const meta = computed(() => {
  const m: Record<string, { emoji: string; coord: LatLng | null }> = {}
  props.day.stops.forEach(s => { m[s.id] = { emoji: s.emoji, coord: s.coord } })
  return m
})

const departure = computed({
  get: () => result.value.actualDeparture || props.day.planning?.departDefault || '08:00',
  set: (v: string) => setDeparture(v)
})

/* Ordered stop lists */
const active = computed(() => result.value.stops.filter(s => s.status === 'pending' || s.status === 'arrived'))
const nextStop = computed(() => active.value[0] || null)
const laterStops = computed(() => active.value.slice(1))
const doneStops = computed(() => result.value.stops.filter(s => s.status === 'departed' || s.status === 'skipped'))

/* ---- GPS proximity suggestions (optional, offline-capable) ---- */
const geo = useGeo()
const suggestion = ref<{ type: 'arrive' | 'depart'; id: string; title: string } | null>(null)
const dismissed = ref<Set<string>>(new Set())

function toggleGeo() { geo.enabled.value ? geo.disable() : geo.enable() }

watch(
  () => geo.position.value,
  pos => {
    if (!pos || suggestion.value) return
    // leaving a stop we're at?
    for (const s of result.value.stops) {
      const c = meta.value[s.id]?.coord
      if (!c) continue
      if (s.status === 'arrived' && distanceM(pos, c) > 150 && !dismissed.value.has('depart:' + s.id)) {
        suggestion.value = { type: 'depart', id: s.id, title: s.title }; return
      }
    }
    // arriving at a stop?
    for (const s of result.value.stops) {
      const c = meta.value[s.id]?.coord
      if (!c) continue
      if (s.status === 'pending' && distanceM(pos, c) < 100 && !dismissed.value.has('arrive:' + s.id)) {
        suggestion.value = { type: 'arrive', id: s.id, title: s.title }; return
      }
    }
  }
)

function confirmSuggestion() {
  const s = suggestion.value
  if (!s) return
  if (s.type === 'arrive') arrive(s.id)
  else depart(s.id)
  suggestion.value = null
}
function dismissSuggestion() {
  const s = suggestion.value
  if (s) dismissed.value.add(s.type + ':' + s.id)
  suggestion.value = null
}

const slackText = computed(() => {
  const s = result.value.slackMin
  if (s == null) return '—'
  return (s >= 0 ? '+' : '−') + humanDuration(Math.abs(s))
})
</script>

<template>
  <section v-if="day.planning" class="card p-4 space-y-4 animate-fadeUp">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-[10px] font-extrabold uppercase tracking-[0.1em] text-bronze">
          Road Captain <span v-if="result.mode === 'live'" class="text-bonus">· live</span>
        </div>
        <h3 class="text-lg font-extrabold">Slimme planning</h3>
      </div>
      <StatusBadge :level="result.level">{{ result.label }}</StatusBadge>
    </div>

    <!-- advice -->
    <Transition name="fade" mode="out-in">
      <p :key="result.advice" class="text-sm text-ink/90 leading-relaxed">{{ result.advice }}</p>
    </Transition>

    <!-- GPS suggestion -->
    <Transition name="fade">
      <div v-if="suggestion" class="flex items-center justify-between gap-3 rounded-xl2 border border-nav/40 bg-nav/10 px-4 py-3 animate-fadeUp">
        <span class="text-sm font-bold">
          {{ suggestion.type === 'arrive' ? `Ben je aangekomen bij ${suggestion.title}?` : `Ben je vertrokken van ${suggestion.title}?` }}
        </span>
        <span class="flex gap-2 shrink-0">
          <button type="button" class="rounded-lg bg-bonus px-3 py-1.5 text-xs font-extrabold text-bg2 tap" @click="confirmSuggestion">Ja</button>
          <button type="button" class="rounded-lg border border-line px-3 py-1.5 text-xs font-bold text-muted tap" @click="dismissSuggestion">Nee</button>
        </span>
      </div>
    </Transition>

    <!-- departure input -->
    <div class="flex items-center gap-3">
      <label class="text-sm font-bold text-muted whitespace-nowrap">Werkelijk vertrek</label>
      <input v-model="departure" type="time"
        class="flex-1 rounded-xl2 bg-card2 border border-line px-3 py-2.5 text-lg font-black text-ink tabular-nums focus:outline-none focus:border-bronze-deep" />
      <button type="button" class="p-2.5 rounded-xl2 border border-line bg-card2 tap" aria-label="Reset" @click="resetDeparture">
        <ArrowPathIcon class="w-5 h-5 text-muted" />
      </button>
    </div>

    <!-- live ETA panel -->
    <div class="grid grid-cols-3 gap-2 text-center">
      <div class="rounded-xl2 border border-line bg-bg2/60 py-2.5">
        <div class="text-[10px] font-extrabold uppercase text-faint">Hotel ETA</div>
        <div class="text-base font-black text-bronze tabular-nums transition-all">{{ result.hotelEta }}</div>
      </div>
      <div class="rounded-xl2 border border-line bg-bg2/60 py-2.5">
        <div class="text-[10px] font-extrabold uppercase text-faint">Speling</div>
        <div class="text-base font-black tabular-nums transition-all" :class="result.slackMin != null && result.slackMin < 0 ? 'text-[#ef4444]' : 'text-bonus'">{{ slackText }}</div>
      </div>
      <div class="rounded-xl2 border border-line bg-bg2/60 py-2.5">
        <div class="text-[10px] font-extrabold uppercase text-faint">Nog te rijden</div>
        <div class="text-base font-black text-ink tabular-nums">{{ humanDuration(result.remainingDriveMin) }}</div>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-2 text-center text-xs">
      <div><span class="text-faint">Werkelijk vertrek</span><div class="font-bold tabular-nums">{{ result.actualDeparture || '—' }}</div></div>
      <div><span class="text-faint">Laatste aankomst</span><div class="font-bold tabular-nums">{{ result.actualArrival || '—' }}</div></div>
      <div><span class="text-faint">Nog te bezoeken</span><div class="font-bold tabular-nums">{{ result.remainingStops }}</div></div>
    </div>

    <div v-if="result.appointment" class="rounded-xl2 border border-bronze-deep bg-bronze-soft/40 px-4 py-2.5 text-sm">
      <b class="text-bronze">{{ result.appointment.label }}</b> om {{ result.appointment.time }} — vaste afspraak.
    </div>

    <!-- GPS toggle -->
    <button type="button"
      class="w-full flex items-center justify-between rounded-xl2 border px-4 py-3 text-sm font-bold tap"
      :class="geo.enabled.value ? 'border-bonus/40 bg-bonus/10 text-bonus' : 'border-line bg-card2 text-muted'"
      :disabled="!geo.supported"
      @click="toggleGeo">
      <span class="flex items-center gap-2">
        <component :is="geo.enabled.value ? SignalIcon : SignalSlashIcon" class="w-5 h-5" />
        {{ !geo.supported ? 'GPS niet beschikbaar' : geo.enabled.value ? 'GPS aan — stelt aankomst/vertrek voor' : 'GPS inschakelen (optioneel)' }}
      </span>
      <span v-if="geo.error.value" class="text-[10px] text-[#ef4444]">GPS-fout</span>
    </button>

    <!-- next + remaining stops -->
    <div class="space-y-2">
      <div class="text-xs font-extrabold uppercase tracking-wide text-faint">Volgende stop</div>
      <div v-if="nextStop" class="rounded-xl2 border border-bronze/40 bg-bronze-soft/25 p-3 animate-fadeUp">
        <div class="flex items-center justify-between">
          <span class="font-extrabold flex items-center gap-2">
            <span>{{ meta[nextStop.id]?.emoji }}</span>{{ nextStop.title }}
            <span v-if="nextStop.status === 'arrived'" class="text-[10px] font-extrabold text-bonus uppercase">· aangekomen</span>
          </span>
          <span class="text-xs text-faint tabular-nums">{{ humanDuration(nextStop.dwellMin) }}</span>
        </div>
        <div class="mt-2 grid grid-cols-3 gap-2">
          <button v-if="nextStop.status !== 'arrived'" type="button" class="rounded-lg border border-bonus/50 bg-bonus/15 text-bonus py-2 text-xs font-extrabold tap" @click="arrive(nextStop.id)">🟢 Aangekomen</button>
          <button v-else type="button" class="rounded-lg border border-nav/50 bg-nav/15 text-nav py-2 text-xs font-extrabold tap" @click="depart(nextStop.id)">🚗 Vertrokken</button>
          <button type="button" class="rounded-lg border border-[#f97316]/40 bg-[#f97316]/10 text-[#f97316] py-2 text-xs font-extrabold tap" @click="skip(nextStop.id)">⏭ Overslaan</button>
          <button type="button" class="rounded-lg border border-line bg-card2 text-muted py-2 text-xs font-bold tap" @click="resetStop(nextStop.id)">Reset</button>
        </div>
      </div>
      <div v-else class="text-sm text-muted">Alle stops afgerond of overgeslagen. 🎉</div>

      <template v-if="laterStops.length">
        <div class="text-xs font-extrabold uppercase tracking-wide text-faint pt-1">Daarna</div>
        <div
          v-for="s in laterStops" :key="s.id"
          class="flex items-center justify-between rounded-xl2 border px-3 py-2.5 text-sm"
          :class="s.adviseSkip ? 'border-[#ef4444]/30 bg-[#ef4444]/5' : 'border-line bg-card2'"
        >
          <span class="flex items-center gap-2 min-w-0">
            <span>{{ meta[s.id]?.emoji }}</span>
            <span class="truncate">{{ s.title }}</span>
            <span v-if="s.adviseSkip" class="text-[10px] font-extrabold text-[#ef4444] uppercase shrink-0">skip advies</span>
          </span>
          <span class="flex items-center gap-2 shrink-0">
            <span class="text-xs text-faint tabular-nums">{{ humanDuration(s.dwellMin) }}</span>
            <button type="button" class="text-[11px] font-bold text-[#f97316] tap" @click="skip(s.id)">skip</button>
          </span>
        </div>
      </template>

      <template v-if="doneStops.length">
        <div class="text-xs font-extrabold uppercase tracking-wide text-faint pt-1">Afgerond</div>
        <div v-for="s in doneStops" :key="s.id" class="flex items-center justify-between rounded-xl2 border border-line bg-bg2/40 px-3 py-2 text-sm">
          <span class="flex items-center gap-2 min-w-0 text-muted">
            <span>{{ meta[s.id]?.emoji }}</span><span class="truncate line-through">{{ s.title }}</span>
            <span class="text-[10px] font-extrabold uppercase shrink-0" :class="s.status === 'skipped' ? 'text-[#f97316]' : 'text-nav'">
              {{ s.status === 'skipped' ? 'overgeslagen' : 'bezocht' }}
            </span>
          </span>
          <span class="flex items-center gap-2 shrink-0">
            <span v-if="s.dwellSoFarMin != null && s.status === 'departed'" class="text-xs text-faint tabular-nums">{{ humanDuration(s.dwellSoFarMin) }}</span>
            <button type="button" class="text-[11px] font-bold text-nav tap" @click="resetStop(s.id)">terug</button>
          </span>
        </div>
      </template>
    </div>
  </section>
</template>
