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

import { register } from './_actions/register'
import { RegisterSchema, RegisterValues } from './schemas'

export default function Register() {
  const [isPending, startTransition] = useTransition()
  const [submissionStatus, setSubmissionStatus] = useState<{
    status: 'success' | 'error'
    message: string
  } | null>(null)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

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

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
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
            Register
          </Button>
        </form>
      </Form>
    </>
  )
}
