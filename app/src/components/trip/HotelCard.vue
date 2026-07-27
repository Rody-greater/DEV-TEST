<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Hotel } from '@/types/trip'
import { mapsSearch, openExternal } from '@/composables/useMaps'
import { BuildingOffice2Icon, ArrowRightIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{ hotel: Hotel; link?: boolean }>()
const isLeitlhof = computed(() => props.hotel.id.includes('leitlhof'))
</script>

<template>
  <section class="rounded-xl2 border border-bronze-soft bg-gradient-to-br from-[#1c1a16] to-card p-4 shadow-soft animate-fadeUp">
    <div class="flex items-start justify-between gap-3">
      <h3 class="text-lg font-extrabold flex items-center gap-2">
        <BuildingOffice2Icon class="w-5 h-5 text-bronze" /> {{ hotel.name }}
      </h3>
      <span v-if="hotel.booked" class="shrink-0 rounded-full border border-bonus/40 bg-bonus/15 px-2.5 py-1 text-[11px] font-extrabold text-bonus">
        ✓ {{ hotel.bookedLabel }}
      </span>
    </div>
    <p class="text-sm text-muted mt-1">{{ hotel.address }}</p>

    <button
      type="button"
      class="mt-3 w-full flex items-center justify-between rounded-xl2 border border-nav/30 bg-nav/10 px-4 py-3 font-bold text-sm tap"
      @click="openExternal(mapsSearch(hotel.mapsQuery))"
    >
      <span>🧭 Navigeer naar hotel</span><span class="text-nav text-xs font-extrabold">Maps →</span>
    </button>

    <RouterLink v-if="link" :to="isLeitlhof ? '/leitlhof' : `/hotel/${hotel.id}`"
      class="mt-2 w-full flex items-center justify-between rounded-xl2 border border-line bg-card2 px-4 py-3 font-bold text-sm tap">
      <span>Alle hotelinfo</span><ArrowRightIcon class="w-4 h-4 text-bronze" />
    </RouterLink>
  </section>
</template>
