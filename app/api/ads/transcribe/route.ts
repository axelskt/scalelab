import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { loadAds, saveAds, calculateScore, detectLanguage, estimateEngagement } from '@/lib/ads-db'
import { generateTranscriptionFromAdText } from '@/lib/transcription'

export const maxDuration = 120

export async function POST(request: NextRequest) {
  const authCheck = await requireAuth()
  if (authCheck.error) return authCheck.error

  try {
    const { adId } = await request.json()

    const ads = loadAds()
    const adIdx = ads.findIndex((a) => a.id === adId)
    if (adIdx < 0) return NextResponse.json({ error: 'Ad non trouvée' }, { status: 404 })

    const ad = ads[adIdx]

    // Détecter la langue si pas encore fait
    const language = ad.language || detectLanguage(ad.adText)

    // Estimer l'engagement si pas encore fait
    const engagement = ad.engagement || estimateEngagement(ad.runDays, ad.source)

    // Générer la transcription + score + version améliorée
    const transcription = await generateTranscriptionFromAdText(ad.adText, language)

    // Mettre à jour l'ad
    ads[adIdx] = {
      ...ad,
      language,
      engagement,
      transcription,
      score: calculateScore({ ...ad, language, engagement, transcription }),
    }
    saveAds(ads)

    return NextResponse.json({ success: true, ad: ads[adIdx] })
  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur de transcription' },
      { status: 500 }
    )
  }
}
