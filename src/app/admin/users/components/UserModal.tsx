'use client';

import { useEffect, useRef, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, UserRole, CreateUserRequest, UpdateUserRequest } from '@/dto/user.dto';
import { useUserStore } from '@/store/use-user-store';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import {
  UserPlus,
  UserCheck,
  Shield,
  Headphones,
  ClipboardCheck,
  Eye,
  EyeOff,
  Activity,
} from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

const roleOptions: {
  value: UserRole;
  label: string;
  desc: string;
  icon: typeof Shield;
  color: string;
  bg: string;
  activeBorder: string;
}[] = [
  {
    value: 'call_center',
    label: 'خدمة عملاء',
    desc: 'استقبال الطلبات والتواصل مع العملاء',
    icon: Headphones,
    color: 'text-sky-500',
    bg: 'bg-sky-500/10',
    activeBorder: 'border-sky-300',
  },
  {
    value: 'order_reviewer',
    label: 'محلل بيانات',
    desc: 'مراجعة الطلبات وتقارير الأداء',
    icon: ClipboardCheck,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    activeBorder: 'border-amber-300',
  },
  {
    value: 'admin',
    label: 'مدير نظام',
    desc: 'صلاحيات كاملة للتحكم بالنظام',
    icon: Shield,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    activeBorder: 'border-red-300',
  },
];

export function UserModal({ isOpen, onClose, user }: UserModalProps) {
  const { createUser, updateUser, isLoading } = useUserStore();
  const formRef = useRef<HTMLFormElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateUserRequest> & { isActive?: boolean }>({
    username: '',
    password: '',
    fullName: '',
    role: 'call_center',
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        fullName: user.name,
        role: user.role,
        isActive: user.isActive,
      });
    } else {
      setFormData({
        username: '',
        password: '',
        fullName: '',
        role: 'call_center',
        isActive: true,
      });
    }
    setShowPassword(false);
  }, [user, isOpen]);

  useEffect(() => {
    if (isOpen && formRef.current) {
      gsap.fromTo(
        formRef.current.querySelectorAll('.form-group'),
        { opacity: 0, y: 15, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: 'back.out(1.7)',
          delay: 0.2,
        }
      );
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user) {
        const updateData: UpdateUserRequest = {
          fullName: formData.fullName,
          role: formData.role as UserRole,
          isActive: formData.isActive,
        };
        await updateUser(user.id, updateData);
      } else {
        await createUser(formData as CreateUserRequest);
      }
      onClose();
    } catch (error) {
      // Error is handled in store
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}
      description={
        user
          ? `تحديث معلومات الحساب الخاص بـ ${user.username}`
          : 'قم بتعبئة البيانات التالية لإنشاء حساب وصول للنظام'
      }
      className="max-w-xl"
    >
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        {/* Username & Full Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-xs font-black text-[var(--muted-foreground)] mb-2 mr-1">
              اسم المستخدم
            </label>
            <Input
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="مثلاً: ahmed_ali"
              required
              disabled={!!user || isLoading}
              className="rounded-xl border-[var(--border)] h-12 px-4 focus:ring-[var(--primary)]/20 transition-all font-bold text-[var(--foreground)] bg-[var(--secondary)]"
            />
          </div>

          <div className="form-group">
            <label className="block text-xs font-black text-[var(--muted-foreground)] mb-2 mr-1">
              الاسم الكامل
            </label>
            <Input
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="الاسم الرباعي للموظف"
              required
              disabled={isLoading}
              className="rounded-xl border-[var(--border)] h-12 px-4 focus:ring-[var(--primary)]/20 transition-all font-bold text-[var(--foreground)] bg-[var(--secondary)]"
            />
          </div>
        </div>

        {/* Account Status - Only for Edit */}
        {user && (
          <div className="form-group p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${formData.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-[var(--muted-foreground)]/10 text-[var(--muted-foreground)]'}`}>
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-[var(--foreground)]">حالة الحساب</p>
                  <p className="text-[10px] font-bold text-[var(--muted-foreground)]">
                    {formData.isActive ? 'الحساب نشط ويستطيع الوصول للنظام' : 'الحساب معطل ولا يمكن لصاحبه الدخول'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`relative h-6 w-11 rounded-full p-1 transition-colors cursor-pointer ${formData.isActive ? 'bg-emerald-500' : 'bg-[var(--muted-foreground)]/30'}`}
              >
                <motion.div
                  animate={{ x: formData.isActive ? 20 : 0 }}
                  className="h-4 w-4 bg-white rounded-full shadow-sm"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        )}

        {/* Password - only for create */}
        <AnimatePresence>
          {!user && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="form-group overflow-hidden"
            >
              <label className="block text-xs font-black text-[var(--muted-foreground)] mb-2 mr-1">
                كلمة المرور الأولية
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required={!user}
                  disabled={isLoading}
                  className="rounded-xl border-[var(--border)] h-12 px-4 pl-12 focus:ring-[var(--primary)]/20 transition-all font-bold tracking-widest text-[var(--foreground)] bg-[var(--secondary)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Role Selection - Cards */}
        <div className="form-group space-y-2">
          <label className="text-xs font-black text-[var(--muted-foreground)] mr-1">
            الدور الوظيفي والصلاحيات
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {roleOptions.map((role) => {
              const isSelected = formData.role === role.value;
              return (
                <button
                  key={role.value}
                  type="button"
                  disabled={isLoading}
                  onClick={() => setFormData({ ...formData, role: role.value })}
                  className={`relative p-3 rounded-xl border-2 text-right transition-all cursor-pointer ${
                    isSelected
                      ? `${role.bg} ${role.activeBorder} shadow-sm`
                      : 'border-[var(--border)] hover:border-[var(--primary)]/20 bg-[var(--secondary)]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`h-7 w-7 rounded-lg ${isSelected ? role.bg : 'bg-[var(--muted)]'} flex items-center justify-center ${isSelected ? role.color : 'text-[var(--muted-foreground)]'} transition-colors`}
                    >
                      <role.icon className="h-3.5 w-3.5" />
                    </div>
                    <span
                      className={`text-xs font-black ${isSelected ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'} transition-colors`}
                    >
                      {role.label}
                    </span>
                  </div>
                  <p
                    className={`text-[10px] font-medium leading-relaxed ${isSelected ? 'text-[var(--muted-foreground)]' : 'text-[var(--muted-foreground)]/60'} transition-colors`}
                  >
                    {role.desc}
                  </p>
                  {isSelected && (
                    <motion.div
                      layoutId="role-indicator"
                      className={`absolute top-2 left-2 h-2 w-2 rounded-full ${role.color === 'text-sky-500' ? 'bg-sky-500' : role.color === 'text-amber-500' ? 'bg-amber-500' : 'bg-red-500'}`}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-[var(--border)] form-group">
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
            className="h-11 lg:h-12 px-8 rounded-xl bg-gradient-to-l from-[#0784b5] to-[#39ace7] text-white font-black shadow-xl shadow-[#39ace7]/20 hover:shadow-[#39ace7]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer order-1 sm:order-2"
          >
            {user ? (
              <span className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                تحديث البيانات
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                إنشاء الحساب
              </span>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
