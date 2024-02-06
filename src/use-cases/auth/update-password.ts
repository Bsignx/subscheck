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
    return { error: 'Missing token!' }
  }

  const existingToken = await context.getPasswordResetTokenByToken(data.token)

  if (!existingToken) {
    return { error: 'Invalid token!' }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) {
    return { error: 'Token has expired!' }
  }

  const existingUser = await context.getUserByEmail(existingToken.email)

  if (!existingUser) {
    return { error: 'Email does not exist!' }
  }

  const hashedPassword = await context.hash(data.password, 10)

  await context.updateUser(existingUser.id, { password: hashedPassword })

  await context.deletePasswordResetToken(existingToken.id)

  return { success: 'Password updated!' }
}
