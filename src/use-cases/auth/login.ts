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
    return { error: 'Email does not exist!' }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await context.generateVerificationToken(
      existingUser.email
    )

    await context.sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    )

    return { success: 'Confirmation email sent!' }
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (data.code) {
      const twoFactorToken = await context.getTwoFactorTokenByEmail(
        existingUser.email
      )

      if (!twoFactorToken) {
        return { error: 'Invalid code!' }
      }

      if (twoFactorToken.token !== data.code) {
        return { error: 'Invalid code!' }
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date()

      if (hasExpired) {
        return { error: 'Code expired!' }
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
          return { error: 'Invalid credentials!' }
        default:
          return { error: 'Something went wrong!' }
      }
    }

    throw error
  }

  return { error: 'Something went wrong!' }
}
