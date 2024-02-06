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

export type GetUserByEmail = (email: string) => Promise<UserDto | null>
export type CreateTwoFactorConfirmation = (userId: string) => Promise<void>
export type DeleteTwoFactorConfirmation = (id: string) => Promise<void>
export type GetTwoFactorConfirmationByUserId = (
  userId: string
) => Promise<TwoFactorConfirmationDto | null>
export type DeleteTwoFactorToken = (id: string) => Promise<void>
export type GetTwoFactorTokenByEmail = (
  email: string
) => Promise<TwoFactorTokenDto | null>
export type GenerateVerificationToken = (
  email: string
) => Promise<VerificationTokenDto>
export type SendVerificationEmail = (
  email: string,
  token: string
) => Promise<void>
export type SignIn = (
  provider: string,
  options: { email: string; password: string; redirectTo?: string }
) => Promise<void>
export type GenerateTwoFactorToken = (
  email: string
) => Promise<TwoFactorTokenDto>
export type SendTwoFactorTokenEmail = (
  email: string,
  token: string
) => Promise<void>
export type GetPasswordResetTokenByToken = (
  token: string
) => Promise<PasswordResetTokenDto | null>
export type DeletePasswordResetToken = (id: string) => Promise<void>
export type UpdateUser = (
  id: string | undefined,
  data: Partial<UserDto>
) => Promise<UserDto>
export type Hash = (password: string, salt: number) => Promise<string>
export type DeleteVerificationToken = (id: string) => Promise<void>
export type GetVerificationTokenByToken = (
  token: string
) => Promise<VerificationTokenDto | null>
export type CreateUser = (data: Partial<UserDto>) => Promise<void>
export type GeneratePasswordResetToken = (
  email: string
) => Promise<PasswordResetTokenDto>
export type SendPasswordResetEmail = (
  email: string,
  token: string
) => Promise<void>
