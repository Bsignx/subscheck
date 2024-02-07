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
    return { error: 'Unauthorized' }
  }

  const dbUser = await context.getUserById(data.userId)

  if (!dbUser) {
    return { error: 'Unauthorized' }
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
      return { error: 'Email already in use!' }
    }

    const verificationToken = await context.generateVerificationToken(
      data.email
    )
    await context.sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    )

    return { success: 'Verification email sent!' }
  }

  if (data.password && data.newPassword && dbUser.password) {
    const passwordsMatch = await context.hashCompare(
      data.password,
      dbUser.password
    )

    if (!passwordsMatch) {
      return { error: 'Incorrect password!' }
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

  return { success: 'Settings Updated!', updatedUser }
}
