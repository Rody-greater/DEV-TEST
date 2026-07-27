<script setup lang="ts">
defineProps<{ value: number }>()
</script>

<template>
  <div class="h-2.5 w-full rounded-full bg-card3 overflow-hidden">
    <div
      class="h-full rounded-full bg-gradient-to-r from-bronze to-bronze-deep transition-[width] duration-700 ease-premium"
      :style="{ width: Math.max(0, Math.min(100, value)) + '%' }"
    />
  </div>
</template>
