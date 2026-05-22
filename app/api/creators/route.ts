import { NextResponse } from 'next/server'
import { isSupabaseConfigured, getCreators } from '@/lib/supabase'

// Seed créateurs pour fallback
const SEED_CREATORS = [
  { id: 'c1', name: 'Alexis V.', source: 'facebook', niche: 'IA & Tech', ads_count: 12, first_seen: '2024-10-15', last_seen: '2025-05-20', is_active: true, page_url: 'https://facebook.com/alexisv' },
  { id: 'c2', name: 'Sarah M.', source: 'facebook', niche: 'E-commerce', ads_count: 23, first_seen: '2024-09-01', last_seen: '2025-05-20', is_active: true, page_url: 'https://facebook.com/sarahm' },
  { id: 'c3', name: 'Thomas K.', source: 'facebook', niche: 'Copywriting', ads_count: 8, first_seen: '2024-11-20', last_seen: '2025-05-20', is_active: true, page_url: 'https://facebook.com/thomask' },
  { id: 'c4', name: 'Marine B.', source: 'tiktok', niche: 'Coaching business', ads_count: 15, first_seen: '2025-01-10', last_seen: '2025-05-20', is_active: true, page_url: 'https://tiktok.com/@marineb' },
  { id: 'c5', name: 'Lucas P.', source: 'facebook', niche: 'Finance personnelle', ads_count: 31, first_seen: '2024-07-15', last_seen: '2025-05-20', is_active: true, page_url: 'https://facebook.com/lucasp' },
  { id: 'c6', name: 'Emma R.', source: 'tiktok', niche: 'Fitness & Santé', ads_count: 19, first_seen: '2024-12-01', last_seen: '2025-05-20', is_active: true, page_url: 'https://tiktok.com/@emmar' },
  { id: 'c7', name: 'Antoine D.', source: 'facebook', niche: 'Immobilier', ads_count: 7, first_seen: '2025-02-10', last_seen: '2025-05-20', is_active: true, page_url: 'https://facebook.com/antoine' },
  { id: 'c8', name: 'Julie F.', source: 'facebook', niche: 'Développement personnel', ads_count: 42, first_seen: '2024-06-01', last_seen: '2025-05-20', is_active: true, page_url: 'https://facebook.com/julief' },
]

export async function GET() {
  if (isSupabaseConfigured()) {
    try {
      const creators = await getCreators(200)
      if (creators.length > 0) {
        return NextResponse.json({ creators, total: creators.length, source: 'supabase' })
      }
    } catch (err) {
      console.error('Supabase creators error:', err)
    }
  }

  return NextResponse.json({ creators: SEED_CREATORS, total: SEED_CREATORS.length, source: 'seed' })
}
