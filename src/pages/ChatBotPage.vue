<script setup>
import ChatWidget from '@/components/ChatWidget.vue'
const props = defineProps({ isDarkMode: Boolean })
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
      <ChatWidget :isDarkMode="props.isDarkMode" :isMini="false" />
    </div>
  </section>
</template>
