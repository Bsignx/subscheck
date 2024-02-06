'use server'

import { ActionReturn } from '@/app/_actions/types'
import { getUserByEmail } from '@/data-access/auth/user'
import { sendPasswordResetEmail } from '@/lib/mail'
import { generatePasswordResetToken } from '@/lib/token'
import { resetUseCase } from '@/use-cases/auth/reset'

import { ResetSchema, ResetValues } from '../schemas'

type Return = ActionReturn

export const reset = async (values: ResetValues): Promise<Return> => {
  const validatedFields = ResetSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid emaiL!' }
  }

  const { email } = validatedFields.data

  return await resetUseCase({
    context: {
      getUserByEmail,
      sendPasswordResetEmail,
      generatePasswordResetToken
    },
    data: {
      email
    }
  })
}
