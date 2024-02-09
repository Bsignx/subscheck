'use server'

import bcrypt from 'bcryptjs'

import { ActionReturn } from '@/app/_actions/types'
import {
  deletePasswordResetToken,
  getPasswordResetTokenByToken
} from '@/data-access/auth/password-reset-token'
import { getUserByEmail, updateUser } from '@/data-access/auth/user'
import { updatePasswordUseCase } from '@/use-cases/auth/update-password'

import { NewPasswordSchema, NewPasswordValues } from '../schemas'

type Return = ActionReturn

export const newPassword = async (
  values: NewPasswordValues,
  token?: string | null
): Promise<Return> => {
  const validatedFields = NewPasswordSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { password } = validatedFields.data

  return await updatePasswordUseCase({
    context: {
      getUserByEmail,
      updateUser,
      deletePasswordResetToken,
      getPasswordResetTokenByToken,
      hash: bcrypt.hash
    },
    data: {
      token,
      password
    }
  })
}
