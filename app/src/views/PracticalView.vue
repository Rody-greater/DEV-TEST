<script setup lang="ts">
import { useTripStore } from '@/stores/trip'
import ChecklistGroup from '@/components/trip/ChecklistGroup.vue'

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

    <div class="card p-4 text-sm text-muted leading-relaxed">
      <b class="text-ink">Tol &amp; vignetten:</b> Zwitserse vignette vóór de grens (dag 2), Oostenrijkse vignette voor de terugreis (dag 13, via Brenner),
      en een Telepass/Fulli-badge maakt de Italiaanse tol soepeler. Controleer altijd de actuele regels.
    </div>
  </div>
</template>
