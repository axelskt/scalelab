/**
 * Gemini TTS — Google AI Studio
 * Modèle : gemini-2.5-flash-preview-tts
 *
 * Voix disponibles (style cartoon/friendly recommandés) :
 * - Puck     → jeune, enthousiaste, cartoon-friendly ⭐
 * - Zephyr   → décontracté, moderne
 * - Kore     → voix féminine douce
 * - Charon   → grave, dramatique
 * - Fenrir   → dynamique, punchy
 * - Aoede    → chaleureux, storytelling
 * - Orus     → pro, sérieux
 * - Leda     → féminine, expressive
 *
 * Retourne un ArrayBuffer audio (WAV/PCM 24kHz 16-bit mono)
 */

import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY
const GEMINI_TTS_MODEL = 'gemini-2.5-flash-preview-tts'

// Styles vocaux mappés à des instructions naturelles pour le modèle
const VOICE_STYLES: Record<string, string> = {
  cartoon: 'Parle de façon très expressive, enthousiaste et cartoon-friendly, comme dans une animation jeunesse. Voix dynamique et fun.',
  friendly: 'Parle de façon chaleureuse, naturelle et amicale, comme si tu parlais à un ami. Ton conversationnel.',
  dramatic: 'Parle de façon dramatique et intense, avec des pauses bien placées pour créer de la tension.',
  professional: 'Parle de façon claire, professionnelle et assurée. Ton corporate mais engageant.',
  energetic: 'Parle de façon ultra-énergique et motivante, comme un coach sportif. Rythme rapide et dynamique.',
  storytelling: 'Raconte l\'histoire de façon captivante, avec des variations de rythme et d\'intonation pour maintenir l\'attention.',
}

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GOOGLE_AI_API_KEY manquant' }, { status: 500 })
  }

  try {
    const {
      text,
      voice = 'Puck',
      style = 'friendly',
      language = 'fr',
    }: {
      text: string
      voice?: string
      style?: string
      language?: string
    } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Texte vide' }, { status: 400 })
    }

    // Limiter à 5000 caractères max
    const truncatedText = text.slice(0, 5000)

    // Ajouter instruction de style au début si défini
    const styleInstruction = VOICE_STYLES[style] || VOICE_STYLES.friendly
    const langInstruction = language === 'fr'
      ? 'Parle en français avec une belle prosodie et intonation naturelle. '
      : 'Speak in English with natural prosody and intonation. '

    const fullPrompt = `${langInstruction}${styleInstruction}\n\n${truncatedText}`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_TTS_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: voice,
                },
              },
            },
          },
        }),
      }
    )

    if (!res.ok) {
      const errText = await res.text()
      console.error('[Gemini TTS] Error:', res.status, errText.slice(0, 300))
      return NextResponse.json(
        { error: `Gemini TTS ${res.status}: ${errText.slice(0, 200)}` },
        { status: res.status }
      )
    }

    const data = await res.json() as {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            inlineData?: { mimeType: string; data: string }
          }>
        }
      }>
      error?: { message: string }
    }

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 })
    }

    const audioPart = data.candidates?.[0]?.content?.parts?.[0]?.inlineData
    if (!audioPart?.data) {
      return NextResponse.json({ error: 'Pas de données audio dans la réponse' }, { status: 500 })
    }

    // Convertir base64 → ArrayBuffer et retourner en audio
    const audioBuffer = Buffer.from(audioPart.data, 'base64')

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': audioPart.mimeType || 'audio/wav',
        'Content-Length': String(audioBuffer.length),
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('[Gemini TTS] Exception:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur TTS' },
      { status: 500 }
    )
  }
}

// GET pour lister les voix disponibles
export async function GET() {
  return NextResponse.json({
    model: GEMINI_TTS_MODEL,
    voices: [
      { id: 'Puck',   label: 'Puck',   style: 'Cartoon / Enthousiaste', emoji: '🎭' },
      { id: 'Zephyr', label: 'Zephyr', style: 'Décontracté / Moderne',  emoji: '😎' },
      { id: 'Kore',   label: 'Kore',   style: 'Douce / Féminine',       emoji: '🌸' },
      { id: 'Charon', label: 'Charon', style: 'Grave / Dramatique',     emoji: '🎙️' },
      { id: 'Fenrir', label: 'Fenrir', style: 'Dynamique / Punchy',     emoji: '⚡' },
      { id: 'Aoede',  label: 'Aoede',  style: 'Chaleureux / Storytelling', emoji: '📖' },
      { id: 'Orus',   label: 'Orus',   style: 'Pro / Sérieux',          emoji: '💼' },
      { id: 'Leda',   label: 'Leda',   style: 'Expressive / Féminine',  emoji: '✨' },
    ],
    styles: Object.keys(VOICE_STYLES),
    configured: !!GEMINI_API_KEY,
  })
}
