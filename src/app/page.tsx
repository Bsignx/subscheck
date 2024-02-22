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

export default function Home() {
  return (
    <main>
      <div className="h-[50vh] w-full rounded-b-2xl bg-white bg-gradient-to-b from-[#111113] to-[#282833]">
        <Button variant="link" className="absolute top-4 right-2" asChild>
          <Link href="/settings">
            <Settings size="24" className=" text-[#A2A2B5]" />
          </Link>
        </Button>

        <div className="w-full h-full flex justify-center items-center">
          <div className="w-[286px]">
            <CircularProgressbarWithChildren
              value={85}
              maxValue={100}
              strokeWidth={4}
              circleRatio={0.75}
              className="drop-shadow-[0_0_5px_rgba(102,108,255,0.5)]"
              styles={buildStyles({
                trailColor: 'rgba(78, 78, 97, 0.2)',
                pathColor: '#666CFF',
                rotation: 1 / 2 + 1 / 8,
                strokeLinecap: 'round'
              })}
            >
              <Logo className="w-28 h-fit mx-auto" />
            </CircularProgressbarWithChildren>
          </div>
        </div>
      </div>
    </main>
  )
}
