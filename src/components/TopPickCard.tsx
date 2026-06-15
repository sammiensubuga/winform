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
}

export default function TopPickCard({ match }: TopPickCardProps) {
  const oddsDropped = match.odds < match.previousOdds
  const oddsRaised = match.odds > match.previousOdds
  
  const homeFormArray = match.homeForm.split('')
  const awayFormArray = match.awayForm.split('')
  
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
      <div className="bg-card border border-border hover:border-accent/50 rounded-xl p-4 transition-all duration-200 cursor-pointer h-full flex flex-col gap-3">

        {/* League and kickoff */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="relative w-4 h-4">
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
            <span className="text-xs text-text-secondary truncate max-w-[120px]">{match.league}</span>
          </div>
          <span className="text-xs text-text-secondary">{match.kickoff}</span>
        </div>

        {/* Teams - Mobile responsive */}
        <div className="flex items-center justify-between gap-2">
          {/* Home Team */}
          <div className="flex-1 text-center">
            <div className="relative w-10 h-10 mx-auto mb-1.5">
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
            <p className="text-text-primary font-semibold text-xs truncate max-w-[80px] mx-auto">{match.homeTeam}</p>
            
            {/* Home Form - smaller on mobile */}
            <div className="flex justify-center gap-0.5 mt-1.5">
              {homeFormArray.map((letter, idx) => (
                <span
                  key={idx}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${getFormColor(letter)}`}
                >
                  {letter}
                </span>
              ))}
            </div>
            
            {/* Home Win Probability */}
            <div className="flex items-center justify-center gap-0.5 mt-1.5">
              <Circle className="w-3 h-3 text-green-500" />
              <span className="text-text-primary text-xs font-semibold">{match.homeProbability}%</span>
            </div>
          </div>

          {/* VS */}
          <div className="text-text-tertiary text-xs font-medium px-1">VS</div>

          {/* Away Team */}
          <div className="flex-1 text-center">
            <div className="relative w-10 h-10 mx-auto mb-1.5">
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
            <p className="text-text-primary font-semibold text-xs truncate max-w-[80px] mx-auto">{match.awayTeam}</p>
            
            {/* Away Form - smaller on mobile */}
            <div className="flex justify-center gap-0.5 mt-1.5">
              {awayFormArray.map((letter, idx) => (
                <span
                  key={idx}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${getFormColor(letter)}`}
                >
                  {letter}
                </span>
              ))}
            </div>
            
            {/* Away Win Probability */}
            <div className="flex items-center justify-center gap-0.5 mt-1.5">
              <Circle className="w-3 h-3 text-red-500" />
              <span className="text-text-primary text-xs font-semibold">{match.awayProbability}%</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Confidence Section */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-text-secondary text-xs">Confidence</span>
            <span className={`text-xs font-bold ${getConfidenceColor()}`}>{match.confidence}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div
              className={`rounded-full h-1 ${match.confidenceTier === 'elite' ? 'bg-amber-400' : match.confidenceTier === 'strong' ? 'bg-blue-400' : 'bg-yellow-400'}`}
              style={{ width: progressWidth }}
            />
          </div>
        </div>

        {/* Top Pick and Odds - Responsive grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-text-tertiary text-xs uppercase tracking-wider mb-0.5">Top Pick</p>
            <div className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <p className="text-text-primary font-semibold text-xs">{match.topPick}</p>
            </div>
          </div>
          <div>
            <p className="text-text-tertiary text-xs uppercase tracking-wider mb-0.5">Odds</p>
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-text-primary font-bold text-sm">{match.odds.toFixed(2)}</span>
              {oddsDropped && (
                <span className="flex items-center gap-0.5 text-green-500 text-xs">
                  <TrendingDown className="w-3 h-3" />
                  <span className="hidden sm:inline">was {match.previousOdds.toFixed(2)}</span>
                </span>
              )}
              {oddsRaised && (
                <span className="flex items-center gap-0.5 text-red-500 text-xs">
                  <TrendingUp className="w-3 h-3" />
                  <span className="hidden sm:inline">was {match.previousOdds.toFixed(2)}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Analysis Section */}
        <div>
          <p className="text-text-tertiary text-xs uppercase tracking-wider mb-0.5">Analysis</p>
          <p className="text-text-secondary text-xs leading-relaxed line-clamp-2">
            {match.aiPreviewShort}
          </p>
        </div>

        {/* View Full Analysis Button */}
        <div className="mt-auto pt-1">
          <div className="flex items-center justify-between text-accent text-xs font-medium hover:underline">
            <span>View full analysis</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

      </div>
    </Link>
  )
}