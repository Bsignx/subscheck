import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-full shadow-[0_8px_25px_0_hsl(var(--shadow-1))] bg-[radial-gradient(100%_0%_at_45%_100%,rgba(255,255,255,0.00)_43.25%,rgba(102,108,255,0.50)_100%))]',
        chameleon:
          'font-medium text-foreground bg-chameleon hover:bg-chameleon/20 rounded-full',
        destructive:
          'font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'font-medium text-secondary-foreground bg-secondary rounded-full hover:bg-secondary/90',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        tertiary:
          'bg-tertiary hover:bg-primary rounded-full text-xs font-medium border-tertiary border'
      },
      size: {
        default: 'h-12 px-4 py-2',
        sm: 'h-8 px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
