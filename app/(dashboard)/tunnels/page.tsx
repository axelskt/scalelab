'use client'
import { useState } from 'react'
import { Search, RefreshCw, Star, Eye, Lock, TrendingUp, Minus, ChevronDown } from 'lucide-react'

const NICHES = ['Tous', 'Business & Entrepr.', 'Santé & Bien-être', 'Make Money', 'Coaching', 'E-commerce', 'Crypto']
const SORTS = ['Le plus d\'ads', 'Plus longtemps', 'En scale', 'Plus récents', 'Plus anciens']
const BUILDERS = { 'systeme.io': '#F97316', 'clickfunnels': '#1C6EF2', 'learnybox': '#7C3AED', 'unknown': 'rgba(28,25,23,0.2)' }

const TUNNELS = [
  {
    id: 1,
    domain: 'go.accelerateur.ai',
    creator: 'Quentin et Edouard',
    url: 'go.accelerateur.ai/adc/inscription',
    niche: 'Business & Entrepr.',
    subNiche: 'Coaching business',
    scaling: 'scale',
    adsActive: 74,
    adsTotal: 2983,
    activeSince: '2mo',
    activeDate: '22 fév. 2026',
    builder: 'unknown',
    avatar: null,
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
    adsActive: 54,
    adsTotal: 1593,
    activeSince: '2mo',
    activeDate: '23 fév. 2026',
    builder: 'systeme.io',
    avatar: null,
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
    adsActive: 206,
    adsTotal: 1471,
    activeSince: '2mo',
    activeDate: '18 mars 2026',
    builder: 'clickfunnels',
    avatar: null,
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
    adsActive: 31,
    adsTotal: 890,
    activeSince: '3mo',
    activeDate: '14 jan. 2026',
    builder: 'systeme.io',
    avatar: null,
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
    adsActive: 18,
    adsTotal: 445,
    activeSince: '1mo',
    activeDate: '3 avr. 2026',
    builder: 'learnybox',
    avatar: null,
    initials: 'AM',
    color: '#0EA5E9',
    blurred: true,
  },
]

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
  if (builder === 'unknown') return <span style={{ color: 'rgba(28,25,23,0.25)' }}>—</span>
  const color = BUILDERS[builder as keyof typeof BUILDERS] || 'rgba(28,25,23,0.3)'
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
      {builder}
    </span>
  )
}

export default function TunnelsPage() {
  const [search, setSearch] = useState('')
  const [activeSort, setActiveSort] = useState('Le plus d\'ads')
  const [activeNiche, setActiveNiche] = useState('Tous')

  const filtered = TUNNELS.filter(t =>
    activeNiche === 'Tous' || t.niche.includes(activeNiche.replace('Business & Entrepr.', 'Business'))
  )

  return (
    <div className="min-h-full flex flex-col" style={{ background: '#FFFBF7' }}>

      {/* Header */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: '#1C1917' }}>Tunnel Tracker</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(28,25,23,0.4)' }}>
              {TUNNELS.length} tunnels suivis
            </p>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all"
            style={{ background: 'rgba(28,25,23,0.05)', color: 'rgba(28,25,23,0.5)', border: '1px solid rgba(28,25,23,0.08)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#1C1917'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(28,25,23,0.5)'}
          >
            <RefreshCw size={13} /> Actualiser
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(28,25,23,0.3)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par mot-clé, URL ou créateur..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{
              background: 'white',
              border: '1px solid rgba(28,25,23,0.1)',
              color: '#1C1917',
            }}
          />
        </div>

        {/* Filters */}
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

        {/* Sort tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {SORTS.map(s => (
            <button key={s} onClick={() => setActiveSort(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: activeSort === s ? 'rgba(249,115,22,0.1)' : 'transparent',
                color: activeSort === s ? '#F97316' : 'rgba(28,25,23,0.45)',
                border: activeSort === s ? '1px solid rgba(249,115,22,0.2)' : '1px solid transparent',
              }}
            >
              {s}
            </button>
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
            {filtered.map(t => (
              <tr key={t.id} className={t.blurred ? 'select-none' : ''}>
                {/* Domain & Creator */}
                <td className="py-3 px-3 rounded-l-xl" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.06)', borderRight: 'none', minWidth: 260 }}>
                  <div className={`flex items-center gap-3 ${t.blurred ? 'blur-sm' : ''}`}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                      style={{ background: t.color }}>
                      {t.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate" style={{ color: '#F97316' }}>{t.domain}</p>
                      <p className="text-xs truncate" style={{ color: 'rgba(28,25,23,0.5)' }}>{t.creator}</p>
                      <p className="text-xs truncate" style={{ color: 'rgba(28,25,23,0.3)', fontSize: 10 }}>{t.url}</p>
                    </div>
                  </div>
                </td>

                {/* Niche */}
                <td className="py-3 px-3" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.06)', borderLeft: 'none', borderRight: 'none', minWidth: 160 }}>
                  <div className={t.blurred ? 'blur-sm' : ''}>
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ background: 'rgba(249,115,22,0.08)', color: '#F97316', border: '1px solid rgba(249,115,22,0.15)' }}>
                      {t.niche}
                    </span>
                    <p className="text-xs mt-1" style={{ color: 'rgba(28,25,23,0.4)' }}>{t.subNiche}</p>
                  </div>
                </td>

                {/* Scaling */}
                <td className="py-3 px-3" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.06)', borderLeft: 'none', borderRight: 'none', minWidth: 100 }}>
                  <div className={t.blurred ? 'blur-sm' : ''}>
                    <ScalingBadge status={t.scaling} />
                  </div>
                </td>

                {/* Ads actives */}
                <td className="py-3 px-3" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.06)', borderLeft: 'none', borderRight: 'none', minWidth: 110 }}>
                  <div className={t.blurred ? 'blur-sm' : ''}>
                    <span className="text-sm font-black" style={{ color: '#1C1917' }}>{t.adsActive}</span>
                    <span className="text-xs" style={{ color: 'rgba(28,25,23,0.3)' }}> /{t.adsTotal}</span>
                  </div>
                </td>

                {/* Actif depuis */}
                <td className="py-3 px-3" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.06)', borderLeft: 'none', borderRight: 'none', minWidth: 110 }}>
                  <div className={t.blurred ? 'blur-sm' : ''}>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#22C55E' }} />
                      <span className="text-xs font-bold" style={{ color: '#1C1917' }}>{t.activeSince}</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(28,25,23,0.35)', fontSize: 10 }}>{t.activeDate}</p>
                  </div>
                </td>

                {/* Builder */}
                <td className="py-3 px-3" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.06)', borderLeft: 'none', borderRight: 'none', minWidth: 110 }}>
                  <div className={t.blurred ? 'blur-sm' : ''}>
                    <BuilderBadge builder={t.builder} />
                  </div>
                </td>

                {/* Action */}
                <td className="py-3 px-3 rounded-r-xl" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.06)', borderLeft: 'none' }}>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg transition-all"
                      style={{ color: 'rgba(28,25,23,0.25)' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#F97316'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(28,25,23,0.25)'}
                    >
                      <Star size={14} />
                    </button>
                    {t.blurred ? (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{ background: 'rgba(28,25,23,0.06)', color: 'rgba(28,25,23,0.4)' }}>
                        <Lock size={11} /> Spy
                      </button>
                    ) : (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all"
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
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(249,115,22,0.2)' }}>
            <Lock size={16} style={{ color: '#F97316' }} />
          </div>
          <div>
            <p className="text-sm font-black text-white">Débloquez 105 135 tunnels à copier</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Suivez les tunnels qui scalent et filtrez directement les opportunités utiles.
            </p>
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

    </div>
  )
}
