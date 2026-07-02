<script setup>
import { ref } from 'vue'

const props = defineProps({ isDarkMode: Boolean })
const newMessage = ref('')
const isLoading = ref(false)
const messages = ref([
    {
        id: 1,
        role: 'assistant',
        text: 'Halo! Ini demo chat bot. Silakan ketik pesan, lalu tekan kirim.'
    }
])

const sendToWebhook = async (message) => {
    const minDelay = new Promise((resolve) => setTimeout(resolve, 500))
    try {
        const response = await fetch('https://n8n.mbwebcreations.my.id/webhook-test/3116db08-54ce-42d7-b6c1-769f0f4c0461', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        })
        const data = await response.json()
        await minDelay
        return data.reply || 'Webhook merespons, tetapi tidak ada balasan.'
    } catch (error) {
        await minDelay
        return 'Webhook belum terpasang. Balasan ini adalah fallback lokal.'
    }
}

const sendMessage = async () => {
    const text = newMessage.value.trim()
    if (!text || isLoading.value) return

    messages.value.push({ id: Date.now(), role: 'user', text })
    newMessage.value = ''
    isLoading.value = true
    messages.value.push({ id: 'loading', role: 'assistant', loading: true, text: '' })

    const reply = await sendToWebhook(text)
    messages.value = messages.value.filter((message) => message.id !== 'loading')
    messages.value.push({ id: Date.now() + 1, role: 'assistant', text: reply })
    isLoading.value = false
}
</script>

<template>
    <section class="min-h-screen pt-10 pb-20 transition-colors duration-300"
        :class="props.isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'">
        <div class="container mx-auto px-6">
            <div class="max-w-3xl mx-auto">
                <div class="mb-10 p-8 rounded-3xl shadow-xl transition-colors duration-300"
                    :class="props.isDarkMode ? 'bg-gray-800 shadow-gray-800' : 'bg-gray-50 shadow-gray-300'">
                    <h1 class="text-4xl font-bold mb-4">Chat Bot</h1>
                    <p class="text-gray-500 dark:text-gray-300">Gunakan halaman ini sebagai antarmuka percakapan. Nanti
                        bisa dihubungkan ke webhook backend untuk pemrosesan pertanyaan nyata.</p>
                    <div class="mt-6 rounded-3xl p-6 border"
                        :class="props.isDarkMode ? 'border-gray-700' : 'border-gray-200'">
                        <div class="space-y-4">
                            <div v-for="message in messages" :key="message.id"
                                :class="message.role === 'user' ? 'text-right' : 'text-left'">
                                <div class="inline-block max-w-full px-5 py-3 rounded-3xl text-sm leading-relaxed"
                                    :class="message.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : props.isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'">
                                    <template v-if="message.loading">
                                        <div class="typing-dots inline-flex items-center gap-2">
                                            <span class="typing-dot"></span>
                                            <span class="typing-dot"></span>
                                            <span class="typing-dot"></span>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <span>{{ message.text }}</span>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form @submit.prevent="sendMessage" class="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
                        <input v-model="newMessage" type="text" placeholder="Ketik pesan..." :disabled="isLoading"
                            class="w-full rounded-3xl border px-5 py-3 outline-none transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                            :class="props.isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'" />
                        <button type="submit" :disabled="isLoading"
                            class="rounded-3xl bg-blue-600 px-6 py-3 text-white font-semibold transition hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed">
                            {{ isLoading ? 'Mengirim...' : 'Kirim' }}
                        </button>
                    </form>

                    <div class="mt-6 text-sm text-gray-400">
                        <p>Catatan: fitur webhook belum terpasang di backend. Endpoint demo adalah
                            <code>/api/webhook</code>.
                        </p>
                        <p>Untuk membuat PWA berfungsi, buka halaman ini di browser dan tambahkan ke layar beranda.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.typing-dots {
    min-width: 3rem;
}

.typing-dot {
    display: inline-block;
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 9999px;
    background-color: currentColor;
    opacity: 0.35;
    animation: typing-bounce 1s ease-in-out infinite;
}

.typing-dot:nth-child(2) {
    animation-delay: 0.15s;
}

.typing-dot:nth-child(3) {
    animation-delay: 0.3s;
}

@keyframes typing-bounce {

    0%,
    80%,
    100% {
        transform: translateY(0);
        opacity: 0.35;
    }

    40% {
        transform: translateY(-3px);
        opacity: 1;
    }
}
</style>
