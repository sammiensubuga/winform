'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Footer() {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname === '/update-password'

  if (isAuthPage) {
    return null
  }

  return (
    <footer className="bg-black border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         
      {/* Brand */}
<div className="col-span-1 md:col-span-1">
  <div className="flex items-center gap-2 mb-4">
    <img 
      src="/logo.png" 
      alt="WinForm Logo" 
      className="w-8 h-8 object-contain rounded-lg"
    />
    <span className="text-lg font-bold text-white">
      Win<span className="text-green-500">Form</span>
    </span>
  </div>
  <p className="text-gray-500 text-sm leading-relaxed">
    AI-powered football intelligence. Data-driven predictions with transparent tracking.
  </p>
</div>

          {/* Leagues */}
          <div>
            <p className="text-white text-sm font-medium mb-4">Leagues</p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Premier League', href: '/leagues/premier-league' },
                { label: 'La Liga', href: '/leagues/la-liga' },
                { label: 'Serie A', href: '/leagues/serie-a' },
                { label: 'Bundesliga', href: '/leagues/bundesliga' },
                { label: 'Champions League', href: '/leagues/champions-league' },
                { label: 'World Cup 2026', href: '/world-cup' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-500 hover:text-green-500 text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-white text-sm font-medium mb-4">Company</p>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="text-gray-500 hover:text-green-500 text-sm transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="text-gray-500 hover:text-green-500 text-sm transition-colors">
                Contact
              </Link>
              <Link href="/blog" className="text-gray-500 hover:text-green-500 text-sm transition-colors">
                Blog
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-white text-sm font-medium mb-4">Legal</p>
            <div className="flex flex-col gap-2">
              <Link href="/privacy" className="text-gray-500 hover:text-green-500 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-green-500 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/responsible-gambling" className="text-gray-500 hover:text-green-500 text-sm transition-colors">
                Responsible Gambling
              </Link>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © 2026 WinForm. For entertainment purposes. Please gamble responsibly.
          </p>
          <p className="text-gray-600 text-xs">
            Predictions do not guarantee outcomes.
          </p>
        </div>
      </div>
    </footer>
  )
}