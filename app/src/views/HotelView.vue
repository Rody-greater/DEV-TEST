<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useTripStore } from '@/stores/trip'
import HotelDetail from '@/components/trip/HotelDetail.vue'
import { ChevronLeftIcon } from '@heroicons/vue/24/solid'

const route = useRoute()
const trip = useTripStore()
const hotel = computed(() => trip.hotels.find(h => h.id === route.params.id))
</script>

<template>
  <div class="space-y-4">
    <RouterLink to="/hotels" class="inline-flex items-center gap-1 text-sm font-bold text-muted tap">
      <ChevronLeftIcon class="w-4 h-4" /> Hotels
    </RouterLink>
    <HotelDetail v-if="hotel" :hotel="hotel" />
    <div v-else class="card p-6 text-center text-muted">Hotel niet gevonden.</div>
  </div>
</template>
