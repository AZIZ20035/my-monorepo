'use client';

import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20';
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20';
      default:
        return 'bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white shadow-[var(--primary)]/20';
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-50 text-red-500 border-red-100';
      case 'warning':
        return 'bg-amber-50 text-amber-500 border-amber-100';
      default:
        return 'bg-blue-50 text-blue-500 border-blue-100';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center p-2">
        {/* Warning Icon */}
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`h-20 w-20 rounded-3xl flex items-center justify-center border-2 mb-6 ${getIconStyles()}`}
        >
          <AlertTriangle size={36} className="animate-pulse" />
        </motion.div>

        <h3 className="text-xl lg:text-2xl font-black text-[var(--foreground)] mb-3 leading-tight">
          {title}
        </h3>
        
        <p className="text-sm lg:text-base font-medium text-[var(--muted-foreground)] mb-8 max-w-xs mx-auto leading-relaxed">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`h-12 lg:h-14 flex-1 w-full rounded-2xl font-black transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg ${getVariantStyles()}`}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              confirmText
            )}
          </Button>
          
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="h-12 lg:h-14 flex-1 w-full rounded-2xl font-black bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80 hover:text-[var(--foreground)] border border-[var(--border)] transition-all active:scale-[0.98]"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
