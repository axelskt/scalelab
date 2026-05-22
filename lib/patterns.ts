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
    exampleHook: 'Les agences, les créateurs — tous ont le même problème. Et tu le connais sûrement...',
  },
  {
    id: 'AIDA',
    name: 'AIDA',
    tagline: 'Attention → Interest → Desire → Action',
    emoji: '⚡',
    description: 'Le classique du copywriting. Parfait pour les audiences froides qui ne te connaissent pas encore. Construit progressivement l\'envie.',
    bestFor: ['Publicités', 'Lancement', 'Audience froide', 'SaaS'],
    structure: [
      { phase: 'Attention', description: 'Hook percutant qui arrête le scroll — chiffre, défi ou asymétrie d\'info', color: '#7B61FF' },
      { phase: 'Interest', description: 'Nourris la curiosité avec des faits surprenants ou une démo live', color: '#00C7BE' },
      { phase: 'Desire', description: 'Crée l\'envie irrésistible via bénéfices + preuve sociale chiffrée', color: '#F5A623' },
      { phase: 'Action', description: 'CTA clair, urgent, avec garantie inversée', color: '#00D26A' },
    ],
    exampleHook: 'J\'ai 45 secondes pour te convaincre que [produit] est meilleur que ce que tu utilises. C\'est parti.',
  },
  {
    id: 'PASTOR',
    name: 'PASTOR',
    tagline: 'Problem → Amplify → Story → Testimony → Offer → Response',
    emoji: '🎯',
    description: 'Le pattern le plus complet. Combine storytelling, preuve sociale et offre irrésistible. Idéal pour les produits premium à haute valeur perçue.',
    bestFor: ['Formations premium', 'Coaching haut de gamme', 'B2B', 'Ticket élevé'],
    structure: [
      { phase: 'Problem', description: 'Problème spécifique de l\'avatar client — sois ultra précis', color: '#FF3B30' },
      { phase: 'Amplify', description: 'Conséquences si le problème n\'est pas résolu (peur de rater)', color: '#FF9500' },
      { phase: 'Story', description: 'Ton parcours héros : échecs → découverte → transformation', color: '#7B61FF' },
      { phase: 'Testimony', description: 'Témoignages nommés + résultat chiffré + délai précis', color: '#00C7BE' },
      { phase: 'Offer', description: 'Présentation détaillée de l\'offre + tout ce qui est inclus', color: '#F5A623' },
      { phase: 'Response', description: 'CTA urgent + garantie inversée + contrat légal si possible', color: '#00D26A' },
    ],
    exampleHook: 'De complètement fauché à [chiffre précis] en [délai]. Je te raconte comment j\'ai fait.',
  },
  {
    id: 'BAB',
    name: 'BAB',
    tagline: 'Before → After → Bridge',
    emoji: '🌉',
    description: 'Simple, puissant, visuel. Montre la transformation de façon cristalline. Parfait pour des vidéos courtes avec des résultats chiffrés impressionnants.',
    bestFor: ['Résultats rapides', 'Transformation visible', 'Réseaux sociaux', 'Courte durée'],
    structure: [
      { phase: 'Before', description: 'La situation douloureuse actuelle — détails spécifiques, émotions réelles', color: '#FF3B30' },
      { phase: 'After', description: 'La vie rêvée après transformation — chiffres précis, liberté', color: '#00D26A' },
      { phase: 'Bridge', description: 'Ton produit est le pont — comment ça marche concrètement', color: '#F5A623' },
    ],
    exampleHook: 'Cette vidéo nous a coûté [prix choc] à produire. Parce que notre produit, c\'est ça.',
  },
  {
    id: 'Story',
    name: 'Story-Based',
    tagline: 'Hook → Story → Révélation → Preuve → CTA',
    emoji: '📖',
    description: 'Le storytelling pur. Engage émotionnellement en racontant une histoire réelle de transformation. Le plus persuasif pour les audiences qui ont des objections.',
    bestFor: ['Personal branding', 'Audience chaude', 'Produits lifestyle', 'Communauté'],
    structure: [
      { phase: 'Hook', description: 'Scène d\'ouverture choc — le moment pivot émotionnel', color: '#F5A623' },
      { phase: 'Story', description: 'Le parcours : identité → tentatives → obstacles → émotions', color: '#7B61FF' },
      { phase: 'Révélation', description: 'La découverte/méthode qui a tout changé — le moment "aha"', color: '#00C7BE' },
      { phase: 'Preuve', description: 'Résultats chiffrés précis + témoignages nommés qui valident', color: '#F5A623' },
      { phase: 'CTA', description: 'Invitation naturelle — "maintenant c\'est ton tour"', color: '#00D26A' },
    ],
    exampleHook: '[Personne proche] attend que tu réussisses. On fait un deal, toi et moi.',
  },
]

export function getPattern(id: VSLPattern): PatternInfo {
  return VSL_PATTERNS.find(p => p.id === id) || VSL_PATTERNS[0]
}
