import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'
import PWASetup from '@/components/PWASetup'
import AppStatusBar from '@/components/AppStatusBar'
import { headers } from 'next/headers'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#0A0F1E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: {
    default: 'WinForm — AI Football Predictions',
    template: '%s | WinForm',
  },
  description: 'AI-powered football match analysis, confidence scores, and transparent prediction tracking.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'WinForm',
    startupImage: '/icon-512.png',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'WinForm',
    title: 'WinForm — AI Football Predictions',
    description: 'Data-driven match analysis and predictions for every major league.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WinForm — AI Football Predictions',
    description: 'Data-driven match analysis and predictions for every major league.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Detect standalone on the server using headers
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isStandalone = userAgent.includes('standalone') || userAgent.includes('mobile')

  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="WinForm" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="WinForm" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0A0F1E" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Script to add standalone class immediately */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                                      window.navigator.standalone === true
                  if (isStandalone) {
                    document.documentElement.classList.add('is-standalone')
                  }
                } catch(e) {}
              })()
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-background text-text-primary min-h-screen pb-16`}>
        <AppStatusBar />
        <Header isStandalone={isStandalone} />
        <main>
          {children}
        </main>
        <Footer isStandalone={isStandalone} />
        <BottomNav />
        <PWASetup />
      </body>
    </html>
  )
}