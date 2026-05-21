'use client'
import { useState } from 'react'
import { VSLScript, Scene, SceneType, AnimationType, SceneStyle } from '@/lib/types'

interface Props {
  script: VSLScript
  onChange: (script: VSLScript) => void
  onRender: () => void
  renderLoading: boolean
}

const SCENE_TYPE_LABELS: Record<SceneType, string> = {
  hook: '🎯 Hook',
  problem: '⚠️ Problème',
  agitate: '🔥 Agitation',
  solution: '✅ Solution',
  proof: '📊 Preuve',
  cta: '🚀 CTA',
  story: '📖 Histoire',
  features: '⚡ Features',
  testimonials: '💬 Témoignages',
  offer: '🎁 Offre',
}

const SCENE_COLORS: Record<SceneType, string> = {
  hook: '#F5A623',
  problem: '#FF3B30',
  agitate: '#FF9500',
  solution: '#00D26A',
  proof: '#00C7BE',
  cta: '#7B61FF',
  story: '#AF52DE',
  features: '#00C7BE',
  testimonials: '#34C759',
  offer: '#F5A623',
}

export default function ScriptEditor({ script, onChange, onRender, renderLoading }: Props) {
  const [activeScene, setActiveScene] = useState<string>(script.scenes[0]?.id || '')
  const [jsonMode, setJsonMode] = useState(false)
  const [jsonText, setJsonText] = useState(JSON.stringify(script, null, 2))
  const [jsonError, setJsonError] = useState<string | null>(null)

  const totalSeconds = Math.round(script.totalFrames / script.fps)
  const totalActual = script.scenes.reduce((s, sc) => s + sc.durationFrames, 0)

  const updateScene = (sceneId: string, updates: Partial<Scene>) => {
    const newScenes = script.scenes.map((s) =>
      s.id === sceneId ? { ...s, ...updates } : s
    )
    onChange({ ...script, scenes: newScenes })
  }

  const updateSceneContent = (sceneId: string, key: string, value: string | string[]) => {
    const scene = script.scenes.find((s) => s.id === sceneId)
    if (!scene) return
    updateScene(sceneId, {
      content: { ...scene.content, [key]: value },
    })
  }

  const handleJsonSave = () => {
    try {
      const parsed = JSON.parse(jsonText)
      onChange(parsed)
      setJsonError(null)
    } catch (e) {
      setJsonError('JSON invalide')
    }
  }

  const activeSceneData = script.scenes.find((s) => s.id === activeScene)

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Script généré</h2>
          <p className="text-xs text-zinc-500">
            {script.scenes.length} scènes · {totalSeconds}s · {script.meta.pattern} · {script.meta.format}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setJsonText(JSON.stringify(script, null, 2))
              setJsonMode(!jsonMode)
            }}
            className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
          >
            {jsonMode ? 'Éditeur' : 'JSON brut'}
          </button>
          <button
            onClick={onRender}
            disabled={renderLoading}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold text-xs hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-40 shadow-lg shadow-amber-500/20"
          >
            {renderLoading ? (
              <>
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Rendu...
              </>
            ) : (
              <>▶ Rendre la vidéo</>
            )}
          </button>
        </div>
      </div>

      {/* Frame warning */}
      {Math.abs(totalActual - script.totalFrames) > 10 && (
        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
          ⚠️ Durée réelle : {Math.round(totalActual / 30)}s ({totalActual} frames) vs cible {script.totalFrames} frames
        </div>
      )}

      {jsonMode ? (
        <div className="flex-1 flex flex-col gap-2">
          <textarea
            className="flex-1 w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-green-400 font-mono focus:outline-none focus:border-violet-500 resize-none min-h-96"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
          />
          {jsonError && <p className="text-red-400 text-xs">{jsonError}</p>}
          <button
            onClick={handleJsonSave}
            className="w-full py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
          >
            Appliquer le JSON
          </button>
        </div>
      ) : (
        <div className="flex gap-3 flex-1 min-h-0">
          {/* Scene list */}
          <div className="w-40 flex-shrink-0 space-y-1 overflow-y-auto">
            {script.scenes.map((scene, i) => (
              <button
                key={scene.id}
                onClick={() => setActiveScene(scene.id)}
                className={`w-full text-left px-2 py-2 rounded-lg transition-all ${
                  activeScene === scene.id
                    ? 'bg-zinc-800 border border-zinc-700'
                    : 'hover:bg-zinc-900/50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: SCENE_COLORS[scene.type] }}
                  />
                  <span className="text-xs font-medium text-white truncate">
                    {SCENE_TYPE_LABELS[scene.type]}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 mt-0.5 ml-3">
                  {Math.round(scene.durationFrames / 30)}s
                </p>
              </button>
            ))}
          </div>

          {/* Scene editor */}
          {activeSceneData && (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              <div
                className="h-1 rounded-full"
                style={{ backgroundColor: SCENE_COLORS[activeSceneData.type] + '60' }}
              />

              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Type de scène</label>
                <select
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500"
                  value={activeSceneData.type}
                  onChange={(e) => updateScene(activeSceneData.id, { type: e.target.value as SceneType })}
                >
                  {Object.entries(SCENE_TYPE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Headline *</label>
                <textarea
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-violet-500 resize-none h-16"
                  value={activeSceneData.content.headline}
                  onChange={(e) => updateSceneContent(activeSceneData.id, 'headline', e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Sous-texte</label>
                <input
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500"
                  value={activeSceneData.content.subtext || ''}
                  onChange={(e) => updateSceneContent(activeSceneData.id, 'subtext', e.target.value)}
                  placeholder="Texte secondaire optionnel..."
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1 block">
                  Bullets (une par ligne)
                </label>
                <textarea
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500 resize-none h-24 font-mono"
                  value={(activeSceneData.content.bullets || []).join('\n')}
                  onChange={(e) =>
                    updateSceneContent(
                      activeSceneData.id,
                      'bullets',
                      e.target.value.split('\n').filter(Boolean)
                    )
                  }
                  placeholder="Point 1&#10;Point 2&#10;Point 3"
                />
              </div>

              {activeSceneData.content.metric && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Valeur métrique</label>
                    <input
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500"
                      value={activeSceneData.content.metric.value}
                      onChange={(e) =>
                        updateScene(activeSceneData.id, {
                          content: {
                            ...activeSceneData.content,
                            metric: { ...activeSceneData.content.metric!, value: e.target.value },
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Label</label>
                    <input
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500"
                      value={activeSceneData.content.metric.label}
                      onChange={(e) =>
                        updateScene(activeSceneData.id, {
                          content: {
                            ...activeSceneData.content,
                            metric: { ...activeSceneData.content.metric!, label: e.target.value },
                          },
                        })
                      }
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Animation</label>
                  <select
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500"
                    value={activeSceneData.animation}
                    onChange={(e) => updateScene(activeSceneData.id, { animation: e.target.value as AnimationType })}
                  >
                    <option value="glitch">Glitch</option>
                    <option value="slide">Slide</option>
                    <option value="pop">Pop</option>
                    <option value="counter">Counter</option>
                    <option value="stagger">Stagger</option>
                    <option value="zoom">Zoom</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Durée (sec)</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500"
                    value={Math.round(activeSceneData.durationFrames / 30)}
                    onChange={(e) =>
                      updateScene(activeSceneData.id, {
                        durationFrames: parseInt(e.target.value) * 30,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
