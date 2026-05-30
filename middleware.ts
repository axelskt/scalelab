export { auth as middleware } from '@/auth'

export const config = {
  // Protège toutes les pages dashboard (routes sous le groupe (dashboard))
  // Exclut: /login, /privacy, /api/*, /marketing, fichiers statiques
  matcher: [
    '/((?!login|privacy|api|_next/static|_next/image|favicon.ico|icon.svg|manifest.json|apple-icon.png).*)',
  ],
}
