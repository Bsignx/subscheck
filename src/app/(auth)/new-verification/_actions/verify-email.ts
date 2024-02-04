'use server'

import { ActionReturn } from '@/app/_actions/types'
import { getUserByEmail, updateUser } from '@/data-access/auth/user'
import {
  deleteVerificationToken,
  getVerificationTokenByToken
} from '@/data-access/auth/verification-token'

type Return = ActionReturn

export const verifyEmail = async (token: string): Promise<Return> => {
  const existingToken = await getVerificationTokenByToken(token)

  if (!existingToken) {
    return { error: 'Token does not exist!' }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) {
    return { error: 'Token has expired!' }
  }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser) {
    return { error: 'Email does not exist!' }
  }

  await updateUser(existingUser.id, {
    emailVerified: new Date(),
    email: existingToken.email
  })

  await deleteVerificationToken(existingToken.id)

  return { success: 'Email verified!' }
}
