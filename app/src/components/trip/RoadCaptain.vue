<script setup lang="ts">
import { toRef, computed } from 'vue'
import type { Day } from '@/types/trip'
import { useRoadCaptain } from '@/composables/useRoadCaptain'
import { useUserStore } from '@/stores/user'
import { humanDuration } from '@/utils/time'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{ day: Day }>()
const dayRef = toRef(props, 'day')
const user = useUserStore()
const { result, setDeparture, resetDeparture } = useRoadCaptain(dayRef)

const departure = computed({
  get: () => result.value.departure || props.day.planning?.departDefault || '08:00',
  set: (v: string) => setDeparture(v)
})
</script>

<template>
  <section v-if="day.planning" class="card p-4 space-y-4 animate-fadeUp">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-[10px] font-extrabold uppercase tracking-[0.1em] text-bronze">Road Captain</div>
        <h3 class="text-lg font-extrabold">Slimme planning</h3>
      </div>
      <StatusBadge :level="result.level">{{ result.headline }}</StatusBadge>
    </div>

    <!-- departure input -->
    <div class="flex items-center gap-3">
      <label class="text-sm font-bold text-muted whitespace-nowrap">Werkelijk vertrek</label>
      <input
        v-model="departure" type="time"
        class="flex-1 rounded-xl2 bg-card2 border border-line px-3 py-2.5 text-lg font-black text-ink tabular-nums focus:outline-none focus:border-bronze-deep"
      />
      <button type="button" class="p-2.5 rounded-xl2 border border-line bg-card2 tap" aria-label="Reset" @click="resetDeparture">
        <ArrowPathIcon class="w-5 h-5 text-muted" />
      </button>
    </div>

    <p class="text-sm text-muted leading-relaxed">{{ result.detail }}</p>

    <!-- key numbers -->
    <div class="grid grid-cols-3 gap-2 text-center">
      <div class="rounded-xl2 border border-line bg-bg2/60 py-2.5">
        <div class="text-[10px] font-extrabold uppercase text-faint">Aankomst</div>
        <div class="text-base font-black text-bronze tabular-nums">{{ result.eta }}</div>
      </div>
      <div class="rounded-xl2 border border-line bg-bg2/60 py-2.5">
        <div class="text-[10px] font-extrabold uppercase text-faint">Speling</div>
        <div class="text-base font-black tabular-nums"
          :class="result.slackMin != null && result.slackMin < 0 ? 'text-must' : 'text-bonus'">
          {{ result.slackMin != null ? (result.slackMin >= 0 ? '+' : '−') + humanDuration(Math.abs(result.slackMin)) : '—' }}
        </div>
      </div>
      <div class="rounded-xl2 border border-line bg-bg2/60 py-2.5">
        <div class="text-[10px] font-extrabold uppercase text-faint">Rijtijd</div>
        <div class="text-base font-black text-ink tabular-nums">{{ humanDuration(result.driveMin) }}</div>
      </div>
    </div>

    <div v-if="result.appointment" class="rounded-xl2 border border-bronze-deep bg-bronze-soft/40 px-4 py-2.5 text-sm">
      <b class="text-bronze">{{ result.appointment.label }}</b> om {{ result.appointment.time }} — vaste afspraak.
    </div>

    <!-- haalbaarheid per stop -->
    <div class="space-y-1.5">
      <div class="text-xs font-extrabold uppercase tracking-wide text-faint">Haalbaarheid</div>
      <div
        v-for="s in result.stops" :key="s.id"
        class="flex items-center justify-between rounded-xl2 border px-3 py-2.5 text-sm"
        :class="s.included ? 'border-line bg-card2' : 'border-must/30 bg-must/5'"
      >
        <span class="flex items-center gap-2 min-w-0">
          <CheckCircleIcon v-if="s.included" class="w-5 h-5 text-bonus shrink-0" />
          <XCircleIcon v-else class="w-5 h-5 text-must shrink-0" />
          <span class="truncate" :class="s.included ? '' : 'line-through text-muted'">{{ s.title }}</span>
        </span>
        <span class="flex items-center gap-2 shrink-0">
          <span class="text-xs text-faint tabular-nums">{{ humanDuration(s.dwellMin) }}</span>
          <span v-if="s.reason === 'skip-advice'" class="text-[10px] font-extrabold text-must uppercase">skip advies</span>
          <button type="button" class="text-[11px] font-bold text-nav tap" @click="user.toggleSkip(s.id)">
            {{ user.skips[s.id] ? 'terug' : 'skip' }}
          </button>
        </span>
      </div>
    </div>
  </section>
</template>
