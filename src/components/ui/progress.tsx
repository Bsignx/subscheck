'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import * as ProgressPrimitive from '@radix-ui/react-progress'

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string
  }
>(({ className, value, indicatorClassName, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'relative h-[5px] w-full overflow-hidden rounded-sm bg-progress',
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        'h-full w-full flex-1 bg-primary transition-all',
        indicatorClassName
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
