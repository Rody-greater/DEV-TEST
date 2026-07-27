<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ value: number; interactive?: boolean }>()
const emit = defineEmits<{ (e: 'set', n: number): void }>()
const full = computed(() => Math.round(props.value))
</script>

<template>
  <span class="inline-flex items-center gap-0.5 select-none">
    <button
      v-for="n in 5" :key="n" type="button"
      :disabled="!interactive"
      class="leading-none"
      :class="[interactive ? 'tap cursor-pointer text-lg' : 'text-sm cursor-default', n <= full ? 'text-bronze' : 'text-line']"
      @click="interactive && emit('set', n)"
      :aria-label="`${n} sterren`"
    >★</button>
  </span>
</template>
