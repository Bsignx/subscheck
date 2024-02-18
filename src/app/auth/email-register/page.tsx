'use client'

import Link from 'next/link'
import { useEffect, useState, useTransition } from 'react'
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
import { Progress } from '@/components/ui/progress'
import { Typography } from '@/components/ui/typography'
import { zodResolver } from '@hookform/resolvers/zod'

import { register } from './_actions/register'
import { calculatePasswordStrength } from './_utils/calculate-password-strength'
import { RegisterSchema, RegisterValues } from './schemas'

const passwordStrengthToColor: Record<string, string> = {
  0: 'bg-red-800',
  20: 'bg-red-800',
  40: 'bg-yellow-500',
  60: 'bg-yellow-500',
  80: 'bg-green-500',
  100: 'bg-green-500'
}

export default function Register() {
  const [isPending, startTransition] = useTransition()
  const [submissionStatus, setSubmissionStatus] = useState<{
    status: 'success' | 'error'
    message: string
  } | null>(null)
  const [passwordStrength, setPasswordStrength] = useState<number>(0)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const password = form.watch('password')

  const handlePasswordStrength = (password: string) => {
    const passwordStrength = calculatePasswordStrength(password)

    setPasswordStrength(passwordStrength)
  }

  useEffect(() => {
    handlePasswordStrength(password)
  }, [password])

  const onSubmit = (values: RegisterValues) => {
    setSubmissionStatus(null)

    startTransition(() => {
      register(values).then((response) =>
        setSubmissionStatus(
          response?.success
            ? {
                status: 'success',
                message: response.success
              }
            : {
                status: 'error',
                message: response.error ?? 'Something went wrong'
              }
        )
      )
    })
  }

  return (
    <main className="flex flex-col items-center justify-between min-h-screen pt-16 pb-6 px-6">
      <Logo />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail address</FormLabel>
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
            name="name"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="John Doe"
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

          <Progress
            value={passwordStrength}
            className="w-full mt-6"
            indicatorClassName={`${passwordStrengthToColor[passwordStrength.toString()]}`}
          />
          <Typography
            variant="bodySmall"
            className="mt-3 text-tertiary-foreground"
          >
            Use 8 or more characters with a mix of letters, numbers & symbols.
          </Typography>

          {submissionStatus &&
            {
              success: (
                <p className="text-sm font-medium text-success mt-4">
                  {submissionStatus.message}
                </p>
              ),
              error: (
                <p className="text-sm font-medium text-destructive mt-4">
                  {submissionStatus.message}
                </p>
              )
            }[submissionStatus.status]}

          <Button type="submit" className="w-full mt-10" disabled={isPending}>
            Get started, it’s free!
          </Button>
        </form>
      </Form>

      <div className="w-full">
        <Typography className="text-center">
          Do you have already an account?
        </Typography>
        <Button variant="chameleon" className="w-full mt-5" asChild>
          <Link href="/auth/login">Sign In</Link>
        </Button>
      </div>
    </main>
  )
}
