/**
 * DELETE /api/favorites/[adId] → supprime un favori
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { isSupabaseConfigured, getSupabase } from '@/lib/supabase'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ adId: string }> }
) {
  const authCheck = await requireAuth()
  if (authCheck.error) return authCheck.error

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 })
  }

  try {
    const { adId } = await params
    const { error } = await getSupabase()
      .from('favorites')
      .delete()
      .eq('user_email', authCheck.session.user.email)
      .eq('ad_id', adId)

    if (error) throw error

    return NextResponse.json({ success: true, ad_id: adId })
  } catch (err) {
    console.error('[favorites DELETE]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur' },
      { status: 500 }
    )
  }
}
