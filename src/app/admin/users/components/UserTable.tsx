'use client';

import { memo, useState } from 'react';
import { User } from '@/dto/user.dto';
import { Button } from '@/components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import {
  Edit2,
  Trash2,
  Key,
  Shield,
  Headphones,
  ClipboardCheck,
  UserCheck,
  Activity,
  UserCircle,
  Users,
} from 'lucide-react';
import { useUserStore } from '@/store/use-user-store';
import { useAuthStore } from '@/store/use-auth-store';
import { ConfirmModal } from '@/components/common/confirm-modal';
import { motion } from 'framer-motion';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onResetPassword: (user: User) => void;
}

/* ═══════════ Role helpers ═══════════ */
const getRoleInfo = (role: string) => {
  switch (role) {
    case 'admin':
      return {
        label: 'مدير نظام',
        variant: 'destructive' as const,
        icon: Shield,
        color: 'text-red-500',
        bg: 'bg-red-500/10',
      };
    case 'call_center':
      return {
        label: 'خدمة عملاء',
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

export function UserTable({ users, onEdit, onResetPassword }: UserTableProps) {
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
        <div className="h-16 w-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
          <Activity className="h-8 w-8 animate-pulse" />
        </div>
        <p className="text-[var(--muted-foreground)] font-bold mt-6 text-center">جاري مزامنة بيانات الكادر الوظيفي...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 lg:p-32 bg-[var(--secondary)] border border-[var(--border)] rounded-2xl lg:rounded-[2rem] shadow-sm">
        <div className="h-16 w-16 rounded-2xl bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] mb-6">
          <UserCircle className="h-10 w-10" />
        </div>
        <p className="text-[var(--foreground)] font-black text-xl mb-2 text-center">لا توجد نتائج بحث</p>
        <p className="text-[var(--muted-foreground)] font-bold text-center">لم يتم العثور على أي موظف يطابق المعايير المحددة</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[var(--secondary)] border border-[var(--border)] rounded-2xl lg:rounded-3xl shadow-sm overflow-hidden">
      <div className="flex-1 overflow-auto blue-scrollbar">
        <table className="w-full border-separate border-spacing-0 text-right" dir="rtl">
          <thead className="sticky top-0 z-30 bg-[var(--secondary)] shadow-sm">
            <tr className="bg-[var(--muted)]/50">
              <th className="sticky top-0 z-30 px-6 py-4 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider border-b border-[var(--border)] bg-[var(--muted)]">
                الموظف
              </th>
              <th className="sticky top-0 z-30 px-6 py-4 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider border-b border-[var(--border)] bg-[var(--muted)]">
                اسم المستخدم
              </th>
              <th className="sticky top-0 z-30 px-6 py-4 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider border-b border-[var(--border)] bg-[var(--muted)]">
                الدور الوظيفي
              </th>
              <th className="sticky top-0 z-30 px-6 py-4 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider text-center border-b border-[var(--border)] bg-[var(--muted)]">
                الحالة
              </th>
              <th className="sticky top-0 z-30 px-6 py-4 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider text-left border-b border-[var(--border)] bg-[var(--muted)]">
                العمليات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] bg-[var(--secondary)]">
            {users.map((user) => {
              const roleInfo = getRoleInfo(user.role);
              const isSelf = user.id === currentUser?.id;

              return (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`group hover:bg-[var(--muted)]/30 transition-colors ${isSelf ? 'bg-[var(--primary)]/5' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap border-b border-[var(--border)]">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl ${roleInfo.bg} flex items-center justify-center font-black text-sm ${roleInfo.color} shrink-0`}>
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-[var(--foreground)] flex items-center gap-2">
                          {user.name}
                          {isSelf && (
                            <span className="px-1.5 py-0.5 rounded-full bg-[var(--primary)] text-white text-[9px] font-black uppercase">
                              أنت
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] font-bold text-[var(--muted-foreground)]">ID: {user.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-[var(--border)]">
                    <span className="text-sm font-bold text-[var(--muted-foreground)]">@{user.username}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-[var(--border)]">
                    <Badge variant={roleInfo.variant} className="shadow-sm">
                      {roleInfo.label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center border-b border-[var(--border)]">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        نشط
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-[10px] font-black">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        معطل
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left border-b border-[var(--border)]">
                    {!isSelf && (
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                            onClick={() => {
                              setUserToDeactivate(user.id);
                              setIsConfirmOpen(true);
                            }}
                            className="h-8 w-8 rounded-lg transition-colors hover:text-red-500 hover:bg-red-50 cursor-pointer"
                            title="تعطيل"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateStatus(user.id, true)}
                            className="h-8 w-8 rounded-lg transition-colors hover:text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                            title="تنشيط"
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
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
