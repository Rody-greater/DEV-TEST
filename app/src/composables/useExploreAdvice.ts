import { computed, type Ref } from 'vue'
import type { Stop, GuideHighlight, GuidePhotoSpot } from '@/types/trip'
import type { CaptainResult } from '@/composables/useRoadCaptain'
import { useUserStore } from '@/stores/user'

export type ExplorePace = 'relaxed' | 'normal' | 'compact' | 'skip-extra'

export interface ExploreAdvice {
  active: boolean
  pace: ExplorePace
  welcome: string
  timeLine: string
  elapsedLine: string | null
  essentials: GuideHighlight[]
  extras: GuideHighlight[]
  showExtras: boolean
  extrasNote: string | null
  photoSpots: GuidePhotoSpot[]
  food: string[]
  practical: string[]
  walkingTime: string | null
  captainTip: string
  suggestedStayMin: number
  elapsedMin: number
  remainingHereMin: number
  hardDeadline: string | null
  planNote: string | null
}

const round5 = (n: number) => Math.max(5, Math.round(n / 5) * 5)

/**
 * Explore Mode advies. Gebruikt uitsluitend de gedeelde Road-Captain-uitkomst
 * (speling, hotel-ETA, afspraak) als tijdsbron — geen eigen tijdsberekening.
 * Toon is altijd vakantiegericht: kiezen wat prettig haalbaar is, nooit opjagen.
 */
export function useExploreAdvice(stop: Ref<Stop>, captain: Ref<CaptainResult>, now: Ref<Date>) {
  const user = useUserStore()

  const advice = computed<ExploreAdvice>(() => {
    const guide = stop.value.guide
    const status = user.statusOf(stop.value.id)
    if (!guide || status !== 'arrived') {
      return emptyAdvice()
    }

    // Pace follows the ESSENTIALS floor (core of the day), never the extras — so a
    // non-active optional/bonus can never make Explore read "achter".
    const slack = captain.value.coreSlackMin ?? captain.value.slackMin
    const pace: ExplorePace =
      slack == null || slack >= 45 ? 'relaxed'
        : slack >= 15 ? 'normal'
          : slack >= 0 ? 'compact'
            : 'skip-extra'

    const essentials = guide.highlights.filter(h => h.priority === 'essential')
    const extras = guide.highlights.filter(h => h.priority === 'nice-to-have')
    const essTime = essentials.reduce((a, h) => a + (h.estimatedMinutes || 10), 0) || guide.recommendedStayMinutes

    const suggested =
      pace === 'relaxed' ? (guide.relaxedStayMinutes || guide.recommendedStayMinutes)
        : pace === 'normal' ? guide.recommendedStayMinutes
          : pace === 'compact' ? Math.min(guide.recommendedStayMinutes, Math.max(essTime, 15))
            : essTime
    const suggestedStayMin = round5(suggested)

    const arrivedAt = user.arrivedAtOf(stop.value.id)
    const elapsedMin = arrivedAt != null ? Math.max(0, (now.value.getTime() - arrivedAt) / 60000) : 0
    const remainingHereMin = Math.round(suggestedStayMin - elapsedMin)

    const showExtras = pace === 'relaxed' || pace === 'normal'
    const extrasNote = extras.length && !showExtras
      ? (pace === 'compact'
        ? 'Als er tijd over is, leuk meegenomen — het hoeft niet.'
        : 'Bewaar deze gerust voor een volgende keer; vandaag doen we rustig de kern.')
      : null

    const inTime = captain.value.appointment ? ` voor het ${captain.value.appointment.label.toLowerCase()}` : ''
    const timeLine = {
      relaxed: `Je hebt hier rustig de tijd — zo'n ${suggestedStayMin} minuten. Geniet ervan.`,
      normal: `Je hebt hier zo'n ${suggestedStayMin} minuten${inTime ? ', ruim op tijd' + inTime : ''}. Genoeg voor de highlights.`,
      compact: `Je hebt hier ongeveer ${suggestedStayMin} minuten. Pak op je gemak de belangrijkste plekken.`,
      'skip-extra': `Je hebt hier wat minder tijd. Doe rustig het belangrijkste — de rest bewaren we voor later.`
    }[pace]

    const lastEss = essentials[essentials.length - 1]?.title
    const firstExtra = extras[0]?.title
    let elapsedLine: string | null = null
    if (elapsedMin >= 1) {
      const e = Math.round(elapsedMin)
      if (remainingHereMin > 12) {
        elapsedLine = `Je bent hier ${e} min. Nog rustig tijd${firstExtra ? ` — ook ${firstExtra.toLowerCase()} kan er nog bij` : ' om even rond te lopen'}.`
      } else if (remainingHereMin >= 0) {
        elapsedLine = `Je bent hier ${e} min.${lastEss ? ` Rond rustig af na ${lastEss.toLowerCase()}.` : ' Rond rustig af wanneer je er klaar voor bent.'}`
      } else {
        elapsedLine = `Je bent hier ${e} min. Neem nog een rustig moment en rijd verder wanneer je er klaar voor bent.`
      }
    }

    // The only place a firm tone is allowed: a hard appointment truly at risk
    // (based on the active plan, not the essentials floor).
    let hardDeadline: string | null = null
    const activeSlack = captain.value.slackMin
    if (captain.value.appointment && activeSlack != null && activeSlack < 0) {
      const leaveIn = Math.max(5, Math.round(suggestedStayMin - elapsedMin))
      hardDeadline = `Om op tijd te zijn${inTime} (${captain.value.appointment.time}) kun je hier het best binnen ~${leaveIn} min afronden.`
    }

    // Priority-aware plan note — extras framed as opportunities, never as a miss.
    let planNote: string | null = null
    const core = captain.value.coreSlackMin
    if (core != null && core >= 15) {
      if (captain.value.optionalPossible > 0) planNote = 'Je kernplanning ligt goed — een optionele stop past daarna comfortabel.'
      else if (captain.value.bonusPossible > 0) planNote = 'Je ligt goed op tijd; zelfs een bonusstop past er vandaag nog bij.'
      else planNote = 'Je kernplanning ligt goed. Neem hier rustig de tijd.'
    }

    return {
      active: true, pace,
      welcome: `Welkom in ${cleanTitle(stop.value.title)}`,
      timeLine, elapsedLine,
      essentials, extras, showExtras, extrasNote,
      photoSpots: guide.photoSpots || [],
      food: guide.food || [],
      practical: guide.practical || [],
      walkingTime: guide.walkingTime || null,
      captainTip: guide.captainTip,
      suggestedStayMin, elapsedMin: Math.round(elapsedMin), remainingHereMin,
      hardDeadline, planNote
    }
  })

  return { advice }
}

function cleanTitle(t: string): string {
  return t.split(/ — | \/ | \(/)[0].trim()
}

function emptyAdvice(): ExploreAdvice {
  return {
    active: false, pace: 'normal', welcome: '', timeLine: '', elapsedLine: null, planNote: null,
    essentials: [], extras: [], showExtras: false, extrasNote: null, photoSpots: [],
    food: [], practical: [], walkingTime: null, captainTip: '',
    suggestedStayMin: 0, elapsedMin: 0, remainingHereMin: 0, hardDeadline: null
  }
}
