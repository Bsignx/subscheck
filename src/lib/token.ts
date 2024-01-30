import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

import { getPasswordResetTokenByEmail } from '@/data-access/auth/password-reset-token'
import { getTwoFactorTokenByEmail } from '@/data-access/auth/two-factor-token'
import { getVerificationTokenByEmail } from '@/data-access/auth/verification-token'
import { db } from '@/db'

const oneHour = 3600 * 1000
const fiveMinutes = 5 * 60 * 1000

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString()
  const currentTime = new Date().getTime()
  const expires = new Date(currentTime + fiveMinutes)

  const existingToken = await getTwoFactorTokenByEmail(email)

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id
      }
    })
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires
    }
  })

  return twoFactorToken
}

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4()
  const currentTime = new Date().getTime()
  const expires = new Date(currentTime + oneHour)

  const existingToken = await getPasswordResetTokenByEmail(email)

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id }
    })
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires
    }
  })

  return passwordResetToken
}

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()
  const currentTime = new Date().getTime()
  const expires = new Date(currentTime + oneHour)

  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id
      }
    })
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires
    }
  })

  return verificationToken
}
