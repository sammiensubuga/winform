'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trophy, ChevronRight } from 'lucide-react'

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
    venue?: string
    kickoff: string
    matchDate: string
    status: string
    topPick: string
    confidence: number
    confidenceTier: string
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

// Circular Progress Badge Component
const CircularProgress = ({ percentage, color }: { percentage: number; color: string }) => {
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-12 h-12 sm:w-14 sm:h-14 transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="#334155"
          strokeWidth="3"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute text-text-primary text-xs sm:text-sm font-bold">
        {percentage}%
      </span>
    </div>
  )
}

export default function TopPickCard({ match }: TopPickCardProps) {
  // Convert form string (e.g., "WWDWW") to array of letters
  const homeFormArray = match.homeForm.split('')
  const awayFormArray = match.awayForm.split('')
  
  // Get form letter colors
  const getFormColor = (letter: string) => {
    if (letter === 'W') return 'bg-green-500 text-white'
    if (letter === 'L') return 'bg-red-500 text-white'
    return 'bg-gray-500 text-white'
  }
  
  // Get confidence tier color
  const getConfidenceColor = () => {
    if (match.confidenceTier === 'elite') return 'text-amber-400'
    if (match.confidenceTier === 'strong') return 'text-blue-400'
    return 'text-yellow-400'
  }
  
  // Get progress bar color
  const getProgressColor = () => {
    if (match.confidenceTier === 'elite') return 'bg-amber-400'
    if (match.confidenceTier === 'strong') return 'bg-blue-400'
    return 'bg-yellow-400'
  }
  
  const progressWidth = `${match.confidence}%`

  return (
    <Link href={`/matches/${match.slug}`}>
      <div className="bg-card border border-border hover:border-accent/50 rounded-xl p-4 transition-all duration-200 cursor-pointer h-full flex flex-col gap-3">

{/* League, Time, and Stadium with Bookmark Icon */}
<div className="flex items-center justify-between gap-2 mb-1">
  <div className="flex items-center gap-1.5 min-w-0 flex-1">
    <div className="relative w-4 h-4 shrink-0">
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
    <span className="text-xs text-text-secondary font-medium truncate">{match.league}</span>
  </div>
  
  <div className="flex-1 text-center">
    <span className="text-xs text-text-secondary">{match.kickoff}</span>
  </div>
  
  <div className="flex-1 flex items-center justify-end gap-1.5">
    <span className="text-xs text-text-tertiary truncate">{match.venue || 'Stadium'}</span>
    {/* Bookmark Icon - Static, no functionality */}
    <svg 
      className="w-3.5 h-3.5 text-text-secondary shrink-0" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" 
      />
    </svg>
  </div>
</div>

        {/* Divider line */}
        <div className="border-t border-border" />

        {/* Teams and Form */}
        <div className="flex items-center justify-between gap-3">
          {/* Home Team */}
          <div className="flex-1 text-center">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2">
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
            <p className="text-text-primary font-semibold text-xs sm:text-sm truncate px-1">{match.homeTeam}</p>
            
            {/* Home Form */}
            <div className="flex justify-center gap-0.5 sm:gap-1 mt-2">
              {homeFormArray.map((letter, idx) => (
                <span
                  key={idx}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${getFormColor(letter)}`}
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>

          {/* VS */}
          <div className="text-text-tertiary text-[10px] sm:text-xs font-medium shrink-0">VS</div>

          {/* Away Team */}
          <div className="flex-1 text-center">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2">
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
            <p className="text-text-primary font-semibold text-xs sm:text-sm truncate px-1">{match.awayTeam}</p>
            
            {/* Away Form */}
            <div className="flex justify-center gap-0.5 sm:gap-1 mt-2">
              {awayFormArray.map((letter, idx) => (
                <span
                  key={idx}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${getFormColor(letter)}`}
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Probability Row with Headings */}
        <div className="flex items-center justify-between gap-3 mt-2">
          <div className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Win</span>
            <CircularProgress percentage={match.homeProbability} color="#22C55E" />
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Draw</span>
            <CircularProgress percentage={match.drawProbability} color="#F97316" />
          </div>
          
          <div className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Win</span>
            <CircularProgress percentage={match.awayProbability} color="#3B82F6" />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Top Pick and Odds */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 min-w-0">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-text-primary font-semibold text-sm truncate">{match.topPick}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-text-primary font-bold text-sm">{match.odds.toFixed(2)}</span>
          </div>
        </div>

        {/* Confidence Section */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-text-secondary text-xs">Confidence</span>
            <span className={`text-sm font-bold ${getConfidenceColor()}`}>{match.confidence}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className={`rounded-full h-1.5 ${getProgressColor()}`}
              style={{ width: progressWidth }}
            />
          </div>
        </div>

        {/* Analysis Section */}
        <div>
          <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">Analysis</p>
          <p className="text-text-secondary text-xs leading-relaxed line-clamp-2">
            {match.aiPreviewShort}
          </p>
        </div>

        {/* Match Date and Details Link */}
        <div className="mt-auto pt-1 flex items-center justify-between">
          <span className="text-text-tertiary text-[10px]">
            {new Date(match.matchDate).toLocaleDateString('en-GB', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
          <Link href={`/matches/${match.slug}`} className="flex items-center gap-1 text-amber-400 text-xs font-medium hover:underline">
            <span>Details</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

      </div>
    </Link>
  )
}