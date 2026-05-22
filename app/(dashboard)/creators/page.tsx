'use client'
import { useState, useEffect } from 'react'
import { Search, TrendingUp, ExternalLink } from 'lucide-react'

interface Creator {
  id: string
  name: string
  source: 'facebook' | 'tiktok'
  niche: string
  ads_count: number
  first_seen: string
  last_seen: string
  is_active: boolean
  page_url: string
  thumbnail_url?: string
}

const NICHE_COLORS: Record<string, string> = {
  'IA & Tech': '#7C3AED',
  'E-commerce': '#0EA5E9',
  'Copywriting': '#F59E0B',
  'Finance personnelle': '#10B981',
  'Immobilier': '#6366F1',
  'Fitness & Santé': '#EF4444',
  'Développement personnel': '#F97316',
  'Coaching business': '#8B5CF6',
  'Marketing digital': '#06B6D4',
  'SaaS': '#84CC16',
}

const SOURCE_COLORS = {
  facebook: { bg: 'rgba(24,119,242,0.08)', color: '#1877F2', label: 'Meta' },
  tiktok: { bg: 'rgba(0,0,0,0.06)', color: '#1C1917', label: 'TikTok' },
}

function daysSince(dateStr: string): number {
  return Math.round((Date.now() - new Date(dateStr).getTime()) / 86400000)
}

export default function CreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterNiche, setFilterNiche] = useState('all')
  const [filterSource, setFilterSource] = useState<'all' | 'facebook' | 'tiktok'>('all')
  const [sortBy, setSortBy] = useState<'ads_count' | 'last_seen' | 'first_seen'>('ads_count')

  useEffect(() => {
    fetch('/api/creators')
      .then(r => r.json())
      .then(d => { setCreators(d.creators || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const niches = Array.from(new Set(creators.map(c => c.niche))).sort()

  const filtered = creators
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.niche.toLowerCase().includes(search.toLowerCase()))
    .filter(c => filterNiche === 'all' || c.niche === filterNiche)
    .filter(c => filterSource === 'all' || c.source === filterSource)
    .sort((a, b) => {
      if (sortBy === 'ads_count') return b.ads_count - a.ads_count
      if (sortBy === 'last_seen') return new Date(b.last_seen).getTime() - new Date(a.last_seen).getTime()
      return new Date(a.first_seen).getTime() - new Date(b.first_seen).getTime()
    })

  return (
    <div className="h-full flex flex-col" style={{ background: '#FFFBF7' }}>

      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-4 flex-shrink-0"
        style={{ background: 'white', borderBottom: '1px solid rgba(28,25,23,0.08)' }}>
        <div>
          <h1 className="text-lg font-bold" style={{ color: '#1C1917' }}>Créateurs</h1>
          <p className="text-xs" style={{ color: 'rgba(28,25,23,0.45)' }}>
            {creators.length.toLocaleString('fr-FR')}+ annonceurs actifs · Meta & TikTok · Infopreneurs FR
          </p>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(28,25,23,0.3)' }} />
            <input
              className="w-full h-9 pl-8 pr-3 rounded-lg text-sm focus:outline-none transition-colors"
              style={{ border: '1px solid rgba(28,25,23,0.12)', background: '#FAFAF8', color: '#1C1917' }}
              placeholder="Rechercher un créateur, une niche..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1 rounded-lg p-0.5" style={{ background: 'rgba(28,25,23,0.06)' }}>
          {[
            { value: 'ads_count', label: 'Volume' },
            { value: 'last_seen', label: 'Récents' },
            { value: 'first_seen', label: 'Anciens' },
          ].map(opt => (
            <button key={opt.value} onClick={() => setSortBy(opt.value as typeof sortBy)}
              className="px-3 py-1 rounded-md text-xs font-medium transition-all"
              style={{
                background: sortBy === opt.value ? 'white' : 'transparent',
                color: sortBy === opt.value ? '#1C1917' : 'rgba(28,25,23,0.45)',
                boxShadow: sortBy === opt.value ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-6 py-2 flex items-center gap-2 flex-wrap flex-shrink-0"
        style={{ background: '#F8F5F0', borderBottom: '1px solid rgba(28,25,23,0.08)' }}>

        {/* Source */}
        {(['all', 'facebook', 'tiktok'] as const).map(s => (
          <button key={s} onClick={() => setFilterSource(s)}
            className="px-3 py-1 rounded-full text-xs font-medium border transition-all"
            style={filterSource === s
              ? { borderColor: '#F97316', background: 'rgba(249,115,22,0.08)', color: '#F97316' }
              : { borderColor: 'rgba(28,25,23,0.12)', background: 'white', color: 'rgba(28,25,23,0.5)' }}>
            {s === 'all' ? `Tous (${creators.length})` : s === 'facebook' ? `Meta (${creators.filter(c => c.source === 'facebook').length})` : `TikTok (${creators.filter(c => c.source === 'tiktok').length})`}
          </button>
        ))}

        <div className="w-px h-4" style={{ background: 'rgba(28,25,23,0.1)' }} />

        {/* Niches */}
        <button onClick={() => setFilterNiche('all')}
          className="px-3 py-1 rounded-full text-xs font-medium border transition-all"
          style={filterNiche === 'all'
            ? { borderColor: '#F97316', background: 'rgba(249,115,22,0.08)', color: '#F97316' }
            : { borderColor: 'rgba(28,25,23,0.12)', background: 'white', color: 'rgba(28,25,23,0.5)' }}>
          Toutes niches
        </button>
        {niches.map(n => {
          const c = NICHE_COLORS[n] || '#F97316'
          return (
            <button key={n} onClick={() => setFilterNiche(filterNiche === n ? 'all' : n)}
              className="px-3 py-1 rounded-full text-xs font-medium border transition-all"
              style={filterNiche === n
                ? { borderColor: c, background: `${c}15`, color: c }
                : { borderColor: 'rgba(28,25,23,0.12)', background: 'white', color: 'rgba(28,25,23,0.5)' }}>
              {n}
            </button>
          )
        })}

        <span className="ml-auto text-xs" style={{ color: 'rgba(28,25,23,0.35)' }}>{filtered.length} créateurs</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <svg className="animate-spin h-8 w-8 mx-auto mb-3" style={{ color: '#F97316' }} viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <p className="text-sm" style={{ color: 'rgba(28,25,23,0.4)' }}>Chargement des créateurs...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-center">
            <div>
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-sm font-semibold" style={{ color: '#1C1917' }}>Aucun créateur trouvé</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(28,25,23,0.4)' }}>Essaie avec d&apos;autres filtres</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map(creator => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CreatorCard({ creator }: { creator: Creator }) {
  const nicheColor = NICHE_COLORS[creator.niche] || '#F97316'
  const src = SOURCE_COLORS[creator.source]
  const lastSeenDays = daysSince(creator.last_seen)
  const isRecent = lastSeenDays <= 7

  const initial = creator.name.charAt(0).toUpperCase()

  return (
    <div className="rounded-2xl p-4 transition-all cursor-pointer group"
      style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = 'rgba(28,25,23,0.15)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = 'rgba(28,25,23,0.08)' }}>

      {/* Avatar + Name */}
      <div className="flex items-start gap-3 mb-3">
        {creator.thumbnail_url ? (
          <img src={creator.thumbnail_url} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${nicheColor}, ${nicheColor}99)` }}>
            {initial}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black truncate" style={{ color: '#1C1917' }}>{creator.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
              style={{ background: src.bg, color: src.color }}>
              {src.label}
            </span>
            {isRecent && (
              <span className="flex items-center gap-1 text-xs font-medium"
                style={{ color: '#16A34A' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Actif
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Niche */}
      <div className="mb-3">
        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
          style={{ background: `${nicheColor}12`, color: nicheColor, border: `1px solid ${nicheColor}20` }}>
          {creator.niche}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-xl p-2 text-center" style={{ background: 'rgba(28,25,23,0.03)', border: '1px solid rgba(28,25,23,0.06)' }}>
          <p className="text-lg font-black" style={{ color: '#F97316' }}>{creator.ads_count}</p>
          <p className="text-xs" style={{ color: 'rgba(28,25,23,0.4)', fontSize: 10 }}>Ads actives</p>
        </div>
        <div className="rounded-xl p-2 text-center" style={{ background: 'rgba(28,25,23,0.03)', border: '1px solid rgba(28,25,23,0.06)' }}>
          <p className="text-sm font-bold" style={{ color: '#1C1917' }}>
            {lastSeenDays === 0 ? "Auj." : lastSeenDays <= 1 ? "Hier" : `${lastSeenDays}j`}
          </p>
          <p className="text-xs" style={{ color: 'rgba(28,25,23,0.4)', fontSize: 10 }}>Dernière pub</p>
        </div>
      </div>

      {/* Activity bar — nombre de jours depuis début */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs" style={{ color: 'rgba(28,25,23,0.35)', fontSize: 10 }}>Actif depuis {daysSince(creator.first_seen)}j</span>
          <TrendingUp size={10} style={{ color: nicheColor }} />
        </div>
        <div className="h-1 rounded-full" style={{ background: 'rgba(28,25,23,0.06)' }}>
          <div className="h-1 rounded-full transition-all"
            style={{ width: `${Math.min(100, (creator.ads_count / 50) * 100)}%`, background: `linear-gradient(90deg, ${nicheColor}, ${nicheColor}80)` }} />
        </div>
      </div>

      {/* CTA */}
      <a href={creator.page_url} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all"
        style={{ background: `${nicheColor}08`, color: nicheColor, border: `1px solid ${nicheColor}15` }}
        onMouseEnter={e => e.currentTarget.style.background = `${nicheColor}15`}
        onMouseLeave={e => e.currentTarget.style.background = `${nicheColor}08`}>
        Voir les ads
        <ExternalLink size={11} />
      </a>
    </div>
  )
}
