'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Search, Sparkles, Link2, TrendingUp, ArrowRight, Check } from 'lucide-react'

const STEPS = [
  {
    id: 'spy',
    emoji: '🕵️',
    title: 'Spy les pubs qui cartonnent',
    desc: 'Trouve les publicités Facebook et TikTok des meilleurs infopreneurs FR. Filtre par niche, durée d\'activité et score.',
    action: 'Voir les pubs winners',
    href: '/ads',
    icon: Search,
    color: '#F97316',
  },
  {
    id: 'tunnel',
    emoji: '🔗',
    title: 'Analyse n\'importe quel tunnel',
    desc: 'Colle l\'URL d\'une page de vente — l\'IA détecte l\'offre, le prix, la structure copywriting et génère un brief systeme.io.',
    action: 'Importer un tunnel',
    href: '/tunnels/import',
    icon: Link2,
    color: '#7C3AED',
  },
  {
    id: 'vsl',
    emoji: '🎬',
    title: 'Génère ta VSL en 30 secondes',
    desc: 'Décris ton produit et ton audience — l\'IA génère un script vidéo de vente complet, prêt à enregistrer.',
    action: 'Créer ma première VSL',
    href: '/vsl',
    icon: Sparkles,
    color: '#0EA5E9',
  },
]

export default function OnboardingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [completing, setCompleting] = useState(false)
  const [done, setDone] = useState<string[]>([])

  const firstName = session?.user?.name?.split(' ')[0] || 'toi'

  async function finish() {
    setCompleting(true)
    try {
      await fetch('/api/onboarding/complete', { method: 'POST' })
    } catch {}
    router.push('/ads')
  }

  return (
    <div className="min-h-full flex items-center justify-center" style={{ background: '#FFFBF7' }}>
      <div className="w-full max-w-xl px-6 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg,#F97316,#FB923C)', boxShadow: '0 8px 24px rgba(249,115,22,0.3)' }}>
            <TrendingUp size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-2" style={{ color: '#1C1917' }}>
            Bienvenue, {firstName} 👋
          </h1>
          <p className="text-sm" style={{ color: 'rgba(28,25,23,0.5)' }}>
            Voici ce que tu peux faire avec TrackAds — ça prend 2 minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-8">
          {STEPS.map((step) => {
            const isDone = done.includes(step.id)
            return (
              <div key={step.id}
                className="p-5 rounded-2xl transition-all"
                style={{ background: 'white', border: `1px solid ${isDone ? 'rgba(34,197,94,0.2)' : 'rgba(28,25,23,0.08)'}` }}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                    style={{ background: `${step.color}12`, border: `1px solid ${step.color}20` }}>
                    {isDone ? <Check size={18} style={{ color: '#16A34A' }} /> : step.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black mb-1" style={{ color: '#1C1917' }}>{step.title}</p>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(28,25,23,0.5)' }}>{step.desc}</p>
                    <button
                      onClick={() => {
                        setDone(prev => [...prev, step.id])
                        window.open(step.href, '_blank')
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold transition-all"
                      style={{ color: isDone ? '#16A34A' : step.color }}>
                      {isDone ? 'Fait ✓' : <>{step.action} <ArrowRight size={11} /></>}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <button
          onClick={finish}
          disabled={completing}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all"
          style={{ background: completing ? 'rgba(249,115,22,0.5)' : 'linear-gradient(135deg,#F97316,#FB923C)', boxShadow: completing ? 'none' : '0 4px 20px rgba(249,115,22,0.3)' }}>
          {completing ? 'Chargement...' : <><Sparkles size={15} /> Accéder au dashboard</>}
        </button>

        <p className="text-center text-xs mt-4" style={{ color: 'rgba(28,25,23,0.3)' }}>
          Tu peux revenir sur cette page depuis les paramètres
        </p>

      </div>
    </div>
  )
}
