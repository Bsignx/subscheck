'use client'

import { signIn } from 'next-auth/react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { GoogleIcon } from '@/components/ui/icons/google-icon'
import { Logo } from '@/components/ui/icons/logo'
import { Typography } from '@/components/ui/typography'
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/auth/auth-routes'

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
          className="w-full"
          onClick={handleGoogleSignIn}
        >
          <GoogleIcon className="mr-2 w-4 h-4" />
          Sign up with Google
        </Button>
        <Typography variant="bodyMedium" className="mt-6 text-center">
          or
        </Typography>
        <Button variant="chameleon" className="w-full mt-6" asChild>
          <Link href="/auth/email-register"> Sign up with email</Link>
        </Button>
        <Typography
          variant="bodySmall"
          className="mt-4 mb-16 text-tertiary-foreground text-center"
        >
          By registering, you agree to our Terms of Use. Learn how we collect,
          use and share your data.
        </Typography>
      </div>
    </main>
  )
}
