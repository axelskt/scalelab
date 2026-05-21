'use client'
import { useState } from 'react'
import Link from 'next/link'

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center">
        <span className="text-white font-black text-sm">S</span>
      </div>
      <span className="font-black text-lg text-[#1C1917] tracking-tight">ScaleLab</span>
    </div>
  )
}

// Plans pricing pour le calcul
const AVG_PLAN_PRICE = 59 // Prix moyen entre 29€ et 97€
const COMMISSION_RATE = 0.30
const LEVEL2_RATE = 0.10

export default function AffiliationPage() {
  const [referrals, setReferrals] = useState(50)

  const monthlyDirect = Math.round(referrals * AVG_PLAN_PRICE * COMMISSION_RATE)
  const level2Referrals = Math.round(referrals * 0.3) // 30% de tes referrals en ramènent d'autres
  const monthlyLevel2 = Math.round(level2Referrals * AVG_PLAN_PRICE * LEVEL2_RATE)
  const totalMonthly = monthlyDirect + monthlyLevel2
  const totalAnnual = totalMonthly * 12

  const [activeTab, setActiveTab] = useState(0)

  const PARTNER_TYPES = [
    {
      label: 'YouTubers et créateurs',
      icon: '▶',
      title: 'YouTubers et créateurs de contenu',
      desc: 'Vous créez du contenu sur le business ou la creator economy ? Promouvez ScaleLab à votre audience et aidez-la à découvrir les stratégies derrière les funnels les plus performants.',
      detail: 'Sur YouTube, Instagram ou TikTok, nous vous fournissons des vidéos de démo et des extraits de "spy session" prêts à partager.',
    },
    {
      label: 'Coachs',
      icon: '◎',
      title: 'Coaches & Formateurs',
      desc: 'Vous accompagnez des infopreneurs ou des entrepreneurs en ligne ? ScaleLab est l\'outil que vos clients cherchent — et vous touchez 30% à vie sur chaque abonnement.',
      detail: 'Intégrez-le dans vos formations ou recommandez-le en bonus. Chaque client devient une rente mensuelle automatique.',
    },
    {
      label: 'Agences & freelances',
      icon: '◈',
      title: 'Agences & freelances marketing',
      desc: 'Vous gérez des campagnes ou créez des pubs pour des infopreneurs ? ScaleLab est votre avantage concurrentiel — et une source de revenus récurrents.',
      detail: 'Facturez plus cher grâce à la data exclusive. Touchez 30% de commission sur chaque client que vous recommandez.',
    },
    {
      label: 'Blogueurs & médias',
      icon: '✎',
      title: 'Blogueurs & médias spécialisés',
      desc: 'Vous publiez du contenu sur le marketing digital, l\'entrepreneuriat ou l\'infopreunariat ? Votre audience est exactement notre cible.',
      detail: 'Un article de fond sur ScaleLab peut générer des centaines d\'abonnés — et des milliers d\'euros en commissions récurrentes.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#FFFBF7] text-[#1C1917] font-sans">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-[#FFFBF7]/90 backdrop-blur-sm border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-1 bg-white rounded-full px-2 py-1.5 border border-stone-200 shadow-sm">
            {[
              { label: 'Créateurs', href: '/landing#créateurs' },
              { label: 'Ads', href: '/landing#ads' },
              { label: 'Tunnels', href: '/landing#tunnels' },
              { label: 'Tarifs', href: '/landing#tarifs' },
              { label: 'Affiliation', href: '/affiliation', active: true },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${item.active ? 'bg-orange-50 text-[#F97316] font-medium border border-orange-200' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'}`}>
                {item.label}
              </Link>
            ))}
          </div>
          <Link href="/app"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F97316] text-white font-semibold text-sm hover:bg-[#EA6C0A] transition-colors shadow-lg shadow-orange-200">
            Réserver une démo »
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full"
            style={{ background: 'radial-gradient(ellipse at 15% 50%, rgba(249,115,22,0.12) 0%, transparent 60%), radial-gradient(ellipse at 85% 30%, rgba(249,115,22,0.08) 0%, transparent 50%)' }} />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: 'linear-gradient(rgba(249,115,22,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full border border-orange-200 bg-white text-sm font-medium text-[#F97316] mb-8">
            Programme d'affiliation
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
            Le programme d'affiliation<br />
            le plus <span className="text-[#F97316]">rémunérateur</span><br />
            de la Creator Industry.
          </h1>
          <p className="text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Promouvez le seul outil d'intelligence conçu pour scaler les infopreneurs.
            Touchez <strong className="text-stone-700">30% de commission</strong> chaque mois, automatiquement, pour toujours.
          </p>
          <Link href="#calculator"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#F97316] text-white font-bold text-base hover:bg-[#EA6C0A] transition-all shadow-xl shadow-orange-200">
            Créer votre compte affilié →
          </Link>
        </div>

        {/* REVENUE CALCULATOR */}
        <div id="calculator" className="max-w-2xl mx-auto px-6 pb-20">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-lg p-8 space-y-6">
            <div className="text-sm text-stone-400">
              Si je ramène <span className="font-bold text-stone-700">{referrals} referrals</span>/mois
            </div>

            {/* Slider */}
            <div className="space-y-3">
              <input
                type="range" min={1} max={500} value={referrals}
                onChange={e => setReferrals(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #F97316 0%, #F97316 ${(referrals / 500) * 100}%, #e5e7eb ${(referrals / 500) * 100}%, #e5e7eb 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-stone-400">
                <span>0</span><span>250</span><span>500</span>
              </div>
            </div>

            {/* Revenue display */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-[#F97316]">
                  {totalMonthly.toLocaleString('fr-FR')}€
                </span>
                <span className="text-stone-400 text-lg">/mois</span>
              </div>
              <p className="text-stone-500 text-sm mt-1">
                {totalAnnual.toLocaleString('fr-FR')}€ par an
              </p>
            </div>

            {/* Breakdown */}
            <div className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-orange-50 rounded-xl p-3">
                <p className="text-stone-400 text-xs mb-1">Direct (niveau 1)</p>
                <p className="font-black text-[#F97316] text-xl">{monthlyDirect.toLocaleString('fr-FR')}€</p>
                <p className="text-stone-400 text-xs">{referrals} refs × {AVG_PLAN_PRICE}€ × 30%</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-3">
                <p className="text-stone-400 text-xs mb-1">Indirect (niveau 2)</p>
                <p className="font-black text-stone-700 text-xl">{monthlyLevel2.toLocaleString('fr-FR')}€</p>
                <p className="text-stone-400 text-xs">~{level2Referrals} refs × 10%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white border-y border-stone-100 py-12">
        <div className="max-w-3xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[
            { value: '30%', label: 'Commission récurrente' },
            { value: '0€', label: 'Pour commencer' },
            { value: 'À vie', label: 'Durée des commissions' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-4xl md:text-5xl font-black text-stone-900 mb-1">{value}</div>
              <div className="text-sm text-stone-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOR WHO */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-2">Pour qui est notre programme partenaire ?</h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {PARTNER_TYPES.map((type, i) => (
            <button key={i} onClick={() => setActiveTab(i)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all ${activeTab === i ? 'border-[#F97316] bg-orange-50 text-[#F97316]' : 'border-stone-200 text-stone-600 hover:border-stone-300 bg-white'}`}>
              {type.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Illustration */}
          <div className="rounded-2xl border-2 border-[#F97316]/30 bg-gradient-to-br from-orange-50 to-amber-50 p-12 flex items-center justify-center min-h-64">
            <div className="text-center space-y-4">
              <div className="text-7xl">{PARTNER_TYPES[activeTab].icon}</div>
              <div className="flex justify-center gap-4">
                {['🇫🇷', '🇧🇪', '🇨🇭', '🇨🇦'].map(flag => (
                  <span key={flag} className="text-2xl opacity-60">{flag}</span>
                ))}
              </div>
              <p className="text-sm text-stone-400">Marché francophone</p>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black">{PARTNER_TYPES[activeTab].title}</h3>
            <p className="text-stone-600 leading-relaxed">{PARTNER_TYPES[activeTab].desc}</p>
            <p className="text-stone-500 text-sm leading-relaxed">{PARTNER_TYPES[activeTab].detail}</p>
            <Link href="/app"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F97316] text-white font-semibold text-sm hover:bg-[#EA6C0A] transition-colors">
              Devenir partenaire →
            </Link>
          </div>
        </div>
      </section>

      {/* 2-LEVEL COMMISSIONS */}
      <section className="bg-white py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-3">Gagnez automatiquement sur 2 niveaux.</h2>
          <p className="text-stone-500 text-lg mb-12">
            Partagez votre lien — touchez des commissions récurrentes même quand vos referrals en recommandent d'autres.
          </p>

          <div className="space-y-0">
            {/* Niveau 0: Vous */}
            <div className="flex items-center gap-4 p-5 rounded-2xl border-2 border-[#F97316] bg-orange-50">
              <div className="w-10 h-10 rounded-xl bg-[#F97316] flex items-center justify-center text-white text-lg flex-shrink-0">★</div>
              <div className="text-left">
                <p className="font-bold text-stone-900">Vous — le référent</p>
                <p className="text-sm text-stone-500">Partagez votre lien d'affiliation</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center">
                <div className="w-px h-4 bg-stone-200" />
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-xs font-bold text-[#F97316]">
                  ↓ 30% de commission directe
                </div>
                <div className="w-px h-4 bg-stone-200" />
              </div>
            </div>

            {/* Niveau 1 */}
            <div className="flex items-center gap-4 p-5 rounded-2xl border border-stone-200 bg-white">
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 text-lg flex-shrink-0">👤</div>
              <div className="text-left flex-1">
                <p className="font-bold text-stone-900">Vos referrals directs</p>
                <p className="text-sm text-stone-500">S'abonnent via votre lien</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-[#F97316]">30%</p>
                <p className="text-xs font-bold text-stone-400">POUR VOUS</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center">
                <div className="w-px h-4 bg-stone-200" />
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-500">
                  ↓ 10% de commission indirecte
                </div>
                <div className="w-px h-4 bg-stone-200" />
              </div>
            </div>

            {/* Niveau 2 */}
            <div className="flex items-center gap-4 p-5 rounded-2xl border border-dashed border-stone-200 bg-stone-50/50">
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-300 text-lg flex-shrink-0">👤</div>
              <div className="text-left flex-1">
                <p className="font-bold text-stone-700">Leurs referrals</p>
                <p className="text-sm text-stone-400">S'abonnent via un lien de referral</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-stone-700">10%</p>
                <p className="text-xs font-bold text-stone-400">POUR VOUS</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Link href="/app"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#F97316] text-white font-bold hover:bg-[#EA6C0A] transition-all shadow-lg shadow-orange-200">
              Créer votre compte affilié →
            </Link>
          </div>
        </div>
      </section>

      {/* 3 STEPS */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-[#F97316] tracking-widest uppercase mb-3">Comment ça marche</p>
            <h2 className="text-4xl font-black mb-3">Opérationnel en 3 étapes</h2>
            <p className="text-stone-500">De zéro à revenu passif — plus vite que vous ne le pensez.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { n: 'Étape 01', title: 'Créez votre compte', desc: 'Moins de 2 minutes. Obtenez un lien de tracking unique et un code promo personnel pour votre audience — instantanément.', time: '2 min', highlight: false },
              { n: 'Étape 02', title: 'Partagez votre lien', desc: 'Publiez-le partout ou via votre audience — contenu, bio, newsletter, Discord. Le lien comme le code sont trackés.', time: '10 sec', highlight: false },
              { n: 'Étape 03', title: 'Encaissez chaque mois', desc: '30% par abonnement, payés le 5 du mois. Ça se cumule — plus aucune action requise ensuite.', time: 'À vie', highlight: true },
            ].map(({ n, title, desc, time, highlight }) => (
              <div key={n}
                className={`rounded-2xl p-6 border ${highlight ? 'border-[#F97316] bg-orange-50' : 'border-stone-200 bg-white'}`}>
                <div className="flex items-center gap-2 mb-4">
                  {highlight && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#F97316] text-white font-bold">À vie</span>
                  )}
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${highlight ? 'border-[#F97316] text-[#F97316] bg-white' : 'border-stone-200 text-stone-600'}`}>
                    {n}
                  </span>
                </div>
                <h3 className="text-lg font-black mb-2">{title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-4">{desc}</p>
                <p className="text-xs text-stone-400">{time}</p>
              </div>
            ))}
          </div>

          {/* Benefits + CTA */}
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              {[
                { icon: '↻', title: 'Revenu mensuel récurrent', desc: 'Payé automatiquement chaque mois — pas seulement sur la première vente.' },
                { icon: '⚡', title: 'Commission à vie', desc: 'La commission continue tant que votre referral reste abonné.' },
                { icon: '◎', title: 'Aucun plafond, paiement auto', desc: 'Aucun plafond de gains. Paiement via PayPal le 5 de chaque mois.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3 p-4 rounded-xl border border-stone-100 bg-white">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F97316] flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-stone-900">{title}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center space-y-4">
              <p className="text-sm text-stone-400">Déjà 500+ partenaires gagnent avec ScaleLab</p>
              <div className="flex justify-center gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-200 to-amber-200 border-2 border-white -ml-2 first:ml-0" />
                ))}
                <div className="w-8 h-8 rounded-full bg-[#F97316] border-2 border-white -ml-2 flex items-center justify-center text-white text-xs font-bold">+</div>
              </div>
              <Link href="/app"
                className="block w-full py-3 rounded-xl bg-[#F97316] text-white font-bold hover:bg-[#EA6C0A] transition-colors">
                Commencer à gagner — 2 minutes →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DARK SECTION */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1C1107 0%, #2D1A08 50%, #1C1107 100%)' }} />
        <div className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(249,115,22,0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(249,115,22,0.2) 0%, transparent 50%)' }} />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
            <span className="text-xs font-bold text-[#F97316] tracking-widest uppercase">30% récurrent à vie</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Le revenu qui continue<br />de tomber<br />pendant que vous dormez
          </h2>
          <p className="text-stone-400 text-lg mb-6">
            Chaque abonné que vous apportez vous paie chaque mois.<br />
            Ça se cumule sans aucun effort. Aucun plafond.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-stone-300 mb-10">
            {['✓ Commission récurrente', '✓ Paiement auto mensuel', '✓ Tracking lien + code'].map(item => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <Link href="/app"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#F97316] text-white font-bold text-lg hover:bg-[#EA6C0A] transition-all shadow-2xl shadow-orange-900/40">
            Commencer à gagner — 2 minutes →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-black text-center mb-10">Questions fréquentes</h2>
          <div className="space-y-3">
            {[
              { q: 'Comment fonctionne le paiement ?', a: 'Vos commissions sont calculées automatiquement et versées le 5 de chaque mois via PayPal ou virement bancaire. Aucune action requise de votre part.' },
              { q: 'Puis-je lancer des ads payantes avec mon lien affilié ?', a: 'Oui, vous pouvez faire de la publicité payante avec votre lien. Nous fournissons aussi des créatives prêtes à l\'emploi pour vos campagnes.' },
              { q: 'Comment fonctionne le tracking du lien ?', a: 'Chaque affilié reçoit un lien unique + un code promo personnel. Les deux sont trackés indépendamment dans votre dashboard temps réel.' },
              { q: 'Combien de temps dure ma commission ?', a: 'À vie. Tant que votre referral reste abonné à ScaleLab, vous continuez de toucher 30% de son abonnement chaque mois.' },
              { q: 'Vous avez encore une question ?', a: 'Contactez-nous sur Discord ou par email à affiliation@scalelab.io — réponse sous 24h.' },
            ].map(({ q, a }, i) => (
              <details key={i} className="group border border-stone-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-stone-50 transition-colors list-none">
                  <span className="font-medium text-stone-900 text-sm">{q}</span>
                  <span className="text-stone-400 group-open:text-[#F97316] transition-all ml-4">→</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-4">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-stone-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Logo />
          <p className="text-sm text-stone-400">© 2025 ScaleLab. Tous droits réservés.</p>
          <div className="flex gap-4 text-sm text-stone-400">
            <a href="#" className="hover:text-stone-600">Mentions légales</a>
            <a href="#" className="hover:text-stone-600">CGU</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #F97316;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 0 0 2px #F97316, 0 2px 8px rgba(249,115,22,0.4);
        }
        input[type='range']::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #F97316;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 0 0 2px #F97316;
        }
      `}</style>
    </div>
  )
}
