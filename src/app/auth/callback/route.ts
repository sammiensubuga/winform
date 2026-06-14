import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // Get the redirect_to parameter
  const redirectTo = requestUrl.searchParams.get('redirect_to') ?? '/'
  
  console.log('Callback received - redirect_to:', redirectTo)
  console.log('Callback received - code:', code ? 'yes' : 'no')

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('Exchange code error:', error)
  }

  // Redirect to the update-password page
  if (redirectTo === '/update-password') {
    console.log('Redirecting to /update-password')
    return NextResponse.redirect(new URL('/update-password', requestUrl.origin))
  }

  // Default redirect
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}