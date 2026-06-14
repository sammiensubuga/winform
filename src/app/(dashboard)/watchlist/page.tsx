'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface WatchlistItem {
  id: string
  match_id: string
  match_title: string
  match_date: string
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchWatchlist = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('watchlists')
      .select('*')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false })

    if (error) {
      console.error('Error fetching watchlist:', error)
    } else {
      setWatchlist(data || [])
    }
    setLoading(false)
  }

  const removeFromWatchlist = async (id: string) => {
    const { error } = await supabase
      .from('watchlists')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error removing:', error)
    } else {
      setWatchlist(watchlist.filter(item => item.id !== id))
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWatchlist()
  }, [])

  if (loading) {
    return <div className="text-center text-slate-900">Loading your watchlist...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">My Watchlist</h1>
      
      {watchlist.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center border border-slate-200">
          <p className="text-slate-500">Your watchlist is empty.</p>
          <p className="text-slate-500 mt-2">Browse matches and add them to track AI predictions.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {watchlist.map((item) => (
            <div key={item.id} className="bg-white rounded-lg p-4 flex justify-between items-center border border-slate-200">
              <div>
                <h3 className="text-slate-900 font-semibold">{item.match_title}</h3>
                <p className="text-slate-500 text-sm">
                  {new Date(item.match_date).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => removeFromWatchlist(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}