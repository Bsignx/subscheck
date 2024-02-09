import { AUTH_STATUS_MESSAGE } from '@/entities/auth'

import {
  DeleteVerificationToken,
  GetUserByEmail,
  GetVerificationTokenByToken,
  UpdateUser
} from './types'

type Params = {
  context: {
    getVerificationTokenByToken: GetVerificationTokenByToken
    getUserByEmail: GetUserByEmail
    updateUser: UpdateUser
    deleteVerificationToken: DeleteVerificationToken
  }
  data: {
    token: string
  }
}

export async function verifyEmailUseCase({ context, data }: Params) {
  const existingToken = await context.getVerificationTokenByToken(data.token)

  if (!existingToken) {
    return { error: AUTH_STATUS_MESSAGE.TOKEN_DOES_NOT_EXIST }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) {
    return { error: AUTH_STATUS_MESSAGE.TOKEN_EXPIRED }
  }

  const existingUser = await context.getUserByEmail(existingToken.email)

  if (!existingUser) {
    return { error: AUTH_STATUS_MESSAGE.EMAIL_DOES_NOT_EXIST }
  }

  await context.updateUser(existingUser.id, {
    emailVerified: new Date(),
    email: existingToken.email
  })

  await context.deleteVerificationToken(existingToken.id)

  return { success: AUTH_STATUS_MESSAGE.EMAIL_VERIFIED }
}
