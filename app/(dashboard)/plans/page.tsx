'use client'
import { useState } from 'react'
import { Check, X, ArrowRight, Sparkles } from 'lucide-react'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 27,
    priceYearly: 19,
    features: [
      { label: 'Ads', value: '500/mois', included: true },
      { label: 'Créateurs', value: 'Illimité', included: true },
      { label: 'Tunnels', value: 'Illimité', included: true },
      { label: 'VSL Generator', value: '3/mois', included: true },
      { label: 'Workspace', value: '1 - 2 tags', included: true },
      { label: 'Analyseur', value: 'Non inclus', included: false },
      { label: 'Notifications', value: 'Non inclus', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 57,
    priceYearly: 39,
    popular: true,
    features: [
      { label: 'Ads', value: 'Illimité + Dépenses estimées', included: true, highlight: true },
      { label: 'Créateurs', value: 'Illimité', included: true },
      { label: 'Tunnels', value: 'Illimité + 30 Funnel Hack/mois', included: true, highlight: true },
      { label: 'VSL Generator', value: 'Illimité', included: true },
      { label: 'Workspace', value: '5 - tags illimités', included: true },
      { label: 'Analyseur', value: 'Illimité', included: true },
      { label: 'Notifications', value: '1 adresse email', included: true },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    priceMonthly: 97,
    priceYearly: 67,
    features: [
      { label: 'Ads', value: 'Illimité + Dépenses estimées', included: true, highlight: true },
      { label: 'Créateurs', value: 'Illimité', included: true },
      { label: 'Tunnels', value: 'Illimité + Funnel Hack illimité', included: true, highlight: true },
      { label: 'VSL Generator', value: 'Illimité', included: true },
      { label: 'Workspace', value: '25 - tags illimités', included: true },
      { label: 'Analyseur', value: 'Illimité', included: true },
      { label: 'Notifications', value: '5 adresses email', included: true },
    ],
  },
]

// Simule le plan actuel de l'utilisateur — à remplacer par une vraie vérification DB
const CURRENT_PLAN = 'free'

export default function PlansPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div className="min-h-full" style={{ background: '#FFFBF7' }}>
      <div className="max-w-5xl mx-auto px-8 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#F97316' }}>
            Tarifs
          </p>
          <h1 className="text-4xl font-black tracking-tight mb-8" style={{ color: '#1C1917' }}>
            Choisissez votre plan
          </h1>

          {/* Toggle mensuel/annuel */}
          <div className="inline-flex items-center rounded-full p-1 gap-1"
            style={{ background: 'rgba(28,25,23,0.06)', border: '1px solid rgba(28,25,23,0.08)' }}>
            <button
              onClick={() => setBilling('monthly')}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                background: billing === 'monthly' ? 'white' : 'transparent',
                color: billing === 'monthly' ? '#1C1917' : 'rgba(28,25,23,0.45)',
                boxShadow: billing === 'monthly' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2"
              style={{
                background: billing === 'yearly' ? 'white' : 'transparent',
                color: billing === 'yearly' ? '#1C1917' : 'rgba(28,25,23,0.45)',
                boxShadow: billing === 'yearly' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Annuel
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: billing === 'yearly' ? 'rgba(249,115,22,0.1)' : 'rgba(249,115,22,0.12)', color: '#F97316' }}>
                -30%
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-5 items-start">
          {PLANS.map((plan) => {
            const price = billing === 'monthly' ? plan.priceMonthly : plan.priceYearly
            const isCurrent = CURRENT_PLAN === plan.id
            const isFree = CURRENT_PLAN === 'free'

            return (
              <div key={plan.id} className="relative rounded-2xl"
                style={{
                  border: plan.popular ? '2px solid #F97316' : '1px solid rgba(28,25,23,0.1)',
                  background: 'white',
                  boxShadow: plan.popular ? '0 8px 32px rgba(249,115,22,0.12)' : '0 2px 12px rgba(0,0,0,0.04)',
                  marginTop: plan.popular ? '20px' : '36px',
                }}>

                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 flex justify-center -translate-y-1/2">
                    <div className="px-4 py-1.5 rounded-full text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)' }}>
                      Le plus populaire
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Plan name */}
                  <h2 className="text-lg font-black mb-1" style={{ color: '#1C1917' }}>{plan.name}</h2>

                  {/* Price */}
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-4xl font-black" style={{ color: '#F97316' }}>{price}€</span>
                    <span className="text-sm mb-1.5" style={{ color: 'rgba(28,25,23,0.4)' }}>/mois</span>
                  </div>

                  {/* CTA */}
                  {isCurrent ? (
                    <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all"
                      style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316', border: '1px solid rgba(249,115,22,0.2)' }}>
                      Plan actuel <ArrowRight size={14} />
                    </button>
                  ) : (
                    <a
                      href={`mailto:contact@trackads.fr?subject=Upgrade ${plan.name}&body=Je souhaite passer au plan ${plan.name}.`}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all"
                      style={{
                        background: plan.popular
                          ? 'linear-gradient(135deg, #F97316, #FB923C)'
                          : 'rgba(28,25,23,0.08)',
                        color: plan.popular ? 'white' : '#1C1917',
                        boxShadow: plan.popular ? '0 4px 14px rgba(249,115,22,0.3)' : 'none',
                      }}
                    >
                      Passer au paiement <ArrowRight size={14} />
                    </a>
                  )}

                  {/* Features */}
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f.label} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {f.included ? (
                            <Check size={13} style={{ color: '#F97316', flexShrink: 0 }} />
                          ) : (
                            <X size={13} style={{ color: 'rgba(28,25,23,0.2)', flexShrink: 0 }} />
                          )}
                          <span className="text-xs" style={{ color: f.included ? '#1C1917' : 'rgba(28,25,23,0.35)' }}>
                            {f.label}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-right"
                          style={{ color: f.highlight ? '#F97316' : f.included ? 'rgba(28,25,23,0.55)' : 'rgba(28,25,23,0.25)' }}>
                          {f.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        {/* Free plan note */}
        {CURRENT_PLAN === 'free' && (
          <p className="text-center mt-8 text-xs" style={{ color: 'rgba(28,25,23,0.35)' }}>
            Vous êtes actuellement sur le plan <strong>Gratuit</strong> · Sans carte bancaire requise pour commencer
          </p>
        )}

      </div>
    </div>
  )
}
