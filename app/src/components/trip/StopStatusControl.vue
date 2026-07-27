<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import type { StopStatus } from '@/stores/user'
import { useNow } from '@/composables/useNow'
import { fromMinutes, clockMinutes, humanDuration } from '@/utils/time'

const props = defineProps<{ stopId: string }>()
const user = useUserStore()
const now = useNow(1000)

const status = computed<StopStatus>(() => user.statusOf(props.stopId))
const arrivedAt = computed(() => user.arrivedAtOf(props.stopId))
const departedAt = computed(() => user.departedAtOf(props.stopId))

const dwellMin = computed(() => {
  if (arrivedAt.value == null) return null
  const end = departedAt.value ?? now.value.getTime()
  return Math.max(0, (end - arrivedAt.value) / 60000)
})

const options: { key: StopStatus; label: string; icon: string; on: string }[] = [
  { key: 'pending', label: 'Niet bezocht', icon: '○', on: 'bg-card3 text-ink border-line' },
  { key: 'arrived', label: 'Aangekomen', icon: '🟢', on: 'bg-bonus/20 text-bonus border-bonus/50' },
  { key: 'departed', label: 'Vertrokken', icon: '🚗', on: 'bg-nav/20 text-nav border-nav/50' },
  { key: 'skipped', label: 'Overgeslagen', icon: '⏭', on: 'bg-[#f97316]/15 text-[#f97316] border-[#f97316]/40' }
]

function choose(s: StopStatus) { user.setStatus(props.stopId, s, Date.now()) }
</script>

<template>
  <div class="space-y-2">
    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="o in options" :key="o.key" type="button"
        class="flex items-center justify-center gap-1.5 rounded-xl2 border px-3 py-2.5 text-sm font-bold tap transition-colors duration-200"
        :class="status === o.key ? o.on : 'bg-bg2 border-line text-muted'"
        @click="choose(o.key)"
      >
        <span>{{ o.icon }}</span>{{ o.label }}
      </button>
    </div>

    <!-- timers -->
    <div v-if="arrivedAt != null" class="grid grid-cols-3 gap-2 text-center animate-fadeUp">
      <div class="rounded-lg border border-line bg-bg2/60 py-1.5">
        <div class="text-[9px] font-extrabold uppercase text-faint">Aankomst</div>
        <div class="text-sm font-black text-bonus tabular-nums">{{ fromMinutes(clockMinutes(arrivedAt)) }}</div>
      </div>
      <div class="rounded-lg border border-line bg-bg2/60 py-1.5">
        <div class="text-[9px] font-extrabold uppercase text-faint">Verblijftijd</div>
        <div class="text-sm font-black tabular-nums" :class="departedAt == null ? 'text-bronze' : 'text-ink'">
          {{ dwellMin != null ? humanDuration(dwellMin) : '—' }}
        </div>
      </div>
      <div class="rounded-lg border border-line bg-bg2/60 py-1.5">
        <div class="text-[9px] font-extrabold uppercase text-faint">Vertrek</div>
        <div class="text-sm font-black text-nav tabular-nums">
          {{ departedAt != null ? fromMinutes(clockMinutes(departedAt)) : '—' }}
        </div>
      </div>
    </div>
  </div>
</template>
