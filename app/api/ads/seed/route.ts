/**
 * POST /api/ads/seed
 * Insère les seed ads dans Supabase si la table est vide
 * Protégé par CRON_SECRET
 */
import { NextRequest, NextResponse } from 'next/server'
import { SEED_ADS } from '@/lib/ad-analyzer'
import { calculateScore } from '@/lib/ads-db'
import { isSupabaseConfigured, getSupabase, upsertAd, upsertCreator } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  // Vérifier si déjà des ads
  const { data: existing } = await getSupabase().from('ads').select('id').limit(1)
  if (existing && existing.length > 0) {
    return NextResponse.json({ message: 'Already seeded', count: 0 })
  }

  let count = 0
  for (const ad of SEED_ADS) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const score = calculateScore(ad as any)

    // Upsert l'ad
    await upsertAd({
      id: ad.id,
      creator_name: ad.advertiser,
      creator_page_url: ad.advertiserPage,
      source: ad.source as 'facebook' | 'tiktok',
      country: ad.country || 'FR',
      language: ad.language || 'fr',
      start_date: ad.startDate,
      run_days: ad.runDays,
      ad_text: ad.adText,
      thumbnail_url: ad.thumbnailUrl,
      ad_url: ad.adUrl,
      niche: ad.niche || [],
      keywords: ad.keywords || [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      product_type: (ad.analysis as any)?.productType,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      price: (ad.analysis as any)?.price,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      detected_niche: (ad.analysis as any)?.niche,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      offer: (ad.analysis as any)?.offer,
      analysis: ad.analysis as unknown as Record<string, unknown>,
      score,
      scraped_at: ad.scrapedAt,
    })

    // Upsert le créateur correspondant
    await upsertCreator({
      name: ad.advertiser,
      page_url: ad.advertiserPage || `https://facebook.com/${ad.advertiser.replace(/\s/g, '')}`,
      source: ad.source as 'facebook' | 'tiktok',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      niche: (ad.analysis as any)?.niche || ad.niche?.[0] || 'Marketing digital',
      ads_count: 1,
      first_seen: ad.startDate,
      last_seen: ad.scrapedAt.split('T')[0],
      is_active: true,
    })

    count++
  }

  return NextResponse.json({ success: true, seeded: count })
}
