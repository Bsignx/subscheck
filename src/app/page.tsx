'use client'

import Link from 'next/link'
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles
} from 'react-circular-progressbar'

import { Settings } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/icons/logo'
import { Typography } from '@/components/ui/typography'

export default function Home() {
  const metrics = [
    {
      title: 'Active subs',
      value: 12,
      highlightColor: 'after:bg-highlight-1'
    },
    {
      title: 'Highest subs',
      value: '$19.99',
      highlightColor: 'after:bg-highlight-2'
    },
    {
      title: 'Lowest subs',
      value: '$5.99',
      highlightColor: 'after:bg-highlight-3'
    }
  ]

  return (
    <main>
      <div className="pt-12 pb-6 w-full rounded-b-2xl bg-gradient-to-b from-[#111113] to-[#282833]">
        <Button variant="link" className="absolute top-4 right-2" asChild>
          <Link href="/settings">
            <Settings size="24" className=" text-[#A2A2B5]" />
          </Link>
        </Button>

        <div className="w-full h-full flex-col flex justify-center items-center px-6">
          <div className="w-[286px]">
            <CircularProgressbarWithChildren
              value={10}
              maxValue={100}
              strokeWidth={4}
              circleRatio={0.75}
              className="drop-shadow-[0_0_5px_hsl(var(--shadow-1))]"
              styles={buildStyles({
                trailColor: 'rgba(78, 78, 97, 0.2)',
                pathColor: 'hsl(var(--primary))',
                rotation: 1 / 2 + 1 / 8,
                strokeLinecap: 'round'
              })}
            >
              <div className="pt-12 text-center w-full bg-[url('/images/dotted-ellipse.png')] bg-no-repeat bg-[center_top_0]">
                <Logo className="w-28 h-fit mx-auto" />
                <Typography
                  variant="h1"
                  className="text-center mt-4 text-[40px]"
                >
                  $1,235
                </Typography>
                <Typography
                  variant="bodySmall"
                  className="mt-1 text-tertiary-foreground"
                >
                  This month bills
                </Typography>
                <Button variant="tertiary" size="sm" className="mt-10">
                  See your budget
                </Button>
              </div>
            </CircularProgressbarWithChildren>
          </div>

          <div className="grid grid-cols-3 gap-2 w-full">
            {metrics.map(({ highlightColor, title, value }, index) => (
              <div
                key={title}
                className={`flex flex-col justify-center items-center rounded-2xl h-16 relative after:content-[''] after:absolute after:w-12 after:z-1 after:top-0 after:left-0 after:right-0 ${highlightColor} after:h-px after:border-n after:mx-auto border border-[hsla(240,11%,34%,0.25)] bg-[hsla(240,11%,34%,0.2)] `}
              >
                <Typography
                  as="h3"
                  variant="bodySmall"
                  className="text-tertiary-foreground"
                >
                  {title}
                </Typography>
                <Typography className="font-medium">{value}</Typography>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
