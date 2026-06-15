'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trophy, TrendingUp, TrendingDown, Circle, ChevronRight, Percent } from 'lucide-react'

interface TopPickCardProps {
  match: {
    id: number
    slug: string
    homeTeam: string
    awayTeam: string
    homeTeamLogo: string
    awayTeamLogo: string
    league: string
    competitionLogo?: string
    kickoff: string
    status: string
    topPick: string
    confidence: number
    confidenceTier: 'elite' | 'strong' | 'value'
    odds: number
    previousOdds: number
    homeProbability?: number
    drawProbability?: number
    awayProbability?: number
    homeForm: string
    awayForm: string
    aiPreviewShort: string
  }
}

export default function TopPickCard({ match }: TopPickCardProps) {
  const oddsDropped = match.odds < match.previousOdds
  const oddsRaised = match.odds > match.previousOdds
  
  // Safe form handling
  const homeFormArray = match.homeForm?.split('') || ['W', 'W', 'W', 'W', 'W']
  const awayFormArray = match.awayForm?.split('') || ['D', 'W', 'L', 'W', 'W']
  
  // Safe probability values
  const homeProb = match.homeProbability ?? 0
  const awayProb = match.awayProbability ?? 0
  
  const getFormColor = (letter: string) => {
    if (letter === 'W') return 'bg-green-500 text-white'
    if (letter === 'L') return 'bg-red-500 text-white'
    return 'bg-gray-500 text-white'
  }
  
  const getConfidenceColor = () => {
    if (match.confidenceTier === 'elite') return 'text-amber-400'
    if (match.confidenceTier === 'strong') return 'text-blue-400'
    return 'text-yellow-400'
  }
  
  const progressWidth = `${match.confidence}%`

  return (
    <Link href={`/matches/${match.slug}`}>
      <div className="bg-card border border-border hover:border-accent/50 rounded-xl p-5 transition-all duration-200 cursor-pointer h-full flex flex-col gap-4">

        {/* League and kickoff */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {match.competitionLogo && (
              <div className="relative w-5 h-5">
                <Image
                  src={match.competitionLogo}
                  alt={match.league}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
            <span className="text-xs text-text-secondary">{match.league}</span>
          </div>
          <span className="text-xs text-text-secondary">{match.kickoff}</span>
        </div>

        {/* Teams and Form */}
        <div className="flex items-center justify-between gap-4">
          {/* Home Team */}
          <div className="flex-1 text-center">
            <div className="relative w-12 h-12 mx-auto mb-2">
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
            <p className="text-text-primary font-semibold text-sm">{match.homeTeam}</p>
            
            {/* Home Form (W/L/D) */}
            <div className="flex justify-center gap-1 mt-2">
              {homeFormArray.map((letter, idx) => (
                <span
                  key={idx}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getFormColor(letter)}`}
                >
                  {letter}
                </span>
              ))}
            </div>
            
            {/* Home Win Probability */}
            <div className="flex items-center justify-center gap-1 mt-3">
              <Circle className="w-4 h-4 text-green-500" />
              <span className="text-text-primary text-sm font-semibold">{homeProb}%</span>
              <Percent className="w-3 h-3 text-text-tertiary" />
            </div>
          </div>

          {/* VS */}
          <div className="text-text-tertiary text-xs font-medium">VS</div>

          {/* Away Team */}
          <div className="flex-1 text-center">
            <div className="relative w-12 h-12 mx-auto mb-2">
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
            <p className="text-text-primary font-semibold text-sm">{match.awayTeam}</p>
            
            {/* Away Form (W/L/D) */}
            <div className="flex justify-center gap-1 mt-2">
              {awayFormArray.map((letter, idx) => (
                <span
                  key={idx}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getFormColor(letter)}`}
                >
                  {letter}
                </span>
              ))}
            </div>
            
            {/* Away Win Probability */}
            <div className="flex items-center justify-center gap-1 mt-3">
              <Circle className="w-4 h-4 text-red-500" />
              <span className="text-text-primary text-sm font-semibold">{awayProb}%</span>
              <Percent className="w-3 h-3 text-text-tertiary" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Confidence Section */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-text-secondary text-xs">Confidence</span>
            <span className={`text-sm font-bold ${getConfidenceColor()}`}>{match.confidence}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className={`rounded-full h-1.5 ${match.confidenceTier === 'elite' ? 'bg-amber-400' : match.confidenceTier === 'strong' ? 'bg-blue-400' : 'bg-yellow-400'}`}
              style={{ width: progressWidth }}
            />
          </div>
        </div>

        {/* Top Pick and Odds - Side by Side */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">Top Pick</p>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-amber-400" />
              <p className="text-text-primary font-semibold text-sm">{match.topPick}</p>
            </div>
          </div>
          <div>
            <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">Odds</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-text-primary font-bold text-sm">{match.odds?.toFixed(2) ?? '0.00'}</span>
              {oddsDropped && match.previousOdds && (
                <span className="flex items-center gap-0.5 text-green-500 text-xs">
                  <TrendingDown className="w-3 h-3" />
                  was {match.previousOdds.toFixed(2)}
                </span>
              )}
              {oddsRaised && match.previousOdds && (
                <span className="flex items-center gap-0.5 text-red-500 text-xs">
                  <TrendingUp className="w-3 h-3" />
                  was {match.previousOdds.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Analysis Section with Heading */}
        <div>
          <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">Analysis</p>
          <p className="text-text-secondary text-xs leading-relaxed line-clamp-2">
            {match.aiPreviewShort || 'No analysis available.'}
          </p>
        </div>

        {/* View Full Analysis Button */}
        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between text-accent text-xs font-medium hover:underline">
            <span>View full analysis</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

      </div>
    </Link>
  )
}