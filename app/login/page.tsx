'use client'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function LoginForm() {
  const [loading, setLoading]       = useState(false)
  const [email, setEmail]           = useState('')
  const [emailSent, setEmailSent]   = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const searchParams                 = useSearchParams()
  const router                       = useRouter()

  // Auto-connexion via magic link (token dans URL)
  useEffect(() => {
    const token = searchParams.get('token')
    const emailParam = searchParams.get('email')
    if (token && emailParam) {
      setLoading(true)
      signIn('magic-link', {
        email: emailParam,
        token,
        callbackUrl: '/',
        redirect: true,
      })
    }
  }, [searchParams])

  async function handleGoogle() {
    setLoading(true)
    setError(null)
    await signIn('google', { callbackUrl: '/' })
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setEmailLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur envoi')
      setEmailSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setEmailLoading(false)
    }
  }

  // Si token dans URL → écran de chargement
  if (searchParams.get('token')) {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(249,115,22,0.1)' }}>
          <svg className="animate-spin h-6 w-6" style={{ color: '#F97316' }} viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
        <p className="text-sm font-semibold" style={{ color: '#1C1917' }}>Connexion en cours…</p>
      </div>
    )
  }

  // Après envoi du magic link
  if (emailSent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
          📬
        </div>
        <h2 className="text-lg font-black" style={{ color: '#1C1917' }}>Vérifiez votre boîte mail</h2>
        <p className="text-sm" style={{ color: 'rgba(28,25,23,0.55)' }}>
          Un lien de connexion a été envoyé à<br />
          <strong style={{ color: '#1C1917' }}>{email}</strong>
        </p>
        <p className="text-xs" style={{ color: 'rgba(28,25,23,0.35)' }}>Le lien expire dans 15 minutes.</p>
        <button
          onClick={() => { setEmailSent(false); setEmail('') }}
          className="text-xs font-medium px-4 py-2 rounded-lg transition-all"
          style={{ background: 'rgba(28,25,23,0.06)', color: 'rgba(28,25,23,0.5)', border: '1px solid rgba(28,25,23,0.08)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(28,25,23,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(28,25,23,0.06)'}
        >
          ← Utiliser une autre adresse
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black mb-2" style={{ color: '#1C1917' }}>Bienvenue</h1>
        <p className="text-sm" style={{ color: 'rgba(28,25,23,0.5)' }}>
          Connectez-vous pour accéder à votre espace TrackAds
        </p>
      </div>

      {/* Google */}
      <button
        onClick={handleGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 font-semibold py-3.5 px-5 rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mb-4 text-sm"
        style={{ background: 'white', border: '1.5px solid rgba(28,25,23,0.15)', color: '#1C1917', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#FAFAF8' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'white' }}
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5" style={{ color: '#F97316' }} viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        ) : <GoogleIcon />}
        {loading ? 'Connexion…' : 'Continuer avec Google'}
      </button>

      {/* Separator */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full" style={{ borderTop: '1px solid rgba(28,25,23,0.1)' }} />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 text-xs" style={{ background: 'white', color: 'rgba(28,25,23,0.4)' }}>ou</span>
        </div>
      </div>

      {/* Magic link form */}
      <form onSubmit={handleMagicLink} className="space-y-3">
        <input
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
          style={{
            background: 'white',
            border: '1px solid rgba(28,25,23,0.12)',
            color: '#1C1917',
          }}
          onFocus={e => e.currentTarget.style.borderColor = '#F97316'}
          onBlur={e => e.currentTarget.style.borderColor = 'rgba(28,25,23,0.12)'}
        />
        <button
          type="submit"
          disabled={emailLoading || !email.trim()}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, #F97316, #FB923C)',
            color: 'white',
            boxShadow: '0 2px 10px rgba(249,115,22,0.3)',
          }}
        >
          {emailLoading ? 'Envoi en cours…' : 'Envoyer le lien magique'}
        </button>
      </form>

      {error && (
        <p className="text-xs text-center mt-3" style={{ color: '#EF4444' }}>⚠️ {error}</p>
      )}

      {/* Legal */}
      <p className="text-center text-xs mt-6" style={{ color: 'rgba(28,25,23,0.4)' }}>
        En continuant, vous acceptez nos{' '}
        <a href="#" className="underline underline-offset-2" style={{ color: 'rgba(28,25,23,0.6)' }}>CGU</a>
        {' '}et notre{' '}
        <a href="#" className="underline underline-offset-2" style={{ color: 'rgba(28,25,23,0.6)' }}>politique de confidentialité</a>.
      </p>
    </>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: '#FFFBF7' }}>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)' }} />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/landing" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: '#F97316', boxShadow: '0 4px 14px rgba(249,115,22,0.35)' }}>
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <polyline points="6,22 12,15 18,17 26,8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="26" cy="8" r="3" fill="white"/>
              </svg>
            </div>
            <span className="font-black text-xl tracking-tight" style={{ color: '#1C1917' }}>TrackAds</span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8"
          style={{ background: 'white', border: '1px solid rgba(28,25,23,0.1)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <Suspense fallback={<div className="text-center text-sm" style={{ color: 'rgba(28,25,23,0.4)' }}>Chargement…</div>}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-xs mt-6">
          <Link href="/landing" className="transition-colors" style={{ color: 'rgba(28,25,23,0.4)' }}>
            ← Retour à l'accueil
          </Link>
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}
