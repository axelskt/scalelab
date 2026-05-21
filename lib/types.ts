export type VSLPattern = 'PAS' | 'AIDA' | 'PASTOR' | 'BAB' | 'Story'
export type SceneType = 'hook' | 'problem' | 'agitate' | 'solution' | 'proof' | 'cta' | 'story' | 'features' | 'testimonials' | 'offer'
export type AnimationType = 'glitch' | 'slide' | 'pop' | 'counter' | 'stagger' | 'zoom'
export type SceneStyle = 'dramatic' | 'proof' | 'energetic' | 'calm' | 'urgent'
export type VideoFormat = '16:9' | '9:16' | '1:1'

export interface SceneContent {
  headline: string
  subtext?: string
  bullets?: string[]
  metric?: { value: string; label: string }
  counterValue?: string
  style: SceneStyle
}

export interface Scene {
  id: string
  type: SceneType
  title: string
  durationFrames: number
  content: SceneContent
  animation: AnimationType
  backgroundColor?: string
  accentColor?: string
}

export interface VSLMeta {
  pattern: VSLPattern
  product: string
  target: string
  offer: string
  price?: string
  guarantee?: string
  duration: number
  format: VideoFormat
  language: 'fr' | 'en'
}

export interface VSLScript {
  meta: VSLMeta
  scenes: Scene[]
  totalFrames: number
  fps: number
}

export interface ProductBrief {
  product: string
  target: string
  mainPain: string
  solution: string
  offer: string
  price?: string
  guarantee?: string
  testimonials?: string[]
  format: VideoFormat
  language: 'fr' | 'en'
  pattern: VSLPattern
  durationSeconds: number
}
