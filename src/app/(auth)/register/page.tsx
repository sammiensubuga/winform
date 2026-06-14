'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, Check, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Field-specific errors
  const [usernameError, setUsernameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [termsError, setTermsError] = useState('')
  
  const router = useRouter()
  const supabase = createClient()

  const validateUsername = (value: string) => {
    const usernameRegex = /^[a-z][a-z0-9_]{2,19}$/
    return usernameRegex.test(value)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Clear all errors
    setUsernameError('')
    setEmailError('')
    setPasswordError('')
    setConfirmPasswordError('')
    setTermsError('')

    // Validate username format
    if (!validateUsername(username)) {
      setUsernameError('Username must start with a letter, 3-20 characters (lowercase letters, numbers, _)')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match')
      setLoading(false)
      return
    }

    if (!agreeTerms) {
      setTermsError('You must agree to the Terms and Privacy Policy')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.toLowerCase(),
        },
      },
    })

    if (error) {
     console.log('Full error:', error.message) // Debug
if (error.message.includes('duplicate key') || error.message.includes('profiles_username_key')) {
  setUsernameError('Username already taken. Please choose another one.')
} else {
  setUsernameError('Username already taken. Please choose another one.') // Fallback
}
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-l from-[#E8F5E9] via-[#F1F8F2] via-50% to-[#F8FAF8]">
      
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

      {/* Header with Logo */}
      <div className="absolute top-10 left-10 flex items-center gap-3 z-10">
        <Image src="/logo.png" alt="WinForm Logo" width={40} height={40} className="rounded-xl" />
        <span className="text-2xl font-bold text-slate-900 tracking-tight">WinForm</span>
      </div>

      {/* Register Card */}
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md p-3 transition-all duration-300">
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
              Create account
            </h1>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value.toLowerCase())}
                  required
                  className={`w-full h-12 bg-white border rounded-xl pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm ${
                    usernameError ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="sammie"
                />
              </div>
              {usernameError && (
                <p className="text-xs text-red-500 mt-1">{usernameError}</p>
              )}
              <p className="text-xs text-slate-400 mt-1">Lowercase letters, numbers, underscores. 3-20 characters.</p>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className={`w-full h-12 bg-white border rounded-xl pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm ${
                    emailError ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {emailError && (
                <p className="text-xs text-red-500 mt-1">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className={`w-full h-12 bg-white border rounded-xl pl-11 pr-12 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm ${
                    passwordError ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="minimum 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-xs text-red-500 mt-1">{passwordError}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className={`w-full h-12 bg-white border rounded-xl pl-11 pr-12 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm ${
                    confirmPasswordError ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPasswordError && (
                <p className="text-xs text-red-500 mt-1">{confirmPasswordError}</p>
              )}
            </div>

            {/* Terms Agreement */}
            <div>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className="flex items-center gap-2 group"
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                    agreeTerms 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-slate-300 bg-white group-hover:border-green-400'
                  }`}>
                    {agreeTerms && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-xs text-slate-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-green-600 hover:text-green-700 transition-colors">
                      Terms
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-green-600 hover:text-green-700 transition-colors">
                      Privacy Policy
                    </Link>
                  </span>
                </button>
              </div>
              {termsError && (
                <p className="text-xs text-red-500 mt-1">{termsError}</p>
              )}
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-semibold rounded-xl hover:translate-y-[-2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 shadow-md hover:shadow-lg"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-slate-600">
              Already have an account?
            </p>
            <Link href="/login" className="text-green-600 hover:text-green-700 font-medium transition-colors block mt-1">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-10">
        <p className="text-slate-500 text-xs">
          © WinForm{' '}
          <Link href="/privacy" className="text-slate-500 hover:text-green-600 transition-colors">
            Privacy Policy
          </Link>{' '}
          <span className="mx-1">|</span>{' '}
          <Link href="/terms" className="text-slate-500 hover:text-green-600 transition-colors">
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  )
}