'use client'
import { useState, useEffect } from 'react'
import { Star, Trash2, ExternalLink, RefreshCw } from 'lucide-react'
import { ScrapedAd } from '@/lib/ads-db'

const SOURCE_BADGE: Record<string, { label: string; dot: string }> = {
  facebook: { label: 'Meta', dot: '#1877F2' },
  tiktok:   { label: 'TikTok', dot: '#69C9D0' },
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<ScrapedAd[]>([])
  const [loading, setLoading]     = useState(true)
  const [removing, setRemoving]   = useState<string | null>(null)

  const loadFavorites = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/favorites')
      const data = await res.json()
      setFavorites(data.favorites || [])
    } catch {
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadFavorites() }, [])

  const handleRemove = async (ad: ScrapedAd) => {
    setRemoving(ad.id)
    // Optimistic
    setFavorites(prev => prev.filter(f => f.id !== ad.id))
    try {
      await fetch(`/api/favorites/${ad.id}`, { method: 'DELETE' })
    } catch {
      // Rollback si erreur
      setFavorites(prev => [ad, ...prev])
    } finally {
      setRemoving(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center" style={{ background: '#FFFBF7' }}>
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={20} className="animate-spin" style={{ color: '#F97316' }} />
          <p className="text-sm" style={{ color: 'rgba(28,25,23,0.4)' }}>Chargement des favoris...</p>
        </div>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-full flex items-center justify-center" style={{ background: '#FFFBF7' }}>
        <div className="max-w-md w-full mx-auto px-8 py-16 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.12)' }}>
            <Star size={28} style={{ color: 'rgba(249,115,22,0.4)' }} />
          </div>
          <h1 className="text-xl font-black mb-3" style={{ color: '#1C1917' }}>Aucun favori</h1>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(28,25,23,0.45)' }}>
            Parcourez les ads et cliquez sur <strong>☆ Favoris</strong> pour les sauvegarder ici.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full" style={{ background: '#FFFBF7' }}>
      <div className="max-w-4xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: '#1C1917' }}>Favoris</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(28,25,23,0.4)' }}>
              {favorites.length} ad{favorites.length > 1 ? 's' : ''} sauvegardée{favorites.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={loadFavorites}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ background: 'rgba(28,25,23,0.04)', color: 'rgba(28,25,23,0.5)', border: '1px solid rgba(28,25,23,0.08)' }}
          >
            <RefreshCw size={12} /> Actualiser
          </button>
        </div>

        {/* Grid */}
        <div className="grid gap-4">
          {favorites.map(ad => {
            const src = SOURCE_BADGE[ad.source] ?? SOURCE_BADGE['facebook']
            const runDays = ad.runDays ?? 0
            return (
              <div key={ad.id}
                className="rounded-2xl p-5 flex gap-5"
                style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                {/* Thumbnail */}
                {ad.thumbnailUrl && (
                  <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-zinc-100">
                    <img
                      src={ad.thumbnailUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: src.dot }} />
                      <span className="text-xs font-semibold truncate" style={{ color: '#1C1917' }}>
                        {ad.advertiser}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded-md"
                        style={{ background: 'rgba(28,25,23,0.05)', color: 'rgba(28,25,23,0.5)' }}>
                        {src.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {runDays > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: runDays > 30 ? 'rgba(249,115,22,0.1)' : 'rgba(28,25,23,0.05)',
                            color: runDays > 30 ? '#F97316' : 'rgba(28,25,23,0.4)',
                          }}>
                          {runDays}j
                        </span>
                      )}
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316' }}>
                        {ad.score ?? 0}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm line-clamp-2 mb-3" style={{ color: 'rgba(28,25,23,0.7)', lineHeight: 1.5 }}>
                    {ad.adText || '(pas de texte)'}
                  </p>

                  <div className="flex items-center gap-3">
                    {ad.niche?.[0] && (
                      <span className="text-xs px-2 py-0.5 rounded-md"
                        style={{ background: 'rgba(123,97,255,0.08)', color: '#7B61FF' }}>
                        {ad.niche[0]}
                      </span>
                    )}
                    {ad.adUrl && (
                      <a
                        href={ad.adUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs transition-colors"
                        style={{ color: 'rgba(28,25,23,0.4)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#1C1917')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(28,25,23,0.4)')}
                      >
                        <ExternalLink size={11} /> Voir la pub
                      </a>
                    )}
                    <button
                      onClick={() => handleRemove(ad)}
                      disabled={removing === ad.id}
                      className="ml-auto flex items-center gap-1 text-xs transition-colors disabled:opacity-40"
                      style={{ color: 'rgba(28,25,23,0.3)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(28,25,23,0.3)')}
                      title="Retirer des favoris"
                    >
                      <Trash2 size={12} />
                      {removing === ad.id ? 'Suppression...' : 'Retirer'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
