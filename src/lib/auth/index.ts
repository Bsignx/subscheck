import NextAuth, { type Session } from 'next-auth'
import { type JWT } from 'next-auth/jwt'

import { getAccountByUserId } from '@/data-access/account'
import { getTwoFactorConfirmationByUserId } from '@/data-access/two-factor-confirmation'
import { getUserById } from '@/data-access/user'
import { db } from '@/server/db'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

import authConfig from './auth-config'

declare module 'next-auth' {
  interface User {
    role: string
    isOAuth?: boolean
    isTwoFactorEnabled?: boolean
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    role: string
    isTwoFactorEnabled?: boolean
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update
} = NextAuth({
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/auth-error'
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true

      const existingUser = await getUserById(user.id)

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        )

        if (!twoFactorConfirmation) return false

        // Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        })
      }

      return true
    },

    async session(params) {
      const { session, token } = params as {
        session: Session
        token: JWT
      }

      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
      }

      if (session.user) {
        session.user.name = token.name
        session.user.email = token.email
        session.user.isOAuth = token.isOAuth as boolean
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      const existingAccount = await getAccountByUserId(existingUser.id)

      token.isOAuth = !!existingAccount
      token.name = existingUser.name
      token.email = existingUser.email
      token.role = existingUser.role
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

      return token
    }
  },
  adapter: PrismaAdapter(db),
  ...authConfig
})

export const currentUser = async () => {
  const session = await auth()

  return session?.user
}

export const currentRole = async () => {
  const session = await auth()

  return session?.user?.role
}