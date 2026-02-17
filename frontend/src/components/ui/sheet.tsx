'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Sheet = ({ open, onOpenChange, children }: SheetProps) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm pointer-events-auto"
          />
          <div className="fixed inset-0 z-[101] overflow-hidden pointer-events-none">
             {children}
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export const SheetContent = ({ side = 'left', children, className }: { side?: 'left' | 'right'; children: React.ReactNode; className?: string }) => {
  return (
    <motion.div
      initial={{ x: side === 'left' ? '-100%' : '100%' }}
      animate={{ x: 0 }}
      exit={{ x: side === 'left' ? '-100%' : '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={cn(
        "fixed top-0 bottom-0 z-[110] w-full sm:max-w-xl bg-[var(--background)] shadow-2xl pointer-events-auto",
        side === 'left' ? 'left-0' : 'right-0',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const SheetHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex flex-col space-y-2 text-right", className)}>{children}</div>
);

export const SheetTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={cn("text-lg font-black text-[var(--foreground)]", className)}>{children}</h2>
);

export const SheetDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("text-sm text-[var(--muted-foreground)]", className)}>{children}</p>
);

export const SheetFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}>{children}</div>
);
