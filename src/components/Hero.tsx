'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Hero() {
  const [mounted, setMounted] = useState(false)

 useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setMounted(true)
}, [])

  return (
    <section className="relative w-full h-screen min-h-[600px] max-h-[900px] flex items-end overflow-hidden">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-stadium.jpg')" }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(10, 15, 30, 0.25) 0%,
            rgba(10, 15, 30, 0.05) 25%,
            rgba(10, 15, 30, 0.55) 60%,
            rgba(10, 15, 30, 0.92) 85%,
            rgba(10, 15, 30, 1.0) 100%
          )`
        }}
      />

      {/* Content — positioned in lower third */}
      <div className={`relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

        <div className="max-w-2xl">

          {/* Tagline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
            Data First.
            <br />
            <span className="text-accent">Then Bet.</span>
          </h1>

          {/* Subtext */}
          <p className="mt-4 text-lg sm:text-xl text-white/70 font-normal max-w-lg">
            Smarter bets start with better data.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <a
              href="#top-picks"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-accent/25"
            >
              View Today&apos;s Picks
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 border border-white/25 hover:border-white/50 text-white font-medium px-7 py-3.5 rounded-xl transition-all duration-200 text-sm backdrop-blur-sm"
            >
              Get Started Free
            </Link>
          </div>

          {/* Trust line */}
          <p className="mt-4 text-white/40 text-sm">
            $0 forever · No credit card needed
          </p>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
        <svg
          className="w-5 h-5 text-white/30 animate-bounce-slow"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

    </section>
  )
}