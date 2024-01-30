import { UserRole as UserRoleRoot } from '@prisma/client'

export const UserRole: {
  USER: 'USER'
  ADMIN: 'ADMIN'
} = UserRoleRoot
