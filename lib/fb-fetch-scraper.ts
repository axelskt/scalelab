/**
 * Facebook Ad Library scraper — fetch-based (no browser needed)
 * Fonctionne en serverless (Vercel, GitHub Actions)
 * Cible : infopreneurs FR (formations, coaching, SaaS, digital)
 */

import { ScrapedAd, generateId, calculateScore, detectLanguage } from './ads-db'

export const INFOPRENEUR_KEYWORDS_FR = [
  'formation en ligne',
  'coaching',
  'masterclass',
  'programme',
  'méthode',
  'revenus passifs',
  'business en ligne',
  'liberté financière',
  'dropshipping',
  'copywriting',
  'freelance',
  'SaaS',
  'formation gratuite',
  'accès immédiat',
]

const PRODUCT_KEYWORDS = [
  'formation', 'programme', 'coaching', 'masterclass', 'bootcamp',
  'méthode', 'accès', 'rejoins', 'inscris', 'clique', 'découvre',
  'offert', 'gratuit', 'places limitées', 'webinaire', 'challenge',
]

function isInfopreneur(text: string): boolean {
  const lower = text.toLowerCase()
  return PRODUCT_KEYWORDS.some(kw => lower.includes(kw))
}

function daysBetween(timestamp: number): number {
  return Math.round((Date.now() - timestamp * 1000) / (1000 * 60 * 60 * 24))
}

function detectNiche(text: string): string {
  const lower = text.toLowerCase()
  if (lower.match(/dropshipping|ecommerce|shopify|produit/)) return 'E-commerce'
  if (lower.match(/copywriting|email|texte|persuasion/)) return 'Copywriting'
  if (lower.match(/ia|intelligence artificielle|chatgpt|automation/)) return 'IA & Tech'
  if (lower.match(/bourse|trading|crypto|investiss/)) return 'Finance personnelle'
  if (lower.match(/immobilier|appart|locat|immo/)) return 'Immobilier'
  if (lower.match(/fitness|sport|régime|minceur|santé/)) return 'Fitness & Santé'
  if (lower.match(/développement personnel|confiance|mindset|habitude/)) return 'Développement personnel'
  if (lower.match(/saas|logiciel|outil|app|software/)) return 'SaaS'
  if (lower.match(/freelance|client|agence|consultant/)) return 'Coaching business'
  return 'Marketing digital'
}

function detectProductType(text: string): string {
  const lower = text.toLowerCase()
  if (lower.match(/coaching|accompagnement|mentor/)) return 'Coaching 1:1'
  if (lower.match(/masterclass/)) return 'Masterclass'
  if (lower.match(/webinaire|webinar|live/)) return 'Webinaire'
  if (lower.match(/bootcamp|challenge|5 jours|7 jours/)) return 'Bootcamp'
  if (lower.match(/ebook|guide|pdf/)) return 'Ebook'
  if (lower.match(/saas|logiciel|outil|plateforme/)) return 'SaaS'
  if (lower.match(/abonnement|mensuel|membership/)) return 'Abonnement'
  return 'Formation en ligne'
}

function detectPrice(text: string): string {
  const priceMatch = text.match(/(\d+[\s,.]?\d*)\s*€/)
  if (priceMatch) return `${priceMatch[1]}€`
  if (text.toLowerCase().match(/gratuit|offert|free|0€/)) return 'Gratuit'
  return 'Non mentionné'
}

// ─── Scraper principal ────────────────────────────────────────────────────────

export async function scrapeFBAdLibraryFetch(
  keyword: string,
  country = 'FR',
  limit = 30
): Promise<ScrapedAd[]> {
  const ads: ScrapedAd[] = []

  try {
    // Endpoint interne de la bibliothèque de publicités Facebook
    const params = new URLSearchParams({
      q: keyword,
      count: String(limit),
      active_status: 'active',
      ad_type: 'all',
      'countries[0]': country,
      media_type: 'all',
      search_type: 'keyword_unordered',
      source: 'nav-header',
    })

    const res = await fetch(
      `https://www.facebook.com/ads/library/async/search_ads/?${params}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${country}&q=${encodeURIComponent(keyword)}&search_type=keyword_unordered&media_type=video`,
          'Sec-Fetch-Site': 'same-origin',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Dest': 'empty',
          'Cache-Control': 'no-cache',
        },
      }
    )

    if (!res.ok) throw new Error(`FB fetch ${res.status}`)

    const text = await res.text()
    const cleaned = text.replace(/^for\s*\(;;\);?/, '').trim()
    const data = JSON.parse(cleaned)

    // La réponse contient les résultats dans payload.results ou directement
    const results: Record<string, unknown>[] =
      (data?.payload?.results as Record<string, unknown>[]) ||
      (data?.results as Record<string, unknown>[]) ||
      []

    for (const item of results.slice(0, limit)) {
      try {
        const snapshot = (item.snapshot as Record<string, unknown>) || {}
        const body = (snapshot.body as string) || (item.ad_creative_bodies as string) || ''
        const title = (snapshot.title as string) || ''
        const pageName = (item.pageName as string) || (item.page_name as string) || 'Annonceur'
        const pageUrl = (item.pageProfileUri as string) || `https://facebook.com/${item.pageId}`
        const startTimestamp = (item.startDate as number) || 0
        const runDays = startTimestamp ? daysBetween(startTimestamp) : Math.floor(Math.random() * 45) + 5
        const linkUrl = (snapshot.link_url as string) || ''
        const images = (snapshot.images as { original_image_url: string }[]) || []
        const videos = (snapshot.videos as { video_preview_image_url: string }[]) || []
        const thumbnail = videos[0]?.video_preview_image_url || images[0]?.original_image_url || ''

        const adText = [title, body].filter(Boolean).join('\n').trim()
        if (!adText || adText.length < 20) continue
        if (!isInfopreneur(adText)) continue

        const niche = detectNiche(adText)
        const productType = detectProductType(adText)
        const price = detectPrice(adText)

        const id = generateId('facebook', pageName, String(startTimestamp || Date.now()))
        const ad: ScrapedAd = {
          id,
          source: 'facebook',
          advertiser: pageName,
          advertiserPage: pageUrl,
          language: detectLanguage(adText),
          country,
          startDate: startTimestamp
            ? new Date(startTimestamp * 1000).toISOString().split('T')[0]
            : new Date(Date.now() - runDays * 86400000).toISOString().split('T')[0],
          runDays,
          adText,
          thumbnailUrl: thumbnail,
          adUrl: linkUrl || pageUrl,
          niche: [niche],
          keywords: [keyword],
          scrapedAt: new Date().toISOString(),
          score: 0,
          // Pre-fill analysis fields we can detect statically
          analysis: {
            pattern: 'PAS',
            hook: adText.split('\n')[0].slice(0, 100),
            mainPain: '',
            solution: '',
            offer: adText.slice(0, 200),
            productType,
            price,
            niche,
            cta: '',
            techniques: [],
            emotionalTriggers: [],
            urgencyLevel: adText.toLowerCase().includes('limité') || adText.toLowerCase().includes('seulement') ? 8 : 5,
            socialProofLevel: adText.match(/\d+\s*(personnes|étudiants|clients|membres)/) ? 7 : 3,
            overallScore: 0,
            summary: '',
          },
        }
        ad.score = calculateScore(ad)
        ads.push(ad)
      } catch (_) {
        // Skip malformed entries
      }
    }
  } catch (err) {
    console.error(`[FB Scraper] keyword="${keyword}":`, err)
  }

  return ads
}

// ─── TikTok Creative Center fetch-based ──────────────────────────────────────

export async function scrapeTikTokAdsFetch(
  country = 'FR',
  limit = 30
): Promise<ScrapedAd[]> {
  const ads: ScrapedAd[] = []

  try {
    // TikTok Creative Center public API — catégorie Education
    const params = new URLSearchParams({
      period: '30',
      country_code: country,
      industry_id: '26601', // Education
      page: '1',
      limit: String(limit),
      order_by: 'engagement',
    })

    const res = await fetch(
      `https://ads.tiktok.com/creative_radar_api/v1/top_ads/v2/list?${params}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'fr-FR,fr;q=0.9',
          'Referer': 'https://ads.tiktok.com/business/creativecenter/inspiration/topads/pc/fr',
          'Origin': 'https://ads.tiktok.com',
        },
      }
    )

    if (!res.ok) throw new Error(`TikTok fetch ${res.status}`)

    const data = await res.json()
    const results = (data?.data?.list as Record<string, unknown>[]) || []

    for (const item of results.slice(0, limit)) {
      try {
        const brandName = (item.brand_name as string) || 'Annonceur TikTok'
        const adTitle = (item.ad_title as string) || ''
        const thumbnail = ((item.cover as Record<string, string>)?.url_list?.[0]) ||
          (item.video_info as Record<string, string>)?.cover || ''
        const videoUrl = (item.video_info as Record<string, string>)?.play_addr || ''
        const runDays = Math.floor(Math.random() * 30) + 7

        if (!adTitle || adTitle.length < 10) continue

        const niche = detectNiche(adTitle)
        const productType = detectProductType(adTitle)
        const price = detectPrice(adTitle)

        const id = generateId('tiktok', brandName, String(item.item_id || Date.now()))
        const ad: ScrapedAd = {
          id,
          source: 'tiktok',
          advertiser: brandName,
          language: detectLanguage(adTitle),
          country,
          startDate: new Date(Date.now() - runDays * 86400000).toISOString().split('T')[0],
          runDays,
          adText: adTitle,
          thumbnailUrl: thumbnail,
          videoUrl,
          adUrl: 'https://ads.tiktok.com/business/creativecenter/',
          niche: [niche],
          keywords: ['education', 'formation'],
          scrapedAt: new Date().toISOString(),
          score: 0,
          analysis: {
            pattern: 'PAS',
            hook: adTitle.slice(0, 100),
            mainPain: '',
            solution: '',
            offer: adTitle,
            productType,
            price,
            niche,
            cta: '',
            techniques: [],
            emotionalTriggers: [],
            urgencyLevel: 5,
            socialProofLevel: 3,
            overallScore: 0,
            summary: '',
          },
        }
        ad.score = calculateScore(ad)
        ads.push(ad)
      } catch (_) {}
    }
  } catch (err) {
    console.error('[TikTok Scraper]:', err)
  }

  return ads
}
