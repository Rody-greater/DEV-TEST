<script setup lang="ts">
import { ref } from 'vue'
import { mapsSearch, openExternal } from '@/composables/useMaps'
import { useGeo } from '@/composables/useGeo'
import { BoltIcon } from '@heroicons/vue/24/solid'

const geo = useGeo()

const open = ref(false)
const busy = ref(false)

interface QA { key: string; icon: string; label: string; term: string; fallback: string }
const actions: QA[] = [
  { key: 'here', icon: '📍', label: 'Ik ben hier', term: '', fallback: 'mijn locatie' },
  { key: 'food', icon: '🍝', label: 'Restaurant', term: 'restaurants', fallback: 'restaurant in de buurt' },
  { key: 'coffee', icon: '☕', label: 'Koffie', term: 'coffee', fallback: 'koffie in de buurt' },
  { key: 'fuel', icon: '⛽', label: 'Tankstation', term: 'tankstation', fallback: 'tankstation in de buurt' },
  { key: 'photo', icon: '📸', label: 'Fotospot', term: 'viewpoint', fallback: 'scenic viewpoint in de buurt' }
]

const query = (a: QA, coord: string) => mapsSearch(a.term ? `${a.term} near ${coord}` : coord)

function run(a: QA) {
  open.value = false

  // Fast path: the Home GPS toggle already has a live fix — open Maps synchronously
  // inside the tap gesture (no popup block, no blank-tab wait, no second prompt).
  const p = geo.position.value
  if (p) { openExternal(query(a, `${p.lat},${p.lng}`)); return }

  if (!navigator.geolocation) { openExternal(mapsSearch(a.fallback)); return }

  // Slow path: no shared fix yet. iOS Safari blocks window.open() from an async
  // callback, so open a blank tab NOW and redirect it once coordinates resolve.
  const tab = window.open('about:blank', '_blank')
  try { if (tab) tab.opener = null } catch { /* cross-origin after redirect */ }
  const go = (url: string) => { if (tab) tab.location.href = url; else openExternal(url) }
  busy.value = true
  navigator.geolocation.getCurrentPosition(
    pos => { busy.value = false; go(query(a, `${pos.coords.latitude},${pos.coords.longitude}`)) },
    () => { busy.value = false; go(mapsSearch(a.fallback)) },
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 }
  )
}
</script>

<template>
  <div class="fixed right-4 z-40 flex flex-col-reverse items-end gap-3" style="bottom: calc(84px + env(safe-area-inset-bottom))">
    <button
      type="button"
      class="w-14 h-14 rounded-full grid place-items-center shadow-card bg-gradient-to-br from-bronze to-bronze-deep tap transition-transform"
      :class="open ? 'rotate-45' : ''"
      aria-label="Snelacties"
      @click="open = !open"
    >
      <BoltIcon class="w-7 h-7 text-[#1a1206]" :class="busy ? 'animate-pulse' : ''" />
    </button>

    <Transition
      enter-active-class="transition duration-200 ease-premium" leave-active-class="transition duration-150"
      enter-from-class="opacity-0 translate-y-2" leave-to-class="opacity-0"
    >
      <div v-if="open" class="flex flex-col items-end gap-2">
        <button
          v-for="a in actions" :key="a.key" type="button"
          class="flex items-center gap-2.5 rounded-full border border-line bg-card/95 backdrop-blur px-4 py-2.5 font-bold text-sm shadow-soft tap animate-fadeUp"
          @click="run(a)"
        >
          <span class="text-lg">{{ a.icon }}</span>{{ a.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>
