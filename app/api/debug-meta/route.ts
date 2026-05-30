/**
 * GET /api/debug-meta
 * Teste la connexion Meta Ads Library API et retourne la réponse brute
 * Protégé par CRON_SECRET (header Authorization: Bearer <secret>)
 */
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Protection par CRON_SECRET obligatoire
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET non configuré' }, { status: 500 })
  }
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const accessToken = process.env.META_ACCESS_TOKEN
  if (!accessToken) {
    return NextResponse.json({ error: 'META_ACCESS_TOKEN manquant dans les env vars Vercel' })
  }

  try {
    const params = new URLSearchParams({
      access_token: accessToken,
      search_terms: 'formation',
      ad_reached_countries: JSON.stringify(['FR']),
      ad_active_status: 'ACTIVE',
      ad_type: 'ALL',
      fields: 'id,page_name,ad_creative_bodies,ad_creative_link_titles',
      limit: '5',
    })

    const url = `https://graph.facebook.com/v19.0/ads_archive?${params}`
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    const data = await res.json()

    return NextResponse.json({
      status: res.status,
      ok: res.ok,
      token_prefix: accessToken.slice(0, 10) + '...[masqué]',
      raw_response: data,
      ads_count: data?.data?.length ?? 0,
    })
  } catch (err) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Erreur inconnue',
    })
  }
}
