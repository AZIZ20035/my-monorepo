'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList } from 'lucide-react';

interface SuccessOverlayProps {
  isVisible: boolean;
}

export function SuccessOverlay({ isVisible }: SuccessOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-3xl bg-[var(--background)]/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-bl from-[#39ace7] to-[#0784b5]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
          >
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <ClipboardList className="h-10 w-10 text-white" />
            </motion.div>
          </motion.div>
          <motion.p
            className="mt-4 text-lg font-bold text-[var(--primary)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            تم تسجيل الدخول بنجاح!
          </motion.p>
          <motion.p
            className="mt-1 text-sm text-[var(--muted-foreground)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            جاري التحويل...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
