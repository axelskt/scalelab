import Anthropic from '@anthropic-ai/sdk'
import { Transcription, VSLScoreBreakdown, SupportedLanguage } from './ads-db'

const client = new Anthropic({ timeout: 120_000, maxRetries: 2 })

// ─── Score une VSL à partir de son texte ─────────────────────────────────────
export async function scoreVSL(text: string, language: SupportedLanguage): Promise<VSLScoreBreakdown> {
  const langLabel = { fr: 'français', en: 'anglais', es: 'espagnol', de: 'allemand', pt: 'portugais', it: 'italien', unknown: 'inconnu' }[language]

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1200,
    system: `Tu es un expert en VSL (Video Sales Letter) et copywriting persuasif.
Tu évalues des scripts VSL avec précision et impartialité.
Tu réponds UNIQUEMENT en JSON valide sans markdown.`,
    messages: [{
      role: 'user',
      content: `Évalue ce script VSL en ${langLabel} et donne-lui une note détaillée.

SCRIPT :
"""
${text}
"""

Réponds avec ce JSON exact :
{
  "overall": 72,
  "hookStrength": 8,
  "patternClarity": 6,
  "emotionalImpact": 7,
  "ctaStrength": 5,
  "pacing": 7,
  "strengths": [
    "Hook percutant avec chiffre précis",
    "Bon storytelling personnel",
    "Preuve sociale crédible"
  ],
  "weaknesses": [
    "CTA pas assez urgent",
    "Transition agitation → solution trop abrupte",
    "Pas de garantie mentionnée"
  ]
}

Critères de notation :
- hookStrength (0-10) : Les 5-10 premières secondes arrêtent-elles le scroll ?
- patternClarity (0-10) : La structure (PAS/AIDA/etc) est-elle claire et efficace ?
- emotionalImpact (0-10) : Le script touche-t-il les douleurs et désirs profonds ?
- ctaStrength (0-10) : L'appel à l'action est-il clair, urgent, irrésistible ?
- pacing (0-10) : Le rythme maintient-il l'attention du début à la fin ?
- overall (0-100) : Note globale pondérée (hook x2, emotional x2, cta x1.5, pattern x1.5, pacing x1)

Sois honnête et précis. Un score de 80+ = script vraiment excellent.`
    }]
  })

  const text2 = response.content[0].type === 'text' ? response.content[0].text : '{}'
  return JSON.parse(text2.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()) as VSLScoreBreakdown
}

// ─── Améliore un transcript VSL ──────────────────────────────────────────────
export async function improveTranscript(
  originalText: string,
  score: VSLScoreBreakdown,
  language: SupportedLanguage
): Promise<{ improved: string; improvements: string[] }> {
  const langLabel = { fr: 'français', en: 'anglais', es: 'espagnol', de: 'allemand', pt: 'portugais', it: 'italien', unknown: 'français' }[language]

  const weaknessContext = score.weaknesses.length > 0
    ? `Faiblesses identifiées à corriger :\n${score.weaknesses.map(w => `- ${w}`).join('\n')}`
    : ''

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2000,
    system: `Tu es un expert copywriter VSL de niveau mondial. Tu améliores des scripts VSL pour maximiser la conversion.
Tu gardes la voix et l'authenticité de l'original tout en corrigeant les faiblesses identifiées.
Tu réponds UNIQUEMENT en JSON valide sans markdown.`,
    messages: [{
      role: 'user',
      content: `Améliore ce script VSL en ${langLabel}. Note actuelle : ${score.overall}/100.

SCRIPT ORIGINAL :
"""
${originalText}
"""

${weaknessContext}

Points forts à conserver : ${score.strengths.join(', ')}

Génère une version améliorée qui :
1. Renforce le hook (vise un hookStrength de 9/10)
2. Clarifie la structure et les transitions
3. Amplifie l'impact émotionnel sur les douleurs
4. Rend le CTA plus urgent et irrésistible
5. Ajoute une garantie ou preuve sociale si manquante
6. Maintient la longueur originale (±20%)

Réponds avec ce JSON exact :
{
  "improved": "Le texte du script amélioré complet...",
  "improvements": [
    "Hook réécrit avec chiffre de transformation immédiat",
    "Ajout d'une urgence temporelle dans le CTA",
    "Transition agitation/solution avec phrase-pont",
    "Garantie 30 jours ajoutée pour lever les objections"
  ]
}

L'improved doit être le script complet, prêt à être lu/enregistré.`
    }]
  })

  const text2 = response.content[0].type === 'text' ? response.content[0].text : '{}'
  const parsed = JSON.parse(text2.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
  return { improved: parsed.improved, improvements: parsed.improvements }
}

// ─── Simule une transcription (en attendant Whisper) ─────────────────────────
// Pour les ads sans vidéo, on utilise le texte de l'ad comme base de transcription
export async function generateTranscriptionFromAdText(
  adText: string,
  language: SupportedLanguage
): Promise<Transcription> {
  // Pour l'instant on utilise le texte de l'ad
  // En production : appel à Whisper API sur la vidéo
  const rawText = adText

  const score = await scoreVSL(rawText, language)
  const { improved, improvements } = await improveTranscript(rawText, score, language)

  return {
    raw: rawText,
    language,
    wordCount: rawText.split(' ').length,
    durationSeconds: Math.round(rawText.split(' ').length / 2.5), // ~2.5 mots/seconde voix off
    score,
    improvedVersion: improved,
    improvements,
    generatedAt: new Date().toISOString(),
  }
}
