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

  useEffect(() => {
    fetchWatchlist()
  }, [])

  const fetchWatchlist = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

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

  if (loading) {
    return <div className="text-center text-text-primary">Loading your watchlist...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-6">My Watchlist</h1>
      
      {watchlist.length === 0 ? (
        <div className="bg-card rounded-lg p-8 text-center">
          <p className="text-text-secondary">Your watchlist is empty.</p>
          <p className="text-text-secondary mt-2">Browse matches and add them to track AI predictions.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {watchlist.map((item) => (
            <div key={item.id} className="bg-card rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="text-text-primary font-semibold">{item.match_title}</h3>
                <p className="text-text-secondary text-sm">
                  {new Date(item.match_date).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => removeFromWatchlist(item.id)}
                className="bg-danger text-white px-3 py-1 rounded hover:bg-danger/80 transition"
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