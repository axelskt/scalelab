'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, RefreshCw, Star, Eye, Lock, TrendingUp, Minus, ChevronDown, ChevronRight, Copy, X, ExternalLink, Link2 } from 'lucide-react'

const SORTS = ['Le plus d\'ads', 'Plus longtemps', 'En scale', 'Plus récents', 'Plus anciens']

const TUNNELS = [
  {
    id: 1,
    domain: 'go.accelerateur.ai',
    creator: 'Quentin et Edouard',
    url: 'go.accelerateur.ai/adc/inscription',
    niche: 'Business & Entrepr.',
    subNiche: 'Coaching business',
    scaling: 'scale',
    scalingLabel: 'Evergreen',
    adsActive: 74,
    adsTotal: 2983,
    activeSince: '2mo',
    activeDate: '22 fév. 2026',
    joursActifs: 48,
    builder: 'systeme.io',
    keywords: ['Coaching', 'Formation'],
    firstSeen: 'Fév 22, 2026',
    initials: 'QE',
    color: '#7C3AED',
    blurred: false,
  },
  {
    id: 2,
    domain: 'go.papainshape.com',
    creator: 'Papa In Shape',
    url: 'go.papainshape.com/challenge-gratuit',
    niche: 'Santé & Bien-être',
    subNiche: 'Perte de poids',
    scaling: 'stable',
    scalingLabel: 'Stable',
    adsActive: 54,
    adsTotal: 1593,
    activeSince: '2mo',
    activeDate: '23 fév. 2026',
    joursActifs: 47,
    builder: 'systeme.io',
    keywords: ['Perte de poids', 'Challenge'],
    firstSeen: 'Fév 23, 2026',
    initials: 'PP',
    color: '#22C55E',
    blurred: false,
  },
  {
    id: 3,
    domain: 'go.highticket.io',
    creator: 'Brook Hiddink',
    url: 'go.highticket.io/w/main/vip/sign-up-vip',
    niche: 'Business & Entrepr.',
    subNiche: 'Make money',
    scaling: 'stable',
    scalingLabel: 'Evergreen',
    adsActive: 206,
    adsTotal: 1471,
    activeSince: '2mo',
    activeDate: '18 mars 2026',
    joursActifs: 65,
    builder: 'clickfunnels',
    keywords: ['Make money', 'E-commerce / Dropshipping'],
    firstSeen: 'Aug 26, 2025',
    initials: 'BH',
    color: '#F97316',
    blurred: false,
  },
  {
    id: 4,
    domain: 'formation.nathaliemarchand.fr',
    creator: 'Nathalie Marchand',
    url: 'formation.nathaliemarchand.fr/offre-vip',
    niche: 'Santé & Bien-être',
    subNiche: 'Nutrition',
    scaling: 'scale',
    scalingLabel: 'Tendance',
    adsActive: 31,
    adsTotal: 890,
    activeSince: '3mo',
    activeDate: '14 jan. 2026',
    joursActifs: 89,
    builder: 'systeme.io',
    keywords: ['Nutrition', 'Santé'],
    firstSeen: 'Jan 14, 2026',
    initials: 'NM',
    color: '#EC4899',
    blurred: true,
  },
  {
    id: 5,
    domain: 'programme.alexmartin.co',
    creator: 'Alex Martin',
    url: 'programme.alexmartin.co/masterclass',
    niche: 'Business & Entrepr.',
    subNiche: 'Mindset',
    scaling: 'stable',
    scalingLabel: 'Stable',
    adsActive: 18,
    adsTotal: 445,
    activeSince: '1mo',
    activeDate: '3 avr. 2026',
    joursActifs: 22,
    builder: 'learnybox',
    keywords: ['Mindset', 'Développement personnel'],
    firstSeen: 'Avr 3, 2026',
    initials: 'AM',
    color: '#0EA5E9',
    blurred: true,
  },
]

type Tunnel = typeof TUNNELS[0]

function ScalingBadge({ status }: { status: string }) {
  if (status === 'scale') return (
    <div className="flex items-center gap-1.5">
      <TrendingUp size={12} style={{ color: '#F97316' }} />
      <span className="text-xs font-semibold" style={{ color: '#F97316' }}>En scale</span>
    </div>
  )
  return (
    <div className="flex items-center gap-1.5">
      <Minus size={12} style={{ color: 'rgba(28,25,23,0.4)' }} />
      <span className="text-xs" style={{ color: 'rgba(28,25,23,0.45)' }}>Stable</span>
    </div>
  )
}

function BuilderBadge({ builder }: { builder: string }) {
  const colors: Record<string, string> = { 'systeme.io': '#F97316', 'clickfunnels': '#1C6EF2', 'learnybox': '#7C3AED' }
  if (!colors[builder]) return <span style={{ color: 'rgba(28,25,23,0.25)' }}>—</span>
  const color = colors[builder]
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
      {builder}
    </span>
  )
}

function SpyDrawer({ tunnel, onClose }: { tunnel: Tunnel; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  function copyUrl() {
    navigator.clipboard.writeText(`https://${tunnel.url}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.2)' }} onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 overflow-y-auto"
        style={{ width: 380, background: '#FFFBF7', borderLeft: '1px solid rgba(28,25,23,0.1)', boxShadow: '-8px 0 32px rgba(0,0,0,0.08)' }}>

        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg transition-all z-10"
          style={{ color: 'rgba(28,25,23,0.4)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(28,25,23,0.06)'; e.currentTarget.style.color = '#1C1917' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(28,25,23,0.4)' }}
        >
          <X size={16} />
        </button>

        <div className="p-5 space-y-5">

          {/* Créateur */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(28,25,23,0.3)', fontSize: 10 }}>Créateur</p>
            <div className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all"
              style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(28,25,23,0.08)')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black"
                  style={{ background: tunnel.color }}>
                  {tunnel.initials}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#1C1917' }}>{tunnel.creator}</p>
                  <p className="text-xs" style={{ color: '#F97316' }}>Voir le profil complet →</p>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: 'rgba(28,25,23,0.25)' }} />
            </div>
          </div>

          {/* Performance */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(28,25,23,0.3)', fontSize: 10 }}>Performance</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-xl" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}>
                <p className="text-xs mb-1" style={{ color: 'rgba(28,25,23,0.4)', fontSize: 10, textTransform: 'uppercase', fontWeight: 600 }}>Ads actives</p>
                <p className="text-2xl font-black" style={{ color: '#1C1917' }}>{tunnel.adsActive}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(28,25,23,0.35)', fontSize: 10 }}>Dépense élevée (UE)</p>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}>
                <p className="text-xs mb-1" style={{ color: 'rgba(28,25,23,0.4)', fontSize: 10, textTransform: 'uppercase', fontWeight: 600 }}>Jours actifs</p>
                <p className="text-2xl font-black" style={{ color: '#1C1917' }}>{tunnel.joursActifs}j</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E' }} />
                  <span className="text-xs" style={{ color: 'rgba(28,25,23,0.35)', fontSize: 10 }}>{tunnel.scalingLabel}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}>
                <p className="text-xs mb-1" style={{ color: 'rgba(28,25,23,0.4)', fontSize: 10, textTransform: 'uppercase', fontWeight: 600 }}>Scaling</p>
                <div className="mt-1">
                  <span className="text-xs font-bold px-2 py-1 rounded-lg"
                    style={{ background: tunnel.scaling === 'scale' ? 'rgba(249,115,22,0.1)' : 'rgba(28,25,23,0.06)', color: tunnel.scaling === 'scale' ? '#F97316' : 'rgba(28,25,23,0.5)' }}>
                    {tunnel.scaling === 'scale' ? 'En scale' : 'Stable'}
                  </span>
                </div>
                <p className="text-xs mt-1.5" style={{ color: 'rgba(28,25,23,0.35)', fontSize: 10 }}>Tendance budget</p>
              </div>
            </div>
          </div>

          {/* Dépenses estimées */}
          <div className="p-4 rounded-xl" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(28,25,23,0.3)', fontSize: 10 }}>Dépenses est. (UE)</p>
            <div className="h-6 rounded-lg mb-3" style={{ background: 'rgba(28,25,23,0.06)' }} />
            <div className="flex items-center gap-1.5">
              <Lock size={11} style={{ color: 'rgba(28,25,23,0.3)' }} />
              <span className="text-xs" style={{ color: 'rgba(28,25,23,0.4)' }}>Mettre à niveau pour voir</span>
            </div>
          </div>

          {/* Détails */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(28,25,23,0.3)', fontSize: 10 }}>Détails du tunnel</p>
            <div className="rounded-xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}>
              {[
                { label: 'Format', value: tunnel.niche, orange: true },
                { label: 'Builder', value: tunnel.builder },
                { label: 'Niche', value: tunnel.niche },
                { label: 'Mot-clé', value: null, keywords: tunnel.keywords },
                { label: 'Première détection', value: tunnel.firstSeen },
              ].map((row, i) => (
                <div key={row.label} className="flex items-center justify-between px-4 py-2.5"
                  style={{ borderTop: i > 0 ? '1px solid rgba(28,25,23,0.06)' : 'none' }}>
                  <span className="text-xs" style={{ color: 'rgba(28,25,23,0.45)' }}>{row.label}</span>
                  {row.keywords ? (
                    <div className="flex gap-1.5 flex-wrap justify-end">
                      {row.keywords.map(k => (
                        <span key={k} className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: 'rgba(28,25,23,0.06)', color: 'rgba(28,25,23,0.55)' }}>
                          {k}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs font-semibold"
                      style={{ color: row.orange ? '#F97316' : '#1C1917' }}>
                      {row.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* URL */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'rgba(28,25,23,0.3)', fontSize: 10 }}>URL de la Landing page</p>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
              style={{ background: 'white', border: '1px solid rgba(249,115,22,0.25)' }}>
              <span className="flex-1 text-xs truncate" style={{ color: '#F97316' }}>
                https://{tunnel.url}
              </span>
              <button onClick={copyUrl} className="flex-shrink-0 transition-all"
                style={{ color: copied ? '#22C55E' : 'rgba(28,25,23,0.3)' }}>
                <Copy size={13} />
              </button>
            </div>
          </div>

          {/* Screenshot preview */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(28,25,23,0.08)' }}>
            <div className="h-40 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1C1917, #2D1F0E)' }}>
              <div className="text-center">
                <ExternalLink size={20} className="mx-auto mb-2" style={{ color: 'rgba(255,255,255,0.2)' }} />
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>Aperçu de la page</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 px-5 py-4 flex items-center gap-2"
          style={{ background: '#FFFBF7', borderTop: '1px solid rgba(28,25,23,0.08)' }}>
          <button className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
            style={{ background: 'rgba(28,25,23,0.06)', color: '#1C1917', border: '1px solid rgba(28,25,23,0.1)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(28,25,23,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(28,25,23,0.06)'}
          >
            Voir les ads ({tunnel.adsActive})
          </button>
          <a href={`https://${tunnel.url}`} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', boxShadow: '0 2px 10px rgba(249,115,22,0.3)' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(249,115,22,0.45)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(249,115,22,0.3)'}
          >
            Voir le tunnel <ChevronRight size={13} />
          </a>
          <button onClick={onClose} className="px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
            style={{ background: 'rgba(28,25,23,0.04)', color: 'rgba(28,25,23,0.45)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(28,25,23,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(28,25,23,0.04)'}
          >
            Fermer
          </button>
        </div>
      </div>
    </>
  )
}

export default function TunnelsPage() {
  const [search, setSearch] = useState('')
  const [activeSort, setActiveSort] = useState('Le plus d\'ads')
  const [selectedTunnel, setSelectedTunnel] = useState<Tunnel | null>(null)

  return (
    <div className="min-h-full flex flex-col" style={{ background: '#FFFBF7' }}>

      {/* Header */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: '#1C1917' }}>Tunnel Tracker</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(28,25,23,0.4)' }}>{TUNNELS.length} tunnels suivis</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/tunnels/import"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316', border: '1px solid rgba(249,115,22,0.2)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(249,115,22,0.1)'}
            >
              <Link2 size={13} /> Importer un tunnel
            </Link>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{ background: 'rgba(28,25,23,0.05)', color: 'rgba(28,25,23,0.5)', border: '1px solid rgba(28,25,23,0.08)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#1C1917'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(28,25,23,0.5)'}
            >
              <RefreshCw size={13} /> Actualiser
            </button>
          </div>
        </div>

        <div className="relative mb-4">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(28,25,23,0.3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par mot-clé, URL ou créateur..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'white', border: '1px solid rgba(28,25,23,0.1)', color: '#1C1917' }} />
        </div>

        <div className="flex items-center gap-2 flex-wrap mb-3">
          {['Niche', 'Scaling', 'Technology', 'Type de tunnel', 'Ads', 'Langue'].map(f => (
            <button key={f} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: 'rgba(28,25,23,0.04)', color: 'rgba(28,25,23,0.55)', border: '1px solid rgba(28,25,23,0.08)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(28,25,23,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(28,25,23,0.04)'}
            >
              {f} <ChevronDown size={11} />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {SORTS.map(s => (
            <button key={s} onClick={() => setActiveSort(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: activeSort === s ? 'rgba(249,115,22,0.1)' : 'transparent',
                color: activeSort === s ? '#F97316' : 'rgba(28,25,23,0.45)',
                border: activeSort === s ? '1px solid rgba(249,115,22,0.2)' : '1px solid transparent',
              }}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 px-8 pb-4 overflow-auto">
        <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: '0 4px' }}>
          <thead>
            <tr>
              {['Domaine & Créateur', 'Niche', 'Scaling', 'Ads actives', 'Actif depuis', 'Builder', 'Action'].map(h => (
                <th key={h} className="text-left pb-2 px-3"
                  style={{ color: 'rgba(28,25,23,0.35)', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TUNNELS.map(t => (
              <tr key={t.id}>
                <td className="py-3 px-3 rounded-l-xl" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.06)', borderRight: 'none', minWidth: 260 }}>
                  <div className={`flex items-center gap-3 ${t.blurred ? 'blur-sm select-none' : ''}`}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0" style={{ background: t.color }}>{t.initials}</div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate" style={{ color: '#F97316' }}>{t.domain}</p>
                      <p className="text-xs truncate" style={{ color: 'rgba(28,25,23,0.5)' }}>{t.creator}</p>
                      <p className="text-xs truncate" style={{ color: 'rgba(28,25,23,0.3)', fontSize: 10 }}>{t.url}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.06)', borderLeft: 'none', borderRight: 'none', minWidth: 160 }}>
                  <div className={t.blurred ? 'blur-sm select-none' : ''}>
                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: 'rgba(249,115,22,0.08)', color: '#F97316', border: '1px solid rgba(249,115,22,0.15)' }}>{t.niche}</span>
                    <p className="text-xs mt-1" style={{ color: 'rgba(28,25,23,0.4)' }}>{t.subNiche}</p>
                  </div>
                </td>
                <td className="py-3 px-3" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.06)', borderLeft: 'none', borderRight: 'none', minWidth: 100 }}>
                  <div className={t.blurred ? 'blur-sm select-none' : ''}><ScalingBadge status={t.scaling} /></div>
                </td>
                <td className="py-3 px-3" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.06)', borderLeft: 'none', borderRight: 'none', minWidth: 110 }}>
                  <div className={t.blurred ? 'blur-sm select-none' : ''}>
                    <span className="text-sm font-black" style={{ color: '#1C1917' }}>{t.adsActive}</span>
                    <span className="text-xs" style={{ color: 'rgba(28,25,23,0.3)' }}> /{t.adsTotal}</span>
                  </div>
                </td>
                <td className="py-3 px-3" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.06)', borderLeft: 'none', borderRight: 'none', minWidth: 110 }}>
                  <div className={t.blurred ? 'blur-sm select-none' : ''}>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E' }} />
                      <span className="text-xs font-bold" style={{ color: '#1C1917' }}>{t.activeSince}</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(28,25,23,0.35)', fontSize: 10 }}>{t.activeDate}</p>
                  </div>
                </td>
                <td className="py-3 px-3" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.06)', borderLeft: 'none', borderRight: 'none', minWidth: 120 }}>
                  <div className={t.blurred ? 'blur-sm select-none' : ''}><BuilderBadge builder={t.builder} /></div>
                </td>
                <td className="py-3 px-3 rounded-r-xl" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.06)', borderLeft: 'none' }}>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg transition-all" style={{ color: 'rgba(28,25,23,0.25)' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#F97316'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(28,25,23,0.25)'}>
                      <Star size={14} />
                    </button>
                    {t.blurred ? (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                        style={{ background: 'rgba(28,25,23,0.06)', color: 'rgba(28,25,23,0.4)' }}>
                        <Lock size={11} /> Spy
                      </button>
                    ) : (
                      <button onClick={() => setSelectedTunnel(t)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all"
                        style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', boxShadow: '0 2px 8px rgba(249,115,22,0.3)' }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(249,115,22,0.45)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(249,115,22,0.3)'}
                      >
                        <Eye size={11} /> Spy
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Unlock banner */}
      <div className="mx-8 mb-6 flex items-center justify-between px-5 py-4 rounded-2xl"
        style={{ background: 'linear-gradient(135deg, #1C1917, #2D1F0E)', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(249,115,22,0.2)' }}>
            <Lock size={16} style={{ color: '#F97316' }} />
          </div>
          <div>
            <p className="text-sm font-black text-white">Débloquez 105 135 tunnels à copier</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>Suivez les tunnels qui scalent et filtrez directement les opportunités utiles.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white flex-shrink-0 transition-all"
          style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', boxShadow: '0 4px 14px rgba(249,115,22,0.4)' }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(249,115,22,0.55)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(249,115,22,0.4)'}
        >
          Débloquer Funnel Tracker →
        </button>
      </div>

      {/* Spy Drawer */}
      {selectedTunnel && <SpyDrawer tunnel={selectedTunnel} onClose={() => setSelectedTunnel(null)} />}
    </div>
  )
}
