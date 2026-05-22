'use client'
import { Users, Search, TrendingUp, Sparkles, ArrowRight } from 'lucide-react'

export default function CreatorsPage() {
  return (
    <div className="min-h-full flex items-center justify-center" style={{ background: '#FFFBF7' }}>
      <div className="max-w-md w-full mx-auto px-8 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.15)' }}>
          <Users size={28} style={{ color: '#F97316' }} />
        </div>
        <h1 className="text-xl font-black mb-3" style={{ color: '#1C1917' }}>Créateurs — Bientôt disponible</h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(28,25,23,0.5)' }}>
          Explorez les 20 000+ annonceurs classés par volume publicitaire estimé sur Meta et TikTok.
        </p>
        <div className="space-y-2.5 mb-8 text-left">
          {[
            { icon: Search, label: 'Recherche par niche ou mot-clé' },
            { icon: TrendingUp, label: 'Classement par dépenses estimées' },
            { icon: Sparkles, label: 'Score IA de performance créateur' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
              style={{ background: 'rgba(28,25,23,0.03)', border: '1px solid rgba(28,25,23,0.07)' }}>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(249,115,22,0.1)' }}>
                <Icon size={12} style={{ color: '#F97316' }} />
              </div>
              <span className="text-xs font-medium" style={{ color: '#1C1917' }}>{label}</span>
            </div>
          ))}
        </div>
        <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white"
          style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', boxShadow: '0 4px 14px rgba(249,115,22,0.3)' }}>
          <Sparkles size={15} /> Mettre à niveau <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
