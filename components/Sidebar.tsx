'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/', icon: '⊞', label: 'Accueil' },
  { href: '/creators', icon: '👤', label: 'Créateurs', badge: '20K+' },
  { href: '/ads', icon: '▷', label: 'Ads', badge: '1.9M+' },
  { href: '/tunnels', icon: '≡', label: 'Tunnels', badge: null, soon: false },
  { href: '/organic', icon: '⊙', label: 'Organique', badge: null, soon: true },
]

const TOOLS = [
  { href: '/workspace', icon: '□', label: 'Workspace' },
  { href: '/favorites', icon: '☆', label: 'Favoris' },
  { href: '/analyzer', icon: '◈', label: 'Analyseur' },
  { href: '/vsl', icon: '✦', label: 'VSL Generator', highlight: true },
  { href: '/settings', icon: '⚙', label: 'Paramètres' },
]

export default function Sidebar() {
  const path = usePathname()

  return (
    <aside className="w-[185px] flex-shrink-0 h-full flex flex-col border-r border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-zinc-200/60 dark:border-zinc-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <span className="text-white text-xs font-black">S</span>
          </div>
          <span className="font-bold text-sm text-zinc-900 dark:text-white tracking-tight">ScaleLab</span>
        </Link>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-zinc-200/60 dark:border-zinc-800">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-zinc-300 transition-colors">
          <span className="text-zinc-400 text-xs">🔍</span>
          <span className="text-xs text-zinc-400 flex-1">Rechercher...</span>
          <span className="text-xs text-zinc-400 bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded">⌘K</span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {NAV.map((item) => {
          const active = path === item.href || (item.href !== '/' && path.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.soon ? '#' : item.href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors group ${
                active
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-medium'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span className="flex-1 text-xs">{item.label}</span>
              {item.badge && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-medium text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400">
                  {item.badge}
                </span>
              )}
              {item.soon && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-medium text-zinc-400 bg-zinc-100 dark:bg-zinc-800">
                  Soon
                </span>
              )}
            </Link>
          )
        })}

        <div className="pt-3 pb-1 px-2.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Outils</p>
        </div>

        {TOOLS.map((item) => {
          const active = path.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                item.highlight
                  ? active
                    ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 font-medium'
                    : 'text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10'
                  : active
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-medium'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-zinc-200/60 dark:border-zinc-800">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-900 dark:text-white truncate">Axel</p>
            <p className="text-xs text-zinc-400 truncate">IA MANAGE...</p>
          </div>
          <span className="text-zinc-400 text-xs">···</span>
        </div>
      </div>
    </aside>
  )
}
