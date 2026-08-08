'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-background to-background -z-10" />
      
      <div className="space-y-6 max-w-3xl relative z-10">
        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          AI-Powered Predictions
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
          WinForm
          <span className="text-primary block sm:inline"> AI Football Predictions</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Leverage Llama 3 AI to predict match outcomes with confidence. 
          Smart insights for smarter football decisions.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/matches">
            <Button size="lg">Get Started →</Button>
          </Link>
          <Link href="/top-picks">
            <Button size="lg" variant="outline">View Predictions</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}