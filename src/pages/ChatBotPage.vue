<script setup>
import { ref, nextTick, onMounted } from 'vue'
import gsap from 'gsap'
import { apiFetch } from '@/utils/api'
import baydiLogo from '@/images/baydi.png'
import { getNotificationPermissionStatus, subscribeToPushNotifications } from '@/utils/push'

const props = defineProps({ isDarkMode: Boolean })
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
  // Bold markdown bold text
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')

  // Italic markdown italic text
  formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

  // Highlight amounts like Rp137.800,00 or Rp 137.800
  formatted = formatted.replace(
    /(Rp\s?\d+[\d.,]*)/gi,
    '<strong class="font-semibold text-blue-600 dark:text-cyan-400">$1</strong>',
  )

  // Highlight payment methods: (Mandiri), (Cash), etc. as modern badges
  formatted = formatted.replace(
    /\((Mandiri|Cash|OVO|Gopay|Dana|BCA|BRI|LinkAja)\)/gi,
    '<span class="px-1.5 py-0.5 ml-1 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">($1)</span>',
  )

  // Highlight key prefixes at the start of a line
  // Reminder/Ingat/Jadwal:
  formatted = formatted.replace(
    /^(Reminder|Ingat|Jadwal):/gi,
    '<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 mr-1.5"><i class="fas fa-bell"></i> $1</span>',
  )

  // Penting/Important/Urgent:
  formatted = formatted.replace(
    /^(Penting|Important|Urgent):/gi,
    '<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 mr-1.5"><i class="fas fa-exclamation-triangle"></i> $1</span>',
  )

  // Catatan/Note/Memory/Memori:
  formatted = formatted.replace(
    /^(Catatan|Note|Memory|Memori):/gi,
    '<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mr-1.5"><i class="fas fa-brain"></i> $1</span>',
  )

  return formatted
}

const formatMessage = (text) => {
  if (!text) return ''

  // Escape HTML to prevent XSS
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

    // 1. Task Checkbox Unchecked: - [ ] or [ ]
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
    // 2. Task Checkbox Checked: - [x] or [x]
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
    // 3. Numbered List: e.g. 1. or 2.
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
    // 4. Standard bullet list item starting with '-'
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

      // Check for financial totals (Total pengeluaran, Total biaya, dll.)
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
      // General totals or counts (Total tugas, Total catatan, dll.)
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
      // Standard text line
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
    // Fallback response if webhook is not available
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

  // Push user message
  const userMsgId = Date.now()
  messages.value.push({ id: userMsgId, role: 'user', text })
  newMessage.value = ''
  scrollToBottom()

  // Animate user message bubble
  await nextTick()
  gsap.from(`#msg-${userMsgId}`, {
    y: 15,
    opacity: 0,
    scale: 0.95,
    duration: 0.35,
    ease: 'power3.out',
  })

  // Start loading state
  isLoading.value = true
  scrollToBottom()

  // Send request & get reply
  const reply = await sendToWebhook(text)

  // Remove loading and push assistant message
  messages.value.push({ id: Date.now() + 1, role: 'assistant', text: reply })
  isLoading.value = false
  scrollToBottom()

  // Animate assistant reply bubble
  await nextTick()
  gsap.from(`#msg-${Date.now() + 1}`, {
    y: 15,
    opacity: 0,
    scale: 0.95,
    duration: 0.45,
    ease: 'back.out(1.4)',
  })
}

onMounted(() => {
  // Entrance animation for Chat Bot card
  gsap.from('.chatbot-card', {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power4.out',
  })
})
</script>

<template>
  <section class="h-[calc(100vh-5rem)] py-4 flex flex-col relative overflow-hidden">
    <!-- Ambient light effects -->
    <div
      class="absolute top-10 left-10 w-72 h-72 bg-blue-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"
    ></div>
    <div
      class="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500/5 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none"
    ></div>

    <div class="container mx-auto px-4 sm:px-6 max-w-4xl h-full flex flex-col overflow-hidden pb-4">
      <div
        class="chatbot-card rounded-3xl border overflow-hidden shadow-2xl transition-colors duration-500 h-full flex flex-col"
        :class="
          props.isDarkMode
            ? 'bg-slate-900/60 border-slate-800/80 shadow-slate-950/60'
            : 'bg-white border-slate-200 shadow-slate-200/50'
        "
      >
        <!-- Header -->
        <div
          class="p-6 border-b flex items-center justify-between"
          :class="
            props.isDarkMode
              ? 'border-slate-800 bg-slate-950/40'
              : 'border-slate-100 bg-slate-50/50'
          "
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl overflow-hidden shadow-md">
              <img :src="baydiLogo" alt="Baydi" class="w-full h-full object-cover" />
            </div>
            <div>
              <h1
                class="text-lg font-bold"
                :class="props.isDarkMode ? 'text-white' : 'text-slate-900'"
              >
                Baydi
              </h1>
              <p
                class="text-xs flex items-center gap-1.5"
                :class="props.isDarkMode ? 'text-cyan-400' : 'text-blue-600'"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> Online
              </p>
            </div>
          </div>

          <!-- PWA Push Notifications Control -->
          <div v-if="notificationStatus !== 'unsupported'" class="flex items-center">
            <button
              v-if="notificationStatus === 'default'"
              @click="handleEnableNotifications"
              class="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 border hover:scale-[1.02] cursor-pointer"
              :class="
                props.isDarkMode
                  ? 'bg-blue-500/10 border-blue-500/20 text-cyan-400 hover:bg-blue-500/20'
                  : 'bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100'
              "
            >
              <i class="fas fa-bell"></i>
              Aktifkan Notifikasi
            </button>
            <span
              v-else-if="notificationStatus === 'granted'"
              class="text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5"
              :class="
                props.isDarkMode
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-emerald-50 border-emerald-100 text-emerald-600'
              "
            >
              <i class="fas fa-check-circle"></i>
              Notifikasi Aktif
            </span>
            <span
              v-else-if="notificationStatus === 'denied'"
              class="text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 cursor-help"
              title="Izin notifikasi diblokir. Aktifkan manual melalui pengaturan browser Anda."
              :class="
                props.isDarkMode
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  : 'bg-rose-50 border-rose-100 text-rose-600'
              "
            >
              <i class="fas fa-ban"></i>
              Notifikasi Diblokir
            </span>
          </div>
        </div>

        <!-- Chat messages area -->
        <div
          ref="chatContainer"
          class="flex-1 overflow-y-auto p-6 space-y-4"
          :class="props.isDarkMode ? 'bg-slate-950/20' : 'bg-slate-50/20'"
        >
          <div
            v-for="message in messages"
            :key="message.id"
            :id="`msg-${message.id}`"
            class="flex items-start gap-3 max-w-[85%] transition-all"
            :class="message.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'"
          >
            <!-- Avatar -->
            <div
              class="w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 select-none overflow-hidden"
              :class="
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : props.isDarkMode
                    ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                    : 'bg-slate-100 text-blue-600 border border-slate-200'
              "
            >
              <i v-if="message.role === 'user'" class="fas fa-user"></i>
              <img v-else :src="baydiLogo" alt="Baydi" class="w-full h-full object-cover" />
            </div>

            <!-- Bubble -->
            <div
              class="p-4 rounded-2xl text-sm leading-relaxed border shadow-sm"
              :class="
                message.role === 'user'
                  ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 border-blue-600 text-white rounded-tr-none'
                  : props.isDarkMode
                    ? 'bg-slate-900/80 border-slate-800 text-slate-100 rounded-tl-none'
                    : 'bg-white border-slate-200 text-slate-800 rounded-tl-none'
              "
            >
              <div v-if="message.role === 'assistant'" v-html="formatMessage(message.text)"></div>
              <p v-else class="whitespace-pre-wrap">{{ message.text }}</p>
            </div>
          </div>

          <!-- Loading bubble -->
          <div v-if="isLoading" class="flex items-start gap-3 max-w-[80%] mr-auto">
            <div
              class="w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-cyan-400 overflow-hidden"
            >
              <img :src="baydiLogo" alt="Baydi" class="w-full h-full object-cover" />
            </div>
            <div
              class="p-4 rounded-2xl rounded-tl-none text-sm border"
              :class="
                props.isDarkMode
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
        </div>

        <!-- Input Box Area -->
        <div
          class="p-4 border-t"
          :class="
            props.isDarkMode
              ? 'border-slate-800 bg-slate-950/30'
              : 'border-slate-100 bg-slate-50/30'
          "
        >
          <form @submit.prevent="sendMessage" class="flex gap-3">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Tanyakan sesuatu..."
              :disabled="isLoading"
              class="w-full text-sm rounded-xl border px-5 py-3.5 outline-none transition-all duration-300 disabled:opacity-60"
              :class="
                props.isDarkMode
                  ? 'bg-slate-950 border-slate-850 text-white focus:border-cyan-400 focus:bg-slate-950'
                  : 'bg-white border-slate-200 text-slate-800 focus:border-blue-600 focus:bg-white'
              "
            />
            <button
              type="submit"
              :disabled="isLoading || !newMessage.trim()"
              class="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3.5 flex items-center justify-center transition-all duration-300 hover:scale-[1.03] disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-blue-500/10"
            >
              <i class="fas fa-paper-plane"></i>
            </button>
          </form>

          <div
            class="mt-4 flex flex-col sm:flex-row sm:justify-between text-[11px]"
            :class="props.isDarkMode ? 'text-slate-500' : 'text-slate-400'"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>
