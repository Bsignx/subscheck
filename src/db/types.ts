import {
  UserRole as UserRoleRoot,
  Account as AccountRoot,
  PasswordResetToken as PasswordResetTokenRoot,
  Session as SessionRoot,
  VerificationToken as VerificationTokenRoot,
  User as UserRoot,
  TwoFactorToken as TwoFactorTokenRoot,
  TwoFactorConfirmation as TwoFactorConfirmationRoot
} from '@prisma/client'

export type UserRole = UserRoleRoot
export type Account = AccountRoot
export type PasswordResetToken = PasswordResetTokenRoot
export type Session = SessionRoot
export type VerificationToken = VerificationTokenRoot
export type User = UserRoot
export type TwoFactorToken = TwoFactorTokenRoot
export type TwoFactorConfirmation = TwoFactorConfirmationRoot
