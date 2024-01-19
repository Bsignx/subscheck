'use server'

import * as Z from 'zod'

import { RegisterSchema } from './schemas'

type RegisterValues = Z.infer<typeof RegisterSchema>

export const register = async (values: RegisterValues) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { ok: false }
  }

  return { ok: true }
}
