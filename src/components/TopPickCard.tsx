'use client'

import Image from 'next/image'
import Link from 'next/link'
import ConfidenceBadge from './ConfidenceBadge'

interface TopPickCardProps {
  match: {
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
    aiPreviewShort?: string
  }
}

export default function TopPickCard({ match }: TopPickCardProps) {
  const oddsDropped = match.odds < match.previousOdds
  const oddsRaised = match.odds > match.previousOdds
  const oddsChanged = oddsDropped || oddsRaised

  return (
    <Link href={`/matches/${match.slug}`}>
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-green-500/50 transition-all duration-200 cursor-pointer h-full flex flex-col gap-4">

        {/* League and kickoff */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{match.league}</span>
          <span className="text-xs text-gray-500">{match.kickoff}</span>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div className="relative w-10 h-10">
              <Image
                src={match.homeTeamLogo}
                alt={match.homeTeam}
                fill
                className="object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-team.png'
                }}
              />
            </div>
            <span className="text-xs text-gray-800 font-medium text-center leading-tight">
              {match.homeTeam}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-gray-400 text-xs font-medium">VS</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div className="relative w-10 h-10">
              <Image
                src={match.awayTeamLogo}
                alt={match.awayTeam}
                fill
                className="object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-team.png'
                }}
              />
            </div>
            <span className="text-xs text-gray-800 font-medium text-center leading-tight">
              {match.awayTeam}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Top Pick */}
        <div className="flex flex-col gap-2">
          <ConfidenceBadge tier={match.confidenceTier} confidence={match.confidence} />

          <p className="text-gray-800 font-semibold text-base">
            {match.topPick}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">
              Odds {match.odds.toFixed(2)}
            </span>
            {oddsChanged && (
              <span className={`text-xs ${oddsDropped ? 'text-green-600' : 'text-red-600'}`}>
                {oddsDropped ? '↓' : '↑'} was {match.previousOdds.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* AI Preview */}
        {match.aiPreviewShort && (
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
            {match.aiPreviewShort}
          </p>
        )}

        {/* CTA */}
        <div className="mt-auto pt-2">
          <span className="text-green-600 text-xs font-medium hover:underline">
            View full analysis →
          </span>
        </div>

      </div>
    </Link>
  )
}