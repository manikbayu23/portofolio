<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

const props = defineProps({ isDarkMode: Boolean })
const router = useRouter()

const username = ref('')
const password = ref('')
const isLoggingIn = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  isLoggingIn.value = true
  errorMessage.value = ''
  
  try {
    const response = await fetch('https://n8n.mbwebcreations.my.id/webhook/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })

    if (!response.ok) {
      throw new Error('Terjadi kesalahan pada server atau kredensial tidak valid.')
    }

    const data = await response.json()
    
    if (data.success) {
      // Simpan credentials ke localStorage
      localStorage.setItem('user', JSON.stringify(data.data.user))
      localStorage.setItem('access_token', data.data.access_token)
      localStorage.setItem('refresh_token', data.data.refresh_token)
      
      // Redirect ke halaman sebelumnya (jika ada) atau beranda setelah login berhasil
      const redirectPath = router.currentRoute.value.query.redirect || '/'
      router.push(redirectPath)
    } else {
      errorMessage.value = data.message || 'Username atau password salah.'
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = error.message || 'Koneksi ke server gagal. Silakan coba lagi.'
  } finally {
    isLoggingIn.value = false
  }
}

onMounted(() => {
  gsap.from('.login-card', {
    scale: 0.9,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(1.4)'
  })
})
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center relative py-12 px-6">
    <!-- Glowing background elements -->
    <div class="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-500/10 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="login-card w-full max-w-md p-8 rounded-3xl border shadow-2xl transition-colors duration-500"
      :class="props.isDarkMode 
        ? 'bg-slate-900/60 border-slate-800 shadow-slate-950/80' 
        : 'bg-white border-slate-200 shadow-slate-200/40'">
      
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold tracking-tight" :class="props.isDarkMode ? 'text-white' : 'text-slate-900'">
          Selamat Datang
        </h2>
        <p class="text-xs mt-2" :class="props.isDarkMode ? 'text-slate-400' : 'text-slate-500'">
          Masuk untuk mengelola sistem portfolio
        </p>
      </div>

      <!-- Error Message Alert -->
      <div v-if="errorMessage" class="mb-5 p-4 rounded-xl border flex items-center gap-3 text-xs transition-all duration-300 animate-shake"
        :class="props.isDarkMode 
          ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
          : 'bg-rose-50 border-rose-200 text-rose-700'">
        <i class="fas fa-exclamation-circle text-base"></i>
        <div>
          <p class="font-bold">Login Gagal</p>
          <p class="opacity-90">{{ errorMessage }}</p>
        </div>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider mb-2" :class="props.isDarkMode ? 'text-slate-400' : 'text-slate-600'">Username</label>
          <input v-model="username" required type="text" placeholder="Masukkan username..."
            class="w-full text-sm px-4 py-3 rounded-xl border outline-none transition-all duration-300"
            :class="props.isDarkMode 
              ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-400' 
              : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-600'" />
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider mb-2" :class="props.isDarkMode ? 'text-slate-400' : 'text-slate-600'">Password</label>
          <input v-model="password" required type="password" placeholder="••••••••"
            class="w-full text-sm px-4 py-3 rounded-xl border outline-none transition-all duration-300"
            :class="props.isDarkMode 
              ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-400' 
              : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-600'" />
        </div>

        <button type="submit" :disabled="isLoggingIn"
          class="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
          <span v-if="isLoggingIn"><i class="fas fa-spinner animate-spin"></i> Loading...</span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <button @click="router.push('/')" class="text-xs font-medium text-blue-500 dark:text-cyan-400 hover:underline transition">
          <i class="fas fa-arrow-left mr-1"></i> Kembali ke Beranda
        </button>
      </div>

    </div>
  </div>
</template>
