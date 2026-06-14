'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setEmailSent(false)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?redirect_to=/update-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setEmailSent(true)
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-l from-[#E8F5E9] via-[#F1F8F2] via-50% to-[#F8FAF8]">
        <div className="absolute top-10 left-10 flex items-center gap-3 z-10">
          <Image src="/logo.png" alt="WinForm Logo" width={40} height={40} className="rounded-xl" />
          <span className="text-2xl font-bold text-slate-900 tracking-tight">WinForm</span>
        </div>

        <div className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="w-full max-w-md p-3 transition-all duration-300">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
              <p className="text-slate-600 mb-4">
                We sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-slate-500 text-sm mb-6">
                Click the link in the email to reset your password. The link expires in 1 hour.
              </p>
              <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-l from-[#E8F5E9] via-[#F1F8F2] via-50% to-[#F8FAF8]">
      <div className="absolute top-10 left-10 flex items-center gap-3 z-10">
        <Image src="/logo.png" alt="WinForm Logo" width={40} height={40} className="rounded-xl" />
        <span className="text-2xl font-bold text-slate-900 tracking-tight">WinForm</span>
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md p-3">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
              Reset password
            </h1>
            <p className="text-slate-600 text-sm">
          <p className="text-slate-600 text-sm">Enter your email address and we&apos;ll send you a link to reset your password.</p>
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-slate-200">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 bg-white border border-slate-300 rounded-xl pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-semibold rounded-xl hover:translate-y-[-2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link href="/login" className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center justify-center gap-1">
                <ArrowLeft className="w-3 h-3" />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 text-center">
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