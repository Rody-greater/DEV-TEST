import { computed, type Ref } from 'vue'
import type { Day, PlanningStop } from '@/types/trip'
import { useUserStore } from '@/stores/user'
import { toMinutes, fromMinutes, humanDuration } from '@/utils/time'

export type CaptainLevel = 'green' | 'orange' | 'red' | 'none'

export interface StopPlan extends PlanningStop {
  included: boolean
  reason: 'ok' | 'skip-advice' | 'user-skip'
}

export interface CaptainResult {
  level: CaptainLevel
  headline: string
  detail: string
  departure: string | null
  eta: string | null            // verwachte aankomst hotel
  target: string | null         // gewenste aankomst
  slackMin: number | null       // + = ruim, - = achter
  driveMin: number
  dwellMin: number
  stops: StopPlan[]
  appointment: { label: string; time: string; leaveBy: string } | null
}

/**
 * Road Captain — rekent op basis van de werkelijke vertrektijd:
 *  verwachte aankomst, speling en welke (bonus)stops beter geskipt kunnen worden.
 */
export function useRoadCaptain(day: Ref<Day>) {
  const user = useUserStore()

  const result = computed<CaptainResult>(() => {
    const p = day.value.planning
    if (!p) {
      return { level: 'none', headline: '', detail: '', departure: null, eta: null, target: null,
        slackMin: null, driveMin: 0, dwellMin: 0, stops: [], appointment: null }
    }

    const departStr = user.departureOf(day.value.id) || p.departDefault
    const departMin = toMinutes(departStr) ?? 0
    const targetMin = toMinutes(p.appointment ? subtract(p.appointment.time, p.buffer) : p.targetArrival)

    // Base plan: everything the user hasn't explicitly skipped.
    const base = p.stops.map<StopPlan>(s => ({
      ...s,
      included: !user.skips[s.id],
      reason: user.skips[s.id] ? 'user-skip' : 'ok'
    }))

    const dwellOf = (list: StopPlan[]) => list.filter(s => s.included).reduce((a, s) => a + s.dwellMin, 0)
    const finishOf = (list: StopPlan[]) => departMin + p.driveMin + dwellOf(list)

    let plan = base
    // If we can't make the target, drop optional stops (bonus first, then nice) until we fit.
    if (targetMin != null) {
      const droppable = () => plan
        .filter(s => s.included && s.optional && s.reason !== 'user-skip')
        .sort(rankOptional)
      while (finishOf(plan) > targetMin - p.buffer && droppable().length) {
        const victim = droppable()[0]
        plan = plan.map(s => s.id === victim.id ? { ...s, included: false, reason: 'skip-advice' } : s)
      }
    }

    const dwell = dwellOf(plan)
    const finish = finishOf(plan)
    const slack = targetMin != null ? targetMin - finish : null

    let level: CaptainLevel = 'green'
    let headline = 'Je loopt op schema'
    let detail = 'Je hebt ruim voldoende tijd voor alle geplande stops.'

    const advised = plan.filter(s => s.reason === 'skip-advice')
    if (slack != null) {
      if (slack < 0) {
        level = 'red'
        headline = `Je loopt ${humanDuration(-slack)} achter`
        detail = 'Sla bonusstops over om op tijd te komen.'
      } else if (slack < p.buffer) {
        level = 'orange'
        headline = 'Krap op schema'
        detail = `Nog ${humanDuration(slack)} speling — hou het tempo erin.`
      }
    }
    if (advised.length && level !== 'red') {
      level = 'orange'
      headline = 'Krap op schema'
      detail = `Sla ${advised.map(s => s.title).join(' en ')} over om ontspannen aan te komen.`
    } else if (advised.length && level === 'red') {
      detail = `Sla ${advised.map(s => s.title).join(' en ')} over om op tijd te komen.`
    }

    const appointment = p.appointment
      ? { label: p.appointment.label, time: p.appointment.time, leaveBy: fromMinutes((toMinutes(p.appointment.time) ?? 0)) }
      : null

    return {
      level, headline, detail,
      departure: departStr,
      eta: fromMinutes(finish),
      target: p.appointment ? p.appointment.time : p.targetArrival,
      slackMin: slack,
      driveMin: p.driveMin,
      dwellMin: dwell,
      stops: plan,
      appointment
    }
  })

  function setDeparture(time: string) { user.setDeparture(day.value.id, time) }
  function resetDeparture() {
    if (day.value.planning) user.setDeparture(day.value.id, day.value.planning.departDefault)
  }

  return { result, setDeparture, resetDeparture }
}

/* helpers */
function subtract(time: string, min: number): string {
  const t = toMinutes(time) ?? 0
  return fromMinutes(t - min)
}
// bonus before nice; longer dwell first (drop the biggest time-sink first)
function rankOptional(a: StopPlan, b: StopPlan): number {
  const w = (c: string) => (c === 'bonus' ? 0 : 1)
  if (w(a.category) !== w(b.category)) return w(a.category) - w(b.category)
  return b.dwellMin - a.dwellMin
}
