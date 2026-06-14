import Link from 'next/link'
import TopPickCard from '@/components/TopPickCard'
import LiveMatchBanner from '@/components/LiveMatchBanner'
import ConfidenceBadge from '@/components/ConfidenceBadge'
import Image from 'next/image'
import {
  mockTopPicks,
  mockLiveMatches,
  mockUpcomingMatches,
  mockWorldCupMatches,
  mockYesterdayStats,
  mockLeagues,
} from '@/lib/mock-data'

// Define types for the mock data
type TopPick = {
  id: number
  slug: string
  homeTeam: string
  awayTeam: string
  homeTeamLogo: string
  awayTeamLogo: string
  league: string
  competitionLogo: string
  kickoff: string
  status: string
  topPick: string
  confidence: number
  confidenceTier: 'elite' | 'strong' | 'value'
  odds: number
  previousOdds: number
  homeProbability: number
  drawProbability: number
  awayProbability: number
  homeForm: string
  awayForm: string
  aiPreviewShort: string
}

type LiveMatch = {
  id: number
  slug: string
  homeTeam: string
  awayTeam: string
  homeTeamLogo: string
  awayTeamLogo: string
  league: string
  homeScore: number
  awayScore: number
  minute: number
  possession: { home: number; away: number }
  shots: { home: number; away: number }
  topPick: string
  confidence: number
  confidenceTier: string
}

type UpcomingMatch = {
  id: number
  slug: string
  homeTeam: string
  awayTeam: string
  homeTeamLogo: string
  awayTeamLogo: string
  league: string
  kickoff: string
  topPick: string
  confidence: number
  confidenceTier: 'elite' | 'strong' | 'value'
}

type WorldCupMatch = {
  id: number
  slug: string
  homeTeam: string
  awayTeam: string
  homeTeamLogo: string
  awayTeamLogo: string
  league: string
  kickoff: string
  status: string
  topPick: string
  confidence: number
  confidenceTier: 'elite' | 'strong' | 'value'
  odds: number
  previousOdds: number
}

type League = {
  name: string
  slug: string
  logo: string
  country: string
  matchesToday: number
}

const SHOW_LIVE = mockLiveMatches.length > 0

export default function HomePage() {
  const elitePicks = mockTopPicks.filter((match: TopPick) => match.confidenceTier === 'elite')
  const strongPicks = mockTopPicks.filter((match: TopPick) => match.confidenceTier === 'strong')
  const valuePicks = mockTopPicks.filter((match: TopPick) => match.confidenceTier === 'value')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Yesterday's Results Bar */}
      <div className="border-b border-border py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-text-secondary">Yesterday:</span>
          <span className="text-success font-medium">{mockYesterdayStats.wins} wins</span>
          <span className="text-text-secondary">·</span>
          <span className="text-danger font-medium">{mockYesterdayStats.losses} losses</span>
          <span className="text-text-secondary">·</span>
          <span className="text-text-primary font-semibold">{mockYesterdayStats.accuracy}% accuracy</span>
        </div>
        <Link href="/results" className="text-accent text-xs hover:underline">
          See all results →
        </Link>
      </div>

      {/* Hero */}
      <section className="py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight">
          AI-Powered Football<br />
          <span className="text-accent">Predictions</span>
        </h1>
        <p className="text-text-secondary mt-4 text-lg max-w-xl mx-auto">
          Data-driven match analysis, confidence scores, and transparent prediction tracking.
        </p>
        <a
          href="#top-picks"
          className="inline-block mt-6 bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          View Today&apos;s Picks
        </a>
      </section>

      {/* Today's Top Picks */}
      <section id="top-picks" className="py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Today&apos;s Top Picks</h2>
            <p className="text-text-secondary text-sm mt-1">
              AI-selected best opportunities · {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <Link href="/top-picks" className="text-accent text-sm hover:underline hidden md:block">
            View all →
          </Link>
        </div>

        {elitePicks.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-3 font-medium">
              ⭐ Elite Picks — 80%+ confidence
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {elitePicks.map((match: TopPick) => (
                <TopPickCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

        {strongPicks.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-3 font-medium">
              💪 Strong Picks — 70–79% confidence
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {strongPicks.map((match: TopPick) => (
                <TopPickCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

        {valuePicks.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-3 font-medium">
              🎯 Value Picks — 55–69% confidence
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {valuePicks.map((match: TopPick) => (
                <TopPickCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Yesterday's Performance */}
      <section className="py-8 border-t border-border">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Yesterday&apos;s Performance</h2>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-success">{mockYesterdayStats.wins}</p>
              <p className="text-text-secondary text-sm mt-1">Wins</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-danger">{mockYesterdayStats.losses}</p>
              <p className="text-text-secondary text-sm mt-1">Losses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-text-primary">{mockYesterdayStats.accuracy}%</p>
              <p className="text-text-secondary text-sm mt-1">Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">
                {mockYesterdayStats.record.wins}W/{mockYesterdayStats.record.losses}L
              </p>
              <p className="text-text-secondary text-sm mt-1">Last 30 picks</p>
            </div>
          </div>
          <div className="border-t border-border mt-6 pt-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-text-secondary text-sm">Last 7 days:</span>
              <span className="text-text-primary font-semibold text-sm">{mockYesterdayStats.last7Days}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-secondary text-sm">Last 30 days:</span>
              <span className="text-text-primary font-semibold text-sm">{mockYesterdayStats.last30Days}%</span>
            </div>
            <Link href="/results" className="ml-auto text-accent text-sm hover:underline">
              Full record →
            </Link>
          </div>
        </div>
      </section>

      {/* Live Matches — hidden if none */}
      {SHOW_LIVE && (
        <section className="py-8 border-t border-border">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse" />
            <h2 className="text-2xl font-bold text-text-primary">Live Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockLiveMatches.map((match: LiveMatch) => (
              <LiveMatchBanner key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Matches */}
      <section className="py-8 border-t border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Upcoming Matches</h2>
          <Link href="/matches" className="text-accent text-sm hover:underline hidden md:block">
            View all →
          </Link>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {mockUpcomingMatches.map((match: UpcomingMatch, index: number) => (
            <Link key={match.id} href={`/matches/${match.slug}`}>
              <div className={`flex items-center justify-between p-4 hover:bg-background/50 transition-colors cursor-pointer ${index !== mockUpcomingMatches.length - 1 ? 'border-b border-border' : ''}`}>

                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative w-6 h-6 shrink-0">
                    <Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" />
                  </div>
                  <span className="text-text-primary text-sm font-medium truncate">{match.homeTeam}</span>
                  <span className="text-text-secondary text-xs shrink-0">vs</span>
                  <div className="relative w-6 h-6 shrink-0">
                    <Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-contain" />
                  </div>
                  <span className="text-text-primary text-sm font-medium truncate">{match.awayTeam}</span>
                </div>

                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <span className="text-text-secondary text-xs hidden sm:block">{match.kickoff}</span>
                  <ConfidenceBadge tier={match.confidenceTier} confidence={match.confidence} size="sm" />
                  <span className="text-text-secondary text-xs hidden md:block">{match.topPick}</span>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* World Cup 2026 */}
      <section className="py-8 border-t border-border">
        <div className="bg-gradient-to-r from-accent/10 to-success/10 border border-accent/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-text-primary">🏆 World Cup 2026</h2>
              <p className="text-text-secondary text-sm mt-1">Today&apos;s tournament predictions</p>
            </div>
            <Link href="/world-cup" className="text-accent text-sm hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockWorldCupMatches.map((match: WorldCupMatch) => (
              <Link key={match.id} href={`/matches/${match.slug}`}>
                <div className="bg-background/50 border border-border rounded-lg p-4 hover:border-accent/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-text-secondary">{match.kickoff}</span>
                    <ConfidenceBadge tier={match.confidenceTier} confidence={match.confidence} size="sm" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8">
                      <Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="text-text-primary text-sm font-medium">
                        {match.homeTeam} vs {match.awayTeam}
                      </p>
                      <p className="text-accent text-xs font-medium mt-0.5">{match.topPick}</p>
                    </div>
                    <div className="relative w-8 h-8">
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
      <section className="py-8 border-t border-border">
        <h2 className="text-2xl font-bold text-text-primary mb-6">League Explorer</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockLeagues.map((league: League) => (
            <Link key={league.slug} href={league.slug === 'world-cup' ? '/world-cup' : `/leagues/${league.slug}`}>
              <div className="bg-card border border-border rounded-xl p-4 hover:border-accent/50 transition-all cursor-pointer flex flex-col items-center gap-3 text-center">
                <div className="relative w-10 h-10">
                  <Image src={league.logo} alt={league.name} fill className="object-contain" />
                </div>
                <div>
                  <p className="text-text-primary text-xs font-medium leading-tight">{league.name}</p>
                  <p className="text-text-secondary text-xs mt-0.5">{league.matchesToday} matches today</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA — only for logged out users, controlled client-side */}
      <section className="py-8 border-t border-border">
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-text-primary">Track your predictions</h2>
          <p className="text-text-secondary mt-2 mb-6">Free account. No credit card required.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {[
              '✓ Save matches to your watchlist',
              '✓ Track your prediction accuracy',
              '✓ Your personal prediction streak',
              '✓ Match notifications before kickoff',
            ].map((item: string) => (
              <span key={item} className="text-text-secondary text-sm">{item}</span>
            ))}
          </div>
          <Link
            href="/register"
            className="inline-block bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </section>

    </div>
  )
}