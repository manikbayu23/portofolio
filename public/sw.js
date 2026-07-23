const CACHE_NAME = 'manikbayu-pwa-v1'
const CACHE_ASSETS = ['/', '/index.html', '/favicon.ico', '/manifest.json']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHE_ASSETS))
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)

  // Jangan cache request ke API Webhook n8n agar data selalu aktual dari database
  if (url.hostname.includes('n8n.mbwebcreations.my.id') || url.pathname.includes('/webhook')) {
    event.respondWith(fetch(event.request))
    return
  }

  // Hindari caching skema non-http (seperti ekstensi browser)
  if (!url.protocol.startsWith('http')) return

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }
      return fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone())
            return networkResponse
          })
        })
        .catch((err) => {
          // Hanya kembalikan index.html jika rute navigasi HTML yang diminta offline
          if (
            event.request.mode === 'navigate' ||
            (event.request.headers.get('accept') &&
              event.request.headers.get('accept').includes('text/html'))
          ) {
            return caches.match('/index.html')
          }
          // Biarkan request aset statis lain (js/css/png) fail secara wajar
          throw err
        })
    })
  )
})

// Listen for Web Push Notifications
self.addEventListener('push', (event) => {
  let data = { title: 'Pemberitahuan Baru', body: 'Ada pesan baru dari Baydi.' }
  if (event.data) {
    try {
      data = event.data.json()
    } catch (e) {
      data = { title: 'Pemberitahuan Baru', body: event.data.text() }
    }
  }

  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: data.data || {},
    vibrate: [100, 50, 100],
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Open App on Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus if window already open
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus()
        }
      }
      // Otherwise open new window
      if (clients.openWindow) {
        return clients.openWindow('/')
      }
    })
  )
})

