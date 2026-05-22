'use client'
import { useState } from 'react'
import { ScrapedAd, VSLScoreBreakdown, SupportedLanguage } from '@/lib/ads-db'

const LANG_FLAGS: Record<SupportedLanguage, string> = {
  fr: '🇫🇷', en: '🇬🇧', es: '🇪🇸', de: '🇩🇪', pt: '🇧🇷', it: '🇮🇹', unknown: '🌐'
}

const LANG_LABELS: Record<SupportedLanguage, string> = {
  fr: 'Français', en: 'English', es: 'Español', de: 'Deutsch', pt: 'Português', it: 'Italiano', unknown: 'Inconnu'
}

function ScoreCircle({ score, size = 64 }: { score: number; size?: number }) {
  const color = score >= 75 ? '#00D26A' : score >= 55 ? '#F5A623' : '#FF3B30'
  const radius = (size / 2) - 4
  const circumference = 2 * Math.PI * radius
  const dash = (score / 100) * circumference

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth="4" className="text-zinc-200" />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${dash} ${circumference - dash}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <div className="absolute text-center">
        <div className="text-sm font-black" style={{ color }}>{score}</div>
        <div className="text-zinc-400 text-xs leading-none" style={{ fontSize: 9 }}>/100</div>
      </div>
    </div>
  )
}

function ScoreDimension({ label, value, max = 10, color }: { label: string; value: number; max?: number; color: string }) {
  const pct = (value / max) * 100
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-500 w-28 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-zinc-100">
        <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold text-zinc-700 w-6 text-right">{value}</span>
    </div>
  )
}

function diffWords(original: string, improved: string): Array<{ text: string; type: 'same' | 'added' | 'removed' }> {
  // Simple sentence-level diff
  const origSentences = original.split(/(?<=[.!?])\s+/)
  const impSentences = improved.split(/(?<=[.!?])\s+/)

  const result: Array<{ text: string; type: 'same' | 'added' | 'removed' }> = []

  const maxLen = Math.max(origSentences.length, impSentences.length)
  for (let i = 0; i < maxLen; i++) {
    const o = origSentences[i]
    const n = impSentences[i]
    if (o && n) {
      if (o.trim() === n.trim()) {
        result.push({ text: n, type: 'same' })
      } else {
        result.push({ text: o, type: 'removed' })
        result.push({ text: n, type: 'added' })
      }
    } else if (o) {
      result.push({ text: o, type: 'removed' })
    } else if (n) {
      result.push({ text: n, type: 'added' })
    }
  }
  return result
}

interface Props {
  ad: ScrapedAd
  onTranscribe: () => void
  transcribing: boolean
}

export default function TranscriptionPanel({ ad, onTranscribe, transcribing }: Props) {
  const [tab, setTab] = useState<'score' | 'original' | 'improved' | 'diff'>('score')
  const t = ad.transcription

  if (!t) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎙</span>
          <div>
            <p className="text-sm font-bold text-zinc-900">Transcription vidéo</p>
            <p className="text-xs text-zinc-400">Note VSL · Script amélioré par Claude</p>
          </div>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100 font-semibold">
            Inclus
          </span>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Analyse le script, calcule la note VSL sur 5 dimensions et génère une version améliorée avec les corrections appliquées.
        </p>
        <button onClick={onTranscribe} disabled={transcribing}
          className="w-full py-2.5 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-700:bg-zinc-200 disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
          {transcribing ? (
            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>Analyse en cours (~30s)...</>
          ) : '🎙 Analyser & générer version améliorée'}
        </button>
      </div>
    )
  }

  const score = t.score
  const scoreColor = score.overall >= 75 ? '#00D26A' : score.overall >= 55 ? '#F5A623' : '#FF3B30'
  const diff = t.improvedVersion ? diffWords(t.raw, t.improvedVersion) : []

  return (
    <div className="space-y-3">
      {/* Header avec score global */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
        <ScoreCircle score={score.overall} size={60} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-zinc-900">Note VSL</span>
            <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: scoreColor + '20', color: scoreColor }}>
              {score.overall >= 75 ? 'Excellent' : score.overall >= 55 ? 'Bon' : 'À améliorer'}
            </span>
            <span className="ml-auto text-xs text-zinc-400 flex items-center gap-1">
              {LANG_FLAGS[t.language]} {LANG_LABELS[t.language]}
            </span>
          </div>
          {t.wordCount && (
            <p className="text-xs text-zinc-400">{t.wordCount} mots · ~{t.durationSeconds}s de vidéo</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-100 rounded-lg p-0.5">
        {[
          { key: 'score', label: '📊 Score' },
          { key: 'original', label: '📝 Original' },
          { key: 'improved', label: '✨ Amélioré' },
          { key: 'diff', label: '🔍 Diff' },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key as any)}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${tab === key ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700:text-zinc-300'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Score tab */}
      {tab === 'score' && (
        <div className="space-y-4">
          {/* Dimensions */}
          <div className="space-y-2.5">
            <ScoreDimension label="Hook (accroche)" value={score.hookStrength} color={score.hookStrength >= 7 ? '#00D26A' : score.hookStrength >= 5 ? '#F5A623' : '#FF3B30'} />
            <ScoreDimension label="Impact émotionnel" value={score.emotionalImpact} color={score.emotionalImpact >= 7 ? '#00D26A' : score.emotionalImpact >= 5 ? '#F5A623' : '#FF3B30'} />
            <ScoreDimension label="Structure (pattern)" value={score.patternClarity} color={score.patternClarity >= 7 ? '#00D26A' : score.patternClarity >= 5 ? '#F5A623' : '#FF3B30'} />
            <ScoreDimension label="CTA (appel action)" value={score.ctaStrength} color={score.ctaStrength >= 7 ? '#00D26A' : score.ctaStrength >= 5 ? '#F5A623' : '#FF3B30'} />
            <ScoreDimension label="Rythme / Pacing" value={score.pacing} color={score.pacing >= 7 ? '#00D26A' : score.pacing >= 5 ? '#F5A623' : '#FF3B30'} />
          </div>

          {/* Points forts */}
          {score.strengths.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-green-600 mb-1.5">✓ Points forts</p>
              <ul className="space-y-1">
                {score.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-600">
                    <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Faiblesses */}
          {score.weaknesses.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-500 mb-1.5">✗ À améliorer</p>
              <ul className="space-y-1">
                {score.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-600">
                    <span className="text-red-400 flex-shrink-0 mt-0.5">✗</span>{w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Original tab */}
      {tab === 'original' && (
        <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-4">
          <p className="text-xs text-zinc-700 leading-relaxed whitespace-pre-wrap">{t.raw}</p>
        </div>
      )}

      {/* Improved tab */}
      {tab === 'improved' && t.improvedVersion && (
        <div className="space-y-3">
          {t.improvements && t.improvements.length > 0 && (
            <div className="rounded-xl bg-green-50 border border-green-100 p-3">
              <p className="text-xs font-semibold text-green-700 mb-1.5">✨ Améliorations appliquées</p>
              <ul className="space-y-1">
                {t.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-green-700">
                    <span className="flex-shrink-0">→</span>{imp}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-4">
            <p className="text-xs text-zinc-700 leading-relaxed whitespace-pre-wrap">{t.improvedVersion}</p>
          </div>
          <button onClick={() => navigator.clipboard.writeText(t.improvedVersion!)}
            className="w-full py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-700:bg-zinc-200 transition-colors">
            📋 Copier le transcript amélioré
          </button>
        </div>
      )}

      {/* Diff tab */}
      {tab === 'diff' && (
        <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-4 space-y-1 max-h-96 overflow-y-auto">
          <div className="flex gap-3 mb-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Retiré</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Ajouté</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-zinc-300" /> Inchangé</span>
          </div>
          {diff.map((chunk, i) => (
            <span key={i} className={`text-xs leading-relaxed ${
              chunk.type === 'added' ? 'bg-green-100 text-green-800 rounded px-0.5' :
              chunk.type === 'removed' ? 'bg-red-100 text-red-700 line-through rounded px-0.5' :
              'text-zinc-600'
            }`}>
              {chunk.text}{' '}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
