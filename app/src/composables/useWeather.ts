import { ref, watchEffect, unref, type Ref } from 'vue'
import type { LatLng } from '@/types/trip'

/**
 * Live daily forecast via Open-Meteo (no API key, CORS-friendly).
 * Fully offline-degrading: on any failure the caller falls back to the static
 * trip text. Results are cached in localStorage (3h TTL) so a fix taken while
 * online survives going into a tunnel or a dead zone.
 */
export interface DailyWeather {
  code: number
  emoji: string
  text: string        // short NL description
  tMax: number
  tMin: number
  precipProb: number   // max precipitation probability, %
}

const CACHE_TTL = 3 * 60 * 60 * 1000 // 3h
const cacheKey = (lat: number, lon: number, date: string) =>
  `wx:${lat.toFixed(2)},${lon.toFixed(2)}:${date}`

/** WMO weather code -> emoji + Dutch label. */
function describe(code: number): { emoji: string; text: string } {
  if (code === 0) return { emoji: '☀️', text: 'helder' }
  if (code === 1) return { emoji: '🌤️', text: 'overwegend zonnig' }
  if (code === 2) return { emoji: '⛅', text: 'half bewolkt' }
  if (code === 3) return { emoji: '☁️', text: 'bewolkt' }
  if (code === 45 || code === 48) return { emoji: '🌫️', text: 'mist' }
  if (code >= 51 && code <= 55) return { emoji: '🌦️', text: 'motregen' }
  if (code === 56 || code === 57) return { emoji: '🌧️', text: 'ijzel' }
  if (code >= 61 && code <= 65) return { emoji: '🌧️', text: 'regen' }
  if (code === 66 || code === 67) return { emoji: '🌧️', text: 'ijzel' }
  if (code >= 71 && code <= 75) return { emoji: '🌨️', text: 'sneeuw' }
  if (code === 77) return { emoji: '🌨️', text: 'sneeuwkorrels' }
  if (code >= 80 && code <= 82) return { emoji: '🌦️', text: 'buien' }
  if (code === 85 || code === 86) return { emoji: '🌨️', text: 'sneeuwbuien' }
  if (code === 95) return { emoji: '⛈️', text: 'onweer' }
  if (code === 96 || code === 99) return { emoji: '⛈️', text: 'onweer met hagel' }
  return { emoji: '🌡️', text: 'wisselend' }
}

/** Meaningful precipitation for driving-advice purposes (rain/snow/thunder or high chance). */
export function isBadWeather(w: DailyWeather | null): boolean {
  if (!w) return false
  return w.code >= 51 || w.precipProb >= 60
}

async function fetchDaily(coord: LatLng, date: string): Promise<DailyWeather | null> {
  const [lat, lon] = coord
  const key = cacheKey(lat, lon, date)
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const { t, v } = JSON.parse(raw)
      if (Date.now() - t < CACHE_TTL) return v as DailyWeather
    }
  } catch { /* ignore cache read errors */ }

  try {
    const u =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&timezone=auto&start_date=${date}&end_date=${date}`
    const r = await fetch(u)
    if (!r.ok) return null
    const j = await r.json()
    const d = j?.daily
    if (!d?.time?.length) return null
    const code = d.weather_code[0]
    const { emoji, text } = describe(code)
    const v: DailyWeather = {
      code,
      emoji,
      text,
      tMax: Math.round(d.temperature_2m_max[0]),
      tMin: Math.round(d.temperature_2m_min[0]),
      precipProb: d.precipitation_probability_max?.[0] ?? 0
    }
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), v })) } catch { /* quota */ }
    return v
  } catch {
    return null // offline or blocked -> caller degrades to static text
  }
}

/** Reactive wrapper: refetches when coord or date changes. */
export function useWeather(coord: Ref<LatLng | null> | LatLng | null, date: Ref<string> | string) {
  const weather = ref<DailyWeather | null>(null)
  const loading = ref(false)

  watchEffect(async () => {
    const c = unref(coord)
    const dt = unref(date)
    weather.value = null
    if (!c || !dt) return
    loading.value = true
    weather.value = await fetchDaily(c, dt)
    loading.value = false
  })

  return { weather, loading }
}
