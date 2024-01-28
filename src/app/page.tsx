import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { currentUser, signOut } from '@/lib/auth'

export default async function Home() {
  const user = await currentUser()
  console.log(user)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Hi there
      <Button>Click me</Button>
      <form
        action={async () => {
          'use server'

          await signOut()
        }}
      >
        <button>Sign out</button>
      </form>
    </main>
  )
}
