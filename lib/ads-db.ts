import { readFileSync, writeFileSync, existsSync } from 'fs'
import path from 'path'
import { VSLPattern } from './types'

export type SupportedLanguage = 'fr' | 'en' | 'es' | 'de' | 'pt' | 'it' | 'unknown'

export interface AdEngagement {
  views?: number
  likes?: number
  comments?: number
  shares?: number
  estimated: boolean // true = on a estimé, false = données réelles
}

export interface VSLScoreBreakdown {
  overall: number       // 0-100 — note globale
  hookStrength: number  // 0-10 — force du hook initial
  patternClarity: number // 0-10 — clarté de la structure (PAS/AIDA/etc)
  emotionalImpact: number // 0-10 — impact émotionnel
  ctaStrength: number   // 0-10 — force de l'appel à l'action
  pacing: number        // 0-10 — rythme et fluidité
  strengths: string[]   // ce qui fonctionne bien
  weaknesses: string[]  // ce qui peut être amélioré
}

export interface Transcription {
  raw: string                     // transcript brut
  language: SupportedLanguage
  durationSeconds?: number
  wordCount?: number
  score: VSLScoreBreakdown        // note de la VSL
  improvedVersion?: string        // transcript amélioré par Claude
  improvements?: string[]         // liste des améliorations appliquées
  generatedAt: string
}

export interface ScrapedAd {
  id: string
  source: 'facebook' | 'tiktok'
  advertiser: string
  advertiserPage?: string
  country: string
  language: SupportedLanguage
  startDate: string
  endDate?: string
  runDays: number
  adText: string
  thumbnailUrl?: string
  videoUrl?: string
  adUrl: string
  niche: string[]
  keywords: string[]
  engagement?: AdEngagement
  analysis?: AdAnalysis
  transcription?: Transcription
  scrapedAt: string
  score: number
}

export interface AdAnalysis {
  pattern: VSLPattern
  hook: string
  mainPain: string
  solution: string
  offer: string
  productType: string   // ex: "Formation en ligne", "Coaching 1:1", "SaaS", "Ebook", "Masterclass"
  price: string         // ex: "497€", "Gratuit", "97€/mois", "Non détecté"
  niche: string         // ex: "Marketing digital", "Finance", "Fitness"
  cta: string
  techniques: string[]
  emotionalTriggers: string[]
  urgencyLevel: number  // 1-10
  socialProofLevel: number // 1-10
  overallScore: number  // 1-100
  summary: string
  adaptedScript?: string
}

const DB_PATH = path.join(process.cwd(), 'data', 'ads.json')

interface AdsDatabase {
  ads: ScrapedAd[]
  lastUpdated: string
}

function ensureDataDir() {
  const dir = path.join(process.cwd(), 'data')
  if (!existsSync(dir)) {
    require('fs').mkdirSync(dir, { recursive: true })
  }
}

export function loadAds(): ScrapedAd[] {
  ensureDataDir()
  if (!existsSync(DB_PATH)) {
    return []
  }
  try {
    const db: AdsDatabase = JSON.parse(readFileSync(DB_PATH, 'utf-8'))
    return db.ads || []
  } catch {
    return []
  }
}

export function saveAds(ads: ScrapedAd[]) {
  ensureDataDir()
  const db: AdsDatabase = {
    ads,
    lastUpdated: new Date().toISOString(),
  }
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

export function addOrUpdateAd(ad: ScrapedAd) {
  const ads = loadAds()
  const idx = ads.findIndex((a) => a.id === ad.id)
  if (idx >= 0) {
    ads[idx] = ad
  } else {
    ads.unshift(ad)
  }
  saveAds(ads)
}

export function detectLanguage(text: string): SupportedLanguage {
  const frWords = /\b(le|la|les|de|du|des|je|tu|il|nous|vous|ils|est|sont|avec|pour|dans|sur|une|un|vous|et|ou|mais|donc|car|ni|or)\b/gi
  const enWords = /\b(the|is|are|was|were|have|has|had|will|would|could|should|you|your|our|their|with|from|that|this|not|but)\b/gi
  const esWords = /\b(el|la|los|las|de|del|en|con|por|para|que|una|un|sus|este|esto|pero|más|también|muy)\b/gi
  const deWords = /\b(der|die|das|ein|eine|ist|sind|mit|von|für|und|oder|aber|nicht|ich|sie|wir|ihr)\b/gi
  const ptWords = /\b(o|a|os|as|de|do|da|em|com|por|para|que|um|uma|seus|este|isso|mas|também|muito)\b/gi

  const scores = {
    fr: (text.match(frWords) || []).length,
    en: (text.match(enWords) || []).length,
    es: (text.match(esWords) || []).length,
    de: (text.match(deWords) || []).length,
    pt: (text.match(ptWords) || []).length,
  }
  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]
  return top[1] > 3 ? (top[0] as SupportedLanguage) : 'unknown'
}

export function estimateEngagement(runDays: number, source: string): AdEngagement {
  // Estimation basée sur les benchmarks moyens infopreneurs FR
  const baseViews = source === 'tiktok' ? 15000 : 8000
  const multiplier = Math.pow(runDays, 0.7) // croissance sous-linéaire
  const views = Math.round(baseViews * multiplier * (0.7 + Math.random() * 0.6))
  return {
    views,
    likes: Math.round(views * (0.02 + Math.random() * 0.03)),
    comments: Math.round(views * (0.003 + Math.random() * 0.007)),
    shares: Math.round(views * (0.005 + Math.random() * 0.01)),
    estimated: true,
  }
}

export function calculateScore(ad: ScrapedAd): number {
  let score = 0
  // Longévité (max 40 pts)
  score += Math.min(40, ad.runDays * 1.5)
  // Analyse IA (15 pts)
  if (ad.analysis) score += 15
  // Transcription disponible (10 pts)
  if (ad.transcription) score += 10
  // VSL score transcript (20 pts)
  if (ad.transcription?.score.overall) score += (ad.transcription.score.overall / 100) * 20
  // Score analyse IA (15 pts)
  if (ad.analysis?.overallScore) score += (ad.analysis.overallScore / 100) * 15
  return Math.round(score)
}

export function generateId(source: string, advertiser: string, date: string): string {
  const raw = `${source}-${advertiser}-${date}`
  return raw.replace(/[^a-z0-9]/gi, '-').toLowerCase()
}
