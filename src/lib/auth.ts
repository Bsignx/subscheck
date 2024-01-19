import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse
} from 'next'
import {
  AuthOptions,
  DefaultSession,
  getServerSession,
  NextAuthOptions
} from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { unstable_noStore } from 'next/cache'

import { db } from '@/server/db'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt'
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (!user?.email || !token?.email) throw new Error('no email found')

      const dbUser = await db.user.findUnique({
        where: { email: user?.email ?? token?.email }
      })

      if (!dbUser) {
        throw new Error('no user with email found')
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image
      }
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }

      return session
    }
  }
} satisfies AuthOptions

// Use it in server contexts
export async function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  unstable_noStore()
  const session = await getServerSession(...args, authConfig)
  return { getUser: () => session?.user && { userId: session.user.id } }
}
