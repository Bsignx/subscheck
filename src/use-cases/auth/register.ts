import { AUTH_STATUS_MESSAGE } from '@/entities/auth'

import {
  CreateUser,
  GenerateVerificationToken,
  GetUserByEmail,
  Hash,
  SendVerificationEmail
} from './types'

type Params = {
  context: {
    getUserByEmail: GetUserByEmail
    generateVerificationToken: GenerateVerificationToken
    sendVerificationEmail: SendVerificationEmail
    createUser: CreateUser
    hash: Hash
  }
  data: {
    email: string
    password: string
    name: string
  }
}

export async function registerUseCase({ context, data }: Params) {
  const hashedPassword = await context.hash(data.password, 10)

  const existingUser = await context.getUserByEmail(data.email)

  if (existingUser) {
    return { error: AUTH_STATUS_MESSAGE.EMAIL_ALREADY_IN_USE }
  }

  await context.createUser({
    email: data.email,
    password: hashedPassword,
    name: data.name
  })

  const verificationToken = await context.generateVerificationToken(data.email)

  await context.sendVerificationEmail(
    verificationToken.email,
    verificationToken.token
  )

  return { success: AUTH_STATUS_MESSAGE.CONFIRMATION_EMAIL_SENT }
}
