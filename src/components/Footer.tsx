'use client'

import Link from 'next/link'

interface FooterProps {
  isStandalone?: boolean
}

export default function Footer({ isStandalone = false }: FooterProps) {
  // CRITICAL: Hide footer in standalone mode
  if (isStandalone) {
    return null
  }

  return (
    <footer className="bg-card border-t border-border py-8 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-4">WinForm</h3>
            <p className="text-sm text-text-secondary">
              AI-powered football predictions for every major league.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/matches" className="hover:text-text-primary transition-colors">Matches</Link></li>
              <li><Link href="/top-picks" className="hover:text-text-primary transition-colors">Top Picks</Link></li>
              <li><Link href="/results" className="hover:text-text-primary transition-colors">Results</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Leagues</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/leagues/premier-league" className="hover:text-text-primary transition-colors">Premier League</Link></li>
              <li><Link href="/leagues/la-liga" className="hover:text-text-primary transition-colors">La Liga</Link></li>
              <li><Link href="/leagues/serie-a" className="hover:text-text-primary transition-colors">Serie A</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/about" className="hover:text-text-primary transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-text-primary transition-colors">Contact</Link></li>
              <li><Link href="/responsible-gambling" className="hover:text-text-primary transition-colors">Responsible Gambling</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-text-tertiary">
          <p>© {new Date().getFullYear()} WinForm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}