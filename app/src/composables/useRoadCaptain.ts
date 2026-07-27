import { computed, type Ref } from 'vue'
import type { Day } from '@/types/trip'
import type { StopStatus } from '@/stores/user'
import { useUserStore } from '@/stores/user'
import { useNow } from '@/composables/useNow'
import { toMinutes, fromMinutes, humanDuration, nowMinutes, clockMinutes } from '@/utils/time'

/**
 * Road Captain status levels (thresholds are on the *slack* in minutes):
 *   > 60         green-plus  "Ruim op schema"
 *   30 – 60      green       "Op schema"
 *   15 – 30      yellow      "Let een beetje op de tijd"
 *    0 – 15      orange      "Krap op schema"
 *   < 0          red         "Achter op schema"
 * The status is derived purely from the slack, so a positive slack can never
 * read "Krap op schema" — status, slack and advice always stay consistent.
 */
export type CaptainLevel = 'green-plus' | 'green' | 'yellow' | 'orange' | 'red' | 'none'

export interface CaptainStop {
  id: string
  title: string
  category: string
  dwellMin: number
  optional: boolean
  status: StopStatus
  arrivedAt: number | null
  departedAt: number | null
  arrivalClock: string | null
  departureClock: string | null
  dwellSoFarMin: number | null   // running (arrived) or final (departed)
  included: boolean
  adviseSkip: boolean
}

export interface CaptainResult {
  mode: 'reference' | 'live'
  level: CaptainLevel
  label: string
  advice: string
  plannedDeparture: string
  actualDeparture: string | null
  actualArrival: string | null
  hotelEta: string | null
  targetTime: string | null
  slackMin: number | null
  remainingStops: number
  remainingDriveMin: number
  totalDriveMin: number
  appointment: { label: string; time: string } | null
  stops: CaptainStop[]
}

const LABEL: Record<CaptainLevel, string> = {
  'green-plus': 'Ruim op schema',
  green: 'Op schema',
  yellow: 'Let een beetje op de tijd',
  orange: 'Krap op schema',
  red: 'Achter op schema',
  none: ''
}

function levelFromSlack(slack: number | null): CaptainLevel {
  if (slack == null) return 'none'
  if (slack < 0) return 'red'
  if (slack < 15) return 'orange'
  if (slack < 30) return 'yellow'
  if (slack < 60) return 'green'
  return 'green-plus'
}

// Drop bonus before nice; within a tier drop the biggest time-sink first.
function rankOptional(a: CaptainStop, b: CaptainStop): number {
  const w = (c: string) => (c === 'bonus' ? 0 : 1)
  if (w(a.category) !== w(b.category)) return w(a.category) - w(b.category)
  return b.dwellMin - a.dwellMin
}

function empty(): CaptainResult {
  return {
    mode: 'reference', level: 'none', label: '', advice: '', plannedDeparture: '',
    actualDeparture: null, actualArrival: null, hotelEta: null, targetTime: null,
    slackMin: null, remainingStops: 0, remainingDriveMin: 0, totalDriveMin: 0,
    appointment: null, stops: []
  }
}

export function useRoadCaptain(day: Ref<Day>, nowRef?: Ref<Date>) {
  const user = useUserStore()
  const now = nowRef || useNow(1000)

  const result = computed<CaptainResult>(() => {
    const p = day.value.planning
    if (!p) return empty()

    const nowDate = now.value
    const nowMs = nowDate.getTime()

    // Build the ordered stop list enriched with live status.
    const stops: CaptainStop[] = p.stops.map(s => {
      const status = user.statusOf(s.id)
      const aAt = user.arrivedAtOf(s.id)
      const dAt = user.departedAtOf(s.id)
      let dwellSoFar: number | null = null
      if (status === 'departed' && aAt && dAt) dwellSoFar = (dAt - aAt) / 60000
      else if (status === 'arrived' && aAt) dwellSoFar = Math.max(0, (nowMs - aAt) / 60000)
      return {
        id: s.id, title: s.title, category: s.category, dwellMin: s.dwellMin, optional: s.optional,
        status, arrivedAt: aAt, departedAt: dAt,
        arrivalClock: aAt != null ? fromMinutes(clockMinutes(aAt)) : null,
        departureClock: dAt != null ? fromMinutes(clockMinutes(dAt)) : null,
        dwellSoFarMin: dwellSoFar, included: status !== 'skipped', adviseSkip: false
      }
    })

    const included = stops.filter(s => s.included)
    const liveActive = stops.some(s => s.status === 'arrived' || s.status === 'departed')

    // Target: for a fixed appointment it's (appointment − buffer); otherwise the planned
    // hotel arrival plus a soft margin, so a no-deadline day reads relaxed by default.
    const SOFT_MARGIN = 60
    const plannedArriveMin = toMinutes(p.targetArrival) ?? 0
    const targetMin = p.appointment
      ? (toMinutes(p.appointment.time) ?? 0) - p.buffer
      : plannedArriveMin + SOFT_MARGIN

    let finishMin: number
    let remainingDriveMin: number
    let remainingStops: number
    let actualDeparture: string | null = user.departureOf(day.value.id) || null
    let actualArrival: string | null = null

    if (!liveActive) {
      // ---- Reference scenario ----------------------------------------------------
      // Anchor the ETA to the authored planned-arrival time so the standard plan at the
      // default departure always has comfortable positive slack. Deviations then adjust it:
      //   • departing later than planned pushes the ETA out (delay),
      //   • skipping a planned stop pulls it back in (recovers its dwell time).
      // This keeps status, slack and advice consistent and never shows "Krap" with
      // positive slack at the default departure.
      const defaultMin = toMinutes(p.departDefault) ?? 0
      const departMin = toMinutes(user.departureOf(day.value.id) || p.departDefault) ?? defaultMin
      const delay = departMin - defaultMin
      const skippedDwell = stops.filter(s => s.status === 'skipped').reduce((a, s) => a + s.dwellMin, 0)
      finishMin = plannedArriveMin + delay - skippedDwell
      remainingDriveMin = p.driveMin
      remainingStops = included.length
    } else {
      // ---- Live scenario: compute the remaining time from "now" ----
      const legMin = p.driveMin / (included.length + 1)
      const arrived = included.find(s => s.status === 'arrived')
      let dwellPart = 0
      let drivePart = 0

      if (arrived) {
        dwellPart += Math.max(0, arrived.dwellMin - (arrived.dwellSoFarMin || 0))
        const idx = included.indexOf(arrived)
        for (let i = idx + 1; i < included.length; i++) {
          if (included[i].status === 'pending') { drivePart += legMin; dwellPart += included[i].dwellMin }
        }
        drivePart += legMin // final leg to hotel
      } else {
        const pend = included.filter(s => s.status === 'pending')
        pend.forEach(s => { drivePart += legMin; dwellPart += s.dwellMin })
        drivePart += legMin
      }

      finishMin = nowMinutes(nowDate) + dwellPart + drivePart
      remainingDriveMin = drivePart
      remainingStops = included.filter(s => s.status === 'pending' || s.status === 'arrived').length

      const lastArrived = [...stops].filter(s => s.arrivedAt != null).sort((a, b) => (b.arrivedAt! - a.arrivedAt!))[0]
      if (lastArrived) actualArrival = lastArrived.arrivalClock
      const firstDeparted = [...stops].filter(s => s.departedAt != null).sort((a, b) => (a.departedAt! - b.departedAt!))[0]
      if (!actualDeparture && firstDeparted) actualDeparture = firstDeparted.departureClock
    }

    const slack = targetMin != null ? Math.round(targetMin - finishMin) : null
    const level = levelFromSlack(slack)

    // Only compute skip advice when actually behind (red).
    const optionalIncluded = included.filter(s => s.optional && s.status !== 'departed')
    const skippedOptional = stops.filter(s => s.status === 'skipped')
    const victims: CaptainStop[] = []
    if (level === 'red' && slack != null) {
      let deficit = -slack
      for (const v of [...optionalIncluded].sort(rankOptional)) {
        if (deficit <= 0) break
        v.adviseSkip = true
        victims.push(v)
        deficit -= v.dwellMin
      }
    }

    const advice = buildAdvice(level, slack, optionalIncluded, skippedOptional, victims)

    return {
      mode: liveActive ? 'live' : 'reference',
      level, label: LABEL[level], advice,
      plannedDeparture: p.departDefault,
      actualDeparture, actualArrival,
      hotelEta: fromMinutes(finishMin),
      targetTime: p.appointment ? p.appointment.time : p.targetArrival,
      slackMin: slack, remainingStops,
      remainingDriveMin: Math.round(remainingDriveMin), totalDriveMin: p.driveMin,
      appointment: p.appointment, stops
    }
  })

  /* ---- actions ---- */
  function setDeparture(time: string) { user.setDeparture(day.value.id, time) }
  function resetDeparture() {
    if (day.value.planning) user.setDeparture(day.value.id, day.value.planning.departDefault)
  }
  function arrive(id: string) { user.setStatus(id, 'arrived', Date.now()) }
  function depart(id: string) { user.setStatus(id, 'departed', Date.now()) }
  function skip(id: string) { user.setStatus(id, 'skipped', Date.now()) }
  function resetStop(id: string) { user.setStatus(id, 'pending', Date.now()) }

  return { result, setDeparture, resetDeparture, arrive, depart, skip, resetStop }
}

/* ---- helpers ---- */
function buildAdvice(
  level: CaptainLevel, slack: number | null,
  optionalIncluded: CaptainStop[], skippedOptional: CaptainStop[], victims: CaptainStop[]
): string {
  switch (level) {
    case 'green-plus':
      if (skippedOptional.length) return `Je hebt ruim de tijd. Je kunt ${skippedOptional[0].title} nog toevoegen.`
      return 'Je hebt ruim voldoende tijd. Neem gerust een koffiestop.'
    case 'green':
      return slack != null ? `Je ligt op schema — nog ${humanDuration(slack)} speling.` : 'Je ligt op schema.'
    case 'yellow':
      return slack != null
        ? `Let een beetje op de tijd — nog ${humanDuration(slack)} speling. Hou je stops kort.`
        : 'Let een beetje op de tijd.'
    case 'orange': {
      if (optionalIncluded.length) {
        const big = [...optionalIncluded].sort((a, b) => b.dwellMin - a.dwellMin)[0]
        return `Krap op schema. Beperk ${big.title} tot 30 minuten.`
      }
      return 'Krap op schema. Vertrek zo snel mogelijk door.'
    }
    case 'red':
      if (victims.length) return `Je loopt ~${humanDuration(-(slack ?? 0))} achter. Sla ${victims.map(v => v.title).join(' en ')} over.`
      return `Je loopt ~${humanDuration(-(slack ?? 0))} achter. Kort je stops flink in.`
    default:
      return ''
  }
}
