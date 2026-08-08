'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl">
          WinForm
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/matches" className="text-sm font-medium hover:text-primary transition-colors">Matches</Link>
          <Link href="/leagues" className="text-sm font-medium hover:text-primary transition-colors">Leagues</Link>
          <Link href="/top-picks" className="text-sm font-medium hover:text-primary transition-colors">Top Picks</Link>
          <Link href="/world-cup" className="text-sm font-medium hover:text-primary transition-colors">World Cup</Link>
          <Button variant="default" size="sm">Sign In</Button>
        </nav>

        {/* Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu with Blur */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/50 md:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
            <Link 
              href="/" 
              onClick={closeMenu}
              className="text-xl font-medium hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/matches" 
              onClick={closeMenu}
              className="text-xl font-medium hover:text-primary transition-colors"
            >
              Matches
            </Link>
            <Link 
              href="/leagues" 
              onClick={closeMenu}
              className="text-xl font-medium hover:text-primary transition-colors"
            >
              Leagues
            </Link>
            <Link 
              href="/top-picks" 
              onClick={closeMenu}
              className="text-xl font-medium hover:text-primary transition-colors"
            >
              Top Picks
            </Link>
            <Link 
              href="/results" 
              onClick={closeMenu}
              className="text-xl font-medium hover:text-primary transition-colors"
            >
              Results
            </Link>
            <Link 
              href="/world-cup" 
              onClick={closeMenu}
              className="text-xl font-medium hover:text-primary transition-colors"
            >
              World Cup
            </Link>
            
            <div className="mt-4 w-full max-w-xs">
              <Button className="w-full" size="lg">
                Sign In
              </Button>
            </div>
            
            <button 
              onClick={closeMenu}
              className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Close Menu
            </button>
          </div>
        </div>
      )}
    </header>
  )
}