/**
 * Extrait les vraies URLs vidéo depuis les snapshots Meta Ads Library
 * en utilisant Playwright pour intercepter les requêtes réseau.
 *
 * C'est la méthode utilisée par Whoscale, Minea, etc. pour contourner
 * les restrictions RGPD de l'API officielle.
 */

import { chromium } from 'playwright'

const FBCDN_VIDEO_PATTERN = /https:\/\/video\.[a-z0-9-]+\.fbcdn\.net\/[^\s"']+\.mp4[^\s"']*/

/**
 * Ouvre un snapshot Meta Ads Library et intercepte l'URL vidéo MP4
 * depuis les requêtes réseau de la page.
 *
 * @param snapshotUrl - URL du type https://www.facebook.com/ads/library/?id=123456
 * @param timeoutMs - Délai max en ms (défaut 15s)
 * @returns URL MP4 directe ou null si introuvable
 */
export async function extractMetaVideoUrl(
  snapshotUrl: string,
  timeoutMs = 15000
): Promise<string | null> {
  if (!snapshotUrl || !snapshotUrl.includes('facebook.com')) return null

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'fr-FR',
    viewport: { width: 1280, height: 800 },
  })

  let videoUrl: string | null = null

  try {
    const page = await context.newPage()

    // Intercepter toutes les requêtes réseau
    page.on('request', (request) => {
      const url = request.url()
      if (FBCDN_VIDEO_PATTERN.test(url) && !videoUrl) {
        videoUrl = url.split('?')[0] // Enlève les params de tracking
      }
    })

    // Aussi intercepter les réponses (certaines URLs sont dans les redirects)
    page.on('response', async (response) => {
      const url = response.url()
      if (FBCDN_VIDEO_PATTERN.test(url) && !videoUrl) {
        videoUrl = url.split('?')[0]
      }
    })

    await page.goto(snapshotUrl, {
      waitUntil: 'domcontentloaded',
      timeout: timeoutMs,
    })

    // Attendre un peu pour que la vidéo commence à charger
    await page.waitForTimeout(3000)

    // Si pas trouvé via réseau, chercher dans le HTML/source
    if (!videoUrl) {
      const content = await page.content()
      const match = content.match(FBCDN_VIDEO_PATTERN)
      if (match) videoUrl = match[0].split('?')[0]
    }

    // Essayer aussi de cliquer sur le play pour déclencher le chargement
    if (!videoUrl) {
      try {
        await page.click('[aria-label*="play"], [aria-label*="Play"], video, .playButton', {
          timeout: 2000,
        })
        await page.waitForTimeout(2000)
      } catch {
        // Pas de bouton play trouvé, pas grave
      }
    }
  } catch (err) {
    console.error('[VideoExtractor] Erreur:', snapshotUrl, err)
  } finally {
    await browser.close()
  }

  return videoUrl
}

/**
 * Enrichit une liste d'ads avec leurs vraies URLs vidéo.
 * Traite les ads en parallèle par batch de 3 pour ne pas surcharger.
 */
export async function enrichAdsWithVideoUrls(
  ads: Array<{ id: string; adUrl?: string; videoUrl?: string; source: string }>
): Promise<Map<string, string>> {
  const videoMap = new Map<string, string>()

  // Filtrer les Meta ads sans videoUrl
  const toProcess = ads.filter(
    (ad) => ad.source === 'facebook' && !ad.videoUrl && ad.adUrl?.includes('facebook.com')
  )

  if (toProcess.length === 0) return videoMap

  console.log(`[VideoExtractor] Enrichissement de ${toProcess.length} ads Meta...`)

  // Batch de 3 en parallèle
  for (let i = 0; i < toProcess.length; i += 3) {
    const batch = toProcess.slice(i, i + 3)
    const results = await Promise.all(
      batch.map(async (ad) => {
        const url = await extractMetaVideoUrl(ad.adUrl!)
        return { id: ad.id, url }
      })
    )
    for (const { id, url } of results) {
      if (url) videoMap.set(id, url)
    }
    // Petite pause entre les batches
    if (i + 3 < toProcess.length) await new Promise((r) => setTimeout(r, 1000))
  }

  console.log(`[VideoExtractor] ${videoMap.size}/${toProcess.length} URLs trouvées`)
  return videoMap
}
