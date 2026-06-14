'use client'

import Link from 'next/link'
import Image from 'next/image'

interface LiveMatchProps {
  match: {
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
}

export default function LiveMatchBanner({ match }: LiveMatchProps) {
  return (
    <Link href={`/matches/${match.slug}`}>
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-green-500/50 transition-all cursor-pointer">

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500">{match.league}</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-500 text-xs font-medium">LIVE {match.minute}&apos;</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative w-7 h-7 flex-shrink-0">
              <Image
                src={match.homeTeamLogo}
                alt={match.homeTeam}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-gray-800 text-sm font-medium truncate">
              {match.homeTeam}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-gray-800 font-bold text-lg">{match.homeScore}</span>
            <span className="text-gray-400 text-sm">—</span>
            <span className="text-gray-800 font-bold text-lg">{match.awayScore}</span>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="text-gray-800 text-sm font-medium truncate text-right">
              {match.awayTeam}
            </span>
            <div className="relative w-7 h-7 flex-shrink-0">
              <Image
                src={match.awayTeamLogo}
                alt={match.awayTeam}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
          <span className="text-gray-500 text-xs">
            Possession {match.possession.home}% — {match.possession.away}%
          </span>
          <span className="text-gray-500 text-xs">
            Shots {match.shots.home} — {match.shots.away}
          </span>
        </div>

      </div>
    </Link>
  )
}