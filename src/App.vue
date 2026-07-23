<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import gsap from 'gsap'
import { clearAuth, scheduleTokenRefresh } from '@/utils/auth'
import baydiLogo from '@/images/baydi.png'
import ChatWidget from '@/components/ChatWidget.vue'

const isDarkMode = ref(true)
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const route = useRoute()
const router = useRouter()
const isLoggedIn = ref(false)
const isMiniChatOpen = ref(false)

const showBotButton = computed(() => {
  return isLoggedIn.value && route.path !== '/chat-bot'
})

const navLinks = computed(() => {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/chat-bot', label: 'Chat Bot' }
  ]
  if (isLoggedIn.value) {
    links.push({ to: '/notification-panel', label: 'Notification Test' })
  }
  return links
})

const checkLoginStatus = () => {
  isLoggedIn.value = !!localStorage.getItem('access_token')
}

// Watch rute berubah untuk memantau status login
watch(() => route.path, () => {
  checkLoginStatus()
  isMiniChatOpen.value = false
})

const handleLogout = () => {
  clearAuth()
  isLoggedIn.value = false
  closeMobileMenu()
  router.push('/')
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 30
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  localStorage.setItem('darkMode', isDarkMode.value ? 'enabled' : 'disabled')
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

onMounted(() => {
  const saved = localStorage.getItem('darkMode')
  if (saved === 'disabled') {
    isDarkMode.value = false
    document.documentElement.classList.remove('dark')
  } else {
    // Default dark
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }

  checkLoginStatus()
  scheduleTokenRefresh()
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })

  // Entrance animation
  gsap.fromTo('.nav-container',
    { y: -80, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.1 }
  )
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div :class="{ 'dark': isDarkMode }" class="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">

    <!-- ===== NAVBAR ===== -->
    <header class="fixed top-0 inset-x-0 z-50">
      <div class="nav-container mx-auto transition-all duration-500 ease-out"
        :class="[
          isScrolled
            ? 'max-w-4xl mt-3 px-4'
            : 'max-w-7xl mt-0 px-0'
        ]">
        <nav class="flex items-center justify-between px-6 py-3.5 border transition-all duration-500"
          :class="[
            isScrolled ? 'rounded-2xl shadow-2xl' : 'rounded-none border-x-0 border-t-0',
            isDarkMode
              ? 'bg-slate-950/85 backdrop-blur-xl border-slate-800/80 text-white'
              : 'bg-white/90 backdrop-blur-xl border-slate-200/80 text-slate-800'
          ]">

          <!-- Logo -->
          <RouterLink to="/" class="flex items-center gap-2.5 group select-none shrink-0">
            <img src="/icon-192.png" alt="MB Brand Logo" class="w-8 h-8 rounded-xl object-cover shadow-md" />
            <span class="text-base font-bold tracking-tight">
              Manik<span class="text-blue-500 dark:text-cyan-400">Bayu</span>
            </span>
          </RouterLink>

          <!-- Nav Links (Desktop) -->
          <div class="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <RouterLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              :class="[
                route.path === link.to
                  ? isDarkMode
                    ? 'bg-slate-800 text-cyan-400'
                    : 'bg-blue-50 text-blue-600'
                  : isDarkMode
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              ]">
              {{ link.label }}
            </RouterLink>
          </div>

          <!-- Actions (Desktop) -->
          <div class="flex items-center gap-2">
            <!-- Dark Mode Toggle -->
            <button @click="toggleDarkMode"
              class="p-2.5 rounded-xl border transition-all duration-300"
              :class="isDarkMode
                ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'">
              <i v-if="isDarkMode" class="fas fa-sun text-sm"></i>
              <i v-else class="fas fa-moon text-sm"></i>
            </button>

            <!-- Login / Logout Button (Desktop) -->
            <button v-if="isLoggedIn" @click="handleLogout"
              class="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.03] shadow-md border bg-slate-950 border-slate-800 text-rose-500 hover:bg-slate-900 hover:text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/20 cursor-pointer">
              <i class="fas fa-sign-out-alt text-xs"></i>
              Logout
            </button>
            <RouterLink v-else to="/login"
              class="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.03] shadow-md"
              :class="isDarkMode
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'">
              <i class="fas fa-sign-in-alt text-xs"></i>
              Login
            </RouterLink>

            <!-- Mobile Hamburger -->
            <button @click="toggleMobileMenu"
              class="md:hidden p-2.5 rounded-xl border transition-all"
              :class="isDarkMode ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'">
              <i class="fas text-sm" :class="isMobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
            </button>
          </div>

        </nav>

        <!-- Mobile Menu Dropdown -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2">
          <div v-if="isMobileMenuOpen"
            class="md:hidden mt-1 mx-0 p-4 rounded-2xl border shadow-xl space-y-1"
            :class="isDarkMode ? 'bg-slate-950/95 border-slate-800 text-white' : 'bg-white/98 border-slate-200 text-slate-800'">
            <RouterLink to="/" @click="closeMobileMenu"
              class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition"
              :class="isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'">
              <i class="fas fa-home w-4 text-center"></i> Home
            </RouterLink>
            <RouterLink to="/chat-bot" @click="closeMobileMenu"
              class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition"
              :class="isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'">
              <i class="fas fa-robot w-4 text-center"></i> Chat Bot
            </RouterLink>
            <RouterLink v-if="isLoggedIn" to="/notification-panel" @click="closeMobileMenu"
              class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition"
              :class="isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'">
              <i class="fas fa-bell w-4 text-center"></i> Notification Test
            </RouterLink>
            <button v-if="isLoggedIn" @click="handleLogout"
              class="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition text-rose-500 dark:text-rose-400 text-left hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
              <i class="fas fa-sign-out-alt w-4 text-center"></i> Logout
            </button>
            <RouterLink v-else to="/login" @click="closeMobileMenu"
              class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition text-blue-500 dark:text-cyan-400">
              <i class="fas fa-sign-in-alt w-4 text-center"></i> Login
            </RouterLink>
          </div>
        </Transition>
      </div>
    </header>

    <!-- Main Content -->
    <main class="pt-20">
      <RouterView v-slot="{ Component }">
        <component :is="Component" :isDarkMode="isDarkMode" />
      </RouterView>
    </main>

    <!-- Floating Chat Bot Button -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-10 scale-90"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-10 scale-90"
    >
      <div
        v-if="showBotButton"
        class="fixed bottom-6 right-6 z-40 animate-float-slow flex flex-col items-end gap-2"
      >
        <!-- Mini Chat Widget Popup -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div v-if="isMiniChatOpen" class="origin-bottom-right mb-2">
            <ChatWidget
              :isDarkMode="isDarkMode"
              :isMini="true"
              @close="isMiniChatOpen = false"
            />
          </div>
        </Transition>

        <!-- Toggle Button -->
        <button
          @click="isMiniChatOpen = !isMiniChatOpen"
          class="relative group flex items-center justify-center w-14 h-14 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Tanya Baydi"
        >
          <!-- Glowing aura ring -->
          <span class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-blue-500 opacity-40 blur-md group-hover:opacity-75 transition-opacity duration-300 animate-pulse"></span>
          
          <!-- Outer ring -->
          <span class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-cyan-400 dark:to-blue-400 opacity-20 group-hover:opacity-40 transition-opacity duration-300 animate-pulse-ring"></span>

          <!-- Main button circle -->
          <div class="relative w-12 h-12 rounded-full overflow-hidden border shadow-xl flex items-center justify-center transition-colors duration-500"
            :class="isDarkMode
              ? 'bg-slate-900 border-slate-800 shadow-slate-950/80 text-cyan-400'
              : 'bg-white border-slate-200 shadow-blue-500/15 text-blue-600'">
            <i v-if="isMiniChatOpen" class="fas fa-times text-lg"></i>
            <img v-else :src="baydiLogo" alt="Baydi" class="w-9 h-9 rounded-full object-cover" />
          </div>

          <!-- Tooltip (Only when closed) -->
          <span v-if="!isMiniChatOpen" class="absolute right-16 scale-0 origin-right transition-all duration-200 group-hover:scale-100 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shadow-md border"
            :class="isDarkMode
              ? 'bg-slate-900 border-slate-800 text-cyan-400'
              : 'bg-white border-slate-200 text-blue-600'">
            Tanya Baydi
          </span>
        </button>
      </div>
    </Transition>

  </div>
</template>

<style>
* {
  box-sizing: border-box;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}

@keyframes float-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

@keyframes pulse-ring {
  0%, 100% {
    transform: scale(0.95);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
}

.animate-float-slow {
  animation: float-slow 3s ease-in-out infinite;
}

.animate-pulse-ring {
  animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>