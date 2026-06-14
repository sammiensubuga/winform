'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { mockTopPicks, mockUpcomingMatches, mockLeagues } from '@/lib/mock-data'

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const filteredMatches = [...mockTopPicks, ...mockUpcomingMatches].filter(match =>
    match.homeTeam.toLowerCase().includes(query.toLowerCase()) ||
    match.awayTeam.toLowerCase().includes(query.toLowerCase()) ||
    match.league.toLowerCase().includes(query.toLowerCase())
  )

  const filteredLeagues = mockLeagues.filter(league =>
    league.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-text-primary mb-2">
        Search results for &quot;{query}&quot;
      </h1>
      <p className="text-text-secondary mb-8">
        Found {filteredMatches.length + filteredLeagues.length} results
      </p>

      {filteredLeagues.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Leagues</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {filteredLeagues.map(league => (
              <Link key={league.slug} href={`/leagues/${league.slug}`}>
                <div className="bg-card border border-border rounded-xl p-4 hover:border-accent/50 transition-all cursor-pointer text-center">
                  <div className="relative w-12 h-12 mx-auto mb-2">
                    <Image src={league.logo} alt={league.name} fill className="object-contain" />
                  </div>
                  <p className="text-text-primary text-sm font-medium">{league.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {filteredMatches.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMatches.map(match => (
              <Link key={match.id} href={`/matches/${match.slug}`}>
                <div className="bg-card border border-border rounded-xl p-4 hover:border-accent/50 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-text-secondary">{match.league}</span>
                    <span className="text-xs text-text-secondary">{match.kickoff}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="relative w-10 h-10">
                        <Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" />
                      </div>
                      <span className="text-xs text-text-primary font-medium">{match.homeTeam}</span>
                    </div>
                    <span className="text-text-secondary text-xs">vs</span>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="relative w-10 h-10">
                        <Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-contain" />
                      </div>
                      <span className="text-xs text-text-primary font-medium">{match.awayTeam}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {filteredMatches.length === 0 && filteredLeagues.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-secondary">No results found for &quot;{query}&quot;</p>
          <p className="text-text-secondary text-sm mt-2">Try searching for a different team, league, or match.</p>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-text-secondary">Loading...</div>}>
      <SearchResults />
    </Suspense>
  )
}