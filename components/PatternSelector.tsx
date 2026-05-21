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
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
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

function PatternCard({
  pattern,
  isSelected,
  onClick,
}: {
  pattern: PatternInfo
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-xl border p-3 transition-all duration-200 ${
        isSelected
          ? 'border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/10'
          : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900'
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-lg">{pattern.emoji}</span>
        <div>
          <span className={`font-bold text-sm ${isSelected ? 'text-violet-300' : 'text-white'}`}>
            {pattern.name}
          </span>
          <span className="text-zinc-500 text-xs ml-2">{pattern.tagline}</span>
        </div>
      </div>

      {isSelected && (
        <div className="mt-2 space-y-2">
          <p className="text-zinc-400 text-xs leading-relaxed">{pattern.description}</p>

          <div className="flex flex-wrap gap-1 mt-2">
            {pattern.structure.map((step) => (
              <span
                key={step.phase}
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: step.color + '20',
                  color: step.color,
                  border: `1px solid ${step.color}40`,
                }}
              >
                {step.phase}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-1 mt-1">
            {pattern.bestFor.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-2 p-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
            <p className="text-xs text-zinc-500 mb-1">Exemple de hook :</p>
            <p className="text-xs text-zinc-300 italic">"{pattern.exampleHook}"</p>
          </div>
        </div>
      )}
    </button>
  )
}
