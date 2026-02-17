'use client';

import { ActivityLogResponse } from '@/dto/activity-log.dto';
import { Button } from '@/components/ui/button';
import {
  Activity,
  User,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Layers,
  Fingerprint
} from 'lucide-react';
import { motion } from 'framer-motion';
// Removing date-fns for native Intl

interface ActivityLogsTableProps {
  logs: ActivityLogResponse[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
}

const getActionStyles = (action: string) => {
  const a = action.toLowerCase();
  if (a.includes('create')) return { color: 'text-emerald-600', bg: 'bg-emerald-500/10', label: 'إنشاء' };
  if (a.includes('update')) return { color: 'text-sky-600', bg: 'bg-sky-500/10', label: 'تحديث' };
  if (a.includes('delete')) return { color: 'text-red-600', bg: 'bg-red-500/10', label: 'حذف' };
  if (a.includes('cancel')) return { color: 'text-amber-600', bg: 'bg-amber-500/10', label: 'إلغاء' };
  return { color: 'text-[var(--muted-foreground)]', bg: 'bg-[var(--muted)]', label: action };
};

const getEntityLabel = (type: string) => {
  const labels: Record<string, string> = {
    'orders': 'الطلبات',
    'customers': 'العملاء',
    'users': 'الموظفين',
    'products': 'المنتجات',
    'categories': 'الأقسام',
    'areas': 'المناطق',
    'eidDays': 'أيام العيد',
    'eidDayPeriods': 'الفترات',
    'payments': 'المدفوعات',
    'whatsapplogs': 'رسائل واتساب'
  };
  return labels[type] || type;
};

export function ActivityLogsTable({
  logs,
  isLoading,
  page,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange
}: ActivityLogsTableProps) {
  if (isLoading && logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 lg:p-32 bg-[var(--secondary)] border border-[var(--border)] rounded-2xl lg:rounded-[2rem] shadow-sm">
        <div className="h-16 w-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
          <Activity className="h-8 w-8 animate-pulse" />
        </div>
        <p className="text-[var(--muted-foreground)] font-bold mt-6 text-center">جاري تحميل سجل النشاطات...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 lg:p-32 bg-[var(--secondary)] border border-[var(--border)] rounded-2xl lg:rounded-[2rem] shadow-sm">
        <div className="h-16 w-16 rounded-2xl bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] mb-6">
          <Clock className="h-10 w-10" />
        </div>
        <p className="text-[var(--foreground)] font-black text-xl mb-2 text-center">لا توجد سجلات</p>
        <p className="text-[var(--muted-foreground)] font-bold text-center">لم يتم تسجيل أي عمليات تطابق المعايير المحددة</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex-1 overflow-hidden bg-[var(--secondary)] border border-[var(--border)] rounded-2xl lg:rounded-3xl shadow-sm flex flex-col">
        <div className="flex-1 overflow-auto blue-scrollbar">
          <table className="w-full border-separate border-spacing-0 text-right" dir="rtl">
            <thead className="sticky top-0 z-30 bg-[var(--secondary)] shadow-sm">
              <tr className="bg-[var(--muted)]/50">
                <th className="sticky top-0 px-6 py-4 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider border-b border-[var(--border)] bg-[var(--muted)]">
                  التاريخ والوقت
                </th>
                <th className="sticky top-0 px-6 py-4 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider border-b border-[var(--border)] bg-[var(--muted)]">
                  الموظف
                </th>
                <th className="sticky top-0 px-6 py-4 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider border-b border-[var(--border)] bg-[var(--muted)]">
                  العملية
                </th>
                <th className="sticky top-0 px-6 py-4 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider border-b border-[var(--border)] bg-[var(--muted)]">
                  نوع الكيان
                </th>
                <th className="sticky top-0 px-6 py-4 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider border-b border-[var(--border)] bg-[var(--muted)]">
                  رقم المعرف (ID)
                </th>
                <th className="sticky top-0 px-6 py-4 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider border-b border-[var(--border)] bg-[var(--muted)]">
                  عنوان IP
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] bg-[var(--secondary)]">
              {logs.map((log) => {
                const actionStyle = getActionStyles(log.action);
                return (
                  <motion.tr
                    key={log.logId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-[var(--muted)]/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap border-b border-[var(--border)]">
                       <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                        <span className="text-sm font-bold text-[var(--foreground)]">
                          {new Intl.DateTimeFormat('ar-EG', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          }).format(new Date(log.createdAt))}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-b border-[var(--border)]">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-black text-xs shrink-0">
                          {log.userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-black text-[var(--foreground)]">{log.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-b border-[var(--border)]">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg ${actionStyle.bg} ${actionStyle.color} text-[10px] font-black`}>
                        {actionStyle.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-b border-[var(--border)]">
                      <div className="flex items-center gap-2">
                        <Layers className="h-3.5 w-3.5 text-[var(--primary)]/50" />
                        <span className="text-sm font-bold text-[var(--muted-foreground)]">{getEntityLabel(log.entityType)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-b border-[var(--border)]">
                      <span className="inline-flex items-center gap-1 text-sm font-mono font-bold text-[var(--foreground)]">
                         #{log.entityId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-b border-[var(--border)]">
                      <div className="flex items-center gap-2">
                        <Fingerprint className="h-3.5 w-3.5 text-[var(--muted-foreground)]/50" />
                        <span className="text-xs font-mono font-bold text-[var(--muted-foreground)]">{log.ipAddress}</span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-[var(--secondary)] border border-[var(--border)] p-4 rounded-xl shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrevious || isLoading}
            className="rounded-lg h-9 font-bold gap-2 cursor-pointer border-2 hover:bg-[var(--primary)] hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
            السابق
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNext || isLoading}
            className="rounded-lg h-9 font-bold gap-2 cursor-pointer border-2 hover:bg-[var(--primary)] hover:text-white"
          >
            التالي
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-[var(--muted-foreground)]">
            صفحة <span className="text-[var(--primary)]">{page}</span> من {totalPages}
          </span>
        </div>
      </div>
    </div>
  );
}
