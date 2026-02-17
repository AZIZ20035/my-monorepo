'use client';

import { useEffect, useState, useMemo } from 'react';
import { useUserStore } from '@/store/use-user-store';
import { UserTable } from './components/UserTable';
import { UserCards } from './components/UserCards';
import { UserModal } from './components/UserModal';
import { ResetPasswordModal } from './components/ResetPasswordModal';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Users,
  Search,
  Shield,
  Headphones,
  ClipboardCheck,
  UserCheck,
  UserX,
  Filter,
  X,
  LayoutGrid,
  ScrollText
} from 'lucide-react';
import { User } from '@/dto/user.dto';
import { motion, AnimatePresence } from 'framer-motion';

type RoleFilter = 'all' | 'admin' | 'call_center' | 'order_reviewer';
type StatusFilter = 'all' | 'active' | 'inactive';

export default function UsersPage() {
  const { fetchUsers, users } = useUserStore();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Stats
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.isActive).length;
    const inactive = total - active;
    const admins = users.filter((u) => u.role === 'admin').length;
    const callCenter = users.filter((u) => u.role === 'call_center').length;
    const reviewers = users.filter((u) => u.role === 'order_reviewer').length;
    return { total, active, inactive, admins, callCenter, reviewers };
  }, [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !searchQuery ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? user.isActive : !user.isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setIsResetModalOpen(true);
  };

  const closeModal = () => {
    setIsUserModalOpen(false);
    setSelectedUser(null);
  };

  const hasActiveFilters = roleFilter !== 'all' || statusFilter !== 'all' || searchQuery !== '';

  const clearFilters = () => {
    setRoleFilter('all');
    setStatusFilter('all');
    setSearchQuery('');
  };

  const statCards = [
    {
      label: 'إجمالي الموظفين',
      value: stats.total,
      icon: Users,
      iconColor: 'text-[var(--primary)]',
      iconBg: 'bg-[var(--primary)]/10',
    },
    {
      label: 'نشط حالياً',
      value: stats.active,
      icon: UserCheck,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-500/10',
    },
    {
      label: 'معطّل',
      value: stats.inactive,
      icon: UserX,
      iconColor: 'text-[var(--muted-foreground)]',
      iconBg: 'bg-[var(--muted)]',
    },
    {
      label: 'مديرين',
      value: stats.admins,
      icon: Shield,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-500/10',
    },
    {
      label: 'خدمة عملاء',
      value: stats.callCenter,
      icon: Headphones,
      iconColor: 'text-sky-500',
      iconBg: 'bg-sky-500/10',
    },
    {
      label: 'محللين',
      value: stats.reviewers,
      icon: ClipboardCheck,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-500/10',
    },
  ];

  const roleOptions: { value: RoleFilter; label: string; icon: typeof Users }[] = [
    { value: 'all', label: 'الكل', icon: Users },
    { value: 'admin', label: 'مدير نظام', icon: Shield },
    { value: 'call_center', label: 'خدمة عملاء', icon: Headphones },
    { value: 'order_reviewer', label: 'محلل بيانات', icon: ClipboardCheck },
  ];

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col space-y-6 lg:space-y-8 pb-4 overflow-hidden">
      {/* ═══════════ HEADER ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 bg-[var(--secondary)] border border-[var(--border)] p-6 lg:p-8 rounded-2xl lg:rounded-[2rem] shadow-sm shrink-0"
      >
        <div className="flex items-center gap-4 lg:gap-5">
          <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shadow-sm border border-[var(--primary)]/20 shrink-0">
            <Users className="h-6 w-6 lg:h-7 lg:w-7" />
          </div>
          <div className="space-y-0.5 lg:space-y-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[var(--foreground)] tracking-tight">
              إدارة الكادر الوظيفي
            </h1>
            <p className="text-[var(--muted-foreground)] font-bold text-xs sm:text-sm lg:text-base">
              تحكم في صلاحيات الموظفين وأمان النظام
            </p>
          </div>
        </div>

        <Button
          onClick={handleCreate}
          className="h-11 lg:h-12 px-5 lg:px-6 rounded-xl bg-gradient-to-l from-[#0784b5] to-[#39ace7] text-white font-black shadow-lg shadow-[#39ace7]/20 hover:shadow-[#39ace7]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm lg:text-base w-full sm:w-auto"
        >
          <Plus className="h-5 w-5 ml-2" />
          إضافة موظف
        </Button>
      </motion.div>

      {/* ═══════════ STATS GRID ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 shrink-0"
      >
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.04 }}
            className="relative bg-[var(--secondary)] border border-[var(--border)] rounded-xl lg:rounded-2xl p-4 lg:p-5 flex flex-col gap-3 group hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div
                className={`h-9 w-9 lg:h-10 lg:w-10 rounded-xl ${stat.iconBg} flex items-center justify-center ${stat.iconColor} transition-transform group-hover:scale-110`}
              >
                <stat.icon className="h-4 w-4 lg:h-5 lg:w-5" />
              </div>
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-black text-[var(--foreground)] leading-none">
                {stat.value}
              </p>
              <p className="text-[11px] lg:text-xs font-bold text-[var(--muted-foreground)] mt-1">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ═══════════ SEARCH & FILTERS ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3 shrink-0"
      >
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالاسم أو اسم المستخدم..."
              className="w-full h-11 lg:h-12 pr-11 pl-4 rounded-xl border-2 border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] text-sm font-bold focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-11 lg:h-12 px-5 rounded-xl font-bold text-sm transition-all cursor-pointer border-2 flex items-center justify-center gap-2 ${
                showFilters || hasActiveFilters
                  ? 'border-[var(--primary)]/30 bg-[var(--primary)]/5 text-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--secondary)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/20'
              }`}
            >
              <Filter className="h-4 w-4" />
              فلتر
              {hasActiveFilters && (
                <span className="h-5 w-5 rounded-full bg-[var(--primary)] text-white text-[10px] font-black flex items-center justify-center">
                  {(roleFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0)}
                </span>
              )}
            </button>

            <div className="h-8 w-px bg-[var(--border)] mx-1 hidden md:block" />

            {/* View Mode Switcher */}
            <div className="flex bg-[var(--muted)] p-1 rounded-xl border border-[var(--border)] shrink-0 shadow-inner">
              <button 
                onClick={() => setViewMode('table')}
                title="عرض الجدول"
                className={`h-9 px-3 rounded-lg transition-all flex items-center gap-2 text-xs font-black ${
                  viewMode === 'table' 
                  ? 'bg-[var(--secondary)] text-[var(--primary)] shadow-sm border border-[var(--border)]' 
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                <ScrollText size={16} />
                <span className="hidden lg:inline">جدول</span>
              </button>
              <button 
                onClick={() => setViewMode('cards')}
                title="عرض البطاقات"
                className={`h-9 px-3 rounded-lg transition-all flex items-center gap-2 text-xs font-black ${
                  viewMode === 'cards' 
                  ? 'bg-[var(--secondary)] text-[var(--primary)] shadow-sm border border-[var(--border)]' 
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                <LayoutGrid size={16} />
                <span className="hidden lg:inline">بطاقات</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Row */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="bg-[var(--secondary)] border border-[var(--border)] rounded-xl lg:rounded-2xl p-4 lg:p-5 mb-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Role filter */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider">
                    الدور الوظيفي
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {roleOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setRoleFilter(opt.value)}
                        className={`h-9 px-4 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                          roleFilter === opt.value
                            ? 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30'
                            : 'bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--primary)]/20'
                        }`}
                      >
                        <opt.icon className="h-3.5 w-3.5" />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status filter */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider">
                    الحالة
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'all' as StatusFilter, label: 'الكل' },
                      { value: 'active' as StatusFilter, label: 'نشط' },
                      { value: 'inactive' as StatusFilter, label: 'معطّل' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setStatusFilter(opt.value)}
                        className={`h-9 px-4 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                          statusFilter === opt.value
                            ? 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30'
                            : 'bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--primary)]/20'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear */}
                {hasActiveFilters && (
                  <div className="pt-2 border-t border-[var(--border)] md:col-span-2">
                    <button
                      onClick={clearFilters}
                      className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      مسح جميع الفلاتر
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filters summary */}
        {hasActiveFilters && !showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 flex-wrap"
          >
            <span className="text-[11px] font-bold text-[var(--muted-foreground)]">الفلاتر النشطة:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-[11px] font-bold border border-[var(--primary)]/20">
                بحث: {searchQuery}
                <button onClick={() => setSearchQuery('')} className="cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {roleFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-[11px] font-bold border border-[var(--primary)]/20">
                {roleOptions.find((r) => r.value === roleFilter)?.label}
                <button onClick={() => setRoleFilter('all')} className="cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-[11px] font-bold border border-[var(--primary)]/20">
                {statusFilter === 'active' ? 'نشط' : 'معطّل'}
                <button onClick={() => setStatusFilter('all')} className="cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-[11px] font-bold text-red-500 hover:text-red-600 cursor-pointer mr-1"
            >
              مسح الكل
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* ═══════════ TABLE / CARDS ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex-1 min-h-0"
      >
        {viewMode === 'table' ? (
          <UserTable
            users={filteredUsers}
            onEdit={handleEdit}
            onResetPassword={handleResetPassword}
          />
        ) : (
          <UserCards
            users={filteredUsers}
            onEdit={handleEdit}
            onResetPassword={handleResetPassword}
          />
        )}
      </motion.div>

      {/* ═══════════ MODALS ═══════════ */}
      <UserModal isOpen={isUserModalOpen} onClose={closeModal} user={selectedUser} />
      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
