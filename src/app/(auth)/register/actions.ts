'use server'

import bcrypt from 'bcrypt'
import * as Z from 'zod'

import { getUserByEmail } from '@/data-access/user'
import { db } from '@/server/db'

import { RegisterSchema } from './schemas'

type RegisterValues = Z.infer<typeof RegisterSchema>

export const register = async (values: RegisterValues) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { email, password, name } = validatedFields.data

  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: 'User already exists' }
  }

  await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name
    }
  })

  // TODO: Send email confirmation

  return { success: 'User created' }
}
