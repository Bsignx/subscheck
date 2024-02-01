'use server'

import bcrypt from 'bcryptjs'

import {
  deletePasswordResetToken,
  getPasswordResetTokenByToken
} from '@/data-access/auth/password-reset-token'
import { getUserByEmail, updateUser } from '@/data-access/auth/user'

import { NewPasswordSchema, NewPasswordValues } from './schemas'

export const newPassword = async (
  values: NewPasswordValues,
  token?: string | null
) => {
  if (!token) {
    return { error: 'Missing token!' }
  }

  const validatedFields = NewPasswordSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { password } = validatedFields.data

  const existingToken = await getPasswordResetTokenByToken(token)

  if (!existingToken) {
    return { error: 'Invalid token!' }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) {
    return { error: 'Token has expired!' }
  }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser) {
    return { error: 'Email does not exist!' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await updateUser(existingUser.id, { password: hashedPassword })

  await deletePasswordResetToken(existingToken.id)

  return { success: 'Password updated!' }
}
