'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/', label: 'Accueil' },
  { href: '/ads', label: 'Ads', badge: '1.9M+' },
  { href: '/creators', label: 'Créateurs', badge: '20K+' },
  { href: '/tunnels', label: 'Tunnels' },
  { href: '/organic', label: 'Organique', soon: true },
]

const TOOLS = [
  { href: '/vsl', label: 'VSL Generator', accent: true },
  { href: '/analyzer', label: 'Analyseur' },
  { href: '/favorites', label: 'Favoris' },
  { href: '/workspace', label: 'Workspace' },
  { href: '/settings', label: 'Paramètres' },
]

export default function Sidebar() {
  const path = usePathname()

  return (
    <aside className="w-[200px] flex-shrink-0 h-full flex flex-col" style={{ background: '#FAF7F2', borderRight: '1px solid rgba(28,25,23,0.08)' }}>

      {/* Logo */}
      <div className="h-14 flex items-center px-5" style={{ borderBottom: '1px solid rgba(28,25,23,0.08)' }}>
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', boxShadow: '0 0 12px rgba(249,115,22,0.3)' }}>
            <span className="text-white font-black text-xs">S</span>
          </div>
          <span className="font-black text-sm tracking-tight" style={{ color: '#1C1917' }}>ScaleLab</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">

        {NAV.map((item) => {
          const active = path === item.href || (item.href !== '/' && path.startsWith(item.href))
          return (
            <Link key={item.href} href={item.soon ? '#' : item.href}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group"
              style={{
                background: active ? 'rgba(249,115,22,0.1)' : 'transparent',
                color: active ? '#F97316' : 'rgba(28,25,23,0.45)',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#1C1917' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(28,25,23,0.45)' }}
            >
              <span>{item.label}</span>
              <span className="ml-auto">
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
              </span>
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
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: active ? (item.accent ? 'rgba(249,115,22,0.1)' : 'rgba(28,25,23,0.05)') : 'transparent',
                color: active ? (item.accent ? '#F97316' : '#1C1917') : item.accent ? 'rgba(249,115,22,0.8)' : 'rgba(28,25,23,0.45)',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = item.accent ? '#F97316' : '#1C1917' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = item.accent ? 'rgba(249,115,22,0.8)' : 'rgba(28,25,23,0.45)' }}
            >
              <span>{item.label}</span>
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
      <div className="p-3" style={{ borderTop: '1px solid rgba(28,25,23,0.08)' }}>
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer transition-all"
          style={{ background: 'rgba(28,25,23,0.04)' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #F97316, #7C3AED)' }}>
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: '#1C1917' }}>Axel</p>
            <p className="text-xs truncate" style={{ color: 'rgba(28,25,23,0.35)', fontSize: 10 }}>Pro</p>
          </div>
          <span style={{ color: 'rgba(28,25,23,0.25)', fontSize: 12 }}>⋯</span>
        </div>
      </div>
    </aside>
  )
}
