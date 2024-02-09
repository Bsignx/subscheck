import { AUTH_STATUS_MESSAGE } from '@/entities/auth'

import {
  CreateTwoFactorConfirmation,
  DeleteTwoFactorConfirmation,
  DeleteTwoFactorToken,
  GenerateTwoFactorToken,
  GenerateVerificationToken,
  GetTwoFactorConfirmationByUserId,
  GetTwoFactorTokenByEmail,
  GetUserByEmail,
  SendTwoFactorTokenEmail,
  SendVerificationEmail,
  SignIn
} from './types'
import { AuthError } from './utils'

type Params = {
  context: {
    getUserByEmail: GetUserByEmail
    createTwoFactorConfirmation: CreateTwoFactorConfirmation
    deleteTwoFactorConfirmation: DeleteTwoFactorConfirmation
    getTwoFactorConfirmationByUserId: GetTwoFactorConfirmationByUserId
    deleteTwoFactorToken: DeleteTwoFactorToken
    getTwoFactorTokenByEmail: GetTwoFactorTokenByEmail
    generateVerificationToken: GenerateVerificationToken
    sendVerificationEmail: SendVerificationEmail
    signIn: SignIn
    generateTwoFactorToken: GenerateTwoFactorToken
    sendTwoFactorTokenEmail: SendTwoFactorTokenEmail
  }
  data: {
    email: string
    password: string
    code?: string | undefined
    callbackUrl: string
  }
}

export async function loginUseCase({ context, data }: Params) {
  const existingUser = await context.getUserByEmail(data.email)

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: AUTH_STATUS_MESSAGE.EMAIL_DOES_NOT_EXIST }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await context.generateVerificationToken(
      existingUser.email
    )

    await context.sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    )

    return { success: AUTH_STATUS_MESSAGE.CONFIRMATION_EMAIL_SENT }
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (data.code) {
      const twoFactorToken = await context.getTwoFactorTokenByEmail(
        existingUser.email
      )

      if (!twoFactorToken) {
        return { error: AUTH_STATUS_MESSAGE.INVALID_CODE }
      }

      if (twoFactorToken.token !== data.code) {
        return { error: AUTH_STATUS_MESSAGE.INVALID_CODE }
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date()

      if (hasExpired) {
        return { error: AUTH_STATUS_MESSAGE.CODE_EXPIRED }
      }

      await context.deleteTwoFactorToken(twoFactorToken.id)

      const existingConfirmation =
        await context.getTwoFactorConfirmationByUserId(existingUser.id)

      if (existingConfirmation) {
        await context.deleteTwoFactorConfirmation(existingConfirmation.id)
      }

      await context.createTwoFactorConfirmation(existingUser.id)
    } else {
      const twoFactorToken = await context.generateTwoFactorToken(
        existingUser.email
      )
      await context.sendTwoFactorTokenEmail(
        twoFactorToken.email,
        twoFactorToken.token
      )

      return { twoFactor: true }
    }
  }

  try {
    await context.signIn('credentials', {
      email: data.email,
      password: data.password,
      redirectTo: data.callbackUrl
    })
  } catch (error) {
    console.error(error)
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: AUTH_STATUS_MESSAGE.INVALID_CREDENTIALS }
        default:
          return { error: AUTH_STATUS_MESSAGE.SOMETHING_WENT_WRONG }
      }
    }

    throw error
  }

  return { error: AUTH_STATUS_MESSAGE.SOMETHING_WENT_WRONG }
}
