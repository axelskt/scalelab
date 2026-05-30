import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { adaptAdToProduct } from '@/lib/ad-analyzer'
import { loadAds } from '@/lib/ads-db'

export async function POST(request: NextRequest) {
  const authCheck = await requireAuth()
  if (authCheck.error) return authCheck.error

  try {
    const { adId, targetProduct, targetAudience } = await request.json()

    const ads = loadAds()
    const ad = ads.find((a) => a.id === adId)

    if (!ad) {
      return NextResponse.json({ error: 'Ad non trouvée' }, { status: 404 })
    }

    const adaptedScript = await adaptAdToProduct(ad, targetProduct, targetAudience)

    return NextResponse.json({ success: true, adaptedScript, sourceAd: ad })
  } catch (error) {
    console.error('Adapt error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur d\'adaptation' },
      { status: 500 }
    )
  }
}
