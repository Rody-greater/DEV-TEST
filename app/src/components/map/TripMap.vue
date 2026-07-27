<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import L from 'leaflet'
import type { Day, LatLng } from '@/types/trip'
import { mapsAt, mapsSearch, openExternal } from '@/composables/useMaps'

const props = defineProps<{ days: Day[]; focus?: string | null }>()
const el = ref<HTMLDivElement | null>(null)
let map: L.Map | null = null

const catColor: Record<string, string> = {
  must: '#ff6a2b', nice: '#f5a623', bonus: '#2fa66d', pool: '#f5a623', hotel: '#c79a63'
}

function pin(color: string, emoji: string) {
  return L.divIcon({
    className: '',
    html: `<div class="map-pin" style="background:${color}"><span>${emoji}</span></div>`,
    iconSize: [30, 30], iconAnchor: [15, 28], popupAnchor: [0, -26]
  })
}

function popupHTML(title: string, sub: string, coord: LatLng, extraQuery?: string | null) {
  const nav = mapsAt(coord)
  const park = extraQuery ? mapsSearch(extraQuery) : null
  return `
    <div style="min-width:180px">
      <div style="font-weight:800;font-size:15px;margin-bottom:2px">${title}</div>
      <div style="color:#a4a4a2;font-size:12px;margin-bottom:8px">${sub}</div>
      <a href="${nav}" target="_blank" rel="noopener" style="display:block;text-align:center;background:#4f9cf0;color:#0b1220;font-weight:800;border-radius:10px;padding:8px;text-decoration:none;margin-bottom:6px">🧭 Navigeer</a>
      ${park ? `<a href="${park}" target="_blank" rel="noopener" style="display:block;text-align:center;background:#242426;color:#f5f5f4;font-weight:700;border-radius:10px;padding:8px;text-decoration:none">🚗 Parkeren</a>` : ''}
    </div>`
}

function build() {
  if (!el.value) return
  map = L.map(el.value, { zoomControl: true, attributionControl: true }).setView([47.2, 10.0], 6)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18, attribution: '&copy; OpenStreetMap'
  }).addTo(map)

  const bounds: L.LatLngExpression[] = []
  const route: L.LatLngExpression[] = []

  props.days.forEach(d => {
    d.stops.forEach(s => {
      if (!s.coord) return
      bounds.push(s.coord)
      L.marker(s.coord, { icon: pin(catColor[s.category] || '#c79a63', s.emoji) })
        .addTo(map!)
        .bindPopup(popupHTML(s.title, `${d.tabLabel} · ${s.time}`, s.coord, s.parking))
    })
    if (d.hotel?.coord) {
      bounds.push(d.hotel.coord)
      route.push(d.hotel.coord)
      L.marker(d.hotel.coord, { icon: pin(catColor.hotel, '🏨') })
        .addTo(map!)
        .bindPopup(popupHTML(d.hotel.name, `Hotel · ${d.tabLabel}`, d.hotel.coord, d.hotel.parking))
    }
  })

  // hotel-to-hotel spine (indicatief, geen route-berekening)
  if (route.length > 1) {
    L.polyline(route, { color: '#c79a63', weight: 3, opacity: 0.6, dashArray: '2 8' }).addTo(map)
  }

  if (bounds.length) map.fitBounds(L.latLngBounds(bounds).pad(0.15))
}

function focusOn(id: string) {
  const day = props.days.find(d => d.id === id)
  const c = day?.stops.find(s => s.coord)?.coord || day?.hotel?.coord
  if (c && map) map.setView(c, 11)
}

onMounted(() => { build(); if (props.focus) focusOn(props.focus) })
watch(() => props.focus, v => { if (v) focusOn(v) })
onBeforeUnmount(() => { map?.remove(); map = null })

// expose for external buttons (unused but handy)
defineExpose({ focusOn })

// silence unused import in some builds
void openExternal
</script>

<template>
  <div ref="el" class="w-full h-full rounded-xl2 overflow-hidden border border-line" />
</template>
