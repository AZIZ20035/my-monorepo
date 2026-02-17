'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'info';
  isLoading?: boolean;
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'تأكيد الحذف',
  cancelLabel = 'إلغاء',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) => {
  // Handle Escape key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 overflow-hidden outline-none focus:outline-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 pointer-events-auto"
          />
          
          {/* Content Wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 400,
              mass: 0.5
            }}
            className="relative w-full max-w-md bg-[var(--secondary)] border border-[var(--border)] rounded-[2.5rem] shadow-2xl p-8 flex flex-col gap-6 pointer-events-auto text-right"
          >
            {/* Header / Icon */}
            <div className="flex items-start justify-between gap-4">
              <div className={cn(
                "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                variant === 'danger' ? "bg-red-500/10 text-red-500 shadow-red-500/10" : "bg-sky-500/10 text-sky-500 shadow-sky-500/10"
              )}>
                {variant === 'danger' ? <AlertTriangle size={28} /> : <Info size={28} />}
              </div>
              <button 
                onClick={onClose}
                className="h-10 w-10 flex items-center justify-center rounded-2xl text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-all bg-[var(--muted)]/50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Text Content */}
            <div className="space-y-2">
              <h2 className="text-xl lg:text-2xl font-black text-[var(--foreground)] tracking-tight">
                {title}
              </h2>
              <p className="text-sm lg:text-base text-[var(--muted-foreground)] font-bold opacity-80 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row-reverse items-center gap-3 mt-2">
              <Button
                onClick={onConfirm}
                disabled={isLoading}
                className={cn(
                  "h-14 w-full sm:flex-1 rounded-2xl font-black text-white shadow-lg transition-all border-none",
                  variant === 'danger' 
                    ? "bg-red-500 hover:bg-red-600 shadow-red-500/20 hover:shadow-red-500/30" 
                    : "bg-[#0784b5] hover:bg-[#0784b5]/90 shadow-[#0784b5]/20 hover:shadow-[#0784b5]/30"
                )}
              >
                {confirmLabel}
              </Button>
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={isLoading}
                className="h-14 w-full sm:flex-1 rounded-2xl font-black text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-all border border-[var(--border)] bg-transparent"
              >
                {cancelLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export { ConfirmDialog };
