<script setup lang="ts">
import { useTripStore } from '@/stores/trip'
import ChecklistGroup from '@/components/trip/ChecklistGroup.vue'
import BorderInfo from '@/components/trip/BorderInfo.vue'

const trip = useTripStore()
</script>

<template>
  <div class="space-y-4">
    <header class="pt-2">
      <div class="text-xs font-extrabold uppercase tracking-[0.12em] text-bronze">Voor vertrek · onderweg</div>
      <h1 class="text-2xl font-extrabold mt-1">Praktisch</h1>
      <p class="text-sm text-muted">Afvinken wat klaar is — bewaard op dit toestel</p>
    </header>

    <ChecklistGroup
      v-for="(g, i) in trip.checklists" :key="g.id"
      :group-id="g.id" :icon="g.icon" :title="g.title" :items="g.items" :open="i === 0"
    />

    <BorderInfo />
  </div>
</template>
