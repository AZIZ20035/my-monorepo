import * as React from 'react';
import { cn } from '@/lib/utils';
import { inputVariants, type InputVariants } from './input.variants';

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    InputVariants {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, inputSize, label, error, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            inputVariants({ variant: error ? 'error' : variant, inputSize, className }),
            "min-h-[80px] w-full py-3"
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-xs font-medium text-error">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
