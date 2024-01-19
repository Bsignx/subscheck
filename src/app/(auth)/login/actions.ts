'use server'

import * as Z from 'zod'

import { LoginSchema } from './schemas'

type LoginValues = Z.infer<typeof LoginSchema>

export const login = async (values: LoginValues) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { ok: false }
  }

  return { ok: true }
}
