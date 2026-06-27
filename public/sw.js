const CACHE_NAME = 'winform-v1'
const STATIC_CACHE = 'winform-static-v1'

const STATIC_ASSETS = [
  '/',
  '/top-picks',
  '/results',
  '/world-cup',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
]

// Install — cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate — clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME && key !== STATIC_CACHE)
          .map(key => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// Fetch — network first, fall back to cache
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('api-sports.io') ||
    url.hostname.includes('thesportsdb.com') ||
    url.hostname.includes('posthog.com')
  ) return

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.status === 200) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        return caches.match(event.request).then(cached => {
          if (cached) return cached
          if (event.request.mode === 'navigate') {
            return caches.match('/')
          }
        })
      })
  )
})

// Push notifications
self.addEventListener('push', event => {
  if (!event.data) return

  const data = event.data.json()
  event.waitUntil(
    self.registration.showNotification(data.title || 'WinForm', {
      body: data.body || 'New prediction available',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: { url: data.url || '/' },
      vibrate: [100, 50, 100],
    })
  )
})

// Notification click
self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  )
})