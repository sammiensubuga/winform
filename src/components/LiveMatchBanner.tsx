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
  const [possessionHome, setPossessionHome] = useState(match.possession.home)
  const [possessionAway, setPossessionAway] = useState(match.possession.away)
  const [homeScore, setHomeScore] = useState(match.homeScore)
  const [awayScore, setAwayScore] = useState(match.awayScore)
  
  // Calculate probabilities based on score and match state
  const calculateProbabilities = () => {
    const scoreDiff = homeScore - awayScore
    const timeRemaining = Math.max(0, 90 - time.minutes)
    
    let home = match.homeProbability || 52
    let draw = match.drawProbability || 24
    let away = match.awayProbability || 24
    
    // Score influence
    if (scoreDiff > 0) {
      const boost = Math.min(20, scoreDiff * 5)
      home = Math.min(85, home + boost)
      draw = Math.max(5, draw - boost * 0.4)
      away = Math.max(5, away - boost * 0.6)
    } else if (scoreDiff < 0) {
      const boost = Math.min(20, Math.abs(scoreDiff) * 5)
      away = Math.min(85, away + boost)
      draw = Math.max(5, draw - boost * 0.4)
      home = Math.max(5, home - boost * 0.6)
    } else {
      draw = Math.min(45, draw + 5)
      home = Math.max(15, home - 2.5)
      away = Math.max(15, away - 2.5)
    }
    
    // Time influence
    if (timeRemaining < 15) {
      const lateBoost = (15 - timeRemaining) / 15 * 10
      if (scoreDiff > 0) {
        home = Math.min(90, home + lateBoost)
        draw = Math.max(3, draw - lateBoost * 0.5)
        away = Math.max(2, away - lateBoost * 0.5)
      } else if (scoreDiff < 0) {
        away = Math.min(90, away + lateBoost)
        draw = Math.max(3, draw - lateBoost * 0.5)
        home = Math.max(2, home - lateBoost * 0.5)
      }
    }
    
    const total = home + draw + away
    return {
      home: Math.round((home / total) * 100),
      draw: Math.round((draw / total) * 100),
      away: Math.round((away / total) * 100)
    }
  }

  const probs = calculateProbabilities()
  const [homeProb, setHomeProb] = useState(probs.home)
  const [drawProb, setDrawProb] = useState(probs.draw)
  const [awayProb, setAwayProb] = useState(probs.away)

  // Update probabilities when score or time changes
  useEffect(() => {
    const newProbs = calculateProbabilities()
    /* eslint-disable react-hooks/set-state-in-effect */
    setHomeProb(newProbs.home)
    setDrawProb(newProbs.draw)
    setAwayProb(newProbs.away)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [homeScore, awayScore, time.minutes])

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
        if (newMinutes > 120) newMinutes = 120
        return { minutes: newMinutes, seconds: newSeconds }
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

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

  // Simulate goals every 20 seconds
  useEffect(() => {
    const goalTimer = setInterval(() => {
      if (time.minutes < 90) {
        if (Math.random() < 0.12) {
          if (Math.random() < 0.55) {
            setHomeScore(prev => prev + 1)
          } else {
            setAwayScore(prev => prev + 1)
          }
        }
      }
    }, 20000)
    
    return () => clearInterval(goalTimer)
  }, [time.minutes])

  const possessionTotal = possessionHome + possessionAway
  const possessionPercent = possessionTotal > 0 ? (possessionHome / possessionTotal) * 100 : 50

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

  const sessionDisplay = getMatchSession(time.minutes)

  return (
    <Link href={`/matches/${match.slug}`}>
      <div className="relative bg-gradient-to-br from-red-950/40 to-card border-l-4 border-red-500 border border-border rounded-xl p-3 sm:p-4 hover:border-red-500/70 transition-all cursor-pointer h-full overflow-hidden">
        
        {/* Dynamic Recording Card - Top Center */}
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

        {/* Top row: League + Session */}
        <div className="flex items-center justify-between mt-1">
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
          <div className="text-text-secondary text-[10px] sm:text-xs font-medium tabular">
            {sessionDisplay}
          </div>
        </div>

        {/* Main row: Teams, Logos, and Score */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 mt-2">
          {/* Home Team */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col items-center gap-1">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0">
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
              <p className="text-text-primary font-bold text-xs sm:text-sm truncate text-center">
                {match.homeTeam}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3 mt-1">
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
              {homeScore} — {awayScore}
            </span>
          </div>

          {/* Away Team */}
          <div className="flex-1 min-w-0 text-right">
            <div className="flex flex-col items-center gap-1">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0">
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
              <p className="text-text-primary font-bold text-xs sm:text-sm truncate text-center">
                {match.awayTeam}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3 mt-1">
              <span className="text-text-tertiary text-[8px] sm:text-[10px]">
                {possessionAway}%
              </span>
              <span className="text-text-tertiary text-[8px] sm:text-[10px]">
                Shots {match.shots.away}
              </span>
            </div>
          </div>
        </div>

        {/* Speedometer Gauge - Dynamic colors */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-text-tertiary text-[8px] sm:text-[10px]">Home Win</span>
            <span className="text-text-tertiary text-[8px] sm:text-[10px]">Draw</span>
            <span className="text-text-tertiary text-[8px] sm:text-[10px]">Away Win</span>
          </div>
          
          <div className="relative w-full h-8 bg-gray-800 rounded-full overflow-hidden">
            {/* Dynamic gradient zones based on match state */}
            <div className="absolute inset-0 flex">
              {homeScore > awayScore ? (
                // Home team winning - Green home zone
                <>
                  <div className="w-1/3 bg-green-500/40"></div>
                  <div className="w-1/3 bg-gray-600/30"></div>
                  <div className="w-1/3 bg-gray-600/30"></div>
                </>
              ) : homeScore < awayScore ? (
                // Away team winning - Green away zone
                <>
                  <div className="w-1/3 bg-gray-600/30"></div>
                  <div className="w-1/3 bg-gray-600/30"></div>
                  <div className="w-1/3 bg-green-500/40"></div>
                </>
              ) : (
                // Draw - Orange draw zone
                <>
                  <div className="w-1/3 bg-gray-600/30"></div>
                  <div className="w-1/3 bg-orange-500/40"></div>
                  <div className="w-1/3 bg-gray-600/30"></div>
                </>
              )}
            </div>
            
            {/* Needle */}
            <div 
              className="absolute top-0 w-0.5 h-full shadow-lg transition-all duration-700 ease-out"
              style={{ 
                left: `${(homeProb - 30) / 40 * 100}%`,
                transform: 'translateX(-50%)',
                backgroundColor: homeScore > awayScore ? '#22C55E' : homeScore < awayScore ? '#22C55E' : '#F97316'
              }}
            >
              <div 
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full shadow-lg"
                style={{ 
                  backgroundColor: homeScore > awayScore ? '#22C55E' : homeScore < awayScore ? '#22C55E' : '#F97316',
                  boxShadow: homeScore > awayScore ? '0 0 12px rgba(34, 197, 94, 0.6)' : 
                              homeScore < awayScore ? '0 0 12px rgba(34, 197, 94, 0.6)' : 
                              '0 0 12px rgba(249, 115, 22, 0.6)'
                }}
              />
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
          
          {/* W/D/W percentages below gauge with dynamic colors */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className={`text-xs font-bold ${
                homeScore > awayScore ? 'text-green-500' : 
                homeScore < awayScore ? 'text-red-500' : 
                'text-text-primary'
              }`}>
                {homeProb}%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span className={`text-xs font-bold ${
                homeScore === awayScore ? 'text-orange-500' : 
                'text-text-primary'
              }`}>
                {drawProb}%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className={`text-xs font-bold ${
                awayScore > homeScore ? 'text-green-500' : 
                awayScore < homeScore ? 'text-red-500' : 
                'text-text-primary'
              }`}>
                {awayProb}%
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
              className="h-full bg-amber-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${possessionPercent}%` }}
            />
          </div>
        </div>

      </div>
    </Link>
  )
}