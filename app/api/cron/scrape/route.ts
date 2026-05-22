/**
 * Cron endpoint — appelé par GitHub Actions toutes les heures
 * Scrape Facebook Ad Library + TikTok Creative Center
 * Stocke dans Supabase (si configuré) ou ads.json (fallback)
 *
 * Sécurisé par CRON_SECRET en header Authorization
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  scrapeFBAdLibraryFetch,
  scrapeTikTokAdsFetch,
  INFOPRENEUR_KEYWORDS_FR,
} from '@/lib/fb-fetch-scraper'
import { addOrUpdateAd, calculateScore } from '@/lib/ads-db'
import { isSupabaseConfigured, upsertAd, upsertCreator } from '@/lib/supabase'

export const maxDuration = 300 // 5 min max

// Mots-clés qu'on tourne à chaque run (on n'en fait pas tous d'un coup)
const KEYWORDS_PER_RUN = 4

function getKeywordsForRun(): string[] {
  // Rotate keywords based on hour of day so on 24h we couvrons tout
  const hour = new Date().getHours()
  const start = (hour * KEYWORDS_PER_RUN) % INFOPRENEUR_KEYWORDS_FR.length
  const keys: string[] = []
  for (let i = 0; i < KEYWORDS_PER_RUN; i++) {
    keys.push(INFOPRENEUR_KEYWORDS_FR[(start + i) % INFOPRENEUR_KEYWORDS_FR.length])
  }
  return keys
}

export async function POST(request: NextRequest) {
  // Vérification du secret
  const auth = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  const results = {
    facebook: 0,
    tiktok: 0,
    errors: [] as string[],
    keywords: [] as string[],
  }

  try {
    const keywords = getKeywordsForRun()
    results.keywords = keywords

    // ── Facebook ──────────────────────────────────────────────────────────
    for (const keyword of keywords) {
      try {
        const ads = await scrapeFBAdLibraryFetch(keyword, 'FR', 20)
        for (const ad of ads) {
          ad.score = calculateScore(ad)

          if (isSupabaseConfigured()) {
            await upsertAd({
              id: ad.id,
              creator_name: ad.advertiser,
              creator_page_url: ad.advertiserPage,
              source: ad.source,
              country: ad.country,
              language: ad.language,
              start_date: ad.startDate,
              run_days: ad.runDays,
              ad_text: ad.adText,
              thumbnail_url: ad.thumbnailUrl,
              video_url: ad.videoUrl,
              ad_url: ad.adUrl,
              niche: ad.niche,
              keywords: ad.keywords,
              product_type: ad.analysis?.productType,
              price: ad.analysis?.price,
              detected_niche: ad.analysis?.niche,
              offer: ad.analysis?.offer,
              analysis: ad.analysis as unknown as Record<string, unknown>,
              score: ad.score,
              scraped_at: ad.scrapedAt,
            })

            // Upsert creator
            if (ad.advertiser && ad.advertiserPage) {
              await upsertCreator({
                name: ad.advertiser,
                page_url: ad.advertiserPage,
                source: 'facebook',
                niche: ad.analysis?.niche || ad.niche[0] || 'Marketing digital',
                ads_count: 1,
                first_seen: ad.startDate,
                last_seen: new Date().toISOString().split('T')[0],
                thumbnail_url: ad.thumbnailUrl,
                is_active: true,
              })
            }
          } else {
            // Fallback file-based
            addOrUpdateAd(ad)
          }

          results.facebook++
        }
      } catch (err) {
        results.errors.push(`FB "${keyword}": ${err instanceof Error ? err.message : 'error'}`)
      }

      // Petit délai pour ne pas surcharger
      await new Promise(r => setTimeout(r, 1500))
    }

    // ── TikTok ────────────────────────────────────────────────────────────
    try {
      const ttAds = await scrapeTikTokAdsFetch('FR', 20)
      for (const ad of ttAds) {
        ad.score = calculateScore(ad)

        if (isSupabaseConfigured()) {
          await upsertAd({
            id: ad.id,
            creator_name: ad.advertiser,
            source: ad.source,
            country: ad.country,
            language: ad.language,
            start_date: ad.startDate,
            run_days: ad.runDays,
            ad_text: ad.adText,
            thumbnail_url: ad.thumbnailUrl,
            video_url: ad.videoUrl,
            ad_url: ad.adUrl,
            niche: ad.niche,
            keywords: ad.keywords,
            product_type: ad.analysis?.productType,
            price: ad.analysis?.price,
            detected_niche: ad.analysis?.niche,
            offer: ad.analysis?.offer,
            analysis: ad.analysis as unknown as Record<string, unknown>,
            score: ad.score,
            scraped_at: ad.scrapedAt,
          })
        } else {
          addOrUpdateAd(ad)
        }

        results.tiktok++
      }
    } catch (err) {
      results.errors.push(`TikTok: ${err instanceof Error ? err.message : 'error'}`)
    }

  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur scraping', results },
      { status: 500 }
    )
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1)

  return NextResponse.json({
    success: true,
    duration: `${duration}s`,
    storage: isSupabaseConfigured() ? 'supabase' : 'file',
    ...results,
  })
}

// GET pour test rapide depuis le navigateur (sans secret)
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Cron scrape endpoint — POST avec Authorization: Bearer CRON_SECRET',
    supabase: isSupabaseConfigured() ? 'configuré' : 'non configuré',
    keywords: INFOPRENEUR_KEYWORDS_FR,
  })
}
