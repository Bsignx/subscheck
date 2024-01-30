import { db } from '@/db'
import { TwoFactorConfirmation } from '@/db/types'
import { TwoFactorConfirmationDto } from '@/use-cases/auth/types'

export function toDtoMapper(twoFactorConfirmation: TwoFactorConfirmation) {
  return {
    id: twoFactorConfirmation.id,
    userId: twoFactorConfirmation.userId
  }
}

export const getTwoFactorConfirmationByUserId = async (
  userId: string
): Promise<TwoFactorConfirmationDto | null> => {
  const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
    where: { userId }
  })

  if (!twoFactorConfirmation) {
    return null
  }

  return toDtoMapper(twoFactorConfirmation)
}
