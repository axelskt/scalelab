'use client'
import React, { useState } from 'react'
import Link from 'next/link'

// ─── Design tokens (light theme) ──────────────────────────────────────────────
// BG: #FFFFFF  |  Surface: #F8F9FB  |  Border: #E5E7EB
// Text: #111827  |  Muted: #6B7280  |  Orange: #F97316

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: '#FFFBF7', color: '#1C1917' }}>
      <Nav />
      <HeroSection />
      <SocialProofBar />
      <AdsIntelligenceSection />
      <VSLSection />
      <TranscriptSection />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </div>
  )
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav className="sticky top-0 z-50" style={{ background: 'rgba(255,251,247,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #FDEBD0' }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">
        <Logo />
        <div className="hidden md:flex items-center gap-6 flex-1">
          {[
            { label: 'Ads', href: '#ads' },
            { label: 'VSL AI', href: '#vsl' },
            { label: 'Transcript', href: '#transcript' },
            { label: 'Tarifs', href: '#tarifs' },
            { label: 'Affiliation', href: '/affiliation' },
          ].map(({ label, href }) => (
            <a key={label} href={href} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
              {label}
            </a>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 px-4 py-2 transition-colors">
            Se connecter
          </Link>
          <Link href="/login"
            className="text-sm font-bold px-5 py-2.5 rounded-xl text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', boxShadow: '0 4px 14px rgba(249,115,22,0.35)' }}>
            Commencer →
          </Link>
        </div>
      </div>
    </nav>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-0">
      {/* Subtle glow orbs only — no grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 65%)' }} />
      <div className="absolute top-32 left-0 w-[500px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)' }} />
      <div className="absolute top-32 right-0 w-[500px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)' }} />

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-xs font-bold tracking-widest uppercase"
          style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', color: '#F97316' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          Intelligence publicitaire · Meta + TikTok
        </div>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight mb-6">
          <span style={{ color: '#111827' }}>Espionnez</span>
          <br />
          <span style={{ background: 'linear-gradient(135deg, #F97316 0%, #FB923C 40%, #F59E0B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            les ads qui scalent.
          </span>
        </h1>

        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed text-zinc-500">
          La base de données de publicités infopreneurs FR en temps réel.
          Analysez, scorez, améliorez et générez vos propres VSL vidéo grâce à l'IA.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
          <Link href="/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-base transition-all"
            style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', boxShadow: '0 8px 30px rgba(249,115,22,0.35)' }}>
            Essayer gratuitement →
          </Link>
          <Link href="#ads"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base text-zinc-600 transition-all hover:bg-zinc-50"
            style={{ border: '1px solid #FDEBD0' }}>
            Voir comment ça marche
          </Link>
        </div>

        {/* Trust pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16 text-xs text-zinc-400">
          {['✓ Sans CB pour commencer', '✓ Données Meta + TikTok', '✓ Score VSL par Claude AI', '✓ Transcript amélioré inclus'].map(item => (
            <span key={item}>{item}</span>
          ))}
        </div>

        {/* Dashboard hero mockup — stays dark, contrast avec fond blanc */}
        <DashboardMockup />
      </div>
    </section>
  )
}

function DashboardMockup() {
  const ads = [
    { name: 'FXRevolution', days: 142, score: 91, niche: 'Trading', active: true },
    { name: 'AssuLux Coaching', days: 98, score: 84, niche: 'Business', active: true },
    { name: 'Paco Expert IA', days: 87, score: 79, niche: 'IA', active: true },
    { name: 'Bryan RGT Drops', days: 63, score: 72, niche: 'E-com', active: true },
    { name: 'Sophia Mindset', days: 41, score: 68, niche: 'Dev perso', active: false },
  ]
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.1)', background: '#0E1018', boxShadow: '0 32px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(249,115,22,0.08)' }}>
      <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex gap-1.5">
          {['bg-red-500/60', 'bg-yellow-500/60', 'bg-green-500/60'].map((c, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full ${c}`} />
          ))}
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>
            <span>🔒</span> trackads.io/ads
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium" style={{ background: 'rgba(249,115,22,0.15)', color: '#F97316' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          Live scraping
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4 px-5 py-2.5 text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.2)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <span className="col-span-2">Annonceur</span>
        <span>Niche</span>
        <span className="text-center">Jours actifs</span>
        <span className="text-center">Score VSL</span>
      </div>
      {ads.map((ad, i) => (
        <div key={i} className="grid grid-cols-5 gap-4 px-5 py-3.5 items-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
          <div className="col-span-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0"
              style={{ background: `hsl(${i * 47 + 20}, 70%, 25%)` }}>
              {ad.name[0]}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>{ad.name}</p>
              {ad.active && (
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-400 font-medium">ACTIF</span>
                </div>
              )}
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-full font-medium w-fit" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)' }}>
            {ad.niche}
          </span>
          <div className="text-center">
            <span className="text-sm font-bold" style={{ color: ad.days > 90 ? '#F97316' : 'rgba(255,255,255,0.7)' }}>{ad.days}j</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-16 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-1.5 rounded-full" style={{ width: `${ad.score}%`, background: ad.score >= 80 ? '#00D26A' : '#F97316' }} />
            </div>
            <span className="text-xs font-bold" style={{ color: ad.score >= 80 ? '#00D26A' : '#F97316' }}>{ad.score}</span>
          </div>
        </div>
      ))}
      <div className="h-10" style={{ background: 'linear-gradient(to bottom, transparent, #0E1018)' }} />
    </div>
  )
}

// ─── SOCIAL PROOF BAR ─────────────────────────────────────────────────────────
function SocialProofBar() {
  return (
    <div className="py-16" style={{ borderTop: '1px solid #FDEBD0', borderBottom: '1px solid #FDEBD0', background: '#FFF5EC' }}>
      <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
        {[
          { value: '2M+', label: 'Publicités indexées', color: '#F97316' },
          { value: '20k+', label: 'Créateurs suivis', color: '#8B5CF6' },
          { value: '50k+', label: 'Tunnels analysés', color: '#06B6D4' },
        ].map(({ value, label, color }) => (
          <div key={label}>
            <div className="text-4xl md:text-5xl font-black mb-1" style={{ color }}>{value}</div>
            <div className="text-xs font-bold tracking-widest uppercase text-zinc-400">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── ADS INTELLIGENCE ─────────────────────────────────────────────────────────
function AdsIntelligenceSection() {
  return (
    <section id="ads" className="py-32 max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6 tracking-widest uppercase"
            style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', color: '#F97316' }}>
            01 · Ads Intelligence
          </div>
          <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6 text-zinc-900">
            Trouvez les pubs<br />
            <span style={{ color: '#F97316' }}>qui durent le plus longtemps.</span>
          </h2>
          <p className="text-base leading-relaxed mb-8 text-zinc-500">
            Une pub active depuis 30+ jours, c'est une pub qui convertit. On scrape Meta et TikTok en continu pour vous donner accès aux winners prouvés du marché infopreneur FR.
          </p>
          <div className="space-y-4 mb-8">
            {[
              { icon: '⚡', title: 'Scraping Meta + TikTok en continu', desc: 'Mise à jour automatique toutes les 30 secondes en mode live.' },
              { icon: '🔍', title: 'Filtres puissants', desc: 'Langue, niche, jours actifs, note VSL, source. Trouve exactement ce que tu cherches.' },
              { icon: '📊', title: 'Classement par performance', desc: 'Les ads triées par durée de run, engagement estimé et score VSL.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-4 rounded-xl" style={{ border: '1px solid #FDEBD0', background: '#FFF5EC' }}>
                <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
                <div>
                  <p className="font-semibold text-sm mb-1 text-zinc-800">{title}</p>
                  <p className="text-xs leading-relaxed text-zinc-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)', color: '#F97316' }}>
            Explorer la bibliothèque →
          </Link>
        </div>

        {/* Mockup — reste dark */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#0E1018', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
          <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex flex-wrap gap-2 mb-3">
              {['🇫🇷 FR', '🇬🇧 EN', '📈 Winners', '⚡ Live'].map((f, i) => (
                <span key={f} className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{ background: i === 0 ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.05)', color: i === 0 ? '#F97316' : 'rgba(255,255,255,0.4)', border: `1px solid ${i === 0 ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
                  {f}
                </span>
              ))}
              <span className="ml-auto text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5" style={{ background: 'rgba(0,210,106,0.1)', border: '1px solid rgba(0,210,106,0.2)', color: '#00D26A' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                247 ads actives
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)' }}>
              <span>🔍</span> Rechercher un annonceur, niche…
            </div>
          </div>
          {[
            { name: 'FXRevolution', days: 142, views: '2.4M', score: 91, niche: 'Trading 📈' },
            { name: 'Paco Expert IA', days: 87, views: '890k', score: 79, niche: 'IA 🤖' },
            { name: 'AssuLux', days: 63, views: '1.1M', score: 84, niche: 'Business 💼' },
          ].map((ad, i) => (
            <div key={i} className="flex items-center gap-3 p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-black"
                style={{ background: `hsl(${i * 60 + 20}, 65%, 20%)`, color: `hsl(${i * 60 + 20}, 65%, 70%)` }}>
                {ad.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>{ad.name}</p>
                  <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)' }}>{ad.niche}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: '#F97316' }}>🔥 {ad.days}j actif</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>👁 {ad.views}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black" style={{ color: ad.score >= 80 ? '#00D26A' : '#F97316' }}>{ad.score}</div>
                <div className="text-xs text-zinc-600">/100</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── VSL GENERATOR ────────────────────────────────────────────────────────────
function VSLSection() {
  return (
    <section id="vsl" className="py-32" style={{ background: '#FFF5EC', borderTop: '1px solid #FDEBD0', borderBottom: '1px solid #FDEBD0' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6 tracking-widest uppercase"
            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.18)', color: '#7C3AED' }}>
            02 · VSL Generator · Exclusif TrackAds
          </div>
          <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4 text-zinc-900">
            D'une ad qui performe
            <br />
            <span style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              à votre vidéo VSL en 3 étapes.
            </span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-zinc-500">
            La seule plateforme qui combine veille concurrentielle ET génération de vidéos motion design. Aucun concurrent ne fait ça.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { step: '01', icon: '🔍', title: 'Repérez le winner', desc: 'Filtrez par durée de run, note VSL, langue. Toute ad active 30+ jours = winner prouvé.', color: '#F97316', bg: 'rgba(249,115,22,0.05)', border: 'rgba(249,115,22,0.15)' },
            { step: '02', icon: '🎙', title: 'Analysez avec Claude', desc: 'Score sur 5 dimensions (hook, émotion, CTA, rythme, structure). Version améliorée générée automatiquement.', color: '#7C3AED', bg: 'rgba(124,58,237,0.05)', border: 'rgba(124,58,237,0.15)' },
            { step: '03', icon: '🎬', title: 'Générez la vidéo', desc: 'Adaptez le script à votre produit. Rendu vidéo motion design prêt à diffuser en 1 clic.', color: '#0891B2', bg: 'rgba(8,145,178,0.05)', border: 'rgba(8,145,178,0.15)' },
          ].map(({ step, icon, title, desc, color, bg, border }) => (
            <div key={step} className="rounded-2xl p-6" style={{ border: `1px solid ${border}`, boxShadow: `0 4px 20px ${bg}` }}>
              <div className="flex items-start justify-between mb-5">
                <span className="text-3xl">{icon}</span>
                <span className="text-xs font-black" style={{ color, opacity: 0.4 }}>{step}</span>
              </div>
              <h3 className="font-black text-lg mb-2 text-zinc-900">{title}</h3>
              <p className="text-sm leading-relaxed text-zinc-500">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #6366F1)', boxShadow: '0 8px 30px rgba(124,58,237,0.25)' }}>
            Générer mon premier VSL →
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── TRANSCRIPT SCORE ─────────────────────────────────────────────────────────
function TranscriptSection() {
  return (
    <section id="transcript" className="py-32 max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Mockup — reste dark */}
        <div className="rounded-2xl p-6 space-y-5" style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#0E1018', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <ScoreRing score={84} size={60} />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-black text-white text-sm">Note VSL</p>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(0,210,106,0.15)', color: '#00D26A', border: '1px solid rgba(0,210,106,0.2)' }}>Excellent</span>
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>🇫🇷 Français · 847 mots · ~2min30</p>
            </div>
          </div>
          <div className="flex gap-1 rounded-lg p-0.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {['📊 Score', '📝 Original', '✨ Amélioré', '🔍 Diff'].map((tab, i) => (
              <div key={tab} className="flex-1 py-1.5 rounded-md text-xs font-medium text-center"
                style={{ background: i === 0 ? 'rgba(255,255,255,0.08)' : 'transparent', color: i === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)' }}>
                {tab}
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[
              { label: 'Hook (accroche)', val: 9, color: '#00D26A' },
              { label: 'Impact émotionnel', val: 8, color: '#00D26A' },
              { label: 'Structure (pattern)', val: 7, color: '#F97316' },
              { label: 'CTA (appel action)', val: 9, color: '#00D26A' },
              { label: 'Rythme / Pacing', val: 7, color: '#F97316' },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-xs w-32 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${val * 10}%`, background: color }} />
                </div>
                <span className="text-xs font-black w-4 text-right" style={{ color }}>{val}</span>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(0,210,106,0.05)', border: '1px solid rgba(0,210,106,0.1)' }}>
            <p className="text-xs font-bold mb-2" style={{ color: '#00D26A' }}>✓ Points forts</p>
            {['Hook Before/After avec chiffres précis', 'Urgence temporelle crédible', '3 objections levées explicitement'].map(s => (
              <p key={s} className="text-xs mb-1 flex items-start gap-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                <span style={{ color: '#00D26A' }}>→</span>{s}
              </p>
            ))}
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6 tracking-widest uppercase"
            style={{ background: 'rgba(0,210,106,0.08)', border: '1px solid rgba(0,210,106,0.2)', color: '#059669' }}>
            03 · Transcript & Score VSL
          </div>
          <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6 text-zinc-900">
            Analysez chaque script.
            <br />
            <span style={{ color: '#059669' }}>Améliorez-le en 1 clic.</span>
            <br />
            <span className="text-zinc-400" style={{ fontSize: '0.75em' }}>Inclus dans tous les plans.</span>
          </h2>
          <p className="text-base leading-relaxed mb-8 text-zinc-500">
            Claude analyse chaque script publicitaire sur 5 dimensions, identifie les points forts et faiblesses, puis génère une version améliorée avec les corrections appliquées.
          </p>
          <div className="space-y-3 mb-8">
            {[
              '5 dimensions : Hook · Émotion · Structure · CTA · Rythme',
              'Version améliorée générée automatiquement',
              'Diff visuel entre original et amélioré',
              'Copier le transcript amélioré en 1 clic',
            ].map(item => (
              <div key={item} className="flex items-center gap-3 text-sm text-zinc-600">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-emerald-500" />
                {item}
              </div>
            ))}
          </div>
          <Link href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)', color: '#059669' }}>
            Analyser mon premier script →
          </Link>
        </div>
      </div>
    </section>
  )
}

function ScoreRing({ score, size }: { score: number; size: number }) {
  const r = size / 2 - 5
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color = score >= 75 ? '#00D26A' : score >= 55 ? '#F97316' : '#FF3B30'
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
      </svg>
      <div className="absolute text-center">
        <div className="text-sm font-black" style={{ color }}>{score}</div>
        <div className="text-zinc-500 leading-none" style={{ fontSize: 9 }}>/100</div>
      </div>
    </div>
  )
}

// ─── PRICING ──────────────────────────────────────────────────────────────────
function PricingSection() {
  const plans = [
    {
      name: 'Starter', price: '29', popular: false,
      accent: '#6B7280',
      features: ['Créateurs illimités', 'Ads · 500/mois', 'Note VSL basique', 'Support email'],
      locked: ['Transcript amélioré IA', 'Génération VSL vidéo', 'Scrape continu'],
    },
    {
      name: 'Pro', price: '59', popular: true,
      accent: '#F97316',
      features: ['Créateurs illimités', 'Ads illimitées', 'Note VSL complète (5 dim.)', 'Transcript amélioré IA', 'VSL vidéo · 10/mois', 'Scrape continu live', 'Dépenses estimées'],
      locked: [],
    },
    {
      name: 'Business', price: '97', popular: false,
      accent: '#7C3AED',
      features: ['Tout Pro, illimité', 'VSL vidéo illimitée', 'API access', '5 workspaces équipe', 'White label', 'Support prioritaire'],
      locked: [],
    },
  ]

  return (
    <section id="tarifs" className="py-32" style={{ background: '#FFF5EC', borderTop: '1px solid #FDEBD0' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6 tracking-widest uppercase"
            style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', color: '#F97316' }}>
            Tarifs
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-zinc-900">
            Simple, transparent,
            <span style={{ color: '#F97316' }}> accessible.</span>
          </h2>
          <p className="text-zinc-500 mb-8 max-w-xl mx-auto">Tous les plans incluent le score VSL, le transcript amélioré par IA et l'accès aux données Meta + TikTok. Sans surprise.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map(({ name, price, popular, accent, features, locked }) => (
            <div key={name} className="rounded-2xl p-6 relative"
              style={{ border: popular ? `2px solid ${accent}` : '1px solid #E5E7EB', boxShadow: popular ? `0 8px 40px rgba(249,115,22,0.12)` : '0 2px 8px rgba(0,0,0,0.04)' }}>
              {popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-black text-white whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', boxShadow: '0 4px 14px rgba(249,115,22,0.4)' }}>
                  ★ Le plus populaire
                </div>
              )}
              <p className="text-sm font-bold mb-1 text-zinc-500">{name}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-black" style={{ color: popular ? accent : '#111827' }}>{price}€</span>
                <span className="text-sm text-zinc-400">/mois</span>
              </div>
              <Link href="/login"
                className="block w-full text-center py-3 rounded-xl font-semibold text-sm mb-6 transition-all"
                style={{
                  background: popular ? `linear-gradient(135deg, #F97316, #FB923C)` : '#F8F9FB',
                  color: popular ? '#fff' : '#374151',
                  border: popular ? 'none' : '1px solid #E5E7EB',
                  boxShadow: popular ? '0 4px 14px rgba(249,115,22,0.3)' : 'none',
                }}>
                Commencer maintenant →
              </Link>
              <ul className="space-y-2.5">
                {features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-700">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black"
                      style={{ background: `${accent}15`, color: accent }}>✓</span>
                    {f}
                  </li>
                ))}
                {locked.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-300 line-through">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-xs bg-zinc-100 text-zinc-300">✗</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-zinc-400 mt-8">
          Annulation à tout moment · Aucun engagement · Sans CB pour démarrer
        </p>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQSection() {
  const faqs = [
    { q: "Qu'est-ce qui différencie TrackAds des autres outils ?", a: "TrackAds est le seul outil qui combine veille publicitaire ET génération de vidéos VSL motion design. Le score VSL + transcript amélioré par IA est inclus dans tous nos plans. Et nos tarifs sont deux fois inférieurs au marché." },
    { q: "Les données sont-elles à jour ?", a: "Oui. Le mode scraping continu met à jour la base toutes les 30 secondes (plan Pro). Le plan Starter reçoit des mises à jour quotidiennes. Les données couvrent Meta Ad Library et TikTok Creative Center." },
    { q: "Comment fonctionne le score VSL par Claude ?", a: "Claude analyse le texte de l'ad sur 5 dimensions : force du hook, impact émotionnel, clarté de la structure, force du CTA et rythme/pacing. Chaque dimension est notée sur 10, avec un score global sur 100 et des suggestions d'amélioration détaillées." },
    { q: "Est-ce que je peux annuler à tout moment ?", a: "Oui, aucun engagement. Annulation en 1 clic depuis votre espace. Votre accès reste actif jusqu'à la fin de la période payée." },
    { q: "Y a-t-il un essai gratuit ?", a: "Le plan Starter est très accessible à 29€. On n'offre pas d'essai gratuit illimité pour éviter les abus de données, mais vous pouvez explorer les fonctionnalités de base sans CB à l'inscription." },
  ]
  return (
    <section className="py-24 max-w-3xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black mb-3 text-zinc-900">Questions fréquentes</h2>
        <p className="text-zinc-500">Tout ce qu'il faut savoir avant de rejoindre TrackAds.</p>
      </div>
      <div className="space-y-2">
        {faqs.map(({ q, a }, i) => (
          <FAQItem key={i} question={q} answer={a} />
        ))}
      </div>
    </section>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #FDEBD0' }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-zinc-50 transition-colors">
        <span className="font-semibold text-sm pr-4 text-zinc-800">{question}</span>
        <span className="flex-shrink-0 text-zinc-400 transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'none' }}>↓</span>
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm leading-relaxed text-zinc-500" style={{ borderTop: '1px solid #FDEBD0' }}>
          <div className="pt-4">{answer}</div>
        </div>
      )}
    </div>
  )
}

// ─── FINAL CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="py-32 px-6" style={{ background: '#FFF5EC', borderTop: '1px solid #FDEBD0' }}>
      <div className="max-w-3xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden"
        style={{ border: '1px solid rgba(249,115,22,0.2)', boxShadow: '0 8px 40px rgba(249,115,22,0.08)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(249,115,22,0.06) 0%, transparent 60%)' }} />
        <div className="relative">
          <div className="text-4xl mb-5">⚡</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-zinc-900">
            Commencez à espionner<br />
            <span style={{ color: '#F97316' }}>ce qui scale en ce moment.</span>
          </h2>
          <p className="text-lg mb-8 text-zinc-500">
            Rejoignez les infopreneurs qui utilisent TrackAds pour s'inspirer des meilleures pubs et créer des VSL qui convertissent.
          </p>
          <Link href="/login"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-lg text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', boxShadow: '0 8px 40px rgba(249,115,22,0.35)' }}>
            Créer mon compte gratuitement →
          </Link>
          <p className="text-xs mt-4 text-zinc-400">Connexion avec Google · Sans CB · En 30 secondes</p>
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-8 px-6" style={{ borderTop: '1px solid #FDEBD0' }}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <Logo />
        <p className="text-sm text-zinc-400">© 2025 TrackAds. Tous droits réservés.</p>
        <div className="flex gap-6">
          {['Mentions légales', 'CGU', 'Affiliation'].map(item => (
            <a key={item} href={item === 'Affiliation' ? '/affiliation' : '#'}
              className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors">
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <Link href="/landing" className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', boxShadow: '0 4px 12px rgba(249,115,22,0.3)' }}>
        <span className="text-white font-black text-sm">S</span>
      </div>
      <span className="font-black text-lg tracking-tight text-zinc-900">TrackAds</span>
    </Link>
  )
}
