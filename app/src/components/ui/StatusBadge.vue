<script setup lang="ts">
import { computed } from 'vue'
import type { CaptainLevel } from '@/composables/useRoadCaptain'

const props = defineProps<{ level: CaptainLevel }>()

const style = computed(() => ({
  green: 'bg-bonus/15 text-bonus border-bonus/40',
  orange: 'bg-nice/15 text-nice border-nice/40',
  red: 'bg-must/15 text-must border-must/40',
  none: 'bg-card3 text-muted border-line'
}[props.level]))

const dot = computed(() => ({
  green: 'bg-bonus', orange: 'bg-nice', red: 'bg-must', none: 'bg-muted'
}[props.level]))
</script>

<template>
  <span class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-extrabold" :class="style">
    <span class="w-2 h-2 rounded-full" :class="dot" />
    <slot />
  </span>
</template>
