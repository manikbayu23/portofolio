<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { apiFetch } from '@/utils/api'
import baydiLogo from '@/images/baydi.png'
import { getNotificationPermissionStatus, subscribeToPushNotifications } from '@/utils/push'

const props = defineProps({
  isDarkMode: Boolean,
  isMini: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
const router = useRouter()

const isMuted = ref(localStorage.getItem('chat_muted') === 'true')

const toggleMute = () => {
  isMuted.value = !isMuted.value
  localStorage.setItem('chat_muted', isMuted.value ? 'true' : 'false')
}

const playNotificationSound = () => {
  if (isMuted.value) return
  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return

  try {
    const ctx = new AudioContext()
    
    // Tone 1: High crisp chirp
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(800, ctx.currentTime)
    osc1.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08)
    gain1.gain.setValueAtTime(0.08, ctx.currentTime)
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(ctx.currentTime)
    osc1.stop(ctx.currentTime + 0.15)

    // Tone 2 (delayed slightly): Harmonizing ping
    setTimeout(() => {
      try {
        const osc2 = ctx.createOscillator()
        const gain2 = ctx.createGain()
        osc2.type = 'sine'
        osc2.frequency.setValueAtTime(1000, ctx.currentTime)
        osc2.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.12)
        gain2.gain.setValueAtTime(0.05, ctx.currentTime)
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
        osc2.connect(gain2)
        gain2.connect(ctx.destination)
        osc2.start(ctx.currentTime)
        osc2.stop(ctx.currentTime + 0.25)
      } catch (err) {}
    }, 60)
  } catch (e) {
    console.error('Audio context error:', e)
  }
}

const newMessage = ref('')
const isLoading = ref(false)
const notificationStatus = ref(getNotificationPermissionStatus())

const handleEnableNotifications = async () => {
  try {
    await subscribeToPushNotifications()
    notificationStatus.value = getNotificationPermissionStatus()
  } catch (error) {
    console.error('Push subscription failed:', error)
    alert(error.message || 'Gagal mengaktifkan notifikasi.')
  }
}

const messages = ref([
  {
    id: 1,
    role: 'assistant',
    text: 'Halo! Saya Baydi. Ada yang bisa saya bantu?',
  },
])

const chatContainer = ref(null)

const highlightDetails = (text) => {
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
  formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
  
  formatted = formatted.replace(
    /(Rp\s?\d+[\d.,]*)/gi,
    '<strong class="font-semibold text-blue-600 dark:text-cyan-400">$1</strong>',
  )

  formatted = formatted.replace(
    /\((Mandiri|Cash|OVO|Gopay|Dana|BCA|BRI|LinkAja)\)/gi,
    '<span class="px-1.5 py-0.5 ml-1 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">($1)</span>',
  )

  formatted = formatted.replace(
    /^(Reminder|Ingat|Jadwal):/gi,
    '<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 mr-1.5"><i class="fas fa-bell"></i> $1</span>',
  )

  formatted = formatted.replace(
    /^(Penting|Important|Urgent):/gi,
    '<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 mr-1.5"><i class="fas fa-exclamation-triangle"></i> $1</span>',
  )

  formatted = formatted.replace(
    /^(Catatan|Note|Memory|Memori):/gi,
    '<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mr-1.5"><i class="fas fa-brain"></i> $1</span>',
  )

  return formatted
}

const formatMessage = (text) => {
  if (!text) return ''
  let escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const lines = escaped.split('\n')
  let html = []
  let inList = false

  for (let line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      if (inList) {
        html.push('</ul>')
        inList = false
      }
      html.push('<div class="h-2"></div>')
      continue
    }

    if (trimmed.match(/^(?:-\s+)?\[\s*\]\s+(.*)/)) {
      if (inList) {
        html.push('</ul>')
        inList = false
      }
      const content = trimmed.replace(/^(?:-\s+)?\[\s*\]\s+/, '')
      html.push(`
        <div class="flex items-start gap-2.5 text-xs md:text-sm my-2 text-slate-600 dark:text-slate-400">
          <i class="far fa-square text-slate-400 dark:text-slate-500 mt-1 flex-shrink-0 text-sm"></i>
          <span class="flex-1">${highlightDetails(content)}</span>
        </div>
      `)
    }
    else if (trimmed.match(/^(?:-\s+)?\[x\]\s+(.*)/i)) {
      if (inList) {
        html.push('</ul>')
        inList = false
      }
      const content = trimmed.replace(/^(?:-\s+)?\[x\]\s+/, '')
      html.push(`
        <div class="flex items-start gap-2.5 text-xs md:text-sm my-2 text-slate-400 line-through decoration-slate-300 dark:decoration-slate-700">
          <i class="fas fa-check-square text-emerald-500 mt-1 flex-shrink-0 text-sm animate-bounce"></i>
          <span class="flex-1">${highlightDetails(content)}</span>
        </div>
      `)
    }
    else if (trimmed.match(/^\d+\.\s+(.*)/)) {
      if (inList) {
        html.push('</ul>')
        inList = false
      }
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/)
      const num = numMatch[1]
      const content = numMatch[2]
      html.push(`
        <div class="flex items-start gap-2.5 text-xs md:text-sm my-2">
          <span class="flex-shrink-0 w-5 h-5 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-cyan-500/10 dark:text-cyan-400 font-bold flex items-center justify-center text-[10px]">${num}</span>
          <span class="flex-1 mt-0.5">${highlightDetails(content)}</span>
        </div>
      `)
    }
    else if (trimmed.startsWith('-')) {
      if (!inList) {
        html.push('<ul class="my-2 space-y-2 pl-1">')
        inList = true
      }
      const content = trimmed.substring(1).trim()
      const formattedContent = highlightDetails(content)
      html.push(`
        <li class="flex items-start gap-2.5 text-xs md:text-sm">
          <span class="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-cyan-400 mt-2"></span>
          <span class="flex-1">${formattedContent}</span>
        </li>
      `)
    } else {
      if (inList) {
        html.push('</ul>')
        inList = false
      }

      if (
        trimmed.toLowerCase().includes('total pengeluaran') ||
        trimmed.toLowerCase().includes('total biaya') ||
        (trimmed.toLowerCase().startsWith('total:') && trimmed.includes('Rp'))
      ) {
        const formattedTotal = highlightDetails(trimmed)
        html.push(`
          <div class="mt-4 p-3.5 rounded-2xl border bg-emerald-500/5 dark:bg-emerald-500/5 border-emerald-500/15 dark:border-emerald-500/15 text-xs md:text-sm font-semibold flex items-center gap-2.5 text-slate-800 dark:text-slate-200">
            <div class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              <i class="fas fa-wallet text-sm"></i>
            </div>
            <span class="flex-1">${formattedTotal}</span>
          </div>
        `)
      }
      else if (trimmed.toLowerCase().startsWith('total')) {
        const formattedTotal = highlightDetails(trimmed)
        html.push(`
          <div class="mt-4 p-3.5 rounded-2xl border bg-blue-500/5 dark:bg-cyan-500/5 border-blue-500/15 dark:border-cyan-500/15 text-xs md:text-sm font-semibold flex items-center gap-2.5 text-slate-800 dark:text-slate-200">
            <div class="w-8 h-8 rounded-xl bg-blue-100 dark:bg-cyan-950/60 flex items-center justify-center text-blue-600 dark:text-cyan-400 flex-shrink-0">
              <i class="fas fa-info-circle text-sm"></i>
            </div>
            <span class="flex-1">${formattedTotal}</span>
          </div>
        `)
      }
      else {
        const formattedLine = highlightDetails(trimmed)
        html.push(`<p class="my-1.5 text-xs md:text-sm leading-relaxed">${formattedLine}</p>`)
      }
    }
  }

  if (inList) {
    html.push('</ul>')
  }

  return html.join('')
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const scrollToBottomInstant = async () => {
  await nextTick()
  if (chatContainer.value) {
    const originalBehavior = chatContainer.value.style.scrollBehavior
    chatContainer.value.style.scrollBehavior = 'auto'
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    setTimeout(() => {
      if (chatContainer.value) {
        chatContainer.value.style.scrollBehavior = originalBehavior
      }
    }, 50)
  }
}

const sendToWebhook = async (message) => {
  const minDelay = new Promise((resolve) => setTimeout(resolve, 800))
  try {
    const response = await apiFetch('https://n8n.mbwebcreations.my.id/webhook/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    const data = await response.json()
    await minDelay
    return data.reply || 'Webhook merespons, tetapi tidak mengembalikan balasan teks.'
  } catch (error) {
    await minDelay
    const msgLower = message.toLowerCase()
    if (msgLower.includes('halo') || msgLower.includes('hai')) {
      return 'Halo! Senang menyapa Anda. Ada yang ingin Anda tanyakan tentang proyek web Manik?'
    } else if (
      msgLower.includes('kerja') ||
      msgLower.includes('pengalaman') ||
      msgLower.includes('perusahaan')
    ) {
      return 'Manik saat ini bekerja sebagai Full Stack Web Developer di PT. Saka Agung Abadi sejak 2023, mengelola ERP berbasis Laravel & Vue.js.'
    } else if (
      msgLower.includes('kontak') ||
      msgLower.includes('email') ||
      msgLower.includes('no hp')
    ) {
      return 'Anda dapat menghubungi Manik melalui email gedemanik2001@gmail.com atau telepon +62 85156117969.'
    } else if (
      msgLower.includes('skill') ||
      msgLower.includes('keahlian') ||
      msgLower.includes('bahasa')
    ) {
      return 'Keahlian utama Manik meliputi Vue.js, Laravel, Tailwind CSS, PostgreSQL, MySQL, serta desain grafis (Figma, CorelDraw).'
    }
    return 'Terima kasih atas pesan Anda! Webhook n8n belum terhubung sepenuhnya, tetapi balasan demo ini berjalan lancar secara lokal.'
  }
}

const sendMessage = async () => {
  const text = newMessage.value.trim()
  if (!text || isLoading.value) return

  const userMsgId = Date.now()
  messages.value.push({ id: userMsgId, role: 'user', text })
  newMessage.value = ''
  scrollToBottom()

  await nextTick()
  gsap.from(`#msg-${userMsgId}`, {
    y: 15,
    opacity: 0,
    scale: 0.95,
    duration: 0.35,
    ease: 'power3.out',
  })

  isLoading.value = true
  scrollToBottom()

  const reply = await sendToWebhook(text)

  messages.value.push({ id: Date.now() + 1, role: 'assistant', text: reply })
  isLoading.value = false
  scrollToBottom()

  playNotificationSound()

  await nextTick()
  gsap.from(`#msg-${Date.now() + 1}`, {
    y: 15,
    opacity: 0,
    scale: 0.95,
    duration: 0.45,
    ease: 'back.out(1.4)',
  })
}

const copiedMessageId = ref(null)
const speakingMessageId = ref(null)
let currentSpeechUtterance = null

const stopSpeaking = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
  speakingMessageId.value = null
  currentSpeechUtterance = null
}

const copyMessageText = async (text, id) => {
  try {
    await navigator.clipboard.writeText(text)
    copiedMessageId.value = id
    setTimeout(() => {
      if (copiedMessageId.value === id) {
        copiedMessageId.value = null
      }
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text:', err)
  }
}

const toggleSpeakMessage = (text, id) => {
  if (!window.speechSynthesis) {
    alert('Browser Anda tidak mendukung fitur pembacaan suara (Text-to-Speech).')
    return
  }

  if (speakingMessageId.value === id) {
    stopSpeaking()
    return
  }

  stopSpeaking()

  let cleanText = text
    .replace(/\*\*|__/g, '')
    .replace(/\*|_/g, '')
    .replace(/-\s+\[\s*\]\s+/g, '')
    .replace(/-\s+\[x\]\s+/g, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^-\s+/gm, '')
    .replace(/Reminder:|Ingat:|Jadwal:|Penting:|Important:|Urgent:|Catatan:|Note:|Memory:|Memori:/gi, '')
    .trim()

  const utterance = new SpeechSynthesisUtterance(cleanText)
  utterance.lang = 'id-ID'
  
  const voices = window.speechSynthesis.getVoices()
  const indonesianVoice = voices.find(voice => voice.lang.includes('id') || voice.lang.includes('ID'))
  if (indonesianVoice) {
    utterance.voice = indonesianVoice
  }

  utterance.onend = () => {
    stopSpeaking()
  }

  utterance.onerror = () => {
    stopSpeaking()
  }

  speakingMessageId.value = id
  currentSpeechUtterance = utterance
  window.speechSynthesis.speak(utterance)
}

const isHistoryLoading = ref(false)

const fetchChatHistory = async () => {
  isHistoryLoading.value = true
  try {
    const response = await apiFetch('https://n8n.mbwebcreations.my.id/webhook/chat-history')
    if (response.ok) {
      const data = await response.json()
      const fetchedMessages = Array.isArray(data) ? data : data.messages || data.message || data.data || []
      if (fetchedMessages.length > 0) {
        messages.value = fetchedMessages.map((msg, index) => ({
          id: msg.id || index + 1,
          role: msg.role || (msg.is_user ? 'user' : 'assistant'),
          text: msg.text || msg.message || '',
        }))
      }
    }
  } catch (error) {
    console.error('Failed to fetch chat history:', error)
  } finally {
    isHistoryLoading.value = false
    await nextTick()
    scrollToBottomInstant()
  }
}



const navigateToFullChat = () => {
  emit('close')
  router.push('/chat-bot')
}

onMounted(async () => {
  if (!props.isMini) {
    gsap.from('.chatbot-card', {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power4.out',
    })
  }
  await fetchChatHistory()
})

onUnmounted(() => {
  stopSpeaking()
})</script>

<template>
  <div
    class="chatbot-card overflow-hidden transition-colors duration-500 flex flex-col"
    :class="[
      isMini
        ? 'w-[360px] h-[500px] rounded-2xl border shadow-2xl'
        : 'rounded-3xl border shadow-2xl h-full w-full',
      isDarkMode
        ? 'bg-slate-900/90 border-slate-800/80 shadow-slate-950/60 backdrop-blur-xl'
        : 'bg-white border-slate-200 shadow-slate-200/50'
    ]"
  >
    <!-- Header -->
    <div
      class="border-b flex items-center justify-between animate-fade-in"
      :class="[
        isMini ? 'p-4' : 'p-6',
        isDarkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/50'
      ]"
    >
      <div class="flex items-center gap-3">
        <div :class="isMini ? 'w-8 h-8 rounded-xl' : 'w-10 h-10 rounded-2xl'" class="overflow-hidden shadow-md">
          <img :src="baydiLogo" alt="Baydi" class="w-full h-full object-cover" />
        </div>
        <div>
          <h1
            class="font-bold leading-tight"
            :class="[
              isMini ? 'text-sm' : 'text-lg',
              isDarkMode ? 'text-white' : 'text-slate-900'
            ]"
          >
            Baydi
          </h1>
          <p
            class="text-[10px] flex items-center gap-1"
            :class="isDarkMode ? 'text-cyan-400' : 'text-blue-600'"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> Online
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <!-- PWA Push Notifications Control (Only shown in full mode or compact on mini) -->
        <div v-if="notificationStatus !== 'unsupported'" class="flex items-center">
          <button
            v-if="notificationStatus === 'default'"
            @click="handleEnableNotifications"
            class="text-[10px] font-semibold px-2 py-1 rounded-lg transition-all duration-300 flex items-center gap-1 border hover:scale-[1.02] cursor-pointer"
            :class="
              isDarkMode
                ? 'bg-blue-500/10 border-blue-500/20 text-cyan-400 hover:bg-blue-500/20'
                : 'bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100'
            "
            :title="isMini ? 'Aktifkan Notifikasi' : ''"
          >
            <i class="fas fa-bell"></i>
            <span v-if="!isMini">Aktifkan Notifikasi</span>
          </button>
          <span
            v-else-if="notificationStatus === 'granted'"
            class="text-[9px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1"
            :class="
              isDarkMode
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-emerald-50 border-emerald-100 text-emerald-600'
            "
          >
            <i class="fas fa-check-circle"></i>
            <span v-if="!isMini">Notifikasi Aktif</span>
          </span>
          <span
            v-else-if="notificationStatus === 'denied'"
            class="text-[9px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 cursor-help"
            title="Izin notifikasi diblokir. Aktifkan manual melalui pengaturan browser Anda."
            :class="
              isDarkMode
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                : 'bg-rose-50 border-rose-100 text-rose-600'
            "
          >
            <i class="fas fa-ban"></i>
            <span v-if="!isMini">Notifikasi Diblokir</span>
          </span>
        </div>

        <!-- Audio Mute/Unmute Button -->
        <button
          @click="toggleMute"
          class="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500 dark:text-slate-400 cursor-pointer text-xs flex items-center justify-center w-7 h-7"
          :title="isMuted ? 'Aktifkan Suara' : 'Senyapkan Suara'"
        >
          <i class="fas" :class="isMuted ? 'fa-volume-mute text-rose-500' : 'fa-volume-up text-emerald-500'"></i>
        </button>

        <!-- Maximize (Only in mini mode) -->
        <button
          v-if="isMini"
          @click="navigateToFullChat"
          class="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500 dark:text-slate-400 cursor-pointer"
          title="Perbesar Obrolan"
        >
          <i class="fas fa-expand-alt text-xs"></i>
        </button>

        <!-- Close (Only in mini mode) -->
        <button
          v-if="isMini"
          @click="emit('close')"
          class="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500 dark:text-slate-400 cursor-pointer"
          title="Tutup"
        >
          <i class="fas fa-times text-xs"></i>
        </button>
      </div>
    </div>

    <!-- Chat messages area -->
    <div
      ref="chatContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4"
      :class="isDarkMode ? 'bg-slate-950/20' : 'bg-slate-50/20'"
    >
      <div v-if="isHistoryLoading" class="h-full flex flex-col items-center justify-center py-10 space-y-3">
        <i class="fas fa-spinner animate-spin text-2xl text-blue-600 dark:text-cyan-400"></i>
        <p class="text-[10px]" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">Memuat riwayat...</p>
      </div>

      <template v-else>
        <div
          v-for="message in messages"
          :key="message.id"
          :id="`msg-${message.id}`"
          class="flex items-start gap-2.5 max-w-[88%] transition-all group/msg relative"
          :class="message.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'"
        >
          <!-- Avatar -->
          <div
            class="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 select-none overflow-hidden"
            :class="
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : isDarkMode
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                  : 'bg-slate-100 text-blue-600 border border-slate-200'
            "
          >
            <i v-if="message.role === 'user'" class="fas fa-user text-[10px]"></i>
            <img v-else :src="baydiLogo" alt="Baydi" class="w-full h-full object-cover" />
          </div>

          <!-- Bubble and Actions Wrapper -->
          <div class="flex flex-col gap-1 max-w-[calc(100%-2rem)]">
            <!-- Bubble -->
            <div
              class="p-3 rounded-2xl text-xs leading-relaxed border shadow-sm"
              :class="
                message.role === 'user'
                  ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 border-blue-600 text-white rounded-tr-none'
                  : isDarkMode
                    ? 'bg-slate-900/80 border-slate-800 text-slate-100 rounded-tl-none'
                    : 'bg-white border-slate-200 text-slate-800 rounded-tl-none'
              "
            >
              <div v-if="message.role === 'assistant'" v-html="formatMessage(message.text)"></div>
              <p v-else class="whitespace-pre-wrap">{{ message.text }}</p>
            </div>

            <!-- Message Action Bar (Copy & Text-to-Speech) -->
            <div
              class="flex items-center gap-2.5 px-1 text-[10px] opacity-0 group-hover/msg:opacity-100 transition-opacity duration-200"
              :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
            >
              <!-- Copy button -->
              <button
                type="button"
                @click="copyMessageText(message.text, message.id)"
                class="hover:text-blue-500 dark:hover:text-cyan-400 transition flex items-center gap-1 cursor-pointer"
                :class="isDarkMode ? 'text-slate-500' : 'text-slate-400'"
                :title="copiedMessageId === message.id ? 'Tersalin!' : 'Salin pesan'"
              >
                <i class="fas" :class="copiedMessageId === message.id ? 'fa-check text-emerald-500' : 'fa-copy'"></i>
                <span>{{ copiedMessageId === message.id ? 'Tersalin' : 'Salin' }}</span>
              </button>

              <!-- Speak button (Only for assistant messages) -->
              <button
                v-if="message.role === 'assistant'"
                type="button"
                @click="toggleSpeakMessage(message.text, message.id)"
                class="hover:text-blue-500 dark:hover:text-cyan-400 transition flex items-center gap-1 cursor-pointer"
                :class="[
                  isDarkMode ? 'text-slate-500' : 'text-slate-400',
                  speakingMessageId === message.id ? 'text-emerald-500 dark:text-cyan-400 animate-pulse' : ''
                ]"
                :title="speakingMessageId === message.id ? 'Hentikan pembacaan' : 'Bacakan pesan'"
              >
                <i class="fas" :class="speakingMessageId === message.id ? 'fa-stop-circle text-rose-500' : 'fa-volume-up'"></i>
                <span>{{ speakingMessageId === message.id ? 'Berhenti' : 'Dengar' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Loading bubble -->
        <div v-if="isLoading" class="flex items-start gap-3 max-w-[80%] mr-auto">
          <div
            class="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-cyan-400 overflow-hidden"
          >
            <img :src="baydiLogo" alt="Baydi" class="w-full h-full object-cover" />
          </div>
          <div
            class="p-3 rounded-2xl rounded-tl-none border"
            :class="
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-cyan-400'
                : 'bg-white border-slate-200 text-blue-600'
            "
          >
            <div class="typing-dots">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Input Box Area -->
    <div
      class="p-3 border-t"
      :class="
        isDarkMode
          ? 'border-slate-800 bg-slate-950/30'
          : 'border-slate-100 bg-slate-50/30'
      "
    >
      <form @submit.prevent="sendMessage" class="flex gap-2">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Tanyakan sesuatu..."
          :disabled="isLoading"
          class="w-full text-xs rounded-xl border px-4 py-3 outline-none transition-all duration-300 disabled:opacity-60"
          :class="
            isDarkMode
              ? 'bg-slate-950 border-slate-850 text-white focus:border-cyan-400 focus:bg-slate-950'
              : 'bg-white border-slate-200 text-slate-800 focus:border-blue-600 focus:bg-white'
          "
        />
        <button
          type="submit"
          :disabled="isLoading || !newMessage.trim()"
          class="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-4 py-3 flex items-center justify-center transition-all duration-300 hover:scale-[1.03] disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-blue-500/10 cursor-pointer"
        >
          <i class="fas fa-paper-plane text-xs"></i>
        </button>
      </form>
    </div>
  </div>
</template>
