<script setup>
import { ref, onMounted } from 'vue'

// State untuk dark mode
const isDarkMode = ref(false)

// State untuk mobile menu
const isMobileMenuOpen = ref(false)

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

// Data sertifikasi
const certifications = ref([
  {
    id: 1,
    title: "Full Stack Web Developer",
    issuer: "Bisma Informatika",
    year: "2023",
    type: "certificate",
    icon: "fa-certificate",
    credentialId: "BISMA-FSWD-2023-042",
    link: "#"
  },
  {
    id: 2,
    title: "AI SEO Course 2025: From Zero to Page-One Results",
    issuer: "Udemy",
    year: "2025",
    type: "course",
    icon: "fa-graduation-cap",
    credentialId: "UD-12567-2025",
    link: "#"
  },
])

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
})

// Function untuk buka link
const openLink = (link) => {
  window.open(link, '_blank')
}
</script>

<template>
  <div :class="{ 'dark': isDarkMode }">
    <!-- Navbar (sama seperti sebelumnya) -->
    <nav class="bg-white fixed w-full top-0 z-50 transition-colors duration-300 shadow-md"
      :class="isDarkMode ? 'bg-gray-900' : 'bg-white'">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">Manik<span
            class="text-blue-600">Bayu</span></h1>

        <div class="flex items-center gap-4">
          <!-- Dark Mode Toggle Button -->
          <button @click="toggleDarkMode" class="p-2 rounded-lg transition"
            :class="isDarkMode ? 'bg-gray-800 text-gray-300 hover:text-blue-400' : 'bg-gray-100 text-gray-600 hover:text-blue-600'">
            <i v-if="!isDarkMode" class="fas fa-moon text-xl"></i>
            <i v-else class="fas fa-sun text-xl"></i>
          </button>

          <!-- Desktop Menu -->
          <div class="space-x-6 hidden md:block">
            <a href="#about" class="transition"
              :class="isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'">About</a>
            <a href="#experience" class="transition"
              :class="isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'">Experience</a>
            <a href="#skills" class="transition"
              :class="isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'">Skills</a>
            <a href="#portfolio" class="transition"
              :class="isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'">Portfolio</a>
            <a href="#certifications" class="transition"
              :class="isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'">Certifications</a>
          </div>

          <!-- Mobile Menu Button -->
          <button @click="toggleMobileMenu" class="md:hidden" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
            <i class="fas fa-bars text-2xl"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-show="isMobileMenuOpen" class="md:hidden pb-4 px-6 flex flex-col space-y-3 transition-colors duration-300"
        :class="isDarkMode ? 'bg-gray-900' : 'bg-white'">
        <a href="#about" @click="closeMobileMenu" class="transition py-2"
          :class="isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'">About</a>
        <a href="#experience" @click="closeMobileMenu" class="transition py-2"
          :class="isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'">Experience</a>
        <a href="#skills" @click="closeMobileMenu" class="transition py-2"
          :class="isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'">Skills</a>
        <a href="#portfolio" @click="closeMobileMenu" class="transition py-2"
          :class="isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'">Portfolio</a>
        <a href="#certifications" @click="closeMobileMenu" class="transition py-2"
          :class="isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'">Certifications</a>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white pt-32 pb-20" data-aos="fade-down">
      <div class="container mx-auto px-6 text-center">
        <div class="mb-6" data-aos="zoom-in" data-aos-delay="200">
          <div
            class="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg bg-white hover-scale cursor-pointer">
            <img
              src="https://ui-avatars.com/api/?name=Manik+Bayu&background=4F46E5&color=fff&size=128&bold=true&length=2"
              alt="Profile Photo" class="w-full h-full object-cover" />
          </div>
        </div>

        <h2 class="text-4xl md:text-5xl font-bold mb-4" data-aos="fade-up" data-aos-delay="400">I Gede Manik Bayu
          Sentana</h2>
        <p class="text-xl md:text-2xl mb-6" data-aos="fade-up" data-aos-delay="600">Full Stack Web Developer</p>
        <div class="flex flex-wrap justify-center gap-4 text-sm md:text-base" data-aos="fade-up" data-aos-delay="800">
          <span><i class="fas fa-map-marker-alt mr-2"></i> Br. Pengiangan Kawan, Bangli, 80661</span>
          <span><i class="fas fa-phone mr-2"></i> +62 85156117969</span>
          <span><i class="fas fa-envelope mr-2"></i> gedemanik2001@gmail.com</span>
        </div>
        <div class="mt-6 flex justify-center gap-4" data-aos="fade-up" data-aos-delay="1000">
          <a href="https://www.linkedin.com/in/i-gede-manik-bayu-sentana-97a74824b/" target="_blank"
            class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center gap-2">
            <i class="fab fa-linkedin"></i> LinkedIn
          </a>
          <a href="https://github.com/manikbayu23" target="_blank"
            class="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition inline-flex items-center gap-2">
            <i class="fab fa-github"></i> GitHub
          </a>
        </div>
      </div>
    </section>

    <!-- About Me -->
    <section id="about" class="py-16 transition-colors duration-300" :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
      <div class="container mx-auto px-6 max-w-4xl">
        <h3 class="text-3xl font-bold mb-8 border-b-4 border-blue-600 inline-block pb-2"
          :class="isDarkMode ? 'text-white' : 'text-gray-800'">About Me</h3>
        <p class="text-lg leading-relaxed" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
          I am a graduate of Information Technology from the Institute of Technology and Business STIKOM Bali.
          Currently working as a <strong class="text-blue-600">Full Stack Web Developer</strong> at PT. Saka
          Agung Abadi (2023 – present).
          <br><br>
          I have experience in web development using various modern technologies, especially
          <strong>Vue.js, Laravel, and database management</strong>. I also have strong skills in
          problem-solving, system maintenance, and teamwork. Additionally, I have experience in
          UI/UX and graphic design.
        </p>
      </div>
    </section>

    <!-- Work Experience -->
    <!-- Work Experience -->
    <section id="experience" class="py-16 transition-colors duration-300"
      :class="isDarkMode ? 'bg-gray-900' : 'bg-gray-100'">
      <div class="container mx-auto px-6 max-w-4xl">
        <h3 class="text-3xl font-bold mb-8 border-b-4 border-blue-600 inline-block pb-2"
          :class="isDarkMode ? 'text-white' : 'text-gray-800'" data-aos="fade-right">Work Experience</h3>

        <!-- Pengalaman di PT. SAKA AGUNG ABADI -->
        <div class="p-6 rounded-xl shadow-md transition-colors duration-300 hover-scale mb-6"
          :class="isDarkMode ? 'bg-gray-800' : 'bg-white'" data-aos="fade-up" data-aos-delay="100">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h4 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">PT. SAKA AGUNG ABADI</h4>
            <span class="text-blue-600 font-semibold">2023 – present</span>
          </div>
          <p class="font-medium mb-3" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">Full Stack Web Developer
          </p>
          <ul class="list-disc list-inside space-y-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
            <li>Develop and maintain internal company web applications.</li>
            <li>Utilize Vue.js, Angular.js, and Laravel to build front-end and back-end features.</li>
            <li>Perform debugging, performance optimization, and system maintenance.</li>
            <li>Collaborate with the team to fulfill application development requirements.</li>
            <li>Manage databases using PostgreSQL.</li>
          </ul>
        </div>

        <!-- Pengalaman Magang di Kantor Gubernur Provinsi Bali -->
        <div class="p-6 rounded-xl shadow-md transition-colors duration-300 hover-scale"
          :class="isDarkMode ? 'bg-gray-800' : 'bg-white'" data-aos="fade-up" data-aos-delay="200">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div class="flex items-center gap-3">
              <h4 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">Kantor Gubernur
                Provinsi Bali</h4>
            </div>
            <span class="text-blue-600 font-semibold">2022</span>
          </div>
          <p class="font-medium mb-3" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">IT Intern / Trainee</p>
          <ul class="list-disc list-inside space-y-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
            <li>Assisted in the development and maintenance of the provincial government's internal web applications.
            </li>
            <li>Provided IT support and troubleshooting for hardware and software issues across multiple departments.
            </li>
            <li>Participated in system documentation and user manual creation for new applications.</li>
            <li>Collaborated with the IT team to implement database management systems for government data.</li>
            <li>Developed a new web application for the Procurement of Goods and Services Bureau (Biro Pengadaan Barang
              Jasa).</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section id="skills" class="py-16 transition-colors duration-300" :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
      <div class="container mx-auto px-6">
        <h3 class="text-3xl font-bold mb-8 border-b-4 border-blue-600 inline-block pb-2"
          :class="isDarkMode ? 'text-white' : 'text-gray-800'" data-aos="fade-right">Skills</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Web Development -->
          <div class="p-5 rounded-lg shadow transition-all duration-300 hover-scale"
            :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-50'" data-aos="fade-up" data-aos-delay="100">
            <h4 class="text-xl font-bold text-blue-600 mb-3"><i class="fas fa-code mr-2"></i> Web Development</h4>
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 rounded-full text-sm"
                :class="isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">HTML/CSS/JS</span>
              <span class="px-3 py-1 rounded-full text-sm"
                :class="isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Vue.js/Nuxt.js</span>
              <span class="px-3 py-1 rounded-full text-sm"
                :class="isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Laravel</span>
              <span class="px-3 py-1 rounded-full text-sm"
                :class="isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Tailwind/Bootstrap</span>
              <span class="px-3 py-1 rounded-full text-sm"
                :class="isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">jQuery</span>
              <span class="px-3 py-1 rounded-full text-sm"
                :class="isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Git/GitLab</span>
              <span class="px-3 py-1 rounded-full text-sm"
                :class="isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">REST API</span>
              <span class="px-3 py-1 rounded-full text-sm"
                :class="isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Docker</span>
            </div>
          </div>
          <!-- Database -->
          <div class="p-5 rounded-lg shadow transition-all duration-300 hover-scale"
            :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-50'" data-aos="fade-up" data-aos-delay="200">
            <h4 class="text-xl font-bold text-blue-600 mb-3"><i class="fas fa-database mr-2"></i> Database</h4>
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 rounded-full text-sm"
                :class="isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">PostgreSQL</span>
              <span class="px-3 py-1 rounded-full text-sm"
                :class="isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">MySQL</span>
            </div>
          </div>
          <!-- UI/UX Design -->
          <div class="p-5 rounded-lg shadow transition-all duration-300 hover-scale"
            :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-50'" data-aos="fade-up" data-aos-delay="300">
            <h4 class="text-xl font-bold text-blue-600 mb-3"><i class="fas fa-paint-brush mr-2"></i> UI/UX Design</h4>
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 rounded-full text-sm"
                :class="isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Figma</span>
              <span class="px-3 py-1 rounded-full text-sm"
                :class="isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Wireframe</span>
              <span class="px-3 py-1 rounded-full text-sm"
                :class="isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Prototype</span>
            </div>
          </div>
          <!-- Graphic Design -->
          <div class="p-5 rounded-lg shadow transition-all duration-300 hover-scale"
            :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-50'" data-aos="fade-up" data-aos-delay="400">
            <h4 class="text-xl font-bold text-blue-600 mb-3"><i class="fas fa-palette mr-2"></i> Graphic Design</h4>
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 rounded-full text-sm"
                :class="isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">CorelDraw</span>
              <span class="px-3 py-1 rounded-full text-sm"
                :class="isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Adobe Illustrator</span>
              <span class="px-3 py-1 rounded-full text-sm"
                :class="isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Logo/Brosur/Katalog</span>
            </div>
          </div>
          <!-- Soft Skills -->
          <div class="p-5 rounded-lg shadow transition-all duration-300 hover-scale"
            :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-50'" data-aos="fade-up" data-aos-delay="500">
            <h4 class="text-xl font-bold text-blue-600 mb-3"><i class="fas fa-users mr-2"></i> Soft Skills</h4>
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 rounded-full text-sm"
                :class="isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Teamwork</span>
              <span class="px-3 py-1 rounded-full text-sm"
                :class="isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Communication</span>
              <span class="px-3 py-1 rounded-full text-sm"
                :class="isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Adaptive & Fast Learner</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Portfolio -->
    <section id="portfolio" class="py-16 transition-colors duration-300"
      :class="isDarkMode ? 'bg-gray-900' : 'bg-gray-100'">
      <div class="container mx-auto px-6">
        <h3 class="text-3xl font-bold mb-8 border-b-4 border-blue-600 inline-block pb-2"
          :class="isDarkMode ? 'text-white' : 'text-gray-800'" data-aos="fade-right">Portfolio</h3>
        <div class="space-y-8">
          <!-- ERP System -->
          <div class="p-6 rounded-xl shadow-md transition-all duration-300 hover-scale"
            :class="isDarkMode ? 'bg-gray-800' : 'bg-white'" data-aos="fade-up" data-aos-delay="100">
            <div class="flex flex-col md:flex-row justify-between items-start mb-4">
              <h4 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">ERP System - PT. Saka
                Agung Abadi</h4>
              <span class="text-sm px-3 py-1 rounded-full"
                :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200'">Internal Company</span>
            </div>
            <p class="text-sm text-blue-600 mb-3">PHP, Laravel, PostgreSQL, Angular.js, Vue.js, Bootstrap, AJAX</p>
            <p class="mb-3" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">Full-stack development & maintenance
              untuk modul: HR, Logistik,
              Warehouse, Finance, Accounting, General Affairs.</p>
            <div class="text-sm space-y-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
              <p><strong>Sales Module Web:</strong> orders, invoices, customers, visits</p>
              <p><strong>Sales Module API:</strong> RESTful API untuk mobile app (order entry, sync data,
                real-time integration)</p>
              <p>Handle debugging, query optimization, new features, dan integrasi antar modul.</p>
            </div>
          </div>
          <!-- Manata -->
          <div class="p-6 rounded-xl shadow-md transition-all duration-300 hover-scale"
            :class="isDarkMode ? 'bg-gray-800' : 'bg-white'" data-aos="fade-up" data-aos-delay="200">
            <div class="flex flex-col md:flex-row justify-between items-start mb-4">
              <h4 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">Asset Management &
                Lending System - Desa Ungasan</h4>
              <a href="https://manata.silagas.id" target="_blank" class="text-blue-600 text-sm hover:underline">🔗
                manata.silagas.id</a>
            </div>
            <p class="text-sm text-blue-600 mb-3">Laravel, MySQL, JavaScript, Bootstrap, AJAX</p>
            <p :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">A digital system for recording, monitoring, and
              managing all village assets. Features: Asset Management, Lending System, Admin Panel.</p>
          </div>
          <!-- GOAT Bali -->
          <div class="p-6 rounded-xl shadow-md transition-all duration-300 hover-scale"
            :class="isDarkMode ? 'bg-gray-800' : 'bg-white'" data-aos="fade-up" data-aos-delay="300">
            <div class="flex flex-col md:flex-row justify-between items-start mb-4">
              <h4 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">Company Profile & Tour
                Booking - GOAT Bali Cycling & Tours</h4>
              <a href="https://goatbali.com" target="_blank" class="text-blue-600 text-sm hover:underline">🔗
                goatbali.com</a>
            </div>
            <p class="text-sm text-blue-600 mb-3">PHP, MySQL, JavaScript, Bootstrap, AJAX</p>
            <p :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">A digital system for recording, monitoring, and
              managing all village assets. Features: Asset Management, Lending System, Admin Panel.</p>
          </div>

          <!-- Di dalam section Portfolio, tambahkan card baru untuk sistem konsultasi -->
          <div class="p-6 rounded-xl shadow-md transition-all duration-300 hover-scale"
            :class="isDarkMode ? 'bg-gray-800' : 'bg-white'" data-aos="fade-up" data-aos-delay="400">
            <div class="flex flex-col md:flex-row justify-between items-start mb-4">
              <h4 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">Consultation
                Information System - Kantor Gubernur Provinsi Bali</h4>
              <span class="text-sm px-3 py-1 rounded-full"
                :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200'">Internship Project</span>
            </div>
            <p class="text-sm text-blue-600 mb-3">PHP, Laravel, MySQL, JavaScript, Bootstrap, AJAX</p>
            <p class="mb-3" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">Developed a comprehensive
              Consultation Information System for the Procurement of Goods and Services Bureau during internship at the
              Governor's Office of Bali Province.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Training & Certifications -->
    <section id="certifications" class="py-16 transition-colors duration-300"
      :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
      <div class="container mx-auto px-6">
        <h3 class="text-3xl font-bold mb-8 border-b-4 border-blue-600 inline-block pb-2"
          :class="isDarkMode ? 'text-white' : 'text-gray-800'" data-aos="fade-right">Training & Certifications</h3>

        <!-- Statistics Cards -->
        <!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" data-aos="fade-up" data-aos-delay="100">
          <div class="p-6 rounded-xl shadow-md text-center transition-all duration-300 hover-scale"
            :class="isDarkMode ? 'bg-gray-700' : 'bg-blue-50'">
            <i class="fas fa-certificate text-4xl text-blue-600 mb-3"></i>
            <h4 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">2+</h4>
            <p class="text-gray-600 dark:text-gray-300">Certifications</p>
          </div>
          <div class="p-6 rounded-xl shadow-md text-center transition-all duration-300 hover-scale"
            :class="isDarkMode ? 'bg-gray-700' : 'bg-green-50'">
            <i class="fas fa-clock text-4xl text-green-600 mb-3"></i>
            <h4 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">200+</h4>
            <p class="text-gray-600 dark:text-gray-300">Learning Hours</p>
          </div>
          <div class="p-6 rounded-xl shadow-md text-center transition-all duration-300 hover-scale"
            :class="isDarkMode ? 'bg-gray-700' : 'bg-purple-50'">
            <i class="fas fa-trophy text-4xl text-purple-600 mb-3"></i>
            <h4 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">15+</h4>
            <p class="text-gray-600 dark:text-gray-300">Projects Completed</p>
          </div>
        </div> -->

        <!-- Certifications Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="cert in certifications" :key="cert.id"
            class="p-6 rounded-xl shadow-md transition-all duration-300 hover-scale cursor-pointer"
            :class="isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:shadow-xl'" data-aos="fade-up"
            :data-aos-delay="cert.id * 100" @click="openLink(cert.link)">
            <div class="flex items-start justify-between mb-4">
              <i :class="`fas ${cert.icon} text-3xl text-blue-600`"></i>
              <span class="text-xs px-2 py-1 rounded-full"
                :class="cert.type === 'certificate' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'">
                {{ cert.type === 'certificate' ? 'Certificate' : 'Course' }}
              </span>
            </div>
            <h4 class="text-lg font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-gray-800'">{{ cert.title }}
            </h4>
            <p class="text-sm mb-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
              <i class="fas fa-building mr-1"></i> {{ cert.issuer }}
            </p>
            <p class="text-xs mb-3" :class="isDarkMode ? 'text-gray-500' : 'text-gray-500'">
              <i class="fas fa-calendar-alt mr-1"></i> {{ cert.year }}
            </p>
            <div class="flex items-center justify-between mt-3 pt-3 border-t"
              :class="isDarkMode ? 'border-gray-600' : 'border-gray-200'">
              <p class="text-xs" :class="isDarkMode ? 'text-gray-500' : 'text-gray-500'">
                <i class="fas fa-id-card mr-1"></i> {{ cert.credentialId }}
              </p>
              <i class="fas fa-external-link-alt text-blue-600 text-sm"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-8 transition-colors duration-300" :class="isDarkMode ? 'bg-gray-950' : 'bg-gray-800'">
      <div class="container mx-auto px-6 text-center text-white">
        <p>&copy; 2025 I Gede Manik Bayu Sentana. All rights reserved.</p>
        <div class="flex justify-center gap-6 mt-4">
          <a href="https://www.linkedin.com/in/i-gede-manik-bayu-sentana-97a74824b/" target="_blank"
            class="hover:text-blue-400 transition transform hover:scale-110 inline-block">
            <i class="fab fa-linkedin text-xl"></i>
          </a>
          <a href="https://github.com/manikbayu23" target="_blank"
            class="hover:text-blue-400 transition transform hover:scale-110 inline-block">
            <i class="fab fa-github text-xl"></i>
          </a>
          <a href="#" class="hover:text-blue-400 transition transform hover:scale-110 inline-block">
            <i class="fab fa-twitter text-xl"></i>
          </a>
          <a href="#" class="hover:text-blue-400 transition transform hover:scale-110 inline-block">
            <i class="fab fa-instagram text-xl"></i>
          </a>
        </div>
      </div>
    </footer>
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