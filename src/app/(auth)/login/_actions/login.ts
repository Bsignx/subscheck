'use server'

import { AuthError } from 'next-auth'

import { ActionReturn } from '@/app/_actions/types'
import {
  createTwoFactorConfirmation,
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmationByUserId
} from '@/data-access/auth/two-factor-confirmation'
import {
  deleteTwoFactorToken,
  getTwoFactorTokenByEmail
} from '@/data-access/auth/two-factor-token'
import { getUserByEmail } from '@/data-access/auth/user'
import { signIn } from '@/lib/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/auth/auth-routes'
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/mail'
import { generateTwoFactorToken, generateVerificationToken } from '@/lib/token'
import { loginUseCase } from '@/use-cases/auth/login'

import { LoginSchema, LoginValues } from '../schemas'

type Return = {
  twoFactor?: boolean
} & ActionReturn

export const login = async (
  values: LoginValues,
  callbackUrl?: string | null
): Promise<Return> => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { email, password, code } = validatedFields.data

  return loginUseCase({
    context: {
      getUserByEmail,
      createTwoFactorConfirmation,
      deleteTwoFactorConfirmation,
      getTwoFactorConfirmationByUserId,
      deleteTwoFactorToken,
      getTwoFactorTokenByEmail,
      generateVerificationToken,
      sendVerificationEmail,
      generateTwoFactorToken,
      signIn,
      sendTwoFactorTokenEmail
    },
    data: {
      email,
      password,
      code,
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT
    }
  })
}
