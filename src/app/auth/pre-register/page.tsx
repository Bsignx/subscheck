'use client'

import { signIn } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/auth/auth-routes'

import { GoogleIcon } from './_components/google-icon'

export default function PreRegister() {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: DEFAULT_LOGIN_REDIRECT })
  }

  return (
    <main className="flex flex-col items-center justify-between min-h-screen pt-16 pb-6 px-6">
      <Logo />

      <div className="w-full">
        <Button
          variant="secondary"
          className="w-full font-semibold"
          onClick={handleGoogleSignIn}
        >
          <GoogleIcon className="mr-2 w-4 h-4" />
          Sign up with Google
        </Button>
      </div>
    </main>
  )
}
