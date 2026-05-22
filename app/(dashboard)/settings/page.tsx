'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { User, Shield, Users, EyeOff, Camera, ArrowUpRight, Plug, Check, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const TABS = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'security', label: 'Sécurité', icon: Shield },
  { id: 'team', label: 'Équipe', icon: Users },
  { id: 'integrations', label: 'Intégrations', icon: Plug },
  { id: 'ignored', label: 'Créateurs ignorés', icon: EyeOff },
]

export default function SettingsPage() {
  const { data: session } = useSession()
  const [tab, setTab] = useState('profile')

  const userName = session?.user?.name || ''
  const userEmail = session?.user?.email || ''
  const userImage = session?.user?.image

  return (
    <div className="min-h-full" style={{ background: '#FFFBF7' }}>
      <div className="max-w-3xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight" style={{ color: '#1C1917' }}>Paramètres</h1>
          <p className="mt-1 text-sm" style={{ color: 'rgba(28,25,23,0.45)' }}>
            Gérez votre profil et vos préférences.
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sub-nav */}
          <aside className="w-44 flex-shrink-0">
            <nav className="space-y-0.5">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left"
                  style={{
                    background: tab === id ? 'rgba(249,115,22,0.1)' : 'transparent',
                    color: tab === id ? '#F97316' : 'rgba(28,25,23,0.5)',
                  }}
                  onMouseEnter={e => { if (tab !== id) e.currentTarget.style.color = '#1C1917' }}
                  onMouseLeave={e => { if (tab !== id) e.currentTarget.style.color = 'rgba(28,25,23,0.5)' }}
                >
                  <Icon size={13} strokeWidth={tab === id ? 2.5 : 2} />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {tab === 'profile' && (
              <ProfileTab name={userName} email={userEmail} image={userImage} />
            )}
            {tab === 'security' && <SecurityTab />}
            {tab === 'team' && <TeamTab />}
            {tab === 'integrations' && <IntegrationsTab />}
            {tab === 'ignored' && <IgnoredTab />}
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-black mb-1" style={{ color: '#1C1917' }}>{title}</h2>
      {desc && <p className="text-xs mb-4" style={{ color: 'rgba(28,25,23,0.45)' }}>{desc}</p>}
      <div className="mt-4">{children}</div>
    </div>
  )
}

function Field({ label, value, disabled }: { label: string; value: string; disabled?: boolean }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(28,25,23,0.55)', letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: 10 }}>
        {label}
      </label>
      <input
        defaultValue={value}
        disabled={disabled}
        className="w-full px-3.5 py-2.5 rounded-xl text-sm transition-all outline-none"
        style={{
          background: disabled ? 'rgba(28,25,23,0.03)' : 'white',
          border: '1px solid rgba(28,25,23,0.1)',
          color: disabled ? 'rgba(28,25,23,0.4)' : '#1C1917',
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      />
    </div>
  )
}

function ProfileTab({ name, email, image }: { name: string; email: string; image?: string | null }) {
  return (
    <div>
      <Section title="Photo de profil">
        <div className="flex items-center gap-4">
          <div className="relative">
            {image ? (
              <img src={image} alt={name} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-black"
                style={{ background: 'linear-gradient(135deg, #F97316, #7C3AED)' }}>
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: 'white', border: '1.5px solid rgba(28,25,23,0.1)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <Camera size={11} style={{ color: '#1C1917' }} />
            </button>
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#1C1917' }}>{name}</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(28,25,23,0.4)' }}>{email}</p>
          </div>
        </div>
      </Section>

      <Section title="Informations">
        <Field label="Nom" value={name} />
        <Field label="Email" value={email} disabled />
        <div className="flex justify-end mt-4">
          <button
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: 'rgba(249,115,22,0.85)' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F97316'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(249,115,22,0.85)'}
          >
            Enregistrer le profil
          </button>
        </div>
      </Section>
    </div>
  )
}

function SecurityTab() {
  const devices = [
    { name: 'Safari', ip: '172.71.118.174', time: 'à l\'instant', current: true },
    { name: 'Safari', ip: '104.23.229.45', time: 'il y a 17h', current: false },
    { name: 'iPhone', ip: '141.101.95.89', time: 'il y a 18h', current: false },
  ]

  return (
    <Section title="Appareils connectés" desc="Maximum 3 appareils actifs. Le plus ancien est automatiquement déconnecté quand la limite est atteinte.">
      <div className="space-y-2">
        {devices.map((d, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{
              background: d.current ? 'rgba(249,115,22,0.05)' : 'rgba(28,25,23,0.02)',
              border: d.current ? '1px solid rgba(249,115,22,0.15)' : '1px solid rgba(28,25,23,0.07)',
            }}>
            <div className="flex items-center gap-3">
              <Shield size={14} style={{ color: d.current ? '#F97316' : 'rgba(28,25,23,0.35)' }} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold" style={{ color: '#1C1917' }}>{d.name}</span>
                  {d.current && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                      style={{ background: 'rgba(249,115,22,0.15)', color: '#F97316', fontSize: 9 }}>
                      Cet appareil
                    </span>
                  )}
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(28,25,23,0.4)', fontSize: 11 }}>{d.ip} · {d.time}</p>
              </div>
            </div>
            {!d.current && (
              <button className="text-xs font-medium transition-all"
                style={{ color: 'rgba(28,25,23,0.4)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#DC2626'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(28,25,23,0.4)'}
              >
                Déconnecter
              </button>
            )}
          </div>
        ))}
      </div>
    </Section>
  )
}

function TeamTab() {
  return (
    <Section title="Équipe" desc="Invitez des collaborateurs à accéder à votre espace partagé.">
      <div className="px-5 py-6 rounded-xl text-center"
        style={{ background: 'rgba(28,25,23,0.02)', border: '1px solid rgba(28,25,23,0.08)' }}>
        <p className="text-sm mb-3" style={{ color: 'rgba(28,25,23,0.55)' }}>
          Votre plan ne permet pas d'inviter des membres.
        </p>
        <button className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all"
          style={{ color: '#F97316' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <ArrowUpRight size={13} />
          Passer au plan Pro ou Business pour inviter des membres
        </button>
      </div>
    </Section>
  )
}

function IntegrationsTab() {
  const integrations = [
    {
      id: 'systeme',
      name: 'Systeme.io',
      desc: 'Synchronise tes contacts et génère des briefs de tunnel.',
      emoji: '🔗',
      href: '/integrations/systeme',
      connected: false,
    },
  ]

  return (
    <Section title="Intégrations" desc="Connecte tes outils externes pour automatiser tes workflows.">
      <div className="space-y-3">
        {integrations.map(int => (
          <div key={int.id} className="flex items-center justify-between px-4 py-4 rounded-xl"
            style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.12)' }}>
                <span className="text-lg">{int.emoji}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold" style={{ color: '#1C1917' }}>{int.name}</p>
                  {int.connected && (
                    <span className="flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(34,197,94,0.1)', color: '#16A34A' }}>
                      <Check size={10} /> Connecté
                    </span>
                  )}
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(28,25,23,0.45)' }}>{int.desc}</p>
              </div>
            </div>
            <Link href={int.href}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex-shrink-0"
              style={{ background: 'rgba(249,115,22,0.08)', color: '#F97316', border: '1px solid rgba(249,115,22,0.15)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(249,115,22,0.15)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(249,115,22,0.08)')}>
              <ExternalLink size={11} /> Configurer
            </Link>
          </div>
        ))}
      </div>
    </Section>
  )
}

function IgnoredTab() {
  return (
    <Section title="Créateurs ignorés" desc="Ces créateurs et leurs ads sont masqués partout dans l'app.">
      <div className="px-5 py-10 rounded-xl text-center"
        style={{ background: 'rgba(28,25,23,0.02)', border: '1px solid rgba(28,25,23,0.08)' }}>
        <EyeOff size={24} className="mx-auto mb-3" style={{ color: 'rgba(28,25,23,0.2)' }} />
        <p className="text-sm" style={{ color: 'rgba(28,25,23,0.4)' }}>
          Aucun créateur ignoré pour l'instant.
        </p>
      </div>
    </Section>
  )
}
