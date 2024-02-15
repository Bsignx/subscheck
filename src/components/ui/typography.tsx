import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const TypographyVariants = cva('font-sans font-normal leading-normal', {
  variants: {
    variant: {
      h1: 'text-4xl font-bold',
      h2: 'text-3xl font-bold',
      h3: 'text-2xl font-bold',
      h4: 'text-lg font-normal',
      h5: 'text-base font-normal',
      h6: 'text-sm font-normal',
      subtitle: 'text-lg font-medium',
      bodyLarge: 'text-base font-normal tracking-wider',
      bodyMedium: 'text-sm font-normal tracking-wider',
      bodySmall: 'text-xs font-medium tracking-wider'
    }
  },
  defaultVariants: {
    variant: 'bodyMedium'
  }
})

type TypographyProps = {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
} & VariantProps<typeof TypographyVariants>

const getComponent = ({ variant }: VariantProps<typeof TypographyVariants>) => {
  switch (variant) {
    case 'h1':
      return 'h1'
    case 'h2':
      return 'h2'
    case 'h3':
      return 'h3'
    case 'h4':
      return 'h4'
    case 'h5':
      return 'h5'
    case 'h6':
      return 'h6'
    case 'bodyLarge':
      return 'p'
    case 'bodySmall':
      return 'p'
    case 'bodyMedium':
      return 'p'
    case 'subtitle':
      return 'p'
    default:
      return 'p'
  }
}

export const Typography = ({
  className,
  children,
  variant,
  as
}: TypographyProps) => {
  const Component = as || getComponent({ variant })

  return (
    <Component className={cn(TypographyVariants({ variant, className }))}>
      {children}
    </Component>
  )
}
