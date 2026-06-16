'use client'

import { Star, Zap, Target } from 'lucide-react'

interface ConfidenceBadgeProps {
  tier: 'elite' | 'strong' | 'value'
  confidence: number
  size?: 'sm' | 'md'
}

export default function ConfidenceBadge({
  tier,
  confidence,
  size = 'md',
}: ConfidenceBadgeProps) {
  const styles = {
    elite: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    strong: 'bg-green-500/10 text-green-500 border border-green-500/20',
    value: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
  }

  const icons = {
    elite: <Star className="w-3 h-3" />,
    strong: <Zap className="w-3 h-3" />,
    value: <Target className="w-3 h-3" />,
  }

  const labels = {
    elite: 'Elite Pick',
    strong: 'Strong Pick',
    value: 'Value Pick',
  }

  const sizeStyles = size === 'sm'
    ? 'text-[10px] px-2 py-0.5 gap-1'
    : 'text-xs px-2.5 py-1 gap-1.5'

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${styles[tier]} ${sizeStyles}`}>
      {icons[tier]}
      {labels[tier]} · {confidence}%
    </span>
  )
}