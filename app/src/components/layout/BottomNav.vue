<script setup lang="ts">
import { RouterLink } from 'vue-router'
import {
  HomeIcon, CalendarDaysIcon, MapIcon, HeartIcon, Squares2X2Icon
} from '@heroicons/vue/24/outline'
import {
  HomeIcon as HomeSolid, CalendarDaysIcon as CalSolid, MapIcon as MapSolid,
  HeartIcon as HeartSolid, Squares2X2Icon as SquaresSolid
} from '@heroicons/vue/24/solid'

const items = [
  { to: '/', label: 'Home', o: HomeIcon, s: HomeSolid },
  { to: '/days', label: 'Dagen', o: CalendarDaysIcon, s: CalSolid },
  { to: '/map', label: 'Kaart', o: MapIcon, s: MapSolid },
  { to: '/favorites', label: 'Favoriet', o: HeartIcon, s: HeartSolid },
  { to: '/more', label: 'Meer', o: Squares2X2Icon, s: SquaresSolid }
]
</script>

<template>
  <nav
    class="fixed bottom-0 inset-x-0 z-40 border-t border-line bg-bg2/85 backdrop-blur-xl safe-b"
    aria-label="Hoofdnavigatie"
  >
    <div class="max-w-xl mx-auto grid grid-cols-5">
      <RouterLink
        v-for="it in items" :key="it.to" :to="it.to" custom v-slot="{ isExactActive, isActive, navigate }"
      >
        <button
          type="button"
          class="flex flex-col items-center justify-center gap-1 py-2.5 tap"
          :class="(it.to === '/' ? isExactActive : isActive) ? 'text-bronze' : 'text-faint'"
          @click="navigate"
        >
          <component :is="(it.to === '/' ? isExactActive : isActive) ? it.s : it.o" class="w-6 h-6" />
          <span class="text-[10px] font-bold tracking-wide">{{ it.label }}</span>
        </button>
      </RouterLink>
    </div>
  </nav>
</template>
