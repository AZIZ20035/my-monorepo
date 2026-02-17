'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, User, Lock, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/use-auth-store';
import { userService } from '@/services/user-service';
import { LoginFormInput } from './login-input';
import { SuccessOverlay } from './success-overlay';

/* ─── Schema ─── */
const loginSchema = z.object({
  username: z.string().min(1, 'اسم المستخدم مطلوب'),
  password: z
    .string()
    .min(1, 'كلمة المرور مطلوبة')
    .min(6, 'كلمة المرور يجب أن تكون ٦ أحرف على الأقل'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/* ─── Animations ─── */
const formVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
  exit: { opacity: 0, x: -30 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const { setAuth } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      setIsSubmitting(true);
      setServerError('');

      try {
        const { user } = await userService.login(data.username, data.password);

        setAuth(user);
        setLoginSuccess(true);
        
        toast.success(`مرحباً بك مجدداً، ${user.name || user.username}!`, {
          description: 'تم تسجيل الدخول بنجاح',
        });

        // Store non-sensitive data for UI and persistence
        document.cookie = `user_role=${user.role}; path=/; max-age=${60 * 60 * 24 * 7}`;
        localStorage.setItem('user_role', user.role);
        localStorage.setItem('user', JSON.stringify(user));

        setTimeout(() => {
          if (user.role === 'admin') {
            router.push('/admin');
          } else if (user.role === 'call_center') {
            router.push('/dashboard/orders');
          } else {
            router.push('/dashboard/kitchen');
          }
        }, 1200);
      } catch (err: any) {
        const errorMessage = err.message || 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً';
        setServerError(errorMessage);
        toast.error('فشل تسجيل الدخول', {
          description: errorMessage,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [setAuth, router]
  );

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6, type: 'spring', stiffness: 100 }}
    >
      <SuccessOverlay isVisible={loginSuccess} />

      <AnimatePresence mode="wait">
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col gap-5"
        >
          {/* Server Error */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500 font-bold"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              >
                <div className="h-2 w-2 rounded-full bg-red-500" />
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants}>
            <LoginFormInput
              id="username"
              label="اسم المستخدم"
              type="text"
              placeholder="أدخل اسم المستخدم"
              icon={User}
              error={errors.username}
              registration={register('username')}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <LoginFormInput
              id="password"
              label="كلمة المرور"
              type="password"
              placeholder="أدخل كلمة المرور"
              icon={Lock}
              error={errors.password}
              registration={register('password')}
            />
          </motion.div>

          {/* Remember me */}
          <motion.div variants={itemVariants} className="flex items-center">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--muted-foreground)] font-bold">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] accent-[var(--primary)] focus:ring-[var(--ring)]"
              />
              تذكرني
            </label>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`group relative flex w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-l from-[#0784b5] to-[#39ace7] px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-[#0784b5]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#0784b5]/30 disabled:cursor-not-allowed disabled:opacity-70`}
              whileHover={{ scale: isSubmitting ? 1 : 1.01, y: isSubmitting ? 0 : -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-l from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>جاري تسجيل الدخول...</span>
                </div>
              ) : (
                <>
                  <LogIn size={18} className="transition-transform duration-300 group-hover:-translate-x-1" />
                  <span>تسجيل الدخول</span>
                  <ChevronLeft
                    size={16}
                    className="opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-1"
                  />
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-xs text-[var(--muted-foreground)]">أو</span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>
        <p className="text-sm text-[var(--muted-foreground)] font-bold">
          ليس لديك حساب؟{' '}
          <button
            type="button"
            className="cursor-pointer font-black text-[var(--primary)] transition-colors hover:text-[var(--ring)] hover:underline"
          >
            تواصل مع الإدارة
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
}
