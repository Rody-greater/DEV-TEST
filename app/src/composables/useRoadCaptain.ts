import { computed, type Ref } from 'vue'
import type { Day, StopPriority } from '@/types/trip'
import type { StopStatus } from '@/stores/user'
import { useUserStore } from '@/stores/user'
import { useNow } from '@/composables/useNow'
import { toMinutes, fromMinutes, humanDuration, clockMinutes } from '@/utils/time'

/**
 * Road Captain 2.2 — priority-aware planning.
 *
 * The core of the day (`essential` stops + hotel + hard appointment) decides the
 * status. `optional` and `bonus` stops are opportunities: they only count once the
 * user actively adds them, so they can never make a relaxed day read "krap/achter"
 * at the default departure.
 *
 * Status level from slack (minutes): >60 ruim · 30–60 op schema · 15–30 let op ·
 * 0–15 krap · <0 achter. The badge comes from the essentials floor (for an
 * appointment day it also degrades if active extras threaten the appointment).
 */
export type CaptainLevel = 'green-plus' | 'green' | 'yellow' | 'orange' | 'red' | 'none'

export interface CaptainStop {
  id: string
  title: string
  category: string
  priority: StopPriority
  dwellMin: number
  optional: boolean
  status: StopStatus
  arrivedAt: number | null
  departedAt: number | null
  arrivalClock: string | null
  departureClock: string | null
  dwellSoFarMin: number | null
  included: boolean          // part of today's active plan
  canAdd: boolean            // (non-included) adding it keeps the day feasible
  comfortable: boolean       // (non-included) adding it stays comfortable (>=15 slack)
  slackIfAdded: number | null
}

export interface ScenarioResult {
  hotelEta: string
  slackMinutes: number
  feasible: boolean
}
export interface PlanningScenario {
  essentialsOnly: ScenarioResult
  withOptionals: ScenarioResult
  withBonuses: ScenarioResult
}

export interface CaptainResult {
  mode: 'reference' | 'live'
  level: CaptainLevel        // badge — from the essentials floor
  label: string
  advice: string
  plannedDeparture: string
  actualDeparture: string | null
  actualArrival: string | null
  hotelEta: string | null    // active plan
  targetTime: string | null
  slackMin: number | null    // active plan
  coreSlackMin: number | null
  remainingStops: number
  coreRemaining: number
  optionalPossible: number
  bonusPossible: number
  extrasActive: boolean
  remainingDriveMin: number
  totalDriveMin: number
  appointment: { label: string; time: string } | null
  scenarios: PlanningScenario
  stops: CaptainStop[]
  hardDeadline: string | null
}

const LABEL: Record<CaptainLevel, string> = {
  'green-plus': 'Ruim op schema',
  green: 'Op schema',
  yellow: 'Let een beetje op de tijd',
  orange: 'Krap op schema',
  red: 'Achter op schema',
  none: ''
}
const SOFT_MARGIN = 120

function levelFromSlack(slack: number | null): CaptainLevel {
  if (slack == null) return 'none'
  if (slack < 0) return 'red'
  if (slack < 15) return 'orange'
  if (slack < 30) return 'yellow'
  if (slack < 60) return 'green'
  return 'green-plus'
}

const cleanTitle = (t: string) => t.split(/ — | \/ | \(/)[0].trim()

function empty(): CaptainResult {
  const s: ScenarioResult = { hotelEta: '', slackMinutes: 0, feasible: true }
  return {
    mode: 'reference', level: 'none', label: '', advice: '', plannedDeparture: '',
    actualDeparture: null, actualArrival: null, hotelEta: null, targetTime: null,
    slackMin: null, coreSlackMin: null, remainingStops: 0, coreRemaining: 0,
    optionalPossible: 0, bonusPossible: 0, extrasActive: false,
    remainingDriveMin: 0, totalDriveMin: 0, appointment: null,
    scenarios: { essentialsOnly: s, withOptionals: s, withBonuses: s }, stops: [], hardDeadline: null
  }
}

export function useRoadCaptain(day: Ref<Day>, nowRef?: Ref<Date>) {
  const user = useUserStore()
  const now = nowRef || useNow(1000)

  const result = computed<CaptainResult>(() => {
    const p = day.value.planning
    if (!p) return empty()

    const nowMs = now.value.getTime()
    const priorityOf = (id: string): StopPriority =>
      day.value.stops.find(x => x.id === id)?.priority ?? 'essential'

    // enrich
    const stops: CaptainStop[] = p.stops.map(s => {
      const priority = priorityOf(s.id)
      const status = user.statusOf(s.id)
      const aAt = user.arrivedAtOf(s.id)
      const dAt = user.departedAtOf(s.id)
      const visited = status === 'arrived' || status === 'departed'
      let dwellSoFar: number | null = null
      if (status === 'departed' && aAt && dAt) dwellSoFar = (dAt - aAt) / 60000
      else if (status === 'arrived' && aAt) dwellSoFar = Math.max(0, (nowMs - aAt) / 60000)
      const included = status === 'skipped' ? false
        : priority === 'essential' ? true
          : (visited || user.isIncluded(s.id))
      return {
        id: s.id, title: s.title, category: s.category, priority, dwellMin: s.dwellMin, optional: s.optional,
        status, arrivedAt: aAt, departedAt: dAt,
        arrivalClock: aAt != null ? fromMinutes(clockMinutes(aAt)) : null,
        departureClock: dAt != null ? fromMinutes(clockMinutes(dAt)) : null,
        dwellSoFarMin: dwellSoFar, included, canAdd: false, comfortable: false, slackIfAdded: null
      }
    })

    const visited = (s: CaptainStop) => s.status === 'arrived' || s.status === 'departed'
    const essentials = stops.filter(s => s.priority === 'essential')
    const essentialsDwellAll = essentials.reduce((a, s) => a + s.dwellMin, 0)

    const defaultMin = toMinutes(p.departDefault) ?? 0
    const departMin = toMinutes(user.departureOf(day.value.id) || p.departDefault) ?? defaultMin
    const departDelta = departMin - defaultMin
    const plannedArrive = toMinutes(p.targetArrival) ?? 0
    const isAppt = !!p.appointment

    // The essentials baseline finish at the default departure. For an appointment day we
    // trust the authored arrival time; otherwise we compute it honestly from drive + dwell.
    const essentialsBase = isAppt ? plannedArrive : (defaultMin + p.driveMin + essentialsDwellAll)
    const targetMin = isAppt ? ((toMinutes(p.appointment!.time) ?? 0) - p.buffer) : (essentialsBase + SOFT_MARGIN)

    const skippedEssDwell = essentials.filter(e => e.status === 'skipped').reduce((a, e) => a + e.dwellMin, 0)

    // Anchored-deviation model: start from the essentials baseline and adjust for real
    // deviations — later departure, skipped essentials, actively added extras, and time
    // spent beyond plan at visited stops. No fragile per-leg drive estimates.
    const lingerAdjust = (counts: (s: CaptainStop) => boolean) => {
      let a = 0
      for (const s of stops) {
        if (!counts(s)) continue
        if (s.status === 'departed' && s.arrivedAt && s.departedAt) a += ((s.departedAt - s.arrivedAt) / 60000) - s.dwellMin
        else if (s.status === 'arrived' && s.arrivedAt) a += Math.max(0, (nowMs - s.arrivedAt) / 60000 - s.dwellMin)
      }
      return a
    }
    const finishFor = (nonEss: (s: CaptainStop) => boolean) => {
      const counts = (s: CaptainStop) =>
        s.priority === 'essential' ? s.status !== 'skipped' : (s.status !== 'skipped' && nonEss(s))
      const extraDwell = stops
        .filter(s => s.priority !== 'essential' && s.status !== 'skipped' && nonEss(s))
        .reduce((a, s) => a + s.dwellMin, 0)
      return essentialsBase + departDelta - skippedEssDwell + extraDwell + lingerAdjust(counts)
    }

    const isVisited = (s: CaptainStop) => visited(s)
    const inActive = (s: CaptainStop) => visited(s) || user.isIncluded(s.id)
    const inOpt = (s: CaptainStop) => visited(s) || user.isIncluded(s.id) || s.priority === 'optional'
    const all = () => true

    const finishEss = finishFor(isVisited)
    const finishActive = finishFor(inActive)
    const finishOpt = finishFor(inOpt)
    const finishBonus = finishFor(all)

    const essSlack = Math.round(targetMin - finishEss)
    const activeSlack = Math.round(targetMin - finishActive)
    const optSlack = Math.round(targetMin - finishOpt)
    const bonusSlack = Math.round(targetMin - finishBonus)

    // Per-stop addability (for the Toevoegen / Uit planning halen buttons).
    let optionalPossible = 0
    let bonusPossible = 0
    stops.forEach(s => {
      if (s.priority === 'essential' || s.included || s.status === 'skipped') return
      const slackIfAdded = Math.round(targetMin - finishFor(x => inActive(x) || x.id === s.id))
      s.slackIfAdded = slackIfAdded
      s.canAdd = slackIfAdded >= 0
      s.comfortable = slackIfAdded >= 15
      if (s.priority === 'optional' && s.canAdd) optionalPossible++
      if (s.priority === 'bonus' && s.comfortable) bonusPossible++
    })

    // Badge: essentials floor. On an appointment day it also degrades if the active plan
    // (with added extras) puts the appointment at risk.
    const badgeSlack = isAppt ? Math.min(essSlack, activeSlack) : essSlack
    const level = levelFromSlack(badgeSlack)

    const extrasActive = stops.some(s => s.priority !== 'essential' && s.included)
    const overflow = extrasActive && activeSlack < 0
      ? stops.filter(s => s.priority !== 'essential' && s.included && !visited(s)).sort((a, b) => b.dwellMin - a.dwellMin)[0]
      : null

    const coreRemaining = essentials.filter(s => s.status !== 'skipped' && s.status !== 'departed').length
    const remainingStops = stops.filter(s => s.included && (s.status === 'pending' || s.status === 'arrived')).length
    const remainingDriveMin = Math.round(p.driveMin * (remainingStops + 1) / (Math.max(1, essentials.length) + 1))

    // live vs reference (for the "· live" label + actual times)
    const liveActive = stops.some(s => s.status === 'arrived' || s.status === 'departed')
    let actualDeparture: string | null = user.departureOf(day.value.id) || null
    let actualArrival: string | null = null
    if (liveActive) {
      const lastArrived = [...stops].filter(s => s.arrivedAt != null).sort((a, b) => b.arrivedAt! - a.arrivedAt!)[0]
      if (lastArrived) actualArrival = lastArrived.arrivalClock
      const firstDeparted = [...stops].filter(s => s.departedAt != null).sort((a, b) => a.departedAt! - b.departedAt!)[0]
      if (!actualDeparture && firstDeparted) actualDeparture = firstDeparted.departureClock
    }

    // Hard-deadline note: only when a booked appointment is genuinely at risk.
    const hardDeadline = isAppt && activeSlack < 0
      ? `Om op tijd te zijn voor het ${p.appointment!.label.toLowerCase()} (${p.appointment!.time}) zou ik de planning wat lichter maken.`
      : null

    const essNames = joinNames(essentials.filter(s => s.status !== 'skipped').map(s => cleanTitle(s.title)))
    const optionalOffer = stops.find(s => s.priority === 'optional' && !s.included && s.status !== 'skipped' && s.canAdd)
    const bonusOffer = stops.find(s => s.priority === 'bonus' && !s.included && s.status !== 'skipped' && s.comfortable)

    const advice = buildAdvice({
      essSlack, essLevel: levelFromSlack(essSlack), essNames,
      optionalOffer: optionalOffer ? cleanTitle(optionalOffer.title) : null,
      bonusOffer: (bonusOffer && essSlack >= 45) ? cleanTitle(bonusOffer.title) : null,
      overflow: overflow ? cleanTitle(overflow.title) : null,
      appointment: p.appointment, isAppt, activeSlack
    })

    const scen = (slack: number, finish: number): ScenarioResult =>
      ({ hotelEta: fromMinutes(finish), slackMinutes: slack, feasible: slack >= 0 })

    return {
      mode: liveActive ? 'live' : 'reference',
      level, label: LABEL[level], advice,
      plannedDeparture: p.departDefault, actualDeparture, actualArrival,
      hotelEta: fromMinutes(finishActive),
      targetTime: p.appointment ? p.appointment.time : p.targetArrival,
      slackMin: activeSlack, coreSlackMin: essSlack,
      remainingStops, coreRemaining, optionalPossible, bonusPossible, extrasActive,
      remainingDriveMin, totalDriveMin: p.driveMin,
      appointment: p.appointment,
      scenarios: {
        essentialsOnly: scen(essSlack, finishEss),
        withOptionals: scen(optSlack, finishOpt),
        withBonuses: scen(bonusSlack, finishBonus)
      },
      stops, hardDeadline
    }
  })

  /* ---- actions ---- */
  function setDeparture(time: string) { user.setDeparture(day.value.id, time) }
  function resetDeparture() { if (day.value.planning) user.setDeparture(day.value.id, day.value.planning.departDefault) }
  function arrive(id: string) { user.setStatus(id, 'arrived', Date.now()) }
  function depart(id: string) { user.setStatus(id, 'departed', Date.now()) }
  function skip(id: string) { user.setStatus(id, 'skipped', Date.now()) }
  function resetStop(id: string) { user.setStatus(id, 'pending', Date.now()) }
  function addStop(id: string) { user.setIncluded(id, true) }
  function removeStop(id: string) { user.setIncluded(id, false) }

  return { result, setDeparture, resetDeparture, arrive, depart, skip, resetStop, addStop, removeStop }
}

/* ---- helpers ---- */
function joinNames(names: string[]): string {
  const n = names.slice(0, 3)
  if (n.length <= 1) return n[0] || 'je kernstops'
  return n.slice(0, -1).join(', ') + ' en ' + n[n.length - 1]
}

interface AdviceCtx {
  essSlack: number
  essLevel: CaptainLevel
  essNames: string
  optionalOffer: string | null
  bonusOffer: string | null
  overflow: string | null
  appointment: { label: string; time: string } | null
  isAppt: boolean
  activeSlack: number
}

/**
 * Priority-aware, calm advice. Extras are framed as opportunities, never as things
 * you're behind on. "Krap/Achter" wording only when the core or a hard appointment
 * is genuinely at risk.
 */
function buildAdvice(c: AdviceCtx): string {
  const apptRisk = c.isAppt && c.activeSlack < 0
  const appt = c.appointment ? c.appointment.label.toLowerCase() : ''

  // Only truly-at-risk cases get a firm tone.
  if (c.essLevel === 'red' || apptRisk) {
    if (apptRisk && c.overflow) {
      return `${c.overflow} maakt het krap voor het ${appt}. Geen probleem — haal 'm gerust uit de planning, dan kom je ontspannen aan.`
    }
    const behind = humanDuration(Math.abs(c.isAppt ? Math.min(c.essSlack, c.activeSlack) : c.essSlack))
    return `Je kernstops worden zo'n ${behind} krap${c.isAppt ? ` voor het ${appt}` : ''}. Geen stress — iets eerder vertrekken of een stop korter houden lost het op.`
  }

  // Essentials comfortable → positive, opportunity-framed.
  let s: string
  if (c.essLevel === 'green-plus' || c.essLevel === 'green') {
    s = 'Je kernplanning ligt goed.'
    if (c.optionalOffer) s += ` ${c.optionalOffer} past waarschijnlijk ook nog.`
    else if (c.bonusOffer) s += ` Je hebt vandaag zelfs ruimte voor ${c.bonusOffer} als bonusstop.`
    else s += ' Neem rustig de tijd bij de stops.'
  } else if (c.essLevel === 'yellow') {
    s = `Houd het rustig bij ${c.essNames}.` + (c.optionalOffer ? ` ${c.optionalOffer} blijft optioneel.` : '')
  } else {
    s = `Geen probleem — focus vandaag op ${c.essNames}.`
  }
  if (c.overflow && !c.isAppt) s += ` ${c.overflow} erbij wordt wat vol — je zou 'm weer uit de planning kunnen halen.`
  return s
}
