/** 'HH:MM' -> minutes since midnight (null on failure) */
export function toMinutes(hhmm: string | null | undefined): number | null {
  if (!hhmm) return null
  const m = hhmm.match(/(\d{1,2}):(\d{2})/)
  if (!m) return null
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10)
}

/** minutes since midnight -> 'HH:MM' (wraps at 24h) */
export function fromMinutes(min: number): string {
  const m = ((Math.round(min) % 1440) + 1440) % 1440
  const h = Math.floor(m / 60)
  const mm = m % 60
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

/** human duration: 95 -> '1 u 35', 40 -> '40 min' */
export function humanDuration(min: number): string {
  const m = Math.max(0, Math.round(min))
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  const mm = m % 60
  return mm ? `${h} u ${String(mm).padStart(2, '0')}` : `${h} u`
}

/** signed slack: +25 -> '25 min voor', -12 -> '12 min achter' */
export function humanSlack(min: number): string {
  const a = Math.abs(Math.round(min))
  return `${humanDuration(a)} ${min >= 0 ? 'speling' : 'achter'}`
}

/** Date -> minutes since midnight (with fractional seconds for live ticking). */
export function nowMinutes(d: Date): number {
  return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60
}

/** epoch ms -> minutes since midnight (whole minutes). */
export function clockMinutes(ms: number): number {
  const d = new Date(ms)
  return d.getHours() * 60 + d.getMinutes()
}

export function dutchDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })
}
