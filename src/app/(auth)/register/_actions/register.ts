'use server'

import bcrypt from 'bcryptjs'

import { ActionReturn } from '@/app/_actions/types'
import { createUser, getUserByEmail } from '@/data-access/auth/user'
import { sendVerificationEmail } from '@/lib/mail'
import { generateVerificationToken } from '@/lib/token'
import { registerUseCase } from '@/use-cases/auth/register'

import { RegisterSchema, RegisterValues } from '../schemas'

type Return = ActionReturn

export const register = async (values: RegisterValues): Promise<Return> => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { email, password, name } = validatedFields.data

  return await registerUseCase({
    context: {
      createUser,
      getUserByEmail,
      sendVerificationEmail,
      generateVerificationToken,
      hash: bcrypt.hash
    },
    data: {
      email,
      password,
      name
    }
  })
}
