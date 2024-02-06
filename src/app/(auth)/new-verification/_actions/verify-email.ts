'use server'

import { ActionReturn } from '@/app/_actions/types'
import { getUserByEmail, updateUser } from '@/data-access/auth/user'
import {
  deleteVerificationToken,
  getVerificationTokenByToken
} from '@/data-access/auth/verification-token'
import { verifyEmailUseCase } from '@/use-cases/auth/verify-email'

type Return = ActionReturn

export const verifyEmail = async (token: string): Promise<Return> => {
  return await verifyEmailUseCase({
    context: {
      getUserByEmail,
      updateUser,
      deleteVerificationToken,
      getVerificationTokenByToken
    },
    data: {
      token
    }
  })
}
