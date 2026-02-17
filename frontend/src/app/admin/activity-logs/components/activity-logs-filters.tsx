'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  X,
  Calendar as CalendarIcon,
  User as UserIcon,
  Tag,
  RotateCcw
} from 'lucide-react';
import { ActivityLogFilterRequest } from '@/dto/activity-log.dto';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/use-user-store';

interface ActivityLogsFiltersProps {
  filters: ActivityLogFilterRequest;
  onFilterChange: (filters: ActivityLogFilterRequest) => void;
  onReset: () => void;
}

const entityTypes = [
  { value: 'orders', label: 'الطلبات' },
  { value: 'customers', label: 'العملاء' },
  { value: 'users', label: 'الموظفين' },
  { value: 'products', label: 'المنتجات' },
  { value: 'categories', label: 'الأقسام' },
  { value: 'areas', label: 'المناطق' },
  { value: 'eidDays', label: 'أيام العيد' },
  { value: 'eidDayPeriods', label: 'الفترات' },
  { value: 'payments', label: 'المدفوعات' },
];

export function ActivityLogsFilters({
  filters,
  onFilterChange,
  onReset
}: ActivityLogsFiltersProps) {
  const { users } = useUserStore();
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = !!(filters.entityType || filters.userId || filters.startDate || filters.endDate);

  return (
    <div className="space-y-3 shrink-0">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Entity Type Selector (Mobile & Quick access) */}
        <div className="flex-1 flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
           <button
            onClick={() => onFilterChange({ ...filters, entityType: undefined })}
            className={`h-11 px-6 rounded-xl text-sm font-black transition-all border-2 shrink-0 ${
              !filters.entityType
                ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-lg shadow-[var(--primary)]/20'
                : 'bg-[var(--secondary)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--primary)]/20'
            }`}
          >
            الكل
          </button>
          {entityTypes.slice(0, 5).map((type) => (
            <button
              key={type.value}
              onClick={() => onFilterChange({ ...filters, entityType: type.value })}
              className={`h-11 px-6 rounded-xl text-sm font-black transition-all border-2 shrink-0 ${
                filters.entityType === type.value
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-lg shadow-[var(--primary)]/20'
                  : 'bg-[var(--secondary)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--primary)]/20'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-11 lg:h-12 px-6 rounded-xl font-black text-sm transition-all border-2 flex items-center justify-center gap-2 ${
              showFilters || hasActiveFilters
                ? 'border-[var(--primary)]/30 bg-[var(--primary)]/5 text-[var(--primary)]'
                : 'border-[var(--border)] bg-[var(--secondary)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/20 shadow-sm'
            }`}
          >
            <Filter className="h-4 w-4" />
            الفلاتر المتقدمة
            {hasActiveFilters && (
              <span className="h-5 w-5 rounded-full bg-[var(--primary)] text-white text-[10px] font-black flex items-center justify-center">
                {[filters.entityType, filters.userId, filters.startDate, filters.endDate].filter(Boolean).length}
              </span>
            )}
          </Button>

          {hasActiveFilters && (
             <Button
              onClick={onReset}
              variant="outline"
              className="h-11 lg:h-12 px-4 rounded-xl border-2 border-red-500/20 text-red-500 hover:bg-red-50 font-black gap-2 transition-all shadow-sm"
              title="إعادة تعيين"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">إعادة تعيين</span>
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[var(--secondary)] border border-[var(--border)] p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* User Filter */}
              <div className="space-y-2">
                <label className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-2">
                   <UserIcon className="h-3 w-3" />
                  الموظف
                </label>
                <select
                  value={filters.userId || ''}
                  onChange={(e) => onFilterChange({ ...filters, userId: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full h-11 rounded-xl border-2 border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] text-sm font-bold focus:border-[var(--primary)] outline-none px-4 transition-all"
                >
                  <option value="">الكل</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-2">
                  <CalendarIcon className="h-3 w-3" />
                  من تاريخ
                </label>
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
                  className="w-full h-11 rounded-xl border-2 border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] text-sm font-bold focus:border-[var(--primary)] outline-none px-4 transition-all"
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-2">
                  <CalendarIcon className="h-3 w-3" />
                  إلى تاريخ
                </label>
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
                  className="w-full h-11 rounded-xl border-2 border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] text-sm font-bold focus:border-[var(--primary)] outline-none px-4 transition-all"
                />
              </div>
              
              {/* Other entity types not in quick access */}
              <div className="space-y-2 md:col-span-3">
                 <label className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-2">
                  <Tag className="h-3 w-3" />
                  نوع الكيان (باقي الأنواع)
                </label>
                <div className="flex flex-wrap gap-2">
                  {entityTypes.slice(5).map((type) => (
                    <button
                      key={type.value}
                      onClick={() => onFilterChange({ ...filters, entityType: type.value })}
                      className={`h-9 px-4 rounded-lg text-xs font-bold transition-all border ${
                        filters.entityType === type.value
                          ? 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30'
                          : 'bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--primary)]/20'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
