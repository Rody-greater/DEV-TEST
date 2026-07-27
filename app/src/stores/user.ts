import { defineStore } from 'pinia'

interface UserState {
  checks: Record<string, boolean>        // stop-done + checklist items, keyed by id
  favorites: Record<string, boolean>     // stop favorites
  ratings: Record<string, number>        // stop id -> 1..5
  notes: Record<string, string>          // stop id / hotel id -> note
  departures: Record<string, string>     // day id -> actual departure HH:MM
  skips: Record<string, boolean>         // planning stop id -> user-forced skip
}

export const useUserStore = defineStore('user', {
  persist: true,
  state: (): UserState => ({
    checks: {},
    favorites: {},
    ratings: {},
    notes: {},
    departures: {},
    skips: {}
  }),
  getters: {
    isChecked: (s) => (id: string) => !!s.checks[id],
    isFavorite: (s) => (id: string) => !!s.favorites[id],
    ratingOf: (s) => (id: string) => s.ratings[id] || 0,
    noteOf: (s) => (id: string) => s.notes[id] || '',
    departureOf: (s) => (id: string) => s.departures[id] || '',
    favoriteIds: (s) => Object.keys(s.favorites).filter(k => s.favorites[k]),
    checkedCount: (s) => Object.values(s.checks).filter(Boolean).length
  },
  actions: {
    toggleCheck(id: string) { this.checks[id] = !this.checks[id] },
    setCheck(id: string, v: boolean) { this.checks[id] = v },
    toggleFavorite(id: string) { this.favorites[id] = !this.favorites[id] },
    setRating(id: string, n: number) { this.ratings[id] = n },
    setNote(id: string, text: string) { this.notes[id] = text },
    setDeparture(dayId: string, time: string) { this.departures[dayId] = time },
    toggleSkip(id: string) { this.skips[id] = !this.skips[id] }
  }
})
