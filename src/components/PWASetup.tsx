'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void
  userChoice: Promise<{ outcome: string }>
}

export default function PWASetup() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then(reg => console.log('WinForm SW registered:', reg.scope))
          .catch(err => console.log('SW registration failed:', err))
      })
    }

    // Detect iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsIOS(ios)

    // Detect if already installed (standalone mode)
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsStandalone(standalone)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsInstalled(standalone)

    // Android install prompt - prevent default and show custom banner
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault() // This prevents Chrome's default prompt
      setInstallPrompt(e as BeforeInstallPromptEvent)
      
      // Only show banner if not dismissed before and not installed
      const dismissed = localStorage.getItem('pwa-banner-dismissed')
      if (!dismissed && !standalone) {
        setTimeout(() => setShowBanner(true), 1000)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    // For iOS, show banner immediately if not installed
    if (ios && !standalone) {
      const dismissed = localStorage.getItem('pwa-banner-dismissed')
      if (!dismissed) {
        setTimeout(() => setShowBanner(true), 1000)
      }
    }

    // Check if app was installed (for Android)
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowBanner(false)
      localStorage.setItem('pwa-banner-dismissed', 'true')
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) {
      // Fallback for iOS or if prompt not available
      if (isIOS) {
        alert('Tap the Share button and select "Add to Home Screen"')
      }
      return
    }
    
    try {
      // Show the native install prompt
      installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      
      if (outcome === 'accepted') {
        setShowBanner(false)
        setIsInstalled(true)
        localStorage.setItem('pwa-banner-dismissed', 'true')
        console.log('App installed successfully!')
      } else {
        console.log('User dismissed the install prompt')
      }
    } catch (error) {
      console.error('Install prompt error:', error)
    }
    
    setInstallPrompt(null)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem('pwa-banner-dismissed', 'true')
  }

  // Already installed — show nothing
  if (isStandalone || isInstalled) return null

  // iOS banner — show manual instructions
  if (isIOS && !isStandalone && showBanner) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-blue-500/20 backdrop-blur-xl border-t border-blue-500/30 shadow-2xl">
        <div className="max-w-lg mx-auto flex items-start gap-3">
          <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden shadow-lg">
            <Image src="/icon-192.png" alt="WinForm" width={40} height={40} className="object-contain rounded-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-text-primary text-sm font-semibold">Install WinForm</p>
            <p className="text-text-secondary text-xs mt-0.5">
              Tap <span className="text-accent">Share</span> then{' '}
              <span className="text-accent">Add to Home Screen</span> for the best experience.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-text-tertiary hover:text-text-secondary p-1 shrink-0"
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
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-blue-500/20 backdrop-blur-xl border-t border-blue-500/30 shadow-2xl">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden shadow-lg">
            <Image src="/icon-192.png" alt="WinForm" width={40} height={40} className="object-contain rounded-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-text-primary text-sm font-semibold">Install WinForm</p>
            <p className="text-text-secondary text-xs mt-0.5">
              Get predictions and live scores on your home screen.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDismiss}
              className="text-text-secondary text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Not now
            </button>
            <button
              onClick={handleInstall}
              className="bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors shadow-lg shadow-accent/25"
            >
              Install
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Android fallback if installPrompt is not available (rare)
  if (showBanner && !installPrompt && !isIOS) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-blue-500/20 backdrop-blur-xl border-t border-blue-500/30 shadow-2xl">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden shadow-lg">
            <Image src="/icon-192.png" alt="WinForm" width={40} height={40} className="object-contain rounded-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-text-primary text-sm font-semibold">Install WinForm</p>
            <p className="text-text-secondary text-xs mt-0.5">
              Open in Chrome and tap the install banner to add to home screen.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-text-secondary text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    )
  }

  return null
}