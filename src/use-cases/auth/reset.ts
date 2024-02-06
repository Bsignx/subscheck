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
    return { error: 'Email not found!' }
  }

  const passwordResetToken = await context.generatePasswordResetToken(
    data.email
  )

  await context.sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  )

  return { success: 'Reset email sent!' }
}
