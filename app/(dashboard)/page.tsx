'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Stats {
  totalAds: number
  totalCreators: number
  totalScraped: number
  lastScraped?: string
}

const TOOLS = [
  {
    href: '/ads',
    label: 'Ads',
    count: '1.9M+',
    desc: 'Explorez les créatifs les plus performants sur Meta et TikTok.',
    cta: 'Explorer',
  },
  {
    href: '/creators',
    label: 'Créateurs',
    count: '20K+',
    desc: 'Les annonceurs classés par volume publicitaire estimé.',
    cta: 'Voir',
  },
  {
    href: '/tunnels',
    label: 'Tunnels',
    count: '117K+',
    desc: 'Suivez les pages de vente actives et leurs évolutions.',
    cta: 'Suivre',
  },
  {
    href: '/vsl',
    label: 'VSL Generator',
    count: 'Exclusif',
    desc: 'Générez des scripts et vidéos motion design avec l\'IA.',
    cta: 'Créer',
    highlight: true,
  },
]

const QUICK_ACTIONS = [
  { href: '/ads', label: 'Parcourir les ads' },
  { href: '/ads?scrape=1', label: 'Lancer un scrape' },
  { href: '/analyzer', label: 'Analyser une publicité' },
  { href: '/vsl', label: 'Générer une VSL' },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ totalAds: 0, totalCreators: 0, totalScraped: 0 })

  useEffect(() => {
    fetch('/api/ads').then(r => r.json()).then(d => {
      setStats({
        totalAds: d.total || 0,
        totalCreators: new Set(d.ads?.map((a: any) => a.advertiser)).size || 0,
        totalScraped: d.total || 0,
        lastScraped: d.ads?.[0]?.scrapedAt,
      })
    }).catch(() => {})
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  return (
    <div className="min-h-full" style={{ background: '#FFFBF7' }}>
      <div className="max-w-5xl mx-auto px-8 py-10 space-y-12">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: '#1C1917' }}>{greeting}, Axel.</h1>
            <p className="mt-1 text-sm" style={{ color: 'rgba(28,25,23,0.4)' }}>
              {stats.lastScraped
                ? `Dernière mise à jour le ${new Date(stats.lastScraped).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`
                : 'Bienvenue sur TrackAds'}
            </p>
          </div>
          <Link href="/ads?scrape=1"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316', border: '1px solid rgba(249,115,22,0.2)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.18)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.1)' }}
          >
            <span className="text-xs leading-none">+</span>
            Nouveau scrape
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            value={stats.totalAds > 0 ? stats.totalAds.toLocaleString('fr-FR') : '—'}
            label="Ads indexées"
            live={stats.totalAds > 0}
          />
          <StatCard
            value={stats.totalCreators > 0 ? stats.totalCreators.toLocaleString('fr-FR') : '—'}
            label="Créateurs actifs"
          />
          <StatCard
            value="117K+"
            label="Tunnels suivis"
          />
        </div>

        {/* Quick actions */}
        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: 'rgba(28,25,23,0.3)', letterSpacing: '0.12em' }}>
            Actions rapides
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map(action => (
              <Link key={action.href} href={action.href}
                className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: 'rgba(28,25,23,0.04)',
                  color: 'rgba(28,25,23,0.55)',
                  border: '1px solid rgba(28,25,23,0.08)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(28,25,23,0.08)'
                  e.currentTarget.style.color = '#1C1917'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(28,25,23,0.04)'
                  e.currentTarget.style.color = 'rgba(28,25,23,0.55)'
                }}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: 'rgba(28,25,23,0.3)', letterSpacing: '0.12em' }}>
            Modules
          </p>
          <div className="grid grid-cols-2 gap-4">
            {TOOLS.map(tool => (
              <Link key={tool.href} href={tool.href}
                className="group flex items-start justify-between p-5 rounded-xl transition-all"
                style={{
                  background: tool.highlight ? 'rgba(249,115,22,0.06)' : 'rgba(28,25,23,0.03)',
                  border: tool.highlight ? '1px solid rgba(249,115,22,0.2)' : '1px solid rgba(28,25,23,0.08)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = tool.highlight ? 'rgba(249,115,22,0.1)' : 'rgba(28,25,23,0.06)'
                  e.currentTarget.style.borderColor = tool.highlight ? 'rgba(249,115,22,0.35)' : 'rgba(28,25,23,0.15)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = tool.highlight ? 'rgba(249,115,22,0.06)' : 'rgba(28,25,23,0.03)'
                  e.currentTarget.style.borderColor = tool.highlight ? 'rgba(249,115,22,0.2)' : 'rgba(28,25,23,0.08)'
                }}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-sm font-black" style={{ color: '#1C1917' }}>{tool.label}</span>
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                      style={tool.highlight
                        ? { background: 'rgba(249,115,22,0.12)', color: '#F97316' }
                        : { background: 'rgba(28,25,23,0.06)', color: 'rgba(28,25,23,0.4)' }
                      }>
                      {tool.count}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(28,25,23,0.45)' }}>
                    {tool.desc}
                  </p>
                </div>
                <span className="text-xs font-medium flex-shrink-0 mt-0.5 transition-colors"
                  style={{ color: tool.highlight ? '#F97316' : 'rgba(28,25,23,0.3)' }}>
                  {tool.cta} →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-3 py-4"
          style={{ borderTop: '1px solid rgba(28,25,23,0.08)' }}>
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: '#22C55E', boxShadow: '0 0 6px rgba(34,197,94,0.5)' }} />
          <span className="text-xs" style={{ color: 'rgba(28,25,23,0.35)' }}>
            Indexation active — Meta + TikTok
          </span>
          {stats.lastScraped && (
            <span className="ml-auto text-xs" style={{ color: 'rgba(28,25,23,0.25)' }}>
              {new Date(stats.lastScraped).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
              })}
            </span>
          )}
        </div>

      </div>
    </div>
  )
}

function StatCard({ value, label, live }: { value: string; label: string; live?: boolean }) {
  return (
    <div className="p-5 rounded-xl"
      style={{ background: 'rgba(28,25,23,0.03)', border: '1px solid rgba(28,25,23,0.08)' }}>
      <div className="flex items-start justify-between mb-1">
        <span className="text-2xl font-black" style={{ color: '#1C1917' }}>{value}</span>
        {live && (
          <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
            style={{ background: '#22C55E', boxShadow: '0 0 6px rgba(34,197,94,0.5)' }} />
        )}
      </div>
      <p className="text-xs" style={{ color: 'rgba(28,25,23,0.4)' }}>{label}</p>
    </div>
  )
}
