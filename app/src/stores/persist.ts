import type { PiniaPluginContext } from 'pinia'

/**
 * Lightweight persistence plugin.
 * Any store that sets `persist: true` in its options has its whole state
 * mirrored to LocalStorage (key: `roadtrip.<storeId>`) and hydrated on init.
 */
export function persistPlugin({ store, options }: PiniaPluginContext) {
  if (!(options as { persist?: boolean }).persist) return
  const key = `roadtrip.${store.$id}`

  try {
    const raw = localStorage.getItem(key)
    if (raw) store.$patch(JSON.parse(raw))
  } catch { /* ignore corrupt data */ }

  store.$subscribe((_mutation, state) => {
    try { localStorage.setItem(key, JSON.stringify(state)) } catch { /* quota / private mode */ }
  })
}
