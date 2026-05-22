import { NextResponse } from 'next/server'
import { loadAds, calculateScore } from '@/lib/ads-db'
import { SEED_ADS } from '@/lib/ad-analyzer'
import { isSupabaseConfigured, getAds } from '@/lib/supabase'

export async function GET() {
  // Priorité 1 : Supabase (source de vérité)
  if (isSupabaseConfigured()) {
    try {
      const dbAds = await getAds(500)
      if (dbAds.length > 0) {
        // Mapper les colonnes DB → format ScrapedAd
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ads = dbAds.map((row: any) => ({
          id: row.id,
          source: row.source,
          advertiser: row.creator_name,
          advertiserPage: row.creator_page_url,
          language: row.language || 'fr',
          country: row.country || 'FR',
          startDate: row.start_date,
          runDays: row.run_days,
          adText: row.ad_text,
          thumbnailUrl: row.thumbnail_url,
          videoUrl: row.video_url,
          adUrl: row.ad_url,
          niche: row.niche || [],
          keywords: row.keywords || [],
          scrapedAt: row.scraped_at,
          score: row.score || 0,
          analysis: row.analysis ? {
            ...row.analysis,
            productType: row.product_type || row.analysis?.productType,
            price: row.price || row.analysis?.price,
            niche: row.detected_niche || row.analysis?.niche,
            offer: row.offer || row.analysis?.offer,
          } : undefined,
        }))
        ads.sort((a: { score: number }, b: { score: number }) => b.score - a.score)
        return NextResponse.json({ ads, total: ads.length, source: 'supabase' })
      }
    } catch (err) {
      console.error('Supabase read error, falling back to local:', err)
    }
  }

  // Fallback : fichier local + seed data
  let ads = loadAds()
  if (ads.length === 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ads = SEED_ADS.map((ad) => ({ ...ad, score: calculateScore(ad as any) })) as any
  }
  ads.sort((a, b) => b.score - a.score)
  return NextResponse.json({ ads, total: ads.length, source: 'local' })
}
