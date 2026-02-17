'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { modalVariants, type ModalVariants } from './modal.variants';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ModalProps extends ModalVariants {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size,
  className,
}: ModalProps) => {
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md pointer-events-auto transition-all duration-300"
          />
          
          {/* Content Wrapper */}
          <div className="relative w-full my-6 mx-auto pointer-events-auto flex items-center justify-center" style={{ minHeight: 'calc(100% - 3.5rem)' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ 
                type: 'spring', 
                damping: 25, 
                stiffness: 350,
                mass: 0.5
              }}
              className={cn(modalVariants({ size, className }), "relative flex flex-col w-full outline-none focus:outline-none overflow-hidden")}
            >
              {/* Header */}
              <div className="flex flex-col space-y-2 text-right">
                <div className="flex justify-between items-center gap-4">
                  <div className="flex-1">
                    {title && <h2 className="text-xl lg:text-2xl font-black text-[var(--foreground)] tracking-tight">{title}</h2>}
                    {description && <p className="text-sm lg:text-base text-[var(--muted-foreground)] font-medium mt-1">{description}</p>}
                  </div>
                   <button 
                    onClick={onClose}
                    className="h-10 w-10 flex items-center justify-center rounded-2xl text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-all cursor-pointer bg-[var(--muted)] shadow-sm shrink-0"
                   >
                     <X className="h-5 w-5" />
                     <span className="sr-only">Close</span>
                   </button>
                </div>
              </div>

              {/* Body */}
              <div className="relative flex-1 min-h-0 mt-6 overflow-hidden">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export { Modal };
