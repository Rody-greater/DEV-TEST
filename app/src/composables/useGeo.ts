import { ref } from 'vue'
import type { LatLng } from '@/types/trip'

export interface GeoPosition { lat: number; lng: number; accuracy: number }

/**
 * HTML5 Geolocation — a single shared watch for the whole app (Home GPS toggle,
 * Road Captain proximity, Quick Actions). State lives at module scope so every
 * consumer sees the same position and there is only ever one prompt and one
 * watcher. Lifecycle follows user intent (enable/disable), NOT component mount:
 * navigating between pages no longer restarts or resets the GPS.
 *
 * Works fully offline (the device GPS needs no network) and degrades gracefully:
 * when unsupported or denied, everything else in the app keeps working manually.
 */
const supported = typeof navigator !== 'undefined' && 'geolocation' in navigator
const enabled = ref(false)
const position = ref<GeoPosition | null>(null)
const error = ref<string | null>(null)
let watchId: number | null = null

function enable() {
  if (!supported) return
  enabled.value = true
  error.value = null
  if (watchId != null) return // already watching — one shared watcher
  watchId = navigator.geolocation.watchPosition(
    p => { position.value = { lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }; error.value = null },
    e => {
      error.value = e.message
      // Only a hard permission denial turns GPS off; transient timeouts /
      // position-unavailable keep the watch alive so it can recover.
      if (e.code === e.PERMISSION_DENIED) disable()
    },
    { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
  )
}

function disable() {
  if (watchId != null) { navigator.geolocation.clearWatch(watchId); watchId = null }
  enabled.value = false
  position.value = null
}

export function useGeo() {
  return { supported, enabled, position, error, enable, disable }
}

/** Great-circle distance in meters between two coordinates. */
export function distanceM(a: LatLng | GeoPosition, b: LatLng): number {
  const lat1 = Array.isArray(a) ? a[0] : a.lat
  const lng1 = Array.isArray(a) ? a[1] : a.lng
  const [lat2, lng2] = b
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)))
}
