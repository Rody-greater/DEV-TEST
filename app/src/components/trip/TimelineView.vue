<script setup lang="ts">
import type { TimelineItem } from '@/types/trip'
defineProps<{ items: TimelineItem[] }>()

const dot = (cls: string) => cls === 'key' ? 'bg-nav' : cls === 'end' ? 'bg-done' : 'bg-bronze'
const time = (cls: string) => cls === 'key' ? 'text-nav' : cls === 'end' ? 'text-done' : 'text-bronze'
</script>

<template>
  <div class="pl-1">
    <div v-for="(it, i) in items" :key="i" class="relative pl-8 pb-5 last:pb-0">
      <span class="absolute left-1 top-1 w-3 h-3 rounded-full ring-4 ring-black/30" :class="dot(it.cls)" />
      <span v-if="i < items.length - 1" class="absolute left-[9px] top-4 bottom-0 w-0.5 bg-line" />
      <div class="text-xs font-black tracking-wide" :class="time(it.cls)">{{ it.time }}</div>
      <div class="font-bold text-sm mt-0.5">{{ it.title }}</div>
      <div v-if="it.note" class="text-xs text-muted mt-0.5">{{ it.note }}</div>
    </div>
  </div>
</template>
