import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

// Hash history keeps the app working when statically hosted from any sub-path
// (and when opened straight from the filesystem).
const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue'), meta: { title: 'Home' } },
  { path: '/days', name: 'days', component: () => import('@/views/DaysView.vue'), meta: { title: 'Reisdagen' } },
  { path: '/day/:id', name: 'day', component: () => import('@/views/DayView.vue'), meta: { title: 'Dag' } },
  { path: '/map', name: 'map', component: () => import('@/views/MapView.vue'), meta: { title: 'Kaart' } },
  { path: '/hotels', name: 'hotels', component: () => import('@/views/HotelsView.vue'), meta: { title: 'Hotels' } },
  { path: '/hotel/:id', name: 'hotel', component: () => import('@/views/HotelView.vue'), meta: { title: 'Hotel' } },
  { path: '/leitlhof', name: 'leitlhof', component: () => import('@/views/LeitlhofView.vue'), meta: { title: 'Leitlhof' } },
  { path: '/checklists', name: 'checklists', component: () => import('@/views/ChecklistsView.vue'), meta: { title: 'Checklists' } },
  { path: '/favorites', name: 'favorites', component: () => import('@/views/FavoritesView.vue'), meta: { title: 'Favorieten' } },
  { path: '/stats', name: 'stats', component: () => import('@/views/StatsView.vue'), meta: { title: 'Statistieken' } },
  { path: '/practical', name: 'practical', component: () => import('@/views/PracticalView.vue'), meta: { title: 'Praktisch' } },
  { path: '/more', name: 'more', component: () => import('@/views/MoreView.vue'), meta: { title: 'Meer' } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

export default router
