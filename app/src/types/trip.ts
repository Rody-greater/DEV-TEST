export type Category = 'must' | 'nice' | 'bonus' | 'pool'
export type LatLng = [number, number]

export interface Stop {
  id: string
  title: string
  emoji: string
  category: Category
  stars: number
  time: string
  dwellMin: number
  best: string | null
  weather: string | null
  warning: string | null
  desc: string
  tip: string | null
  nav: string
  parking: string | null
  photo: string | null
  special: string | null
  coord: LatLng | null
}

export interface Hotel {
  id: string
  name: string
  booked: boolean
  bookedLabel: string
  address: string
  mapsQuery: string
  website: string | null
  bookingQuery: string | null
  checkin: string
  parking: string
  ev: string
  restaurant: string
  wellness: string
  coord: LatLng | null
}

export interface Wellness {
  ritualTime: string
  spa: string
  pool: string
  sauna: string
  textileFree: string
  massage: string
}

export interface TimelineItem { time: string; title: string; note: string; cls: string }
export interface Linkish { t: string; q: string }
export interface Route { origin: string; dest: string; epic: string[] }
export interface DepartAdvice { time: string; text: string }

export interface PlanningStop {
  id: string
  title: string
  category: Category
  dwellMin: number
  optional: boolean
}
export interface Planning {
  departDefault: string
  targetArrival: string | null
  driveMin: number
  buffer: number
  appointment: { label: string; time: string } | null
  stops: PlanningStop[]
}

export interface Day {
  id: string
  index: number
  tabNumber: string
  tabLabel: string
  date: string
  endDate: string
  isPool: boolean
  isEpic: boolean
  eyebrow: string
  title: string
  subtitle: string
  poolIntro: string | null
  km: string
  drive: string
  driveComfort: string | null
  driveEpic: string | null
  depart: string
  arrive: string
  weather: string | null
  badWeather: string | null
  advice: string | null
  departAdvice: DepartAdvice | null
  route: Route | null
  timeline: TimelineItem[] | null
  wellness: Wellness | null
  stops: Stop[]
  restaurants: Linkish[]
  gopro: Linkish[]
  fotospots: Linkish[]
  fuel: string | null
  hotel: Hotel | null
  planning: Planning | null
}

export interface Checklist { id: string; icon: string; title: string; items: string[] }

export interface Trip {
  meta: { title: string; subtitle: string; startDate: string; endDate: string; car: string }
  days: Day[]
  checklists: Checklist[]
}
