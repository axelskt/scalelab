/**
 * Magic link — génère et vérifie les tokens de connexion par email
 * Table Supabase :
 *   create table if not exists verification_tokens (
 *     identifier text not null,
 *     token      text not null,
 *     expires    timestamptz not null,
 *     primary key (identifier, token)
 *   );
 */
import crypto from 'crypto'
import { isSupabaseConfigured, getSupabase } from './supabase'
import { upsertUser } from './user-plan'

const TOKEN_EXPIRY_MINUTES = 15

export async function createMagicToken(email: string): Promise<string> {
  if (!isSupabaseConfigured()) throw new Error('Supabase non configuré')

  const token   = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000).toISOString()

  // Supprimer les anciens tokens pour cet email
  await getSupabase()
    .from('verification_tokens')
    .delete()
    .eq('identifier', email)

  const { error } = await getSupabase()
    .from('verification_tokens')
    .insert({ identifier: email, token, expires })

  if (error) throw new Error(`Impossible de créer le token: ${error.message}`)

  return token
}

export async function verifyMagicToken(
  email: string,
  token: string
): Promise<{ email: string; name: string } | null> {
  if (!isSupabaseConfigured()) return null

  const { data, error } = await getSupabase()
    .from('verification_tokens')
    .select('expires')
    .eq('identifier', email)
    .eq('token', token)
    .single()

  if (error || !data) return null

  // Vérifier expiration
  if (new Date(data.expires) < new Date()) {
    await getSupabase()
      .from('verification_tokens')
      .delete()
      .eq('identifier', email)
      .eq('token', token)
    return null
  }

  // Supprimer le token (usage unique)
  await getSupabase()
    .from('verification_tokens')
    .delete()
    .eq('identifier', email)
    .eq('token', token)

  // Créer/mettre à jour l'utilisateur
  const name = email.split('@')[0]
  await upsertUser({ email, name })

  return { email, name }
}
