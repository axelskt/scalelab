import { createClient, SupabaseClient } from '@supabase/supabase-js'

export function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY))
}

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  _client = createClient(url, key)
  return _client
}

// Compat alias — utilisé uniquement si Supabase est configuré
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabase()[prop as keyof SupabaseClient]
  },
})

// ─── Types DB ────────────────────────────────────────────────────────────────

export interface DBCreator {
  id?: string
  name: string
  page_url: string
  source: 'facebook' | 'tiktok'
  niche: string
  ads_count: number
  first_seen: string
  last_seen: string
  thumbnail_url?: string
  is_active: boolean
  created_at?: string
}

export interface DBAd {
  id: string
  creator_name: string
  creator_page_url?: string
  source: 'facebook' | 'tiktok'
  country: string
  language: string
  start_date: string
  run_days: number
  ad_text: string
  thumbnail_url?: string
  video_url?: string
  ad_url: string
  niche: string[]
  keywords: string[]
  product_type?: string
  price?: string
  detected_niche?: string
  offer?: string
  analysis?: Record<string, unknown>
  score: number
  scraped_at: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export async function upsertAd(ad: DBAd) {
  const { error } = await getSupabase()
    .from('ads')
    .upsert(ad, { onConflict: 'id' })
  if (error) console.error('Supabase upsert ad error:', error.message)
}

export async function upsertCreator(creator: DBCreator) {
  const { error } = await getSupabase()
    .from('creators')
    .upsert(creator, { onConflict: 'page_url' })
  if (error) console.error('Supabase upsert creator error:', error.message)
}

export async function getAds(limit = 100, offset = 0) {
  const { data, error } = await getSupabase()
    .from('ads')
    .select('*')
    .order('score', { ascending: false })
    .range(offset, offset + limit - 1)
  if (error) console.error('Supabase getAds error:', error.message)
  return data || []
}

export async function getCreators(limit = 100) {
  const { data, error } = await getSupabase()
    .from('creators')
    .select('*')
    .order('ads_count', { ascending: false })
    .limit(limit)
  if (error) console.error('Supabase getCreators error:', error.message)
  return data || []
}
