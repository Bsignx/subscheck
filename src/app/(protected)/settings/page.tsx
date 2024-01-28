'use client'

import { signOut } from 'next-auth/react'

import { useCurrentUser } from '@/hooks/use-current-user'

export default function Settings() {
  const user = useCurrentUser()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {JSON.stringify(user)}

      <button onClick={() => signOut()}>Sign out</button>
    </main>
  )
}
