'use client';

import { useEffect, useRef, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from '@/dto/user.dto';
import { useUserStore } from '@/store/use-user-store';
import { gsap } from 'gsap';
import { Key, ShieldAlert, CheckCircle2, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function ResetPasswordModal({ isOpen, onClose, user }: ResetPasswordModalProps) {
  const { resetPassword, isLoading } = useUserStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Password strength
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { level: 1, label: 'ضعيفة', color: 'bg-red-500' };
    if (score <= 2) return { level: 2, label: 'متوسطة', color: 'bg-amber-500' };
    if (score <= 3) return { level: 3, label: 'جيدة', color: 'bg-sky-500' };
    return { level: 4, label: 'قوية', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  useEffect(() => {
    if (isOpen && formRef.current) {
      setIsSuccess(false);
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setError('');
      gsap.fromTo(
        formRef.current.querySelectorAll('.form-group'),
        { opacity: 0, scale: 0.95, y: 10 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.2,
        }
      );
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user) return;
    if (password.length < 6) {
      setError('يجب أن تكون كلمة المرور 6 أحرف على الأقل');
      return;
    }
    if (password !== confirmPassword) {
      setError('كلمة المرور غير متطابقة');
      return;
    }
    try {
      await resetPassword(user.id, password);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      // Error handled in store
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تأمين الحساب: كلمة مرور جديدة"
      description={`تعديل رمز الدخول الخاص بالمستخدم: ${user?.username}`}
      className="max-w-md"
    >
      {isSuccess ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-5 animate-in fade-in zoom-in duration-500">
          <div className="h-20 w-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-inner">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-2xl font-black text-[var(--foreground)] tracking-tight">
              تم التغيير بنجاح
            </p>
            <p className="text-sm text-[var(--muted-foreground)] font-medium">
              تم تحديث سجلات النظام بكلمة المرور الجديدة
            </p>
          </div>
          <div className="pt-4 px-10 w-full">
            <div className="h-1.5 w-full bg-[var(--muted)] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-full animate-[progress_2s_ease-in-out]" />
            </div>
          </div>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          {/* Warning */}
          <div className="p-4 bg-amber-50 border border-amber-200/50 rounded-xl flex items-start gap-3 form-group">
            <div className="h-9 w-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="text-xs text-amber-800 leading-relaxed font-medium">
              <span className="font-black block text-sm mb-0.5">إجراء أمني حساس</span>
              تغيير كلمة المرور سيقطع الوصول عن جميع الجلسات المفتوحة حالياً.
            </div>
          </div>

          {/* New Password */}
          <div className="form-group space-y-2">
            <label className="text-xs font-black text-[var(--muted-foreground)] mr-1 flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-[var(--primary)]" />
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••••••"
                required
                disabled={isLoading}
                className="rounded-xl border-[var(--border)] h-12 px-4 pl-12 shadow-sm focus:ring-4 focus:ring-[var(--primary)]/10 transition-all font-bold tracking-widest text-base text-[var(--foreground)] bg-[var(--secondary)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Strength bar */}
            {password && (
              <div className="space-y-1.5">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        level <= strength.level ? strength.color : 'bg-[var(--muted)]'
                      }`}
                    />
                  ))}
                </div>
                <span
                  className={`text-[10px] font-bold ${
                    strength.level <= 1
                      ? 'text-red-500'
                      : strength.level <= 2
                        ? 'text-amber-500'
                        : strength.level <= 3
                          ? 'text-sky-500'
                          : 'text-emerald-500'
                  }`}
                >
                  قوة كلمة المرور: {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group space-y-2">
            <label className="text-xs font-black text-[var(--muted-foreground)] mr-1 flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-[var(--primary)]" />
              تأكيد كلمة المرور
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              placeholder="••••••••••••"
              required
              disabled={isLoading}
              className="rounded-xl border-[var(--border)] h-12 px-4 shadow-sm focus:ring-4 focus:ring-[var(--primary)]/10 transition-all font-bold tracking-widest text-base text-[var(--foreground)] bg-[var(--secondary)]"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 form-group">
              <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
              <span className="text-xs font-bold text-red-600">{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-[var(--border)] form-group">
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="h-11 lg:h-12 px-6 rounded-xl font-black text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-all cursor-pointer border border-transparent hover:border-[var(--border)] order-2 sm:order-1"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="h-11 lg:h-12 px-8 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black shadow-xl shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer order-1 sm:order-2"
            >
              <Key className="h-4 w-4 ml-2" />
              حفظ وتأكيد
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
