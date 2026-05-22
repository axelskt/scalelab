'use client'
import { useState } from 'react'
import { Link2, Check, Copy, ArrowLeft, Sparkles, Globe, Tag, Users, Target, Shield, MessageSquare, TrendingUp, FileText, ChevronDown, ChevronUp, Mail, Lightbulb, Lock, Zap } from 'lucide-react'
import Link from 'next/link'

interface TunnelAnalysis {
  url: string
  builder: string | null
  analysis: {
    headline: string
    subheadline: string
    offer: string
    price: string
    cta: string
    niche: string
    targetAudience: string
    mainPain: string
    copyType: string
    hasFomo: boolean
    hasGuarantee: boolean
    guaranteeText: string
    testimonialCount: number
    language: string
    summary: string
  }
  scrapedAt: string
}

interface FunnelBrief {
  funnelName: string
  funnelType: string
  steps: {
    stepName: string
    stepType: string
    headline: string
    subheadline: string
    bodyContent: string
    cta: string
    colorTheme: string
  }[]
  emailSequence: {
    delay: number
    subject: string
    preview: string
    purpose: string
  }[]
  recommendedPrice: string
  systemeioTips: string[]
}

const COPY_COLORS: Record<string, string> = {
  PAS: '#FF3B30', AIDA: '#7B61FF', PASTOR: '#AF52DE', BAB: '#F5A623', Story: '#00C7BE',
}

export default function TunnelImportPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TunnelAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [generatingBrief, setGeneratingBrief] = useState(false)
  const [brief, setBrief] = useState<FunnelBrief | null>(null)
  const [briefError, setBriefError] = useState<string | null>(null)
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  // TODO: replace with real plan from DB/session
  const userPlan = 'free' as 'free' | 'starter' | 'pro' | 'business'
  const canGenerateBrief = userPlan === 'pro' || userPlan === 'business'

  async function handleImport() {
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/tunnel-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  async function generateBrief() {
    if (!result) return
    setGeneratingBrief(true)
    setBriefError(null)
    setBrief(null)
    try {
      const res = await fetch('/api/tunnel-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis: result.analysis, url: result.url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      setBrief(data)
    } catch (e) {
      setBriefError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setGeneratingBrief(false)
    }
  }

  return (
    <div className="min-h-full" style={{ background: '#FFFBF7' }}>
      <div className="max-w-2xl mx-auto px-8 py-10">

        {/* Back */}
        <Link href="/tunnels" className="inline-flex items-center gap-1.5 text-xs font-medium mb-8 transition-all"
          style={{ color: 'rgba(28,25,23,0.45)' }}
          onMouseEnter={e => e.currentTarget.style.color = '#1C1917'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(28,25,23,0.45)'}>
          <ArrowLeft size={13} /> Retour aux tunnels
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.15)' }}>
            <Link2 size={22} style={{ color: '#F97316' }} />
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-2" style={{ color: '#1C1917' }}>
            Importer un tunnel
          </h1>
          <p className="text-sm" style={{ color: 'rgba(28,25,23,0.5)' }}>
            Colle l'URL d'une page de vente — l'IA analyse le copywriting, l'offre, la cible et la structure.
          </p>
        </div>

        {/* Input */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(28,25,23,0.3)' }} />
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleImport()}
              placeholder="https://go.exemple.com/offre-vip"
              className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{ background: 'white', border: '1px solid rgba(28,25,23,0.12)', color: '#1C1917' }}
            />
          </div>
          <button
            onClick={handleImport}
            disabled={loading || !url.trim()}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all flex-shrink-0"
            style={{ background: loading ? 'rgba(249,115,22,0.5)' : 'linear-gradient(135deg, #F97316, #FB923C)', boxShadow: loading ? 'none' : '0 4px 14px rgba(249,115,22,0.3)' }}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Analyse...
              </>
            ) : (
              <><Sparkles size={15} /> Analyser</>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-xl mb-6 text-sm"
            style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)', color: '#DC2626' }}>
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-5">

            {/* Summary card */}
            <div className="p-5 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-base font-black leading-snug mb-1" style={{ color: '#1C1917' }}>
                    {result.analysis.headline}
                  </h2>
                  {result.analysis.subheadline && (
                    <p className="text-sm" style={{ color: 'rgba(28,25,23,0.5)' }}>{result.analysis.subheadline}</p>
                  )}
                </div>
                {result.analysis.price && (
                  <span className="text-lg font-black flex-shrink-0" style={{ color: '#F97316' }}>{result.analysis.price}</span>
                )}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(28,25,23,0.55)' }}>{result.analysis.summary}</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCard icon={Tag} label="Niche" value={result.analysis.niche} />
              <InfoCard icon={Users} label="Cible" value={result.analysis.targetAudience} />
              <InfoCard icon={Target} label="Douleur principale" value={result.analysis.mainPain} />
              <InfoCard icon={MessageSquare} label="CTA" value={result.analysis.cta} />
            </div>

            {/* Copy structure */}
            <div className="p-4 rounded-xl flex items-center justify-between"
              style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(28,25,23,0.35)', fontSize: 10 }}>Structure copywriting</p>
                <span className="text-sm font-black px-3 py-1 rounded-lg"
                  style={{ background: `${COPY_COLORS[result.analysis.copyType] || '#F97316'}18`, color: COPY_COLORS[result.analysis.copyType] || '#F97316' }}>
                  {result.analysis.copyType}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(28,25,23,0.5)' }}>
                {result.analysis.hasFomo && (
                  <div className="flex items-center gap-1.5">
                    <Check size={12} style={{ color: '#22C55E' }} />
                    <span>FOMO</span>
                  </div>
                )}
                {result.analysis.hasGuarantee && (
                  <div className="flex items-center gap-1.5">
                    <Shield size={12} style={{ color: '#F97316' }} />
                    <span>Garantie</span>
                  </div>
                )}
                {result.analysis.testimonialCount > 0 && (
                  <div className="flex items-center gap-1.5">
                    <TrendingUp size={12} style={{ color: '#7C3AED' }} />
                    <span>{result.analysis.testimonialCount} témos</span>
                  </div>
                )}
              </div>
            </div>

            {/* Builder */}
            {result.builder && (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background: 'rgba(28,25,23,0.03)', border: '1px solid rgba(28,25,23,0.07)' }}>
                <span className="text-xs font-semibold" style={{ color: 'rgba(28,25,23,0.45)' }}>Builder détecté</span>
                <span className="text-xs font-bold" style={{ color: '#F97316' }}>{result.builder}</span>
              </div>
            )}

            {/* Guarantee */}
            {result.analysis.hasGuarantee && result.analysis.guaranteeText && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.12)' }}>
                <Shield size={14} style={{ color: '#F97316', flexShrink: 0, marginTop: 1 }} />
                <p className="text-xs" style={{ color: 'rgba(28,25,23,0.6)' }}>{result.analysis.guaranteeText}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => copy(JSON.stringify(result.analysis, null, 2), 'json')}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'rgba(28,25,23,0.06)', color: '#1C1917', border: '1px solid rgba(28,25,23,0.1)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(28,25,23,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(28,25,23,0.06)'}
              >
                {copied === 'json' ? <><Check size={14} /> Copié !</> : <><Copy size={14} /> Copier l'analyse</>}
              </button>
              <Link href={`/vsl?tunnel=${encodeURIComponent(url)}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', boxShadow: '0 4px 14px rgba(249,115,22,0.3)' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(249,115,22,0.4)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(249,115,22,0.3)'}
              >
                <Sparkles size={14} /> Générer une VSL
              </Link>
            </div>

            {/* Systeme.io Brief CTA */}
            {!brief && (
              <div className="p-5 rounded-2xl relative overflow-hidden"
                style={{ background: 'white', border: `1px solid ${canGenerateBrief ? 'rgba(28,25,23,0.08)' : 'rgba(249,115,22,0.2)'}` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.12)' }}>
                    <span className="text-base">🔗</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black" style={{ color: '#1C1917' }}>Importer dans systeme.io</p>
                      {!canGenerateBrief && (
                        <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: 'linear-gradient(135deg,#F97316,#FB923C)', color: 'white', fontSize: 10 }}>
                          <Zap size={9} /> Pro
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: 'rgba(28,25,23,0.45)' }}>Génère un brief complet pour recréer ce tunnel</p>
                  </div>
                </div>

                {canGenerateBrief ? (
                  <>
                    {briefError && (
                      <p className="text-xs mb-3 px-3 py-2 rounded-lg" style={{ background: 'rgba(220,38,38,0.06)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.12)' }}>
                        {briefError}
                      </p>
                    )}
                    <button
                      onClick={generateBrief}
                      disabled={generatingBrief}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                      style={{ background: generatingBrief ? 'rgba(249,115,22,0.5)' : 'linear-gradient(135deg, #F97316, #FB923C)', boxShadow: generatingBrief ? 'none' : '0 4px 14px rgba(249,115,22,0.25)' }}>
                      {generatingBrief ? (
                        <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Génération du brief...</>
                      ) : (
                        <><FileText size={14} /> Générer le brief systeme.io</>
                      )}
                    </button>
                  </>
                ) : (
                  /* Paywall overlay */
                  <div className="relative">
                    {/* Blurred fake preview */}
                    <div className="pointer-events-none select-none mb-3 space-y-2" style={{ filter: 'blur(4px)', opacity: 0.5 }}>
                      {[{ w: '75%' }, { w: '55%' }, { w: '65%' }].map((l, i) => (
                        <div key={i} className="h-3 rounded-full" style={{ width: l.w, background: 'rgba(28,25,23,0.08)' }} />
                      ))}
                      <div className="flex gap-2 pt-1">
                        {['Étape 1', 'Étape 2', 'Étape 3'].map(s => (
                          <div key={s} className="flex-1 h-8 rounded-lg" style={{ background: 'rgba(249,115,22,0.08)' }} />
                        ))}
                      </div>
                    </div>
                    {/* Lock CTA */}
                    <div className="flex items-center gap-3 p-3.5 rounded-xl"
                      style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)' }}>
                      <Lock size={16} style={{ color: '#F97316', flexShrink: 0 }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold" style={{ color: '#1C1917' }}>Réservé aux plans Pro & Business</p>
                        <p className="text-xs" style={{ color: 'rgba(28,25,23,0.45)' }}>Étapes du tunnel, séquence email, conseils systeme.io</p>
                      </div>
                      <Link href="/plans"
                        className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-all"
                        style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', boxShadow: '0 3px 10px rgba(249,115,22,0.3)' }}>
                        Upgrade
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Brief result */}
            {brief && (
              <div className="space-y-4">
                {/* Brief header */}
                <div className="p-5 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">🔗</span>
                        <h3 className="text-base font-black" style={{ color: '#1C1917' }}>{brief.funnelName}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize"
                          style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316' }}>{brief.funnelType}</span>
                        <span className="text-xs font-bold" style={{ color: '#1C1917' }}>{brief.recommendedPrice}€</span>
                        <span className="text-xs" style={{ color: 'rgba(28,25,23,0.4)' }}>recommandé</span>
                      </div>
                    </div>
                    <button
                      onClick={() => copy(JSON.stringify(brief, null, 2), 'brief')}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 transition-all"
                      style={{ background: 'rgba(28,25,23,0.05)', color: '#1C1917', border: '1px solid rgba(28,25,23,0.1)' }}>
                      {copied === 'brief' ? <><Check size={11} /> Copié</> : <><Copy size={11} /> Copier</>}
                    </button>
                  </div>

                  {/* Steps */}
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: 'rgba(28,25,23,0.35)', fontSize: 10 }}>Étapes du tunnel</p>
                    {brief.steps.map((step, i) => (
                      <div key={i} className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(28,25,23,0.07)' }}>
                        <button
                          onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                          className="w-full flex items-center justify-between px-4 py-3 text-left transition-all"
                          style={{ background: expandedStep === i ? 'rgba(249,115,22,0.04)' : 'rgba(28,25,23,0.01)' }}>
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{ background: step.colorTheme || '#F97316' }}>{i + 1}</span>
                            <div>
                              <p className="text-xs font-bold" style={{ color: '#1C1917' }}>{step.stepName}</p>
                              <p className="text-xs" style={{ color: 'rgba(28,25,23,0.4)', fontSize: 10 }}>{step.stepType}</p>
                            </div>
                          </div>
                          {expandedStep === i ? <ChevronUp size={13} style={{ color: 'rgba(28,25,23,0.35)' }} /> : <ChevronDown size={13} style={{ color: 'rgba(28,25,23,0.35)' }} />}
                        </button>
                        {expandedStep === i && (
                          <div className="px-4 pb-4 space-y-3" style={{ borderTop: '1px solid rgba(28,25,23,0.06)', paddingTop: 12 }}>
                            <div>
                              <p className="text-xs font-semibold mb-0.5" style={{ color: 'rgba(28,25,23,0.4)', fontSize: 10 }}>TITRE</p>
                              <p className="text-sm font-bold" style={{ color: '#1C1917' }}>{step.headline}</p>
                            </div>
                            {step.subheadline && (
                              <div>
                                <p className="text-xs font-semibold mb-0.5" style={{ color: 'rgba(28,25,23,0.4)', fontSize: 10 }}>SOUS-TITRE</p>
                                <p className="text-xs" style={{ color: 'rgba(28,25,23,0.6)' }}>{step.subheadline}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-semibold mb-0.5" style={{ color: 'rgba(28,25,23,0.4)', fontSize: 10 }}>COPY</p>
                              <p className="text-xs leading-relaxed" style={{ color: 'rgba(28,25,23,0.6)' }}>{step.bodyContent}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-3 py-1 rounded-lg font-bold text-white"
                                style={{ background: step.colorTheme || '#F97316' }}>{step.cta}</span>
                              <span className="text-xs" style={{ color: 'rgba(28,25,23,0.4)' }}>bouton CTA</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email sequence */}
                {brief.emailSequence?.length > 0 && (
                  <div className="p-5 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}>
                    <div className="flex items-center gap-2 mb-4">
                      <Mail size={13} style={{ color: '#F97316' }} />
                      <p className="text-sm font-black" style={{ color: '#1C1917' }}>Séquence email</p>
                    </div>
                    <div className="space-y-3">
                      {brief.emailSequence.map((email, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316' }}>J{email.delay}</div>
                            {i < brief.emailSequence.length - 1 && (
                              <div className="w-px flex-1 my-1" style={{ background: 'rgba(28,25,23,0.08)', minHeight: 12 }} />
                            )}
                          </div>
                          <div className="flex-1 pb-3">
                            <p className="text-xs font-bold" style={{ color: '#1C1917' }}>{email.subject}</p>
                            <p className="text-xs mt-0.5" style={{ color: 'rgba(28,25,23,0.5)' }}>{email.preview}</p>
                            <p className="text-xs mt-1 italic" style={{ color: 'rgba(28,25,23,0.35)', fontSize: 10 }}>{email.purpose}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Systeme.io tips */}
                {brief.systemeioTips?.length > 0 && (
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.12)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb size={13} style={{ color: '#F97316' }} />
                      <p className="text-xs font-black" style={{ color: '#1C1917' }}>Conseils systeme.io</p>
                    </div>
                    <ul className="space-y-2">
                      {brief.systemeioTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'rgba(28,25,23,0.65)' }}>
                          <span className="text-orange-400 font-bold flex-shrink-0 mt-0.5">→</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Reset */}
                <button onClick={() => { setBrief(null); setBriefError(null) }}
                  className="w-full py-2.5 rounded-xl text-xs font-medium transition-all"
                  style={{ background: 'rgba(28,25,23,0.04)', color: 'rgba(28,25,23,0.45)', border: '1px solid rgba(28,25,23,0.08)' }}>
                  Regénérer le brief
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof Tag; label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={12} style={{ color: '#F97316' }} />
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(28,25,23,0.35)', fontSize: 10 }}>{label}</p>
      </div>
      <p className="text-xs font-medium leading-relaxed" style={{ color: '#1C1917' }}>{value}</p>
    </div>
  )
}
