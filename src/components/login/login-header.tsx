'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

function LoginHeaderBase() {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Logo with entry animation */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.5, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.2,
        }}
      >
        {/* Glow ring — CSS animated (no JS loop) */}
        <div className="absolute -inset-3 rounded-full bg-[#39ace7]/20 blur-xl animate-glow-pulse" />
        <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-[var(--background)] shadow-lg shadow-[var(--primary)]/20 ring-2 ring-[var(--border)] md:h-24 md:w-24">
          <Image
            src="/logo.png"
            alt="فنون المدفون"
            width={80}
            height={80}
            className="h-16 w-16 object-contain md:h-20 md:w-20"
            priority
          />
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold text-[var(--primary)] md:text-3xl">
          فنون المدفون
        </h1>
        <motion.p
          className="mt-1 text-sm text-[var(--muted-foreground)] md:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          مرحباً بك مجدداً 👋
        </motion.p>
      </motion.div>
    </div>
  );
}

export const LoginHeader = memo(LoginHeaderBase);
