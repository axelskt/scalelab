import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { scrapeFacebookAds, scrapeTikTokAds } from '@/lib/scraper'
import { calculateScore, ScrapedAd } from '@/lib/ads-db'
import { isSupabaseConfigured, upsertAd } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const authCheck = await requireAuth()
  if (authCheck.error) return authCheck.error

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

    // Sauvegarder dans Supabase si configuré, sinon fichier local
    if (isSupabaseConfigured()) {
      await Promise.all(scraped.map((ad) => upsertAd({
        id: ad.id,
        creator_name: ad.advertiser,
        creator_page_url: ad.advertiserPage,
        source: ad.source,
        country: ad.country || country,
        language: ad.language || 'fr',
        start_date: ad.startDate,
        run_days: ad.runDays,
        ad_text: ad.adText,
        thumbnail_url: ad.thumbnailUrl,
        video_url: ad.videoUrl,
        ad_url: ad.adUrl || '',
        niche: ad.niche || [],
        keywords: ad.keywords || [keyword],
        product_type: ad.analysis?.productType,
        price: ad.analysis?.price,
        detected_niche: ad.analysis?.niche,
        offer: ad.analysis?.offer,
        analysis: ad.analysis as unknown as Record<string, unknown>,
        score: ad.score,
        scraped_at: ad.scrapedAt,
      })))
    } else {
      const { addOrUpdateAd } = await import('@/lib/ads-db')
      scraped.forEach((ad) => addOrUpdateAd(ad))
    }

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
