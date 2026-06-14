import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { initPostHog } from '@/lib/posthog'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WinForm — Football Intelligence',
  description: 'AI-powered football match analysis and predictions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}