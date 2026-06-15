'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useRef } from 'react'
import type { User } from '@supabase/supabase-js'
import { Search, Bell, ChevronDown, Menu, X, Home, Trophy, Calendar, Star, Flame, User as UserIcon, Settings as SettingsIcon, LogOut } from 'lucide-react'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLeaguesOpen, setIsLeaguesOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const leaguesRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user ?? null)
    )
    return () => subscription.unsubscribe()
  }, [supabase.auth])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (leaguesRef.current && !leaguesRef.current.contains(event.target as Node)) {
        setIsLeaguesOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  const leagues = [
    { name: 'Premier League', href: '/leagues/premier-league' },
    { name: 'La Liga', href: '/leagues/la-liga' },
    { name: 'Serie A', href: '/leagues/serie-a' },
    { name: 'Bundesliga', href: '/leagues/bundesliga' },
    { name: 'Champions League', href: '/leagues/champions-league' },
    { name: 'Ligue 1', href: '/leagues/ligue-1' },
    { name: '──────────────', href: '#' },
    { name: 'World Cup 2026', href: '/world-cup' },
  ]

  const username = user?.email?.split('@')[0] || 'User'
  const avatarLetter = username.charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-sm">WF</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight hidden sm:inline">
              Win<span className="text-green-500">Form</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 ml-6">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === '/'
                  ? 'bg-green-500/10 text-green-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </Link>
            <Link
              href="/top-picks"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === '/top-picks'
                  ? 'bg-green-500/10 text-green-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Predictions
            </Link>
            <Link
              href="/matches?filter=live"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === '/matches'
                  ? 'bg-green-500/10 text-green-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Live
            </Link>
            
            {/* Leagues Dropdown */}
            <div ref={leaguesRef} className="relative">
              <button
                onClick={() => setIsLeaguesOpen(!isLeaguesOpen)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                  pathname.includes('/leagues/')
                    ? 'bg-green-500/10 text-green-500'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Leagues
                <ChevronDown className={`w-3 h-3 transition-transform ${isLeaguesOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLeaguesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden z-50">
                  {leagues.map((league, index) => (
                    league.href === '#' ? (
                      <div key={index} className="border-t border-gray-800 my-1" />
                    ) : (
                      <Link
                        key={league.href}
                        href={league.href}
                        onClick={() => setIsLeaguesOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                      >
                        {league.name}
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/world-cup"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                pathname === '/world-cup'
                  ? 'bg-green-500/10 text-green-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              World Cup
            </Link>
            <Link
              href="/results"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === '/results'
                  ? 'bg-green-500/10 text-green-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Results
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-xs mx-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 pl-9 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              </div>
            </form>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* Mobile search button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors p-2"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors p-2"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {user ? (
              <>
                {/* Notifications */}
                <button className="hidden sm:block text-gray-400 hover:text-white transition-colors p-2">
                  <Bell className="w-5 h-5" />
                </button>

                {/* Profile Dropdown */}
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-full pl-2 pr-3 py-1 transition-colors"
                  >
                    <div className="w-7 h-7 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{avatarLetter}</span>
                    </div>
                    <span className="text-white text-sm font-medium hidden sm:inline">{username}</span>
                    <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-800">
                        <p className="text-white text-sm font-medium">{username}</p>
                        <p className="text-gray-500 text-xs">{user.email}</p>
                      </div>
                      <Link
                        href={`/profile/${username}`}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                      >
                        <UserIcon className="w-4 h-4" />
                        My Profile
                      </Link>
                      <Link
                        href="/watchlist"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                      >
                        <Star className="w-4 h-4" />
                        Watchlist
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                      >
                        <SettingsIcon className="w-4 h-4" />
                        Settings
                      </Link>
                      <div className="border-t border-gray-800 my-1" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-1.5 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

        </div>

        {/* Mobile search bar */}
        {isSearchOpen && (
          <div className="lg:hidden py-3 border-t border-gray-800">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search teams, leagues, matches..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-800 space-y-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/top-picks"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Star className="w-4 h-4" />
              Predictions
            </Link>
            <Link
              href="/matches?filter=live"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Flame className="w-4 h-4" />
              Live
            </Link>
            
            {/* Mobile Leagues section */}
            <div className="px-3 py-2">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 px-1">Leagues</p>
              <div className="space-y-1">
                {leagues.filter(l => l.href !== '#').map(league => (
                  <Link
                    key={league.href}
                    href={league.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    {league.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/world-cup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Trophy className="w-4 h-4" />
              World Cup
            </Link>
            <Link
              href="/results"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Results
            </Link>

            {!user && (
              <>
                <div className="border-t border-gray-800 my-2" />
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg transition-colors mx-3"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
        <div className="flex items-center justify-around py-2">
          <Link href="/" className="flex flex-col items-center gap-0.5 py-1 px-3">
            <Home className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] text-gray-500">Home</span>
          </Link>
          <Link href="/top-picks" className="flex flex-col items-center gap-0.5 py-1 px-3">
            <Star className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] text-gray-500">Picks</span>
          </Link>
          <Link href="/matches?filter=live" className="flex flex-col items-center gap-0.5 py-1 px-3">
            <div className="relative">
              <Flame className="w-5 h-5 text-gray-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </div>
            <span className="text-[10px] text-gray-500">Live</span>
          </Link>
          <Link href="/world-cup" className="flex flex-col items-center gap-0.5 py-1 px-3">
            <Trophy className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] text-gray-500">World Cup</span>
          </Link>
          <Link href={user ? `/profile/${username}` : "/login"} className="flex flex-col items-center gap-0.5 py-1 px-3">
            <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">{user ? avatarLetter : 'U'}</span>
            </div>
            <span className="text-[10px] text-gray-500">{user ? 'Profile' : 'Login'}</span>
          </Link>
        </div>
      </div>

      {/* Add padding to bottom on mobile to account for bottom nav */}
      <style jsx global>{`
        @media (max-width: 1023px) {
          body {
            padding-bottom: 60px;
          }
        }
      `}</style>
    </header>
  )
}