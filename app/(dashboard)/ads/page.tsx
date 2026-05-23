'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { ScrapedAd, SupportedLanguage } from '@/lib/ads-db'
import TranscriptionPanel from '@/components/TranscriptionPanel'

const SOURCE_BADGE: Record<string, { label: string; color: string; dot: string }> = {
  facebook: { label: 'Meta', color: 'text-blue-600 bg-blue-50 border-blue-100', dot: '#1877F2' },
  tiktok: { label: 'TikTok', color: 'text-zinc-700 bg-zinc-100 border-zinc-200', dot: '#69C9D0' },
}

const PATTERN_COLORS: Record<string, string> = {
  PAS: '#FF3B30', AIDA: '#7B61FF', PASTOR: '#AF52DE', BAB: '#F5A623', Story: '#00C7BE',
}

const KEYWORDS = ['formation', 'masterclass', 'programme', 'coaching', 'revenus', 'business', 'dropshipping', 'copywriting', 'freelance', 'IA', 'crypto', 'immobilier', 'bourse', 'ecommerce']

const SORT_OPTIONS = [
  { value: 'score', label: 'Winners' },
  { value: 'runDays', label: 'Plus longtemps actives' },
  { value: 'date', label: 'Plus récentes' },
  { value: 'vslScore', label: 'Meilleure note VSL' },
]

const LANGUAGES: { code: SupportedLanguage; flag: string; label: string }[] = [
  { code: 'fr', flag: '🇫🇷', label: 'FR' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
  { code: 'de', flag: '🇩🇪', label: 'DE' },
  { code: 'pt', flag: '🇧🇷', label: 'PT' },
]

export default function AdsPage() {
  const [ads, setAds] = useState<ScrapedAd[]>([])
  const [loading, setLoading] = useState(true)
  const [scraping, setScraping] = useState(false)
  const [scrapeProgress, setScrapeProgress] = useState<string | null>(null)
  const [selectedAd, setSelectedAd] = useState<ScrapedAd | null>(null)
  const [analyzingId, setAnalyzingId] = useState<string | null>(null)
  const [transcribingId, setTranscribingId] = useState<string | null>(null)
  const [adaptModal, setAdaptModal] = useState(false)
  const [adaptProduct, setAdaptProduct] = useState('')
  const [adaptAudience, setAdaptAudience] = useState('')
  const [adaptedScript, setAdaptedScript] = useState<string | null>(null)
  const [adaptLoading, setAdaptLoading] = useState(false)

  // Filters
  const [search, setSearch] = useState('')
  const [filterSource, setFilterSource] = useState('all')
  const [filterPattern, setFilterPattern] = useState('all')
  const [filterLanguage, setFilterLanguage] = useState<SupportedLanguage | 'all'>('all')
  const [filterMinDays, setFilterMinDays] = useState(0)
  const [filterMinViews, setFilterMinViews] = useState(0)
  const [sortBy, setSortBy] = useState('score')

  // Scrape panel
  const [showScrapePanel, setShowScrapePanel] = useState(false)
  const [scrapeKeyword, setScrapeKeyword] = useState('formation')
  const [scrapeSource, setScrapeSource] = useState<'facebook' | 'tiktok' | 'both'>('facebook')
  const [autoScrape, setAutoScrape] = useState(false)
  const autoScrapeRef = useRef(false)

  const fetchAds = useCallback(async () => {
    try {
      const r = await fetch('/api/ads')
      const d = await r.json()
      setAds(d.ads || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAds() }, [fetchAds])

  // Auto-scrape continu
  useEffect(() => {
    autoScrapeRef.current = autoScrape
    if (!autoScrape) return

    const keywordQueue = [...KEYWORDS]
    let idx = 0

    const runNext = async () => {
      if (!autoScrapeRef.current) return
      const kw = keywordQueue[idx % keywordQueue.length]
      idx++
      setScrapeProgress(`Scraping "${kw}"...`)
      try {
        await fetch('/api/ads/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword: kw, source: scrapeSource, country: 'FR', maxAds: 10 }),
        })
        await fetchAds()
      } catch { }
      setScrapeProgress(`Prochain dans 30s... (${kw} ✓)`)
      if (autoScrapeRef.current) setTimeout(runNext, 30000)
    }

    runNext()
    return () => { autoScrapeRef.current = false }
  }, [autoScrape, scrapeSource, fetchAds])

  const handleManualScrape = async () => {
    setScraping(true)
    setScrapeProgress(`Scraping "${scrapeKeyword}"...`)
    try {
      await fetch('/api/ads/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: scrapeKeyword, source: scrapeSource, country: 'FR', maxAds: 20 }),
      })
      await fetchAds()
      setScrapeProgress(`✓ "${scrapeKeyword}" scrapé`)
    } catch { setScrapeProgress('Erreur') }
    finally { setScraping(false) }
  }

  const handleAnalyze = async (ad: ScrapedAd) => {
    setAnalyzingId(ad.id)
    try {
      const r = await fetch('/api/ads/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: ad.id }),
      })
      const d = await r.json()
      setAds(prev => prev.map(a => a.id === ad.id ? d.ad : a))
      setSelectedAd(d.ad)
    } finally { setAnalyzingId(null) }
  }

  const handleTranscribe = async (ad: ScrapedAd) => {
    setTranscribingId(ad.id)
    try {
      const r = await fetch('/api/ads/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: ad.id }),
      })
      const d = await r.json()
      if (d.ad) {
        setAds(prev => prev.map(a => a.id === ad.id ? d.ad : a))
        setSelectedAd(d.ad)
      }
    } finally { setTranscribingId(null) }
  }

  const handleAdapt = async () => {
    if (!selectedAd) return
    setAdaptLoading(true)
    try {
      const r = await fetch('/api/ads/adapt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: selectedAd.id, targetProduct: adaptProduct, targetAudience: adaptAudience }),
      })
      const d = await r.json()
      setAdaptedScript(d.adaptedScript)
    } finally { setAdaptLoading(false) }
  }

  const filtered = ads
    .filter(ad => !search || ad.advertiser.toLowerCase().includes(search.toLowerCase()) || ad.adText.toLowerCase().includes(search.toLowerCase()))
    .filter(ad => filterSource === 'all' || ad.source === filterSource)
    .filter(ad => filterPattern === 'all' || ad.analysis?.pattern === filterPattern)
    .filter(ad => filterLanguage === 'all' || ad.language === filterLanguage)
    .filter(ad => ad.runDays >= filterMinDays)
    .filter(ad => !filterMinViews || (ad.engagement?.views || 0) >= filterMinViews)
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score
      if (sortBy === 'runDays') return b.runDays - a.runDays
      if (sortBy === 'vslScore') return (b.transcription?.score.overall || 0) - (a.transcription?.score.overall || 0)
      return new Date(b.scrapedAt).getTime() - new Date(a.scrapedAt).getTime()
    })

  return (
    <div className="h-full flex flex-col">
      {/* Topbar */}
      <div className="px-6 py-4 flex items-center gap-4 flex-shrink-0"
        style={{ background: 'white', borderBottom: '1px solid rgba(28,25,23,0.08)' }}>
        <div>
          <h1 className="text-lg font-bold" style={{ color: '#1C1917' }}>Ad Library</h1>
          <p className="text-xs" style={{ color: 'rgba(28,25,23,0.45)' }}>+{ads.length.toLocaleString('fr-FR')} ads · Meta & TikTok · Infopreneurs FR</p>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-sm">
          <input
            className="w-full h-9 px-3 rounded-lg text-sm focus:outline-none transition-colors"
            style={{ border: '1px solid rgba(28,25,23,0.12)', background: '#FAFAF8', color: '#1C1917' }}
            placeholder="Rechercher un annonceur, un mot-clé..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Sort tabs */}
        <div className="flex items-center gap-1 rounded-lg p-0.5"
          style={{ background: 'rgba(28,25,23,0.06)' }}>
          {SORT_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => setSortBy(opt.value)}
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

        {/* Scrape button */}
        <button onClick={() => setShowScrapePanel(!showScrapePanel)}
          className="flex items-center gap-2 h-9 px-4 rounded-lg font-semibold text-sm transition-colors"
          style={{ background: 'linear-gradient(135deg,#F97316,#FB923C)', color: 'white', boxShadow: '0 2px 8px rgba(249,115,22,0.3)' }}>
          🔍 Scraper
        </button>
      </div>

      {/* Filter bar */}
      <div className="px-6 py-2 flex items-center gap-3 flex-wrap flex-shrink-0"
        style={{ background: '#F8F5F0', borderBottom: '1px solid rgba(28,25,23,0.08)' }}>
        {/* Source filter */}
        {(['all', 'facebook', 'tiktok'] as const).map(s => (
          <button key={s} onClick={() => setFilterSource(s)}
            className="px-3 py-1 rounded-full text-xs font-medium border transition-all"
            style={filterSource === s ? { borderColor: '#F97316', background: 'rgba(249,115,22,0.08)', color: '#F97316' } : { borderColor: 'rgba(28,25,23,0.12)', background: 'white', color: 'rgba(28,25,23,0.5)' }}>
            {s === 'all' ? `Toutes (${ads.length})` : s === 'facebook' ? `Meta (${ads.filter(a => a.source === 'facebook').length})` : `TikTok (${ads.filter(a => a.source === 'tiktok').length})`}
          </button>
        ))}

        <div className="w-px h-4 bg-zinc-200" />

        {/* Language filter */}
        <div className="flex items-center gap-1">
          <button onClick={() => setFilterLanguage('all')}
            className={`h-7 px-2 rounded-lg border text-xs font-medium transition-colors ${filterLanguage === 'all' ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-zinc-200 text-zinc-500'}`}>
            🌐 Toutes
          </button>
          {LANGUAGES.map(lang => (
            <button key={lang.code} onClick={() => setFilterLanguage(filterLanguage === lang.code ? 'all' : lang.code)}
              className={`h-7 px-2 rounded-lg border text-xs font-medium transition-colors ${filterLanguage === lang.code ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-zinc-200 text-zinc-500 hover:border-zinc-300'}`}>
              {lang.flag} {lang.label}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-zinc-200" />

        {/* Min days */}
        <select value={filterMinDays} onChange={e => setFilterMinDays(Number(e.target.value))}
          className="h-7 px-2 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-700 focus:outline-none">
          <option value={0}>Actif depuis</option>
          <option value={7}>7+ jours</option>
          <option value={30}>30+ jours</option>
          <option value={60}>60+ jours</option>
          <option value={90}>90+ jours</option>
        </select>

        {/* Min views */}
        <select value={filterMinViews} onChange={e => setFilterMinViews(Number(e.target.value))}
          className="h-7 px-2 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-700 focus:outline-none">
          <option value={0}>Vues (toutes)</option>
          <option value={10000}>10K+ vues</option>
          <option value={50000}>50K+ vues</option>
          <option value={100000}>100K+ vues</option>
          <option value={500000}>500K+ vues</option>
        </select>

        <span className="ml-auto text-xs text-zinc-400">{filtered.length} résultats</span>
      </div>

      {/* Scrape panel */}
      {showScrapePanel && (
        <div className="px-6 py-4 flex items-end gap-4 flex-shrink-0"
          style={{ background: 'white', borderBottom: '1px solid rgba(28,25,23,0.08)' }}>
          <div>
            <label className="text-xs block mb-1" style={{ color: 'rgba(28,25,23,0.45)' }}>Mot-clé</label>
            <input className="h-9 px-3 rounded-lg text-sm focus:outline-none w-48"
              style={{ border: '1px solid rgba(28,25,23,0.12)', background: '#FAFAF8', color: '#1C1917' }}
              value={scrapeKeyword} onChange={e => setScrapeKeyword(e.target.value)} placeholder="formation..." />
          </div>
          <div className="flex gap-1 flex-wrap">
            {KEYWORDS.map(kw => (
              <button key={kw} onClick={() => setScrapeKeyword(kw)}
                className="px-2 py-1 rounded-full text-xs border transition-all"
                style={scrapeKeyword === kw ? { borderColor: '#F97316', background: 'rgba(249,115,22,0.08)', color: '#F97316' } : { borderColor: 'rgba(28,25,23,0.12)', background: 'white', color: 'rgba(28,25,23,0.5)' }}>
                {kw}
              </button>
            ))}
          </div>
          <div>
            <label className="text-xs block mb-1" style={{ color: 'rgba(28,25,23,0.45)' }}>Source</label>
            <div className="flex gap-1">
              {(['facebook', 'tiktok', 'both'] as const).map(s => (
                <button key={s} onClick={() => setScrapeSource(s)}
                  className="h-9 px-3 rounded-lg text-xs font-medium transition-all"
                  style={scrapeSource === s ? { border: '1px solid #F97316', background: 'linear-gradient(135deg,#F97316,#FB923C)', color: 'white' } : { border: '1px solid rgba(28,25,23,0.12)', background: 'white', color: 'rgba(28,25,23,0.5)' }}>
                  {s === 'both' ? 'Les 2' : s === 'facebook' ? 'Meta' : 'TikTok'}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleManualScrape} disabled={scraping}
            className="h-9 px-4 rounded-lg font-semibold text-sm disabled:opacity-40 transition-all flex items-center gap-2"
            style={{ background: '#1C1917', color: 'white' }}>
            {scraping ? <><svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Scraping...</> : 'Lancer'}
          </button>

          {/* Auto scrape toggle */}
          <div className="flex items-center gap-2 ml-4">
            <button onClick={() => setAutoScrape(!autoScrape)}
              className={`relative w-10 h-5 rounded-full transition-colors ${autoScrape ? 'bg-green-500' : 'bg-zinc-300'}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${autoScrape ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-xs font-medium" style={{ color: '#1C1917' }}>Scrape continu</span>
            {autoScrape && scrapeProgress && (
              <span className="text-xs text-green-600">{scrapeProgress}</span>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {/* Ads grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <svg className="animate-spin h-8 w-8 text-amber-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
              {filtered.map(ad => (
                <AdCard key={ad.id} ad={ad}
                  selected={selectedAd?.id === ad.id}
                  onClick={() => setSelectedAd(selectedAd?.id === ad.id ? null : ad)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Detail panel — fixed right drawer */}
        {selectedAd && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setSelectedAd(null)} />
            <div className="fixed right-0 top-0 bottom-0 z-50 overflow-y-auto"
              style={{ width: 400, background: '#FFFBF7', borderLeft: '1px solid rgba(28,25,23,0.1)', boxShadow: '-8px 0 32px rgba(0,0,0,0.08)' }}>
              <AdDetailPanel
                ad={selectedAd}
                onClose={() => setSelectedAd(null)}
                onAnalyze={() => handleAnalyze(selectedAd)}
                onTranscribe={() => handleTranscribe(selectedAd)}
                analyzing={analyzingId === selectedAd.id}
                transcribing={transcribingId === selectedAd.id}
                onAdapt={() => { setAdaptModal(true); setAdaptedScript(null) }}
              />
            </div>
          </>
        )}
      </div>

      {/* Adapt modal */}
      {adaptModal && selectedAd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6" onClick={() => setAdaptModal(false)}>
          <div className="rounded-2xl w-full max-w-lg p-6 space-y-4" style={{ background: '#FFFBF7', border: '1px solid rgba(28,25,23,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold" style={{ color: '#1C1917' }}>Adapter à mon produit</h3>
              <button onClick={() => setAdaptModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{ color: 'rgba(28,25,23,0.4)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(28,25,23,0.06)'; e.currentTarget.style.color = '#1C1917' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(28,25,23,0.4)' }}>✕</button>
            </div>
            <p className="text-xs" style={{ color: 'rgba(28,25,23,0.5)' }}>Claude adapte le script de <span className="font-medium" style={{ color: '#1C1917' }}>{selectedAd.advertiser}</span> ({selectedAd.runDays}j actif) à ton produit.</p>
            <input className="w-full h-10 px-3 rounded-lg text-sm focus:outline-none"
              style={{ border: '1px solid rgba(28,25,23,0.12)', background: 'white', color: '#1C1917' }}
              placeholder="Ton produit (ex: IA Manager)" value={adaptProduct} onChange={e => setAdaptProduct(e.target.value)} />
            <input className="w-full h-10 px-3 rounded-lg text-sm focus:outline-none"
              style={{ border: '1px solid rgba(28,25,23,0.12)', background: 'white', color: '#1C1917' }}
              placeholder="Ton audience (ex: Entrepreneurs 25-35 ans)" value={adaptAudience} onChange={e => setAdaptAudience(e.target.value)} />
            {adaptedScript ? (
              <div className="space-y-3">
                <div className="p-4 rounded-xl text-sm whitespace-pre-wrap leading-relaxed"
                  style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)', color: 'rgba(28,25,23,0.75)' }}>{adaptedScript}</div>
                <div className="flex gap-2">
                  <button onClick={() => navigator.clipboard.writeText(adaptedScript)}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold"
                    style={{ background: '#1C1917', color: 'white' }}>📋 Copier</button>
                  <button onClick={() => setAdaptedScript(null)}
                    className="flex-1 py-2 rounded-lg text-sm"
                    style={{ border: '1px solid rgba(28,25,23,0.12)', color: 'rgba(28,25,23,0.6)' }}>Régénérer</button>
                </div>
              </div>
            ) : (
              <button onClick={handleAdapt} disabled={adaptLoading || !adaptProduct || !adaptAudience}
                className="w-full py-2.5 rounded-xl font-bold text-sm disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg,#F97316,#FB923C)', color: 'white', boxShadow: '0 4px 14px rgba(249,115,22,0.3)' }}>
                {adaptLoading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Adaptation...</> : '✦ Adapter le script'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const LANG_FLAGS: Record<string, string> = { fr: '🇫🇷', en: '🇬🇧', es: '🇪🇸', de: '🇩🇪', pt: '🇧🇷', it: '🇮🇹', unknown: '🌐' }

function formatViews(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
  return n.toString()
}

// ─── Video Modal ──────────────────────────────────────────────────────────────
function VideoModal({ ad, onClose, onVideoExtracted }: {
  ad: ScrapedAd
  onClose: () => void
  onVideoExtracted?: (videoUrl: string) => void
}) {
  const [extracting, setExtracting] = useState(false)
  const [extractError, setExtractError] = useState<string | null>(null)
  const [liveVideoUrl, setLiveVideoUrl] = useState<string | null>(ad.videoUrl || null)

  const hasDirectVideo = !!liveVideoUrl
  const snapshotUrl = ad.adUrl?.includes('facebook.com/ads') ? ad.adUrl : null
  const canExtract = ad.source === 'facebook' && !hasDirectVideo && !!ad.adUrl

  const handleExtract = async () => {
    setExtracting(true)
    setExtractError(null)
    try {
      const r = await fetch('/api/ads/extract-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: ad.id }),
      })
      const d = await r.json()
      if (d.videoUrl) {
        setLiveVideoUrl(d.videoUrl)
        onVideoExtracted?.(d.videoUrl)
      } else {
        setExtractError('Vidéo introuvable — cette pub EU ne l\'expose pas directement.')
      }
    } catch {
      setExtractError('Erreur lors de l\'extraction.')
    } finally {
      setExtracting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}
        style={{ background: '#FFFBF7', border: '1px solid rgba(28,25,23,0.1)' }}>
        {/* Video area */}
        <div className="relative bg-black" style={{ aspectRatio: '16/9' }}>
          {hasDirectVideo ? (
            <video src={liveVideoUrl!} controls autoPlay className="w-full h-full" />
          ) : ad.thumbnailUrl ? (
            <img src={ad.thumbnailUrl} alt="" className="w-full h-full object-cover opacity-60" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white/40 text-sm">Aperçu non disponible</span>
            </div>
          )}
          <button onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}>✕</button>
        </div>

        {/* Info */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-sm" style={{ color: '#1C1917' }}>{ad.advertiser}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(28,25,23,0.45)' }}>
                {ad.source === 'facebook' ? 'Meta' : 'TikTok'} · Actif depuis {ad.runDays} jours
              </p>
            </div>
            <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full flex-shrink-0"
              style={{ background: 'rgba(34,197,94,0.1)', color: '#16A34A', border: '1px solid rgba(34,197,94,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> ACTIF
            </span>
          </div>

          {ad.adText && !ad.adText.includes('[Pub ') && (
            <p className="text-xs leading-relaxed line-clamp-3" style={{ color: 'rgba(28,25,23,0.6)' }}>
              {ad.adText}
            </p>
          )}

          {/* Extract error */}
          {extractError && (
            <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', color: '#DC2626', border: '1px solid rgba(239,68,68,0.15)' }}>
              {extractError}
            </p>
          )}

          {/* CTA buttons */}
          <div className="flex gap-2 pt-1 flex-wrap">
            {/* Bouton extraire vidéo — pour les Meta ads sans videoUrl */}
            {canExtract && (
              <button onClick={handleExtract} disabled={extracting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#F97316,#FB923C)', color: 'white', boxShadow: '0 4px 12px rgba(249,115,22,0.3)' }}>
                {extracting ? (
                  <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Extraction...</>
                ) : '▶ Extraire la vidéo'}
              </button>
            )}
            {(snapshotUrl || ad.adUrl) && (
              <a href={snapshotUrl || ad.adUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ border: '1px solid rgba(28,25,23,0.12)', color: 'rgba(28,25,23,0.6)', background: 'white' }}>
                ↗ {ad.source === 'facebook' ? 'Facebook' : 'TikTok'}
              </a>
            )}
            <button onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm transition-all"
              style={{ border: '1px solid rgba(28,25,23,0.12)', color: 'rgba(28,25,23,0.6)', background: 'white' }}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Ad Card (grid) ───────────────────────────────────────────────────────────
function AdCard({ ad, selected, onClick }: { ad: ScrapedAd; selected: boolean; onClick: () => void }) {
  const [showVideo, setShowVideo] = useState(false)
  const src = SOURCE_BADGE[ad.source]
  const vslScore = ad.transcription?.score.overall
  const vslColor = vslScore ? (vslScore >= 75 ? '#00D26A' : vslScore >= 55 ? '#F5A623' : '#FF3B30') : null
  const hasVideo = !!(ad.videoUrl || ad.adUrl)

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowVideo(true)
  }

  return (
    <>
    {showVideo && <VideoModal ad={ad} onClose={() => setShowVideo(false)} onVideoExtracted={() => setShowVideo(true)} />}
    <div onClick={onClick}
      className="rounded-xl cursor-pointer transition-all overflow-hidden group"
      style={{
        background: 'white',
        border: selected ? '2px solid #F97316' : '1px solid rgba(28,25,23,0.1)',
        boxShadow: selected ? '0 4px 16px rgba(249,115,22,0.15)' : '0 1px 4px rgba(0,0,0,0.04)',
      }}>
      {/* Thumbnail */}
      <div className="relative h-44 bg-gradient-to-br from-zinc-100 to-zinc-200 overflow-hidden">
        {ad.thumbnailUrl ? (
          <img src={ad.thumbnailUrl} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f3f0eb, #e8e3db)' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#F97316"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
        )}

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200" />

        {/* Play button — visible on hover */}
        {hasVideo && (
          <button onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
            <div className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform duration-200 hover:scale-110"
              style={{ background: 'rgba(249,115,22,0.92)', boxShadow: '0 4px 20px rgba(249,115,22,0.5)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </button>
        )}

        {/* Top badges */}
        <span className={`absolute top-2 left-2 text-xs px-1.5 py-0.5 rounded-full border font-medium ${src.color}`}>
          {src.label}
        </span>
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-black/60 text-white font-medium">🔥 {ad.runDays}j</span>
          {ad.language && ad.language !== 'unknown' && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-black/60 text-white">{LANG_FLAGS[ad.language]}</span>
          )}
        </div>

        {/* VSL score badge */}
        {vslScore && vslColor && (
          <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
            style={{ backgroundColor: vslColor, boxShadow: `0 0 8px ${vslColor}80` }}>
            {vslScore}
          </div>
        )}

        <span className="absolute bottom-2 left-2 flex items-center gap-1 text-xs text-white bg-black/60 px-1.5 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          ACTIF
        </span>
      </div>

      <div className="p-3 space-y-2">
        <p className="text-xs font-bold leading-tight line-clamp-1" style={{ color: '#1C1917' }}>{ad.advertiser}</p>
        <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: 'rgba(28,25,23,0.55)' }}>{ad.adText}</p>

        {/* Engagement */}
        {ad.engagement && (
          <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(28,25,23,0.4)' }}>
            <span>👁 {formatViews(ad.engagement.views || 0)}</span>
            <span>❤ {formatViews(ad.engagement.likes || 0)}</span>
            <span>💬 {formatViews(ad.engagement.comments || 0)}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1" style={{ borderTop: '1px solid rgba(28,25,23,0.06)' }}>
          {ad.transcription ? (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100">🎙 Analysé</span>
          ) : (
            <span className="text-xs" style={{ color: 'rgba(28,25,23,0.3)' }}>Voir détails →</span>
          )}
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(28,25,23,0.3)' }}>
            {ad.source === 'tiktok' ? 'TikTok' : 'Meta'}
          </span>
        </div>
      </div>
    </div>
    </>
  )
}

// ─── Ad Detail Panel ───────────────────────────────────────────────────────────
function AdDetailPanel({ ad, onClose, onAnalyze, onTranscribe, analyzing, transcribing, onAdapt }: {
  ad: ScrapedAd; onClose: () => void; onAnalyze: () => void; onTranscribe: () => void
  analyzing: boolean; transcribing: boolean; onAdapt: () => void
}) {
  const src = SOURCE_BADGE[ad.source] ?? SOURCE_BADGE['facebook']
  const startDate = new Date(ad.startDate)
  const [showFullCopy, setShowFullCopy] = useState(false)
  const adText = ad.adText || ''
  const shortText = adText.slice(0, 180)
  const needsTruncation = adText.length > 180

  // Detect builder from URL
  const url = ad.adUrl || ''
  const builder = url.includes('systeme') ? 'systeme.io' : url.includes('clickfunnels') ? 'clickfunnels' : url.includes('learnybox') ? 'learnybox' : null

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 sticky top-0 z-10"
        style={{ background: '#FFFBF7', borderBottom: '1px solid rgba(28,25,23,0.08)' }}>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(34,197,94,0.1)', color: '#16A34A', border: '1px solid rgba(34,197,94,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Actif
          </span>
          <span className="text-sm font-bold" style={{ color: '#1C1917' }}>Détail ad</span>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg transition-all"
          style={{ color: 'rgba(28,25,23,0.4)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(28,25,23,0.06)'; e.currentTarget.style.color = '#1C1917' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(28,25,23,0.4)' }}>
          ✕
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Preview */}
        {ad.thumbnailUrl && (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(28,25,23,0.08)' }}>
            <img src={ad.thumbnailUrl} alt="" className="w-full object-cover max-h-48" />
          </div>
        )}

        {/* Advertiser */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #F97316, #7C3AED)' }}>
              {ad.advertiser[0]}
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: '#1C1917' }}>{ad.advertiser}</p>
              <p className="text-xs" style={{ color: 'rgba(28,25,23,0.4)' }}>{src.label}</p>
            </div>
          </div>
          <button className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
            style={{ background: 'rgba(249,115,22,0.08)', color: '#F97316', border: '1px solid rgba(249,115,22,0.2)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(249,115,22,0.08)'}>
            ☆ Favori
          </button>
        </div>

        {/* URL + Analyser */}
        {ad.adUrl && (
          <div className="flex items-center justify-between px-3 py-2 rounded-xl"
            style={{ background: 'rgba(28,25,23,0.03)', border: '1px solid rgba(28,25,23,0.07)' }}>
            <span className="text-xs truncate flex-1 mr-2" style={{ color: 'rgba(28,25,23,0.45)' }}>{ad.adUrl}</span>
            <a href={ad.adUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs font-semibold flex-shrink-0 transition-all" style={{ color: '#F97316' }}>
              Analyser le tunnel ↗
            </a>
          </div>
        )}

        {/* Offre détectée — affiché si analyse dispo */}
        {ad.analysis && (
          <div className="p-4 rounded-2xl" style={{ background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.15)' }}>
            <p className="text-xs font-bold mb-3" style={{ color: 'rgba(28,25,23,0.35)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>🎯 Offre détectée</p>
            <div className="space-y-2.5">
              {/* Prix + Type */}
              <div className="flex items-center gap-2 flex-wrap">
                {ad.analysis.price && ad.analysis.price !== 'Non mentionné' && (
                  <span className="text-sm font-black px-3 py-1 rounded-xl"
                    style={{ background: 'linear-gradient(135deg,#F97316,#FB923C)', color: 'white' }}>
                    {ad.analysis.price}
                  </span>
                )}
                {ad.analysis.productType && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-xl"
                    style={{ background: 'rgba(28,25,23,0.06)', color: '#1C1917', border: '1px solid rgba(28,25,23,0.1)' }}>
                    {ad.analysis.productType}
                  </span>
                )}
                {ad.analysis.niche && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-xl"
                    style={{ background: 'rgba(124,58,237,0.08)', color: '#7C3AED', border: '1px solid rgba(124,58,237,0.15)' }}>
                    {ad.analysis.niche}
                  </span>
                )}
              </div>
              {/* Description offre */}
              {ad.analysis.offer && (
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(28,25,23,0.65)' }}>
                  {ad.analysis.offer}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-xl" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}>
            <p className="text-xs font-bold mb-1" style={{ color: 'rgba(28,25,23,0.35)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Jours actifs</p>
            <p className="text-2xl font-black" style={{ color: '#1C1917' }}>{ad.runDays}j</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E' }} />
              <span className="text-xs" style={{ color: 'rgba(28,25,23,0.35)', fontSize: 10 }}>Evergreen</span>
            </div>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}>
            <p className="text-xs font-bold mb-1" style={{ color: 'rgba(28,25,23,0.35)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tunnel</p>
            {builder ? (
              <span className="text-sm font-bold" style={{ color: '#1C1917' }}>{builder}</span>
            ) : (
              <span className="text-sm" style={{ color: 'rgba(28,25,23,0.3)' }}>—</span>
            )}
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}>
            <p className="text-xs font-bold mb-1" style={{ color: 'rgba(28,25,23,0.35)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>CTA</p>
            <span className="text-sm font-bold" style={{ color: '#1C1917' }}>{ad.analysis?.cta || '—'}</span>
          </div>
          <div className="p-3 rounded-xl relative overflow-hidden" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}>
            <p className="text-xs font-bold mb-1" style={{ color: 'rgba(28,25,23,0.35)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Portée totale (UE)</p>
            <div className="flex items-center justify-between">
              <span className="text-sm blur-sm select-none font-black" style={{ color: '#1C1917' }}>124K</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-lg" style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316' }}>Upgrade</span>
            </div>
          </div>
        </div>

        {/* Dépense estimée */}
        <div className="p-4 rounded-xl" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}>
          <p className="text-xs font-bold mb-3" style={{ color: 'rgba(28,25,23,0.35)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dépense est.</p>
          <div className="h-5 rounded-lg mb-2" style={{ background: 'rgba(28,25,23,0.06)' }} />
          <div className="flex items-center gap-1.5">
            <span style={{ color: 'rgba(28,25,23,0.3)', fontSize: 12 }}>$</span>
            <span className="text-xs" style={{ color: 'rgba(28,25,23,0.4)' }}>Mettre à niveau pour voir</span>
          </div>
        </div>

        {/* Ad copy */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316', border: '1px solid rgba(249,115,22,0.2)' }}>
              Ad copy
            </span>
          </div>
          <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(28,25,23,0.7)' }}>
            {showFullCopy ? adText : shortText}{needsTruncation && !showFullCopy && '...'}
          </p>
          {needsTruncation && (
            <button onClick={() => setShowFullCopy(v => !v)}
              className="text-xs font-semibold mt-1.5 transition-all" style={{ color: '#F97316' }}>
              {showFullCopy ? 'Voir moins' : 'Voir plus'}
            </button>
          )}
        </div>

        {/* Analysis */}
        {ad.analysis ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-widest">Analyse IA</p>
              {ad.analysis.pattern && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: PATTERN_COLORS[ad.analysis.pattern] + '20', color: PATTERN_COLORS[ad.analysis.pattern] }}>
                  {ad.analysis.pattern}
                </span>
              )}
            </div>

            <p className="text-xs italic leading-relaxed">{ad.analysis.summary}</p>

            <div className="grid grid-cols-2 gap-2">
              <ScoreBar label="Urgence" value={ad.analysis.urgencyLevel} max={10} color="#FF3B30" />
              <ScoreBar label="Preuve sociale" value={ad.analysis.socialProofLevel} max={10} color="#00D26A" />
            </div>

            <div className="space-y-2">
              {[
                { label: 'Hook', v: ad.analysis.hook },
                { label: 'Douleur', v: ad.analysis.mainPain },
                { label: 'CTA', v: ad.analysis.cta },
              ].filter(x => x.v).map(({ label, v }) => (
                <div key={label} className="flex gap-2">
                  <span className="text-xs w-16 flex-shrink-0 pt-0.5">{label}</span>
                  <span className="text-xs leading-relaxed">{v}</span>
                </div>
              ))}
            </div>

            {ad.analysis.techniques.length > 0 && (
              <div>
                <p className="text-xs mb-1.5">Techniques</p>
                <div className="flex flex-wrap gap-1">
                  {ad.analysis.techniques.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <button onClick={onAnalyze} disabled={analyzing}
            className="w-full py-2.5 rounded-xl border-2 border-dashed text-sm font-medium transition-all disabled:opacity-40 flex items-center justify-center gap-2">
            {analyzing ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Analyse...</> : '✦ Analyser le tunnel avec Claude'}
          </button>
        )}

        {/* Chronologie */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(28,25,23,0.3)', fontSize: 10 }}>Chronologie</p>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: 'rgba(28,25,23,0.2)' }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: '#1C1917' }}>
                  {startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <p className="text-xs" style={{ color: 'rgba(28,25,23,0.4)' }}>Lancement</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0 animate-pulse" style={{ background: '#F97316' }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: '#F97316' }}>Actif maintenant</p>
                <p className="text-xs" style={{ color: 'rgba(28,25,23,0.4)' }}>{ad.runDays} jours de diffusion</p>
              </div>
            </div>
          </div>
        </div>

        {/* Evolution portée — locked */}
        <div className="p-4 rounded-xl" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}>
          <p className="text-xs font-bold mb-3" style={{ color: 'rgba(28,25,23,0.35)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Évolution de la portée (UE)</p>
          <div className="h-16 rounded-lg flex items-end gap-1 px-2 pb-1" style={{ background: 'rgba(28,25,23,0.04)' }}>
            {[3,5,4,7,6,8,9,7,10,8,9,11].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm" style={{ height: `${h * 8}%`, background: 'rgba(28,25,23,0.1)' }} />
            ))}
          </div>
          <p className="text-xs mt-2" style={{ color: 'rgba(28,25,23,0.35)' }}>Mettre à niveau pour voir l'évolution</p>
        </div>

        {/* Engagement */}
        {ad.engagement && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2">
              Engagement {ad.engagement.estimated && <span className="font-normal normal-case">(estimé)</span>}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: '👁', label: 'Vues', value: ad.engagement.views },
                { icon: '❤', label: 'Likes', value: ad.engagement.likes },
                { icon: '💬', label: 'Comms', value: ad.engagement.comments },
                { icon: '↗', label: 'Partages', value: ad.engagement.shares },
              ].map(({ icon, label, value }) => (
                <div key={label} className="rounded-lg p-2 text-center"
                  style={{ border: '1px solid rgba(28,25,23,0.08)', background: 'white' }}>
                  <div className="text-base mb-0.5">{icon}</div>
                  <div className="text-xs font-bold" style={{ color: '#1C1917' }}>{formatViews(value || 0)}</div>
                  <div className="text-xs" style={{ color: 'rgba(28,25,23,0.4)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transcription + Score + Version améliorée */}
        <TranscriptionPanel
          ad={ad}
          onTranscribe={onTranscribe}
          transcribing={transcribing}
        />

        {/* CTA: Generate VSL */}
        {ad.analysis && (
          <button onClick={onAdapt}
            className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20">
            ✦ Adapter à mon produit
          </button>
        )}
      </div>
    </div>
  )
}

function ScoreBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="rounded-xl p-2.5" style={{ border: '1px solid rgba(28,25,23,0.08)', background: 'white' }}>
      <p className="text-xs mb-1.5" style={{ color: 'rgba(28,25,23,0.4)' }}>{label}</p>
      <div className="h-1.5 rounded-full mb-1" style={{ background: 'rgba(28,25,23,0.08)' }}>
        <div className="h-1.5 rounded-full transition-all" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
      </div>
      <p className="text-xs font-bold" style={{ color: '#1C1917' }}>{value}/{max}</p>
    </div>
  )
}
