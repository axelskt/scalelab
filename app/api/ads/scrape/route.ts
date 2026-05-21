import { NextRequest, NextResponse } from 'next/server'
import { scrapeFacebookAds, scrapeTikTokAds } from '@/lib/scraper'
import { addOrUpdateAd, calculateScore, ScrapedAd } from '@/lib/ads-db'

export async function POST(request: NextRequest) {
  try {
    const { keyword, source = 'facebook', country = 'FR', maxAds = 15 } = await request.json()

    if (!keyword) {
      return NextResponse.json({ error: 'keyword requis' }, { status: 400 })
    }

    let scraped: ScrapedAd[] = []

    if (source === 'facebook' || source === 'both') {
      const fbAds = await scrapeFacebookAds(keyword, country, maxAds)
      scraped.push(...fbAds)
    }

    if (source === 'tiktok' || source === 'both') {
      const ttAds = await scrapeTikTokAds(keyword, country, maxAds)
      scraped.push(...ttAds)
    }

    // Recalculer les scores
    scraped = scraped.map((ad) => ({ ...ad, score: calculateScore(ad) }))

    // Sauvegarder
    scraped.forEach((ad) => addOrUpdateAd(ad))

    return NextResponse.json({
      success: true,
      count: scraped.length,
      ads: scraped.sort((a, b) => b.score - a.score),
    })
  } catch (error) {
    console.error('Scrape error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur de scraping' },
      { status: 500 }
    )
  }
}
