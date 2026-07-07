<script setup>
import { ref, nextTick, onMounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({ isDarkMode: Boolean })
const newMessage = ref('')
const isLoading = ref(false)

const messages = ref([
  {
    id: 1,
    role: 'assistant',
    text: 'Halo! Saya Baydi. Ada yang bisa saya bantu terkait profil, pengalaman kerja, atau keahlian pemrograman Manik?',
  },
])

const chatContainer = ref(null)

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const sendToWebhook = async (message) => {
  const minDelay = new Promise((resolve) => setTimeout(resolve, 800))
  try {
    const response = await fetch(
      'https://n8n.mbwebcreations.my.id/webhook-test/3116db08-54ce-42d7-b6c1-769f0f4c0461',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      },
    )
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
  <section class="min-h-[85vh] py-12 flex items-center relative">
    <!-- Ambient light effects -->
    <div
      class="absolute top-10 left-10 w-72 h-72 bg-blue-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"
    ></div>
    <div
      class="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500/5 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none"
    ></div>

    <div class="container mx-auto px-6 max-w-4xl">
      <div
        class="chatbot-card rounded-3xl border overflow-hidden shadow-2xl transition-colors duration-500"
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
            <div
              class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md"
            >
              <i class="fas fa-robot text-lg"></i>
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
          <span
            class="text-xs font-semibold px-3 py-1 rounded-xl"
            :class="
              props.isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
            "
          >
            Demo PWA
          </span>
        </div>

        <!-- Chat messages area -->
        <div
          ref="chatContainer"
          class="h-[400px] overflow-y-auto p-6 space-y-4"
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
              class="w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 select-none"
              :class="
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : props.isDarkMode
                    ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                    : 'bg-slate-100 text-blue-600 border border-slate-200'
              "
            >
              <i :class="message.role === 'user' ? 'fas fa-user' : 'fas fa-robot'"></i>
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
              <p>{{ message.text }}</p>
            </div>
          </div>

          <!-- Loading bubble -->
          <div v-if="isLoading" class="flex items-start gap-3 max-w-[80%] mr-auto">
            <div
              class="w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-cyan-400"
            >
              <i class="fas fa-robot"></i>
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
          >
            <p>Demo ini dapat diinstal langsung di layar beranda handphone Anda sebagai PWA.</p>
            <p class="mt-1 sm:mt-0 font-mono">Endpoint: /webhook-test</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
