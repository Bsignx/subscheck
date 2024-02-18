import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/icons/logo'
import { Typography } from '@/components/ui/typography'

export default function AuthError() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen pt-16 pb-16 px-6">
      <Logo />
      <div className="w-full">
        <Typography variant="h2" as="h1" className="text-center">
          Something went wrong
        </Typography>
        <Typography
          variant="bodyMedium"
          className="mt-4 text-center text-tertiary-foreground"
        >
          We couldn&apos;t log you in. Please try again.
        </Typography>
      </div>
      <Button className="w-full mt-6" asChild>
        <Link href="/auth/login">Go back to login</Link>
      </Button>
    </main>
  )
}
