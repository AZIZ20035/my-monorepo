'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export const Checkbox = ({ id, checked, onCheckedChange, className, disabled }: CheckboxProps) => {
  return (
    <button
      type="button"
      id={id}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/10 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-[var(--primary)] border-[var(--primary)]" : "border-[var(--border)] bg-[var(--background)]",
        "hover:border-[var(--primary)]/50",
        className
      )}
    >
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 400 }}
          >
            <Check className="h-3.5 w-3.5 text-white stroke-[4px]" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
