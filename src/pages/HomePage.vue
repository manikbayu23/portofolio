<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import me from '../images/me.png'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({ isDarkMode: Boolean })

const certifications = ref([
  {
    id: 1,
    title: 'Full Stack Web Developer',
    issuer: 'Bisma Informatika',
    year: '2023',
    type: 'certificate',
    icon: 'fa-certificate',
    credentialId: 'BISMA-FSWD-2023-042',
    link: '#',
  },
  {
    id: 2,
    title: 'AI SEO Course 2025: From Zero to Page-One Results',
    issuer: 'Udemy',
    year: '2025',
    type: 'course',
    icon: 'fa-graduation-cap',
    credentialId: 'UD-12567-2025',
    link: '#',
  },
  {
    id: 3,
    title: 'ARTIFICIAL INTELLIGENCE & AUTOMATION BOOTCAMP',
    issuer: 'MySkill',
    year: '2026',
    type: 'certificate',
    icon: 'fa-robot',
    credentialId: 'MS-AIAUTO-2026-088',
    link: '#',
  },
])

const contactForm = ref({ name: '', email: '', message: '' })
const isSending = ref(false)
const showSuccessToast = ref(false)

const handleContactSubmit = () => {
  isSending.value = true
  setTimeout(() => {
    isSending.value = false
    showSuccessToast.value = true
    contactForm.value = { name: '', email: '', message: '' }
    setTimeout(() => {
      showSuccessToast.value = false
    }, 4000)
  }, 1500)
}

const openLink = (link) => {
  if (link && link !== '#') window.open(link, '_blank')
}

// 3D Card Tilt Effect
const cardRef = ref(null)
const shineRef = ref(null)

const onCardMove = (e) => {
  const el = cardRef.value
  const shine = shineRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  const rotX = -(y / (rect.height / 2)) * 12
  const rotY = (x / (rect.width / 2)) * 12
  const px = ((e.clientX - rect.left) / rect.width) * 100
  const py = ((e.clientY - rect.top) / rect.height) * 100
  gsap.to(el, {
    rotateX: rotX,
    rotateY: rotY,
    transformPerspective: 1000,
    duration: 0.35,
    ease: 'power2.out',
    overwrite: 'auto',
  })
  if (shine) {
    gsap.to(shine, {
      background: `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%)`,
      duration: 0.35,
      overwrite: 'auto',
    })
  }
}

const onCardLeave = () => {
  const el = cardRef.value
  const shine = shineRef.value
  if (!el) return
  gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' })
  if (shine) {
    gsap.to(shine, {
      background:
        'radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 70%)',
      duration: 0.8,
      overwrite: 'auto',
    })
  }
}

const createScrollAnim = (selector, trigger, fromVars) => {
  // Ensure visibility is guaranteed via CSS first, then animate on top
  gsap.fromTo(
    selector,
    { ...fromVars, opacity: 0 },
    {
      ...Object.fromEntries(
        Object.keys(fromVars).map((k) => [
          k,
          k === 'x' || k === 'y' ? 0 : k === 'scale' ? 1 : fromVars[k],
        ]),
      ),
      opacity: 1,
      scrollTrigger: {
        trigger,
        start: 'top 95%',
        once: true,
        onEnter: (self) => self.animation.play(),
      },
      immediateRender: false,
      paused: true,
    },
  )
}

onMounted(() => {
  // Hero entrance animation
  const heroTl = gsap.timeline({ delay: 0.1 })
  heroTl
    .fromTo(
      '.hero-badge',
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' },
    )
    .fromTo(
      '.hero-title-line',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: 'power4.out' },
      '-=0.5',
    )
    .fromTo(
      '.hero-desc',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.6',
    )
    .fromTo(
      '.hero-btns',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.6',
    )
    .fromTo(
      '.hero-contact-info',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.6',
    )
    .fromTo(
      '.hero-card-container',
      { scale: 0.85, opacity: 0, rotationY: 30 },
      { scale: 1, opacity: 1, rotationY: 0, duration: 1.2, ease: 'power4.out' },
      '-=1.2',
    )

  // Floating avatar loop
  gsap.to('.floating-avatar', { y: -12, duration: 3, ease: 'power1.inOut', yoyo: true, repeat: -1 })

  // ---- SCROLL-TRIGGERED ANIMATIONS ----
  // Use IntersectionObserver as a reliable fallback for section visibility
  const revealSections = [
    { selector: '#about-content', trigger: '#about', from: { y: 50 } },
    { selector: '.experience-card', trigger: '#experience', from: { y: 40 }, stagger: 0.2 },
    { selector: '.skill-category-card', trigger: '#skills', from: { y: 40 }, stagger: 0.12 },
    {
      selector: '.portfolio-card',
      trigger: '#portfolio',
      from: { scale: 0.92, y: 30 },
      stagger: 0.15,
    },
    { selector: '.cert-card', trigger: '#certifications', from: { y: 30 }, stagger: 0.12 },
    { selector: '.contact-form-card', trigger: '#contact', from: { y: 40 } },
  ]

  revealSections.forEach(({ selector, trigger, from: fromVars, stagger }) => {
    const targets = document.querySelectorAll(selector)
    if (!targets.length) return

    // Set initial state explicitly
    gsap.set(targets, { ...fromVars, opacity: 0 })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(targets, {
              ...Object.fromEntries(Object.keys(fromVars).map((k) => [k, k === 'scale' ? 1 : 0])),
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              stagger: stagger || 0,
              onComplete: () => observer.disconnect(),
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' },
    )

    const triggerEl = document.querySelector(trigger)
    if (triggerEl) observer.observe(triggerEl)
  })

  setTimeout(() => ScrollTrigger.refresh(), 300)
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((t) => t.kill())
})
</script>

<template>
  <div class="relative overflow-x-hidden">
    <!-- Ambient glow blobs -->
    <div
      class="fixed top-20 left-1/4 w-96 h-96 bg-blue-500/8 dark:bg-cyan-500/8 rounded-full blur-3xl pointer-events-none z-0"
    ></div>
    <div
      class="fixed top-1/3 right-1/4 w-[450px] h-[450px] bg-indigo-500/8 dark:bg-purple-500/8 rounded-full blur-3xl pointer-events-none z-0"
    ></div>

    <!-- HERO SECTION -->
    <section class="relative min-h-[92vh] flex items-center py-20">
      <div class="container mx-auto px-6 max-w-7xl relative z-10">
        <div class="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <!-- Text Content -->
          <div class="space-y-6 text-center lg:text-left">
            <div
              class="hero-badge inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border"
              :class="
                props.isDarkMode
                  ? 'bg-slate-900/70 border-slate-800 text-cyan-400'
                  : 'bg-white border-slate-200 text-blue-600'
              "
            >
              <span class="w-2 h-2 rounded-full bg-cyan-400 dark:bg-cyan-400 animate-pulse"></span>
              Full Stack Web Developer
            </div>

            <h1
              class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none overflow-hidden"
              :class="props.isDarkMode ? 'text-white' : 'text-slate-900'"
            >
              <span class="hero-title-line block">I Gede Manik</span>
              <span
                class="hero-title-line block mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent"
                >Bayu Sentana</span
              >
            </h1>

            <p
              class="hero-desc max-w-2xl text-lg md:text-xl font-medium leading-relaxed"
              :class="props.isDarkMode ? 'text-slate-300' : 'text-slate-600'"
            >
              Membuat aplikasi web modern menggunakan
              <strong class="text-blue-500 dark:text-cyan-400 font-semibold">Vue, Laravel,</strong>
              dan pengalaman full-stack komprehensif yang dirancang untuk kemudahan tim dan kepuasan
              pengguna.
            </p>

            <div class="hero-btns flex flex-wrap gap-4 justify-center lg:justify-start">
              <a
                href="https://www.linkedin.com/in/i-gede-manik-bayu-sentana-97a74824b/"
                target="_blank"
                class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-blue-500/20"
              >
                <i class="fab fa-linkedin mr-2"></i> LinkedIn
              </a>
              <a
                href="https://github.com/manikbayu23"
                target="_blank"
                class="inline-flex items-center justify-center rounded-xl border px-6 py-3.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.03]"
                :class="
                  props.isDarkMode
                    ? 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-white'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                "
              >
                <i class="fab fa-github mr-2"></i> GitHub
              </a>
            </div>

            <div
              class="hero-contact-info grid gap-3 sm:grid-cols-3 text-xs mt-8 border-t pt-6"
              :class="
                props.isDarkMode
                  ? 'border-slate-900 text-slate-400'
                  : 'border-slate-200 text-slate-500'
              "
            >
              <!-- <div class="flex items-center justify-center lg:justify-start gap-2">
                <i class="fas fa-map-marker-alt text-blue-500 dark:text-cyan-400"></i> Bangli, Bali,
                ID
              </div> -->
              <!-- <div class="flex items-center justify-center lg:justify-start gap-2">
                <i class="fas fa-phone-alt text-blue-500 dark:text-cyan-400"></i> +62 851 5611 7969
              </div> -->
              <div class="flex items-center justify-center lg:justify-start gap-2">
                <i class="fas fa-envelope text-blue-500 dark:text-cyan-400"></i>
                gedemanik2001@gmail.com
              </div>
            </div>
          </div>

          <!-- Circular 3D Avatar Card -->
          <div class="hero-card-container flex items-center justify-center">
            <div
              ref="cardRef"
              @mousemove="onCardMove"
              @mouseleave="onCardLeave"
              class="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full cursor-pointer preserve-3d group"
              style="transform-style: preserve-3d"
            >
              <!-- Neon Aura Ring -->
              <div
                class="absolute -inset-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 rounded-full opacity-30 group-hover:opacity-50 blur-xl transition duration-700 pointer-events-none animate-pulse-slow"
              ></div>
              <!-- Secondary outer ring -->
              <div
                class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full opacity-15 pointer-events-none"
              ></div>

              <!-- Inner circular wrapper -->
              <div
                class="absolute inset-2 rounded-full overflow-hidden bg-slate-950 dark:bg-slate-900 pointer-events-none select-none ring-1 ring-white/5"
              >
                <!-- Tech badge overlays -->
                <div
                  class="absolute top-6 left-6 px-2.5 py-1 rounded-full text-[9px] font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/50 z-20"
                >
                  Vue 3
                </div>
                <div
                  class="absolute bottom-6 right-6 px-2.5 py-1 rounded-full text-[9px] font-bold text-red-400 bg-red-950/80 border border-red-800/50 z-20"
                >
                  Laravel
                </div>
                <!-- Profile photo -->
                <img
                  :src="me"
                  alt="I Gede Manik Bayu Sentana"
                  class="floating-avatar h-full w-full object-cover object-top"
                />
                <!-- Shine overlay -->
                <div
                  ref="shineRef"
                  class="absolute inset-0 z-30 rounded-full pointer-events-none mix-blend-overlay transition-all"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ABOUT SECTION -->
    <section
      id="about"
      class="py-20 transition-colors duration-500"
      :class="props.isDarkMode ? 'bg-slate-900/40' : 'bg-white'"
    >
      <div class="container mx-auto px-6 max-w-4xl">
        <div id="about-content">
          <h2
            class="text-3xl font-bold tracking-tight inline-block pb-2 mb-8 border-b-4 border-blue-600 dark:border-cyan-400"
            :class="props.isDarkMode ? 'text-white' : 'text-slate-800'"
          >
            About Me
          </h2>
          <p
            class="text-lg leading-relaxed"
            :class="props.isDarkMode ? 'text-slate-300' : 'text-slate-600'"
          >
            Saya adalah lulusan Teknologi Informasi dari
            <strong class="text-blue-500 dark:text-cyan-400 font-semibold"
              >Institut Teknologi dan Bisnis STIKOM Bali</strong
            >. Saat ini aktif bekerja sebagai
            <strong class="text-blue-500 dark:text-cyan-400 font-semibold"
              >Full Stack Web Developer</strong
            >
            di PT. Saka Agung Abadi (2023 – Sekarang). <br /><br />
            Spesialisasi dalam pengembangan web modern menggunakan
            <strong
              class="font-semibold"
              :class="props.isDarkMode ? 'text-white' : 'text-slate-800'"
              >Vue.js, Laravel, dan PostgreSQL/MySQL</strong
            >. Didukung pengalaman UI/UX design (Figma) serta Graphic Design yang kuat.
          </p>
        </div>
      </div>
    </section>

    <!-- EXPERIENCE SECTION -->
    <section
      id="experience"
      class="py-20 transition-colors duration-500"
      :class="props.isDarkMode ? 'bg-slate-950/40' : 'bg-slate-50'"
    >
      <div class="container mx-auto px-6 max-w-4xl">
        <h2
          class="text-3xl font-bold tracking-tight inline-block pb-2 mb-16 border-b-4 border-blue-600 dark:border-cyan-400"
          :class="props.isDarkMode ? 'text-white' : 'text-slate-800'"
        >
          Work Experience
        </h2>

        <div
          class="relative border-l-2 pl-8 space-y-10"
          :class="props.isDarkMode ? 'border-slate-800' : 'border-slate-200'"
        >
          <div class="experience-card relative group">
            <div
              class="absolute -left-[41px] top-2 w-5 h-5 rounded-full border-4 transition-colors"
              :class="
                props.isDarkMode
                  ? 'bg-slate-950 border-slate-800 group-hover:border-cyan-400'
                  : 'bg-white border-slate-300 group-hover:border-blue-600'
              "
            ></div>
            <div
              class="p-6 rounded-2xl border transition-all duration-300"
              :class="
                props.isDarkMode
                  ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 hover:shadow-md'
              "
            >
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
                <h3
                  class="text-xl font-bold"
                  :class="props.isDarkMode ? 'text-white' : 'text-slate-900'"
                >
                  PT. SAKA AGUNG ABADI
                </h3>
                <span
                  class="text-sm font-semibold"
                  :class="props.isDarkMode ? 'text-cyan-400' : 'text-blue-600'"
                  >2023 – Sekarang</span
                >
              </div>
              <p
                class="text-sm font-medium mb-4"
                :class="props.isDarkMode ? 'text-slate-400' : 'text-slate-500'"
              >
                Full Stack Web Developer
              </p>
              <ul
                class="list-disc list-inside space-y-1.5 text-sm"
                :class="props.isDarkMode ? 'text-slate-300' : 'text-slate-600'"
              >
                <li>Mengembangkan dan memelihara aplikasi web ERP internal perusahaan.</li>
                <li>
                  Menggunakan Vue.js, Angular.js, dan Laravel untuk membangun fitur front-end &
                  back-end.
                </li>
                <li>Debugging mendalam, optimasi query, dan perawatan rutin sistem PostgreSQL.</li>
              </ul>
            </div>
          </div>

          <div class="experience-card relative group">
            <div
              class="absolute -left-[41px] top-2 w-5 h-5 rounded-full border-4 transition-colors"
              :class="
                props.isDarkMode
                  ? 'bg-slate-950 border-slate-800 group-hover:border-cyan-400'
                  : 'bg-white border-slate-300 group-hover:border-blue-600'
              "
            ></div>
            <div
              class="p-6 rounded-2xl border transition-all duration-300"
              :class="
                props.isDarkMode
                  ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 hover:shadow-md'
              "
            >
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
                <h3
                  class="text-xl font-bold"
                  :class="props.isDarkMode ? 'text-white' : 'text-slate-900'"
                >
                  Kantor Gubernur Provinsi Bali
                </h3>
                <span
                  class="text-sm font-semibold"
                  :class="props.isDarkMode ? 'text-cyan-400' : 'text-blue-600'"
                  >2022</span
                >
              </div>
              <p
                class="text-sm font-medium mb-4"
                :class="props.isDarkMode ? 'text-slate-400' : 'text-slate-500'"
              >
                IT Intern / Trainee
              </p>
              <ul
                class="list-disc list-inside space-y-1.5 text-sm"
                :class="props.isDarkMode ? 'text-slate-300' : 'text-slate-600'"
              >
                <li>Membantu merancang dan memelihara aplikasi web dinas gubernur.</li>
                <li>Troubleshooting hardware, jaringan lokal, dan software antar departemen.</li>
                <li>
                  Membangun aplikasi web baru untuk Biro Pengadaan Barang Jasa (PBJ) Prov. Bali.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SKILLS SECTION -->
    <section
      id="skills"
      class="py-20 transition-colors duration-500"
      :class="props.isDarkMode ? 'bg-slate-900/40' : 'bg-white'"
    >
      <div class="container mx-auto px-6 max-w-6xl">
        <h2
          class="text-3xl font-bold tracking-tight inline-block pb-2 mb-16 border-b-4 border-blue-600 dark:border-cyan-400"
          :class="props.isDarkMode ? 'text-white' : 'text-slate-800'"
        >
          Skills
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(cat, idx) in [
              {
                title: 'Web Development',
                icon: 'fa-code',
                skills: [
                  'HTML5/CSS3/JS',
                  'Vue.js/Nuxt.js',
                  'Laravel',
                  'Tailwind CSS',
                  'jQuery',
                  'Git/GitLab',
                  'REST API',
                  'Docker',
                ],
              },
              {
                title: 'Database',
                icon: 'fa-database',
                skills: ['PostgreSQL', 'MySQL', 'Query Optimization', 'Relational DB'],
              },
              {
                title: 'UI/UX Design',
                icon: 'fa-paint-brush',
                skills: ['Figma', 'Wireframing', 'Prototyping', 'User Flow'],
              },
              {
                title: 'Graphic Design',
                icon: 'fa-palette',
                skills: ['CorelDraw', 'Adobe Illustrator', 'Brand Identity'],
              },
              {
                title: 'AI & Automation',
                icon: 'fa-robot',
                skills: [
                  'Generative AI Prompting & Optimization',
                  'AI-Assisted Development (Vibe Coding)',
                  'AI No-Code Web Building',
                  'Advanced Workflow Automation (n8n)',
                  'Multi-Platform Integration',
                  'Social Media & Marketing Automation',
                  'AI Chatbot Development & Deployment',
                ],
              },
              {
                title: 'Soft Skills',
                icon: 'fa-users',
                skills: ['Teamwork', 'Communication', 'Fast Learner', 'Problem Solving'],
              },
            ]"
            :key="idx"
            class="skill-category-card p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02]"
            :class="
              props.isDarkMode
                ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:shadow-md'
            "
          >
            <h3
              class="text-base font-bold text-blue-600 dark:text-cyan-400 mb-4 flex items-center gap-2"
            >
              <i :class="`fas ${cat.icon}`"></i> {{ cat.title }}
            </h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="skill in cat.skills"
                :key="skill"
                class="px-3 py-1 text-xs rounded-lg font-medium"
                :class="
                  props.isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                "
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PORTFOLIO SECTION -->
    <section
      id="portfolio"
      class="py-20 transition-colors duration-500"
      :class="props.isDarkMode ? 'bg-slate-950/40' : 'bg-slate-50'"
    >
      <div class="container mx-auto px-6 max-w-6xl">
        <h2
          class="text-3xl font-bold tracking-tight inline-block pb-2 mb-16 border-b-4 border-blue-600 dark:border-cyan-400"
          :class="props.isDarkMode ? 'text-white' : 'text-slate-800'"
        >
          Portfolio Project
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="(project, idx) in [
              {
                title: 'ERP System – PT. Saka Agung Abadi',
                badge: 'Internal Company',
                link: null,
                tech: 'Laravel · PostgreSQL · Angular.js · Vue.js · Bootstrap',
                desc: 'Merancang dan memelihara ERP internal: HRD, Logistik, Gudang, Finansial, Akuntansi, General Affairs.',
                sub: [
                  'Modul Sales Web: invoice, order, dan customer.',
                  'RESTful API Sales Mobile: sinkronisasi data real-time.',
                ],
              },
              {
                title: 'Asset Management & Lending System',
                badge: null,
                link: 'https://manata.silagas.id',
                linkLabel: 'manata.silagas.id',
                tech: 'Laravel · MySQL · JavaScript · Bootstrap',
                desc: 'Sistem digital pencatatan dan monitoring aset serta peminjaman inventaris Desa Ungasan.',
              },
              {
                title: 'Company Profile & Tour Booking',
                badge: null,
                link: 'https://goatbali.com',
                linkLabel: 'goatbali.com',
                tech: 'PHP · MySQL · JavaScript · Bootstrap',
                desc: 'Web profil dan booking untuk GOAT Bali Cycling & Tours dengan detail paket dan sistem reservasi.',
              },
              {
                title: 'Consultation Information System',
                badge: 'Internship Project',
                link: null,
                tech: 'PHP · Laravel · MySQL · Bootstrap',
                desc: 'Sistem pelayanan konsultasi pengadaan barang/jasa di Kantor Gubernur Provinsi Bali.',
              },
              {
                title: 'Coffee Shop Web – Attalas Cafe',
                badge: null,
                link: 'https://attalascafe.com',
                linkLabel: 'attalascafe.com',
                tech: 'Laravel · Tailwind CSS · GSAP',
                desc: 'Website coffee shop modern berkinerja tinggi dengan antarmuka dinamis, animasi transisi interaktif premium, dan desain responsif.',
              },
              {
                title: 'AI Chatbot Personal Assistant',
                badge: 'AI & Automation',
                link: null,
                tech: 'Vue.js · Telegram Bot API · n8n · Generative AI · PostgreSQL',
                desc: 'Asisten chatbot pribadi pintar yang digunakan untuk manajemen pencatatan laporan keuangan mandiri, pengingat waktu (reminder), basis memori personal, dan daftar tugas (todo list) terautomasi.',
              },
            ]"
            :key="idx"
            class="portfolio-card flex flex-col p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl group"
            :class="
              props.isDarkMode
                ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300'
            "
          >
            <div class="flex flex-wrap justify-between items-start gap-2 mb-3">
              <h3
                class="text-lg font-bold transition-colors"
                :class="
                  props.isDarkMode
                    ? 'text-white group-hover:text-cyan-400'
                    : 'text-slate-900 group-hover:text-blue-600'
                "
              >
                {{ project.title }}
              </h3>
              <a
                v-if="project.link"
                :href="project.link"
                target="_blank"
                class="text-xs text-blue-500 dark:text-cyan-400 hover:underline shrink-0"
              >
                🔗 {{ project.linkLabel }}
              </a>
              <span
                v-else-if="project.badge"
                class="text-xs px-2.5 py-1 rounded-full border shrink-0"
                :class="
                  props.isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-400'
                    : 'bg-slate-100 border-slate-200 text-slate-500'
                "
              >
                {{ project.badge }}
              </span>
            </div>
            <p
              class="text-[11px] font-semibold text-blue-500 dark:text-cyan-400 mb-3 tracking-wide uppercase"
            >
              {{ project.tech }}
            </p>
            <p
              class="text-sm leading-relaxed flex-1"
              :class="props.isDarkMode ? 'text-slate-300' : 'text-slate-600'"
            >
              {{ project.desc }}
            </p>
            <div
              v-if="project.sub"
              class="mt-3 space-y-1 pl-3 border-l-2 border-slate-700 text-xs text-slate-400"
            >
              <p v-for="s in project.sub" :key="s">• {{ s }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CERTIFICATIONS SECTION -->
    <section
      id="certifications"
      class="py-20 transition-colors duration-500"
      :class="props.isDarkMode ? 'bg-slate-900/40' : 'bg-white'"
    >
      <div class="container mx-auto px-6 max-w-5xl">
        <h2
          class="text-3xl font-bold tracking-tight inline-block pb-2 mb-16 border-b-4 border-blue-600 dark:border-cyan-400"
          :class="props.isDarkMode ? 'text-white' : 'text-slate-800'"
        >
          Training & Certifications
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="cert in certifications"
            :key="cert.id"
            class="cert-card p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg cursor-pointer group"
            :class="
              props.isDarkMode
                ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300'
            "
            @click="openLink(cert.link)"
          >
            <div class="flex justify-between items-start mb-4">
              <i :class="`fas ${cert.icon} text-3xl text-blue-600 dark:text-cyan-400`"></i>
              <span
                class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border"
                :class="
                  cert.type === 'certificate'
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                "
              >
                {{ cert.type === 'certificate' ? 'Certificate' : 'Course' }}
              </span>
            </div>
            <h3
              class="text-base font-bold mb-3 leading-snug transition-colors"
              :class="
                props.isDarkMode
                  ? 'text-white group-hover:text-cyan-400'
                  : 'text-slate-900 group-hover:text-blue-600'
              "
            >
              {{ cert.title }}
            </h3>
            <div
              class="space-y-1.5 text-xs"
              :class="props.isDarkMode ? 'text-slate-400' : 'text-slate-500'"
            >
              <p class="flex items-center gap-1.5">
                <i class="fas fa-building text-[10px]"></i> {{ cert.issuer }}
              </p>
              <p class="flex items-center gap-1.5">
                <i class="fas fa-calendar-alt text-[10px]"></i> {{ cert.year }}
              </p>
              <p
                class="flex items-center gap-1.5 pt-3 border-t mt-3"
                :class="props.isDarkMode ? 'border-slate-800' : 'border-slate-200'"
              >
                <i class="fas fa-id-card text-[10px]"></i> {{ cert.credentialId }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTACT SECTION -->
    <!-- <section id="contact" class="py-20 transition-colors duration-500"
      :class="props.isDarkMode ? 'bg-slate-950/40' : 'bg-slate-50'">
      <div class="container mx-auto px-6 max-w-lg">
        <h2 class="text-3xl font-bold tracking-tight inline-block pb-2 mb-4 border-b-4 border-blue-600 dark:border-cyan-400"
          :class="props.isDarkMode ? 'text-white' : 'text-slate-800'">
          Contact Me
        </h2>
        <p class="text-sm mb-12" :class="props.isDarkMode ? 'text-slate-400' : 'text-slate-500'">Kirimkan pesan langsung melalui form di bawah ini.</p>

        <div class="contact-form-card p-8 rounded-3xl border shadow-lg"
          :class="props.isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'">
          <form @submit.prevent="handleContactSubmit" class="space-y-5">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider mb-2"
                :class="props.isDarkMode ? 'text-slate-400' : 'text-slate-600'">Nama Lengkap</label>
              <input v-model="contactForm.name" required type="text" placeholder="Masukkan nama..."
                class="w-full text-sm px-4 py-3 rounded-xl border outline-none transition-all duration-300"
                :class="props.isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-400' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-600'" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider mb-2"
                :class="props.isDarkMode ? 'text-slate-400' : 'text-slate-600'">Email</label>
              <input v-model="contactForm.email" required type="email" placeholder="example@email.com"
                class="w-full text-sm px-4 py-3 rounded-xl border outline-none transition-all duration-300"
                :class="props.isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-400' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-600'" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider mb-2"
                :class="props.isDarkMode ? 'text-slate-400' : 'text-slate-600'">Pesan</label>
              <textarea v-model="contactForm.message" required rows="4" placeholder="Ketik pesan di sini..."
                class="w-full text-sm px-4 py-3 rounded-xl border outline-none transition-all duration-300 resize-none"
                :class="props.isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-400' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-600'"></textarea>
            </div>
            <button type="submit" :disabled="isSending"
              class="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2">
              <span v-if="isSending"><i class="fas fa-spinner animate-spin"></i> Mengirim...</span>
              <span v-else><i class="fas fa-paper-plane"></i> Kirim Pesan</span>
            </button>
          </form>
          <div v-if="showSuccessToast" class="mt-4 p-4 rounded-xl border flex items-center gap-3 text-xs"
            :class="props.isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'">
            <i class="fas fa-check-circle text-base"></i>
            <div>
              <p class="font-bold">Pesan Terkirim!</p>
              <p class="opacity-90">Terima kasih, saya akan segera menghubungi Anda.</p>
            </div>
          </div>
        </div>
      </div>
    </section> -->

    <!-- FOOTER -->
    <footer
      class="py-12 border-t transition-colors duration-500"
      :class="
        props.isDarkMode
          ? 'bg-slate-950 border-slate-900 text-slate-400'
          : 'bg-slate-100 border-slate-200 text-slate-500'
      "
    >
      <div class="container mx-auto px-6 text-center max-w-4xl">
        <p class="text-sm">&copy; 2026 I Gede Manik Bayu Sentana. All rights reserved.</p>
        <div class="flex justify-center gap-6 mt-5">
          <a
            href="https://www.linkedin.com/in/i-gede-manik-bayu-sentana-97a74824b/"
            target="_blank"
            class="hover:text-blue-500 dark:hover:text-cyan-400 transition-transform hover:scale-110"
          >
            <i class="fab fa-linkedin text-xl"></i
          ></a>
          <a
            href="https://github.com/manikbayu23"
            target="_blank"
            class="hover:text-blue-500 dark:hover:text-cyan-400 transition-transform hover:scale-110"
          >
            <i class="fab fa-github text-xl"></i
          ></a>
          <a
            href="#"
            class="hover:text-blue-500 dark:hover:text-cyan-400 transition-transform hover:scale-110"
          >
            <i class="fab fa-instagram text-xl"></i
          ></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.preserve-3d {
  transform-style: preserve-3d;
}
</style>
