import { defineStore } from 'pinia'

export type StopStatus = 'pending' | 'arrived' | 'departed' | 'skipped'

interface UserState {
  checks: Record<string, boolean>        // stop-done + checklist items, keyed by id
  favorites: Record<string, boolean>     // stop favorites
  ratings: Record<string, number>        // stop id -> 1..5
  notes: Record<string, string>          // stop id / hotel id -> note
  departures: Record<string, string>     // day id -> actual departure HH:MM
  skips: Record<string, boolean>         // legacy planning skip (kept for compatibility)
  // Road Captain 2.0 — live progress
  stopStatus: Record<string, StopStatus> // stop id -> status
  stopArrived: Record<string, number>    // stop id -> arrival timestamp (ms)
  stopDeparted: Record<string, number>   // stop id -> departure timestamp (ms)
  geoEnabled: boolean                    // remembered GPS opt-in (permission stays granted by the browser)
  included: Record<string, boolean>      // RC 2.2 — optional/bonus stops added to today's active plan
}

export const useUserStore = defineStore('user', {
  persist: true,
  state: (): UserState => ({
    checks: {},
    favorites: {},
    ratings: {},
    notes: {},
    departures: {},
    skips: {},
    stopStatus: {},
    stopArrived: {},
    stopDeparted: {},
    geoEnabled: false,
    included: {}
  }),
  getters: {
    isChecked: (s) => (id: string) => !!s.checks[id],
    isFavorite: (s) => (id: string) => !!s.favorites[id],
    ratingOf: (s) => (id: string) => s.ratings[id] || 0,
    noteOf: (s) => (id: string) => s.notes[id] || '',
    departureOf: (s) => (id: string) => s.departures[id] || '',
    isIncluded: (s) => (id: string) => !!s.included[id],
    favoriteIds: (s) => Object.keys(s.favorites).filter(k => s.favorites[k]),
    checkedCount: (s) => Object.values(s.checks).filter(Boolean).length,
    statusOf: (s) => (id: string): StopStatus => s.stopStatus[id] || 'pending',
    arrivedAtOf: (s) => (id: string): number | null => s.stopArrived[id] ?? null,
    departedAtOf: (s) => (id: string): number | null => s.stopDeparted[id] ?? null
  },
  actions: {
    toggleCheck(id: string) { this.checks[id] = !this.checks[id] },
    setCheck(id: string, v: boolean) { this.checks[id] = v },
    toggleFavorite(id: string) { this.favorites[id] = !this.favorites[id] },
    setRating(id: string, n: number) { this.ratings[id] = n },
    setNote(id: string, text: string) { this.notes[id] = text },
    setDeparture(dayId: string, time: string) { this.departures[dayId] = time },
    toggleSkip(id: string) { this.skips[id] = !this.skips[id] },
    setGeoEnabled(v: boolean) { this.geoEnabled = v },
    setIncluded(id: string, v: boolean) { this.included[id] = v },
    toggleIncluded(id: string) { this.included[id] = !this.included[id] },

    /* ---- Road Captain 2.0 status transitions ---- */
    setStatus(id: string, status: StopStatus, at: number) {
      if (status === 'arrived') {
        this.stopStatus[id] = 'arrived'
        this.stopArrived[id] = at
        delete this.stopDeparted[id]
      } else if (status === 'departed') {
        if (this.stopArrived[id] == null) this.stopArrived[id] = at
        this.stopStatus[id] = 'departed'
        this.stopDeparted[id] = at
        this.checks[id] = true
      } else if (status === 'skipped') {
        this.stopStatus[id] = 'skipped'
        this.checks[id] = true
      } else {
        this.stopStatus[id] = 'pending'
        delete this.stopArrived[id]
        delete this.stopDeparted[id]
      }
    }
  }
})
