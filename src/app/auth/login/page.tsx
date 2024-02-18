'use client'

import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Logo } from '@/components/ui/icons/logo'
import { Input } from '@/components/ui/input'
import { Typography } from '@/components/ui/typography'
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/auth/auth-routes'
import { zodResolver } from '@hookform/resolvers/zod'

import { GoogleIcon } from '../../../components/ui/icons/google-icon'
import { login } from './_actions/login'
import { LoginSchema, LoginValues } from './schemas'

export default function Login() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')

  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : ''

  const [isPending, startTransition] = useTransition()
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<{
    status: 'success' | 'error'
    message: string
  } | null>(null)

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (values: LoginValues) => {
    setSubmissionStatus(null)

    startTransition(() => {
      login(values, callbackUrl)
        .then((response) => {
          if (response?.error) {
            form.reset()
            setSubmissionStatus({
              status: 'error',
              message: response?.error ?? 'Something went wrong'
            })
          }

          if (response?.success) {
            form.reset()
            setSubmissionStatus({
              status: 'success',
              message: response?.success ?? 'You have been logged in'
            })
          }

          if (response?.twoFactor) {
            setShowTwoFactor(true)
          }
        })
        .catch(() => {
          setSubmissionStatus({
            status: 'error',
            message: 'Something went wrong'
          })
        })
    })
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT })
  }

  return (
    <main className="flex flex-col items-center justify-between min-h-screen pt-16 pb-6 px-6">
      <Logo />
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Two Factor Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="123456"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          type="email"
                          placeholder="john.doe@example.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          type="password"
                          placeholder="********"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  size="sm"
                  variant="link"
                  asChild
                  className="mt-2 px-0 underline underline-offset-1 font-normal text-tertiary-foreground"
                >
                  <Link href="/auth/reset">Forgot password</Link>
                </Button>
              </>
            )}

            {urlError && (
              <p className="text-sm font-medium text-destructive">{urlError}</p>
            )}

            {submissionStatus &&
              {
                success: (
                  <p className="text-sm font-medium text-success">
                    {submissionStatus.message}
                  </p>
                ),
                error: (
                  <p className="text-sm font-medium text-destructive">
                    {submissionStatus.message}
                  </p>
                )
              }[submissionStatus.status]}

            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              {showTwoFactor ? 'Verify' : 'Sign In'}
            </Button>
          </form>
        </Form>

        {!showTwoFactor && (
          <>
            <Typography variant="bodyMedium" className="my-6  text-center">
              or
            </Typography>
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleGoogleSignIn}
            >
              <GoogleIcon className="mr-2 w-4 h-4" />
              Sign in with Google
            </Button>
          </>
        )}
      </div>

      <div className="w-full">
        <Typography className="text-center">
          If you don&apos;t have an account yet?
        </Typography>
        <Button variant="chameleon" className="w-full mt-5" asChild>
          <Link href="/auth/register">Sign up</Link>
        </Button>
      </div>
    </main>
  )
}
