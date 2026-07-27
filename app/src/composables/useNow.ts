import { ref, onMounted, onUnmounted } from 'vue'

/** Reactive clock, ticks every `intervalMs` (default 30s). */
export function useNow(intervalMs = 30_000) {
  const now = ref(new Date())
  let timer: number | undefined
  onMounted(() => { timer = window.setInterval(() => { now.value = new Date() }, intervalMs) })
  onUnmounted(() => { if (timer) clearInterval(timer) })
  return now
}
