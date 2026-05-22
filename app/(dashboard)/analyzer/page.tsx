'use client'
import { Sparkles, TrendingUp, BarChart3, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const FEATURES = [
  { icon: TrendingUp, label: 'Comparaison multi-créateurs' },
  { icon: BarChart3, label: 'Analyse de tendances & chronologie' },
  { icon: Clock, label: 'Historique des performances' },
  { icon: Sparkles, label: 'Recommandations IA personnalisées' },
]

export default function AnalyzerPage() {
  return (
    <div className="min-h-full flex items-center justify-center" style={{ background: '#FFFBF7' }}>
      <div className="max-w-md w-full mx-auto px-8 py-16 text-center">

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.15)' }}>
          <BarChart3 size={28} style={{ color: '#F97316' }} />
        </div>

        {/* Title */}
        <h1 className="text-xl font-black mb-3" style={{ color: '#1C1917' }}>
          L'Analyseur est une fonctionnalité payante
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(28,25,23,0.5)' }}>
          Comparez créateurs et tunnels sur une chronologie commune, détectez les tendances et mesurez les performances — disponible à partir du plan Pro.
        </p>

        {/* Features */}
        <div className="space-y-2.5 mb-8 text-left">
          {FEATURES.map(({ icon: Icon, label }) => (
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

        {/* CTA */}
        <button
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', boxShadow: '0 4px 14px rgba(249,115,22,0.3)' }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(249,115,22,0.45)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(249,115,22,0.3)'}
        >
          <Sparkles size={15} />
          Mettre à niveau pour utiliser l'Analyseur
          <ArrowRight size={14} />
        </button>

        <p className="mt-4 text-xs" style={{ color: 'rgba(28,25,23,0.35)' }}>
          Sans engagement · Annulable à tout moment
        </p>
      </div>
    </div>
  )
}
