import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// Register service worker to support push notifications (runs in both dev and prod)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => console.log('Service worker registered.'))
      .catch((error) => console.warn('Service worker registration failed:', error))
  })
}

