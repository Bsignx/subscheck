import { db } from '@/db'
import { Account } from '@/db/types'
import { AccountDto } from '@/use-cases/auth/types'

export function toDtoMapper(account: Account) {
  return {
    id: account.id,
    userId: account.userId,
    type: account.type,
    provider: account.provider,
    providerAccountId: account.providerAccountId,
    refresh_token: account.refresh_token,
    access_token: account.access_token,
    expires_at: account.expires_at,
    token_type: account.token_type,
    scope: account.scope,
    id_token: account.id_token,
    session_state: account.session_state
  }
}

export const getAccountByUserId = async (
  userId: string
): Promise<AccountDto | null> => {
  const account = await db.account.findFirst({
    where: { userId }
  })

  if (!account) {
    return null
  }

  return toDtoMapper(account)
}
