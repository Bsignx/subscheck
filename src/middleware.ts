import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'

import authConfig from './lib/auth/auth-config'
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes
} from './lib/auth/auth-routes'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoute) {
    return null
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null
  }

  if (!isLoggedIn && !isPublicRoute) {
    const hasVisitedCookie = req.cookies.get('hasVisited')
    const hasVisited = hasVisitedCookie?.value === 'true'

    if (!hasVisited) {
      const response = NextResponse.redirect(new URL('/auth/welcome', nextUrl))

      response.cookies.set({
        name: 'hasVisited',
        value: 'true',
        path: '/',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
      })

      return response
    }

    let callbackUrl = nextUrl.pathname
    if (nextUrl.search) {
      callbackUrl += nextUrl.search
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl)

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    )
  }

  return null
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}
