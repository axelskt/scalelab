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
  // ── 16 nouvelles ads qualité ──────────────────────────────────────────────
  {
    id: 'fb-hugo-f-immobilier',
    source: 'facebook',
    advertiser: 'Hugo F.',
    advertiserPage: 'https://facebook.com/hugoformationimmo',
    language: 'fr' as const,
    country: 'FR',
    startDate: '2024-08-10',
    runDays: 180,
    adText: `Il y a 3 ans j'avais 0 bien immobilier et 800€ d'épargne.

Aujourd'hui je perçois 4 200€/mois de loyers nets. 6 appartements. Sans apport au départ.

La banque m'a dit non 2 fois. J'ai quand même trouvé comment financer mon premier bien à 100%.

Je t'explique la méthode exacte dans ce webinaire gratuit de 90 minutes.

👇 Clique sur "En savoir plus" — 500 places disponibles`,
    adUrl: 'https://facebook.com/hugoformationimmo',
    niche: ['immobilier', 'investissement', 'patrimoine'],
    keywords: ['immobilier', 'investissement', 'revenus passifs'],
    scrapedAt: new Date().toISOString(),
    analysis: {
      pattern: 'BAB',
      hook: 'Il y a 3 ans j\'avais 0 bien immobilier et 800€ d\'épargne',
      mainPain: 'Manque de capital pour investir dans l\'immobilier',
      solution: 'Méthode pour financer sans apport malgré les refus bancaires',
      offer: 'Webinaire gratuit 90 min — méthode 0 apport pour financer son 1er bien',
      productType: 'Webinaire',
      price: 'Gratuit',
      niche: 'Immobilier',
      cta: 'Clique sur "En savoir plus"',
      techniques: ['Storytelling', 'Chiffres précis', 'Objection bancaire levée', 'Scarcité'],
      emotionalTriggers: ['espoir', 'envie', 'curiosité', 'peur de rater'],
      urgencyLevel: 7,
      socialProofLevel: 8,
      overallScore: 87,
      summary: 'La spécificité (800€ → 4200€/mois nets, 6 apparts) rend l\'histoire ultra-crédible. L\'objection bancaire levée ("m\'a dit non 2 fois") touche une douleur universelle.',
    },
  },
  {
    id: 'fb-camille-d-trading',
    source: 'facebook',
    advertiser: 'Camille D.',
    advertiserPage: 'https://facebook.com/camillefinance',
    language: 'fr' as const,
    country: 'FR',
    startDate: '2024-09-15',
    runDays: 150,
    adText: `⚡ Ce que les banques ne veulent pas que tu saches sur la bourse.

Pendant qu'ils placent ton épargne à 0.5%, ils gagnent 12-15%/an avec les mêmes marchés.

J'ai passé 4 ans à étudier leurs stratégies. Maintenant j'utilise leur méthode — sans leur prendre de commissions.

Résultat : +34% sur mon portefeuille l'an dernier.

📊 Formation GRATUITE : "Investir comme les pros en 2h/semaine"
→ 1 200 inscrits cette semaine`,
    adUrl: 'https://facebook.com/camillefinance',
    niche: ['bourse', 'investissement', 'finance'],
    keywords: ['bourse', 'investissement', 'trading'],
    scrapedAt: new Date().toISOString(),
    analysis: {
      pattern: 'PAS',
      hook: 'Ce que les banques ne veulent pas que tu saches sur la bourse',
      mainPain: 'Épargne mal rémunérée par les banques traditionnelles',
      solution: 'Investir en bourse comme les pros en autonomie',
      offer: 'Formation gratuite "Investir comme les pros en 2h/semaine"',
      productType: 'Formation en ligne',
      price: 'Gratuit',
      niche: 'Finance personnelle',
      cta: 'Inscris-toi',
      techniques: ['Conspiration/secret', 'Comparaison chiffrée', 'Autorité', 'Preuve sociale'],
      emotionalTriggers: ['colère', 'injustice', 'envie', 'curiosité'],
      urgencyLevel: 6,
      socialProofLevel: 8,
      overallScore: 83,
      summary: 'Le "secret des banques" crée une tension narrative immédiate. La comparaison 0.5% vs 15% est percutante. Le +34% réel ancre la crédibilité. 1200 inscrits = preuve sociale forte.',
    },
  },
  {
    id: 'fb-romain-p-freelance',
    source: 'facebook',
    advertiser: 'Romain P.',
    advertiserPage: 'https://facebook.com/romainfreelance',
    language: 'fr' as const,
    country: 'FR',
    startDate: '2024-10-01',
    runDays: 135,
    adText: `Tu gagnes moins de 3 000€/mois en freelance ?

Voilà pourquoi : tu vends ton temps. Pas ta valeur.

J'ai fait la même erreur pendant 2 ans. Jusqu'à ce que je change 1 seule chose dans ma façon de prospecter.

Ce mois-ci : 2 clients, 8 500€, 3 semaines de travail.

Je t'offre ma méthode de prospection complète dans un programme de 4 semaines.

💬 Clique sur "En savoir plus" — Prochain groupe : 12 places restantes`,
    adUrl: 'https://facebook.com/romainfreelance',
    niche: ['freelance', 'prospection', 'business'],
    keywords: ['freelance', 'clients', 'revenus'],
    scrapedAt: new Date().toISOString(),
    analysis: {
      pattern: 'PAS',
      hook: 'Tu gagnes moins de 3 000€/mois en freelance ?',
      mainPain: 'Revenus plafonnés en freelance, vendre son temps',
      solution: 'Changer sa méthode de prospection pour vendre sa valeur',
      offer: 'Programme 4 semaines — méthode de prospection complète',
      productType: 'Programme',
      price: 'Non mentionné',
      niche: 'Coaching business',
      cta: 'Clique — 12 places restantes',
      techniques: ['Question ciblée', 'Diagnostic précis', 'Résultats concrets', 'Scarcité'],
      emotionalTriggers: ['frustration', 'espoir', 'urgence', 'curiosité'],
      urgencyLevel: 9,
      socialProofLevel: 6,
      overallScore: 80,
      summary: 'La question d\'ouverture filtre parfaitement l\'audience cible. Le diagnostic "tu vends ton temps pas ta valeur" est une révélation. Les chiffres précis (2 clients, 8500€, 3 semaines) sont très crédibles.',
    },
  },
  {
    id: 'fb-lea-m-nutrition',
    source: 'facebook',
    advertiser: 'Léa M.',
    advertiserPage: 'https://facebook.com/leanutrition',
    language: 'fr' as const,
    country: 'FR',
    startDate: '2025-01-05',
    runDays: 90,
    adText: `J'ai perdu 18kg en 4 mois. Sans me priver. Sans sport intense.

Tout le monde m'a demandé mon secret. Alors j'ai créé une méthode.

352 femmes l'ont déjà suivie. Résultat moyen : -11kg en 90 jours.

Pas de régime yo-yo. Pas de frustration. Juste de la vraie nourriture et une méthode métabolique simple.

🎁 Je t'offre le premier module GRATUIT aujourd'hui.
→ Clique sur le lien pour y accéder`,
    adUrl: 'https://facebook.com/leanutrition',
    niche: ['nutrition', 'perte de poids', 'santé'],
    keywords: ['perte de poids', 'régime', 'nutrition'],
    scrapedAt: new Date().toISOString(),
    analysis: {
      pattern: 'PASTOR',
      hook: 'J\'ai perdu 18kg en 4 mois. Sans me priver. Sans sport intense.',
      mainPain: 'Surpoids et échecs répétés des régimes classiques',
      solution: 'Méthode métabolique sans privation ni sport intense',
      offer: 'Premier module gratuit d\'une formation nutrition méthode métabolique',
      productType: 'Formation en ligne',
      price: 'Gratuit (module 1)',
      niche: 'Fitness & Santé',
      cta: 'Clique sur le lien',
      techniques: ['Résultat personnel', 'Preuve de masse', 'Objections levées (sans...)', 'Freemium'],
      emotionalTriggers: ['espoir', 'soulagement', 'curiosité', 'désir'],
      urgencyLevel: 5,
      socialProofLevel: 9,
      overallScore: 85,
      summary: 'Les deux "sans" (se priver / sport intense) lèvent les deux objections majeures en une ligne. 352 femmes avec résultat moyen chiffré = preuve sociale béton. Le module gratuit réduit la friction à zéro.',
    },
  },
  {
    id: 'fb-max-b-saas',
    source: 'facebook',
    advertiser: 'Max B.',
    advertiserPage: 'https://facebook.com/maxbsaas',
    language: 'fr' as const,
    country: 'FR',
    startDate: '2024-11-01',
    runDays: 110,
    adText: `J'ai lancé un SaaS à 47€/mois. En 9 mois : 180 abonnés = 8 460€/mois récurrents.

Je code 0 ligne. J'utilise 3 outils no-code que tout le monde peut apprendre en un weekend.

Le marché des outils IA pour PME explose. Et personne ne s'en occupe encore en France.

→ Formation "Lance ton SaaS no-code en 30 jours" — Accès immédiat
Prix lancement : 297€ (au lieu de 497€ la semaine prochaine)`,
    adUrl: 'https://facebook.com/maxbsaas',
    niche: ['SaaS', 'no-code', 'revenus récurrents'],
    keywords: ['SaaS', 'no-code', 'business en ligne'],
    scrapedAt: new Date().toISOString(),
    analysis: {
      pattern: 'BAB',
      hook: 'J\'ai lancé un SaaS à 47€/mois. En 9 mois : 180 abonnés',
      mainPain: 'Revenus non récurrents, complexité technique perçue',
      solution: 'SaaS no-code avec 3 outils apprenables en un weekend',
      offer: 'Formation "Lance ton SaaS no-code en 30 jours" — 297€ prix lancement',
      productType: 'Formation en ligne',
      price: '297€',
      niche: 'SaaS',
      cta: 'Accès immédiat',
      techniques: ['Revenus récurrents concrets', 'Objection technique levée', 'Opportunité de marché', 'Prix ancrage'],
      emotionalTriggers: ['envie', 'opportunité', 'FOMO marché', 'urgence prix'],
      urgencyLevel: 8,
      socialProofLevel: 7,
      overallScore: 82,
      summary: 'Le calcul instantané (180 × 47€ = 8460€/mois) est irrésistible. "Je code 0 ligne" supprime la principale objection. L\'angle "marché vierge en France" crée l\'urgence d\'opportunité.',
    },
  },
  {
    id: 'fb-clara-v-developpement-perso',
    source: 'facebook',
    advertiser: 'Clara V.',
    advertiserPage: 'https://facebook.com/claravperso',
    language: 'fr' as const,
    country: 'FR',
    startDate: '2024-12-01',
    runDays: 95,
    adText: `Si tu te réveilles le lundi matin avec une boule au ventre, lis ça.

J'ai vécu ça pendant 5 ans. Cadre dans une grande boîte, salaire confortable, et pourtant...

Vide. Chaque dimanche soir.

Aujourd'hui je vis exactement la vie que je voulais. Pas parce que j'ai tout quitté. Parce que j'ai appris à me reprogrammer.

🧠 Masterclass GRATUITE : "Les 3 blocages qui t'empêchent de vivre ta vie idéale"
Jeudi 20h — 847 inscrits cette semaine`,
    adUrl: 'https://facebook.com/claravperso',
    niche: ['développement personnel', 'mindset', 'coaching'],
    keywords: ['développement personnel', 'mindset', 'coaching'],
    scrapedAt: new Date().toISOString(),
    analysis: {
      pattern: 'PASTOR',
      hook: 'Si tu te réveilles le lundi matin avec une boule au ventre, lis ça.',
      mainPain: 'Sentiment de vide malgré une vie en apparence réussie',
      solution: 'Reprogrammation mentale sans tout quitter',
      offer: 'Masterclass gratuite "3 blocages qui t\'empêchent de vivre ta vie idéale"',
      productType: 'Masterclass',
      price: 'Gratuit',
      niche: 'Développement personnel',
      cta: 'S\'inscrire — Jeudi 20h',
      techniques: ['Empathie profonde', 'Storytelling', 'Reframe solution', 'Date+heure précise', 'Preuve sociale'],
      emotionalTriggers: ['reconnaissance', 'espoir', 'soulagement', 'curiosité'],
      urgencyLevel: 7,
      socialProofLevel: 7,
      overallScore: 86,
      summary: 'Le hook "boule au ventre le lundi" est universel et ultra-qualifiant. Le paradoxe "salaire confortable et pourtant vide" touche exactement la cible. La solution "sans tout quitter" lève l\'objection principale.',
    },
  },
  {
    id: 'fb-nico-r-ecommerce',
    source: 'facebook',
    advertiser: 'Nicolas R.',
    advertiserPage: 'https://facebook.com/nicolasecom',
    language: 'fr' as const,
    country: 'FR',
    startDate: '2024-08-20',
    runDays: 170,
    adText: `Comment j'ai fait 47 000€ en août avec une boutique que j'ai créée en 6h.

Niche : accessoires pour chiens.
Trafic : 100% Meta Ads.
Marge : 68%.

Je ne montre jamais ma boutique. Mais je montre exactement comment la reproduire.

Programme "E-com 0 to 10k" — 8 semaines, accompagnement inclus.
💶 Prix : 497€ — 3 places restantes ce mois`,
    adUrl: 'https://facebook.com/nicolasecom',
    niche: ['e-commerce', 'dropshipping', 'Meta Ads'],
    keywords: ['e-commerce', 'boutique en ligne', 'dropshipping'],
    scrapedAt: new Date().toISOString(),
    analysis: {
      pattern: 'AIDA',
      hook: 'Comment j\'ai fait 47 000€ en août avec une boutique créée en 6h',
      mainPain: 'Ne pas savoir comment démarrer un e-commerce rentable rapidement',
      solution: 'Boutique niche + Meta Ads avec marge élevée',
      offer: 'Programme 8 semaines "0 to 10k" avec accompagnement — 497€',
      productType: 'Programme',
      price: '497€',
      niche: 'E-commerce',
      cta: '3 places restantes ce mois',
      techniques: ['Résultat chiffré précis', 'Transparence partielle', 'Bullet points', 'Scarcité extrême'],
      emotionalTriggers: ['envie', 'curiosité', 'urgence', 'FOMO'],
      urgencyLevel: 9,
      socialProofLevel: 7,
      overallScore: 84,
      summary: 'Les chiffres (47k€, 6h, 68% marge) sont tellement précis qu\'ils sont crédibles. La "boutique secrète" crée frustration et curiosité simultanées. 3 places = scarcité maximale.',
    },
  },
  {
    id: 'fb-julie-c-ia-automatisation',
    source: 'facebook',
    advertiser: 'Julie C.',
    advertiserPage: 'https://facebook.com/julieiatools',
    language: 'fr' as const,
    country: 'FR',
    startDate: '2025-01-15',
    runDays: 80,
    adText: `ChatGPT va pas te rendre riche. Mais l'automatisation IA va changer ton business.

J'ai automatisé 80% de mes tâches répétitives en 2 semaines.

Résultat : je travaille 4h/jour au lieu de 10h. Même chiffre d'affaires. Même clients.

Je t'explique mes 7 automations préférées dans un guide OFFERT (valeur 97€).

🤖 Clique sur "Télécharger" — Accès immédiat gratuit`,
    adUrl: 'https://facebook.com/julieiatools',
    niche: ['IA', 'automatisation', 'productivité'],
    keywords: ['IA', 'automatisation', 'ChatGPT'],
    scrapedAt: new Date().toISOString(),
    analysis: {
      pattern: 'PAS',
      hook: 'ChatGPT va pas te rendre riche. Mais l\'automatisation IA va changer ton business.',
      mainPain: 'Trop de tâches répétitives, manque de temps',
      solution: '7 automations IA pour réduire son temps de travail de 60%',
      offer: 'Guide gratuit "7 automations IA" — valeur 97€',
      productType: 'Ebook',
      price: 'Gratuit',
      niche: 'IA & Tech',
      cta: 'Clique sur "Télécharger"',
      techniques: ['Pattern interrupt', 'Résultat temps précis', 'Valeur perçue (97€ offert)', 'Accès immédiat'],
      emotionalTriggers: ['curiosité', 'désir de liberté', 'FOMO IA', 'soulagement'],
      urgencyLevel: 6,
      socialProofLevel: 5,
      overallScore: 79,
      summary: 'L\'ouverture counter-intuitive ("ChatGPT va pas te rendre riche") arrête le scroll. Le ratio 4h vs 10h/jour pour le même résultat est la promesse la plus désirable possible.',
    },
  },
  {
    id: 'fb-pierre-l-copywriting-email',
    source: 'facebook',
    advertiser: 'Pierre L.',
    advertiserPage: 'https://facebook.com/pierreemailcopy',
    language: 'fr' as const,
    country: 'FR',
    startDate: '2024-10-20',
    runDays: 115,
    adText: `Un email de 400 mots. Envoyé à 1 200 personnes. 23 ventes à 497€.

11 431€ en 48h. Sans pub. Sans calls. Sans social media.

C'est ce que j'ai fait la semaine dernière avec ma liste email.

Si tu as une audience (même petite) et que tu sais pas comment la monétiser, rejoins mon atelier :

📧 "Écrire des emails qui vendent" — En ligne ce samedi
Tarif : 67€ — 43 inscrits, 7 places restantes`,
    adUrl: 'https://facebook.com/pierreemailcopy',
    niche: ['email marketing', 'copywriting', 'liste email'],
    keywords: ['email marketing', 'copywriting', 'newsletter'],
    scrapedAt: new Date().toISOString(),
    analysis: {
      pattern: 'AIDA',
      hook: 'Un email de 400 mots. Envoyé à 1 200 personnes. 23 ventes.',
      mainPain: 'Avoir une audience mais ne pas savoir la monétiser',
      solution: 'Email copywriting avec méthode structurée',
      offer: 'Atelier en ligne "Écrire des emails qui vendent" — 67€',
      productType: 'Masterclass',
      price: '67€',
      niche: 'Copywriting',
      cta: 'Rejoins l\'atelier — 7 places restantes',
      techniques: ['Math précise (11 431€)', 'Sans-sans-sans', 'Preuve récente', 'Scarcité + preuve sociale mixées'],
      emotionalTriggers: ['envie', 'curiosité', 'urgence', 'espoir'],
      urgencyLevel: 9,
      socialProofLevel: 9,
      overallScore: 91,
      summary: 'Le calcul exact (23 × 497 = 11 431€) est la preuve la plus concrète possible. "La semaine dernière" ancre la récence. La scarcité (7 places) + preuve sociale (43 inscrits) crée l\'urgence parfaite.',
    },
  },
  {
    id: 'tiktok-yasmine-k-coaching-business',
    source: 'tiktok',
    advertiser: 'Yasmine K.',
    advertiserPage: 'https://tiktok.com/@yasminekcoach',
    language: 'fr' as const,
    country: 'FR',
    startDate: '2025-01-20',
    runDays: 70,
    adText: `Je gagne 8 000€/mois depuis mon téléphone. Voici comment ça marche vraiment 📱

Pas de boss. Pas d'horaires. Pas de bureau.

J'accompagne 12 entrepreneurs par mois en 1h de coaching chacun.

Tarif : 670€ la session.

Si tu veux créer ta propre offre de coaching cette année, j'ai un programme de 6 semaines qui t'explique tout.

Lien en bio → "Créer et vendre son coaching"`,
    adUrl: 'https://tiktok.com/@yasminekcoach',
    niche: ['coaching', 'business', 'liberté'],
    keywords: ['coaching', 'business en ligne', 'liberté'],
    scrapedAt: new Date().toISOString(),
    analysis: {
      pattern: 'BAB',
      hook: 'Je gagne 8 000€/mois depuis mon téléphone. Voici comment ça marche vraiment',
      mainPain: 'Dépendance à un emploi, manque de liberté et revenus plafonnés',
      solution: 'Offre de coaching premium avec sessions courtes',
      offer: 'Programme 6 semaines "Créer et vendre son coaching"',
      productType: 'Programme',
      price: 'Non mentionné',
      niche: 'Coaching business',
      cta: 'Lien en bio',
      techniques: ['Math transparente (12 × 670€)', 'Pas-pas-pas (libertés)', 'Crédibilité par la transparence'],
      emotionalTriggers: ['envie', 'liberté', 'envie de reproduire', 'inspiration'],
      urgencyLevel: 5,
      socialProofLevel: 6,
      overallScore: 77,
      summary: 'La math visible (12 clients × 670€ = 8 040€) démontre la preuve sans rien cacher. Les 3 "pas de" définissent le mode de vie cible mieux que n\'importe quel argument.',
    },
  },
  {
    id: 'fb-antoine-m-mindset-entrepreneur',
    source: 'facebook',
    advertiser: 'Antoine M.',
    advertiserPage: 'https://facebook.com/antoinemindset',
    language: 'fr' as const,
    country: 'FR',
    startDate: '2024-09-05',
    runDays: 158,
    adText: `La vraie raison pour laquelle tu n'as pas encore lancé ton business.

C'est pas le manque de temps. C'est pas le manque d'argent.

C'est le syndrome de l'imposteur.

J'ai coaché 400 entrepreneurs en 3 ans. 94% avaient ce problème. 94% l'ont surmonté avec ma méthode.

🧠 Challenge GRATUIT 5 jours : "Casse ton syndrome de l'imposteur"
Démarre quand tu veux. 2 000 participants ce mois`,
    adUrl: 'https://facebook.com/antoinemindset',
    niche: ['mindset', 'entrepreneur', 'développement personnel'],
    keywords: ['mindset', 'entrepreneur', 'syndrome imposteur'],
    scrapedAt: new Date().toISOString(),
    analysis: {
      pattern: 'PASTOR',
      hook: 'La vraie raison pour laquelle tu n\'as pas encore lancé ton business',
      mainPain: 'Syndrome de l\'imposteur bloquant le passage à l\'action',
      solution: 'Méthode pour surmonter le syndrome de l\'imposteur',
      offer: 'Challenge gratuit 5 jours — accès immédiat',
      productType: 'Bootcamp',
      price: 'Gratuit',
      niche: 'Développement personnel',
      cta: 'Démarre quand tu veux',
      techniques: ['Reframe causal', 'Stats crédibles', 'Taux de succès', 'Flexibilité d\'accès', 'Masse sociale'],
      emotionalTriggers: ['reconnaissance', 'espoir', 'soulagement', 'confiance'],
      urgencyLevel: 4,
      socialProofLevel: 9,
      overallScore: 83,
      summary: 'Le reframe "c\'est pas X ni Y, c\'est Z" est une révélation qui crée un moment "aha" immédiat. 94% de succès sur 400 clients est une stat béton. Le "démarre quand tu veux" supprime toute friction.',
    },
  },
  {
    id: 'tiktok-lucie-b-nutrition-sportive',
    source: 'tiktok',
    advertiser: 'Lucie B.',
    advertiserPage: 'https://tiktok.com/@luciefit',
    language: 'fr' as const,
    country: 'FR',
    startDate: '2025-02-01',
    runDays: 65,
    adText: `POV : tu sors de la salle sans avoir faim et avec de l'énergie pour la soirée 💪

Avant : je mangeais n'importe quoi après le sport, résultats nuls après 6 mois.

Maintenant : j'ai une stratégie nutritive adaptée à mes entraînements. +4kg de muscle en 90 jours.

Je t'envoie mon plan nutrition gratuit (valeur 49€) si tu m'écris "PLAN" en commentaire.

Plus de 1 800 personnes l'ont déjà reçu.`,
    adUrl: 'https://tiktok.com/@luciefit',
    niche: ['fitness', 'nutrition', 'musculation'],
    keywords: ['nutrition sportive', 'musculation', 'plan alimentaire'],
    scrapedAt: new Date().toISOString(),
    analysis: {
      pattern: 'BAB',
      hook: 'POV : tu sors de la salle sans avoir faim et avec de l\'énergie pour la soirée',
      mainPain: 'Mauvaise nutrition post-entraînement, stagnation des résultats',
      solution: 'Plan nutrition adapté aux entraînements',
      offer: 'Plan nutrition gratuit (valeur 49€) sur commentaire',
      productType: 'Ebook',
      price: 'Gratuit',
      niche: 'Fitness & Santé',
      cta: 'Écris "PLAN" en commentaire',
      techniques: ['POV natif TikTok', 'Valeur perçue (49€)', 'Engagement commentaire', 'Preuve masse'],
      emotionalTriggers: ['désir physique', 'frustration', 'espoir', 'FOMO'],
      urgencyLevel: 5,
      socialProofLevel: 8,
      overallScore: 78,
      summary: 'Le format POV + commentaire est natif TikTok et génère un engagement massif. La tactique "écris PLAN" booste les commentaires = algorithme avantageux. 1800 déjà reçu = forte preuve sociale.',
    },
  },
  {
    id: 'fb-david-n-tunnel-vente',
    source: 'facebook',
    advertiser: 'David N.',
    advertiserPage: 'https://facebook.com/davidntunnel',
    language: 'fr' as const,
    country: 'FR',
    startDate: '2024-10-10',
    runDays: 125,
    adText: `Mon tunnel de vente tourne depuis 14 mois. Il a généré 340 000€.

Je n'ai rien changé. Pas un mot. Pas une couleur.

Il tourne en automatique. Même quand je dors. Même quand je suis en vacances.

Je t'explique exactement comment il est construit dans une vidéo de 45 minutes.

🔥 Accès GRATUIT à la vidéo — 4 700 entrepreneurs l'ont déjà regardée`,
    adUrl: 'https://facebook.com/davidntunnel',
    niche: ['tunnel de vente', 'automation', 'marketing digital'],
    keywords: ['tunnel de vente', 'funnel', 'automatisation'],
    scrapedAt: new Date().toISOString(),
    analysis: {
      pattern: 'AIDA',
      hook: 'Mon tunnel de vente tourne depuis 14 mois. Il a généré 340 000€.',
      mainPain: 'Revenus non automatisés, dépendance à son temps de travail',
      solution: 'Tunnel de vente evergreen automatisé',
      offer: 'Vidéo gratuite 45 min — construction complète du tunnel',
      productType: 'Formation en ligne',
      price: 'Gratuit',
      niche: 'Marketing digital',
      cta: 'Accès gratuit à la vidéo',
      techniques: ['Résultat long terme', 'Répétition "même quand"', 'Transparence totale', 'Preuve de masse'],
      emotionalTriggers: ['envie de liberté', 'FOMO', 'curiosité', 'désir d\'automatisation'],
      urgencyLevel: 5,
      socialProofLevel: 9,
      overallScore: 86,
      summary: 'La durée (14 mois) + montant (340k€) prouve la durabilité. Les "même quand je dors / vacances" incarnent le rêve de tout entrepreneur. 4700 vues = preuve sociale considérable.',
    },
  },
  {
    id: 'fb-emma-d-lancement-produit',
    source: 'facebook',
    advertiser: 'Emma D.',
    advertiserPage: 'https://facebook.com/emmadlancement',
    language: 'fr' as const,
    country: 'FR',
    startDate: '2024-12-10',
    runDays: 88,
    adText: `J'ai lancé ma formation en novembre. 48h de lancement.

Objectif : 50 ventes.
Résultat : 127 ventes. 63 222€.

Pas d'audience existante. J'avais 340 abonnés Instagram.

Tout s'est joué sur une stratégie de lancement de 7 jours que j'ai apprise d'un marketeur américain.

Je te la traduis et adapte au marché français dans mon programme "Lancement 6 chiffres".

Accès immédiat · 397€ · Garantie 30 jours`,
    adUrl: 'https://facebook.com/emmadlancement',
    niche: ['lancement produit', 'marketing digital', 'formation'],
    keywords: ['lancement', 'formation en ligne', 'ventes'],
    scrapedAt: new Date().toISOString(),
    analysis: {
      pattern: 'BAB',
      hook: 'J\'ai lancé ma formation en novembre. 48h. 127 ventes. 63 222€.',
      mainPain: 'Ne pas savoir comment lancer une formation sans audience',
      solution: 'Stratégie de lancement 7 jours adaptée au marché FR',
      offer: 'Programme "Lancement 6 chiffres" — 397€ avec garantie 30j',
      productType: 'Programme',
      price: '397€',
      niche: 'Marketing digital',
      cta: 'Accès immédiat',
      techniques: ['Objectif vs Résultat (2.5x)', 'Sans audience', 'Garantie risque-zéro', 'Ancrage prix'],
      emotionalTriggers: ['stupéfaction', 'espoir', 'envie', 'confiance (garantie)'],
      urgencyLevel: 6,
      socialProofLevel: 8,
      overallScore: 88,
      summary: 'L\'écart entre objectif (50) et résultat réel (127) crée la stupéfaction. "340 abonnés" détruit l\'excuse "j\'ai pas d\'audience". La garantie 30j supprime le risque perçu.',
    },
  },
  {
    id: 'fb-theo-g-linkedin',
    source: 'facebook',
    advertiser: 'Théo G.',
    advertiserPage: 'https://facebook.com/theoglinkedin',
    language: 'fr' as const,
    country: 'FR',
    startDate: '2025-01-25',
    runDays: 60,
    adText: `J'ai posté chaque jour sur LinkedIn pendant 90 jours.

Résultat : 12 000 abonnés. 3 clients à 3 000€/mois. 1 offre d'emploi à 90k€/an (refusée).

Voici exactement ce que j'ai fait :
→ 1 format de post qui cartonne à chaque fois
→ 1 stratégie de commentaires pour le reach organique
→ 1 méthode pour convertir les vues en clients

Masterclass "LinkedIn 0 to 10k" — 90 minutes, 97€
Prochain live : vendredi 18h — 67 inscrits`,
    adUrl: 'https://facebook.com/theoglinkedin',
    niche: ['LinkedIn', 'personal branding', 'B2B'],
    keywords: ['LinkedIn', 'personal branding', 'prospection'],
    scrapedAt: new Date().toISOString(),
    analysis: {
      pattern: 'AIDA',
      hook: 'J\'ai posté chaque jour sur LinkedIn pendant 90 jours. Voici les résultats.',
      mainPain: 'Pas de visibilité LinkedIn, difficulté à trouver des clients B2B',
      solution: 'Système content + commentaires + conversion sur LinkedIn',
      offer: 'Masterclass 90min "LinkedIn 0 to 10k" — 97€',
      productType: 'Masterclass',
      price: '97€',
      niche: 'Marketing digital',
      cta: 'Vendredi 18h — 67 inscrits',
      techniques: ['Résultats multiples', 'Offre d\'emploi refusée (signal fort)', 'Liste à 3 points', 'Date précise'],
      emotionalTriggers: ['envie', 'curiosité', 'urgence', 'aspiration'],
      urgencyLevel: 8,
      socialProofLevel: 8,
      overallScore: 82,
      summary: 'L\'offre d\'emploi à 90k refusée est un signal de crédibilité exceptionnel — il préfère son business. Les 3 secrets en bullet points jouent sur la curiosité. La date précise crée l\'urgence.',
    },
  },
  {
    id: 'tiktok-sofia-p-yoga-online',
    source: 'tiktok',
    advertiser: 'Sofia P.',
    advertiserPage: 'https://tiktok.com/@sofiayoga',
    language: 'fr' as const,
    country: 'FR',
    startDate: '2025-02-10',
    runDays: 55,
    adText: `Si tu fais du yoga depuis 2 ans et que t'as toujours pas de résultats, voilà pourquoi 🧘

C'est pas ta pratique. C'est ta régularité.

J'ai créé un programme de 21 jours conçu pour les gens qui "n'ont pas le temps".

15 minutes par jour. À n'importe quelle heure. Résultats visibles en 3 semaines.

2 400 personnes l'ont terminé. Note moyenne : 4.9/5.

Lien en bio → "21 jours pour transformer ton corps et ton esprit"
Tarif : 37€ — Prix augmente vendredi`,
    adUrl: 'https://tiktok.com/@sofiayoga',
    niche: ['yoga', 'bien-être', 'fitness'],
    keywords: ['yoga', 'bien-être', 'développement personnel'],
    scrapedAt: new Date().toISOString(),
    analysis: {
      pattern: 'PAS',
      hook: 'Si tu fais du yoga depuis 2 ans et que t\'as toujours pas de résultats, voilà pourquoi',
      mainPain: 'Manque de régularité et de résultats malgré la pratique',
      solution: 'Programme 21 jours de 15 min/jour adapté aux emplois du temps chargés',
      offer: 'Programme "21 jours yoga" — 37€, prix augmente vendredi',
      productType: 'Programme',
      price: '37€',
      niche: 'Fitness & Santé',
      cta: 'Lien en bio — Prix augmente vendredi',
      techniques: ['Diagnostic surprise', 'Objection temps levée', 'Note précise', 'Price increase deadline'],
      emotionalTriggers: ['frustration', 'soulagement', 'espoir', 'urgence prix'],
      urgencyLevel: 8,
      socialProofLevel: 9,
      overallScore: 81,
      summary: 'Le diagnostic "c\'est pas ta pratique, c\'est ta régularité" est un reframe libérateur. 2400 complétions + 4.9/5 = preuve sociale hors norme. La deadline prix du vendredi est une urgence réelle et crédible.',
    },
  },
  // ── 4 ads originales ────────────────────────────────────────────────────────
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
