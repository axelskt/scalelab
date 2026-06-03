import { NextRequest, NextResponse } from 'next/server'
import { createMagicToken } from '@/lib/magic-link'
import { sendMagicLinkEmail } from '@/lib/resend'

const RATE_LIMIT = new Map<string, number>()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Rate limit : 1 email par minute par adresse
    const lastSent = RATE_LIMIT.get(normalizedEmail) || 0
    if (Date.now() - lastSent < 60_000) {
      return NextResponse.json(
        { error: 'Un lien a déjà été envoyé. Attendez 1 minute avant de réessayer.' },
        { status: 429 }
      )
    }

    const token = await createMagicToken(normalizedEmail)
    const baseUrl = process.env.NEXTAUTH_URL || 'https://scalelab.iamanager.fr'
    const magicUrl = `${baseUrl}/login?token=${token}&email=${encodeURIComponent(normalizedEmail)}`

    await sendMagicLinkEmail({ to: normalizedEmail, magicUrl })

    RATE_LIMIT.set(normalizedEmail, Date.now())
    // Nettoyer le cache après 2 min
    setTimeout(() => RATE_LIMIT.delete(normalizedEmail), 120_000)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[magic-link]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur envoi email' },
      { status: 500 }
    )
  }
}
