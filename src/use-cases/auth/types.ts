export type AccountDto = {
  id: string
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token: string | null
  access_token: string | null
  expires_at: number | null
  token_type: string | null
  scope: string | null
  id_token: string | null
  session_state: string | null
}

export type PasswordResetTokenDto = {
  id: string
  email: string
  token: string
  expires: Date
}

export type VerificationTokenDto = {
  id: string
  email: string
  token: string
  expires: Date
}

export type TwoFactorTokenDto = {
  id: string
  email: string
  token: string
  expires: Date
}

export type TwoFactorConfirmationDto = {
  id: string
  userId: string
}

export type UserDto = {
  id: string
  name: string | null
  email: string | null
  emailVerified: Date | null
  password: string | null
  role: 'USER' | 'ADMIN'
  image: string | null
  isTwoFactorEnabled: boolean
}
