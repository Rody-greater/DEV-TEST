import { computed } from 'vue'
import type { Ref } from 'vue'
import { useTripStore } from '@/stores/trip'
import type { Day } from '@/types/trip'

function todayISO(now: Date): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

/**
 * Bepaalt op basis van 'nu' welke dag actief is, hoever de reis is,
 * en (bij afspraken) de countdown.
 */
export function useTripStatus(now: Ref<Date>) {
  const trip = useTripStore()

  const phase = computed<'before' | 'during' | 'after'>(() => {
    const t = todayISO(now.value)
    if (t < trip.meta.startDate) return 'before'
    if (t > trip.meta.endDate) return 'after'
    return 'during'
  })

  const activeDay = computed<Day>(() => {
    const t = todayISO(now.value)
    const match = trip.days.find(d => t >= d.date && t <= d.endDate)
    if (match) return match
    if (t < trip.meta.startDate) return trip.days[0]
    return trip.days[trip.days.length - 1]
  })

  const dayNumber = computed(() => activeDay.value.index + 1)
  const totalDays = computed(() => trip.days.length)

  const daysUntilStart = computed(() => {
    const start = new Date(trip.meta.startDate + 'T00:00:00')
    const t = new Date(todayISO(now.value) + 'T00:00:00')
    return Math.max(0, Math.round((start.getTime() - t.getTime()) / 86_400_000))
  })

  // Reisvoortgang op basis van verstreken dagen.
  const progressPct = computed(() => {
    if (phase.value === 'before') return 0
    if (phase.value === 'after') return 100
    return Math.round(((activeDay.value.index + 1) / totalDays.value) * 100)
  })

  return { phase, activeDay, dayNumber, totalDays, daysUntilStart, progressPct }
}
