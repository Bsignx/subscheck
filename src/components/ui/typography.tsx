import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const TypographyVariants = cva('font-sans font-normal leading-normal', {
  variants: {
    variant: {
      h1: 'text-6xl font-bold leading-tight',
      h2: 'text-5xl font-bold leading-tight',
      h3: 'text-4xl font-bold leading-tight',
      h4: 'text-3xl font-bold leading-tight',
      h5: 'text-2xl font-bold leading-tight',
      h6: 'text-xl font-bold leading-tight',
      paragraph: 'text-base font-normal leading-relaxed',
      small: 'text-sm font-normal leading-relaxed',
      lead: 'text-lg font-normal leading-relaxed'
    }
  },
  defaultVariants: {
    variant: 'paragraph'
  }
})

type TypographyProps = {
  children: React.ReactNode
  className?: string
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
    case 'paragraph':
      return 'p'
    case 'small':
      return 'small'
    case 'lead':
      return 'p'
    default:
      return 'p'
  }
}

export const Typography = ({
  className,
  children,
  variant
}: TypographyProps) => {
  const Component = getComponent({ variant })

  return (
    <Component className={cn(TypographyVariants({ variant, className }))}>
      {children}
    </Component>
  )
}
