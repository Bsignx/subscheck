'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/icons/logo'
import { Typography } from '@/components/ui/typography'

import { verifyEmail } from './_actions/verify-email'

export default function NewVerification() {
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const onSubmit = useCallback(() => {
    if (success || error) return

    if (!token) {
      setError('Missing token!')
      return
    }

    verifyEmail(token)
      .then((data) => {
        setSuccess(data.success)
        setError(data.error)
      })
      .catch(() => {
        setError('Something went wrong!')
      })
  }, [token, success, error])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <main className="flex flex-col items-center justify-between min-h-screen pt-16 pb-10 px-6">
      <Logo />

      <div className="flex items-center w-full justify-center">
        {!success && !error && (
          <Typography as="h1" variant="h5">
            Loading...
          </Typography>
        )}

        {success && (
          <Typography as="h1" variant="h5">
            {success}
          </Typography>
        )}

        {!success && (
          <Typography as="h1" variant="h5">
            {error}
          </Typography>
        )}
      </div>

      <Button variant="chameleon" className="w-full mt-6" asChild>
        <Link href="/auth/login">Go back to login</Link>
      </Button>
    </main>
  )
}
