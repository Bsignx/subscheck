import { AUTH_STATUS_MESSAGE } from '@/entities/auth'

import {
  GeneratePasswordResetToken,
  GetUserByEmail,
  SendPasswordResetEmail
} from './types'

type Params = {
  context: {
    getUserByEmail: GetUserByEmail
    generatePasswordResetToken: GeneratePasswordResetToken
    sendPasswordResetEmail: SendPasswordResetEmail
  }
  data: {
    email: string
  }
}

export async function resetUseCase({ context, data }: Params) {
  const existingUser = await context.getUserByEmail(data.email)

  if (!existingUser) {
    return { error: AUTH_STATUS_MESSAGE.EMAIL_NOT_FOUND }
  }

  const passwordResetToken = await context.generatePasswordResetToken(
    data.email
  )

  await context.sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  )

  return { success: AUTH_STATUS_MESSAGE.RESET_EMAIL_SENT }
}
