'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

const leagues = [
  { name: 'Premier League', slug: 'premier-league', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'La Liga', slug: 'la-liga', flag: '🇪🇸' },
  { name: 'Serie A', slug: 'serie-a', flag: '🇮🇹' },
  { name: 'Bundesliga', slug: 'bundesliga', flag: '🇩🇪' },
  { name: 'Ligue 1', slug: 'ligue-1', flag: '🇫🇷' },
  { name: 'Champions League', slug: 'champions-league', flag: '⭐' },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [leaguesOpen, setLeaguesOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
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
  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll)
}, [isHeroPage])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-dropdown]')) {
        setLeaguesOpen(false)
        setProfileOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navLinkClass = (href: string) => {
    const isActive = pathname === href
    const base = 'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200'
    if (isActive) return `${base} bg-accent/10 text-accent`
    if (!scrolled && isHeroPage) return `${base} text-white/80 hover:text-white hover:bg-white/10`
    return `${base} text-text-secondary hover:text-text-primary hover:bg-card`
  }

  const logoTextClass = !scrolled && isHeroPage ? 'text-white' : 'text-text-primary'
  const headerBg = scrolled || !isHeroPage
    ? 'bg-background/95 backdrop-blur-md border-b border-border'
    : 'bg-transparent'

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
{/* Logo */}
<Link href="/" className="flex items-center gap-2 flex-shrink-0">
  <img src="/logo.png" alt="WinForm Logo" className="w-8 h-8 object-contain" />
  <span className={`text-xl font-bold transition-colors duration-300 hidden sm:inline ${logoTextClass}`}>
    Win<span className="text-accent">Form</span>
  </span>
</Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/" className={navLinkClass('/')}>Home</Link>
              <Link href="/top-picks" className={navLinkClass('/top-picks')}>Predictions</Link>
              <Link href="/matches" className={navLinkClass('/matches')}>Live</Link>

              {/* Leagues dropdown */}
              <div className="relative" data-dropdown>
                <button
                  onClick={() => setLeaguesOpen(prev => !prev)}
                  className={`${navLinkClass('/leagues')} flex items-center gap-1`}
                >
                  Leagues
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${leaguesOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {leaguesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-elevated border border-border rounded-xl shadow-2xl overflow-hidden z-50">
                    {leagues.map(league => (
                      <Link
                        key={league.slug}
                        href={`/leagues/${league.slug}`}
                        onClick={() => setLeaguesOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors"
                      >
                        <span>{league.flag}</span>
                        <span>{league.name}</span>
                      </Link>
                    ))}
                    <div className="border-t border-border" />
                    <Link
                      href="/world-cup"
                      onClick={() => setLeaguesOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-warning hover:bg-card-hover transition-colors font-medium"
                    >
                      <span>🏆</span>
                      <span>World Cup 2026</span>
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/world-cup" className={navLinkClass('/world-cup')}>
                🏆 World Cup
              </Link>
              <Link href="/results" className={navLinkClass('/results')}>Results</Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  {/* Notifications */}
                  <button className={`p-2 rounded-lg transition-colors ${!scrolled && isHeroPage ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-text-secondary hover:text-text-primary hover:bg-card'}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                  </button>

                  {/* Profile dropdown */}
                  <div className="relative" data-dropdown>
                    <button
                      onClick={() => setProfileOpen(prev => !prev)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:border-border-strong transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-accent text-xs font-bold">
                          {(user.email?.[0] ?? 'U').toUpperCase()}
                        </span>
                      </div>
                      <span className="text-text-primary text-sm hidden md:block">
                        {user.email?.split('@')[0]}
                      </span>
                      <svg className="w-3.5 h-3.5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {profileOpen && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-elevated border border-border rounded-xl shadow-2xl overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-text-primary text-sm font-medium truncate">{user.email?.split('@')[0]}</p>
                          <p className="text-text-tertiary text-xs truncate">{user.email}</p>
                        </div>
                        {[
                          { label: 'My Profile', href: `/profile/${user.email?.split('@')[0]}` },
                          { label: 'Watchlist', href: '/watchlist' },
                          { label: 'Settings', href: '/settings' },
                        ].map(item => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                        <div className="border-t border-border" />
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center px-4 py-3 text-sm text-danger hover:bg-card-hover transition-colors"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">

               <button
  onClick={() => {
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) searchInput.focus();
  }}
  className={`p-2 rounded-lg transition-colors ${!scrolled && isHeroPage ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-text-secondary hover:text-text-primary hover:bg-card'}`}
>
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
</button>
                <Link
  href="/register"
  className="px-4 py-1.5 rounded-lg text-sm font-medium bg-accent hover:bg-accent-hover text-white transition-colors"
  style={{ border: '1px solid #22C55E', boxShadow: '0 0 8px rgba(34, 197, 94, 0.3)' }}
>
  Sign Up
</Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-card transition-colors"
                onClick={() => setMobileMenuOpen(prev => !prev)}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {mobileMenuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  }
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border px-4 py-4 flex flex-col gap-1">
            {[
              { label: 'Home', href: '/' },
              { label: 'Predictions', href: '/top-picks' },
              { label: 'Live', href: '/matches' },
              { label: '🏆 World Cup', href: '/world-cup' },
              { label: 'Results', href: '/results' },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-card text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-border mt-2 pt-2 flex flex-col gap-1">
              {leagues.map(league => (
                <Link
                  key={league.slug}
                  href={`/leagues/${league.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-card text-sm transition-colors flex items-center gap-2"
                >
                  <span>{league.flag}</span>
                  <span>{league.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Spacer — only on non-hero pages so content doesn't go behind fixed header */}
      {!isHeroPage && <div className="h-16" />}
    </>
  )
}