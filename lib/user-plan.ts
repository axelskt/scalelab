/**
 * Gestion du plan utilisateur depuis Supabase
 * Fallback sur 'free' si Supabase non configuré
 */

import { isSupabaseConfigured, getSupabase } from './supabase'

export type Plan = 'free' | 'starter' | 'pro' | 'business' | 'student'

export interface UserRecord {
  email: string
  name?: string
  image?: string
  plan: Plan
  plan_expires_at?: string
  onboarded: boolean
}

// Cache en mémoire pour éviter trop de requêtes Supabase
const planCache = new Map<string, { plan: Plan; onboarded: boolean; ts: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function getUserRecord(email: string): Promise<UserRecord> {
  const defaultRecord: UserRecord = { email, plan: 'free', onboarded: false }
  if (!email || !isSupabaseConfigured()) return defaultRecord

  // Check cache
  const cached = planCache.get(email)
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return { ...defaultRecord, plan: cached.plan, onboarded: cached.onboarded }
  }

  try {
    const { data, error } = await getSupabase()
      .from('users')
      .select('plan, plan_expires_at, onboarded, name, image')
      .eq('email', email)
      .single()

    if (error || !data) return defaultRecord

    // Vérifier expiration du plan
    let plan: Plan = data.plan as Plan
    if (data.plan_expires_at && new Date(data.plan_expires_at) < new Date()) {
      plan = 'free'
      // Mettre à jour en DB
      await getSupabase().from('users').update({ plan: 'free' }).eq('email', email)
    }

    const record = { ...defaultRecord, plan, onboarded: data.onboarded ?? false }
    planCache.set(email, { plan, onboarded: record.onboarded, ts: Date.now() })
    return record
  } catch {
    return defaultRecord
  }
}

export async function upsertUser(user: { email: string; name?: string; image?: string }) {
  if (!isSupabaseConfigured()) return
  try {
    await getSupabase().from('users').upsert(
      { email: user.email, name: user.name, image: user.image, updated_at: new Date().toISOString() },
      { onConflict: 'email', ignoreDuplicates: false }
    )
  } catch (e) {
    console.error('upsertUser error:', e)
  }
}

export async function markOnboarded(email: string) {
  if (!isSupabaseConfigured()) return
  await getSupabase().from('users').update({ onboarded: true }).eq('email', email)
  const cached = planCache.get(email)
  if (cached) planCache.set(email, { ...cached, onboarded: true })
}

export function canAccess(plan: Plan, feature: 'brief' | 'vsl' | 'analyzer' | 'creators' | 'workspace'): boolean {
  const matrix: Record<typeof feature, Plan[]> = {
    brief:     ['pro', 'business', 'student'],
    vsl:       ['starter', 'pro', 'business', 'student'],
    analyzer:  ['pro', 'business', 'student'],
    creators:  ['pro', 'business', 'student'],
    workspace: ['business'],
  }
  return matrix[feature].includes(plan)
}
