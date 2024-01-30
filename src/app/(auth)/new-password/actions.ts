'use server'

import bcrypt from 'bcryptjs'

import { getPasswordResetTokenByToken } from '@/data-access/auth/password-reset-token'
import { getUserByEmail } from '@/data-access/auth/user'
import { db } from '@/db'

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

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword }
  })

  await db.passwordResetToken.delete({
    where: { id: existingToken.id }
  })

  return { success: 'Password updated!' }
}
