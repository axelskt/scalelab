'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import {
  Home, BarChart2, Users, GitBranch, Leaf,
  Zap, ScanSearch, Star, LayoutDashboard, Settings,
  LogOut, CreditCard, Share2, ChevronRight, Sparkles
} from 'lucide-react'

const NAV = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/ads', label: 'Ads', badge: '1.9M+', icon: BarChart2 },
  { href: '/creators', label: 'Créateurs', badge: '20K+', icon: Users },
  { href: '/tunnels', label: 'Tunnels', icon: GitBranch },
  { href: '/organic', label: 'Organique', soon: true, icon: Leaf },
]

const TOOLS = [
  { href: '/vsl', label: 'VSL Generator', accent: true, icon: Zap },
  { href: '/analyzer', label: 'Analyseur', icon: ScanSearch },
  { href: '/favorites', label: 'Favoris', icon: Star },
  { href: '/workspace', label: 'Workspace', icon: LayoutDashboard },
  { href: '/settings', label: 'Paramètres', icon: Settings },
]

export default function Sidebar() {
  const path = usePathname()
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const userName = session?.user?.name || 'Utilisateur'
  const userEmail = session?.user?.email || ''
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <aside className="w-[200px] flex-shrink-0 h-full flex flex-col relative" style={{ background: '#FAF7F2', borderRight: '1px solid rgba(28,25,23,0.08)' }}>

      {/* Logo */}
      <div className="h-14 flex items-center px-5" style={{ borderBottom: '1px solid rgba(28,25,23,0.08)' }}>
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: '#F97316', boxShadow: '0 0 12px rgba(249,115,22,0.3)' }}>
            <svg width="17" height="17" viewBox="0 0 32 32" fill="none">
              <polyline points="6,22 12,15 18,17 26,8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="26" cy="8" r="3" fill="white"/>
            </svg>
          </div>
          <span className="font-black text-sm tracking-tight" style={{ color: '#1C1917' }}>ScaleLab</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {NAV.map((item) => {
          const active = path === item.href || (item.href !== '/' && path.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.soon ? '#' : item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all group"
              style={{
                background: active ? 'rgba(249,115,22,0.1)' : 'transparent',
                color: active ? '#F97316' : 'rgba(28,25,23,0.5)',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#1C1917' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(28,25,23,0.5)' }}
            >
              <Icon size={14} strokeWidth={active ? 2.5 : 2} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                  style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316', fontSize: 10 }}>
                  {item.badge}
                </span>
              )}
              {item.soon && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(28,25,23,0.06)', color: 'rgba(28,25,23,0.3)', fontSize: 10 }}>
                  Soon
                </span>
              )}
            </Link>
          )
        })}

        {/* Divider */}
        <div className="pt-5 pb-2 px-3">
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(28,25,23,0.25)', fontSize: 10 }}>
            Outils
          </p>
        </div>

        {TOOLS.map((item) => {
          const active = path.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: active ? (item.accent ? 'rgba(249,115,22,0.1)' : 'rgba(28,25,23,0.05)') : 'transparent',
                color: active ? (item.accent ? '#F97316' : '#1C1917') : item.accent ? 'rgba(249,115,22,0.75)' : 'rgba(28,25,23,0.5)',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = item.accent ? '#F97316' : '#1C1917' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = item.accent ? 'rgba(249,115,22,0.75)' : 'rgba(28,25,23,0.5)' }}
            >
              <Icon size={14} strokeWidth={active ? 2.5 : 2} />
              <span className="flex-1">{item.label}</span>
              {item.accent && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                  style={{ background: 'rgba(249,115,22,0.12)', color: '#F97316', fontSize: 9 }}>
                  NEW
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-3 relative" ref={menuRef} style={{ borderTop: '1px solid rgba(28,25,23,0.08)' }}>

        {/* Dropdown menu */}
        {menuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 rounded-xl overflow-hidden shadow-xl z-50"
            style={{ background: '#FFFFFF', border: '1px solid rgba(28,25,23,0.1)' }}>

            {/* User info */}
            <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(28,25,23,0.07)' }}>
              <p className="text-xs font-black truncate" style={{ color: '#1C1917' }}>{userName}</p>
              <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(28,25,23,0.4)', fontSize: 11 }}>{userEmail}</p>
            </div>

            {/* Plan */}
            <div className="px-3 py-2" style={{ borderBottom: '1px solid rgba(28,25,23,0.07)' }}>
              <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group"
                style={{ background: 'rgba(249,115,22,0.06)', color: '#1C1917' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(249,115,22,0.06)'}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={13} style={{ color: '#F97316' }} />
                  <span>Plans</span>
                  <span className="px-1.5 py-0.5 rounded-full font-bold"
                    style={{ background: 'rgba(28,25,23,0.08)', color: 'rgba(28,25,23,0.45)', fontSize: 9 }}>
                    FREE
                  </span>
                </div>
                <ChevronRight size={12} style={{ color: 'rgba(28,25,23,0.3)' }} />
              </button>
            </div>

            {/* Menu items */}
            <div className="px-3 py-2 space-y-0.5">
              <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                style={{ color: 'rgba(28,25,23,0.55)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(28,25,23,0.05)'; e.currentTarget.style.color = '#1C1917' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(28,25,23,0.55)' }}
              >
                <CreditCard size={13} />
                <span>Facturation</span>
              </button>

              <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                style={{ color: 'rgba(28,25,23,0.55)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(28,25,23,0.05)'; e.currentTarget.style.color = '#1C1917' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(28,25,23,0.55)' }}
              >
                <Share2 size={13} />
                <span>Affiliation</span>
              </button>
            </div>

            {/* Sign out */}
            <div className="px-3 py-2" style={{ borderTop: '1px solid rgba(28,25,23,0.07)' }}>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                style={{ color: 'rgba(220,38,38,0.7)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.06)'; e.currentTarget.style.color = '#DC2626' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(220,38,38,0.7)' }}
              >
                <LogOut size={13} />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        )}

        {/* User trigger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer transition-all"
          style={{ background: menuOpen ? 'rgba(28,25,23,0.07)' : 'rgba(28,25,23,0.04)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(28,25,23,0.07)'}
          onMouseLeave={e => e.currentTarget.style.background = menuOpen ? 'rgba(28,25,23,0.07)' : 'rgba(28,25,23,0.04)'}
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #F97316, #7C3AED)' }}>
            {userInitial}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-semibold truncate" style={{ color: '#1C1917' }}>{userName}</p>
            <p className="text-xs truncate" style={{ color: 'rgba(28,25,23,0.35)', fontSize: 10 }}>Free</p>
          </div>
          <div className="flex-shrink-0" style={{ color: 'rgba(28,25,23,0.3)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="3" cy="7" r="1.2" fill="currentColor"/>
              <circle cx="7" cy="7" r="1.2" fill="currentColor"/>
              <circle cx="11" cy="7" r="1.2" fill="currentColor"/>
            </svg>
          </div>
        </button>
      </div>
    </aside>
  )
}
