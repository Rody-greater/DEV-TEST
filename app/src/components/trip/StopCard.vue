<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Stop } from '@/types/trip'
import type { CaptainStop } from '@/composables/useRoadCaptain'
import { useUserStore } from '@/stores/user'
import { mapsSearch, openExternal } from '@/composables/useMaps'
import Stars from '@/components/ui/Stars.vue'
import StopStatusControl from '@/components/trip/StopStatusControl.vue'
import {
  CheckIcon, ChevronDownIcon, HeartIcon as HeartOutline,
  MapPinIcon, CameraIcon, TruckIcon
} from '@heroicons/vue/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/vue/24/solid'

const props = defineProps<{ stop: Stop; plan?: CaptainStop | null }>()
const user = useUserStore()
const open = ref(false)

const priorityLabel = computed(() => ({ essential: '⭐ Kernstop', optional: '◇ Optioneel', bonus: '✨ Bonus' }[props.stop.priority]))
const priorityColor = computed(() => ({ essential: 'text-bronze', optional: 'text-nice', bonus: 'text-nav' }[props.stop.priority]))
const cleanName = computed(() => props.stop.title.split(/ — | \/ | \(/)[0].trim())
const included = computed(() => props.plan?.included ?? (props.stop.priority === 'essential'))
const canAdd = computed(() => props.stop.priority === 'bonus' ? !!props.plan?.comfortable : !!props.plan?.canAdd)
function toggleInclude() { user.setIncluded(props.stop.id, !user.isIncluded(props.stop.id)) }

const done = computed(() => user.isChecked(props.stop.id))
const status = computed(() => user.statusOf(props.stop.id))
const statusChip = computed(() => ({
  pending: null,
  arrived: { t: '🟢 Aangekomen', c: 'text-bonus' },
  departed: { t: '🚗 Vertrokken', c: 'text-nav' },
  skipped: { t: '⏭ Overgeslagen', c: 'text-[#f97316]' }
}[status.value]))
const fav = computed(() => user.isFavorite(props.stop.id))
const rating = computed(() => user.ratingOf(props.stop.id))
const note = computed({
  get: () => user.noteOf(props.stop.id),
  set: (v: string) => user.setNote(props.stop.id, v)
})

function go(q: string | null, fallback?: string) {
  openExternal(mapsSearch(q || fallback || props.stop.nav))
}

/* Height animation hooks for the accordion body */
function onEnter(el: Element) { (el as HTMLElement).style.height = el.scrollHeight + 'px' }
function onAfterEnter(el: Element) { (el as HTMLElement).style.height = 'auto' }
function onBeforeLeave(el: Element) { (el as HTMLElement).style.height = el.scrollHeight + 'px' }
function onLeave(el: Element) {
  const node = el as HTMLElement
  void node.offsetHeight // force reflow
  window.requestAnimationFrame(() => { node.style.height = '0px' })
}
</script>

<template>
  <div class="card overflow-hidden animate-fadeUp" :class="done ? 'border-bonus/50' : ''">
    <!-- summary row -->
    <div class="flex items-center gap-3 p-4">
      <button
        type="button"
        class="shrink-0 w-8 h-8 rounded-lg border-2 grid place-items-center tap"
        :class="done ? 'bg-done border-done' : 'border-faint bg-bg2'"
        :aria-pressed="done"
        aria-label="Afvinken"
        @click="user.toggleCheck(stop.id)"
      >
        <CheckIcon v-if="done" class="w-5 h-5 text-bg2" />
      </button>

      <button type="button" class="flex-1 min-w-0 text-left" @click="open = !open">
        <div class="flex items-center gap-2">
          <span class="text-xl leading-none">{{ stop.emoji }}</span>
          <span class="font-extrabold truncate">{{ stop.title }}</span>
        </div>
        <div class="mt-1 flex items-center gap-3 text-xs text-muted">
          <Stars :value="stop.stars" />
          <span>⏱ {{ stop.time }}</span>
          <span class="font-bold" :class="priorityColor">{{ priorityLabel }}</span>
          <span v-if="statusChip" class="font-bold" :class="statusChip.c">{{ statusChip.t }}</span>
        </div>
      </button>

      <button type="button" class="shrink-0 p-1 tap" :aria-pressed="fav" aria-label="Favoriet" @click="user.toggleFavorite(stop.id)">
        <HeartSolid v-if="fav" class="w-6 h-6 text-must" />
        <HeartOutline v-else class="w-6 h-6 text-faint" />
      </button>

      <button type="button" class="shrink-0 p-1 tap text-faint" aria-label="Uitklappen" @click="open = !open">
        <ChevronDownIcon class="w-5 h-5 transition-transform duration-300" :class="open ? 'rotate-180' : ''" />
      </button>
    </div>

    <!-- body -->
    <Transition @enter="onEnter" @after-enter="onAfterEnter" @before-leave="onBeforeLeave" @leave="onLeave">
      <div v-if="open" class="overflow-hidden transition-[height] duration-300 ease-premium" style="height:0">
        <div class="px-4 pb-4 space-y-3">
          <div v-if="stop.best || stop.weather" class="flex flex-wrap gap-2">
            <span v-if="stop.best" class="pill !text-nav !border-nav/40 !bg-nav/10">☀️ {{ stop.best }}</span>
            <span v-if="stop.weather" class="pill !text-nice !border-nice/40 !bg-nice/10">🌦️ {{ stop.weather }}</span>
          </div>

          <p class="text-sm leading-relaxed text-muted">{{ stop.desc }}</p>

          <div v-if="stop.tip" class="flex gap-2 rounded-xl2 border border-line bg-card2 px-3 py-2.5 text-sm text-ink/85">
            <b class="text-bronze whitespace-nowrap">Tip</b><span>{{ stop.tip }}</span>
          </div>
          <div v-if="stop.warning" class="rounded-xl2 border border-must/40 bg-must/10 px-3 py-2.5 text-sm text-must">
            ⚠️ {{ stop.warning }}
          </div>

          <!-- actions -->
          <div class="grid gap-2 sm:grid-cols-2">
            <button v-if="stop.special === 'p2'" type="button" class="col-span-full flex items-center justify-between rounded-xl2 border border-nav/40 bg-nav/10 px-4 py-3 font-bold text-sm tap"
              @click="go('Parcheggio P2 Lago di Braies Prags')">
              <span class="flex items-center gap-2"><MapPinIcon class="w-5 h-5 text-nav" /> Navigeer naar P2 · geboekt</span>
              <span class="text-nav text-xs font-extrabold">Maps →</span>
            </button>
            <button v-if="stop.parking" type="button" class="flex items-center justify-between rounded-xl2 border border-line bg-card2 px-4 py-3 font-bold text-sm tap" @click="go(stop.parking)">
              <span class="flex items-center gap-2"><TruckIcon class="w-5 h-5 text-muted" /> Parkeren</span><span class="text-nav text-xs font-extrabold">Maps →</span>
            </button>
            <button type="button" class="flex items-center justify-between rounded-xl2 border border-nav/30 bg-nav/10 px-4 py-3 font-bold text-sm tap" @click="go(stop.nav)">
              <span class="flex items-center gap-2"><MapPinIcon class="w-5 h-5 text-nav" /> Navigeer</span><span class="text-nav text-xs font-extrabold">Maps →</span>
            </button>
            <button v-if="stop.photo" type="button" class="flex items-center justify-between rounded-xl2 border border-line bg-card2 px-4 py-3 font-bold text-sm tap" @click="go(stop.photo)">
              <span class="flex items-center gap-2"><CameraIcon class="w-5 h-5 text-muted" /> Fotospot</span><span class="text-nav text-xs font-extrabold">Maps →</span>
            </button>
          </div>

          <!-- Road Captain 2.2: include optional/bonus in today's plan -->
          <div v-if="stop.priority !== 'essential' && status === 'pending'"
               class="rounded-xl2 border px-3 py-2.5"
               :class="included ? 'border-bonus/40 bg-bonus/5' : 'border-line bg-bg2/60'">
            <div class="flex items-center justify-between gap-2">
              <span class="text-sm">
                <template v-if="included">Staat in je planning voor vandaag.</template>
                <template v-else-if="canAdd">
                  <b :class="priorityColor">{{ stop.priority === 'bonus' ? '✨ Bonus mogelijk' : '◇ Optioneel' }}</b> —
                  {{ stop.priority === 'bonus' ? 'past comfortabel in je dag.' : 'past nog in je dag.' }}
                </template>
                <template v-else>{{ cleanName }} bewaren we voor een volgende keer.</template>
              </span>
              <button
                v-if="included || canAdd" type="button"
                class="shrink-0 rounded-lg px-3 py-1.5 text-xs font-extrabold tap"
                :class="included ? 'border border-line bg-card2 text-muted' : 'border border-bonus/50 bg-bonus/15 text-bonus'"
                @click="toggleInclude"
              >{{ included ? 'Uit planning halen' : '+ Toevoegen aan vandaag' }}</button>
            </div>
          </div>

          <!-- Road Captain: stop status + timers -->
          <div class="rounded-xl2 border border-line bg-bg2/60 p-3">
            <div class="text-xs font-bold text-faint uppercase tracking-wide mb-2">Status</div>
            <StopStatusControl :stop-id="stop.id" />
          </div>

          <!-- personal: rating + note -->
          <div class="rounded-xl2 border border-line bg-bg2/60 p-3 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-faint uppercase tracking-wide">Jouw beoordeling</span>
              <Stars :value="rating" interactive @set="user.setRating(stop.id, $event)" />
            </div>
            <textarea
              v-model="note" rows="2" placeholder="Notitie…"
              class="w-full resize-none rounded-lg bg-card2 border border-line px-3 py-2 text-sm text-ink placeholder:text-faint focus:outline-none focus:border-bronze-deep"
            />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
