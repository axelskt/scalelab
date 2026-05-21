'use client'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  async function handleGoogle() {
    setLoading(true)
    await signIn('google', { callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-[#07080F] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)' }} />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)' }} />

      {/* Card */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/landing" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="text-white font-black text-base">S</span>
            </div>
            <span className="font-black text-xl text-white tracking-tight">ScaleLab</span>
          </Link>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-white mb-2">Bienvenue</h1>
            <p className="text-sm text-zinc-400">Connectez-vous pour accéder à votre espace ScaleLab</p>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-50 text-zinc-900 font-semibold py-3.5 px-5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed mb-4 text-sm"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-zinc-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <GoogleIcon />
            )}
            {loading ? 'Connexion…' : 'Continuer avec Google'}
          </button>

          {/* Separator */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#07080F] px-3 text-xs text-zinc-600">ou</span>
            </div>
          </div>

          {/* Magic link placeholder */}
          <div className="space-y-3">
            <input
              type="email"
              placeholder="votre@email.com"
              disabled
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-500 placeholder-zinc-600 cursor-not-allowed"
            />
            <button
              disabled
              className="w-full py-3 rounded-xl bg-orange-500/20 text-orange-400/50 font-semibold text-sm cursor-not-allowed border border-orange-500/10"
            >
              Envoyer le lien magique (bientôt)
            </button>
          </div>

          {/* Legal */}
          <p className="text-center text-xs text-zinc-600 mt-6">
            En continuant, vous acceptez nos{' '}
            <a href="#" className="text-zinc-400 hover:text-white transition-colors underline underline-offset-2">CGU</a>
            {' '}et notre{' '}
            <a href="#" className="text-zinc-400 hover:text-white transition-colors underline underline-offset-2">politique de confidentialité</a>.
          </p>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          <Link href="/landing" className="hover:text-zinc-400 transition-colors">
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
