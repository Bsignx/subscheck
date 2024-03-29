import { db } from '@/db'
import { VerificationToken } from '@/db/types'
import { VerificationTokenDto } from '@/use-cases/auth/types'

export function toDtoMapper(verificationToken: VerificationToken) {
  return {
    id: verificationToken.id,
    email: verificationToken.email,
    token: verificationToken.token,
    expires: verificationToken.expires
  }
}

export const getVerificationTokenByToken = async (
  token: string
): Promise<VerificationTokenDto | null> => {
  const verificationToken = await db.verificationToken.findUnique({
    where: { token }
  })

  if (!verificationToken) {
    return null
  }

  return toDtoMapper(verificationToken)
}

export const getVerificationTokenByEmail = async (
  email: string
): Promise<VerificationTokenDto | null> => {
  const verificationToken = await db.verificationToken.findFirst({
    where: { email }
  })

  if (!verificationToken) {
    return null
  }

  return toDtoMapper(verificationToken)
}

export const deleteVerificationToken = async (id: string): Promise<void> => {
  await db.verificationToken.delete({ where: { id } })
}

export const createVerificationToken = async (
  values: Omit<VerificationTokenDto, 'id'>
): Promise<VerificationTokenDto> => {
  const verificationToken = await db.verificationToken.create({
    data: values
  })

  return toDtoMapper(verificationToken)
}
