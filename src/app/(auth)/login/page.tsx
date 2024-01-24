'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'

import * as z from 'zod'

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

import { login } from './actions'
import { LoginSchema } from './schemas'

type LoginValues = z.infer<typeof LoginSchema>

export default function Login() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : ''

  const [isPending, startTransition] = useTransition()
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
      login(values, callbackUrl).then((response) =>
        setSubmissionStatus(
          response?.error
            ? {
                status: 'error',
                message: response?.error ?? 'Something went wrong'
              }
            : {
                status: 'success',
                message: response?.success ?? 'You have been logged in'
              }
        )
      )
    })
  }

  const onClick = () => {
    signIn('google', { callbackUrl: DEFAULT_LOGIN_REDIRECT })
  }

  return (
    <>
      <Button onClick={onClick}>Login with Google</Button>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
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
                <FormMessage />
              </FormItem>
            )}
          />

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
            Login
          </Button>
        </form>
      </Form>
    </>
  )
}
