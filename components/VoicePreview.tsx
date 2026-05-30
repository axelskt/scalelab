'use client'
import { useState, useRef, useCallback } from 'react'

interface VoicePreviewProps {
  text: string
  language?: string
  compact?: boolean // mode icône seule pour l'éditeur de scène
}

const VOICES = [
  { id: 'Puck',   label: 'Puck',   emoji: '🎭', style: 'cartoon',      desc: 'Cartoon / Fun' },
  { id: 'Fenrir', label: 'Fenrir', emoji: '⚡', style: 'energetic',    desc: 'Dynamique' },
  { id: 'Aoede',  label: 'Aoede',  emoji: '📖', style: 'storytelling', desc: 'Storytelling' },
  { id: 'Zephyr', label: 'Zephyr', emoji: '😎', style: 'friendly',     desc: 'Friendly' },
  { id: 'Kore',   label: 'Kore',   emoji: '🌸', style: 'friendly',     desc: 'Douce' },
  { id: 'Charon', label: 'Charon', emoji: '🎙️', style: 'dramatic',    desc: 'Dramatique' },
  { id: 'Orus',   label: 'Orus',   emoji: '💼', style: 'professional', desc: 'Pro' },
  { id: 'Leda',   label: 'Leda',   emoji: '✨', style: 'friendly',     desc: 'Expressive' },
]

export default function VoicePreview({ text, language = 'fr', compact = false }: VoicePreviewProps) {
  const [loading, setLoading]       = useState(false)
  const [playing, setPlaying]       = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [voice, setVoice]           = useState('Puck')
  const [showPicker, setShowPicker] = useState(false)
  const audioRef                     = useRef<HTMLAudioElement | null>(null)

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    setPlaying(false)
  }, [])

  const handlePlay = useCallback(async () => {
    if (playing) { stopAudio(); return }
    if (!text.trim()) return

    setLoading(true)
    setError(null)
    setShowPicker(false)

    try {
      const selectedVoice = VOICES.find(v => v.id === voice) || VOICES[0]
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: selectedVoice.id,
          style: selectedVoice.style,
          language,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Erreur TTS' }))
        throw new Error(err.error || `HTTP ${res.status}`)
      }

      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio

      audio.onended  = () => { setPlaying(false); URL.revokeObjectURL(url) }
      audio.onerror  = () => { setPlaying(false); setError('Erreur lecture audio') }

      await audio.play()
      setPlaying(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur TTS')
    } finally {
      setLoading(false)
    }
  }, [playing, stopAudio, text, voice, language])

  const currentVoice = VOICES.find(v => v.id === voice) || VOICES[0]

  if (compact) {
    return (
      <div className="relative inline-flex items-center gap-1">
        {/* Voice picker trigger */}
        <button
          onClick={() => setShowPicker(p => !p)}
          className="text-xs px-1.5 py-0.5 rounded transition-all"
          style={{
            background: 'rgba(249,115,22,0.08)',
            color: 'rgba(249,115,22,0.8)',
            border: '1px solid rgba(249,115,22,0.2)',
          }}
          title="Changer de voix"
        >
          {currentVoice.emoji}
        </button>

        {/* Play button */}
        <button
          onClick={handlePlay}
          disabled={loading || !text.trim()}
          className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium transition-all disabled:opacity-40"
          style={{
            background: playing ? 'rgba(239,68,68,0.1)' : 'rgba(249,115,22,0.1)',
            color: playing ? '#EF4444' : '#F97316',
            border: `1px solid ${playing ? 'rgba(239,68,68,0.3)' : 'rgba(249,115,22,0.3)'}`,
          }}
          title={playing ? 'Stop' : 'Écouter avec Gemini TTS'}
        >
          {loading ? (
            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : playing ? (
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
            </svg>
          ) : (
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
          {loading ? 'Génération...' : playing ? 'Stop' : 'Écouter'}
        </button>

        {/* Voice picker dropdown */}
        {showPicker && (
          <div
            className="absolute top-7 left-0 z-50 rounded-xl shadow-xl p-2 grid grid-cols-4 gap-1 min-w-[200px]"
            style={{ background: '#1C1917', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {VOICES.map(v => (
              <button
                key={v.id}
                onClick={() => { setVoice(v.id); setShowPicker(false) }}
                className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-all"
                style={{
                  background: voice === v.id ? 'rgba(249,115,22,0.15)' : 'transparent',
                  border: voice === v.id ? '1px solid rgba(249,115,22,0.4)' : '1px solid transparent',
                }}
                title={v.desc}
              >
                <span className="text-base">{v.emoji}</span>
                <span className="text-[9px] font-medium" style={{ color: voice === v.id ? '#F97316' : 'rgba(255,255,255,0.6)' }}>{v.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <span className="text-xs text-red-400 max-w-[150px] truncate" title={error}>⚠ {error}</span>
        )}
      </div>
    )
  }

  // Mode complet (page dédiée)
  return (
    <div className="space-y-3">
      {/* Voice grid */}
      <div className="grid grid-cols-4 gap-2">
        {VOICES.map(v => (
          <button
            key={v.id}
            onClick={() => setVoice(v.id)}
            className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
            style={{
              background: voice === v.id ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${voice === v.id ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <span className="text-xl">{v.emoji}</span>
            <span className="text-xs font-semibold text-white">{v.label}</span>
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{v.desc}</span>
          </button>
        ))}
      </div>

      {/* Play button */}
      <button
        onClick={handlePlay}
        disabled={loading || !text.trim()}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40"
        style={{
          background: playing ? 'rgba(239,68,68,0.15)' : 'rgba(249,115,22,0.15)',
          color: playing ? '#EF4444' : '#F97316',
          border: `1px solid ${playing ? 'rgba(239,68,68,0.3)' : 'rgba(249,115,22,0.3)'}`,
        }}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Génération voix IA...
          </>
        ) : playing ? (
          <>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
            </svg>
            Stop
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Écouter avec {currentVoice.emoji} {currentVoice.label}
          </>
        )}
      </button>

      {error && (
        <p className="text-xs text-red-400 text-center">⚠️ {error}</p>
      )}
    </div>
  )
}
