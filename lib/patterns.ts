import { VSLPattern } from './types'

export interface PatternInfo {
  id: VSLPattern
  name: string
  tagline: string
  description: string
  emoji: string
  bestFor: string[]
  structure: { phase: string; description: string; color: string }[]
  exampleHook: string
}

export const VSL_PATTERNS: PatternInfo[] = [
  {
    id: 'PAS',
    name: 'PAS',
    tagline: 'Problem → Agitate → Solution',
    emoji: '🔥',
    description: 'Le pattern le plus puissant pour les produits qui résolvent une douleur claire. Identifie le problème, amplifie la douleur, présente ta solution comme la seule issue.',
    bestFor: ['Formations', 'SaaS', 'Coaching', 'Produits B2C'],
    structure: [
      { phase: 'Problem', description: 'Nomme le problème exact que ressent ton audience', color: '#FF3B30' },
      { phase: 'Agitate', description: 'Montre les conséquences, amplifie la douleur émotionnelle', color: '#FF9500' },
      { phase: 'Solution', description: 'Présente ton produit comme LA solution évidente', color: '#00D26A' },
    ],
    exampleHook: 'Tu travailles 60h par semaine et tu gagnes moins que ton employé...',
  },
  {
    id: 'AIDA',
    name: 'AIDA',
    tagline: 'Attention → Interest → Desire → Action',
    emoji: '⚡',
    description: 'Le classique du copywriting. Parfait pour les audiences froides qui ne te connaissent pas encore. Construit progressivement l\'envie.',
    bestFor: ['Publicités', 'Lancement', 'Audience froide', 'E-commerce'],
    structure: [
      { phase: 'Attention', description: 'Hook percutant qui arrête le scroll', color: '#7B61FF' },
      { phase: 'Interest', description: 'Nourris la curiosité avec des faits surprenants', color: '#00C7BE' },
      { phase: 'Desire', description: 'Crée l\'envie irrésistible via bénéfices + preuve sociale', color: '#F5A623' },
      { phase: 'Action', description: 'CTA clair et urgent avec garantie', color: '#00D26A' },
    ],
    exampleHook: 'Ce que je vais te montrer a changé ma vie en 30 jours...',
  },
  {
    id: 'PASTOR',
    name: 'PASTOR',
    tagline: 'Problem → Amplify → Story → Testimony → Offer → Response',
    emoji: '🎯',
    description: 'Le pattern le plus complet. Combine storytelling, preuve sociale et offre irrésistible. Idéal pour les produits premium à haute valeur perçue.',
    bestFor: ['Formations premium', 'Coaching haut de gamme', 'B2B', 'Ticket élevé'],
    structure: [
      { phase: 'Problem', description: 'Problème spécifique de l\'avatar client', color: '#FF3B30' },
      { phase: 'Amplify', description: 'Conséquences si le problème n\'est pas résolu', color: '#FF9500' },
      { phase: 'Story', description: 'Ton histoire de transformation personnelle', color: '#7B61FF' },
      { phase: 'Testimony', description: 'Preuves sociales et témoignages clients', color: '#00C7BE' },
      { phase: 'Offer', description: 'Présentation détaillée de l\'offre irrésistible', color: '#F5A623' },
      { phase: 'Response', description: 'CTA urgent avec garantie et deadline', color: '#00D26A' },
    ],
    exampleHook: 'J\'avais tout perdu. Et c\'est ce jour-là que j\'ai découvert...',
  },
  {
    id: 'BAB',
    name: 'BAB',
    tagline: 'Before → After → Bridge',
    emoji: '🌉',
    description: 'Simple, puissant, visuel. Montre la transformation de façon cristalline. Parfait pour des vidéos courtes avec des résultats chiffrés impressionnants.',
    bestFor: ['Résultats rapides', 'Transformation visible', 'Réseaux sociaux', 'Courte durée'],
    structure: [
      { phase: 'Before', description: 'La situation douloureuse actuelle de l\'audience', color: '#FF3B30' },
      { phase: 'After', description: 'La vie rêvée après la transformation', color: '#00D26A' },
      { phase: 'Bridge', description: 'Ton produit est le pont entre les deux états', color: '#F5A623' },
    ],
    exampleHook: 'Il y a 6 mois je galérais à faire 1000€/mois...',
  },
  {
    id: 'Story',
    name: 'Story-Based',
    tagline: 'Hook → Story → Révélation → Preuve → CTA',
    emoji: '📖',
    description: 'Le storytelling pur. Engage émotionnellement en racontant une histoire réelle de transformation. Le plus persuasif mais nécessite un récit fort.',
    bestFor: ['Personal branding', 'Audience chaude', 'Produits lifestyle', 'Communauté'],
    structure: [
      { phase: 'Hook', description: 'Scène d\'ouverture choc — le moment pivot', color: '#F5A623' },
      { phase: 'Story', description: 'Le parcours avec obstacles et émotions', color: '#7B61FF' },
      { phase: 'Révélation', description: 'La découverte/méthode qui a tout changé', color: '#00C7BE' },
      { phase: 'Preuve', description: 'Résultats + témoignages qui valident l\'histoire', color: '#F5A623' },
      { phase: 'CTA', description: 'Invitation naturelle à rejoindre le mouvement', color: '#00D26A' },
    ],
    exampleHook: 'Le jour où j\'ai failli tout abandonner, un email a changé ma trajectoire...',
  },
]

export function getPattern(id: VSLPattern): PatternInfo {
  return VSL_PATTERNS.find(p => p.id === id) || VSL_PATTERNS[0]
}
