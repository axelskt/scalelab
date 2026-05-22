'use client'
import { Leaf, TrendingUp, Users, BarChart2 } from 'lucide-react'

export default function OrganicPage() {
  return (
    <div className="min-h-full flex items-center justify-center" style={{ background: '#FFFBF7' }}>
      <div className="max-w-md w-full mx-auto px-8 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'rgba(28,25,23,0.05)', border: '1px solid rgba(28,25,23,0.1)' }}>
          <Leaf size={28} style={{ color: 'rgba(28,25,23,0.4)' }} />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4"
          style={{ background: 'rgba(28,25,23,0.06)', border: '1px solid rgba(28,25,23,0.08)' }}>
          <span className="text-xs font-bold" style={{ color: 'rgba(28,25,23,0.4)' }}>BIENTÔT</span>
        </div>
        <h1 className="text-xl font-black mb-3" style={{ color: '#1C1917' }}>Organique</h1>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(28,25,23,0.5)' }}>
          Suivez la croissance organique de vos concurrents — abonnés, engagement et portée sur tous les réseaux.
        </p>
        <div className="flex justify-center gap-6 mt-8">
          {[
            { icon: TrendingUp, label: 'Croissance' },
            { icon: Users, label: 'Abonnés' },
            { icon: BarChart2, label: 'Engagement' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(28,25,23,0.04)', border: '1px solid rgba(28,25,23,0.07)' }}>
                <Icon size={16} style={{ color: 'rgba(28,25,23,0.3)' }} />
              </div>
              <span className="text-xs" style={{ color: 'rgba(28,25,23,0.35)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
