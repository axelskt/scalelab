'use client'
import { ProductBrief, VideoFormat, VSLPattern } from '@/lib/types'
import SpeechInput from '@/components/SpeechInput'

interface Props {
  brief: ProductBrief
  onChange: (brief: ProductBrief) => void
  onGenerate: () => void
  loading: boolean
}

const inputStyle = {
  background: 'white',
  border: '1px solid rgba(28,25,23,0.12)',
  borderRadius: 10,
  padding: '8px 12px',
  fontSize: 13,
  color: '#1C1917',
  width: '100%',
  outline: 'none',
}

const labelStyle = {
  display: 'block',
  fontSize: 10,
  fontWeight: 600,
  color: 'rgba(28,25,23,0.45)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  marginBottom: 5,
}

export default function BriefForm({ brief, onChange, onGenerate, loading }: Props) {
  const set = (key: keyof ProductBrief, value: string | number) =>
    onChange({ ...brief, [key]: value })

  return (
    <div className="space-y-4">
      <h2 style={{ fontSize: 10, fontWeight: 700, color: 'rgba(28,25,23,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Brief produit
      </h2>

      <div className="space-y-3">
        <div>
          <label style={labelStyle}>Nom du produit *</label>
          <input
            style={inputStyle}
            placeholder="ex: IA Manager, Notion Pro..."
            value={brief.product}
            onChange={(e) => set('product', e.target.value)}
          />
        </div>

        <div>
          <label style={labelStyle}>Cible audience *</label>
          <input
            style={inputStyle}
            placeholder="ex: Freelances 25-40 ans qui veulent..."
            value={brief.target}
            onChange={(e) => set('target', e.target.value)}
          />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Douleur principale *</label>
            <SpeechInput
              lang={brief.language === 'en' ? 'en-US' : 'fr-FR'}
              placeholder="Dicter"
              onTranscript={(t) => set('mainPain', (brief.mainPain ? brief.mainPain + ' ' : '') + t)}
            />
          </div>
          <textarea
            style={{ ...inputStyle, resize: 'none', height: 64 }}
            placeholder="ex: Travaillent 60h/semaine sans résultats, ne savent pas comment..."
            value={brief.mainPain}
            onChange={(e) => set('mainPain', e.target.value)}
          />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Ta solution *</label>
            <SpeechInput
              lang={brief.language === 'en' ? 'en-US' : 'fr-FR'}
              placeholder="Dicter"
              onTranscript={(t) => set('solution', (brief.solution ? brief.solution + ' ' : '') + t)}
            />
          </div>
          <textarea
            style={{ ...inputStyle, resize: 'none', height: 64 }}
            placeholder="ex: Méthode en 3 étapes pour générer 10k€/mois en utilisant l'IA..."
            value={brief.solution}
            onChange={(e) => set('solution', e.target.value)}
          />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>L'offre (ce qu'ils reçoivent) *</label>
            <SpeechInput
              lang={brief.language === 'en' ? 'en-US' : 'fr-FR'}
              placeholder="Dicter"
              onTranscript={(t) => set('offer', (brief.offer ? brief.offer + ' ' : '') + t)}
            />
          </div>
          <textarea
            style={{ ...inputStyle, resize: 'none', height: 64 }}
            placeholder="ex: Formation complète 8 modules + templates IA + coaching live mensuel..."
            value={brief.offer}
            onChange={(e) => set('offer', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label style={labelStyle}>Prix</label>
            <input
              style={inputStyle}
              placeholder="ex: 497€"
              value={brief.price || ''}
              onChange={(e) => set('price', e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Garantie</label>
            <input
              style={inputStyle}
              placeholder="ex: 30 jours satisfait ou remboursé"
              value={brief.guarantee || ''}
              onChange={(e) => set('guarantee', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Témoignages (optionnel)</label>
          <textarea
            style={{ ...inputStyle, resize: 'none', height: 64 }}
            placeholder="ex: Alexis: 12k€ en 45 jours | Enzo: 8k€ le premier mois..."
            value={brief.testimonials?.join('\n') || ''}
            onChange={(e) =>
              onChange({ ...brief, testimonials: e.target.value.split('\n').filter(Boolean) })
            }
          />
        </div>

        {/* Format */}
        <div>
          <label style={labelStyle}>Format</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {([
              { value: '16:9', label: '16:9', sub: 'YouTube' },
              { value: '9:16', label: '9:16', sub: 'TikTok' },
              { value: '1:1',  label: '1:1',  sub: 'Instagram' },
            ] as const).map(f => (
              <button key={f.value} type="button"
                onClick={() => set('format', f.value)}
                style={{
                  flex: 1, padding: '8px 4px', borderRadius: 10, cursor: 'pointer',
                  border: brief.format === f.value ? '1.5px solid #F97316' : '1px solid rgba(28,25,23,0.12)',
                  background: brief.format === f.value ? 'rgba(249,115,22,0.06)' : 'white',
                  textAlign: 'center',
                }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: brief.format === f.value ? '#F97316' : '#1C1917' }}>{f.label}</div>
                <div style={{ fontSize: 10, color: 'rgba(28,25,23,0.4)', marginTop: 2 }}>{f.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Langue */}
        <div>
          <label style={labelStyle}>Langue</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {([
              { value: 'fr', label: '🇫🇷 Français' },
              { value: 'en', label: '🇬🇧 English' },
            ] as const).map(l => (
              <button key={l.value} type="button"
                onClick={() => set('language', l.value)}
                style={{
                  flex: 1, padding: '9px 12px', borderRadius: 10, cursor: 'pointer',
                  border: brief.language === l.value ? '1.5px solid #F97316' : '1px solid rgba(28,25,23,0.12)',
                  background: brief.language === l.value ? 'rgba(249,115,22,0.06)' : 'white',
                  fontSize: 13, fontWeight: 600,
                  color: brief.language === l.value ? '#F97316' : '#1C1917',
                }}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Durée */}
        <div>
          <label style={labelStyle}>Durée</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {([60, 90, 120] as const).map(d => (
              <button key={d} type="button"
                onClick={() => set('durationSeconds', d)}
                style={{
                  flex: 1, padding: '8px 4px', borderRadius: 10, cursor: 'pointer',
                  border: brief.durationSeconds === d ? '1.5px solid #F97316' : '1px solid rgba(28,25,23,0.12)',
                  background: brief.durationSeconds === d ? 'rgba(249,115,22,0.06)' : 'white',
                  textAlign: 'center',
                }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: brief.durationSeconds === d ? '#F97316' : '#1C1917' }}>{d}s</div>
                <div style={{ fontSize: 10, color: 'rgba(28,25,23,0.4)', marginTop: 1 }}>
                  {d === 60 ? 'Court' : d === 90 ? 'Standard' : 'Long'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={loading || !brief.product || !brief.mainPain || !brief.solution}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{
          background: 'linear-gradient(135deg, #F97316, #FB923C)',
          color: 'white',
          boxShadow: '0 4px 14px rgba(249,115,22,0.35)',
        }}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Génération en cours...
          </>
        ) : (
          '✦ Générer le script VSL'
        )}
      </button>
    </div>
  )
}
