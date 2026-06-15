'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Search } from 'lucide-react'
import { mockTopPicks, mockLeagues, mockUpcomingMatches } from '@/lib/mock-data'

type MatchType = {
  id: number
  slug: string
  homeTeam: string
  awayTeam: string
  homeTeamLogo: string
  awayTeamLogo: string
  league: string
  kickoff: string
}

type LeagueType = {
  name: string
  slug: string
  logo: string
  country: string
  matchesToday: number
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ matches: MatchType[]; leagues: LeagueType[] }>({ matches: [], leagues: [] })
useEffect(() => {
  if (!query.trim()) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResults({ matches: [], leagues: [] })
    return
  }

  const searchLower = query.toLowerCase()
  
  const matches = [...mockTopPicks, ...mockUpcomingMatches].filter((match: MatchType) =>
    match.homeTeam.toLowerCase().includes(searchLower) ||
    match.awayTeam.toLowerCase().includes(searchLower) ||
    match.league.toLowerCase().includes(searchLower)
  )

  const leagues = mockLeagues.filter((league: LeagueType) =>
    league.name.toLowerCase().includes(searchLower)
  )

  setResults({ matches, leagues })
}, [query])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-md">
      <div className="max-w-3xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-text-primary">Search</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-card transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams, leagues, matches..."
            className="w-full bg-card border border-border rounded-xl px-5 py-4 pl-12 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            autoFocus
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
        </div>

        {/* Results */}
        {query.trim() && (
          <div className="space-y-6">
            {/* Leagues Section */}
            {results.leagues.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-3">Leagues</h3>
                <div className="space-y-2">
                  {results.leagues.map((league: LeagueType) => (
                    <Link
                      key={league.slug}
                      href={`/leagues/${league.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-card transition-colors group"
                    >
                      <div className="relative w-8 h-8">
                        <Image src={league.logo} alt={league.name} width={32} height={32} className="object-contain" />
                      </div>
                      <div className="flex-1">
                        <p className="text-text-primary font-medium group-hover:text-accent transition-colors">
                          {league.name}
                        </p>
                        <p className="text-text-tertiary text-sm">{league.country}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Matches Section */}
            {results.matches.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-3">Matches</h3>
                <div className="space-y-2">
                  {results.matches.map((match: MatchType) => (
                    <Link
                      key={match.id}
                      href={`/matches/${match.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-card transition-colors group"
                    >
                      <div className="relative w-6 h-6">
                        <Image src={match.homeTeamLogo} alt={match.homeTeam} width={24} height={24} className="object-contain" />
                      </div>
                      <div className="flex-1">
                        <p className="text-text-primary font-medium group-hover:text-accent transition-colors">
                          {match.homeTeam} vs {match.awayTeam}
                        </p>
                        <p className="text-text-tertiary text-sm">{match.league} · {match.kickoff}</p>
                      </div>
                      <div className="relative w-6 h-6">
                        <Image src={match.awayTeamLogo} alt={match.awayTeam} width={24} height={24} className="object-contain" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {results.leagues.length === 0 && results.matches.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-secondary">No results found for &quot;{query}&quot;</p>
                <p className="text-text-tertiary text-sm mt-2">Try searching for a different team or league</p>
              </div>
            )}
          </div>
        )}

        {/* Initial state - popular searches */}
        {!query.trim() && (
          <div>
            <h3 className="text-sm font-medium text-text-secondary mb-3">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {['Arsenal', 'Liverpool', 'Premier League', 'Champions League', 'Real Madrid', 'Bayern'].map(term => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 bg-card border border-border rounded-lg text-sm text-text-secondary hover:text-accent hover:border-accent transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}