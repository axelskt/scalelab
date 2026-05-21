export { auth as middleware } from '@/auth'

export const config = {
  // Protect only dashboard routes (not marketing pages or API)
  matcher: ['/app/:path*'],
}
