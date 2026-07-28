<script setup lang="ts">
import { computed } from 'vue'
import type { Hotel } from '@/types/trip'
import { useUserStore } from '@/stores/user'
import { mapsSearch, gsearch, bookingSearch, openExternal } from '@/composables/useMaps'

const props = defineProps<{ hotel: Hotel }>()
const user = useUserStore()

const note = computed({
  get: () => user.noteOf('hotel:' + props.hotel.id),
  set: (v: string) => user.setNote('hotel:' + props.hotel.id, v)
})

const facts = computed(() => [
  { k: 'Inchecken', v: props.hotel.checkin },
  { k: 'Ontbijt', v: props.hotel.breakfast },
  { k: 'Parkeren', v: props.hotel.parking },
  { k: 'EV laden', v: props.hotel.ev },
  { k: 'Restaurant', v: props.hotel.restaurant },
  { k: 'Wellness', v: props.hotel.wellness }
].filter(f => f.v && f.v !== '—'))
</script>

<template>
  <div class="space-y-4">
    <!-- hero -->
    <div class="rounded-xl2 overflow-hidden border border-line">
      <div class="h-36 bg-gradient-to-br from-bronze/40 via-card2 to-bg2 grid place-items-center">
        <span class="text-5xl">🏔️</span>
      </div>
      <div class="p-4">
        <div class="flex items-start justify-between gap-3">
          <h1 class="text-xl font-extrabold">{{ hotel.name }}</h1>
          <span v-if="hotel.booked" class="shrink-0 rounded-full border border-bonus/40 bg-bonus/15 px-2.5 py-1 text-[11px] font-extrabold text-bonus">✓ {{ hotel.bookedLabel }}</span>
        </div>
        <p class="text-sm text-muted mt-1">{{ hotel.address }}</p>
      </div>
    </div>

    <!-- facts -->
    <div class="grid grid-cols-2 gap-2">
      <div v-for="f in facts" :key="f.k" class="rounded-xl2 border border-line bg-card2 px-3 py-2.5">
        <div class="text-[10px] font-extrabold uppercase text-faint">{{ f.k }}</div>
        <div class="text-sm text-ink/90 mt-0.5">{{ f.v }}</div>
      </div>
    </div>

    <!-- actions -->
    <div class="space-y-2">
      <button type="button" class="w-full flex items-center justify-between rounded-xl2 border border-nav/30 bg-nav/10 px-4 py-3.5 font-bold text-sm tap" @click="openExternal(mapsSearch(hotel.mapsQuery))">
        <span>🧭 Navigeren</span><span class="text-nav text-xs font-extrabold">Maps →</span>
      </button>
      <button type="button" class="w-full flex items-center justify-between rounded-xl2 border border-line bg-card2 px-4 py-3.5 font-bold text-sm tap" @click="openExternal(mapsSearch(hotel.mapsQuery))">
        <span>📞 Adres &amp; telefoon</span><span class="text-nav text-xs font-extrabold">Maps →</span>
      </button>
      <button v-if="hotel.website" type="button" class="w-full flex items-center justify-between rounded-xl2 border border-line bg-card2 px-4 py-3.5 font-bold text-sm tap" @click="openExternal(gsearch(hotel.website + ' officiële website'))">
        <span>🌐 Website</span><span class="text-bronze text-xs font-extrabold">Zoek →</span>
      </button>
      <button v-if="hotel.bookingQuery" type="button" class="w-full flex items-center justify-between rounded-xl2 border border-line bg-card2 px-4 py-3.5 font-bold text-sm tap" @click="openExternal(bookingSearch(hotel.bookingQuery))">
        <span>🛏️ Booking</span><span class="text-bronze text-xs font-extrabold">Open →</span>
      </button>
    </div>

    <!-- personal notes -->
    <div class="card p-4">
      <div class="text-xs font-extrabold uppercase tracking-wide text-faint mb-2">Persoonlijke notities</div>
      <textarea v-model="note" rows="3" placeholder="Kamernummer, wachtwoord wifi, bijzonderheden…"
        class="w-full resize-none rounded-lg bg-card2 border border-line px-3 py-2 text-sm text-ink placeholder:text-faint focus:outline-none focus:border-bronze-deep" />
    </div>
  </div>
</template>
