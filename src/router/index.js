import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import ChatBotPage from '@/pages/ChatBotPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import { setRouter, isTokenExpired, refreshAccessToken } from '@/utils/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: HomePage },
    { 
      path: '/chat-bot', 
      name: 'ChatBot', 
      component: ChatBotPage,
      meta: { requiresAuth: true } 
    },
    { path: '/login', name: 'Login', component: LoginPage }
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  }
})

// Set router instance to avoid circular dependency
setRouter(router)

// Navigation guard untuk proteksi halaman
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('access_token')
  const isAuthenticated = !!token

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // Redirect ke login jika mencoba mengakses halaman terproteksi tanpa token
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else {
      // Jika token kedaluwarsa, segarkan token terlebih dahulu
      if (isTokenExpired()) {
        const refreshedToken = await refreshAccessToken()
        if (refreshedToken) {
          next()
        } else {
          next({ name: 'Login', query: { redirect: to.fullPath } })
        }
      } else {
        next()
      }
    }
  } else if (to.name === 'Login' && isAuthenticated) {
    // Redirect ke home jika sudah login tapi mencoba ke halaman login
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router

