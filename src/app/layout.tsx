import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import dynamic from 'next/dynamic'

const inter = Inter({ subsets: ['latin'] })

// Dynamically import client components with SSR disabled
const Header = dynamic(() => import('@/components/Header'), { ssr: false })
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false })
const BottomNav = dynamic(() => import('@/components/BottomNav'), { ssr: false })
const PWASetup = dynamic(() => import('@/components/PWASetup'), { ssr: false })

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
      </head>
      <body className={`${inter.className} bg-background text-text-primary min-h-screen pb-16`}>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
        <BottomNav />
        <PWASetup />
      </body>
    </html>
  )
}