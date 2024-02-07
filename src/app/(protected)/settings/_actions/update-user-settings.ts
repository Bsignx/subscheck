'use server'

import bcrypt from 'bcryptjs'

import {
  getUserByEmail,
  getUserById,
  updateUser
} from '@/data-access/auth/user'
import { currentUser, unstable_update } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/mail'
import { generateVerificationToken } from '@/lib/token'
import { updateUserSettingsUseCase } from '@/use-cases/auth/update-user-settings'

import { SettingsValues } from '../schemas'

export const settings = async (values: SettingsValues) => {
  const user = await currentUser()

  const { updatedUser, ...status } = await updateUserSettingsUseCase({
    context: {
      getUserByEmail,
      getUserById,
      updateUser,
      hash: bcrypt.hash,
      hashCompare: bcrypt.compare,
      generateVerificationToken,
      sendVerificationEmail
    },
    data: {
      ...values,
      isOAuth: user?.isOAuth,
      userId: user?.id,
      userEmail: user?.email
    }
  })

  status.success &&
    updatedUser &&
    unstable_update({
      user: {
        name: updatedUser?.name,
        email: updatedUser?.email,
        isTwoFactorEnabled: updatedUser?.isTwoFactorEnabled,
        role: updatedUser?.role
      }
    })

  return status
}
