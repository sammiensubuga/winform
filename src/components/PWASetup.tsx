'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void
  userChoice: Promise<{ outcome: string }>
}

export default function PWASetup() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Detect if already installed
    const isInStandaloneMode = () => {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
      )
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsStandalone(isInStandaloneMode())

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsIOS(iOS)

    // If already installed, don't show anything
    if (isInStandaloneMode()) {
      return
    }

    // Service worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('SW registered'))
        .catch((err) => console.log('SW failed:', err))
    }

    // Android install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      const dismissed = localStorage.getItem('pwa-dismissed')
      if (!dismissed) {
        setTimeout(() => setShowBanner(true), 1000)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // iOS - show banner if not dismissed
    if (iOS && !isInStandaloneMode()) {
      const dismissed = localStorage.getItem('pwa-dismissed')
      if (!dismissed) {
        setTimeout(() => setShowBanner(true), 1500)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowBanner(false)
        localStorage.setItem('pwa-dismissed', 'true')
      }
      setDeferredPrompt(null)
    } else if (isIOS) {
      alert('Tap Share icon, then "Add to Home Screen"')
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem('pwa-dismissed', 'true')
  }

  if (isStandalone) return null

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-blue-500/20 backdrop-blur-xl border-t border-blue-500/30 shadow-2xl">
      <div className="max-w-lg mx-auto flex items-center gap-3">
        <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden shadow-lg">
          <Image src="/icon-192.png" alt="WinForm" width={40} height={40} className="object-contain rounded-xl" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-text-primary text-sm font-semibold">Install WinForm</p>
          <p className="text-text-secondary text-xs mt-0.5">
            {isIOS 
              ? 'Tap Share then Add to Home Screen' 
              : 'Get predictions on your home screen'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDismiss}
            className="text-text-secondary text-sm px-2 py-1"
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