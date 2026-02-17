'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, Eye, EyeOff } from 'lucide-react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface LoginFormInputProps {
  id: string;
  label: string;
  type: 'text' | 'password';
  placeholder: string;
  icon: LucideIcon;
  error?: FieldError;
  registration: UseFormRegisterReturn;
  dir?: 'ltr' | 'rtl';
}

export function LoginFormInput({
  id,
  label,
  type,
  placeholder,
  icon: Icon,
  error,
  registration,
  dir = 'ltr'
}: LoginFormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : 'text';

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-[var(--foreground)]"
      >
        {label}
      </label>
      <div className="group relative">
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <Icon
            size={18}
            className={`transition-colors duration-200 ${
              error ? 'text-red-400' : 'text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)]'
            }`}
          />
        </div>
        <input
          id={id}
          type={inputType}
          dir={dir}
          placeholder={placeholder}
          className={`w-full rounded-xl border-2 bg-[var(--muted)] py-3.5 pr-10 ${isPassword ? 'pl-12' : 'pl-4'} text-left text-sm text-[var(--foreground)] outline-none transition-all duration-300 placeholder:text-[var(--muted-foreground)] focus:bg-[var(--background)] focus:shadow-lg focus:shadow-[var(--ring)]/10 ${
            error
              ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
              : 'border-[var(--border)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20'
          }`}
          {...registration}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-1 text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-1.5 text-xs font-medium text-red-500"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
