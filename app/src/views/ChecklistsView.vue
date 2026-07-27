<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTripStore } from '@/stores/trip'
import { useUserStore } from '@/stores/user'
import { CheckIcon } from '@heroicons/vue/24/solid'

const trip = useTripStore()
const user = useUserStore()

// Per-day checklist = de stops van die dag.
const dayGroups = computed(() => trip.days.map(d => ({
  id: d.id, label: `${d.tabLabel} · ${d.title}`,
  stops: d.stops
})))
</script>

<template>
  <div class="space-y-4">
    <header class="pt-2">
      <div class="text-xs font-extrabold uppercase tracking-[0.12em] text-bronze">Afvinken</div>
      <h1 class="text-2xl font-extrabold mt-1">Checklists per dag</h1>
    </header>

    <RouterLink to="/practical" class="block card p-4 tap">
      <div class="flex items-center justify-between">
        <span class="font-extrabold">⚙️ Algemene checklist (documenten, auto, tol)</span>
        <span class="text-xs font-extrabold text-nav">Open →</span>
      </div>
    </RouterLink>

    <section v-for="g in dayGroups" :key="g.id" class="card p-4 animate-fadeUp">
      <RouterLink :to="`/day/${g.id}`" class="text-sm font-extrabold text-bronze">{{ g.label }}</RouterLink>
      <div class="mt-3 space-y-1.5">
        <button
          v-for="s in g.stops" :key="s.id" type="button"
          class="w-full flex items-center gap-3 text-left tap"
          @click="user.toggleCheck(s.id)"
        >
          <span class="shrink-0 w-6 h-6 rounded-md border-2 grid place-items-center"
            :class="user.isChecked(s.id) ? 'bg-done border-done' : 'border-faint bg-bg2'">
            <CheckIcon v-if="user.isChecked(s.id)" class="w-4 h-4 text-bg2" />
          </span>
          <span class="text-sm flex items-center gap-1.5" :class="user.isChecked(s.id) ? 'line-through text-muted' : ''">
            <span>{{ s.emoji }}</span>{{ s.title }}
          </span>
        </button>
      </div>
    </section>
  </div>
</template>
