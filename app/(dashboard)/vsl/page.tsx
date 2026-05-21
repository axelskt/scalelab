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
        body: JSON.stringify({ script }),
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
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Top bar */}
      <header className="h-12 border-b border-zinc-900 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-violet-400 font-bold text-sm tracking-tight">VSL PRO</span>
          <span className="text-zinc-700 text-xs">by Axel</span>
        </div>

        <a href="/inspire"
          className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-400 text-xs font-medium hover:border-amber-500/60 hover:bg-amber-500/10 transition-colors ml-2">
          <span>⚡</span> Inspire
        </a>

        <div className="flex items-center gap-1 ml-6">
          {[
            { key: 'brief', label: '1. Brief & Pattern' },
            { key: 'script', label: '2. Script' },
            { key: 'render', label: '3. Rendu' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => (key !== 'script' || script) && setStep(key as Step)}
              disabled={key === 'script' && !script}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                step === key
                  ? 'bg-violet-600 text-white'
                  : 'text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {script && (
          <div className="ml-auto flex items-center gap-2 text-xs text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Script prêt · {script.scenes.length} scènes · {script.meta.pattern}
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
            <div className="w-72 flex-shrink-0 border-r border-zinc-900 overflow-y-auto p-4">
              <PatternSelector selected={brief.pattern} onChange={handlePatternChange} />
            </div>
            <div className="flex-1 overflow-y-auto p-6 max-w-2xl">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Nouveau VSL</h1>
                <p className="text-zinc-500 text-sm mt-1">
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
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                    <svg className="animate-spin h-7 w-7 text-amber-500" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold">Rendu en cours...</h2>
                  <p className="text-zinc-500 text-sm">
                    Remotion génère ta vidéo frame par frame.<br />1-3 minutes selon la durée.
                  </p>
                </>
              ) : renderOutput ? (
                <>
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-3xl">
                    🎬
                  </div>
                  <h2 className="text-2xl font-bold text-green-400">Vidéo générée !</h2>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-left">
                    <p className="text-xs text-zinc-500 mb-1">Fichier de sortie :</p>
                    <p className="text-sm font-mono text-amber-400">~/Downloads/remotion-demo/{renderOutput}</p>
                  </div>
                  <div className="flex gap-3 justify-center pt-2">
                    <button
                      onClick={() => { setStep('brief'); setScript(null); setRenderOutput(null) }}
                      className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
                    >
                      ← Nouveau VSL
                    </button>
                    <button
                      onClick={() => setStep('script')}
                      className="px-4 py-2 rounded-lg bg-zinc-800 text-white text-sm font-medium hover:bg-zinc-700 transition-colors"
                    >
                      Modifier le script
                    </button>
                    <button
                      onClick={handleRender}
                      className="px-4 py-2 rounded-lg bg-amber-500 text-black text-sm font-semibold hover:bg-amber-400 transition-colors"
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
      <div className="h-7 border-t border-zinc-900 flex items-center px-6 gap-6 text-xs text-zinc-600 flex-shrink-0">
        <span>Pattern: <span className="text-zinc-400">{brief.pattern}</span></span>
        <span>Format: <span className="text-zinc-400">{brief.format}</span></span>
        <span>Langue: <span className="text-zinc-400">{brief.language === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}</span></span>
        <span>Durée: <span className="text-zinc-400">{brief.durationSeconds}s</span></span>
        {script && <span>Scènes: <span className="text-zinc-400">{script.scenes.length}</span></span>}
        <span className="ml-auto text-zinc-700">
          {brief.format === '9:16' ? '1080×1920' : brief.format === '1:1' ? '1080×1080' : '1920×1080'} · 30fps
        </span>
      </div>
    </div>
  )
}
