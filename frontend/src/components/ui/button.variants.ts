import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95 cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 active:scale-[0.98]',
        secondary: 'bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/80 active:scale-[0.98]',
        outline: 'border-2 border-slate-200 bg-transparent shadow-sm hover:border-primary hover:text-primary active:scale-[0.98]',
        ghost: 'hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98]',
        link: 'text-primary underline-offset-4 hover:underline',
        error: 'bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 active:scale-[0.98]',
        success: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 active:scale-[0.98]',
        warning: 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 hover:bg-amber-600 active:scale-[0.98]',
        info: 'bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:bg-sky-600 active:scale-[0.98]',
        glass: 'bg-white/80 backdrop-blur-md border border-slate-100 text-slate-700 shadow-xl shadow-slate-200/50 hover:bg-white hover:border-slate-200 active:scale-[0.98] dark:bg-slate-900/40 dark:border-slate-800/60 dark:text-slate-200 dark:shadow-black/20',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-8 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
