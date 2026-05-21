import Anthropic from '@anthropic-ai/sdk'
import { ProductBrief, VSLScript, Scene, SceneType, AnimationType } from './types'

const client = new Anthropic()

function buildSystemPrompt(): string {
  return `Tu es un expert en copywriting VSL (Video Sales Letter) et motion design.
Tu génères des scripts VSL structurés au format JSON pour des vidéos animées avec Remotion.

Règles absolues :
- Chaque scène doit avoir un headline percutant (max 8 mots, CAPS pour les mots clés)
- Les bullets sont courts (max 6 mots chacun)
- Le style doit varier entre les scènes pour maintenir l'attention
- Adapter le ton à la langue (fr = familier mais percutant, en = direct)
- La durée totale doit correspondre au durationSeconds demandé
- 30 frames = 1 seconde

Types de scènes disponibles : hook, problem, agitate, solution, proof, cta, story, features, testimonials, offer
Animations disponibles : glitch, slide, pop, counter, stagger, zoom

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

  const sceneOrder = patternGuide[brief.pattern] || patternGuide.PAS

  return `Génère un script VSL pour ce produit :

PRODUIT : ${brief.product}
CIBLE : ${brief.target}
DOULEUR PRINCIPALE : ${brief.mainPain}
SOLUTION : ${brief.solution}
OFFRE : ${brief.offer}
${brief.price ? `PRIX : ${brief.price}` : ''}
${brief.guarantee ? `GARANTIE : ${brief.guarantee}` : ''}
${brief.testimonials?.length ? `TÉMOIGNAGES : ${brief.testimonials.join(' | ')}` : ''}
PATTERN : ${brief.pattern} (structure : ${sceneOrder})
DURÉE TOTALE : ${brief.durationSeconds} secondes (${totalFrames} frames à 30fps)
FORMAT : ${brief.format}
LANGUE : ${brief.language}

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
        "headline": "HEADLINE PERCUTANT EN CAPS PARTIELS",
        "subtext": "Texte secondaire optionnel",
        "bullets": ["Point 1", "Point 2"],
        "metric": {"value": "39 345€", "label": "en 1 mois"},
        "counterValue": "39345",
        "style": "dramatic|proof|energetic|calm|urgent"
      },
      "animation": "glitch|slide|pop|counter|stagger|zoom"
    }
  ],
  "totalFrames": ${totalFrames},
  "fps": 30
}

La somme des durationFrames doit être égale à ${totalFrames}.
Pour la scène hook, utilise l'animation "glitch" ou "stagger".
Pour les métriques/chiffres, utilise l'animation "counter".
Pour la scène cta, utilise le style "urgent".
Génère entre 5 et 8 scènes selon la durée.`
}

export async function generateVSLScript(brief: ProductBrief): Promise<VSLScript> {
  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4000,
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
