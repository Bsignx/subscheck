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
    return { error: 'Token does not exist!' }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) {
    return { error: 'Token has expired!' }
  }

  const existingUser = await context.getUserByEmail(existingToken.email)

  if (!existingUser) {
    return { error: 'Email does not exist!' }
  }

  await context.updateUser(existingUser.id, {
    emailVerified: new Date(),
    email: existingToken.email
  })

  await context.deleteVerificationToken(existingToken.id)

  return { success: 'Email verified!' }
}
