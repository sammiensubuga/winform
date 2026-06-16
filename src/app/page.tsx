import Link from 'next/link'
import Image from 'next/image'
import Hero from '@/components/Hero'
import TopPickCard from '@/components/TopPickCard'
import LiveMatchBanner from '@/components/LiveMatchBanner'
import ConfidenceBadge from '@/components/ConfidenceBadge'
import { Star, Zap, Target, CheckCircle, XCircle, Calendar, Clock, ChevronRight, Trophy } from 'lucide-react'
import {
  mockTopPicks,
  mockLiveMatches,
  mockUpcomingMatches,
  mockWorldCupMatches,
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
  const elitePicks = mockTopPicks.filter(m => m.confidenceTier === 'elite')
  const strongPicks = mockTopPicks.filter(m => m.confidenceTier === 'strong')
  const valuePicks = mockTopPicks.filter(m => m.confidenceTier === 'value')

  return (
    <>
      {/* Hero — full viewport, sits behind the transparent nav */}
      <Hero />

      {/* Page content starts here */}
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

 {/* Live Matches — only shown when live matches exist */}
{SHOW_LIVE && (
  <section className="py-10 border-t border-border">
    {/* Live Now Header with Dynamic Card */}
    <div className="flex flex-col items-center mb-6">
      {/* Red dot and Live text */}
      <div className="flex items-center gap-2 mb-1">
        <div className="relative">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse inline-block" />
          <span className="absolute inset-0 w-3 h-3 rounded-full bg-red-500 animate-ping opacity-75" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary">Live</h2>
      </div>
      
      {/* Dynamic time counter */}
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg px-4 py-1.5">
        <span className="text-text-secondary text-sm font-mono tabular">
          00:00:00
        </span>
      </div>
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
    {mockUpcomingMatches.map((match, index) => (
      <Link key={match.id} href={`/matches/${match.slug}`}>
        <div className="relative bg-gradient-to-br from-card/90 to-card border border-border/50 hover:border-accent/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col items-center gap-3 shadow-lg shadow-black/10 backdrop-blur-sm overflow-hidden">
          
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-2xl" />
          
          {/* League and Stadium - Top row */}
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
          
          {/* Date and Time - Stacked vertically */}
          <div className="flex flex-col items-center text-text-secondary text-xs relative z-10">
            <span className="font-medium">{match.kickoff.includes('Tomorrow') ? 'Tomorrow' : 'Today'}</span>
            <span className="text-[10px] text-text-tertiary">{match.kickoff.replace('Tomorrow ', '').replace('Today ', '')}</span>
          </div>
          
          {/* Teams - Logos above names */}
          <div className="flex items-center justify-between w-full gap-2 relative z-10">
            {/* Home Team */}
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 transition-transform hover:scale-105 duration-200">
                <Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" />
              </div>
              <span className="text-text-primary font-semibold text-xs sm:text-sm text-center truncate w-full max-w-[80px]">{match.homeTeam}</span>
            </div>
            
{/* VS Card - Premium transparent button with only VS */}
<div className="relative flex-shrink-0">
  <div className="relative bg-transparent backdrop-blur-sm rounded-xl w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border border-white/20 hover:border-white/40 transition-all duration-200 cursor-default">
    <span className="text-text-primary font-bold text-xs sm:text-sm tracking-wide">VS</span>
  </div>
</div>
            
            {/* Away Team */}
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

  {/* World Cup 2026 - Matching TopPickCard size */}
<section className="py-10 border-t border-border">
  <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6">
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Trophy className="w-5 h-5 text-amber-400" />
        <h2 className="text-2xl font-bold text-text-primary">World Cup 2026</h2>
      </div>
      <p className="text-text-secondary text-sm">Tournament predictions · Group stage</p>
    </div>
    <Link 
      href="/world-cup" 
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

  {/* Group by group - All groups */}
  {['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F', 'Group G', 'Group H'].map((groupName) => {
    const groupMatches = mockWorldCupMatches.filter(match => match.group === groupName)
    if (groupMatches.length === 0) return null
    
    return (
      <div key={groupName} className="mb-4 sm:mb-6">
        <h3 className="text-[10px] sm:text-xs text-text-tertiary uppercase tracking-wider mb-2 sm:mb-3 font-medium">
          {groupName}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groupMatches.map((match) => (
            <Link key={match.id} href={`/matches/${match.slug}`}>
              <div className="bg-card border border-border hover:border-accent/50 rounded-xl p-4 transition-all duration-200 cursor-pointer h-full flex flex-col gap-3">
                
                {/* League, Stadium, Time with Bookmark */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs text-text-secondary font-medium truncate">World Cup</span>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs text-text-secondary">{match.kickoff}</span>
                  </div>
                  <div className="flex-1 flex items-center justify-end gap-1.5">
                    <span className="text-xs text-text-tertiary truncate">{match.venue || 'Stadium'}</span>
                    <svg className="w-3.5 h-3.5 text-text-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* Teams and Form */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 text-center">
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2">
                      <Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" />
                    </div>
                    <p className="text-text-primary font-semibold text-xs sm:text-sm truncate px-1">{match.homeTeam}</p>
                    <div className="flex justify-center gap-0.5 sm:gap-1 mt-2">
                      {match.homeForm?.split('').map((letter, idx) => (
                        <span key={idx} className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${letter === 'W' ? 'bg-green-500 text-white' : letter === 'L' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'}`}>
                          {letter}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-text-tertiary text-[10px] sm:text-xs font-medium shrink-0">VS</div>

                  <div className="flex-1 text-center">
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2">
                      <Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-contain" />
                    </div>
                    <p className="text-text-primary font-semibold text-xs sm:text-sm truncate px-1">{match.awayTeam}</p>
                    <div className="flex justify-center gap-0.5 sm:gap-1 mt-2">
                      {match.awayForm?.split('').map((letter, idx) => (
                        <span key={idx} className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${letter === 'W' ? 'bg-green-500 text-white' : letter === 'L' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'}`}>
                          {letter}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Win, Draw, Win - Circular Progress */}
                <div className="flex items-center justify-between gap-3 mt-2">
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Win</span>
                    <CircularProgress percentage={match.homeProbability || 58} color="#22C55E" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Draw</span>
                    <CircularProgress percentage={match.drawProbability || 24} color="#F97316" />
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Win</span>
                    <CircularProgress percentage={match.awayProbability || 20} color="#3B82F6" />
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* Top Pick and Odds */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 min-w-0">
                    <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                    <p className="text-text-primary font-semibold text-sm truncate">{match.topPick}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-text-primary font-bold text-sm">{match.odds.toFixed(2)}</span>
                  </div>
                </div>

                {/* Confidence */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-text-secondary text-xs">Confidence</span>
                    <span className={`text-sm font-bold ${match.confidenceTier === 'elite' ? 'text-amber-400' : match.confidenceTier === 'strong' ? 'text-green-500' : 'text-blue-500'}`}>{match.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div className={`rounded-full h-1.5 ${match.confidenceTier === 'elite' ? 'bg-amber-400' : match.confidenceTier === 'strong' ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${match.confidence}%` }} />
                  </div>
                </div>

                {/* Analysis */}
                <div>
                  <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">Analysis</p>
                  <p className="text-text-secondary text-xs leading-relaxed line-clamp-2">
                    {match.aiPreviewShort || 'Both teams have shown strong form in recent matches.'}
                  </p>
                </div>

   {/* Match Date and Details - Matching TopPickCard exactly */}
<div className="mt-auto pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
  <span className="text-text-tertiary text-[8px] sm:text-[10px] text-center sm:text-left w-full sm:w-auto">
    {new Date(match.matchDate || '2026-06-15').toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}
  </span>
  <Link 
    href={`/matches/${match.slug}`}
    className="inline-flex items-center justify-center text-[8px] sm:text-xs font-medium px-3 py-1.5 rounded-lg transition w-full sm:w-auto"
    style={{ 
      color: 'white',
      border: '1px solid #D4AF37',
      backgroundColor: 'transparent'
    }}
  >
    <span>Details</span>
  </Link>
</div>

              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  })}
</section>

        {/* League Explorer */}
        <section className="py-10 border-t border-border">
          <h2 className="text-2xl font-bold text-text-primary mb-6">League Explorer</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {mockLeagues.map(league => (
              <Link
                key={league.slug}
                href={league.slug === 'world-cup' ? '/world-cup' : `/leagues/${league.slug}`}
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