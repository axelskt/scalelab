'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Stats {
  totalAds: number
  totalCreators: number
  totalScraped: number
  lastScraped?: string
}

const ONBOARDING_STEPS = [
  {
    step: 1,
    label: 'Explorer les ads',
    desc: 'Analyse les meilleures pubs infopreneurs et trouve celles qui performent.',
    cta: 'Explorer les ads',
    href: '/ads',
    icon: '▷',
    done: false,
  },
  {
    step: 2,
    label: 'Scraper des concurrents',
    desc: 'Lance un scrape sur un mot-clé pour remplir ta librairie d\'ads.',
    cta: 'Lancer un scrape',
    href: '/ads?scrape=1',
    icon: '🔍',
    done: false,
  },
  {
    step: 3,
    label: 'Analyser une ad avec Claude',
    desc: 'Analyse en profondeur le hook, le pattern et les techniques d\'une pub.',
    cta: 'Analyser',
    href: '/analyzer',
    icon: '◈',
    done: false,
  },
  {
    step: 4,
    label: 'Générer ta première VSL',
    desc: 'Crée une vidéo VSL à partir d\'un script généré par l\'IA.',
    cta: 'Créer une VSL',
    href: '/vsl',
    icon: '✦',
    done: false,
  },
]

const TOOLS = [
  {
    href: '/creators',
    icon: '👤',
    label: 'Créateurs',
    count: '20K+',
    desc: 'Top annonceurs infopreneurs FR/EU classés par dépenses estimées.',
    cta: 'Voir les créateurs →',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
  },
  {
    href: '/ads',
    icon: '▷',
    label: 'Ads',
    count: '1.9M+',
    desc: 'Espionnez les créatifs winners sur Meta et TikTok.',
    cta: 'Explorer les ads →',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
  },
  {
    href: '/tunnels',
    icon: '≡',
    label: 'Tunnels',
    count: '117K+',
    desc: 'Suivez les tunnels de vente actifs et détectez les nouvelles pages.',
    cta: 'Suivre les tunnels →',
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-500/10',
  },
  {
    href: '/vsl',
    icon: '✦',
    label: 'VSL Generator',
    count: 'Exclusif',
    desc: 'Générez des scripts VSL + vidéos motion design avec l\'IA.',
    cta: 'Créer une VSL →',
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-500/10',
    highlight: true,
  },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ totalAds: 0, totalCreators: 0, totalScraped: 0 })
  const [doneSteps, setDoneSteps] = useState<number[]>([])

  useEffect(() => {
    fetch('/api/ads').then(r => r.json()).then(d => {
      setStats({
        totalAds: d.total || 0,
        totalCreators: new Set(d.ads?.map((a: any) => a.advertiser)).size || 0,
        totalScraped: d.total || 0,
        lastScraped: d.ads?.[0]?.scrapedAt,
      })
      if (d.total > 0) setDoneSteps([1])
    }).catch(() => {})
  }, [])

  const doneCount = doneSteps.length
  const progress = (doneCount / ONBOARDING_STEPS.length) * 100

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  return (
    <div className="p-8 space-y-8 max-w-5xl">
      {/* Hero banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-8">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #F5A623 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7B61FF 0%, transparent 40%)' }} />
        <div className="relative">
          <h1 className="text-3xl font-bold text-white mb-2">{greeting}, Axel 👋</h1>
          <p className="text-zinc-400 mb-6">Vos concurrents ne dorment jamais — voici leurs dernières activités.</p>
          <div className="flex gap-3">
            <Link href="/ads"
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-colors">
              Voir les ads →
            </Link>
            <Link href="/vsl"
              className="px-5 py-2.5 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/10 transition-colors">
              Générer une VSL
            </Link>
          </div>
        </div>
        {/* Live stats */}
        <div className="absolute right-8 top-8 flex gap-6">
          <Stat value={stats.totalAds} label="Ads scrapées" />
          <Stat value={stats.totalCreators} label="Créateurs" />
        </div>
      </div>

      {/* Onboarding */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">Tâches restantes</h2>
            <p className="text-sm text-zinc-500">Commencez à espionner vos concurrents en moins de 2 minutes.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500">Progression</span>
            <div className="w-32 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div className="h-2 rounded-full bg-amber-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{doneCount} / {ONBOARDING_STEPS.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {ONBOARDING_STEPS.map((step) => {
            const done = doneSteps.includes(step.step)
            return (
              <div key={step.step}
                className={`rounded-xl border p-4 space-y-3 transition-all ${done ? 'border-green-200 dark:border-green-500/20 bg-green-50 dark:bg-green-500/5' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${done ? 'text-green-600 border-green-200 bg-green-50 dark:bg-green-500/10 dark:border-green-500/30 dark:text-green-400' : 'text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400'}`}>
                    Étape {step.step}
                  </span>
                  <span className={`text-lg ${done ? 'text-green-500' : 'text-zinc-300 dark:text-zinc-700'}`}>
                    {done ? '✓' : '○'}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">{step.label}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{step.desc}</p>
                </div>
                <div className="flex gap-2 pt-1">
                  <Link href={step.href}
                    className="flex-1 text-center text-xs py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-amber-300 hover:text-amber-600 dark:hover:border-amber-500/50 dark:hover:text-amber-400 transition-colors">
                    {step.cta}
                  </Link>
                  <button className="text-xs py-1.5 px-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-amber-500 transition-colors">
                    Démo
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tools */}
      <div>
        <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-1">Explorez nos outils</h2>
        <p className="text-sm text-zinc-500 mb-4">Tout ce dont vous avez besoin en un seul endroit</p>
        <div className="grid grid-cols-4 gap-4">
          {TOOLS.map((tool) => (
            <div key={tool.href}
              className={`rounded-xl border p-5 space-y-3 transition-all hover:shadow-md cursor-pointer ${tool.highlight ? 'border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/5' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${tool.bg}`}>
                {tool.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{tool.label}</h3>
                  <span className={`text-xs font-semibold ${tool.color}`}>{tool.count}</span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">{tool.desc}</p>
              </div>
              <Link href={tool.href} className={`text-xs font-medium ${tool.color} hover:underline`}>
                {tool.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      {stats.lastScraped && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Dernière mise à jour : {new Date(stats.lastScraped).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
            <span className="ml-auto text-xs text-zinc-400">Scraper actif sur Meta + TikTok</span>
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-right">
      <div className="text-2xl font-black text-white">{value.toLocaleString('fr-FR')}</div>
      <div className="text-xs text-zinc-400">{label}</div>
    </div>
  )
}
