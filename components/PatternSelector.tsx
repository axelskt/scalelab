'use client'
import { VSL_PATTERNS, PatternInfo } from '@/lib/patterns'
import { VSLPattern } from '@/lib/types'

interface Props {
  selected: VSLPattern
  onChange: (pattern: VSLPattern) => void
}

export default function PatternSelector({ selected, onChange }: Props) {
  return (
    <div className="space-y-3">
      <h2 style={{ fontSize: 10, fontWeight: 700, color: 'rgba(28,25,23,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Choisir un pattern VSL
      </h2>
      <div className="grid grid-cols-1 gap-2">
        {VSL_PATTERNS.map((pattern) => (
          <PatternCard
            key={pattern.id}
            pattern={pattern}
            isSelected={selected === pattern.id}
            onClick={() => onChange(pattern.id)}
          />
        ))}
      </div>
    </div>
  )
}

function PatternCard({ pattern, isSelected, onClick }: {
  pattern: PatternInfo
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-xl p-3 transition-all duration-200"
      style={{
        border: isSelected ? '1.5px solid #F97316' : '1px solid rgba(28,25,23,0.1)',
        background: isSelected ? 'rgba(249,115,22,0.05)' : 'white',
        boxShadow: isSelected ? '0 2px 12px rgba(249,115,22,0.12)' : 'none',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{pattern.emoji}</span>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-bold text-sm" style={{ color: isSelected ? '#F97316' : '#1C1917' }}>
            {pattern.name}
          </span>
          <span className="text-xs" style={{ color: 'rgba(28,25,23,0.4)' }}>{pattern.tagline}</span>
        </div>
      </div>

      {isSelected && (
        <div className="mt-2 space-y-2">
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(28,25,23,0.6)' }}>
            {pattern.description}
          </p>

          <div className="flex flex-wrap gap-1 mt-2">
            {pattern.structure.map((step) => (
              <span
                key={step.phase}
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: step.color + '18',
                  color: step.color,
                  border: `1px solid ${step.color}35`,
                }}
              >
                {step.phase}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-1">
            {pattern.bestFor.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(28,25,23,0.06)', color: 'rgba(28,25,23,0.55)' }}>
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-2 p-2 rounded-lg" style={{ background: 'rgba(28,25,23,0.04)', border: '1px solid rgba(28,25,23,0.08)' }}>
            <p className="text-xs mb-1" style={{ color: 'rgba(28,25,23,0.35)' }}>Exemple de hook :</p>
            <p className="text-xs italic" style={{ color: 'rgba(28,25,23,0.6)' }}>"{pattern.exampleHook}"</p>
          </div>
        </div>
      )}
    </button>
  )
}
