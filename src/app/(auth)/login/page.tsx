'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Check } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#7EEA5A] via-[#4ADE80] via-25% via-[#DDF7D7] via-60% to-[#F8FAF8]">
      
      {/* Abstract wave shapes */}
      <div className="absolute bottom-0 left-0 w-96 h-96 opacity-10 pointer-events-none">
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,400 C50,350 100,380 150,320 C200,260 250,300 300,250 C350,200 380,250 400,200 L400,400 L0,400 Z" fill="#166534"/>
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-96 h-96 opacity-10 pointer-events-none">
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M400,400 C350,350 300,370 250,330 C200,290 150,320 100,280 C50,240 20,270 0,250 L0,400 L400,400 Z" fill="#166534"/>
        </svg>
      </div>

      {/* Header */}
      <div className="absolute top-10 left-10 flex items-center gap-3 z-10">
        <div className="w-10 h-10 bg-gradient-to-br from-[#2CBF2C] to-[#45D13D] rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">W</span>
        </div>
        <span className="text-2xl font-bold text-slate-900 tracking-tight">WinForm</span>
      </div>

      {/* Login Card */}
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] p-12 transition-all duration-300">
          
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-slate-900 tracking-tight mb-3">
              Sign in to your account
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 mb-8 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full h-16 bg-white border border-slate-300 rounded-2xl pl-14 pr-5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full h-16 bg-white border border-slate-300 rounded-2xl pl-14 pr-5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center gap-2 group"
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  rememberMe 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-slate-300 bg-white group-hover:border-green-400'
                }`}>
                  {rememberMe && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="text-sm text-slate-700">Remember me on this device</span>
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-gradient-to-r from-[#2CBF2C] to-[#45D13D] text-white text-2xl font-semibold rounded-2xl hover:translate-y-[-2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 shadow-md hover:shadow-lg"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Create Account Link */}
          <div className="text-center mt-8">
            <p className="text-slate-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-green-600 underline hover:text-green-700 font-medium transition-colors">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-10">
        <p className="text-slate-800 text-sm">
          WinForm © 2026{' '}
          <span className="mx-2">|</span>{' '}
          <a href="/privacy" className="text-green-700 underline hover:text-green-800 transition-colors">
            Privacy Policy
          </a>{' '}
          <span className="mx-2">|</span>{' '}
          <a href="/terms" className="text-green-700 underline hover:text-green-800 transition-colors">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  )
}