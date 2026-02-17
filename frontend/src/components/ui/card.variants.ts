import { cva, type VariantProps } from 'class-variance-authority';

export const cardVariants = cva(
  'rounded-xl border bg-card text-card-foreground shadow-sm transition-all',
  {
    variants: {
      variant: {
        default: 'bg-background',
        flat: 'border-none bg-muted/50 shadow-none',
        glass: 'border-white/20 bg-white/10 backdrop-blur-md',
        elevated: 'shadow-md hover:shadow-lg',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

export type CardVariants = VariantProps<typeof cardVariants>;
