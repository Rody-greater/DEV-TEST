<script setup lang="ts">
import { computed } from 'vue'
import type { CaptainLevel } from '@/composables/useRoadCaptain'

const props = defineProps<{ level: CaptainLevel }>()

const style = computed(() => ({
  'green-plus': 'bg-bonus/15 text-bonus border-bonus/40',
  green: 'bg-bonus/15 text-bonus border-bonus/40',
  yellow: 'bg-[#eab308]/15 text-[#eab308] border-[#eab308]/40',
  orange: 'bg-[#f97316]/15 text-[#f97316] border-[#f97316]/40',
  red: 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/40',
  none: 'bg-card3 text-muted border-line'
}[props.level]))

const dot = computed(() => ({
  'green-plus': 'bg-bonus', green: 'bg-bonus', yellow: 'bg-[#eab308]',
  orange: 'bg-[#f97316]', red: 'bg-[#ef4444]', none: 'bg-muted'
}[props.level]))
</script>

<template>
  <span class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-extrabold transition-colors duration-300" :class="style">
    <span class="w-2 h-2 rounded-full transition-colors duration-300" :class="dot" />
    <slot />
  </span>
</template>
