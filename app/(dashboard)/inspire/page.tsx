'use client'
import { useState, useEffect } from 'react'
import { ScrapedAd } from '@/lib/ads-db'

const SOURCE_COLORS = {
  facebook: { bg: '#1877F220', border: '#1877F240', text: '#1877F2', label: 'Meta' },
  tiktok: { bg: '#00000020', border: '#69C9D040', text: '#69C9D0', label: 'TikTok' },
}

const PATTERN_COLORS: Record<string, string> = {
  PAS: '#FF3B30', AIDA: '#7B61FF', PASTOR: '#AF52DE', BAB: '#F5A623', Story: '#00C7BE',
}

const INFOPRENEUR_KEYWORDS = ['formation', 'masterclass', 'programme', 'revenus passifs', 'business en ligne', 'coaching', 'copywriting', 'dropshipping', 'freelance', 'méthode']

export default function InspirePage() {
  const [ads, setAds] = useState<ScrapedAd[]>([])
  const [loading, setLoading] = useState(true)
  const [scraping, setScraping] = useState(false)
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [selectedAd, setSelectedAd] = useState<ScrapedAd | null>(null)
  const [adaptModal, setAdaptModal] = useState(false)
  const [adaptProduct, setAdaptProduct] = useState('')
  const [adaptAudience, setAdaptAudience] = useState('')
  const [adaptedScript, setAdaptedScript] = useState<string | null>(null)
  const [adaptLoading, setAdaptLoading] = useState(false)
  const [scrapeKeyword, setScrapeKeyword] = useState('formation')
  const [scrapeSource, setScrapeSource] = useState<'facebook' | 'tiktok' | 'both'>('facebook')
  const [filterSource, setFilterSource] = useState<'all' | 'facebook' | 'tiktok'>('all')
  const [filterPattern, setFilterPattern] = useState('all')
  const [sortBy, setSortBy] = useState<'score' | 'runDays' | 'date'>('score')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { fetchAds() }, [])

  const fetchAds = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ads')
      const data = await res.json()
      setAds(data.ads || [])
    } catch { setError('Erreur de chargement') }
    finally { setLoading(false) }
  }

  const handleScrape = async () => {
    setScraping(true)
    setError(null)
    try {
      const res = await fetch('/api/ads/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: scrapeKeyword, source: scrapeSource, country: 'FR', maxAds: 15 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await fetchAds()
    } catch (e) { setError(e instanceof Error ? e.message : 'Erreur') }
    finally { setScraping(false) }
  }

  const handleAnalyze = async (adId: string) => {
    setAnalyzing(adId)
    try {
      const res = await fetch('/api/ads/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAds((prev) => prev.map((a) => a.id === adId ? data.ad : a))
      if (selectedAd?.id === adId) setSelectedAd(data.ad)
    } catch (e) { setError(e instanceof Error ? e.message : 'Erreur d\'analyse') }
    finally { setAnalyzing(null) }
  }

  const handleAdapt = async () => {
    if (!selectedAd || !adaptProduct || !adaptAudience) return
    setAdaptLoading(true)
    try {
      const res = await fetch('/api/ads/adapt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: selectedAd.id, targetProduct: adaptProduct, targetAudience: adaptAudience }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAdaptedScript(data.adaptedScript)
    } catch (e) { setError(e instanceof Error ? e.message : 'Erreur') }
    finally { setAdaptLoading(false) }
  }

  const filtered = ads
    .filter((ad) => filterSource === 'all' || ad.source === filterSource)
    .filter((ad) => filterPattern === 'all' || ad.analysis?.pattern === filterPattern)
    .sort((a, b) => sortBy === 'score' ? b.score - a.score : sortBy === 'runDays' ? b.runDays - a.runDays : new Date(b.scrapedAt).getTime() - new Date(a.scrapedAt).getTime())

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <a href="/" className="text-zinc-500 text-sm hover:text-zinc-300">← VSL Pro</a>
              <span className="text-zinc-700">/</span>
              <h1 className="text-white font-bold">Inspire</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium">
                Ad Library
              </span>
            </div>
            <p className="text-zinc-500 text-xs mt-1">VSL & ads infopreneurs FR qui performent — classées par score</p>
          </div>
          <div className="text-xs text-zinc-600">{ads.length} ads dans la librairie</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {/* Left panel: scrape + filters */}
        <div className="w-64 border-r border-zinc-900 flex flex-col flex-shrink-0">
          {/* Scrape controls */}
          <div className="p-4 border-b border-zinc-900 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Scraper</h3>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Mot-clé</label>
              <input
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500"
                value={scrapeKeyword}
                onChange={(e) => setScrapeKeyword(e.target.value)}
                placeholder="formation, masterclass..."
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {INFOPRENEUR_KEYWORDS.slice(0, 6).map((kw) => (
                <button key={kw} onClick={() => setScrapeKeyword(kw)}
                  className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${scrapeKeyword === kw ? 'border-violet-500 bg-violet-500/10 text-violet-300' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
                  {kw}
                </button>
              ))}
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Source</label>
              <div className="flex gap-1">
                {(['facebook', 'tiktok', 'both'] as const).map((s) => (
                  <button key={s} onClick={() => setScrapeSource(s)}
                    className={`flex-1 text-xs py-1 rounded-lg border transition-colors ${scrapeSource === s ? 'border-violet-500 bg-violet-500/10 text-violet-300' : 'border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}>
                    {s === 'both' ? 'Les 2' : s === 'facebook' ? 'Meta' : 'TikTok'}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleScrape} disabled={scraping || !scrapeKeyword}
              className="w-full py-2 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-500 disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
              {scraping ? <><svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Scraping...</> : '🔍 Lancer le scrape'}
            </button>
          </div>

          {/* Filters */}
          <div className="p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Filtres</h3>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Source</label>
              <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                value={filterSource} onChange={(e) => setFilterSource(e.target.value as any)}>
                <option value="all">Toutes ({ads.length})</option>
                <option value="facebook">Meta ({ads.filter(a => a.source === 'facebook').length})</option>
                <option value="tiktok">TikTok ({ads.filter(a => a.source === 'tiktok').length})</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Pattern</label>
              <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                value={filterPattern} onChange={(e) => setFilterPattern(e.target.value)}>
                <option value="all">Tous</option>
                {['PAS', 'AIDA', 'PASTOR', 'BAB', 'Story'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Trier par</label>
              <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                <option value="score">Score VSL Pro</option>
                <option value="runDays">Durée de run</option>
                <option value="date">Date d'ajout</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main: ad grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)} className="ml-auto">✕</button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <svg className="animate-spin h-8 w-8 text-violet-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((ad, rank) => (
                <AdCard key={ad.id} ad={ad} rank={rank + 1}
                  onSelect={() => setSelectedAd(ad)}
                  onAnalyze={() => handleAnalyze(ad.id)}
                  analyzing={analyzing === ad.id}
                  isSelected={selectedAd?.id === ad.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right panel: ad detail */}
        {selectedAd && (
          <div className="w-80 border-l border-zinc-900 overflow-y-auto flex-shrink-0">
            <AdDetail
              ad={selectedAd}
              onAnalyze={() => handleAnalyze(selectedAd.id)}
              analyzing={analyzing === selectedAd.id}
              onAdapt={() => { setAdaptModal(true); setAdaptedScript(null) }}
              onClose={() => setSelectedAd(null)}
            />
          </div>
        )}
      </div>

      {/* Adapt modal */}
      {adaptModal && selectedAd && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">Adapter à mon produit</h3>
              <button onClick={() => setAdaptModal(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <p className="text-xs text-zinc-500">
              Claude va adapter le script de <span className="text-white font-medium">{selectedAd.advertiser}</span> ({selectedAd.runDays} jours actif) à ton produit.
            </p>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Ton produit</label>
              <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                placeholder="ex: IA Manager — formation revenus en ligne" value={adaptProduct}
                onChange={(e) => setAdaptProduct(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Ton audience</label>
              <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                placeholder="ex: Entrepreneurs 20-35 ans qui veulent..." value={adaptAudience}
                onChange={(e) => setAdaptAudience(e.target.value)} />
            </div>
            {adaptedScript ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700">
                  <p className="text-xs text-zinc-500 mb-2">Script adapté :</p>
                  <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{adaptedScript}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigator.clipboard.writeText(adaptedScript)}
                    className="flex-1 py-2 rounded-lg bg-zinc-700 text-sm text-white hover:bg-zinc-600 transition-colors">
                    📋 Copier
                  </button>
                  <button onClick={() => setAdaptedScript(null)}
                    className="flex-1 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-400 hover:text-white transition-colors">
                    Régénérer
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={handleAdapt} disabled={adaptLoading || !adaptProduct || !adaptAudience}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold text-sm disabled:opacity-40 hover:from-violet-500 hover:to-violet-400 transition-all flex items-center justify-center gap-2">
                {adaptLoading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Adaptation...</> : '✦ Adapter le script'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function AdCard({ ad, rank, onSelect, onAnalyze, analyzing, isSelected }: {
  ad: ScrapedAd; rank: number; onSelect: () => void; onAnalyze: () => void; analyzing: boolean; isSelected: boolean
}) {
  const src = SOURCE_COLORS[ad.source]
  const scoreColor = ad.score >= 70 ? '#00D26A' : ad.score >= 50 ? '#F5A623' : '#FF3B30'

  return (
    <div onClick={onSelect} className={`rounded-xl border cursor-pointer transition-all duration-200 overflow-hidden ${isSelected ? 'border-violet-500 shadow-lg shadow-violet-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}>
      {/* Score banner */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-600">#{rank}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: src.bg, color: src.text, border: `1px solid ${src.border}` }}>
            {src.label}
          </span>
          {ad.analysis?.pattern && (
            <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: PATTERN_COLORS[ad.analysis.pattern] + '20', color: PATTERN_COLORS[ad.analysis.pattern], border: `1px solid ${PATTERN_COLORS[ad.analysis.pattern]}40` }}>
              {ad.analysis.pattern}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold" style={{ color: scoreColor }}>{ad.score}</span>
          <span className="text-xs text-zinc-600">/100</span>
        </div>
      </div>

      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white truncate">{ad.advertiser}</span>
          <span className="text-xs text-zinc-500 flex-shrink-0 ml-2">🔥 {ad.runDays}j</span>
        </div>

        <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">{ad.adText}</p>

        {ad.analysis ? (
          <div className="space-y-1">
            <p className="text-xs text-zinc-600 italic line-clamp-2">"{ad.analysis.hook}"</p>
            <div className="flex gap-1 flex-wrap">
              {ad.analysis.techniques.slice(0, 3).map((t) => (
                <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">{t}</span>
              ))}
            </div>
          </div>
        ) : (
          <button onClick={(e) => { e.stopPropagation(); onAnalyze() }} disabled={analyzing}
            className="w-full py-1.5 rounded-lg border border-zinc-700 text-xs text-zinc-500 hover:border-violet-500 hover:text-violet-400 transition-colors disabled:opacity-40 flex items-center justify-center gap-1">
            {analyzing ? <><svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Analyse IA...</> : '✦ Analyser avec Claude'}
          </button>
        )}
      </div>
    </div>
  )
}

function AdDetail({ ad, onAnalyze, analyzing, onAdapt, onClose }: {
  ad: ScrapedAd; onAnalyze: () => void; analyzing: boolean; onAdapt: () => void; onClose: () => void
}) {
  const src = SOURCE_COLORS[ad.source]
  const scoreColor = ad.score >= 70 ? '#00D26A' : ad.score >= 50 ? '#F5A623' : '#FF3B30'

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-white">{ad.advertiser}</h3>
        <button onClick={onClose} className="text-zinc-600 hover:text-white text-sm">✕</button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: src.bg, color: src.text, border: `1px solid ${src.border}` }}>
          {src.label}
        </span>
        <span className="text-xs text-zinc-500">🔥 {ad.runDays} jours actif</span>
        <span className="text-xs font-bold" style={{ color: scoreColor }}>Score {ad.score}/100</span>
      </div>

      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
        <p className="text-xs text-zinc-500 mb-2">Texte original :</p>
        <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">{ad.adText}</p>
      </div>

      {ad.analysis ? (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Analyse IA</span>
              {ad.analysis.pattern && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: PATTERN_COLORS[ad.analysis.pattern] + '20', color: PATTERN_COLORS[ad.analysis.pattern] }}>
                  {ad.analysis.pattern}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 italic leading-relaxed">{ad.analysis.summary}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
              <p className="text-xs text-zinc-600 mb-1">Urgence</p>
              <div className="h-1.5 rounded-full bg-zinc-800">
                <div className="h-1.5 rounded-full bg-red-500" style={{ width: `${ad.analysis.urgencyLevel * 10}%` }} />
              </div>
              <p className="text-xs text-zinc-400 mt-1">{ad.analysis.urgencyLevel}/10</p>
            </div>
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
              <p className="text-xs text-zinc-600 mb-1">Preuve sociale</p>
              <div className="h-1.5 rounded-full bg-zinc-800">
                <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${ad.analysis.socialProofLevel * 10}%` }} />
              </div>
              <p className="text-xs text-zinc-400 mt-1">{ad.analysis.socialProofLevel}/10</p>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Hook', value: ad.analysis.hook },
              { label: 'Douleur', value: ad.analysis.mainPain },
              { label: 'CTA', value: ad.analysis.cta },
            ].map(({ label, value }) => value && (
              <div key={label} className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                <p className="text-xs text-zinc-600 mb-0.5">{label}</p>
                <p className="text-xs text-zinc-300">{value}</p>
              </div>
            ))}
          </div>

          {ad.analysis.techniques.length > 0 && (
            <div>
              <p className="text-xs text-zinc-600 mb-2">Techniques</p>
              <div className="flex flex-wrap gap-1">
                {ad.analysis.techniques.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400">{t}</span>
                ))}
              </div>
            </div>
          )}

          <button onClick={onAdapt}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20">
            ✦ Adapter à mon produit
          </button>
        </div>
      ) : (
        <button onClick={onAnalyze} disabled={analyzing}
          className="w-full py-2.5 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-500 disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
          {analyzing ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Analyse en cours...</> : '✦ Analyser avec Claude'}
        </button>
      )}
    </div>
  )
}
