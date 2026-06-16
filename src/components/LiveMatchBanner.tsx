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
    leagueLogo?: string
    homeScore: number
    awayScore: number
    minute: number
    possession: { home: number; away: number }
    shots: { home: number; away: number }
    topPick?: string
    confidence?: number
    confidenceTier?: string
    homeProbability?: number
    drawProbability?: number
    awayProbability?: number
  }
}

export default function LiveMatchBanner({ match }: LiveMatchProps) {
  const [time, setTime] = useState({ minutes: match.minute, seconds: 0 })
  const [homeProb, setHomeProb] = useState(match.homeProbability || 52)
  const [drawProb, setDrawProb] = useState(match.drawProbability || 24)
  const [awayProb, setAwayProb] = useState(match.awayProbability || 24)
  const [possessionHome, setPossessionHome] = useState(match.possession.home)
  const [possessionAway, setPossessionAway] = useState(match.possession.away)
  
  // Get match session display
  const getMatchSession = (minute: number) => {
    if (minute < 45) return `${minute}'`
    if (minute === 45) return '45\' HT'
    if (minute > 45 && minute < 90) return `${minute}'`
    if (minute === 90) return '90\' FT'
    if (minute > 90 && minute < 105) return `${minute}'`
    if (minute === 105) return 'ET HT'
    if (minute > 105 && minute < 120) return `ET ${minute - 90}'`
    if (minute === 120) return 'ET FT'
    return `${minute}'`
  }

  // Update time every second
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

  // Update probabilities every 3 seconds
  useEffect(() => {
    const probTimer = setInterval(() => {
      setHomeProb(prev => {
        const change = (Math.random() * 6) - 3
        const newVal = Math.max(30, Math.min(70, prev + change))
        const roundedVal = Math.round(newVal)
        const remaining = 100 - roundedVal
        const currentDraw = drawProb
        const currentAway = awayProb
        const totalDA = currentDraw + currentAway
        if (totalDA > 0) {
          const newDraw = Math.round((currentDraw / totalDA) * remaining)
          const newAway = remaining - newDraw
          setDrawProb(Math.max(15, Math.min(40, newDraw)))
          setAwayProb(Math.max(15, Math.min(40, newAway)))
        }
        return roundedVal
      })
    }, 3000)
    
    return () => clearInterval(probTimer)
  }, [drawProb, awayProb])

  // Update possession every 5 seconds
  useEffect(() => {
    const possessionTimer = setInterval(() => {
      setPossessionHome(prev => {
        const change = (Math.random() * 4) - 2
        const newVal = Math.max(30, Math.min(70, prev + change))
        const roundedVal = Math.round(newVal)
        setPossessionAway(100 - roundedVal)
        return roundedVal
      })
    }, 5000)
    
    return () => clearInterval(possessionTimer)
  }, [])

  const possessionTotal = possessionHome + possessionAway
  const possessionPercent = possessionTotal > 0 ? (possessionHome / possessionTotal) * 100 : 50

  const sessionDisplay = getMatchSession(time.minutes)

  return (
    <Link href={`/matches/${match.slug}`}>
      <div className="relative bg-gradient-to-br from-red-950/40 to-card border-l-4 border-red-500 border border-border rounded-xl p-3 sm:p-4 hover:border-red-500/70 transition-all cursor-pointer h-full overflow-hidden">
        
        {/* Top row: League + Session */}
        <div className="flex items-center justify-between mt-1">
          {/* League name with logo - Left */}
          <div className="flex items-center gap-1.5">
            {match.leagueLogo && (
              <div className="relative w-4 h-4 shrink-0">
                <Image
                  src={match.leagueLogo}
                  alt={match.league}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
            <span className="text-text-secondary text-[10px] sm:text-xs font-medium">{match.league}</span>
          </div>
          
          {/* Match Session - Right */}
          <div className="text-text-secondary text-[10px] sm:text-xs font-medium tabular">
            {sessionDisplay}
          </div>
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
                {possessionHome}%
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
                {possessionAway}%
              </span>
              <span className="text-text-tertiary text-[8px] sm:text-[10px]">
                Shots {match.shots.away}
              </span>
            </div>
          </div>
        </div>

        {/* Speedometer Gauge - Line style */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-text-tertiary text-[8px] sm:text-[10px]">Home Win</span>
            <span className="text-text-tertiary text-[8px] sm:text-[10px]">Draw</span>
            <span className="text-text-tertiary text-[8px] sm:text-[10px]">Away Win</span>
          </div>
          
          <div className="relative w-full h-8 bg-gray-800 rounded-full overflow-hidden">
            {/* Gradient zones */}
            <div className="absolute inset-0 flex">
              <div className="w-1/3 bg-green-500/30"></div>
              <div className="w-1/3 bg-orange-500/30"></div>
              <div className="w-1/3 bg-blue-500/30"></div>
            </div>
            
            {/* Needle */}
            <div 
              className="absolute top-0 w-0.5 h-full bg-white shadow-lg transition-all duration-700 ease-out"
              style={{ 
                left: `${(homeProb - 30) / 40 * 100}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full shadow-lg shadow-red-500/50"></div>
            </div>
            
            {/* Percentage labels on the gauge */}
            <div className="absolute inset-0 flex items-center justify-between px-2">
              <span className="text-[8px] font-bold text-white/60">30%</span>
              <span className="text-[8px] font-bold text-white/60">50%</span>
              <span className="text-[8px] font-bold text-white/60">70%</span>
            </div>
            
            {/* Needle value indicator */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white">
              {homeProb}%
            </div>
          </div>
          
          {/* W/D/W percentages below gauge */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-text-primary font-bold text-xs">{homeProb}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span className="text-text-primary font-bold text-xs">{drawProb}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-text-primary font-bold text-xs">{awayProb}%</span>
            </div>
          </div>
        </div>

        {/* Possession Bar - Dynamic */}
        <div className="mt-3 sm:mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-text-tertiary text-[8px] sm:text-[10px]">{possessionHome}%</span>
            <span className="text-text-tertiary text-[8px] sm:text-[10px]">Possession</span>
            <span className="text-text-tertiary text-[8px] sm:text-[10px]">{possessionAway}%</span>
          </div>
          <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${possessionPercent}%` }}
            />
          </div>
        </div>

      </div>
    </Link>
  )
}