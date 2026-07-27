<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTripStore } from '@/stores/trip'
import { useUserStore } from '@/stores/user'
import { mapsSearch, openExternal } from '@/composables/useMaps'
import Stars from '@/components/ui/Stars.vue'
import { HeartIcon, MapPinIcon } from '@heroicons/vue/24/solid'

const trip = useTripStore()
const user = useUserStore()

const favs = computed(() =>
  trip.allStops.filter(s => user.isFavorite(s.id)).map(s => {
    const day = trip.days.find(d => d.stops.some(x => x.id === s.id))!
    return { stop: s, day }
  })
)
</script>

<template>
  <div class="space-y-4">
    <header class="pt-2">
      <div class="text-xs font-extrabold uppercase tracking-[0.12em] text-bronze">Bewaard</div>
      <h1 class="text-2xl font-extrabold mt-1">Favorieten</h1>
    </header>

    <div v-if="!favs.length" class="card p-8 text-center">
      <HeartIcon class="w-10 h-10 text-line mx-auto" />
      <p class="text-muted text-sm mt-3">Nog geen favorieten. Tik op het ❤ bij een stop om ’m hier te bewaren.</p>
    </div>

    <div v-for="f in favs" :key="f.stop.id" class="card p-4 animate-fadeUp">
      <div class="flex items-center gap-3">
        <span class="text-2xl">{{ f.stop.emoji }}</span>
        <div class="flex-1 min-w-0">
          <div class="font-extrabold truncate">{{ f.stop.title }}</div>
          <RouterLink :to="`/day/${f.day.id}`" class="text-xs text-muted">{{ f.day.tabLabel }} · {{ f.day.title }}</RouterLink>
        </div>
        <button type="button" class="p-1 tap" @click="user.toggleFavorite(f.stop.id)">
          <HeartIcon class="w-6 h-6 text-must" />
        </button>
      </div>
      <div class="mt-3 flex items-center justify-between">
        <Stars :value="user.ratingOf(f.stop.id)" interactive @set="user.setRating(f.stop.id, $event)" />
        <button type="button" class="flex items-center gap-1.5 text-xs font-extrabold text-nav tap" @click="openExternal(mapsSearch(f.stop.nav))">
          <MapPinIcon class="w-4 h-4" /> Navigeer
        </button>
      </div>
      <p v-if="user.noteOf(f.stop.id)" class="mt-2 text-sm text-muted italic">“{{ user.noteOf(f.stop.id) }}”</p>
    </div>
  </div>
</template>
