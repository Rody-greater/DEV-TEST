import type { Route, LatLng } from '@/types/trip'

const enc = encodeURIComponent

/** Google Maps search on a real place name (never a placeholder). */
export function mapsSearch(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${enc(query)}`
}

/** Google Maps search on real coordinates. */
export function mapsAt(coord: LatLng): string {
  return `https://www.google.com/maps/search/?api=1&query=${coord[0]},${coord[1]}`
}

/** Google Maps directions with optional waypoints. */
export function mapsDir(origin: string, dest: string, waypoints: string[] = []): string {
  let u = `https://www.google.com/maps/dir/?api=1&origin=${enc(origin)}&destination=${enc(dest)}&travelmode=driving`
  if (waypoints.length) u += `&waypoints=${waypoints.map(enc).join('|')}`
  return u
}

export function routeComfort(r: Route): string { return mapsDir(r.origin, r.dest) }
export function routeEpic(r: Route): string { return mapsDir(r.origin, r.dest, r.epic) }

export function gsearch(q: string): string { return `https://www.google.com/search?q=${enc(q)}` }
export function bookingSearch(q: string): string { return `https://www.booking.com/searchresults.nl.html?ss=${enc(q)}` }

/** Open a URL in a new tab (Maps always opens externally, per spec). */
export function openExternal(url: string): void {
  window.open(url, '_blank', 'noopener')
}
