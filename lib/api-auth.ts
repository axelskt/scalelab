/**
 * Helper : vérification auth + plan dans les API routes
 * Usage :
 *   const check = await requireAuth(request)
 *   if (check.error) return check.error
 *   const { session } = check
 */

import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { getUserRecord, canAccess, Plan } from '@/lib/user-plan'

type Feature = 'brief' | 'vsl' | 'analyzer' | 'creators' | 'workspace'

interface AuthOk {
  error: null
  session: { user: { email: string; name?: string | null; id?: string; plan: string } }
  plan: Plan
}

interface AuthFail {
  error: NextResponse
  session: null
  plan: null
}

export async function requireAuth(): Promise<AuthOk | AuthFail> {
  const session = await auth()
  if (!session?.user?.email) {
    return {
      error: NextResponse.json({ error: 'Non authentifié' }, { status: 401 }),
      session: null,
      plan: null,
    }
  }

  // Plan depuis le JWT (rapide, mis à jour au login)
  const plan = ((session.user as { plan?: string }).plan ?? 'free') as Plan

  return {
    error: null,
    session: session as unknown as AuthOk['session'],
    plan,
  }
}

export async function requirePlan(feature: Feature): Promise<AuthOk | AuthFail> {
  const result = await requireAuth()
  if (result.error) return result

  // Vérification côté serveur du plan (re-lit Supabase si nécessaire)
  const record = await getUserRecord(result.session.user.email)
  if (!canAccess(record.plan, feature)) {
    return {
      error: NextResponse.json(
        { error: `Plan insuffisant. Cette fonctionnalité requiert un plan Pro ou supérieur.` },
        { status: 403 }
      ),
      session: null,
      plan: null,
    }
  }

  return { ...result, plan: record.plan }
}
