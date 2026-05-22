import { NextRequest, NextResponse } from 'next/server'

const SYSTEME_BASE = 'https://api.systeme.io/api'

export async function GET(request: NextRequest) {
  const apiKey = request.nextUrl.searchParams.get('apiKey') || request.headers.get('x-systeme-key')
  const resource = request.nextUrl.searchParams.get('resource') || 'contacts'

  if (!apiKey) return NextResponse.json({ error: 'API key manquante' }, { status: 400 })

  try {
    const res = await fetch(`${SYSTEME_BASE}/${resource}?itemsPerPage=50`, {
      headers: {
        'X-API-Key': apiKey,
        'Accept': 'application/json',
      },
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `Erreur systeme.io (${res.status}): ${err}` }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Impossible de contacter systeme.io' }, { status: 500 })
  }
}
