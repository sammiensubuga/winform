'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trophy, TrendingUp, TrendingDown, Circle, ChevronRight } from 'lucide-react'

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
    if (match.confidenceTier === 'elite') return 'text-blue-400'
    if (match.confidenceTier === 'strong') return 'text-blue-500'
    return 'text-blue-300'
  }
  
  const progressWidth = `${match.confidence}%`

  return (
    <Link href={`/matches/${match.slug}`}>
      <div className="bg-[#1E293B] border border-[#334155] hover:border-blue-500/50 rounded-xl p-4 transition-all duration-200 cursor-pointer h-full flex flex-col gap-3">

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
            <span className="text-xs text-gray-400 truncate max-w-[120px]">{match.league}</span>
          </div>
          <span className="text-xs text-gray-400">{match.kickoff}</span>
        </div>

        {/* Teams - Stack on mobile, row on desktop */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2">
          {/* Home Team */}
          <div className="flex-1 text-center w-full sm:w-auto">
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
            <p className="text-white font-semibold text-sm truncate max-w-[100px] mx-auto">{match.homeTeam}</p>
            
            {/* Home Form */}
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
            <div className="flex items-center justify-center gap-1 mt-2">
              <Circle className="w-3.5 h-3.5 text-green-500" />
              <span className="text-white text-sm font-semibold">{match.homeProbability}%</span>
            </div>
          </div>

          {/* VS */}
          <div className="text-gray-500 text-xs font-medium">VS</div>

          {/* Away Team */}
          <div className="flex-1 text-center w-full sm:w-auto">
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
            <p className="text-white font-semibold text-sm truncate max-w-[100px] mx-auto">{match.awayTeam}</p>
            
            {/* Away Form */}
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
            <div className="flex items-center justify-center gap-1 mt-2">
              <Circle className="w-3.5 h-3.5 text-red-500" />
              <span className="text-white text-sm font-semibold">{match.awayProbability}%</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#334155]" />

        {/* Confidence Section */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-400 text-xs">Confidence</span>
            <span className={`text-xs font-bold ${getConfidenceColor()}`}>{match.confidence}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className={`rounded-full h-1.5 bg-blue-500`}
              style={{ width: progressWidth }}
            />
          </div>
        </div>

        {/* Top Pick and Odds - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Top Pick</p>
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-blue-500" />
              <p className="text-white font-semibold text-sm">{match.topPick}</p>
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Odds</p>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-white font-bold text-base">{match.odds.toFixed(2)}</span>
              {oddsDropped && (
                <span className="flex items-center gap-0.5 text-green-500 text-xs">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">was {match.previousOdds.toFixed(2)}</span>
                </span>
              )}
              {oddsRaised && (
                <span className="flex items-center gap-0.5 text-red-500 text-xs">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">was {match.previousOdds.toFixed(2)}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Analysis Section */}
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Analysis</p>
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
            {match.aiPreviewShort}
          </p>
        </div>

        {/* View Full Analysis Button */}
        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between text-blue-500 text-xs font-medium hover:underline">
            <span>View full analysis</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>
    </Link>
  )
}