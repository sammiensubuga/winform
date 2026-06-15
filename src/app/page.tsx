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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center relative">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-green-400 text-sm font-medium">Live Predictions</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            AI-Powered Football
            <br />
            <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Predictions
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            Data-driven match analysis, confidence scores, and transparent prediction tracking. 
            Join thousands of users making smarter bets.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#top-picks"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View Today&apos;s Picks
            </a>
            <Link
              href="/register"
              className="border border-gray-700 hover:border-green-500 text-gray-300 hover:text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="border-b border-gray-200 bg-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">Yesterday:</span>
            <span className="text-green-600 font-medium">✅ {mockYesterdayStats.wins} wins</span>
            <span className="text-gray-300">|</span>
            <span className="text-red-500 font-medium">❌ {mockYesterdayStats.losses} losses</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-700 font-semibold">📊 {mockYesterdayStats.accuracy}% accuracy</span>
          </div>
          <Link href="/results" className="text-green-600 hover:text-green-700 text-sm font-medium">
            View full record →
          </Link>
        </div>
      </div>

      {/* Today&apos;s Top Picks */}
      <section id="top-picks" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Today&apos;s Top Picks</h2>
            <p className="text-gray-600">AI-selected best opportunities · {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>

          {elitePicks.length > 0 && (
            <>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">⭐ Elite Picks — 80%+ confidence</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {elitePicks.map((match: TopPick) => (
                  <TopPickCard key={match.id} match={match} />
                ))}
              </div>
            </>
          )}

          {strongPicks.length > 0 && (
            <>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-4 mt-8">💪 Strong Picks — 70–79% confidence</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {strongPicks.map((match: TopPick) => (
                  <TopPickCard key={match.id} match={match} />
                ))}
              </div>
            </>
          )}

          {valuePicks.length > 0 && (
            <>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-4 mt-8">🎯 Value Picks — 55–69% confidence</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {valuePicks.map((match: TopPick) => (
                  <TopPickCard key={match.id} match={match} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Yesterday&apos;s Performance */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Yesterday&apos;s Performance</h2>
            <p className="text-gray-600">Track record transparency — every prediction logged</p>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600">{mockYesterdayStats.wins}</p>
                <p className="text-gray-500 text-sm mt-1">Wins</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-red-500">{mockYesterdayStats.losses}</p>
                <p className="text-gray-500 text-sm mt-1">Losses</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900">{mockYesterdayStats.accuracy}%</p>
                <p className="text-gray-500 text-sm mt-1">Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600">{mockYesterdayStats.record.wins}W-{mockYesterdayStats.record.losses}L</p>
                <p className="text-gray-500 text-sm mt-1">Last 30 picks</p>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-8 pt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">Last 7 days:</span>
                  <span className="text-gray-900 font-semibold">{mockYesterdayStats.last7Days}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">Last 30 days:</span>
                  <span className="text-gray-900 font-semibold">{mockYesterdayStats.last30Days}%</span>
                </div>
              </div>
              <Link href="/results" className="text-green-600 hover:text-green-700 text-sm font-medium">
                View detailed history →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Matches */}
      {SHOW_LIVE && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              <h2 className="text-2xl font-bold text-gray-900">Live Now</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockLiveMatches.map((match: LiveMatch) => (
                <LiveMatchBanner key={match.id} match={match} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Matches */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Matches</h2>
            <Link href="/matches" className="text-green-600 hover:text-green-700 text-sm font-medium">
              View all →
            </Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {mockUpcomingMatches.map((match: UpcomingMatch, index: number) => (
              <Link key={match.id} href={`/matches/${match.slug}`}>
                <div className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer ${index !== mockUpcomingMatches.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative w-8 h-8 shrink-0">
                      <Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" />
                    </div>
                    <span className="text-gray-900 text-sm font-medium truncate">{match.homeTeam}</span>
                    <span className="text-gray-400 text-xs shrink-0">vs</span>
                    <div className="relative w-8 h-8 shrink-0">
                      <Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-contain" />
                    </div>
                    <span className="text-gray-900 text-sm font-medium truncate">{match.awayTeam}</span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    <span className="text-gray-500 text-xs hidden sm:block">{match.kickoff}</span>
                    <ConfidenceBadge tier={match.confidenceTier} confidence={match.confidence} size="sm" />
                    <span className="text-gray-500 text-xs hidden md:block">{match.topPick}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* World Cup 2026 */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">🏆 World Cup 2026</h2>
              <p className="text-gray-600 text-sm mt-1">Today&apos;s tournament predictions</p>
            </div>
            <Link href="/world-cup" className="text-green-600 hover:text-green-700 text-sm font-medium">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockWorldCupMatches.map((match: WorldCupMatch) => (
              <Link key={match.id} href={`/matches/${match.slug}`}>
                <div className="bg-white rounded-xl p-5 hover:shadow-lg transition-shadow border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">{match.kickoff}</span>
                    <ConfidenceBadge tier={match.confidenceTier} confidence={match.confidence} size="sm" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative w-10 h-10">
                        <Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" />
                      </div>
                      <span className="text-gray-900 font-medium">{match.homeTeam}</span>
                    </div>
                    <span className="text-gray-400 text-sm">vs</span>
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      <span className="text-gray-900 font-medium">{match.awayTeam}</span>
                      <div className="relative w-10 h-10">
                        <Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-contain" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-green-600 text-sm font-medium">Top pick: {match.topPick}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* League Explorer */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">League Explorer</h2>
            <p className="text-gray-600">Browse predictions by competition</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {mockLeagues.map((league: League) => (
              <Link key={league.slug} href={league.slug === 'world-cup' ? '/world-cup' : `/leagues/${league.slug}`}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:border-green-500 hover:shadow-md transition-all cursor-pointer text-center group">
                  <div className="relative w-12 h-12 mx-auto mb-3">
                    <Image src={league.logo} alt={league.name} fill className="object-contain" />
                  </div>
                  <p className="text-gray-900 text-sm font-medium group-hover:text-green-600 transition-colors">{league.name}</p>
                  <p className="text-gray-500 text-xs mt-1">{league.matchesToday} matches today</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to start winning?</h2>
          <p className="text-gray-400 text-lg mb-8">Join thousands of users tracking AI predictions. Free account, no credit card required.</p>
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span className="text-green-500">✓</span> Save matches to watchlist
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span className="text-green-500">✓</span> Track prediction accuracy
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span className="text-green-500">✓</span> Personal prediction streak
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span className="text-green-500">✓</span> Match notifications
            </div>
          </div>
          <Link
            href="/register"
            className="inline-block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            Create Free Account →
          </Link>
        </div>
      </section>
    </div>
  )
}