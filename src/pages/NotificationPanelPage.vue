<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { apiFetch } from '@/utils/api'
import { getNotificationPermissionStatus, subscribeToPushNotifications } from '@/utils/push'

const props = defineProps({ isDarkMode: Boolean })

const permissionStatus = ref(getNotificationPermissionStatus())
const isServiceWorkerRegistered = ref(false)
const rawSubscription = ref(null)
const isLoading = ref(false)
const testTitle = ref('Uji Coba Notifikasi')
const testBody = ref('Halo Manik! Notifikasi ini berhasil terkirim melalui sistem PWA.')
const statusMessage = ref({ text: '', type: '' }) // type: 'success' | 'error'

const checkStatus = async () => {
  permissionStatus.value = getNotificationPermissionStatus()

  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    isServiceWorkerRegistered.value = registrations.length > 0

    if (isServiceWorkerRegistered.value) {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      rawSubscription.value = subscription ? JSON.stringify(subscription, null, 2) : null
    }
  }
}

const handleSubscribe = async () => {
  isLoading.value = true
  statusMessage.value = { text: '', type: '' }
  try {
    await subscribeToPushNotifications()
    await checkStatus()
    statusMessage.value = {
      text: 'Subskripsi berhasil dibuat dan didaftarkan ke server n8n!',
      type: 'success',
    }
  } catch (error) {
    console.error(error)
    statusMessage.value = { text: error.message || 'Gagal mendaftarkan subskripsi.', type: 'error' }
  } finally {
    isLoading.value = false
  }
}

const copySubscription = async () => {
  if (!rawSubscription.value) return
  try {
    await navigator.clipboard.writeText(rawSubscription.value)
    alert('Subscription JSON berhasil disalin!')
  } catch (err) {
    console.error('Failed to copy text:', err)
  }
}

// Simulasi notifikasi langsung dari browser lokal (tanpa server)
const triggerLocalNotification = () => {
  if (permissionStatus.value !== 'granted') {
    alert('Izin notifikasi belum diberikan. Harap aktifkan terlebih dahulu.')
    return
  }

  try {
    new Notification(testTitle.value, {
      body: testBody.value,
      icon: '/icon-192.png',
    })
  } catch (e) {
    console.error('Error showing direct notification:', e)
    alert('Gagal menampilkan notifikasi: ' + e.message)
  }
}

// Memicu pengiriman push notification dari server n8n
const triggerServerPushNotification = async () => {
  if (!rawSubscription.value) {
    alert('Klien Anda belum disubskripsikan. Silakan klik "Daftarkan Subskripsi" terlebih dahulu.')
    return
  }

  isLoading.value = true
  statusMessage.value = { text: '', type: '' }

  try {
    const parsedSub = JSON.parse(rawSubscription.value)
    const response = await apiFetch('https://n8n.mbwebcreations.my.id/webhook/push-test', {
      method: 'POST',
      body: JSON.stringify({
        subscription: parsedSub,
        title: testTitle.value,
        body: testBody.value,
      }),
    })

    if (response.ok) {
      statusMessage.value = {
        text: 'Perintah push dikirim ke n8n! Tunggu notifikasi muncul.',
        type: 'success',
      }
    } else {
      throw new Error(`Gagal mengirimkan perintah test push ke server. Status: ${response.status}`)
    }
  } catch (error) {
    console.error(error)
    statusMessage.value = {
      text: error.message || 'Gagal memicu push notification dari server.',
      type: 'error',
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  checkStatus()

  gsap.from('.panel-card', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
  })
})
</script>

<template>
  <div class="relative min-h-[85vh] py-12 px-6 overflow-hidden">
    <!-- Background lights -->
    <div
      class="absolute top-10 left-10 w-80 h-80 bg-blue-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"
    ></div>
    <div
      class="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/5 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none"
    ></div>

    <div class="container mx-auto max-w-4xl relative z-10">
      <div
        class="panel-card p-6 md:p-8 rounded-3xl border shadow-2xl transition-colors duration-500"
        :class="
          props.isDarkMode
            ? 'bg-slate-900/60 border-slate-800 shadow-slate-950/80'
            : 'bg-white border-slate-200 shadow-slate-200/40'
        "
      >
        <!-- Header -->
        <div
          class="border-b pb-6 mb-8"
          :class="props.isDarkMode ? 'border-slate-800' : 'border-slate-100'"
        >
          <h1
            class="text-2xl md:text-3xl font-extrabold tracking-tight"
            :class="props.isDarkMode ? 'text-white' : 'text-slate-900'"
          >
            📲 Panel Uji Coba PWA Push Notification
          </h1>
          <p class="text-xs mt-2" :class="props.isDarkMode ? 'text-slate-400' : 'text-slate-500'">
            Gunakan panel admin ini untuk mendiagnosis, menyalin data subskripsi, dan memicu
            notifikasi push dari server n8n.
          </p>
        </div>

        <!-- Status Diagnostics Grid -->
        <div class="grid gap-4 sm:grid-cols-3 mb-8">
          <!-- Service Worker -->
          <div
            class="p-4 rounded-2xl border flex flex-col justify-between"
            :class="
              props.isDarkMode
                ? 'bg-slate-950/40 border-slate-800'
                : 'bg-slate-50/50 border-slate-200'
            "
          >
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500"
              >Service Worker</span
            >
            <div class="flex items-center gap-2 mt-2">
              <span
                class="w-3 h-3 rounded-full animate-pulse"
                :class="isServiceWorkerRegistered ? 'bg-emerald-500' : 'bg-rose-500'"
              ></span>
              <span
                class="text-sm font-semibold"
                :class="props.isDarkMode ? 'text-white' : 'text-slate-900'"
              >
                {{ isServiceWorkerRegistered ? 'Terdaftar' : 'Tidak Aktif' }}
              </span>
            </div>
          </div>

          <!-- Browser Permission -->
          <div
            class="p-4 rounded-2xl border flex flex-col justify-between"
            :class="
              props.isDarkMode
                ? 'bg-slate-950/40 border-slate-800'
                : 'bg-slate-50/50 border-slate-200'
            "
          >
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500"
              >Izin Browser</span
            >
            <div class="flex items-center gap-2 mt-2">
              <span
                class="w-3 h-3 rounded-full animate-pulse"
                :class="
                  permissionStatus === 'granted'
                    ? 'bg-emerald-500'
                    : permissionStatus === 'default'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                "
              ></span>
              <span
                class="text-sm font-semibold capitalize"
                :class="props.isDarkMode ? 'text-white' : 'text-slate-900'"
              >
                {{
                  permissionStatus === 'granted'
                    ? 'Diizinkan'
                    : permissionStatus === 'default'
                      ? 'Ditanyakan'
                      : 'Diblokir'
                }}
              </span>
            </div>
          </div>

          <!-- Push Subscription Status -->
          <div
            class="p-4 rounded-2xl border flex flex-col justify-between"
            :class="
              props.isDarkMode
                ? 'bg-slate-950/40 border-slate-800'
                : 'bg-slate-50/50 border-slate-200'
            "
          >
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500"
              >Koneksi Push Server</span
            >
            <div class="flex items-center gap-2 mt-2">
              <span
                class="w-3 h-3 rounded-full animate-pulse"
                :class="rawSubscription ? 'bg-emerald-500' : 'bg-rose-500'"
              ></span>
              <span
                class="text-sm font-semibold"
                :class="props.isDarkMode ? 'text-white' : 'text-slate-900'"
              >
                {{ rawSubscription ? 'Tersambung' : 'Belum Terhubung' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Alert messages -->
        <div
          v-if="statusMessage.text"
          class="mb-6 p-4 rounded-xl border flex items-start gap-3 text-xs animate-fade-in"
          :class="
            statusMessage.type === 'success'
              ? props.isDarkMode
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-emerald-50 border-emerald-250 text-emerald-800'
              : props.isDarkMode
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                : 'bg-rose-50 border-rose-250 text-rose-800'
          "
        >
          <i
            class="fas"
            :class="
              statusMessage.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'
            "
          ></i>
          <span>{{ statusMessage.text }}</span>
        </div>

        <!-- Step 1: Subscribe -->
        <div
          class="mb-8 p-6 rounded-2xl border bg-gradient-to-r"
          :class="
            props.isDarkMode
              ? 'from-slate-950/30 to-slate-900/10 border-slate-800'
              : 'from-slate-50 to-slate-100/40 border-slate-200'
          "
        >
          <h2
            class="text-lg font-bold mb-2"
            :class="props.isDarkMode ? 'text-white' : 'text-slate-900'"
          >
            1. Pendaftaran Subskripsi Push
          </h2>
          <p class="text-xs mb-4" :class="props.isDarkMode ? 'text-slate-400' : 'text-slate-500'">
            Membuat subskripsi baru dari browser klien Anda, mendaftarkannya ke Service Worker, lalu
            mengirimkannya ke webhook n8n di:
            <code class="px-1.5 py-0.5 rounded font-mono bg-slate-200 dark:bg-slate-800 text-[10px]"
              >POST /push-subscription</code
            >.
          </p>
          <button
            @click="handleSubscribe"
            :disabled="isLoading"
            class="px-5 py-2.5 text-xs font-semibold rounded-xl bg-blue-600 dark:bg-cyan-500 text-white hover:bg-blue-700 dark:hover:bg-cyan-600 transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            <i class="fas fa-link mr-1.5"></i> Daftarkan Subskripsi
          </button>
        </div>

        <!-- Form fields for payload -->
        <div class="grid gap-6 md:grid-cols-2 mb-8">
          <div>
            <label
              class="block text-xs font-bold uppercase tracking-wider mb-2"
              :class="props.isDarkMode ? 'text-slate-400' : 'text-slate-600'"
            >
              Judul Notifikasi
            </label>
            <input
              v-model="testTitle"
              type="text"
              class="w-full text-xs px-4 py-3 rounded-xl border outline-none transition-all duration-300"
              :class="
                props.isDarkMode
                  ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-400'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-600'
              "
            />
          </div>
          <div>
            <label
              class="block text-xs font-bold uppercase tracking-wider mb-2"
              :class="props.isDarkMode ? 'text-slate-400' : 'text-slate-600'"
            >
              Isi Notifikasi (Body)
            </label>
            <input
              v-model="testBody"
              type="text"
              class="w-full text-xs px-4 py-3 rounded-xl border outline-none transition-all duration-300"
              :class="
                props.isDarkMode
                  ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-400'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-600'
              "
            />
          </div>
        </div>

        <!-- Step 2: Testing Buttons -->
        <div class="grid gap-6 md:grid-cols-2 mb-8">
          <!-- Local Notification -->
          <div
            class="p-5 rounded-2xl border"
            :class="
              props.isDarkMode
                ? 'border-slate-850 bg-slate-950/20'
                : 'border-slate-150 bg-slate-50/20'
            "
          >
            <h3
              class="text-sm font-bold mb-1"
              :class="props.isDarkMode ? 'text-white' : 'text-slate-900'"
            >
              2A. Simulasi Notifikasi Lokal
            </h3>
            <p
              class="text-[11px] mb-4"
              :class="props.isDarkMode ? 'text-slate-400' : 'text-slate-500'"
            >
              Kirim notifikasi langsung di browser ini. Digunakan untuk memeriksa apakah pengaturan
              notifikasi OS/Browser Anda diblokir atau diatur ke "Do Not Disturb" (Jangan Ganggu).
            </p>
            <button
              @click="triggerLocalNotification"
              class="w-full py-2.5 text-xs font-semibold rounded-xl border transition-all duration-200 cursor-pointer"
              :class="
                props.isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                  : 'bg-white border-slate-350 text-slate-700 hover:bg-slate-50'
              "
            >
              <i class="fas fa-bell mr-1.5"></i> Uji Notifikasi Lokal
            </button>
          </div>

          <!-- Server Push Notification -->
          <div
            class="p-5 rounded-2xl border"
            :class="
              props.isDarkMode
                ? 'border-slate-850 bg-slate-950/20'
                : 'border-slate-150 bg-slate-50/20'
            "
          >
            <h3
              class="text-sm font-bold mb-1"
              :class="props.isDarkMode ? 'text-white' : 'text-slate-900'"
            >
              2B. Uji Coba Push Server n8n
            </h3>
            <p
              class="text-[11px] mb-4"
              :class="props.isDarkMode ? 'text-slate-400' : 'text-slate-500'"
            >
              Kirim payload subskripsi + teks di atas ke webhook n8n:
              <code class="font-mono text-[9px] px-1 bg-slate-200 dark:bg-slate-800"
                >POST /push-test</code
              >. n8n akan mengirimkan kembali Push Notification dari server ke browser Anda.
            </p>
            <button
              @click="triggerServerPushNotification"
              :disabled="isLoading || !rawSubscription"
              class="w-full py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-300 shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              <i class="fas fa-paper-plane mr-1.5"></i> Uji Push Server n8n
            </button>
          </div>
        </div>

        <!-- Raw Subscription Data JSON -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label
              class="block text-xs font-bold uppercase tracking-wider"
              :class="props.isDarkMode ? 'text-slate-400' : 'text-slate-600'"
            >
              Detail Data Subskripsi (JSON)
            </label>
            <button
              v-if="rawSubscription"
              @click="copySubscription"
              class="text-[10px] text-blue-500 dark:text-cyan-400 hover:underline cursor-pointer"
            >
              <i class="far fa-copy mr-1"></i> Salin JSON
            </button>
          </div>
          <div
            class="p-4 rounded-xl font-mono text-[10px] overflow-x-auto max-h-40 border"
            :class="
              props.isDarkMode
                ? 'bg-slate-950 border-slate-850 text-slate-300'
                : 'bg-slate-50 border-slate-250 text-slate-700'
            "
          >
            <pre v-if="rawSubscription">{{ rawSubscription }}</pre>
            <span v-else class="text-slate-400 italic"
              >Belum ada data subskripsi. Silakan klik "Daftarkan Subskripsi" di atas untuk
              menghubungkan browser ini ke server push.</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
