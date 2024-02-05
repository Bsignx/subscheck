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

export async function loginUseCase({
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
  data: { email, password, code, callbackUrl }
}: Params) {
  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email does not exist!' }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    )

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    )

    return { success: 'Confirmation email sent!' }
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

      if (!twoFactorToken) {
        return { error: 'Invalid code!' }
      }

      if (twoFactorToken.token !== code) {
        return { error: 'Invalid code!' }
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date()

      if (hasExpired) {
        return { error: 'Code expired!' }
      }

      await deleteTwoFactorToken(twoFactorToken.id)

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      )

      if (existingConfirmation) {
        await deleteTwoFactorConfirmation(existingConfirmation.id)
      }

      await createTwoFactorConfirmation(existingUser.id)
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)

      return { twoFactor: true }
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl
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
