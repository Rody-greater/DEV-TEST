import { ref, onUnmounted } from 'vue'
import type { LatLng } from '@/types/trip'

export interface GeoPosition { lat: number; lng: number; accuracy: number }

/**
 * HTML5 Geolocation wrapper. Works fully offline (the device GPS needs no
 * network) and degrades gracefully: when unsupported or denied, everything
 * else in the app keeps working manually.
 */
export function useGeo() {
  const supported = typeof navigator !== 'undefined' && 'geolocation' in navigator
  const enabled = ref(false)
  const position = ref<GeoPosition | null>(null)
  const error = ref<string | null>(null)
  let watchId: number | null = null

  function enable() {
    if (!supported || watchId != null) return
    enabled.value = true
    error.value = null
    watchId = navigator.geolocation.watchPosition(
      p => { position.value = { lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }; error.value = null },
      e => { error.value = e.message; enabled.value = false },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    )
  }

  function disable() {
    if (watchId != null) { navigator.geolocation.clearWatch(watchId); watchId = null }
    enabled.value = false
    position.value = null
  }

  onUnmounted(disable)
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
