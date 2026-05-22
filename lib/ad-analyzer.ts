import Anthropic from '@anthropic-ai/sdk'
import { ScrapedAd, AdAnalysis } from './ads-db'
import { VSLPattern } from './types'

const client = new Anthropic({ timeout: 120_000, maxRetries: 2 })

export async function analyzeAd(ad: ScrapedAd): Promise<AdAnalysis> {
  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1500,
    system: `Tu es un expert en copywriting VSL et analyse de publicités pour infopreneurs.
Tu analyses des publicités Facebook/TikTok pour identifier leur structure et techniques de persuasion.
Tu réponds UNIQUEMENT en JSON valide, sans markdown.`,
    messages: [
      {
        role: 'user',
        content: `Analyse cette publicité d'infopreneur et retourne un JSON structuré.

PUBLICITÉ DE : ${ad.advertiser}
SOURCE : ${ad.source}
DURÉE EN LIGNE : ${ad.runDays} jours (plus = plus efficace)
TEXTE : "${ad.adText}"

Retourne exactement ce JSON :
{
  "pattern": "PAS|AIDA|PASTOR|BAB|Story",
  "hook": "Le hook principal identifié",
  "mainPain": "La douleur principale ciblée",
  "solution": "La solution proposée",
  "offer": "Description précise de l'offre (ex: formation 6 semaines, coaching individuel, outil SaaS...)",
  "productType": "Type exact parmi : Formation en ligne | Coaching 1:1 | Masterclass | SaaS | Ebook | Bootcamp | Programme | Webinaire | Abonnement | Autre",
  "price": "Prix détecté dans l'ad (ex: 497€, 97€/mois, Gratuit, Offert, Non mentionné)",
  "niche": "Niche principale parmi : Marketing digital | E-commerce | Copywriting | Finance personnelle | Immobilier | Fitness & Santé | Développement personnel | Coaching business | IA & Tech | Autre",
  "cta": "L'appel à l'action exact",
  "techniques": ["liste des techniques de copywriting utilisées"],
  "emotionalTriggers": ["peur", "envie", "urgence", etc.],
  "urgencyLevel": 7,
  "socialProofLevel": 5,
  "overallScore": 72,
  "summary": "Résumé en 1-2 phrases de pourquoi cette pub fonctionne"
}

Pour overallScore (0-100), évalue : clarté du hook (25%), force de la douleur (25%), preuve sociale (20%), urgence (15%), clarté de l'offre (15%).
Réponds uniquement avec le JSON.`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(cleaned) as AdAnalysis
}

export async function adaptAdToProduct(
  ad: ScrapedAd,
  targetProduct: string,
  targetAudience: string
): Promise<string> {
  const analysis = ad.analysis

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 800,
    system: `Tu es un expert en copywriting VSL. Tu adaptes des scripts publicitaires gagnants à de nouveaux produits en conservant la structure et les techniques qui fonctionnent.`,
    messages: [
      {
        role: 'user',
        content: `Adapte ce script publicitaire gagnant (${ad.runDays} jours actif) à mon produit.

SCRIPT ORIGINAL :
"${ad.adText}"

STRUCTURE IDENTIFIÉE : ${analysis?.pattern || 'PAS'}
TECHNIQUES QUI FONCTIONNENT : ${analysis?.techniques?.join(', ') || 'N/A'}

MON PRODUIT : ${targetProduct}
MON AUDIENCE : ${targetAudience}

Génère un nouveau script adapté (~150-200 mots) qui :
1. Conserve la même structure narrative
2. Utilise les mêmes techniques de persuasion
3. S'adresse à mon audience spécifique
4. Reste authentique et non générique

Donne UNIQUEMENT le texte du script adapté, sans explications.`,
      },
    ],
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}

// Pre-populate avec des exemples infopreneur FR connus et efficaces
export const SEED_ADS: Omit<ScrapedAd, 'score'>[] = [
  {
    id: 'fb-alexis-v-formation-ia',
    source: 'facebook',
    advertiser: 'Alexis V.',
    language: 'fr' as const,
    country: 'FR',
    startDate: '2024-10-15',
    runDays: 120,
    adText: `De salarié à 15 000€/mois grâce à l'IA en 90 jours.

Je m'appelle Alexis. Il y a 1 an, je gagnais 2 200€/mois comme développeur web.

Aujourd'hui je génère 15k€/mois avec une seule méthode : automatiser des services avec l'IA pour des entreprises locales.

Pas besoin de coder. Pas besoin d'expérience. Juste ma méthode en 3 étapes.

👉 Formation OFFERTE ce soir à 20h - Clique pour t'inscrire`,
    adUrl: 'https://www.facebook.com/ads/library/',
    niche: ['IA', 'formation', 'revenus'],
    keywords: ['formation', 'IA', 'revenus'],
    scrapedAt: new Date().toISOString(),
    analysis: {
      pattern: 'BAB',
      hook: 'De salarié à 15 000€/mois grâce à l\'IA en 90 jours',
      mainPain: 'Salaire limité en tant que salarié',
      solution: 'Automatiser des services avec l\'IA pour entreprises locales',
      offer: 'Formation OFFERTE ce soir — méthode en 3 étapes pour automatiser des services IA',
      productType: 'Formation en ligne',
      price: 'Gratuit',
      niche: 'IA & Tech',
      cta: 'Clique pour t\'inscrire',
      techniques: ['Before/After', 'Chiffres précis', 'Objections levées', 'Urgence temporelle', 'Gratuité'],
      emotionalTriggers: ['envie', 'espoir', 'urgence', 'peur de rater'],
      urgencyLevel: 8,
      socialProofLevel: 5,
      overallScore: 84,
      summary: 'Transformation Before/After très visuelle avec chiffres précis. L\'urgence (ce soir) pousse à l\'action immédiate. Les 3 "pas besoin de" lèvent les objections classiques.',
    },
  },
  {
    id: 'fb-sarah-m-dropshipping',
    source: 'facebook',
    advertiser: 'Sarah M.',
    language: 'fr' as const,
    country: 'FR',
    startDate: '2024-09-01',
    runDays: 165,
    adText: `⚠️ Tu travailles 40h/semaine pour quelqu'un d'autre depuis combien d'années ?

Moi j'ai fait ça pendant 6 ans. Jusqu'au jour où j'ai découvert le dropshipping.

Première semaine : 847€
Premier mois : 4 230€
3 mois plus tard : 12 000€/mois

Je partage TOUT dans ma formation gratuite. Les fournisseurs, les produits, les publicités. Tout.

📲 Lien en bio — Formation disponible 48h seulement`,
    adUrl: 'https://www.facebook.com/ads/library/',
    niche: ['dropshipping', 'ecommerce', 'revenus'],
    keywords: ['dropshipping', 'formation', 'business'],
    scrapedAt: new Date().toISOString(),
    analysis: {
      pattern: 'PAS',
      hook: '⚠️ Tu travailles 40h/semaine pour quelqu\'un d\'autre depuis combien d\'années ?',
      mainPain: 'Travailler pour quelqu\'un d\'autre sans liberté financière',
      solution: 'Dropshipping avec méthode éprouvée',
      offer: 'Formation gratuite complète — fournisseurs, produits et publicités inclus',
      productType: 'Formation en ligne',
      price: 'Gratuit',
      niche: 'E-commerce',
      cta: 'Lien en bio — 48h seulement',
      techniques: ['Question rhétorique', 'Progression chiffrée', 'Transparence totale', 'Deadline'],
      emotionalTriggers: ['frustration', 'envie', 'curiosité', 'peur de rater'],
      urgencyLevel: 9,
      socialProofLevel: 6,
      overallScore: 88,
      summary: 'Hook en question rhétorique qui force l\'introspection. Progression des revenus très concrète et crédible. La transparence ("je partage TOUT") crée confiance. FOMO maximal avec 48h.',
    },
  },
  {
    id: 'fb-thomas-k-copywriting',
    source: 'facebook',
    advertiser: 'Thomas K.',
    language: 'fr' as const,
    country: 'FR',
    startDate: '2024-11-20',
    runDays: 85,
    adText: `Le secret des infopreneurs qui font 50k€/mois sans audience.

Non ce n'est pas le SEO. Ni le dropshipping. Ni même les réseaux sociaux.

C'est le copywriting direct response.

J'ai utilisé cette compétence pour passer de 0 à 50k€/mois en 14 mois.
Mes clients l'utilisent pour multiplier leurs ventes par 3 en 30 jours.

Je t'explique exactement comment dans une masterclass gratuite de 90 minutes.

🎯 Places limitées à 200 personnes — Inscris-toi maintenant`,
    adUrl: 'https://www.facebook.com/ads/library/',
    niche: ['copywriting', 'formation', 'freelance'],
    keywords: ['copywriting', 'formation', 'masterclass'],
    scrapedAt: new Date().toISOString(),
    analysis: {
      pattern: 'AIDA',
      hook: 'Le secret des infopreneurs qui font 50k€/mois sans audience',
      mainPain: 'Ne pas savoir comment générer des revenus élevés',
      solution: 'Copywriting direct response',
      offer: 'Masterclass gratuite 90 min — la méthode copywriting direct response pour passer à 50k€/mois',
      productType: 'Masterclass',
      price: 'Gratuit',
      niche: 'Copywriting',
      cta: 'Places limitées à 200 — Inscris-toi',
      techniques: ['Pattern Interrupt', 'Curiosité', 'Résultats clients', 'Scarcité', 'Gratuité'],
      emotionalTriggers: ['curiosité', 'envie', 'peur de rater', 'espoir'],
      urgencyLevel: 8,
      socialProofLevel: 7,
      overallScore: 81,
      summary: 'Le "secret" crée une curiosité irrésistible. La négation (ni SEO ni réseaux) déjoue les attentes et intrigue. Double preuve (soi + clients). Scarcité crédible avec chiffre précis.',
    },
  },
  {
    id: 'tiktok-marine-b-coaching',
    source: 'tiktok',
    advertiser: 'Marine B.',
    language: 'fr' as const,
    country: 'FR',
    startDate: '2025-01-10',
    runDays: 55,
    adText: `POV : tu gagnes 5000€/mois depuis chez toi en aidant des gens 🏠

C'est ce que je fais depuis 18 mois comme coach bien-être.

Avant : kiné à 2400€/mois + 50h de boulot
Maintenant : coaching online, mes horaires, mes tarifs

Si t'as une expertise et tu sais pas comment la monétiser, je te montre ma méthode exacte.

Lien en bio → formation offerte jusqu'à dimanche`,
    adUrl: 'https://ads.tiktok.com/business/creativecenter/',
    niche: ['coaching', 'bien-être', 'freelance'],
    keywords: ['coaching', 'formation', 'revenus'],
    scrapedAt: new Date().toISOString(),
    analysis: {
      pattern: 'BAB',
      hook: 'POV : tu gagnes 5000€/mois depuis chez toi en aidant des gens',
      mainPain: 'Expertise sous-monétisée, manque de liberté',
      solution: 'Coaching online avec sa propre méthode',
      offer: 'Formation offerte jusqu\'à dimanche — méthode exacte pour monétiser son expertise en coaching online',
      productType: 'Coaching 1:1',
      price: 'Offert',
      niche: 'Coaching business',
      cta: 'Lien en bio',
      techniques: ['POV TikTok natif', 'Storytelling Before/After', 'Spécificité', 'Deadline weekend'],
      emotionalTriggers: ['envie', 'liberté', 'validation', 'urgence'],
      urgencyLevel: 7,
      socialProofLevel: 5,
      overallScore: 76,
      summary: 'Format POV très natif TikTok qui augmente l\'engagement. Before/After concret avec chiffres précis. Ciblage laser sur "personnes avec expertise". Deadline weekend crée l\'urgence.',
    },
  },
]

// Pré-calculer les scores pour les seed ads
export const SEEDED_ADS: ScrapedAd[] = SEED_ADS.map((ad) => {
  const { calculateScore } = require('./ads-db')
  return { ...ad, score: calculateScore(ad) }
})
