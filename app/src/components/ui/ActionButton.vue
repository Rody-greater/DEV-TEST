<script setup lang="ts">
withDefaults(defineProps<{ label: string; sub?: string; icon?: string; variant?: 'default' | 'nav' | 'book' }>(), {
  variant: 'default'
})
</script>

<template>
  <button
    type="button"
    class="w-full flex items-center justify-between gap-3 rounded-xl2 border px-4 py-3.5 min-h-[52px] font-bold text-sm tap"
    :class="variant === 'nav' ? 'bg-nav/10 border-nav/30 text-ink' : 'bg-card2 border-line text-ink'"
  >
    <span class="flex items-center gap-3 min-w-0">
      <span v-if="icon" class="text-lg shrink-0">{{ icon }}</span>
      <span class="truncate">{{ label }}</span>
    </span>
    <span
      class="text-xs font-extrabold whitespace-nowrap"
      :class="variant === 'book' ? 'text-bronze' : 'text-nav'"
    >{{ sub || 'Maps →' }}</span>
  </button>
</template>
