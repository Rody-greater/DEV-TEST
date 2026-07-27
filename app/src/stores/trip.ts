import { defineStore } from 'pinia'
import tripData from '@/data/trip.json'
import type { Trip, Day, Stop, Hotel } from '@/types/trip'

const trip = tripData as unknown as Trip

export const useTripStore = defineStore('trip', {
  state: () => ({ trip }),
  getters: {
    days: (s): Day[] => s.trip.days,
    meta: (s) => s.trip.meta,
    checklists: (s) => s.trip.checklists,
    dayById: (s) => (id: string): Day | undefined => s.trip.days.find(d => d.id === id),
    allStops: (s): Stop[] => s.trip.days.flatMap(d => d.stops),
    hotels: (s): Hotel[] => {
      const seen = new Set<string>()
      const out: Hotel[] = []
      s.trip.days.forEach(d => {
        if (d.hotel && !seen.has(d.hotel.id)) { seen.add(d.hotel.id); out.push(d.hotel) }
      })
      return out
    },
    stopById: (s) => (id: string): Stop | undefined => {
      for (const d of s.trip.days) { const f = d.stops.find(x => x.id === id); if (f) return f }
      return undefined
    }
  }
})
