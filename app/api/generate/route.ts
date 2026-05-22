import { NextRequest, NextResponse } from 'next/server'
import { generateVSLScript } from '@/lib/claude'
import { ProductBrief } from '@/lib/types'

export const maxDuration = 120

export async function POST(request: NextRequest) {
  try {
    const brief: ProductBrief = await request.json()

    if (!brief.product || !brief.mainPain || !brief.solution) {
      return NextResponse.json(
        { error: 'Champs requis manquants : product, mainPain, solution' },
        { status: 400 }
      )
    }

    const script = await generateVSLScript(brief)
    return NextResponse.json({ script })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur de génération' },
      { status: 500 }
    )
  }
}
