/**
 * Appelé par le cron après chaque scrape
 * Envoie un email aux utilisateurs Pro/Business pour les pubs avec score > 80
 */
import { NextRequest, NextResponse } from 'next/server'
import { sendWinnerAdAlert } from '@/lib/resend'
import { isSupabaseConfigured, getSupabase } from '@/lib/supabase'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const auth = request.headers.get('authorization')
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !process.env.RESEND_API_KEY) {
    return NextResponse.json({ skipped: true, reason: 'Supabase ou Resend non configuré' })
  }

  const sb = getSupabase()

  // Pubs winners des dernières 2h (score > 80)
  const since = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  const { data: winners } = await sb
    .from('ads')
    .select('*')
    .gte('score', 80)
    .gte('scraped_at', since)
    .order('score', { ascending: false })
    .limit(5)

  if (!winners?.length) {
    return NextResponse.json({ sent: 0, message: 'Aucune pub winner récente' })
  }

  // Utilisateurs Pro/Business avec notifications activées
  const { data: users } = await sb
    .from('users')
    .select('email, name')
    .in('plan', ['pro', 'business'])

  if (!users?.length) {
    return NextResponse.json({ sent: 0, message: 'Aucun utilisateur Pro/Business' })
  }

  let sent = 0
  for (const winner of winners) {
    for (const user of users) {
      try {
        await sendWinnerAdAlert({
          to: user.email,
          advertiser: winner.creator_name,
          score: winner.score,
          runDays: winner.run_days,
          niche: winner.detected_niche || winner.niche?.[0] || 'Marketing digital',
          productType: winner.product_type || 'Formation',
          price: winner.price || 'Non mentionné',
          adText: winner.ad_text || '',
          adUrl: winner.ad_url || '',
        })
        sent++
      } catch (e) {
        console.error('sendWinnerAdAlert error:', e)
      }
    }
  }

  return NextResponse.json({ sent, winners: winners.length, users: users.length })
}
