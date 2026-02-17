'use client';

import { motion } from 'framer-motion';
import { LoginBackground } from '@/components/login/login-background';
import { LoginHeader } from '@/components/login/login-header';
import { LoginForm } from '@/components/login/login-form';
import { ThemeToggle } from '@/components/common/theme-toggle';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[var(--background)] p-4 transition-colors duration-500 md:p-8">
      {/* Theme Toggle — top left corner */}
      <motion.div
        className="fixed left-4 top-4 z-50"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
      >
        <ThemeToggle />
      </motion.div>

      {/* Animated Background */}
      <LoginBackground />

      {/* Main Content */}
      <motion.div
        className="relative z-10 flex w-full max-w-md flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Glass Card */}
        <motion.div
          className="relative w-full overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--background)]/80 p-6 shadow-2xl shadow-[#39ace7]/10 backdrop-blur-xl transition-colors duration-500 md:p-8"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
            delay: 0.1,
          }}
        >
          {/* Decorative top gradient bar */}
          <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-l from-[#0784b5] via-[#39ace7] to-[#9bd4e4]" />

          {/* Header with logo */}
          <div className="mb-8">
            <LoginHeader />
          </div>

          {/* Login Form */}
          <LoginForm />
        </motion.div>

        {/* Copyright */}
        <motion.p
          className="mt-6 text-center text-xs text-[var(--muted-foreground)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          © {new Date().getFullYear()} فنون المدفون — جميع الحقوق محفوظة
        </motion.p>
      </motion.div>
    </div>
  );
}
