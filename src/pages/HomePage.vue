<script setup>
import { ref, onMounted, computed } from 'vue'
import me from '../images/me.png'

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
        link: '#'
    },
    {
        id: 2,
        title: 'AI SEO Course 2025: From Zero to Page-One Results',
        issuer: 'Udemy',
        year: '2025',
        type: 'course',
        icon: 'fa-graduation-cap',
        credentialId: 'UD-12567-2025',
        link: '#'
    }
])

const openLink = (link) => {
    window.open(link, '_blank')
}

onMounted(() => {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-in-out'
        })
    }
})

const tiltX = ref(0)
const tiltY = ref(0)

const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const dx = (x - cx) / cx
    const dy = (y - cy) / cy
    tiltY.value = dx * 8
    tiltX.value = -dy * 8
}

const resetMove = () => {
    tiltX.value = 0
    tiltY.value = 0
}

const containerStyle = computed(() => ({
    perspective: '1000px'
}))

const imageStyle = computed(() => ({
    transform: `rotateX(${tiltX.value}deg) rotateY(${tiltY.value}deg)`,
    transition: 'transform 300ms cubic-bezier(0.2,0.8,0.2,1)'
}))
</script>

<template>
    <div>
        <section class="relative overflow-hidden min-h-screen text-white bg-cover bg-center bg-no-repeat"
            :style="{ backgroundImage: `url(${hero})` }" data-aos="fade-down">
            <div class="absolute inset-0 bg-black/35 backdrop-blur-sm"></div>
            <div
                class="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_22%)]">
            </div>
            <div class="relative container mx-auto px-6 py-16 lg:py-28">
                <div class="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
                    <div class="space-y-6 text-center lg:text-left">
                        <span
                            class="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm uppercase tracking-[0.24em] text-white/90 shadow-lg shadow-black/10">
                            Full Stack Web Developer</span>
                        <h2 class="text-4xl md:text-6xl font-bold leading-tight" data-aos="fade-up"
                            data-aos-delay="400">I Gede Manik Bayu Sentana</h2>
                        <p class="max-w-2xl text-lg md:text-xl text-white/90" data-aos="fade-up" data-aos-delay="600">
                            Membuat aplikasi web modern dengan Vue, Laravel, dan pengalaman full-stack yang nyaman untuk
                            tim dan pengguna.</p>
                        <div class="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                            <a href="https://www.linkedin.com/in/i-gede-manik-bayu-sentana-97a74824b/" target="_blank"
                                class="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-white/90 shadow-lg shadow-black/10">
                                <i class="fab fa-linkedin mr-2"></i> LinkedIn
                            </a>
                            <a href="https://github.com/manikbayu23" target="_blank"
                                class="inline-flex items-center justify-center rounded-full bg-white/10 border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 shadow-lg shadow-black/10">
                                <i class="fab fa-github mr-2"></i> GitHub
                            </a>
                        </div>
                        <div class="grid gap-3 md:grid-cols-3 text-sm text-white/75 mt-8 justify-center lg:justify-start"
                            data-aos="fade-up" data-aos-delay="800">
                            <div class="rounded-2xl bg-white/10 p-4">Br. Pengiangan Kawan, Bangli</div>
                            <div class="rounded-2xl bg-white/10 p-4">+62 85156117969</div>
                            <div class="rounded-2xl bg-white/10 p-4">gedemanik2001@gmail.com</div>
                        </div>
                    </div>

                    <div class="relative mx-auto w-full max-w-md" data-aos="fade-left" data-aos-delay="500">
                        <div class="rounded-full border border-white/20 bg-white/5 p-1 shadow-2xl shadow-black/20">
                            <div class="aspect-[4/5] rounded-full overflow-hidden flex items-center justify-center bg-white/5 will-change-transform"
                                @mousemove="handleMove" @mouseleave="resetMove" :style="containerStyle">
                                <img :src="me" alt="Me" class="h-full w-full object-cover animate-float"
                                    :style="imageStyle" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="about" class="py-16 transition-colors duration-300"
            :class="props.isDarkMode ? 'bg-gray-800' : 'bg-white'">
            <div class="container mx-auto px-6 max-w-4xl">
                <h3 class="text-3xl font-bold mb-8 border-b-4 border-blue-600 inline-block pb-2"
                    :class="props.isDarkMode ? 'text-white' : 'text-gray-800'">About Me</h3>
                <p class="text-lg leading-relaxed" :class="props.isDarkMode ? 'text-gray-300' : 'text-gray-700'">
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

        <section id="experience" class="py-16 transition-colors duration-300"
            :class="props.isDarkMode ? 'bg-gray-900' : 'bg-gray-100'">
            <div class="container mx-auto px-6 max-w-4xl">
                <h3 class="text-3xl font-bold mb-8 border-b-4 border-blue-600 inline-block pb-2"
                    :class="props.isDarkMode ? 'text-white' : 'text-gray-800'" data-aos="fade-right">Work Experience
                </h3>

                <div class="p-6 rounded-xl shadow-md transition-colors duration-300 hover-scale mb-6"
                    :class="props.isDarkMode ? 'bg-gray-800' : 'bg-white'" data-aos="fade-up" data-aos-delay="100">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <h4 class="text-xl font-bold" :class="props.isDarkMode ? 'text-white' : 'text-gray-800'">PT.
                            SAKA AGUNG ABADI</h4>
                        <span class="text-blue-600 font-semibold">2023 – present</span>
                    </div>
                    <p class="font-medium mb-3" :class="props.isDarkMode ? 'text-gray-400' : 'text-gray-600'">Full Stack
                        Web Developer
                    </p>
                    <ul class="list-disc list-inside space-y-2"
                        :class="props.isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                        <li>Develop and maintain internal company web applications.</li>
                        <li>Utilize Vue.js, Angular.js, and Laravel to build front-end and back-end features.</li>
                        <li>Perform debugging, performance optimization, and system maintenance.</li>
                        <li>Collaborate with the team to fulfill application development requirements.</li>
                        <li>Manage databases using PostgreSQL.</li>
                    </ul>
                </div>

                <div class="p-6 rounded-xl shadow-md transition-colors duration-300 hover-scale"
                    :class="props.isDarkMode ? 'bg-gray-800' : 'bg-white'" data-aos="fade-up" data-aos-delay="200">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div class="flex items-center gap-3">
                            <h4 class="text-xl font-bold" :class="props.isDarkMode ? 'text-white' : 'text-gray-800'">
                                Kantor Gubernur
                                Provinsi Bali</h4>
                        </div>
                        <span class="text-blue-600 font-semibold">2022</span>
                    </div>
                    <p class="font-medium mb-3" :class="props.isDarkMode ? 'text-gray-400' : 'text-gray-600'">IT Intern
                        / Trainee</p>
                    <ul class="list-disc list-inside space-y-2"
                        :class="props.isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                        <li>Assisted in the development and maintenance of the provincial government's internal web
                            applications.
                        </li>
                        <li>Provided IT support and troubleshooting for hardware and software issues across multiple
                            departments.
                        </li>
                        <li>Participated in system documentation and user manual creation for new applications.</li>
                        <li>Collaborated with the IT team to implement database management systems for government data.
                        </li>
                        <li>Developed a new web application for the Procurement of Goods and Services Bureau (Biro
                            Pengadaan Barang
                            Jasa).</li>
                    </ul>
                </div>
            </div>
        </section>

        <section id="skills" class="py-16 transition-colors duration-300"
            :class="props.isDarkMode ? 'bg-gray-800' : 'bg-white'">
            <div class="container mx-auto px-6">
                <h3 class="text-3xl font-bold mb-8 border-b-4 border-blue-600 inline-block pb-2"
                    :class="props.isDarkMode ? 'text-white' : 'text-gray-800'" data-aos="fade-right">Skills</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="p-5 rounded-lg shadow transition-all duration-300 hover-scale"
                        :class="props.isDarkMode ? 'bg-gray-700' : 'bg-gray-50'" data-aos="fade-up"
                        data-aos-delay="100">
                        <h4 class="text-xl font-bold text-blue-600 mb-3"><i class="fas fa-code mr-2"></i> Web
                            Development</h4>
                        <div class="flex flex-wrap gap-2">
                            <span class="px-3 py-1 rounded-full text-sm"
                                :class="props.isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">HTML/CSS/JS</span>
                            <span class="px-3 py-1 rounded-full text-sm"
                                :class="props.isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Vue.js/Nuxt.js</span>
                            <span class="px-3 py-1 rounded-full text-sm"
                                :class="props.isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Laravel</span>
                            <span class="px-3 py-1 rounded-full text-sm"
                                :class="props.isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Tailwind/Bootstrap</span>
                            <span class="px-3 py-1 rounded-full text-sm"
                                :class="props.isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">jQuery</span>
                            <span class="px-3 py-1 rounded-full text-sm"
                                :class="props.isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Git/GitLab</span>
                            <span class="px-3 py-1 rounded-full text-sm"
                                :class="props.isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">REST API</span>
                            <span class="px-3 py-1 rounded-full text-sm"
                                :class="props.isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Docker</span>
                        </div>
                    </div>
                    <div class="p-5 rounded-lg shadow transition-all duration-300 hover-scale"
                        :class="props.isDarkMode ? 'bg-gray-700' : 'bg-gray-50'" data-aos="fade-up"
                        data-aos-delay="200">
                        <h4 class="text-xl font-bold text-blue-600 mb-3"><i class="fas fa-database mr-2"></i> Database
                        </h4>
                        <div class="flex flex-wrap gap-2">
                            <span class="px-3 py-1 rounded-full text-sm"
                                :class="props.isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">PostgreSQL</span>
                            <span class="px-3 py-1 rounded-full text-sm"
                                :class="props.isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">MySQL</span>
                        </div>
                    </div>
                    <div class="p-5 rounded-lg shadow transition-all duration-300 hover-scale"
                        :class="props.isDarkMode ? 'bg-gray-700' : 'bg-gray-50'" data-aos="fade-up"
                        data-aos-delay="300">
                        <h4 class="text-xl font-bold text-blue-600 mb-3"><i class="fas fa-paint-brush mr-2"></i> UI/UX
                            Design</h4>
                        <div class="flex flex-wrap gap-2">
                            <span class="px-3 py-1 rounded-full text-sm"
                                :class="props.isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Figma</span>
                            <span class="px-3 py-1 rounded-full text-sm"
                                :class="props.isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Wireframe</span>
                            <span class="px-3 py-1 rounded-full text-sm"
                                :class="props.isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Prototype</span>
                        </div>
                    </div>
                    <div class="p-5 rounded-lg shadow transition-all duration-300 hover-scale"
                        :class="props.isDarkMode ? 'bg-gray-700' : 'bg-gray-50'" data-aos="fade-up"
                        data-aos-delay="400">
                        <h4 class="text-xl font-bold text-blue-600 mb-3"><i class="fas fa-palette mr-2"></i> Graphic
                            Design</h4>
                        <div class="flex flex-wrap gap-2">
                            <span class="px-3 py-1 rounded-full text-sm"
                                :class="props.isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">CorelDraw</span>
                            <span class="px-3 py-1 rounded-full text-sm"
                                :class="props.isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Adobe
                                Illustrator</span>
                            <span class="px-3 py-1 rounded-full text-sm"
                                :class="props.isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Logo/Brosur/Katalog</span>
                        </div>
                    </div>
                    <div class="p-5 rounded-lg shadow transition-all duration-300 hover-scale"
                        :class="props.isDarkMode ? 'bg-gray-700' : 'bg-gray-50'" data-aos="fade-up"
                        data-aos-delay="500">
                        <h4 class="text-xl font-bold text-blue-600 mb-3"><i class="fas fa-users mr-2"></i> Soft Skills
                        </h4>
                        <div class="flex flex-wrap gap-2">
                            <span class="px-3 py-1 rounded-full text-sm"
                                :class="props.isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Teamwork</span>
                            <span class="px-3 py-1 rounded-full text-sm"
                                :class="props.isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Communication</span>
                            <span class="px-3 py-1 rounded-full text-sm"
                                :class="props.isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200'">Adaptive & Fast
                                Learner</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="portfolio" class="py-16 transition-colors duration-300"
            :class="props.isDarkMode ? 'bg-gray-900' : 'bg-gray-100'">
            <div class="container mx-auto px-6">
                <h3 class="text-3xl font-bold mb-8 border-b-4 border-blue-600 inline-block pb-2"
                    :class="props.isDarkMode ? 'text-white' : 'text-gray-800'" data-aos="fade-right">Portfolio</h3>
                <div class="space-y-8">
                    <div class="p-6 rounded-xl shadow-md transition-all duration-300 hover-scale"
                        :class="props.isDarkMode ? 'bg-gray-800' : 'bg-white'" data-aos="fade-up" data-aos-delay="100">
                        <div class="flex flex-col md:flex-row justify-between items-start mb-4">
                            <h4 class="text-xl font-bold" :class="props.isDarkMode ? 'text-white' : 'text-gray-800'">ERP
                                System - PT. Saka
                                Agung Abadi</h4>
                            <span class="text-sm px-3 py-1 rounded-full"
                                :class="props.isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200'">Internal
                                Company</span>
                        </div>
                        <p class="text-sm text-blue-600 mb-3">PHP, Laravel, PostgreSQL, Angular.js, Vue.js, Bootstrap,
                            AJAX</p>
                        <p class="mb-3" :class="props.isDarkMode ? 'text-gray-300' : 'text-gray-700'">Full-stack
                            development & maintenance
                            untuk modul: HR, Logistik,
                            Warehouse, Finance, Accounting, General Affairs.</p>
                        <div class="text-sm space-y-1" :class="props.isDarkMode ? 'text-gray-400' : 'text-gray-600'">
                            <p><strong>Sales Module Web:</strong> orders, invoices, customers, visits</p>
                            <p><strong>Sales Module API:</strong> RESTful API untuk mobile app (order entry, sync data,
                                real-time integration)</p>
                            <p>Handle debugging, query optimization, new features, dan integrasi antar modul.</p>
                        </div>
                    </div>
                    <div class="p-6 rounded-xl shadow-md transition-all duration-300 hover-scale"
                        :class="props.isDarkMode ? 'bg-gray-800' : 'bg-white'" data-aos="fade-up" data-aos-delay="200">
                        <div class="flex flex-col md:flex-row justify-between items-start mb-4">
                            <h4 class="text-xl font-bold" :class="props.isDarkMode ? 'text-white' : 'text-gray-800'">
                                Asset Management &
                                Lending System - Desa Ungasan</h4>
                            <a href="https://manata.silagas.id" target="_blank"
                                class="text-blue-600 text-sm hover:underline">🔗
                                manata.silagas.id</a>
                        </div>
                        <p class="text-sm text-blue-600 mb-3">Laravel, MySQL, JavaScript, Bootstrap, AJAX</p>
                        <p :class="props.isDarkMode ? 'text-gray-300' : 'text-gray-700'">A digital system for recording,
                            monitoring, and
                            managing all village assets. Features: Asset Management, Lending System, Admin Panel.</p>
                    </div>
                    <div class="p-6 rounded-xl shadow-md transition-all duration-300 hover-scale"
                        :class="props.isDarkMode ? 'bg-gray-800' : 'bg-white'" data-aos="fade-up" data-aos-delay="300">
                        <div class="flex flex-col md:flex-row justify-between items-start mb-4">
                            <h4 class="text-xl font-bold" :class="props.isDarkMode ? 'text-white' : 'text-gray-800'">
                                Company Profile & Tour
                                Booking - GOAT Bali Cycling & Tours</h4>
                            <a href="https://goatbali.com" target="_blank"
                                class="text-blue-600 text-sm hover:underline">🔗
                                goatbali.com</a>
                        </div>
                        <p class="text-sm text-blue-600 mb-3">PHP, MySQL, JavaScript, Bootstrap, AJAX</p>
                        <p :class="props.isDarkMode ? 'text-gray-300' : 'text-gray-700'">A digital system for recording,
                            monitoring, and
                            managing all village assets. Features: Asset Management, Lending System, Admin Panel.</p>
                    </div>
                    <div class="p-6 rounded-xl shadow-md transition-all duration-300 hover-scale"
                        :class="props.isDarkMode ? 'bg-gray-800' : 'bg-white'" data-aos="fade-up" data-aos-delay="400">
                        <div class="flex flex-col md:flex-row justify-between items-start mb-4">
                            <h4 class="text-xl font-bold" :class="props.isDarkMode ? 'text-white' : 'text-gray-800'">
                                Consultation
                                Information System - Kantor Gubernur Provinsi Bali</h4>
                            <span class="text-sm px-3 py-1 rounded-full"
                                :class="props.isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200'">Internship
                                Project</span>
                        </div>
                        <p class="text-sm text-blue-600 mb-3">PHP, Laravel, MySQL, JavaScript, Bootstrap, AJAX</p>
                        <p class="mb-3" :class="props.isDarkMode ? 'text-gray-300' : 'text-gray-700'">Developed a
                            comprehensive
                            Consultation Information System for the Procurement of Goods and Services Bureau during
                            internship at the
                            Governor's Office of Bali Province.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="certifications" class="py-16 transition-colors duration-300"
            :class="props.isDarkMode ? 'bg-gray-800' : 'bg-white'">
            <div class="container mx-auto px-6">
                <h3 class="text-3xl font-bold mb-8 border-b-4 border-blue-600 inline-block pb-2"
                    :class="props.isDarkMode ? 'text-white' : 'text-gray-800'" data-aos="fade-right">Training &
                    Certifications</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="cert in certifications" :key="cert.id"
                        class="p-6 rounded-xl shadow-md transition-all duration-300 hover-scale cursor-pointer"
                        :class="props.isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:shadow-xl'"
                        data-aos="fade-up" :data-aos-delay="cert.id * 100" @click="openLink(cert.link)">
                        <div class="flex items-start justify-between mb-4">
                            <i :class="`fas ${cert.icon} text-3xl text-blue-600`"></i>
                            <span class="text-xs px-2 py-1 rounded-full"
                                :class="cert.type === 'certificate' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'">
                                {{ cert.type === 'certificate' ? 'Certificate' : 'Course' }}
                            </span>
                        </div>
                        <h4 class="text-lg font-bold mb-2" :class="props.isDarkMode ? 'text-white' : 'text-gray-800'">{{
                            cert.title }}
                        </h4>
                        <p class="text-sm mb-2" :class="props.isDarkMode ? 'text-gray-400' : 'text-gray-600'">
                            <i class="fas fa-building mr-1"></i> {{ cert.issuer }}
                        </p>
                        <p class="text-xs mb-3" :class="props.isDarkMode ? 'text-gray-500' : 'text-gray-500'">
                            <i class="fas fa-calendar-alt mr-1"></i> {{ cert.year }}
                        </p>
                        <div class="flex items-center justify-between mt-3 pt-3 border-t"
                            :class="props.isDarkMode ? 'border-gray-600' : 'border-gray-200'">
                            <p class="text-xs" :class="props.isDarkMode ? 'text-gray-500' : 'text-gray-500'">
                                <i class="fas fa-id-card mr-1"></i> {{ cert.credentialId }}
                            </p>
                            <i class="fas fa-external-link-alt text-blue-600 text-sm"></i>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <footer class="py-8 transition-colors duration-300" :class="props.isDarkMode ? 'bg-gray-950' : 'bg-gray-800'">
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
.animate-float {
    animation: floatY 4s ease-in-out infinite;
}

@keyframes floatY {
    0% {
        transform: translateY(-6px);
    }

    50% {
        transform: translateY(6px);
    }

    100% {
        transform: translateY(-6px);
    }
}

.will-change-transform {
    will-change: transform;
}
</style>
