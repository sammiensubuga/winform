'use client'

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
    elite: 'bg-green-100 text-green-700 border border-green-200',
    strong: 'bg-blue-100 text-blue-700 border border-blue-200',
    value: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  }

  const labels = {
    elite: '⭐ Elite Pick',
    strong: '💪 Strong Pick',
    value: '🎯 Value Pick',
  }

  const sizeStyles = size === 'sm'
    ? 'text-xs px-2 py-0.5'
    : 'text-xs px-2.5 py-1'

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${styles[tier]} ${sizeStyles}`}>
      {labels[tier]} · {confidence}%
    </span>
  )
}