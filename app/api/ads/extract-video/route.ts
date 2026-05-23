import { NextRequest, NextResponse } from 'next/server'
import { loadAds, addOrUpdateAd } from '@/lib/ads-db'
import { extractMetaVideoUrl } from '@/lib/fb-video-extractor'

export async function POST(req: NextRequest) {
  try {
    const { adId } = await req.json()
    if (!adId) return NextResponse.json({ error: 'adId required' }, { status: 400 })

    const ads = loadAds()
    const ad = ads.find((a) => a.id === adId)
    if (!ad) return NextResponse.json({ error: 'Ad not found' }, { status: 404 })

    if (ad.source !== 'facebook') {
      return NextResponse.json({ error: 'Only Meta ads supported' }, { status: 400 })
    }

    if (!ad.adUrl) {
      return NextResponse.json({ error: 'No snapshot URL' }, { status: 400 })
    }

    const videoUrl = await extractMetaVideoUrl(ad.adUrl)
    if (!videoUrl) {
      return NextResponse.json({
        error: 'Video URL not found — ad may not have a video or content is EU-restricted',
      }, { status: 404 })
    }

    const updated = { ...ad, videoUrl }
    addOrUpdateAd(updated)

    return NextResponse.json({ ad: updated, videoUrl })
  } catch (err) {
    console.error('[extract-video]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
