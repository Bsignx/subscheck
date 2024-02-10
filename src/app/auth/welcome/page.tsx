import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { Typography } from '@/components/ui/typography'

export default function Welcome() {
  return (
    <main className="relative flex flex-col items-center justify-between min-h-screen pt-16 pb-6 px-6 bg-[url(/images/welcome-bg.png)] bg-contain bg-no-repeat bg-[center_top_7rem] overflow-hidden">
      <div
        // blur circle bg effect
        aria-hidden
        className="opacity-25 filter blur-[8rem] absolute top-52 left-64 bg-[hsl(var(--primary))] w-96 h-96"
      ></div>

      <Logo />

      <div>
        <Typography variant="bodyMedium" className="text-center mx-4">
          Track your subscriptions and get control over your finances.
        </Typography>
        <Button className="w-full mt-10" asChild>
          <Link href="/auth/pre-register">Get started</Link>
        </Button>
        <Button variant="chameleon" className="w-full mt-4" asChild>
          <Link href="/auth/login">I have an account</Link>
        </Button>
      </div>
    </main>
  )
}
