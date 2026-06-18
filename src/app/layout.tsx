import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'
import PWASetup from '@/components/PWASetup'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WinForm — AI Football Predictions',
  description: 'AI-powered football match analysis, confidence scores, and transparent prediction tracking.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
     <body className={`${inter.className} bg-background text-text-primary min-h-screen`}>
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