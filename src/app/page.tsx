'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import Image from 'next/image'
import Hero from '@/components/Hero'
import TopPickCard from '@/components/TopPickCard'
import LiveMatchBanner from '@/components/LiveMatchBanner'
import { Star, Zap, Target, CheckCircle, XCircle, ChevronRight, Clock, CalendarDays, Flame } from 'lucide-react'
import {
  mockTopPicks,
  mockLiveMatches,
  mockUpcomingMatches,
  mockYesterdayStats,
  mockLeagues,
} from '@/lib/mock-data'

// Circular Progress Component
const CircularProgress = ({ percentage, color }: { percentage: number; color: string }) => {
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-12 h-12 sm:w-14 sm:h-14 transform -rotate-90">
        <circle cx="50%" cy="50%" r={radius} stroke="#334155" strokeWidth="3" fill="none" />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute text-text-primary text-xs sm:text-sm font-bold">
        {percentage}%
      </span>
    </div>
  )
}

const SHOW_LIVE = mockLiveMatches.length > 0

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // User auth check
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
      
      if (user) {
        router.push('/watchlist')
      }
    }
    checkUser()
  }, [router, supabase.auth])

  // useMemo for values that don't need to trigger re-renders
  const isStandalone = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(display-mode: standalone)').matches
  }, [])

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return 'Good morning'
    if (hour >= 12 && hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const currentDate = useMemo(() => {
    const now = new Date()
    return now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-text-primary">Loading...</div>
      </div>
    )
  }

  if (user) {
    return null
  }

  const elitePicks = mockTopPicks.filter(m => m.confidenceTier === 'elite')
  const strongPicks = mockTopPicks.filter(m => m.confidenceTier === 'strong')
  const valuePicks = mockTopPicks.filter(m => m.confidenceTier === 'value')

  // STANDALONE MODE (PWA installed)
  if (isStandalone) {
    return (
      <main className="min-h-screen bg-background">
        {/* Welcome Bar */}
        <div className="w-full bg-[#111827] px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-sm text-gray-300">
              {greeting} · {currentDate}
            </p>
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-200 transition-colors">
              WinForm
            </Link>
          </div>
        </div>

        {/* Spacer for slim header */}
        <div className="h-14" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-8">
          {/* Yesterday's Results Bar */}
          <div className="border-b border-border py-4">
            <div className="text-center">
              <p className="text-text-secondary text-xs uppercase tracking-wider mb-3">Yesterday</p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <span className="font-semibold tabular flex items-center gap-1.5" style={{ color: '#22C55E' }}>
                  <CheckCircle className="w-4 h-4" style={{ color: '#22C55E' }} />
                  {mockYesterdayStats.wins} wins
                </span>
                <span className="font-semibold tabular flex items-center gap-1.5" style={{ color: '#EF4444' }}>
                  <XCircle className="w-4 h-4" style={{ color: '#EF4444' }} />
                  {mockYesterdayStats.losses} losses
                </span>
                <span className="text-text-primary font-bold tabular">
                  {mockYesterdayStats.accuracy}% accuracy
                </span>
              </div>
              <div className="mt-4">
                <Link
                  href="/results"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition"
                  style={{ 
                    border: '1px solid #22C55E',
                    color: 'white',
                    backgroundColor: 'transparent'
                  }}
                >
                  See all results →
                </Link>
              </div>
            </div>
          </div>

          {/* Today's Top Picks */}
          <section id="top-picks">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-text-primary">Today&apos;s Top Picks</h2>
                <p className="text-text-secondary text-sm mt-1">
                  Selected best opportunities · {currentDate}
                </p>
              </div>
              <Link 
                href="/top-picks" 
                className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-1.5 mt-3 sm:mt-0 rounded-lg text-sm font-medium transition"
                style={{ 
                  border: '1px solid #D4AF37',
                  color: 'white',
                  backgroundColor: 'transparent'
                }}
              >
                View all
              </Link>
            </div>

            {elitePicks.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-amber-400" />
                  <p className="text-xs font-medium text-amber-400">
                    Elite Picks 80%+ confidence
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {elitePicks.map(match => (
                    <TopPickCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )}

            {strongPicks.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-green-500" />
                  <p className="text-xs font-medium text-green-500">
                    Strong Picks 70-79% confidence
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {strongPicks.map(match => (
                    <TopPickCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )}

            {valuePicks.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-blue-500" />
                  <p className="text-xs font-medium text-blue-500">
                    Value Picks 55-69% confidence
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {valuePicks.map(match => (
                    <TopPickCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Live Matches */}
          {SHOW_LIVE && (
            <section className="py-10 border-t border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <h2 className="text-xl font-bold text-text-primary">Live now</h2>
                </div>
                <span className="text-text-secondary text-sm">
                  {mockLiveMatches.length} match{ mockLiveMatches.length !== 1 ? 'es' : '' } in progress
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockLiveMatches.map(match => (
                  <LiveMatchBanner key={match.id} match={match} />
                ))}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="py-10 border-t border-border mb-8">
            <div className="bg-gradient-to-br from-accent/10 via-card to-card border border-accent/20 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-text-primary">
                Track your predictions
              </h2>
              <p className="text-text-secondary mt-2 mb-8 text-lg">
                Free account. No credit card required.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8">
                {[
                  '✓ Save matches to your watchlist',
                  '✓ Track your prediction accuracy',
                  '✓ Your personal prediction streak',
                  '✓ Match notifications before kickoff',
                ].map(item => (
                  <div key={item} className="bg-background/60 border border-border rounded-xl px-4 py-3">
                    <p className="text-text-secondary text-sm">{item}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-accent/25"
              >
                Create Free Account
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-text-tertiary text-sm mt-4">$0 forever · No credit card needed</p>
            </div>
          </section>
        </div>
      </main>
    )
  }

  // REGULAR BROWSER MODE
  return (
    <>
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Yesterday's Results Bar */}
        <div className="border-b border-border py-4">
          <div className="text-center">
            <p className="text-text-secondary text-xs uppercase tracking-wider mb-3">Yesterday</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <span className="font-semibold tabular flex items-center gap-1.5" style={{ color: '#22C55E' }}>
                <CheckCircle className="w-4 h-4" style={{ color: '#22C55E' }} />
                {mockYesterdayStats.wins} wins
              </span>
              <span className="font-semibold tabular flex items-center gap-1.5" style={{ color: '#EF4444' }}>
                <XCircle className="w-4 h-4" style={{ color: '#EF4444' }} />
                {mockYesterdayStats.losses} losses
              </span>
              <span className="text-text-primary font-bold tabular">
                {mockYesterdayStats.accuracy}% accuracy
              </span>
            </div>
            <div className="mt-4">
              <Link
                href="/results"
                className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition"
                style={{ 
                  border: '1px solid #22C55E',
                  color: 'white',
                  backgroundColor: 'transparent'
                }}
              >
                See all results →
              </Link>
            </div>
          </div>
        </div>

        {/* Today's Top Picks */}
        <section id="top-picks" className="py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Today&apos;s Top Picks</h2>
              <p className="text-text-secondary text-sm mt-1">
                Selected best opportunities ·{' '}
                {new Date().toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <Link 
              href="/top-picks" 
              className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-1.5 mt-3 sm:mt-0 rounded-lg text-sm font-medium transition"
              style={{ 
                border: '1px solid #D4AF37',
                color: 'white',
                backgroundColor: 'transparent'
              }}
            >
              View all
            </Link>
          </div>

          {elitePicks.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-amber-400" />
                <p className="text-xs font-medium text-amber-400">
                  Elite Picks 80%+ confidence
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {elitePicks.map(match => (
                  <TopPickCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          )}

          {strongPicks.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-green-500" />
                <p className="text-xs font-medium text-green-500">
                  Strong Picks 70-79% confidence
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strongPicks.map(match => (
                  <TopPickCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          )}

          {valuePicks.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-blue-500" />
                <p className="text-xs font-medium text-blue-500">
                  Value Picks 55-69% confidence
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {valuePicks.map(match => (
                  <TopPickCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Yesterday's Performance */}
        <section className="py-10 border-t border-border">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-2">Yesterday&apos;s Performance</h2>
            <p className="text-text-secondary text-sm">Full transparency — every prediction logged and tracked</p>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold tabular" style={{ color: '#22C55E' }}>{mockYesterdayStats.wins}</p>
                <p className="text-text-secondary text-sm mt-1">Wins</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold tabular" style={{ color: '#EF4444' }}>{mockYesterdayStats.losses}</p>
                <p className="text-text-secondary text-sm mt-1">Losses</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold tabular text-text-primary">{mockYesterdayStats.accuracy}%</p>
                <p className="text-text-secondary text-sm mt-1">Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold tabular text-accent">{mockYesterdayStats.record.wins}W-{mockYesterdayStats.record.losses}L</p>
                <p className="text-text-secondary text-sm mt-1">Last 30 picks</p>
              </div>
            </div>
            
            <div className="border-t border-border mt-6 pt-5 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-text-secondary text-sm">Last 7 days:</span>
                <span className="text-text-primary font-semibold text-sm tabular">{mockYesterdayStats.last7Days}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-secondary text-sm">Last 30 days:</span>
                <span className="text-text-primary font-semibold text-sm tabular">{mockYesterdayStats.last30Days}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-secondary text-sm">All time:</span>
                <span className="text-text-primary font-semibold text-sm tabular">68.4%</span>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <Link
                href="/results"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition"
                style={{ 
                  border: '1px solid #D4AF37',
                  color: 'white',
                  backgroundColor: 'transparent'
                }}
              >
                Full record
              </Link>
            </div>
          </div>
        </section>

        {/* Live Matches */}
        {SHOW_LIVE && (
          <section className="py-10 border-t border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-xl font-bold text-text-primary">Live now</h2>
              </div>
              <span className="text-text-secondary text-sm">
                {mockLiveMatches.length} match{ mockLiveMatches.length !== 1 ? 'es' : '' } in progress
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockLiveMatches.map(match => (
                <LiveMatchBanner key={match.id} match={match} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Matches */}
        <section className="py-10 border-t border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-primary">Upcoming Matches</h2>
            <Link 
              href="/matches" 
              className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-1.5 mt-3 sm:mt-0 rounded-lg text-sm font-medium transition"
              style={{ 
                border: '1px solid #D4AF37',
                color: 'white',
                backgroundColor: 'transparent'
              }}
            >
              View all
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockUpcomingMatches.map((match) => (
              <Link key={match.id} href={`/matches/${match.slug}`}>
                <div className="relative bg-gradient-to-br from-card/90 to-card border border-border/50 hover:border-accent/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col items-center gap-3 shadow-lg shadow-black/10 backdrop-blur-sm overflow-hidden">
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-2xl" />
                  
                  <div className="flex items-center justify-between w-full relative z-10">
                    <div className="flex items-center gap-1.5">
                      <div className="relative w-4 h-4">
                        <Image src={match.leagueLogo} alt={match.league} fill className="object-contain" />
                      </div>
                      <span className="text-text-secondary text-[10px] sm:text-xs font-medium truncate">{match.league}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-text-tertiary text-[10px] sm:text-xs truncate max-w-[100px]">{match.venue}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center text-text-secondary text-xs relative z-10">
                    <span className="font-medium">{match.kickoff.includes('Tomorrow') ? 'Tomorrow' : 'Today'}</span>
                    <span className="text-[10px] text-text-tertiary">{match.kickoff.replace('Tomorrow ', '').replace('Today ', '')}</span>
                  </div>
                  
                  <div className="flex items-center justify-between w-full gap-2 relative z-10">
                    <div className="flex flex-col items-center gap-1.5 flex-1">
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 transition-transform hover:scale-105 duration-200">
                        <Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" />
                      </div>
                      <span className="text-text-primary font-semibold text-xs sm:text-sm text-center truncate w-full max-w-[80px]">{match.homeTeam}</span>
                    </div>
                    
                    <div className="relative flex-shrink-0">
                      <div className="relative bg-transparent backdrop-blur-sm rounded-xl w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border border-white/20 hover:border-white/40 transition-all duration-200 cursor-default">
                        <span className="text-text-primary font-bold text-xs sm:text-sm tracking-wide">VS</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1.5 flex-1">
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 transition-transform hover:scale-105 duration-200">
                        <Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-contain" />
                      </div>
                      <span className="text-text-primary font-semibold text-xs sm:text-sm text-center truncate w-full max-w-[80px]">{match.awayTeam}</span>
                    </div>
                  </div>
                  
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* League Explorer */}
        <section className="py-10 border-t border-border">
          <h2 className="text-2xl font-bold text-text-primary mb-6">League Explorer</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {mockLeagues.map(league => (
              <Link
                key={league.slug}
                href={`/leagues/${league.slug}`}
              >
                <div className="bg-card border border-border hover:border-accent/40 hover:bg-card-hover rounded-2xl p-4 transition-all cursor-pointer flex flex-col items-center gap-3 text-center group">
                  <div className="relative w-10 h-10">
                    <Image src={league.logo} alt={league.name} fill className="object-contain" />
                  </div>
                  <div>
                    <p className="text-text-primary text-xs font-medium leading-tight group-hover:text-accent transition-colors">
                      {league.name}
                    </p>
                    <p className="text-text-tertiary text-xs mt-0.5">
                      {league.matchesToday} today
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 border-t border-border mb-8">
          <div className="bg-gradient-to-br from-accent/10 via-card to-card border border-accent/20 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-text-primary">
              Track your predictions
            </h2>
            <p className="text-text-secondary mt-2 mb-8 text-lg">
              Free account. No credit card required.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8">
              {[
                '✓ Save matches to your watchlist',
                '✓ Track your prediction accuracy',
                '✓ Your personal prediction streak',
                '✓ Match notifications before kickoff',
              ].map(item => (
                <div key={item} className="bg-background/60 border border-border rounded-xl px-4 py-3">
                  <p className="text-text-secondary text-sm">{item}</p>
                </div>
              ))}
            </div>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-accent/25"
            >
              Create Free Account
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-text-tertiary text-sm mt-4">$0 forever · No credit card needed</p>
          </div>
        </section>

      </div>
    </>
  )
}