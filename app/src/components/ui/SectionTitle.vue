<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <h3 class="text-xs font-extrabold uppercase tracking-[0.09em] text-faint mt-6 mb-3">
    {{ label }}
  </h3>
</template>
