'use client'

import Link from 'next/link'

interface LiveMatchProps {
  match: {
    id: number
    slug: string
    homeTeam: string
    awayTeam: string
    homeTeamLogo?: string
    awayTeamLogo?: string
    league: string
    homeScore: number
    awayScore: number
    minute: number
    possession: { home: number; away: number }
    shots: { home: number; away: number }
    topPick?: string
    confidence?: number
    confidenceTier?: string
  }
}

export default function LiveMatchBanner({ match }: LiveMatchProps) {
  const possessionHome = match.possession.home
  const possessionAway = match.possession.away
  const possessionTotal = possessionHome + possessionAway
  const possessionPercent = possessionTotal > 0 ? (possessionHome / possessionTotal) * 100 : 50

  return (
    <Link href={`/matches/${match.slug}`}>
      <div className="bg-card border-l-4 border-red-500 border border-border rounded-xl p-4 hover:border-red-500/70 transition-all cursor-pointer h-full">
        
        {/* Top row: League with red dot + Minute */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-text-secondary text-xs font-medium">{match.league}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-red-500 text-xs font-bold">{match.minute}'</span>
          </div>
        </div>

        {/* Main row: Teams and Score */}
        <div className="flex items-center justify-between gap-4">
          {/* Home Team */}
          <div className="flex-1">
            <p className="text-text-primary font-bold text-lg sm:text-xl truncate">
              {match.homeTeam}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-text-tertiary text-[10px]">
                Shots {match.shots.home}
              </span>
              <span className="text-text-tertiary text-[10px]">
                {match.possession.home}% pos
              </span>
            </div>
          </div>

          {/* Score */}
          <div className="text-center shrink-0">
            <p className="text-text-primary font-bold text-3xl sm:text-4xl">
              {match.homeScore} — {match.awayScore}
            </p>
          </div>

          {/* Away Team */}
          <div className="flex-1 text-right">
            <p className="text-text-primary font-bold text-lg sm:text-xl truncate">
              {match.awayTeam}
            </p>
            <div className="flex items-center justify-end gap-3 mt-1">
              <span className="text-text-tertiary text-[10px]">
                {match.possession.away}% pos
              </span>
              <span className="text-text-tertiary text-[10px]">
                Shots {match.shots.away}
              </span>
            </div>
          </div>
        </div>

        {/* Possession Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-text-tertiary text-[10px]">{possessionHome}%</span>
            <span className="text-text-tertiary text-[10px]">Possession</span>
            <span className="text-text-tertiary text-[10px]">{possessionAway}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${possessionPercent}%` }}
            />
          </div>
        </div>

      </div>
    </Link>
  )
}