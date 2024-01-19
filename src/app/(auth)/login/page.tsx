'use client'

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
import { zodResolver } from '@hookform/resolvers/zod'

import { login } from './actions'
import { LoginSchema } from './schemas'

type LoginValues = z.infer<typeof LoginSchema>

export default function Login() {
  const [isPending, startTransition] = useTransition()
  const [submissionStatus, setSubmissionStatus] = useState<
    'success' | 'error' | null
  >(null)

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
      login(values).then((response) =>
        setSubmissionStatus(response.ok ? 'success' : 'error')
      )
    })
  }

  return (
    <>
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

          {submissionStatus &&
            {
              success: (
                <p className="text-sm font-medium text-success">
                  You have been logged in!
                </p>
              ),
              error: (
                <p className="text-sm font-medium text-destructive">
                  Invalid credentials.
                </p>
              )
            }[submissionStatus]}

          <Button type="submit" className="w-full" disabled={isPending}>
            Login
          </Button>
        </form>
      </Form>
    </>
  )
}
