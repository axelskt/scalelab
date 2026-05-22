import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { markOnboarded } from '@/lib/user-plan'

export async function POST() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }
  await markOnboarded(session.user.email)
  return NextResponse.json({ success: true })
}
