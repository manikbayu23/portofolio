<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

// State untuk dark mode
const isDarkMode = ref(false)
const isScrolled = ref(false)

const navPositionClass = computed(() => isScrolled.value ? 'top-0' : 'top-4')

// State untuk mobile menu
const isMobileMenuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

// Toggle dark mode
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('darkMode', 'enabled')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('darkMode', 'disabled')
  }
}

// Toggle mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Close mobile menu when clicking on a link
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Inisialisasi AOS
onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode === 'enabled') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  } else if (savedDarkMode === 'disabled') {
    isDarkMode.value = false
    document.documentElement.classList.remove('dark')
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }

  // Inisialisasi AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: 'ease-in-out'
    })
  }

  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div :class="{ 'dark': isDarkMode }">
    <nav
      class="fixed inset-x-0 z-50 mx-2 md:mx-6 transition-all duration-300 ease-out rounded-3xl border backdrop-blur-xl"
      :class="[
        navPositionClass,
        isDarkMode
          ? 'bg-gray-950/80 border-gray-800/60 text-gray-100 shadow-2xl'
          : 'bg-white/80 border-white/70 text-gray-900 shadow-2xl'
      ]">
      <div class=" w-full px-4 md:px-6 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">Manik<span
            class="text-blue-600">Bayu</span></h1>

        <div class="flex items-center gap-4">
          <button @click="toggleDarkMode" class="p-2 rounded-lg transition"
            :class="isDarkMode ? 'bg-gray-800 text-gray-300 hover:text-blue-400' : 'bg-gray-100 text-gray-600 hover:text-blue-600'">
            <i v-if="!isDarkMode" class="fas fa-moon text-xl"></i>
            <i v-else class="fas fa-sun text-xl"></i>
          </button>

          <div class="space-x-6 hidden md:flex items-center">
            <RouterLink to="/" class="transition"
              :class="isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'">Home
            </RouterLink>
            <RouterLink to="/chat-bot" class="transition"
              :class="isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'">Chat Bot
            </RouterLink>
          </div>

          <button @click="toggleMobileMenu" class="md:hidden" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
            <i class="fas fa-bars text-2xl"></i>
          </button>

          <!-- Mobile: icon-only login -->
          <RouterLink to="/login"
            class="md:hidden ml-2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm">
            <i class="fas fa-sign-in-alt"></i>
          </RouterLink>

          <!-- Desktop: fancy login button -->
          <RouterLink to="/login"
            class="ml-2 hidden md:inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transform hover:-translate-y-0.5 transition shadow-lg">
            <i class="fas fa-sign-in-alt mr-2"></i> Login
          </RouterLink>
        </div>
      </div>

      <div v-show="isMobileMenuOpen" class="md:hidden pb-4 px-6 flex flex-col space-y-3 transition-colors duration-300"
        :class="isDarkMode ? 'bg-gray-900' : 'bg-white'">
        <RouterLink to="/" @click="closeMobileMenu" class="transition py-2 flex items-center gap-2"
          :class="isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'">Home
        </RouterLink>
        <RouterLink to="/chat-bot" @click="closeMobileMenu" class="transition py-2 flex items-center gap-2"
          :class="isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'">Chat Bot
        </RouterLink>
        <RouterLink to="/login" @click="closeMobileMenu" class="transition py-2 flex items-center gap-2"
          :class="isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'">
          <i class="fas fa-sign-in-alt"></i> Login
        </RouterLink>
      </div>
    </nav>

    <main>
      <RouterView v-slot="{ Component }">
        <component :is="Component" :isDarkMode="isDarkMode" />
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
* {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.hover-scale {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-scale:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #3b82f6;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #2563eb;
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark ::-webkit-scrollbar-thumb {
  background: #3b82f6;
}
</style>