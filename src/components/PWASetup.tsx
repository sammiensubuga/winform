'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void
  userChoice: Promise<{ outcome: string }>
}

export default function PWASetup() {
  const [showBanner, setShowBanner] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    // Check if already installed (standalone mode)
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsStandalone(standalone)
      return standalone
    }

    // Check iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsIOS(isIOSDevice)

    // If already installed, don't show anything
    if (checkStandalone()) {
      return
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('✅ SW registered'))
        .catch((err) => console.log('❌ SW failed:', err))
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      console.log('✅ beforeinstallprompt fired')
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Check if user dismissed before
      const dismissed = localStorage.getItem('pwa-dismissed')
      if (!dismissed) {
        setTimeout(() => setShowBanner(true), 1000)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // iOS fallback - show banner after 2 seconds
    if (isIOSDevice) {
      const dismissed = localStorage.getItem('pwa-dismissed')
      if (!dismissed) {
        setTimeout(() => setShowBanner(true), 2000)
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
        console.log('✅ App installed')
      }
      setDeferredPrompt(null)
    } else if (isIOS) {
      alert('Tap the Share button (square with arrow), then select "Add to Home Screen"')
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
          <p className="text-text-secondary text-xs">
            {isIOS ? 'Tap Share, then Add to Home Screen' : 'Add to home screen for quick access'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleDismiss}
            className="text-text-secondary text-sm px-2 py-1"
          >
            Not now
          </button>
          <button
            onClick={handleInstall}
            className="bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-1.5 rounded-lg"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  )
} 