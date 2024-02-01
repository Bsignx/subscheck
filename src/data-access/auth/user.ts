import { db } from '@/db'
import { User } from '@/db/types'
import { UserDto } from '@/use-cases/auth/types'

export function toDtoMapper(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
    password: user.password,
    role: user.role,
    isTwoFactorEnabled: user.isTwoFactorEnabled
  }
}

export const getUserByEmail = async (
  email: string
): Promise<UserDto | null> => {
  const user = await db.user.findUnique({ where: { email } })

  if (!user) {
    return null
  }

  return toDtoMapper(user)
}

export const getUserById = async (id?: string): Promise<UserDto | null> => {
  if (!id) return null

  const user = await db.user.findUnique({ where: { id } })

  if (!user) {
    return null
  }

  return toDtoMapper(user)
}

export const updateUser = async (
  id: string | undefined,
  data: Partial<UserDto>
): Promise<UserDto> => {
  const user = await db.user.update({
    where: { id },
    data
  })

  return toDtoMapper(user)
}

export const createUser = async (data: Partial<UserDto>): Promise<void> => {
  await db.user.create({
    data
  })
}
