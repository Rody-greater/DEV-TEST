<script setup lang="ts">
import type { Linkish } from '@/types/trip'
import { mapsSearch, openExternal } from '@/composables/useMaps'
import { MapPinIcon } from '@heroicons/vue/24/solid'

defineProps<{ items: Linkish[] }>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="it in items" :key="it.t" type="button"
      class="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-2.5 text-sm font-bold tap"
      @click="openExternal(mapsSearch(it.q))"
    >
      <MapPinIcon class="w-4 h-4 text-bronze" />{{ it.t }}
    </button>
  </div>
</template>
