/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { Search, Trophy, Menu, X, ChevronDown, LogOut, User as UserIcon, Home, Star, Flame, Calendar, Globe } from 'lucide-react'
import SearchModal from './SearchModal'

const leagues = [
  { name: 'Premier League', slug: 'premier-league', logo: 'https://media.api-sports.io/football/leagues/39.png' },
  { name: 'La Liga', slug: 'la-liga', logo: 'https://media.api-sports.io/football/leagues/140.png' },
  { name: 'Serie A', slug: 'serie-a', logo: 'https://media.api-sports.io/football/leagues/135.png' },
  { name: 'Bundesliga', slug: 'bundesliga', logo: 'https://media.api-sports.io/football/leagues/78.png' },
  { name: 'Champions League', slug: 'champions-league', logo: 'https://media.api-sports.io/football/leagues/2.png' },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  // Default to TRUE so header is hidden on initial render
  const [isStandalone, setIsStandalone] = useState(true)
  const supabase = createClient()

  const isHeroPage = pathname === '/'
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname === '/update-password'

  // Hooks must be called unconditionally
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user ?? null)
    )
    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // Detect standalone mode on mount
  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    setIsStandalone(standalone)
  }, [])

  useEffect(() => {
    if (!isHeroPage) {
      setScrolled(true)
      return
    }
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHeroPage])

  // If on auth page, don't render header
  if (isAuthPage) {
    return null
  }

  // If in standalone mode (or still checking), render nothing
  // This means the header is hidden by default
  if (isStandalone) {
    return null
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const navLinkClass = (href: string) => {
    const isActive = pathname === href
    const base = 'px-3 py-2 rounded-lg text-sm font-medium transition'
    if (isActive) return `${base} bg-accent/10 text-accent`
    if (!scrolled && isHeroPage) return `${base} text-white/80 hover:text-white hover:bg-white/10`
    return `${base} text-text-secondary hover:text-text-primary hover:bg-card`
  }

  const headerBg = scrolled || !isHeroPage
    ? 'bg-background/95 backdrop-blur-md border-b border-border'
    : 'bg-transparent'

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img src="/logo.png" alt="WinForm" className="w-8 h-8 object-contain" />
              <span className={`text-xl font-bold hidden sm:inline ${!scrolled && isHeroPage ? 'text-white' : 'text-text-primary'}`}>
                Win<span className="text-accent">Form</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link href="/" className={navLinkClass('/')}>Home</Link>
              <Link href="/top-picks" className={navLinkClass('/top-picks')}>Predictions</Link>
              <Link href="/matches" className={navLinkClass('/matches')}>Live</Link>
              
              {/* Leagues Dropdown - Hover to open with glass background */}
              <div className="relative group">
                <button className={`${navLinkClass('/leagues')} flex items-center gap-1`}>
                  Leagues
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  {leagues.map(league => (
                    <Link
                      key={league.slug}
                      href={`/leagues/${league.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:text-white hover:bg-white/15 transition-colors"
                    >
                      <div className="relative w-5 h-5">
                        <img src={league.logo} alt={league.name} className="w-full h-full object-contain" />
                      </div>
                      {league.name}
                    </Link>
                  ))}
                  <Link href="/world-cup" className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-400 hover:text-amber-300 hover:bg-white/15 transition-colors border-t border-white/10">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    World Cup 2026
                  </Link>
                </div>
              </div>

              <Link href="/world-cup" className={navLinkClass('/world-cup')}>
                <Trophy className="w-4 h-4 inline mr-1" />
                World Cup
              </Link>
              <Link href="/results" className={navLinkClass('/results')}>Results</Link>
            </nav>

            {/* Desktop Search + Sign Up */}
            <div className="hidden lg:flex items-center gap-3">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-56 bg-gray-900/80 border border-gray-700 rounded-xl px-4 py-2 pl-10 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </form>

              {user ? (
                <button onClick={handleSignOut} className="text-sm text-text-secondary hover:text-text-primary px-3 py-1.5">
                  Sign Out
                </button>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary px-3 py-1.5">
                    Login
                  </Link>
                  <Link href="/register" className="px-4 py-1.5 rounded-lg text-sm font-medium bg-accent hover:bg-accent-hover text-white transition" style={{ border: '1px solid #22C55E' }}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile buttons */}
            <div className="flex items-center gap-2 lg:hidden">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-text-secondary hover:text-text-primary"
              >
                <Search className="w-5 h-5" />
              </button>

              {!user && (
                <Link href="/register" className="px-3 py-1.5 rounded-lg text-sm font-medium bg-accent text-white" style={{ border: '1px solid #22C55E' }}>
                  Sign Up
                </Link>
              )}

              <button className="p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile menu with blur overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-xl border-t border-border/50 lg:hidden">
          <div className="flex flex-col h-full overflow-y-auto py-4 px-4">
            {/* Close button at top */}
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="self-end p-2 hover:bg-accent/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Menu content */}
            <div className="flex-1 space-y-1 mt-2">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-text-secondary hover:text-text-primary hover:bg-accent/5 rounded-lg transition-colors">
                <Home className="w-5 h-5" /> Home
              </Link>
              <Link href="/top-picks" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-text-secondary hover:text-text-primary hover:bg-accent/5 rounded-lg transition-colors">
                <Star className="w-5 h-5" /> Predictions
              </Link>
              <Link href="/matches" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-text-secondary hover:text-text-primary hover:bg-accent/5 rounded-lg transition-colors">
                <Flame className="w-5 h-5" /> Live
              </Link>
              <Link href="/world-cup" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-text-secondary hover:text-text-primary hover:bg-accent/5 rounded-lg transition-colors">
                <Trophy className="w-5 h-5" /> World Cup
              </Link>
              <Link href="/results" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-text-secondary hover:text-text-primary hover:bg-accent/5 rounded-lg transition-colors">
                <Calendar className="w-5 h-5" /> Results
              </Link>
              
              {/* Leagues section in mobile */}
              <div className="pt-3 mt-3 border-t border-border/50">
                <p className="px-3 py-1 text-xs text-text-tertiary uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Leagues
                </p>
                {leagues.map(league => (
                  <Link
                    key={league.slug}
                    href={`/leagues/${league.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:text-text-primary hover:bg-accent/5 rounded-lg transition-colors"
                  >
                    <div className="relative w-5 h-5">
                      <img src={league.logo} alt={league.name} className="w-full h-full object-contain" />
                    </div>
                    {league.name}
                  </Link>
                ))}
                <Link
                  href="/world-cup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-amber-400 hover:text-amber-300 hover:bg-accent/5 rounded-lg transition-colors"
                >
                  <Trophy className="w-4 h-4" />
                  World Cup 2026
                </Link>
              </div>

              {/* Login/Sign Up for mobile */}
              {!user && (
                <div className="pt-3 mt-3 border-t border-border/50 space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:text-text-primary hover:bg-accent/5 rounded-lg transition-colors"
                  >
                    <UserIcon className="w-5 h-5" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-3 py-3 text-center bg-accent hover:bg-accent-hover text-white rounded-lg mx-3 transition-colors"
                    style={{ border: '1px solid #22C55E' }}
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Sign Out for mobile */}
              {user && (
                <div className="pt-3 mt-3 border-t border-border/50">
                  <button
                    onClick={() => {
                      handleSignOut()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Spacer for non-hero pages */}
      {!isHeroPage && <div className="h-16" />}
    </>
  )
}