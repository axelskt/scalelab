import { NextResponse } from 'next/server'
import { loadAds, saveAds, calculateScore } from '@/lib/ads-db'
import { SEED_ADS } from '@/lib/ad-analyzer'

export async function GET() {
  let ads = loadAds()

  // Si vide, seed avec les exemples pré-construits
  if (ads.length === 0) {
    const seeded = SEED_ADS.map((ad) => ({ ...ad, score: calculateScore(ad as any) }))
    saveAds(seeded as any)
    ads = seeded as any
  }

  // Trier par score décroissant
  ads.sort((a, b) => b.score - a.score)

  return NextResponse.json({ ads, total: ads.length })
}
