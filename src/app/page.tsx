import Link from 'next/link'
import Image from 'next/image'
import Hero from '@/components/Hero'
import TopPickCard from '@/components/TopPickCard'
import LiveMatchBanner from '@/components/LiveMatchBanner'
import { Star, Zap, Target, CheckCircle, XCircle } from 'lucide-react'
import ConfidenceBadge from '@/components/ConfidenceBadge'
import {
  mockTopPicks,
  mockLiveMatches,
  mockUpcomingMatches,
  mockWorldCupMatches,
  mockYesterdayStats,
  mockLeagues,
} from '@/lib/mock-data'


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
      <span className="text-success font-semibold tabular flex items-center gap-1.5">
        <CheckCircle className="w-4 h-4 text-success" />
        {mockYesterdayStats.wins} wins
      </span>
      <span className="text-danger font-semibold tabular flex items-center gap-1.5">
        <XCircle className="w-4 h-4 text-danger" />
        {mockYesterdayStats.losses} losses
      </span>
      <span className="text-text-primary font-bold tabular">
        {mockYesterdayStats.accuracy}% accuracy
      </span>
    </div>
<Link 
  href="/results" 
  className="px-4 py-1.5 rounded-lg text-sm font-medium transition"
  style={{ 
    color: '#22C55E',
    border: '1px solid #22C55E',
    backgroundColor: 'transparent'
  }}
>
  See all results →
</Link>
  </div>
</div>

        {/* Today's Top Picks */}
        <section id="top-picks" className="py-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Today&apos;s Top Picks</h2>
              <p className="text-text-secondary text-sm mt-1">
                AI-selected best opportunities ·{' '}
                {new Date().toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <Link href="/top-picks" className="text-accent text-sm hover:underline hidden md:block">
              View all →
            </Link>
          </div>

       {elitePicks.length > 0 && (
  <div className="mb-8">
    <div className="flex items-center gap-2 mb-4">
      <Star className="w-4 h-4 text-amber-400" />
      <p className="text-xs text-text-tertiary uppercase tracking-wider font-medium">
        Elite Picks 80%+ confidence
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {elitePicks.map(match => (
        <TopPickCard key={match.id} match={match} />
      ))}
    </div>
  </div>
)}

{elitePicks.length > 0 && (
  <div className="mb-8">
    <div className="flex items-center gap-2 mb-4">
      <Star className="w-4 h-4 text-amber-400" />
      <p className="text-xs font-medium">
        <span className="text-text-tertiary">Elite Picks </span>
        <span className="text-amber-400">80%+ confidence</span>
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {elitePicks.map(match => (
        <TopPickCard key={match.id} match={match} />
      ))}
    </div>
  </div>
)}

{elitePicks.length > 0 && (
  <div className="mb-8">
    <div className="flex items-center gap-2 mb-4">
      <Star className="w-4 h-4 text-amber-400" />
      <p className="text-xs font-medium" style={{ color: '#fbbf24' }}>
        Elite Picks 80%+ confidence
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <p className="text-xs font-medium" style={{ color: '#22c55e' }}>
        Strong Picks 70–79% confidence
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <p className="text-xs font-medium" style={{ color: '#3b82f6' }}>
        Value Picks 55–69% confidence
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {valuePicks.map(match => (
        <TopPickCard key={match.id} match={match} />
      ))}
    </div>
  </div>
)}
        </section>

        {/* Yesterday's Performance */}
        <section className="py-10 border-t border-border">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Yesterday&apos;s Performance</h2>
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: mockYesterdayStats.wins, label: 'Wins', color: 'text-success' },
                { value: mockYesterdayStats.losses, label: 'Losses', color: 'text-danger' },
                { value: `${mockYesterdayStats.accuracy}%`, label: 'Accuracy', color: 'text-text-primary' },
                {
                  value: `${mockYesterdayStats.record.wins}W/${mockYesterdayStats.record.losses}L`,
                  label: 'Last 30 picks',
                  color: 'text-accent',
                },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className={`text-3xl font-bold tabular ${stat.color}`}>{stat.value}</p>
                  <p className="text-text-secondary text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-6 pt-5 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-text-secondary text-sm">Last 7 days:</span>
                <span className="text-text-primary font-semibold text-sm tabular">{mockYesterdayStats.last7Days}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-secondary text-sm">Last 30 days:</span>
                <span className="text-text-primary font-semibold text-sm tabular">{mockYesterdayStats.last30Days}%</span>
              </div>
              <Link href="/results" className="ml-auto text-accent text-sm hover:underline">
                Full record →
              </Link>
            </div>
          </div>
        </section>

        {/* Live Matches — only shown when live matches exist */}
        {SHOW_LIVE && (
          <section className="py-10 border-t border-border">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse" />
              <h2 className="text-2xl font-bold text-text-primary">Live Now</h2>
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-primary">Upcoming Matches</h2>
            <Link href="/matches" className="text-accent text-sm hover:underline hidden md:block">
              View all →
            </Link>
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {mockUpcomingMatches.map((match, index) => (
              <Link key={match.id} href={`/matches/${match.slug}`}>
                <div className={`flex items-center justify-between p-4 hover:bg-card-hover transition-colors cursor-pointer ${index !== mockUpcomingMatches.length - 1 ? 'border-b border-border' : ''}`}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative w-6 h-6 flex-shrink-0">
                      <Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" />
                    </div>
                    <span className="text-text-primary text-sm font-medium truncate">{match.homeTeam}</span>
                    <span className="text-text-tertiary text-xs flex-shrink-0">vs</span>
                    <div className="relative w-6 h-6 flex-shrink-0">
                      <Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-contain" />
                    </div>
                    <span className="text-text-primary text-sm font-medium truncate">{match.awayTeam}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className="text-text-secondary text-xs hidden sm:block">{match.kickoff}</span>
                    <ConfidenceBadge tier={match.confidenceTier} confidence={match.confidence} size="sm" />
                    <span className="text-text-secondary text-xs hidden lg:block">{match.topPick}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* World Cup 2026 */}
        <section className="py-10 border-t border-border">
          <div className="relative bg-gradient-to-br from-accent/10 via-card to-warning/5 border border-accent/20 rounded-2xl p-6 overflow-hidden">
            <div className="absolute top-0 right-0 text-8xl opacity-5 select-none pointer-events-none leading-none">
              🏆
            </div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-warning text-lg">🏆</span>
                  <h2 className="text-xl font-bold text-text-primary">World Cup 2026</h2>
                </div>
                <p className="text-text-secondary text-sm">Today&apos;s tournament predictions</p>
              </div>
              <Link href="/world-cup" className="text-accent text-sm hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockWorldCupMatches.map(match => (
                <Link key={match.id} href={`/matches/${match.slug}`}>
                  <div className="bg-background/60 border border-border hover:border-accent/40 rounded-xl p-4 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-text-secondary text-xs">{match.kickoff}</span>
                      <ConfidenceBadge tier={match.confidenceTier} confidence={match.confidence} size="sm" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-text-primary text-sm font-medium truncate">
                          {match.homeTeam} vs {match.awayTeam}
                        </p>
                        <p className="text-accent text-xs font-medium mt-0.5">{match.topPick}</p>
                      </div>
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-contain" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
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