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
import { Input } from '@/components/ui/input'
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/auth/auth-routes'
import { zodResolver } from '@hookform/resolvers/zod'

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

  const onClick = () => {
    signIn('google', { callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT })
  }

  return (
    <>
      <Button onClick={onClick}>Login with Google</Button>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
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
                  <FormItem>
                    <FormLabel>Email</FormLabel>
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
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="password"
                        placeholder="********"
                      />
                    </FormControl>
                    <Button
                      size="sm"
                      variant="link"
                      asChild
                      className="px-0 font-normal"
                    >
                      <Link href="/reset">Forgot password?</Link>
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

          <Button type="submit" className="w-full" disabled={isPending}>
            {showTwoFactor ? 'Verify' : 'Login'}
          </Button>
        </form>
      </Form>
    </>
  )
}
