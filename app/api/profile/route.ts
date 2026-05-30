/**
 * PATCH /api/profile — Mise à jour du nom d'affichage
 * GET  /api/profile — Récupère le plan réel depuis Supabase
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getUserRecord, upsertUser } from '@/lib/user-plan'
import { isSupabaseConfigured, getSupabase } from '@/lib/supabase'

export async function GET() {
  const authCheck = await requireAuth()
  if (authCheck.error) return authCheck.error

  const record = await getUserRecord(authCheck.session.user.email)
  return NextResponse.json({ plan: record.plan, onboarded: record.onboarded })
}

export async function PATCH(request: NextRequest) {
  const authCheck = await requireAuth()
  if (authCheck.error) return authCheck.error

  try {
    const { name } = await request.json()

    if (!name || typeof name !== 'string' || name.trim().length < 1) {
      return NextResponse.json({ error: 'Nom invalide' }, { status: 400 })
    }

    const trimmedName = name.trim().slice(0, 100)

    if (isSupabaseConfigured()) {
      const { error } = await getSupabase()
        .from('users')
        .update({ name: trimmedName, updated_at: new Date().toISOString() })
        .eq('email', authCheck.session.user.email)

      if (error) throw error
    }

    return NextResponse.json({ success: true, name: trimmedName })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur mise à jour profil' },
      { status: 500 }
    )
  }
}
