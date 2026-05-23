'use client'
import { useState } from 'react'
import PatternSelector from '@/components/PatternSelector'
import BriefForm from '@/components/BriefForm'
import ScriptEditor from '@/components/ScriptEditor'
import { ProductBrief, VSLScript, VSLPattern } from '@/lib/types'

const DEFAULT_BRIEF: ProductBrief = {
  product: '',
  target: '',
  mainPain: '',
  solution: '',
  offer: '',
  price: '',
  guarantee: '',
  testimonials: [],
  format: '16:9',
  language: 'fr',
  pattern: 'PAS',
  durationSeconds: 90,
}

type Step = 'brief' | 'script' | 'render'

export default function VSLPro() {
  const [brief, setBrief] = useState<ProductBrief>(DEFAULT_BRIEF)
  const [script, setScript] = useState<VSLScript | null>(null)
  const [loading, setLoading] = useState(false)
  const [renderLoading, setRenderLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [renderOutput, setRenderOutput] = useState<string | null>(null)
  const [step, setStep] = useState<Step>('brief')
  const [template, setTemplate] = useState<'premium' | 'editorial' | 'dynamic' | 'vertical'>('premium')

  const handlePatternChange = (pattern: VSLPattern) => {
    setBrief((b) => ({ ...b, pattern }))
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brief),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur inconnue')
      setScript(data.script)
      setStep('script')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de génération')
    } finally {
      setLoading(false)
    }
  }

  const handleRender = async () => {
    if (!script) return
    setRenderLoading(true)
    setRenderOutput(null)
    setError(null)
    setStep('render')
    try {
      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, template }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur de rendu')
      setRenderOutput(data.output)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de rendu')
      setStep('script')
    } finally {
      setRenderLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FFFBF7', color: '#1C1917' }}>
      {/* Top bar */}
      <header className="h-12 flex items-center px-6 gap-4 flex-shrink-0"
        style={{ background: 'white', borderBottom: '1px solid rgba(28,25,23,0.08)' }}>
        <div className="flex items-center gap-2">
          <span className="font-black text-sm tracking-tight" style={{ color: '#1C1917' }}>VSL Generator</span>
        </div>

        <div className="flex items-center gap-1 ml-4 rounded-lg p-0.5" style={{ background: 'rgba(28,25,23,0.06)' }}>
          {[
            { key: 'brief', label: '1. Brief & Pattern' },
            { key: 'script', label: '2. Script' },
            { key: 'render', label: '3. Rendu' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => (key !== 'script' || script) && setStep(key as Step)}
              disabled={key === 'script' && !script}
              className="px-3 py-1 rounded-md text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: step === key ? 'white' : 'transparent',
                color: step === key ? '#1C1917' : 'rgba(28,25,23,0.45)',
                boxShadow: step === key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Template selector */}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-xs mr-1" style={{ color: 'rgba(28,25,23,0.4)' }}>Style :</span>
          {([
            { key: 'premium',   label: 'Premium Dark' },
            { key: 'vertical',  label: 'Vertical 9:16' },
            { key: 'editorial', label: 'Éditorial' },
            { key: 'dynamic',   label: 'Dynamique' },
          ] as const).map(t => (
            <button key={t.key}
              onClick={() => setTemplate(t.key)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all"
              style={template === t.key
                ? { background: '#F97316', color: 'white', boxShadow: '0 2px 8px rgba(249,115,22,0.3)' }
                : { background: 'rgba(28,25,23,0.06)', color: 'rgba(28,25,23,0.5)' }}>
              {t.label}
            </button>
          ))}
        </div>

        {script && (
          <div className="flex items-center gap-2 text-xs ml-4" style={{ color: 'rgba(28,25,23,0.4)' }}>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {script.scenes.length} scènes · {script.meta.pattern}
          </div>
        )}
      </header>

      {/* Error banner */}
      {error && (
        <div className="mx-6 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto hover:text-red-300">✕</button>
        </div>
      )}

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {step === 'brief' && (
          <>
            <div className="w-72 flex-shrink-0 overflow-y-auto p-4"
              style={{ borderRight: '1px solid rgba(28,25,23,0.08)', background: 'white' }}>
              <PatternSelector selected={brief.pattern} onChange={handlePatternChange} />
            </div>
            <div className="flex-1 overflow-y-auto p-6 max-w-2xl">
              <div className="mb-6">
                <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Nouveau VSL</h1>
                <p className="text-sm mt-1" style={{ color: 'rgba(28,25,23,0.5)' }}>
                  Remplis le brief de ton produit, sélectionne un pattern et génère ton script avec l'IA.
                </p>
              </div>
              <BriefForm brief={brief} onChange={setBrief} onGenerate={handleGenerate} loading={loading} />
            </div>
          </>
        )}

        {step === 'script' && script && (
          <div className="flex-1 overflow-hidden p-6">
            <ScriptEditor script={script} onChange={setScript} onRender={handleRender} renderLoading={renderLoading} />
          </div>
        )}

        {step === 'render' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md">
              {renderLoading ? (
                <>
                  <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                    <svg className="animate-spin h-7 w-7" style={{ color: '#F97316' }} viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: '#1C1917' }}>Rendu en cours...</h2>
                  <p className="text-sm" style={{ color: 'rgba(28,25,23,0.5)' }}>
                    Remotion génère ta vidéo frame par frame.<br />1-3 minutes selon la durée.
                  </p>
                </>
              ) : renderOutput ? (
                <>
                  <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl"
                    style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                    🎬
                  </div>
                  <h2 className="text-2xl font-bold" style={{ color: '#16A34A' }}>Vidéo générée !</h2>
                  <div className="rounded-xl p-4 text-left"
                    style={{ background: 'white', border: '1px solid rgba(28,25,23,0.1)' }}>
                    <p className="text-xs mb-1" style={{ color: 'rgba(28,25,23,0.4)' }}>Fichier de sortie :</p>
                    <p className="text-sm font-mono" style={{ color: '#F97316' }}>~/Downloads/remotion-demo/{renderOutput}</p>
                  </div>
                  <div className="flex gap-3 justify-center pt-2">
                    <button
                      onClick={() => { setStep('brief'); setScript(null); setRenderOutput(null) }}
                      className="px-4 py-2 rounded-lg text-sm transition-colors"
                      style={{ border: '1px solid rgba(28,25,23,0.12)', color: 'rgba(28,25,23,0.6)', background: 'white' }}
                    >
                      ← Nouveau VSL
                    </button>
                    <button
                      onClick={() => setStep('script')}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{ background: 'rgba(28,25,23,0.06)', color: '#1C1917' }}
                    >
                      Modifier le script
                    </button>
                    <button
                      onClick={handleRender}
                      className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      style={{ background: '#F97316', color: 'white', boxShadow: '0 2px 8px rgba(249,115,22,0.3)' }}
                    >
                      ▶ Re-rendre
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Bottom status bar */}
      <div className="h-7 flex items-center px-6 gap-6 text-xs flex-shrink-0"
        style={{ borderTop: '1px solid rgba(28,25,23,0.08)', color: 'rgba(28,25,23,0.4)', background: 'white' }}>
        <span>Pattern: <span style={{ color: '#1C1917', fontWeight: 600 }}>{brief.pattern}</span></span>
        <span>Format: <span style={{ color: '#1C1917', fontWeight: 600 }}>{brief.format}</span></span>
        <span>Langue: <span style={{ color: '#1C1917', fontWeight: 600 }}>{brief.language === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}</span></span>
        <span>Durée: <span style={{ color: '#1C1917', fontWeight: 600 }}>{brief.durationSeconds}s</span></span>
        {script && <span>Scènes: <span style={{ color: '#F97316', fontWeight: 700 }}>{script.scenes.length}</span></span>}
        <span className="ml-auto" style={{ color: 'rgba(28,25,23,0.3)' }}>
          {brief.format === '9:16' ? '1080×1920' : brief.format === '1:1' ? '1080×1080' : '1920×1080'} · 30fps
        </span>
      </div>
    </div>
  )
}
