import { db } from '@/db'
import { TwoFactorToken } from '@/db/types'
import { TwoFactorTokenDto } from '@/use-cases/auth/types'

export function toDtoMapper(twoFactorToken: TwoFactorToken) {
  return {
    id: twoFactorToken.id,
    email: twoFactorToken.email,
    token: twoFactorToken.token,
    expires: twoFactorToken.expires
  }
}

export const getTwoFactorTokenByToken = async (
  token: string
): Promise<TwoFactorTokenDto | null> => {
  const twoFactorToken = await db.twoFactorToken.findUnique({
    where: { token }
  })

  if (!twoFactorToken) {
    return null
  }

  return toDtoMapper(twoFactorToken)
}

export const getTwoFactorTokenByEmail = async (
  email: string
): Promise<TwoFactorTokenDto | null> => {
  const twoFactorToken = await db.twoFactorToken.findFirst({
    where: { email }
  })

  if (!twoFactorToken) {
    return null
  }

  return toDtoMapper(twoFactorToken)
}
