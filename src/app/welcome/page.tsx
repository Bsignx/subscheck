import Image from 'next/image'

import { Logo } from '@/components/ui/logo'
import { Typography } from '@/components/ui/typography'

export default function Welcome() {
  return (
    <div className="flex flex-col items-center min-h-screen pt-16 bg-[url(/images/welcome-bg.png)] bg-contain bg-no-repeat bg-[center_top_8rem]">
      <Logo />
      <Typography variant="lead" className="mt-8">
        Hello
      </Typography>
    </div>
  )
}
