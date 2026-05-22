'use client'
import { useState } from 'react'
import { Key, Check, X, Users, Mail, ArrowLeft, ExternalLink, RefreshCw, Zap } from 'lucide-react'
import Link from 'next/link'

interface Contact {
  id: number
  email: string
  firstName?: string
  lastName?: string
  createdAt: string
  tags?: { name: string }[]
}

export default function SystemeIntegrationPage() {
  const [apiKey, setApiKey] = useState('')
  const [saved, setSaved] = useState(false)
  const [testing, setTesting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [totalContacts, setTotalContacts] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  async function testConnection() {
    if (!apiKey.trim()) return
    setTesting(true)
    setStatus('idle')
    setErrorMsg('')

    try {
      const res = await fetch(`/api/systeme?resource=contacts&apiKey=${encodeURIComponent(apiKey)}`)
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error || 'Connexion échouée')
      } else {
        setStatus('ok')
        setContacts(data.items || data.contacts || [])
        setTotalContacts(data.totalItems || data.total || (data.items || []).length)
        // Save to localStorage
        localStorage.setItem('systeme_api_key', apiKey)
        setSaved(true)
      }
    } catch {
      setStatus('error')
      setErrorMsg('Impossible de contacter l\'API')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-full" style={{ background: '#FFFBF7' }}>
      <div className="max-w-2xl mx-auto px-8 py-10">

        {/* Back */}
        <Link href="/settings" className="inline-flex items-center gap-1.5 text-xs font-medium mb-8 transition-all"
          style={{ color: 'rgba(28,25,23,0.45)' }}
          onMouseEnter={e => e.currentTarget.style.color = '#1C1917'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(28,25,23,0.45)'}>
          <ArrowLeft size={13} /> Retour aux paramètres
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.15)' }}>
            <span className="text-2xl">🔗</span>
          </div>
          <div>
            <h1 className="text-xl font-black" style={{ color: '#1C1917' }}>Systeme.io</h1>
            <p className="text-sm" style={{ color: 'rgba(28,25,23,0.5)' }}>
              Connecte ton compte pour synchroniser tes contacts et générer des tunnels.
            </p>
          </div>
        </div>

        {/* API Key */}
        <div className="p-5 rounded-2xl mb-5"
          style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Key size={14} style={{ color: '#F97316' }} />
            <h2 className="text-sm font-black" style={{ color: '#1C1917' }}>Clé API</h2>
          </div>

          <p className="text-xs mb-3" style={{ color: 'rgba(28,25,23,0.5)' }}>
            Trouve ta clé API dans systeme.io → Paramètres → Accès API publique.
          </p>

          <div className="flex gap-3">
            <input
              type="password"
              value={apiKey}
              onChange={e => { setApiKey(e.target.value); setStatus('idle'); setSaved(false) }}
              placeholder="sk-••••••••••••••••••••••••"
              className="flex-1 px-3.5 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(28,25,23,0.03)', border: `1px solid ${status === 'ok' ? 'rgba(34,197,94,0.3)' : status === 'error' ? 'rgba(220,38,38,0.3)' : 'rgba(28,25,23,0.1)'}`, color: '#1C1917' }}
            />
            <button onClick={testConnection} disabled={testing || !apiKey.trim()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex-shrink-0"
              style={{ background: testing ? 'rgba(249,115,22,0.5)' : 'linear-gradient(135deg, #F97316, #FB923C)', boxShadow: testing ? 'none' : '0 4px 14px rgba(249,115,22,0.25)' }}>
              {testing ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Test...</> : <><Zap size={14} /> Connecter</>}
            </button>
          </div>

          {/* Status */}
          {status === 'ok' && (
            <div className="flex items-center gap-2 mt-3 text-xs font-semibold" style={{ color: '#16A34A' }}>
              <Check size={13} /> Connexion réussie — clé sauvegardée
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-2 mt-3 text-xs font-semibold" style={{ color: '#DC2626' }}>
              <X size={13} /> {errorMsg}
            </div>
          )}

          <a href="https://app.systeme.io/settings/public-api" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-4 text-xs transition-all" style={{ color: '#F97316' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            <ExternalLink size={11} /> Ouvrir les paramètres systeme.io
          </a>
        </div>

        {/* Stats if connected */}
        {status === 'ok' && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="p-4 rounded-xl text-center" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}>
                <p className="text-2xl font-black mb-1" style={{ color: '#1C1917' }}>{totalContacts.toLocaleString('fr-FR')}</p>
                <p className="text-xs" style={{ color: 'rgba(28,25,23,0.4)' }}>Contacts</p>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}>
                <p className="text-2xl font-black mb-1" style={{ color: '#1C1917' }}>{contacts.filter(c => c.tags?.length).length}</p>
                <p className="text-xs" style={{ color: 'rgba(28,25,23,0.4)' }}>Avec tags</p>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}>
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }} />
                  <span className="text-xs font-bold" style={{ color: '#16A34A' }}>Actif</span>
                </div>
                <p className="text-xs" style={{ color: 'rgba(28,25,23,0.4)' }}>Statut sync</p>
              </div>
            </div>

            {/* Contacts list */}
            {contacts.length > 0 && (
              <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(28,25,23,0.08)' }}>
                <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid rgba(28,25,23,0.06)' }}>
                  <div className="flex items-center gap-2">
                    <Users size={13} style={{ color: '#F97316' }} />
                    <span className="text-xs font-black" style={{ color: '#1C1917' }}>Derniers contacts</span>
                  </div>
                  <button className="text-xs font-medium transition-all" style={{ color: 'rgba(28,25,23,0.4)' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#1C1917'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(28,25,23,0.4)'}>
                    <RefreshCw size={12} />
                  </button>
                </div>
                {contacts.slice(0, 8).map((c, i) => (
                  <div key={c.id} className="flex items-center gap-3 px-5 py-3"
                    style={{ borderBottom: i < Math.min(contacts.length, 8) - 1 ? '1px solid rgba(28,25,23,0.05)' : 'none' }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: `hsl(${(c.id * 47) % 360}, 65%, 50%)` }}>
                      {(c.firstName || c.email)[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: '#1C1917' }}>
                        {c.firstName || c.email.split('@')[0]}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'rgba(28,25,23,0.4)', fontSize: 10 }}>{c.email}</p>
                    </div>
                    {c.tags?.length ? (
                      <span className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: 'rgba(249,115,22,0.08)', color: '#F97316', fontSize: 10 }}>
                        {c.tags[0].name}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* What's available */}
        <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(28,25,23,0.03)', border: '1px solid rgba(28,25,23,0.07)' }}>
          <p className="text-xs font-black mb-3" style={{ color: '#1C1917' }}>Ce que permet l'intégration</p>
          <div className="space-y-2">
            {[
              { icon: '✓', label: 'Synchroniser tes contacts systeme.io', ok: true },
              { icon: '✓', label: 'Voir les tags et segments de ta liste', ok: true },
              { icon: '✓', label: 'Générer un brief de tunnel à recréer manuellement', ok: true },
              { icon: '✗', label: 'Créer des pages automatiquement (non supporté par l\'API systeme.io)', ok: false },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2.5 text-xs"
                style={{ color: item.ok ? '#1C1917' : 'rgba(28,25,23,0.35)' }}>
                <span style={{ color: item.ok ? '#22C55E' : 'rgba(28,25,23,0.25)', fontWeight: 700 }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
