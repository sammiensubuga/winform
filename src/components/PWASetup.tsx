'use client'

import { useEffect, useState, useMemo } from 'react'

// Type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => void
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWASetup() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  // Memoize browser checks - runs once, no setState in effect
  const isBrowser = useMemo(() => typeof window !== 'undefined', [])
  
  const isIOS = useMemo(() => {
    if (!isBrowser) return false
    return /iphone|ipad|ipod/i.test(navigator.userAgent)
  }, [isBrowser])

  const isStandalone = useMemo(() => {
    if (!isBrowser) return false
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
    )
  }, [isBrowser])

  useEffect(() => {
    if (!isBrowser) return

    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then(reg => console.log('WinForm SW registered:', reg.scope))
          .catch(err => console.log('SW registration failed:', err))
      })
    }

    // Android install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setInstallPrompt(promptEvent)

      // Only show banner if not dismissed before
      const dismissed = localStorage.getItem('pwa-banner-dismissed')
      if (!dismissed) {
        setTimeout(() => setShowBanner(true), 3000)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [isBrowser])

  const handleInstall = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setShowBanner(false)
    setInstallPrompt(null)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    if (isBrowser) {
      localStorage.setItem('pwa-banner-dismissed', 'true')
    }
  }

  // Already installed or on desktop — show nothing
  if (!isBrowser || isStandalone) return null

  // iOS banner — show manual instructions
  if (isIOS && !isStandalone && showBanner) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-elevated border-t border-border shadow-2xl">
        <div className="max-w-lg mx-auto flex items-start gap-3">
          <img src="/icon-192.png" alt="WinForm" className="w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-text-primary text-sm font-semibold">Install WinForm</p>
            <p className="text-text-secondary text-xs mt-0.5">
              Tap <span className="text-accent">Share</span> then{' '}
              <span className="text-accent">Add to Home Screen</span> for the best experience.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-text-tertiary hover:text-text-secondary p-1 flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  // Android banner — native install prompt
  if (showBanner && installPrompt) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-elevated border-t border-border shadow-2xl">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <img src="/icon-192.png" alt="WinForm" className="w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-text-primary text-sm font-semibold">Install WinForm</p>
            <p className="text-text-secondary text-xs mt-0.5">
              Get predictions and live scores on your home screen.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDismiss}
              className="text-text-secondary text-sm px-3 py-1.5 rounded-lg hover:bg-card transition-colors"
            >
              Not now
            </button>
            <button
              onClick={handleInstall}
              className="bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
            >
              Install
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}