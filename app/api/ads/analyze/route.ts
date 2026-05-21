import { NextRequest, NextResponse } from 'next/server'
import { analyzeAd } from '@/lib/ad-analyzer'
import { loadAds, saveAds, calculateScore } from '@/lib/ads-db'

export async function POST(request: NextRequest) {
  try {
    const { adId } = await request.json()

    const ads = loadAds()
    const adIdx = ads.findIndex((a) => a.id === adId)

    if (adIdx < 0) {
      return NextResponse.json({ error: 'Ad non trouvée' }, { status: 404 })
    }

    const ad = ads[adIdx]
    const analysis = await analyzeAd(ad)

    // Mettre à jour l'ad avec l'analyse
    ads[adIdx] = { ...ad, analysis, score: calculateScore({ ...ad, analysis }) }
    saveAds(ads)

    return NextResponse.json({ success: true, analysis, ad: ads[adIdx] })
  } catch (error) {
    console.error('Analyze error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur d\'analyse' },
      { status: 500 }
    )
  }
}
