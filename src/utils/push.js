import { apiFetch } from './api'

const VAPID_PUBLIC_KEY =
  'BKQEAS0hq7Khbxuz3hZoCtlYeGNMktqNZR2OLMeVRT3kksSTI3-m8SKkNaI7a_uRHD1xLkXkagk7daS28rDYRa4'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function getNotificationPermissionStatus() {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission
}

export async function subscribeToPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Notifikasi push tidak didukung oleh browser ini.')
  }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    throw new Error('Izin notifikasi ditolak.')
  }

  const registration = await navigator.serviceWorker.ready

  // Batalkan subskripsi lama jika ada agar menggunakan VAPID key yang baru secara bersih
  const oldSubscription = await registration.pushManager.getSubscription()
  if (oldSubscription) {
    await oldSubscription.unsubscribe()
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  })

  const response = await apiFetch('https://n8n.mbwebcreations.my.id/webhook/push-subscription', {
    method: 'POST',
    body: JSON.stringify(subscription),
  })

  if (!response.ok) {
    throw new Error('Gagal mengirimkan subskripsi ke server.')
  }

  return subscription
}
