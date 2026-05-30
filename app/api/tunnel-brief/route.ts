import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { requirePlan } from '@/lib/api-auth'

const client = new Anthropic({ timeout: 60_000 })
export const maxDuration = 60

export async function POST(request: NextRequest) {
  const auth = await requirePlan('brief')
  if (auth.error) return auth.error

  try {
    const { analysis, url } = await request.json()

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Tu es un expert en création de tunnels de vente sur systeme.io.

Voici l'analyse d'un tunnel concurrent :
URL: ${url}
Headline: ${analysis.headline}
Offre: ${analysis.offer}
Prix: ${analysis.price}
CTA: ${analysis.cta}
Niche: ${analysis.niche}
Cible: ${analysis.targetAudience}
Douleur principale: ${analysis.mainPain}
Structure copywriting: ${analysis.copyType}
FOMO: ${analysis.hasFomo}
Garantie: ${analysis.hasGuarantee ? analysis.guaranteeText : 'Non'}
Résumé: ${analysis.summary}

Génère un brief complet pour recréer ce tunnel dans systeme.io. Réponds en JSON strict :
{
  "funnelName": "Nom suggéré pour le funnel",
  "funnelType": "optin|sales|webinar|challenge",
  "steps": [
    {
      "stepName": "Nom de l'étape",
      "stepType": "squeeze|sales|order|upsell|thankyou",
      "headline": "Titre principal de la page",
      "subheadline": "Sous-titre",
      "bodyContent": "Corps de texte principal (3-5 phrases de copy percutant)",
      "cta": "Texte du bouton",
      "colorTheme": "hex couleur principale suggérée"
    }
  ],
  "emailSequence": [
    {
      "delay": 0,
      "subject": "Objet de l'email",
      "preview": "Texte de preview (1 ligne)",
      "purpose": "Objectif de cet email"
    }
  ],
  "recommendedPrice": "${analysis.price || '97'}",
  "systemeioTips": ["Conseil spécifique systeme.io 1", "Conseil 2", "Conseil 3"]
}`
      }]
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : '{}'
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const brief = JSON.parse(cleaned)

    return NextResponse.json(brief)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur' }, { status: 500 })
  }
}
