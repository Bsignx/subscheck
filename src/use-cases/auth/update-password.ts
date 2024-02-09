import { AUTH_STATUS_MESSAGE } from '@/entities/auth'

import {
  DeletePasswordResetToken,
  GetPasswordResetTokenByToken,
  GetUserByEmail,
  Hash,
  UpdateUser
} from './types'

type Params = {
  context: {
    getUserByEmail: GetUserByEmail
    updateUser: UpdateUser
    deletePasswordResetToken: DeletePasswordResetToken
    getPasswordResetTokenByToken: GetPasswordResetTokenByToken
    hash: Hash
  }
  data: {
    token?: string | null
    password: string
  }
}

export async function updatePasswordUseCase({ data, context }: Params) {
  if (!data.token) {
    return { error: AUTH_STATUS_MESSAGE.MISSING_TOKEN }
  }

  const existingToken = await context.getPasswordResetTokenByToken(data.token)

  if (!existingToken) {
    return { error: AUTH_STATUS_MESSAGE.INVALID_TOKEN }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) {
    return { error: AUTH_STATUS_MESSAGE.TOKEN_EXPIRED }
  }

  const existingUser = await context.getUserByEmail(existingToken.email)

  if (!existingUser) {
    return { error: AUTH_STATUS_MESSAGE.EMAIL_DOES_NOT_EXIST }
  }

  const hashedPassword = await context.hash(data.password, 10)

  await context.updateUser(existingUser.id, { password: hashedPassword })

  await context.deletePasswordResetToken(existingToken.id)

  return { success: AUTH_STATUS_MESSAGE.PASSWORD_UPDATED }
}
