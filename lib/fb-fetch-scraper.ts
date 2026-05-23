/**
 * Facebook Ad Library — Meta Graph API officielle (v19)
 * Endpoint : https://graph.facebook.com/v19.0/ads_archive
 * Nécessite META_ACCESS_TOKEN (User Token avec ads_read)
 *
 * Comment obtenir le token :
 * 1. Va sur https://developers.facebook.com/tools/explorer
 * 2. Sélectionne ton app (ou "Graph API Explorer")
 * 3. Ajoute la permission "ads_read"
 * 4. Clique "Generate Access Token"
 * 5. Copie le token → Vercel env var META_ACCESS_TOKEN
 *
 * Fonctionne en serverless (Vercel, GitHub Actions) — pas de browser
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

// ─── Meta Ads Library API officielle (Graph API v19) ─────────────────────────
// Requiert META_ACCESS_TOKEN dans les env vars

const META_API_VERSION = 'v19.0'
const META_FIELDS = [
  'id',
  'page_name',
  'page_id',
  'ad_snapshot_url',
  'ad_creative_bodies',
  'ad_creative_link_captions',
  'ad_creative_link_titles',
  'ad_delivery_start_time',
  'ad_delivery_stop_time',
  'impressions',
  'spend',
  'currency',
  'publisher_platforms',
  'languages',
  'video_hd_url',
  'video_sd_url',
].join(',')

export async function scrapeFBAdLibraryFetch(
  keyword: string,
  country = 'FR',
  limit = 30
): Promise<ScrapedAd[]> {
  const accessToken = process.env.META_ACCESS_TOKEN
  if (!accessToken) {
    console.warn('[FB Meta API] META_ACCESS_TOKEN manquant — scraping désactivé')
    return []
  }

  const ads: ScrapedAd[] = []

  try {
    const params = new URLSearchParams({
      access_token: accessToken,
      search_terms: keyword,
      ad_reached_countries: JSON.stringify([country]),
      ad_active_status: 'ACTIVE',
      ad_type: 'ALL',
      fields: META_FIELDS,
      limit: String(Math.min(limit, 50)),
    })

    const url = `https://graph.facebook.com/${META_API_VERSION}/ads_archive?${params}`
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Meta API ${res.status}: ${errText.slice(0, 200)}`)
    }

    const data = await res.json() as {
      data?: Record<string, unknown>[]
      error?: { message: string }
    }

    if (data.error) throw new Error(`Meta API error: ${data.error.message}`)

    const results = data.data || []

    for (const item of results.slice(0, limit)) {
      try {
        const bodies = (item.ad_creative_bodies as string[]) || []
        const titles = (item.ad_creative_link_titles as string[]) || []
        const captions = (item.ad_creative_link_captions as string[]) || []
        const pageName = (item.page_name as string) || 'Annonceur'
        const pageId = item.page_id as string
        const pageUrl = pageId ? `https://facebook.com/${pageId}` : ''
        const snapshotUrl = (item.ad_snapshot_url as string) || ''
        const videoUrl = (item.video_hd_url as string) || (item.video_sd_url as string) || ''
        const startDateRaw = (item.ad_delivery_start_time as string) || ''
        const startDate = startDateRaw ? startDateRaw.split('T')[0] : new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
        const runDays = startDate ? Math.round((Date.now() - new Date(startDate).getTime()) / 86400000) : 30

        // Construire le texte de la pub
        // Note : en Europe (RGPD), ad_creative_bodies est souvent vide
        // On garde quand même l'ad si le keyword lui-même est infopreneur
        const adText = [...bodies, ...titles, ...captions].filter(Boolean).join('\n').trim()

        // Si pas de texte, utiliser le keyword comme fallback (l'ad a été trouvée via ce keyword)
        const effectiveText = adText.length >= 10 ? adText : `${keyword} formation coaching programme`

        // Filtrer : soit le texte contient des mots infopreneurs, soit on fait confiance au keyword
        const INFOPRENEUR_KEYWORDS_SEARCH = [
          'formation', 'coaching', 'masterclass', 'programme', 'méthode',
          'revenus passifs', 'business en ligne', 'liberté financière',
          'dropshipping', 'copywriting', 'freelance', 'saas', 'formation gratuite',
        ]
        const keywordIsInfopreneur = INFOPRENEUR_KEYWORDS_SEARCH.some(kw =>
          keyword.toLowerCase().includes(kw)
        )
        if (!keywordIsInfopreneur && !isInfopreneur(effectiveText)) continue

        const niche = detectNiche(effectiveText)
        const productType = detectProductType(effectiveText)
        const price = detectPrice(effectiveText)
        const lang = adText.length >= 10 ? detectLanguage(adText) : 'fr'

        const id = generateId('facebook', pageName, startDate || Date.now().toString())

        const ad: ScrapedAd = {
          id,
          source: 'facebook',
          advertiser: pageName,
          advertiserPage: pageUrl,
          language: lang,
          country,
          startDate,
          runDays,
          adText: adText || `[Pub ${keyword} — texte non disponible EU]`,
          adUrl: snapshotUrl || pageUrl,
          videoUrl: videoUrl || undefined,
          niche: [niche],
          keywords: [keyword],
          scrapedAt: new Date().toISOString(),
          score: 0,
          analysis: {
            pattern: 'PAS',
            hook: adText ? adText.split('\n')[0].slice(0, 120) : keyword,
            mainPain: '',
            solution: '',
            offer: adText ? adText.slice(0, 200) : keyword,
            productType,
            price,
            niche,
            cta: '',
            techniques: [],
            emotionalTriggers: [],
            urgencyLevel: adText.toLowerCase().match(/limité|seulement|aujourd'hui|ce soir|dernier/) ? 8 : 5,
            socialProofLevel: adText.match(/\d+\s*(personnes|étudiants|clients|membres|inscrits)/) ? 7 : 3,
            overallScore: 0,
            summary: '',
          },
        }
        ad.score = calculateScore(ad)
        ads.push(ad)
      } catch (_) {
        // skip
      }
    }
  } catch (err) {
    console.error(`[FB Meta API] keyword="${keyword}":`, err)
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
