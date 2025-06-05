import { getSessionCookie } from 'better-auth/cookies'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  if (!sessionCookie) {
    const { pathname, origin } = request.nextUrl
    const redirect = pathname !== '/dashboard' ? `?redirect=${pathname}` : ''
    const url = new URL(`/login${redirect}`, origin)

    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
