'use client'
import { ProductBrief, VideoFormat, VSLPattern } from '@/lib/types'

interface Props {
  brief: ProductBrief
  onChange: (brief: ProductBrief) => void
  onGenerate: () => void
  loading: boolean
}

const inputClass =
  'w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors'

const labelClass = 'block text-xs font-medium text-zinc-400 mb-1'

export default function BriefForm({ brief, onChange, onGenerate, loading }: Props) {
  const set = (key: keyof ProductBrief, value: string | number) =>
    onChange({ ...brief, [key]: value })

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Brief produit
      </h2>

      <div className="space-y-3">
        <div>
          <label className={labelClass}>Nom du produit *</label>
          <input
            className={inputClass}
            placeholder="ex: IA Manager, Notion Pro..."
            value={brief.product}
            onChange={(e) => set('product', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Cible audience *</label>
          <input
            className={inputClass}
            placeholder="ex: Freelances 25-40 ans qui veulent..."
            value={brief.target}
            onChange={(e) => set('target', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Douleur principale *</label>
          <textarea
            className={inputClass + ' resize-none h-16'}
            placeholder="ex: Travaillent 60h/semaine sans résultats, ne savent pas comment..."
            value={brief.mainPain}
            onChange={(e) => set('mainPain', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Ta solution *</label>
          <textarea
            className={inputClass + ' resize-none h-16'}
            placeholder="ex: Méthode en 3 étapes pour générer 10k€/mois en utilisant l'IA..."
            value={brief.solution}
            onChange={(e) => set('solution', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>L'offre (ce qu'ils reçoivent) *</label>
          <textarea
            className={inputClass + ' resize-none h-16'}
            placeholder="ex: Formation complète 8 modules + templates IA + coaching live mensuel..."
            value={brief.offer}
            onChange={(e) => set('offer', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Prix</label>
            <input
              className={inputClass}
              placeholder="ex: 497€"
              value={brief.price || ''}
              onChange={(e) => set('price', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Garantie</label>
            <input
              className={inputClass}
              placeholder="ex: 30 jours satisfait ou remboursé"
              value={brief.guarantee || ''}
              onChange={(e) => set('guarantee', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Témoignages (optionnel)</label>
          <textarea
            className={inputClass + ' resize-none h-16'}
            placeholder="ex: Alexis: 12k€ en 45 jours | Enzo: 8k€ le premier mois..."
            value={brief.testimonials?.join('\n') || ''}
            onChange={(e) =>
              onChange({ ...brief, testimonials: e.target.value.split('\n').filter(Boolean) })
            }
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Format</label>
            <select
              className={inputClass}
              value={brief.format}
              onChange={(e) => set('format', e.target.value as VideoFormat)}
            >
              <option value="16:9">16:9 (YouTube)</option>
              <option value="9:16">9:16 (TikTok/Reel)</option>
              <option value="1:1">1:1 (Instagram)</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Langue</label>
            <select
              className={inputClass}
              value={brief.language}
              onChange={(e) => set('language', e.target.value as 'fr' | 'en')}
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Durée (sec)</label>
            <select
              className={inputClass}
              value={brief.durationSeconds}
              onChange={(e) => set('durationSeconds', parseInt(e.target.value))}
            >
              <option value={60}>60s</option>
              <option value={90}>90s</option>
              <option value={120}>120s</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={loading || !brief.product || !brief.mainPain || !brief.solution}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
          bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-400
          shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Génération en cours...
          </span>
        ) : (
          '✦ Générer le script VSL'
        )}
      </button>
    </div>
  )
}
