import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { persistPlugin } from './stores/persist'
import 'leaflet/dist/leaflet.css'
import './assets/main.css'

const pinia = createPinia()
pinia.use(persistPlugin)

createApp(App).use(pinia).use(router).mount('#app')
