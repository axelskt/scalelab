'use client'
import { Star } from 'lucide-react'

export default function FavoritesPage() {
  return (
    <div className="min-h-full flex items-center justify-center" style={{ background: '#FFFBF7' }}>
      <div className="max-w-md w-full mx-auto px-8 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'rgba(28,25,23,0.04)', border: '1px solid rgba(28,25,23,0.08)' }}>
          <Star size={28} style={{ color: 'rgba(28,25,23,0.25)' }} />
        </div>
        <h1 className="text-xl font-black mb-3" style={{ color: '#1C1917' }}>Favoris</h1>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(28,25,23,0.45)' }}>
          Vos ads, créateurs et tunnels sauvegardés apparaîtront ici.
        </p>
        <p className="text-xs mt-4" style={{ color: 'rgba(28,25,23,0.3)' }}>
          Ajoutez des favoris en parcourant les ads ⭐
        </p>
      </div>
    </div>
  )
}
