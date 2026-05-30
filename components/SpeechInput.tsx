'use client'
import { useState, useRef, useCallback, useEffect } from 'react'

interface SpeechInputProps {
  onTranscript: (text: string) => void
  lang?: string
  placeholder?: string
  className?: string
}

// Typage minimal pour la Web Speech API (non inclus dans @types/dom par défaut)
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}
interface SpeechRecognitionResultList {
  length: number
  [index: number]: SpeechRecognitionResult
}
interface SpeechRecognitionResult {
  isFinal: boolean
  [index: number]: SpeechRecognitionAlternative
}
interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  start(): void
  stop(): void
  onresult: ((ev: SpeechRecognitionEvent) => void) | null
  onerror: ((ev: Event) => void) | null
  onend: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance
  }
}

export default function SpeechInput({ onTranscript, lang = 'fr-FR', placeholder, className }: SpeechInputProps) {
  const [listening, setListening]   = useState(false)
  const [supported, setSupported]   = useState(true)
  const [interim, setInterim]       = useState('')
  const recognitionRef               = useRef<SpeechRecognitionInstance | null>(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) setSupported(false)
  }, [])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    setListening(false)
    setInterim('')
  }, [])

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    recognition.lang = lang
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (ev: SpeechRecognitionEvent) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = 0; i < ev.results.length; i++) {
        const result = ev.results[i]
        const text = result[0].transcript
        if (result.isFinal) {
          finalTranscript += text
        } else {
          interimTranscript += text
        }
      }

      setInterim(interimTranscript)
      if (finalTranscript) {
        onTranscript(finalTranscript.trim())
      }
    }

    recognition.onerror = () => stopListening()
    recognition.onend   = () => { setListening(false); setInterim('') }

    recognition.start()
    setListening(true)
  }, [lang, onTranscript, stopListening])

  const toggle = useCallback(() => {
    if (listening) stopListening()
    else startListening()
  }, [listening, startListening, stopListening])

  if (!supported) return null

  return (
    <div className={`inline-flex items-center gap-1.5 ${className || ''}`}>
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all"
        style={{
          background: listening
            ? 'rgba(239,68,68,0.12)'
            : 'rgba(249,115,22,0.08)',
          color: listening ? '#EF4444' : 'rgba(249,115,22,0.8)',
          border: `1px solid ${listening ? 'rgba(239,68,68,0.3)' : 'rgba(249,115,22,0.2)'}`,
        }}
        title={listening ? 'Arrêter la dictée' : 'Dicter avec le micro'}
      >
        {listening ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"/>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"/>
            </span>
            Écoute...
          </>
        ) : (
          <>
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zm-1 11V4a1 1 0 0 1 2 0v8a1 1 0 0 1-2 0zm6 0a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2z"/>
            </svg>
            {placeholder || 'Dicter'}
          </>
        )}
      </button>

      {/* Texte intermédiaire */}
      {interim && (
        <span
          className="text-xs italic max-w-[200px] truncate"
          style={{ color: 'rgba(249,115,22,0.6)' }}
          title={interim}
        >
          "{interim}"
        </span>
      )}
    </div>
  )
}
