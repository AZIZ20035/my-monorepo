'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export const Label = ({ htmlFor, children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    htmlFor={htmlFor}
    className={cn(
      "text-sm font-black leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[var(--foreground)]",
      className
    )}
    {...props}
  >
    {children}
  </label>
);
