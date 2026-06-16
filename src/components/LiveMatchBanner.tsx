'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

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
    topPick?: string
    confidence?: number
    confidenceTier?: string
  }
}

export default function LiveMatchBanner({ match }: LiveMatchProps) {
  const [time, setTime] = useState({ minutes: match.minute, seconds: 0 })
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        let newSeconds = prev.seconds + 1
        let newMinutes = prev.minutes
        if (newSeconds >= 60) {
          newSeconds = 0
          newMinutes += 1
        }
        return { minutes: newMinutes, seconds: newSeconds }
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  const possessionHome = match.possession.home
  const possessionAway = match.possession.away
  const possessionTotal = possessionHome + possessionAway
  const possessionPercent = possessionTotal > 0 ? (possessionHome / possessionTotal) * 100 : 50

  return (
    <Link href={`/matches/${match.slug}`}>
      <div className="relative bg-gradient-to-br from-red-950/40 to-card border-l-4 border-red-500 border border-border rounded-xl p-3 sm:p-4 hover:border-red-500/70 transition-all cursor-pointer h-full overflow-hidden">
        
      {/* iPhone-style Recording Indicator - Top Center */}
<div className="absolute top-1 left-1/2 -translate-x-1/2 z-10">
  <div className="bg-black/80 backdrop-blur-md rounded-full px-3 py-0.5 flex items-center gap-1.5 border border-white/10 shadow-lg">
    <div className="relative">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" />
      <span className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping opacity-75" />
    </div>
    <span className="text-white text-[10px] font-mono font-bold tabular tracking-wider">
      {String(time.minutes).padStart(2, '0')}:{String(time.seconds).padStart(2, '0')}
    </span>
    <div className="flex gap-0.5">
      <span className="w-0.5 h-0.5 rounded-full bg-white/40" />
      <span className="w-0.5 h-0.5 rounded-full bg-white/40" />
      <span className="w-0.5 h-0.5 rounded-full bg-white/40" />
    </div>
  </div>
</div>

        {/* League name */}
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-text-secondary text-[10px] sm:text-xs font-medium">{match.league}</span>
        </div>

        {/* Main row: Teams, Logos, and Score */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 mt-2">
          {/* Home Team */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <div className="relative w-5 h-5 sm:w-6 sm:h-6 shrink-0">
                <Image
                  src={match.homeTeamLogo}
                  alt={match.homeTeam}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
              <p className="text-text-primary font-bold text-sm sm:text-lg truncate">
                {match.homeTeam}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 pl-6 sm:pl-8">
              <span className="text-text-tertiary text-[8px] sm:text-[10px]">
                Shots {match.shots.home}
              </span>
              <span className="text-text-tertiary text-[8px] sm:text-[10px]">
                {match.possession.home}%
              </span>
            </div>
          </div>

          {/* Score - Horizontal on one line */}
          <div className="text-center shrink-0 px-2">
            <span className="text-text-primary font-bold text-xl sm:text-3xl whitespace-nowrap">
              {match.homeScore} — {match.awayScore}
            </span>
          </div>

          {/* Away Team */}
          <div className="flex-1 min-w-0 text-right">
            <div className="flex items-center justify-end gap-1.5 sm:gap-2 mb-1">
              <p className="text-text-primary font-bold text-sm sm:text-lg truncate">
                {match.awayTeam}
              </p>
              <div className="relative w-5 h-5 sm:w-6 sm:h-6 shrink-0">
                <Image
                  src={match.awayTeamLogo}
                  alt={match.awayTeam}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 sm:gap-3 pr-6 sm:pr-8">
              <span className="text-text-tertiary text-[8px] sm:text-[10px]">
                {match.possession.away}%
              </span>
              <span className="text-text-tertiary text-[8px] sm:text-[10px]">
                Shots {match.shots.away}
              </span>
            </div>
          </div>
        </div>

        {/* Possession Bar */}
        <div className="mt-3 sm:mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-text-tertiary text-[8px] sm:text-[10px]">{possessionHome}%</span>
            <span className="text-text-tertiary text-[8px] sm:text-[10px]">Possession</span>
            <span className="text-text-tertiary text-[8px] sm:text-[10px]">{possessionAway}%</span>
          </div>
          <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
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