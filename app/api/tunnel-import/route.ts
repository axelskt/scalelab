import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ timeout: 60_000 })

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || !url.startsWith('http')) {
      return NextResponse.json({ error: 'URL invalide' }, { status: 400 })
    }

    // Fetch the page HTML
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9',
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) {
      return NextResponse.json({ error: `Impossible d'accéder à la page (${res.status})` }, { status: 400 })
    }

    const html = await res.text()

    // Strip HTML tags, keep text content
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 8000) // limit tokens

    // Detect builder from HTML
    const builderDetect = (() => {
      const h = html.toLowerCase()
      if (h.includes('systeme.io') || h.includes('systeme-io')) return 'systeme.io'
      if (h.includes('clickfunnels')) return 'clickfunnels'
      if (h.includes('learnybox')) return 'learnybox'
      if (h.includes('kartra')) return 'kartra'
      if (h.includes('gumroad')) return 'gumroad'
      if (h.includes('shopify')) return 'shopify'
      if (h.includes('wordpress') || h.includes('wp-content')) return 'wordpress'
      return null
    })()

    // Analyze with Claude
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `Analyse cette page de vente et extrait les informations suivantes au format JSON strict (sans markdown).

URL: ${url}
Contenu de la page:
${text}

Réponds UNIQUEMENT avec ce JSON:
{
  "headline": "Le titre principal de la page",
  "subheadline": "Le sous-titre ou accroche secondaire",
  "offer": "Description courte de l'offre/produit vendu",
  "price": "Le prix si visible (ex: 97€, 297€/mois, GRATUIT)",
  "cta": "Le texte du bouton principal (ex: Je veux accéder, S'inscrire gratuitement)",
  "niche": "La niche (ex: Business, Santé, Immobilier, Crypto, Coaching)",
  "targetAudience": "La cible visée en 1 phrase courte",
  "mainPain": "La douleur principale adressée",
  "copyType": "PAS|AIDA|PASTOR|BAB|Story",
  "hasFomo": true,
  "hasGuarantee": true,
  "guaranteeText": "Texte de la garantie si présente",
  "testimonialCount": 0,
  "language": "fr|en|es",
  "summary": "Résumé de 2 phrases de ce que vend cette page"
}`
      }]
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : '{}'
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const analysis = JSON.parse(cleaned)

    return NextResponse.json({
      url,
      builder: builderDetect,
      analysis,
      scrapedAt: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Tunnel import error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur d\'import' },
      { status: 500 }
    )
  }
}
