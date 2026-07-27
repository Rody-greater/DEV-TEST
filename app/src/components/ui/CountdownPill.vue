<script setup lang="ts">
import { computed } from 'vue'
import { useNow } from '@/composables/useNow'

/** Countdown naar een vaste afspraak op een gegeven dag (ISO-datum + HH:MM). */
const props = defineProps<{ dateISO: string; time: string; label: string }>()
const now = useNow(1000)

const target = computed(() => new Date(`${props.dateISO}T${props.time}:00`))
const diffMs = computed(() => target.value.getTime() - now.value.getTime())

const text = computed(() => {
  const ms = diffMs.value
  if (ms <= 0) return 'nu / geweest'
  const totalMin = Math.floor(ms / 60000)
  const d = Math.floor(totalMin / 1440)
  const h = Math.floor((totalMin % 1440) / 60)
  const m = totalMin % 60
  if (d > 0) return `${d}d ${h}u`
  if (h > 0) return `${h}u ${String(m).padStart(2, '0')}m`
  return `${m} min`
})
</script>

<template>
  <div class="flex items-center justify-between gap-3 rounded-xl2 border border-bronze-deep bg-gradient-to-br from-bronze-soft to-transparent px-4 py-3">
    <div>
      <div class="text-[10px] font-extrabold uppercase tracking-wide text-faint">{{ label }}</div>
      <div class="text-sm font-bold text-ink mt-0.5">{{ time }} uur</div>
    </div>
    <div class="text-2xl font-black text-bronze tabular-nums">{{ text }}</div>
  </div>
</template>
