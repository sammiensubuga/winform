'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

const leagues = [
  { name: 'Premier League', slug: 'premier-league', flag: '🏴' },
  { name: 'La Liga', slug: 'la-liga', flag: '🇪🇸' },
  { name: 'Serie A', slug: 'serie-a', flag: '🇮🇹' },
  { name: 'Bundesliga', slug: 'bundesliga', flag: '🇩🇪' },
  { name: 'Champions League', slug: 'champions-league', flag: '⭐' },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [leaguesOpen, setLeaguesOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const supabase = createClient()

  const isHeroPage = pathname === '/'

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user ?? null)
    )
    return () => subscription.unsubscribe()
  }, [])

useEffect(() => {
  if (!isHeroPage) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScrolled(true)
    return
  }
  const handleScroll = () => setScrolled(window.scrollY > 80)
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [isHeroPage])

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex items-center justify-between h-16">

    {/* Logo - left */}
    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
      <img src="/logo.png" alt="WinForm" className="w-8 h-8 object-contain" />
      <span className={`text-xl font-bold hidden sm:inline ${!scrolled && isHeroPage ? 'text-white' : 'text-text-primary'}`}>
        Win<span className="text-accent">Form</span>
      </span>
    </Link>

    {/* Center section - nav + search */}
    <div className="hidden lg:flex items-center justify-center flex-1 gap-2">
      <nav className="flex items-center gap-1">
        <Link href="/" className={navLinkClass('/')}>Home</Link>
        <Link href="/top-picks" className={navLinkClass('/top-picks')}>Predictions</Link>
        <Link href="/matches" className={navLinkClass('/matches')}>Live</Link>
        
        <div className="relative">
          <button onClick={() => setLeaguesOpen(!leaguesOpen)} className={navLinkClass('/leagues')}>
            Leagues ▼
          </button>
          {leaguesOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-elevated border border-border rounded-xl shadow-xl z-50">
              {leagues.map(league => (
                <Link key={league.slug} href={`/leagues/${league.slug}`} onClick={() => setLeaguesOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-card-hover">
                  <span>{league.flag}</span> {league.name}
                </Link>
              ))}
              <Link href="/world-cup" onClick={() => setLeaguesOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-warning hover:bg-card-hover border-t border-border">
                🏆 World Cup 2026
              </Link>
            </div>
          )}
        </div>

        <Link href="/results" className={navLinkClass('/results')}>Results</Link>
      </nav>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="w-64">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-4 py-2 pl-10 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
      </form>
    </div>

    {/* Right side - Sign Up */}
    <div className="flex items-center gap-2">
      {user ? (
        <button onClick={handleSignOut} className="text-sm text-text-secondary hover:text-text-primary px-3 py-1.5">
          Sign Out
        </button>
      ) : (
        <Link href="/register" className="px-4 py-1.5 rounded-lg text-sm font-medium bg-accent hover:bg-accent-hover text-white transition" style={{ border: '1px solid #22C55E' }}>
          Sign Up
        </Link>
      )}

      {/* Mobile menu button */}
      <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>
    </div>

  </div>

  {/* Mobile menu */}
  {mobileMenuOpen && (
    <div className="md:hidden py-4 border-t border-border space-y-1">
      <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-text-secondary">Home</Link>
      <Link href="/top-picks" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-text-secondary">Predictions</Link>
      <Link href="/matches" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-text-secondary">Live</Link>
      <Link href="/world-cup" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-text-secondary">World Cup</Link>
      <Link href="/results" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-text-secondary">Results</Link>
    </div>
  )}
</div>
    </header>
  )
}