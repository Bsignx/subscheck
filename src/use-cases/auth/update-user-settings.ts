import { AUTH_STATUS_MESSAGE } from '@/entities/auth'

import {
  GenerateVerificationToken,
  GetUserByEmail,
  GetUserById,
  Hash,
  HashCompare,
  SendVerificationEmail,
  UpdateUser,
  UserDto
} from './types'

type Params = {
  context: {
    sendVerificationEmail: SendVerificationEmail
    getUserByEmail: GetUserByEmail
    getUserById: GetUserById
    updateUser: UpdateUser
    generateVerificationToken: GenerateVerificationToken
    hash: Hash
    hashCompare: HashCompare
  }
  data: {
    userId?: string
    userEmail?: string | null
    isOAuth?: boolean
    role: 'ADMIN' | 'USER'
    name?: string
    isTwoFactorEnabled?: boolean
    email?: string
    password?: string
    newPassword?: string
  }
}

export async function updateUserSettingsUseCase({ context, data }: Params) {
  if (!data.userId) {
    return { error: AUTH_STATUS_MESSAGE.UNAUTHORIZED }
  }

  const dbUser = await context.getUserById(data.userId)

  if (!dbUser) {
    return { error: AUTH_STATUS_MESSAGE.UNAUTHORIZED }
  }

  if (data.isOAuth) {
    data.email = undefined
    data.password = undefined
    data.newPassword = undefined
    data.isTwoFactorEnabled = undefined
  }

  if (data.email && data.email !== data.userEmail) {
    const existingUser = await context.getUserByEmail(data.email)

    if (existingUser && existingUser.id !== data.userId) {
      return { error: AUTH_STATUS_MESSAGE.EMAIL_ALREADY_IN_USE }
    }

    const verificationToken = await context.generateVerificationToken(
      data.email
    )
    await context.sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    )

    return { success: AUTH_STATUS_MESSAGE.VERIFICATION_EMAIL_SENT }
  }

  if (data.password && data.newPassword && dbUser.password) {
    const passwordsMatch = await context.hashCompare(
      data.password,
      dbUser.password
    )

    if (!passwordsMatch) {
      return { error: AUTH_STATUS_MESSAGE.INCORRECT_PASSWORD }
    }

    const hashedPassword = await context.hash(data.newPassword, 10)
    data.password = hashedPassword
    data.newPassword = undefined
  }

  const updatedUser = await context.updateUser(dbUser.id, {
    role: data.role,
    name: data.name,
    isTwoFactorEnabled: data.isTwoFactorEnabled,
    email: data.email,
    password: data.password,
    newPassword: data.newPassword
  })

  return { success: AUTH_STATUS_MESSAGE.SETTINGS_UPDATED, updatedUser }
}
