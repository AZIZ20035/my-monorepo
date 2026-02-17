import { cva, type VariantProps } from 'class-variance-authority';

export const modalVariants = cva(
  'z-50 w-full max-w-lg gap-4 border border-[var(--border)] bg-[var(--secondary)] p-6 lg:p-8 shadow-2xl rounded-2xl lg:rounded-3xl backdrop-blur-xl',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        '2xl': 'max-w-6xl',
        full: 'max-w-[95vw] h-[95vh]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export type ModalVariants = VariantProps<typeof modalVariants>;
