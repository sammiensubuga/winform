import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  console.log('Checking username:', username)

  if (!username || username.length < 3) {
    return NextResponse.json({ available: true })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // First, let's fetch all profiles to see what's in the table
  const { data: allProfiles, error: allError } = await supabase
    .from('profiles')
    .select('username')

  console.log('All profiles in table:', allProfiles)
  console.log('Error fetching all:', allError)

  // Now fetch specific username
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .maybeSingle()

  console.log('Specific query result:', data)
  console.log('Specific query error:', error)

  return NextResponse.json({ 
    available: !data,
    debug: { 
      allProfiles: allProfiles?.map(p => p.username),
      foundSpecific: !!data 
    }
  })
}