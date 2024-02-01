import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

import {
  createPasswordResetToken,
  deletePasswordResetToken,
  getPasswordResetTokenByEmail
} from '@/data-access/auth/password-reset-token'
import {
  deleteTwoFactorToken,
  getTwoFactorTokenByEmail
} from '@/data-access/auth/two-factor-token'
import {
  createVerificationToken,
  deleteVerificationToken,
  getVerificationTokenByEmail
} from '@/data-access/auth/verification-token'
import { db } from '@/db'

const oneHour = 3600 * 1000
const fiveMinutes = 5 * 60 * 1000

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString()
  const currentTime = new Date().getTime()
  const expires = new Date(currentTime + fiveMinutes)

  const existingToken = await getTwoFactorTokenByEmail(email)

  if (existingToken) {
    deleteTwoFactorToken(existingToken.id)
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
    deletePasswordResetToken(existingToken.id)
  }

  const passwordResetToken = await createPasswordResetToken({
    email,
    token,
    expires
  })

  return passwordResetToken
}

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()
  const currentTime = new Date().getTime()
  const expires = new Date(currentTime + oneHour)

  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    await deleteVerificationToken(existingToken.id)
  }

  const verificationToken = await createVerificationToken({
    email,
    token,
    expires
  })

  return verificationToken
}
