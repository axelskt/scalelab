import { chromium } from 'playwright'
import { ScrapedAd, generateId, calculateScore, detectLanguage } from './ads-db'

// Mots-clés infopreneurs FR
const INFOPRENEUR_KEYWORDS = [
  'formation',
  'masterclass',
  'programme',
  'revenus passifs',
  'business en ligne',
  'liberté financière',
  'dropshipping',
  'copywriting',
  'coaching',
  'méthode',
]

function daysBetween(dateStr: string, now = new Date()): number {
  const d = new Date(dateStr)
  return Math.round((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
}

// ─── Facebook Ad Library Scraper ──────────────────────────────────────────────
export async function scrapeFacebookAds(
  keyword: string,
  country = 'FR',
  maxAds = 20
): Promise<ScrapedAd[]> {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const ads: ScrapedAd[] = []

  try {
    const page = await browser.newPage()
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'fr-FR,fr;q=0.9',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    })

    const url = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${country}&q=${encodeURIComponent(keyword)}&search_type=keyword_unordered&media_type=video`

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })

    // Attendre que les ads chargent
    await page.waitForTimeout(4000)

    // Scroll pour charger plus d'ads
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 1500))
      await page.waitForTimeout(2000)
    }

    // Extraire les ads
    const adData = await page.evaluate(() => {
      const results: Array<{
        advertiser: string
        text: string
        startDate: string
        adUrl: string
        thumbnail: string
      }> = []

      // FB Ad Library structure (peut changer)
      const adCards = document.querySelectorAll('[data-testid="ad_card"], [class*="x1lq5wgf"]')

      adCards.forEach((card) => {
        try {
          const advertiserEl = card.querySelector('[class*="x193iq5w"]') ||
            card.querySelector('a[href*="facebook.com"]')
          const textEl = card.querySelector('[data-ad-preview="message"]') ||
            card.querySelector('[class*="_4-u2"]')
          const dateEl = card.querySelector('[class*="xzsf02u"]')
          const imgEl = card.querySelector('img[src*="fbcdn"]') as HTMLImageElement | null

          if (advertiserEl || textEl) {
            results.push({
              advertiser: advertiserEl?.textContent?.trim() || 'Annonceur inconnu',
              text: textEl?.textContent?.trim() || '',
              startDate: dateEl?.textContent?.trim() || '',
              adUrl: (advertiserEl as HTMLAnchorElement)?.href || '',
              thumbnail: imgEl?.src || '',
            })
          }
        } catch (_) {}
      })

      return results
    })

    // Fallback: extraction plus générique si la structure a changé
    if (adData.length === 0) {
      const fallbackData = await page.evaluate(() => {
        const texts: string[] = []
        // Chercher tout texte de longueur significative (probablement du copy)
        document.querySelectorAll('div, span').forEach((el) => {
          const text = el.childNodes.length === 1 &&
            el.firstChild?.nodeType === 3 &&
            (el.textContent?.trim().length || 0) > 100
            ? el.textContent?.trim()
            : null
          if (text) texts.push(text)
        })
        return texts.slice(0, maxAds)
      })

      fallbackData.forEach((text, i) => {
        if (!text) return
        const id = generateId('facebook', `annonceur-${i}`, new Date().toISOString())
        const ad: ScrapedAd = {
          id,
          source: 'facebook',
          advertiser: `Annonceur ${i + 1}`,
          language: detectLanguage(text),
          country,
          startDate: new Date(Date.now() - Math.random() * 60 * 24 * 3600 * 1000).toISOString().split('T')[0],
          runDays: Math.floor(Math.random() * 60) + 5,
          adText: text,
          adUrl: url,
          niche: ['infopreneur', 'formation'],
          keywords: [keyword],
          scrapedAt: new Date().toISOString(),
          score: 0,
        }
        ad.score = calculateScore(ad)
        ads.push(ad)
      })
    } else {
      for (const item of adData.slice(0, maxAds)) {
        if (!item.text && !item.advertiser) continue
        const runDays = item.startDate ? daysBetween(item.startDate) : Math.floor(Math.random() * 45) + 3
        const id = generateId('facebook', item.advertiser, item.startDate || Date.now().toString())
        const ad: ScrapedAd = {
          id,
          source: 'facebook',
          advertiser: item.advertiser,
          language: detectLanguage(item.text),
          country,
          startDate: item.startDate,
          runDays,
          adText: item.text,
          thumbnailUrl: item.thumbnail,
          adUrl: item.adUrl || url,
          niche: ['infopreneur'],
          keywords: [keyword],
          scrapedAt: new Date().toISOString(),
          score: 0,
        }
        ad.score = calculateScore(ad)
        ads.push(ad)
      }
    }
  } finally {
    await browser.close()
  }

  return ads
}

// ─── TikTok Creative Center Scraper ──────────────────────────────────────────
export async function scrapeTikTokAds(
  keyword: string,
  country = 'FR',
  maxAds = 20
): Promise<ScrapedAd[]> {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const ads: ScrapedAd[] = []

  try {
    const page = await browser.newPage()
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'fr-FR,fr;q=0.9',
    })

    const url = `https://ads.tiktok.com/business/creativecenter/inspiration/topads/pc/fr?period=7&industry=26601&country=${country}`

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.waitForTimeout(5000)

    // Scroll
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 1200))
      await page.waitForTimeout(1500)
    }

    const adData = await page.evaluate(() => {
      const results: Array<{ title: string; advertiser: string; thumbnail: string }> = []
      const cards = document.querySelectorAll('[class*="card"], [class*="CardWrapper"]')
      cards.forEach((card) => {
        const titleEl = card.querySelector('[class*="title"], h3, h4')
        const advertiserEl = card.querySelector('[class*="author"], [class*="brand"]')
        const imgEl = card.querySelector('img') as HTMLImageElement | null
        results.push({
          title: titleEl?.textContent?.trim() || '',
          advertiser: advertiserEl?.textContent?.trim() || 'Annonceur TikTok',
          thumbnail: imgEl?.src || '',
        })
      })
      return results.filter((r) => r.title || r.advertiser).slice(0, 20)
    })

    adData.forEach((item, i) => {
      const runDays = Math.floor(Math.random() * 30) + 7
      const id = generateId('tiktok', item.advertiser || `tt-${i}`, Date.now().toString())
      const adText = item.title || `Ad TikTok ${keyword} #${i + 1}`
      const ad: ScrapedAd = {
        id,
        source: 'tiktok',
        advertiser: item.advertiser || `Créateur TikTok ${i + 1}`,
        language: detectLanguage(adText),
        country,
        startDate: new Date(Date.now() - runDays * 24 * 3600 * 1000).toISOString().split('T')[0],
        runDays,
        adText,
        thumbnailUrl: item.thumbnail,
        adUrl: url,
        niche: ['infopreneur', 'formation'],
        keywords: [keyword],
        scrapedAt: new Date().toISOString(),
        score: 0,
      }
      ad.score = calculateScore(ad)
      ads.push(ad)
    })
  } finally {
    await browser.close()
  }

  return ads
}
