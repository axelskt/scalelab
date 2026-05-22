import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { upsertUser, getUserRecord } from '@/lib/user-plan'
import { sendWelcomeEmail } from '@/lib/resend'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/app') ||
        (nextUrl.pathname === '/' && !nextUrl.pathname.startsWith('/landing') && !nextUrl.pathname.startsWith('/login'))
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false
      }
      return true
    },
    async jwt({ token, user, trigger }) {
      // Premier login — upsert user en DB + welcome email
      if (trigger === 'signIn' && user?.email) {
        const existing = await getUserRecord(user.email)
        await upsertUser({ email: user.email, name: user.name ?? undefined, image: user.image ?? undefined })
        // Welcome email uniquement si premier login (pas encore onboardé)
        if (!existing.onboarded && process.env.RESEND_API_KEY) {
          sendWelcomeEmail({ to: user.email, name: user.name ?? 'ami' }).catch(() => {})
        }
        token.plan = existing.plan
        token.onboarded = existing.onboarded
      }
      return token
    },
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (session.user) {
        (session.user as typeof session.user & { plan: string; onboarded: boolean }).plan = (token.plan as string) ?? 'free'
        ;(session.user as typeof session.user & { plan: string; onboarded: boolean }).onboarded = (token.onboarded as boolean) ?? false
      }
      return session
    },
  },
  session: { strategy: 'jwt' },
})
