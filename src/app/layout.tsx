import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'

import { cn } from '@/lib/utils'

import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700']
})

export const metadata: Metadata = {
  title: 'Subscheck',
  description: 'Track your subscriptions and get control over your finances.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(`${roboto.className} bg-background`)}>
        {children}
      </body>
    </html>
  )
}
