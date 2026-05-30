/**
 * GET  /api/favorites       → liste les favoris de l'utilisateur
 * POST /api/favorites       → ajoute un favori { ad: ScrapedAd }
 *
 * Table Supabase (à créer si elle n'existe pas) :
 * create table if not exists favorites (
 *   id          uuid primary key default gen_random_uuid(),
 *   user_email  text not null,
 *   ad_id       text not null,
 *   ad_data     jsonb not null,
 *   created_at  timestamptz default now(),
 *   unique(user_email, ad_id)
 * );
 * create index if not exists favorites_user_email_idx on favorites(user_email);
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { isSupabaseConfigured, getSupabase } from '@/lib/supabase'

export async function GET() {
  const authCheck = await requireAuth()
  if (authCheck.error) return authCheck.error

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ favorites: [], ids: [] })
  }

  try {
    const { data, error } = await getSupabase()
      .from('favorites')
      .select('ad_id, ad_data, created_at')
      .eq('user_email', authCheck.session.user.email)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      favorites: (data || []).map(r => r.ad_data),
      ids: (data || []).map(r => r.ad_id),
    })
  } catch (err) {
    console.error('[favorites GET]', err)
    return NextResponse.json({ favorites: [], ids: [] })
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireAuth()
  if (authCheck.error) return authCheck.error

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 })
  }

  try {
    const { ad } = await request.json()
    if (!ad?.id) {
      return NextResponse.json({ error: 'ad.id manquant' }, { status: 400 })
    }

    const { error } = await getSupabase()
      .from('favorites')
      .upsert(
        {
          user_email: authCheck.session.user.email,
          ad_id: ad.id,
          ad_data: ad,
        },
        { onConflict: 'user_email,ad_id', ignoreDuplicates: true }
      )

    if (error) throw error

    return NextResponse.json({ success: true, ad_id: ad.id })
  } catch (err) {
    console.error('[favorites POST]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur' },
      { status: 500 }
    )
  }
}
