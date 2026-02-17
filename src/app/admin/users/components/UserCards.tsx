'use client';

import { memo } from 'react';
import { User } from '@/dto/user.dto';
import { Button } from '@/components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import {
  Edit2,
  Trash2,
  Key,
  Users,
  Activity,
  Shield,
  Headphones,
  ClipboardCheck,
  MoreVertical,
  UserCircle,
  UserCheck,
} from 'lucide-react';
import { useUserStore } from '@/store/use-user-store';
import { useAuthStore } from '@/store/use-auth-store';
import { ConfirmModal } from '@/components/common/confirm-modal';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';

interface UserCardsProps {
  users: User[];
  onEdit: (user: User) => void;
  onResetPassword: (user: User) => void;
}

/* ═══════════ Role helpers ═══════════ */
const getRoleInfo = (role: string) => {
  switch (role) {
    case 'admin':
      return {
        label: 'مدير النظام',
        variant: 'destructive' as const,
        icon: Shield,
        color: 'text-red-500',
        bg: 'bg-red-500/10',
      };
    case 'call_center':
      return {
        label: 'خدمة العملاء',
        variant: 'info' as const,
        icon: Headphones,
        color: 'text-sky-500',
        bg: 'bg-sky-500/10',
      };
    case 'order_reviewer':
      return {
        label: 'محلل بيانات',
        variant: 'warning' as const,
        icon: ClipboardCheck,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
      };
    default:
      return {
        label: role,
        variant: 'outline' as const,
        icon: Users,
        color: 'text-[var(--muted-foreground)]',
        bg: 'bg-[var(--muted)]',
      };
  }
};

/* ═══════════ Action Menu ═══════════ */
function ActionMenu({
  user,
  isSelf,
  onEdit,
  onResetPassword,
  onDeactivate,
  onActivate,
}: {
  user: User;
  isSelf: boolean;
  onEdit: () => void;
  onResetPassword: () => void;
  onDeactivate: () => void;
  onActivate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, handleClickOutside]);

  if (isSelf) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="h-8 w-8 rounded-lg flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all cursor-pointer"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-1 w-44 bg-[var(--secondary)] border border-[var(--border)] rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <button
              onClick={() => {
                onEdit();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
            >
              <Edit2 className="h-4 w-4 text-[var(--primary)]" />
              تعديل البيانات
            </button>
            <button
              onClick={() => {
                onResetPassword();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
            >
              <Key className="h-4 w-4 text-amber-500" />
              كلمة المرور
            </button>
            <div className="h-px bg-[var(--border)]" />
            {user.isActive ? (
              <button
                onClick={() => {
                  onDeactivate();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/5 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                تعطيل الحساب
              </button>
            ) : (
              <button
                onClick={() => {
                  onActivate();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-emerald-600 hover:bg-emerald-500/5 transition-colors cursor-pointer"
              >
                <UserCheck className="h-4 w-4" />
                تنشيط الحساب
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════ User Card ═══════════ */
const UserCard = memo(
  ({
    user,
    index,
    isSelf,
    onEdit,
    onResetPassword,
    onDeactivate,
    onActivate,
  }: {
    user: User;
    index: number;
    isSelf: boolean;
    onEdit: (user: User) => void;
    onResetPassword: (user: User) => void;
    onDeactivate: (id: string) => void;
    onActivate: (id: string) => void;
  }) => {
    const roleInfo = getRoleInfo(user.role);

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ delay: index * 0.03, duration: 0.3 }}
        className={`group bg-[var(--secondary)] border border-[var(--border)] rounded-xl lg:rounded-2xl p-4 lg:p-5 hover:shadow-md transition-all duration-300 ${isSelf ? 'ring-2 ring-[var(--primary)]/20 shadow-sm' : 'hover:border-[var(--primary)]/20'}`}
      >
        <div className="flex items-start justify-between gap-3">
          {/* User info */}
          <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
            {/* Avatar */}
            <div
              className={`h-11 w-11 lg:h-12 lg:w-12 rounded-xl ${roleInfo.bg} flex items-center justify-center font-black text-base lg:text-lg ${roleInfo.color} shrink-0 transition-transform group-hover:scale-105`}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm lg:text-base font-black text-[var(--foreground)] truncate">
                  {user.name}
                </h3>
                {isSelf && (
                  <span className="h-5 px-2 rounded-full bg-[var(--primary)] text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                    أنت
                  </span>
                )}
                {user.isActive ? (
                  <span className="inline-flex items-center gap-1 shrink-0">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">نشط</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 shrink-0">
                    <span className="h-2 w-2 rounded-full bg-[var(--muted-foreground)]/30" />
                    <span className="text-[10px] font-bold text-[var(--muted-foreground)]">
                      معطّل
                    </span>
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-[var(--muted-foreground)] mt-0.5 truncate">
                @{user.username}
              </p>
            </div>
          </div>

          {/* Actions - Hidden for Self */}
          {!isSelf && (
            <div className="flex items-center gap-1 shrink-0">
              {/* Desktop inline buttons */}
              <div className="hidden lg:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(user)}
                  className="h-8 w-8 rounded-lg transition-colors hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 cursor-pointer"
                  title="تعديل"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onResetPassword(user)}
                  className="h-8 w-8 rounded-lg transition-colors hover:text-amber-500 hover:bg-amber-50 cursor-pointer"
                  title="كلمة المرور"
                >
                  <Key className="h-4 w-4" />
                </Button>
                {user.isActive ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeactivate(user.id)}
                    className="h-8 w-8 rounded-lg transition-colors hover:text-red-500 hover:bg-red-50 cursor-pointer"
                    title="تعطيل"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onActivate(user.id)}
                    className="h-8 w-8 rounded-lg transition-colors hover:text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                    title="تنشط"
                  >
                    <UserCheck className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {/* Mobile menu */}
              <div className="lg:hidden">
                <ActionMenu
                  user={user}
                  isSelf={isSelf}
                  onEdit={() => onEdit(user)}
                  onResetPassword={() => onResetPassword(user)}
                  onDeactivate={() => onDeactivate(user.id)}
                  onActivate={() => onActivate(user.id)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom row - role & ID */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
          <Badge variant={roleInfo.variant} className="shadow-sm">
            {roleInfo.label}
          </Badge>
          <span className="text-[10px] font-bold text-[var(--muted-foreground)]/50 uppercase tracking-wider">
            ID: {user.id.slice(0, 8)}
          </span>
        </div>
      </motion.div>
    );
  }
);
UserCard.displayName = 'UserCard';

/* ═══════════ Main UserCards ═══════════ */
export function UserCards({ users, onEdit, onResetPassword }: UserCardsProps) {
  const { isLoading, updateUser } = useUserStore();
  const { user: currentUser } = useAuthStore();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async (id: string, isActive: boolean) => {
    setIsUpdating(true);
    try {
      await updateUser(id, { isActive });
      if (!isActive) setIsConfirmOpen(false);
    } catch (error) {
      // Error handled in store
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 lg:p-32 bg-[var(--secondary)] border border-[var(--border)] rounded-2xl lg:rounded-[2rem] shadow-sm">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
            <Activity className="h-8 w-8 animate-pulse" />
          </div>
          <div className="absolute inset-0 h-16 w-16 rounded-2xl border-2 border-[var(--primary)]/30 animate-ping opacity-20" />
        </div>
        <div className="text-center mt-6">
          <p className="text-lg font-black text-[var(--foreground)]">مزامنة البيانات...</p>
          <p className="text-sm text-[var(--muted-foreground)] font-medium mt-1">
            جاري استرجاع معلومات الكادر الوظيفي
          </p>
        </div>
      </div>
    );
  }

  if (users.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 lg:p-32 bg-[var(--secondary)] border border-[var(--border)] rounded-2xl lg:rounded-[2rem] shadow-sm">
        <div className="h-20 w-20 bg-[var(--muted)] rounded-2xl flex items-center justify-center text-[var(--muted-foreground)]">
          <UserCircle className="h-10 w-10" />
        </div>
        <div className="text-center mt-6 space-y-1">
          <p className="text-xl font-black text-[var(--foreground)]">لا توجد نتائج</p>
          <p className="text-[var(--muted-foreground)] text-sm font-medium">
            لم يتم العثور على موظفين يطابقون معايير البحث
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-3 overflow-hidden">
      {/* Count header */}
      <div className="flex items-center justify-between px-1 shrink-0">
        <span className="text-xs font-bold text-[var(--muted-foreground)]">
          عرض {users.length} موظف
        </span>
      </div>

      {/* Cards Grid Container */}
      <div className="flex-1 overflow-y-auto blue-scrollbar pb-6 px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
          <AnimatePresence mode="popLayout">
            {users.map((user, index) => (
              <UserCard
                key={user.id}
                user={user}
                index={index}
                isSelf={user.id === currentUser?.id}
                onEdit={onEdit}
                onResetPassword={onResetPassword}
                onDeactivate={(id) => {
                  setUserToDeactivate(id);
                  setIsConfirmOpen(true);
                }}
                onActivate={(id) => handleUpdateStatus(id, true)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => userToDeactivate && handleUpdateStatus(userToDeactivate, false)}
        title="تعطيل الحساب"
        description="هل أنت متأكد من رغبتك في تعطيل حساب هذا الموظف؟ لن يتمكن من تسجيل الدخول إلى النظام حتى يتم تنشيط الحساب مرة أخرى."
        confirmText="تعطيل الحساب"
        cancelText="تراجع"
        variant="danger"
        isLoading={isUpdating}
      />
    </div>
  );
}
