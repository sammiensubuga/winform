'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AppStatusBar() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="app-status-bar fixed top-0 left-0 right-0 z-50 h-11 bg-[#111827] flex items-center justify-between px-4">
      <Link href="/" className="text-sm font-medium">
        <span className="text-white">Win</span>
        <span className="text-accent">Form</span>
      </Link>
      <span className="text-sm text-gray-300 font-mono tabular-nums">
        {time}
      </span>
    </div>
  )
}