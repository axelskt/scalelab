import Anthropic from '@anthropic-ai/sdk'
import { ProductBrief, VSLScript, Scene, SceneType, AnimationType } from './types'

const client = new Anthropic({ timeout: 120_000, maxRetries: 2 })

// ─── HOOK LIBRARY — extracted from 14 high-converting VSL scripts ─────────────
// Each formula is battle-tested from real French/EN infopreneur ads
const HOOK_FORMULAS = `
FORMULES DE HOOK (choisir selon le contexte) :

1. ASYMÉTRIE D'INFO : "Les meilleurs [X] ne testent pas. Ils savent déjà ce qui marche parce qu'ils ont accès à [donnée] que tu n'as pas."
   → Crée un sentiment d'exclusion, de FOMO immédiat. Puissant pour SaaS/outils d'analyse.

2. RÉSULTAT D'ABORD : "De complètement fauché à [chiffre précis] en [durée]. Je te raconte comment."
   → Commence par la fin, le cerveau veut savoir comment. Ex: "39.345€ en 30 jours"

3. DÉFI CHRONO : "J'ai 45 secondes pour te convaincre que [X] est meilleur que [Y]. C'est parti."
   → Tension artificielle, l'audience reste pour voir si le défi est relevé.

4. QUALIFICATION DIRECTE : "T'es [profil exact] ? Et ton [KPI] stagne à [palier] ? Lis la suite."
   → Parle à UNE personne précise. Tout le monde qui correspond se sent visé.

5. PROBLÈME UNIVERSEL NOMMÉ : "Les [cible], tous, tous, tous ont le même problème : [douleur]."
   → Valide que tu connais exactement leur souffrance avant de proposer quoi que ce soit.

6. MIROIR BRUTAL : "T'as un [actif] mais personne ne te prend au sérieux. [conséquence négative précise]."
   → Nomme le gap entre ce qu'ils ont et ce qu'ils veulent être perçus.

7. DISRUPTION DE PARADIGME : "Tu as passé des années à [effort ancien]. Et là, [disruption arrive]. [Actif] ne disparaît pas — il se transforme."
   → Peur de l'obsolescence, parfait pour les secteurs en mutation (SEO → GEO, etc.)

8. META-DÉMONSTRATION : "Cette vidéo nous a coûté [montant choc] à produire."
   → Utilise la vidéo elle-même comme preuve du produit. Méta et mémorable.

9. LIVE SOCIAL PROOF : "On vient de dépasser [chiffre] utilisateurs. Voici comment."
   → La progression chiffrée est elle-même la preuve sociale.

10. TRIGGER ÉMOTIONNEL FAMILIAL : "[Personne proche] attend que tu réussisses. Elle te le dira jamais. Par amour, qu'est-ce que tu ferais pour elle ?"
    → Relie le business à une identité profonde et des relations réelles.

11. ANTI-GURU POSITIONING : "Désolé, si tu cherches [méthode miracle], tu peux quitter. Moi j'aime la simplicité."
    → Repousse les mauvais leads, crédibilise instantanément auprès des bons.

12. GARANTIE INVERSÉE CHOC : "J'ai payé un avocat pour rédiger un contrat. Soit tu gagnes avec moi, soit je te paye [montant] cash de ma poche."
    → Renverse le risque à 100%. Donne du drama légal à la garantie.
`

// ─── STORYTELLING STRUCTURES ──────────────────────────────────────────────────
const STORYTELLING_GUIDE = `
STRUCTURES NARRATIVES QUI CONVERTISSENT :

PARCOURS HÉROS (pour offres perso/formation) :
→ Âge + contexte → Tentatives multiples ratées (liste les business) → Moment de rupture → Découverte → Premier résultat → Résultats scalés → "Maintenant je veux t'aider"
Exemple : "J'ai 21 ans. J'ai tout tenté : Dropshipping, Trading, Crypto, Amazon FBA. Des milliers d'heures, des milliers d'euros de perdu. Puis en 2023 j'ai découvert [X]. Première vente en 4 jours. 4.000€ le 2ème mois. Aujourd'hui 20.000€/mois."

DÉMONSTRATION EN LIVE (pour SaaS/outils) :
→ "Regarde ce que je fais" → action en temps réel → résultat visible → "Tu vois ? C'est ça [produit]."
Court, visuel, crédible. Pas de promesse — juste de la preuve.

AVANT/APRÈS CONTRASTE (pour tout) :
→ Peindre la vie SANS le produit (douleur maximale, détails spécifiques) → "Maintenant imagine..." → Peindre la vie AVEC (libérée, précise) → "Le pont entre les deux, c'est [produit]."

PARADIGME SHIFT (pour marchés qui changent) :
→ "Tu as travaillé dur sur [l'ancien modèle]." → "Mais le marché a changé — voici comment." → "Tes concurrents s'adaptent déjà." → "Il te reste X temps pour prendre de l'avance."
`

// ─── PROOF & SOCIAL PROOF PATTERNS ───────────────────────────────────────────
const PROOF_GUIDE = `
PATTERNS DE PREUVE QUI CONVAINQUENT :

CHIFFRES PRÉCIS (jamais ronds) :
→ "39.345€" > "40.000€"  |  "1637€" > "1600€"  |  "+350 entrepreneurs" > "+300"
→ La précision = authenticité. Les chiffres ronds sonnent inventés.

TÉMOIGNAGES NOMMÉS + DÉLAI :
→ "Alexis : 1637€ son premier mois"  |  "Enzo : 2600€ en 28 jours, première vente de 297€ en 4 jours"  |  "Victor : 4500€ en 1 mois, il a rejoint il y a 3 mois"
→ Toujours : prénom + résultat chiffré + délai. Jamais anonyme.

SOCIAL PROOF À ÉCHELLE :
→ "+350 entrepreneurs accompagnés depuis 2022"  |  "1 million de personnes"  |  "4000+ clients dans notre réseau"

PREUVE LÉGALE/INSTITUTIONNELLE :
→ "Un avocat a rédigé le contrat"  |  "Certifié par [organisme]"
→ Transforme une promesse en engagement formel.
`

// ─── CTA FORMULAS ─────────────────────────────────────────────────────────────
const CTA_GUIDE = `
CALL-TO-ACTION QUI CONVERTISSENT :

SIMPLE GRATUIT : "Clique sur [démarrer gratuitement / essayer 3 jours / accéder] maintenant."

HIGH-TICKET : "Réserve un appel avec mon équipe pour voir si on peut multiplier ton CA."

WEBINAIRE/CHALLENGE : "Clique sur 'Savoir plus' et réserve ta place avant qu'un humain ne la prenne."

URGENCE RÉELLE : "Seulement du [date] au [date]. Il n'y aura plus jamais moyen d'y accéder."

DOUBLE CTA (segmenté) :
→ "Tu gagnes moins de 1500€/mois ? → Envoie-moi un MP, j'ai des ressources gratuites."
→ "Tu fais 3K-30K/mois ? → Réserve un appel pour voir comment multiplier ça."

GARANTIE DANS LE CTA : "Si tu ne fais pas d'argent en 2 mois, je te rembourse intégralement et je travaille gratuitement avec toi jusqu'à tes premiers revenus."
`

// ─── EMOTIONAL TRIGGER SEQUENCES ─────────────────────────────────────────────
const EMOTIONAL_GUIDE = `
SÉQUENCE D'ÉMOTIONS (ordre optimal pour convertir) :

1. DOULEUR/FRUSTRATION → nommer précisément ce qu'ils ressentent
2. VALIDATION → "t'es pas seul, tout le monde a ce problème"
3. ESPOIR → "il existe une solution"
4. CRÉDIBILITÉ → "et moi je l'ai trouvée / je l'ai construite"
5. DÉSIR → montrer la vie rêvée avec chiffres et détails
6. URGENCE → "mais seulement si tu agis maintenant"
7. SÉCURITÉ → garantie qui élimine le risque

ANTI-PATTERNS À ÉVITER :
✗ "Ma méthode révolutionnaire qui va changer ta vie" (trop générique)
✗ Promesses de richesse rapide sans contexte (brûle la crédibilité)
✗ CTA sans friction (trop vague : "En savoir plus" seul)
✗ Hook qui commence par "Bonjour, je m'appelle X" (aucun impact)
✗ Bullet points génériques ("Accès illimité", "Support 24/7") sans bénéfice émotionnel
`

function buildSystemPrompt(): string {
  return `Tu es le meilleur copywriter VSL au monde, spécialisé dans l'infopreneur français et les offres digitales.
Tu génères des scripts VSL structurés au format JSON pour des vidéos animées avec Remotion.

Tu t'inspires des scripts VSL des meilleures marques : Whoscale, Captions, IA LEBD, Slack, Empire Internet, Eskimoz, SubMagic — des scripts qui convertissent vraiment.

${HOOK_FORMULAS}

${STORYTELLING_GUIDE}

${PROOF_GUIDE}

${CTA_GUIDE}

${EMOTIONAL_GUIDE}

RÈGLES ABSOLUES DU FORMAT JSON :
- Chaque scène doit avoir un headline percutant (max 8 mots, CAPS pour les mots clés)
- Les bullets sont courts (max 6 mots chacun), toujours orientés bénéfice ou transformation
- Le style doit varier entre les scènes pour maintenir l'attention
- Adapter le ton à la langue (fr = familier mais percutant, en = direct)
- La durée totale doit correspondre au durationSeconds demandé
- 30 frames = 1 seconde

Types de scènes disponibles : hook, problem, agitate, solution, proof, cta, story, features, testimonials, offer
Animations disponibles : glitch, slide, pop, counter, stagger, zoom, split, notification, float, inline

Choix animations :
- split : scènes features/solution avec texte + UI côte à côte
- notification : scènes features montrant le produit en action avec alertes/statuts
- float : scènes proof/testimonials avec plusieurs profils (social proof)
- inline : scènes hook/agitate avec UN mot mis en valeur (ex: "[seule]")
- counter : toujours pour les métriques et chiffres clés
- glitch : hook dramatique, disruption
- stagger : listes de bénéfices, bullets animés
- zoom : moment de révélation, solution présentée

Tu réponds UNIQUEMENT avec du JSON valide, sans markdown, sans explication.`
}

function buildUserPrompt(brief: ProductBrief): string {
  const fps = 30
  const totalFrames = brief.durationSeconds * fps

  const patternGuide: Record<string, string> = {
    PAS: 'hook → problem → agitate → solution → features → proof → cta',
    AIDA: 'hook → story → features → testimonials → offer → cta',
    PASTOR: 'hook → problem → agitate → story → testimonials → offer → cta',
    BAB: 'hook → problem → solution → features → proof → cta',
    Story: 'hook → story → solution → proof → offer → cta',
  }

  // Pattern-specific hook guidance
  const patternHookGuide: Record<string, string> = {
    PAS: 'Utilise la formule PROBLÈME UNIVERSEL NOMMÉ ou MIROIR BRUTAL. Nomme exactement la douleur.',
    AIDA: 'Utilise la formule RÉSULTAT D\'ABORD ou ASYMÉTRIE D\'INFO. Arrête le scroll avec un chiffre ou une asymétrie.',
    PASTOR: 'Utilise la formule TRIGGER ÉMOTIONNEL ou ANTI-GURU POSITIONING. Tu racontes une histoire vraie.',
    BAB: 'Utilise la formule RÉSULTAT D\'ABORD. Montre la transformation chiffrée dès le premier mot.',
    Story: 'Utilise la formule PARCOURS HÉROS. Commence par le moment pivot, pas par la présentation.',
  }

  const sceneOrder = patternGuide[brief.pattern] || patternGuide.PAS
  const hookGuide = patternHookGuide[brief.pattern] || patternHookGuide.PAS

  const hasTestimonials = brief.testimonials && brief.testimonials.length > 0
  const hasGuarantee = brief.guarantee && brief.guarantee.length > 0
  const hasPrice = brief.price && brief.price.length > 0

  return `Génère un script VSL haute conversion pour ce produit. Inspire-toi des meilleurs scripts qui ont fait des millions : WhoScale, Captions, IA LEBD, Eskimoz.

═══ BRIEF PRODUIT ═══
PRODUIT : ${brief.product}
CIBLE : ${brief.target}
DOULEUR PRINCIPALE : ${brief.mainPain}
SOLUTION : ${brief.solution}
OFFRE : ${brief.offer}
${hasPrice ? `PRIX : ${brief.price}` : ''}
${hasGuarantee ? `GARANTIE : ${brief.guarantee}` : ''}
${hasTestimonials ? `TÉMOIGNAGES : ${brief.testimonials!.join(' | ')}` : ''}

═══ STRUCTURE ═══
PATTERN : ${brief.pattern} (ordre des scènes : ${sceneOrder})
DURÉE TOTALE : ${brief.durationSeconds} secondes (${totalFrames} frames à 30fps)
FORMAT : ${brief.format}
LANGUE : ${brief.language}

═══ DIRECTIVES COPY ═══
HOOK : ${hookGuide}
- Utilise des chiffres PRÉCIS (jamais ronds) dans les métriques
- Les bullets doivent être des bénéfices transformationnels, pas des features
- Le CTA doit inclure${hasGuarantee ? ' la garantie et' : ''} un élément d'urgence${hasGuarantee ? '' : ' (places limitées, temps limité, etc.)'}
- La scène "problem" ou "agitate" doit nommer 3 douleurs TRÈS spécifiques à ${brief.target}
- Ton: ${brief.language === 'fr' ? 'français familier mais percutant, tutoyer, direct, pas corporate' : 'direct, data-driven, punchy'}

Génère exactement ce JSON (sans markdown) :
{
  "meta": {
    "pattern": "${brief.pattern}",
    "product": "${brief.product}",
    "target": "${brief.target}",
    "offer": "${brief.offer}",
    "price": "${brief.price || ''}",
    "guarantee": "${brief.guarantee || ''}",
    "duration": ${brief.durationSeconds},
    "format": "${brief.format}",
    "language": "${brief.language}"
  },
  "scenes": [
    {
      "id": "scene_id",
      "type": "hook|problem|agitate|solution|proof|cta|story|features|testimonials|offer",
      "title": "Nom de la scène",
      "durationFrames": 150,
      "content": {
        "headline": "HEADLINE PERCUTANT max 8 mots",
        "subtext": "Texte secondaire optionnel (30-60 mots, copywriting conversationnel)",
        "bullets": ["Bénéfice transformationnel 1", "Bénéfice 2"],
        "metric": {"value": "chiffre précis", "label": "contexte en 2-4 mots"},
        "counterValue": "chiffre seul sans unité",
        "style": "dramatic|proof|energetic|calm|urgent"
      },
      "animation": "glitch|slide|pop|counter|stagger|zoom|split|notification|float|inline"
    }
  ],
  "totalFrames": ${totalFrames},
  "fps": 30
}

RÈGLES STRICTES :
- La somme des durationFrames DOIT être égale à ${totalFrames}
- Hook : animation "glitch", "stagger" ou "inline" (inline = mot entre [crochets])
- Métriques/chiffres : animation "counter" obligatoire
- Features avec produit : "split" ou "notification"
- Proof/testimonials multi-personnes : "float"
- CTA : style "urgent" toujours
- Génère entre ${brief.durationSeconds <= 60 ? '5 et 6' : brief.durationSeconds <= 120 ? '6 et 8' : '7 et 10'} scènes
- Quand animation "inline", mets le mot clé entre [crochets] dans le headline : ex "La [seule] solution qui marche"`
}

export async function generateVSLScript(brief: ProductBrief): Promise<VSLScript> {
  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    system: buildSystemPrompt(),
    messages: [
      {
        role: 'user',
        content: buildUserPrompt(brief),
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  // Clean potential markdown
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const parsed = JSON.parse(cleaned) as VSLScript

  return parsed
}
