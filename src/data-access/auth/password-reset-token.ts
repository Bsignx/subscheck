import { db } from '@/db'
import { PasswordResetToken } from '@/db/types'
import { PasswordResetTokenDto } from '@/use-cases/auth/types'

export function toDtoMapper(passwordResetToken: PasswordResetToken) {
  return {
    id: passwordResetToken.id,
    email: passwordResetToken.email,
    token: passwordResetToken.token,
    expires: passwordResetToken.expires
  }
}

export const getPasswordResetTokenByToken = async (
  token: string
): Promise<PasswordResetTokenDto | null> => {
  const passwordResetToken = await db.passwordResetToken.findUnique({
    where: { token }
  })

  if (!passwordResetToken) {
    return null
  }

  return toDtoMapper(passwordResetToken)
}

export const getPasswordResetTokenByEmail = async (
  email: string
): Promise<PasswordResetTokenDto | null> => {
  const passwordResetToken = await db.passwordResetToken.findFirst({
    where: { email }
  })

  if (!passwordResetToken) {
    return null
  }

  return toDtoMapper(passwordResetToken)
}
