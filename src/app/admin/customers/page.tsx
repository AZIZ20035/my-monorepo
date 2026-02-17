'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCustomerStore } from '@/store/use-customer-store';
import { CustomerTable } from './components/CustomerTable';
import { CustomerCards } from './components/CustomerCards';
import { CustomerModal } from './components/CustomerModal';
import { CustomerDetailsDrawer } from './components/CustomerDetailsDrawer';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Package,
  Filter,
  X,
  LayoutGrid,
  ScrollText,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { Customer } from '@/dto/customer.dto';
import { motion, AnimatePresence } from 'framer-motion';

type StatusFilter = 'all' | 'active' | 'inactive';
type TypeFilter = 'all' | 'new' | 'loyal';

function CustomerListContent() {
  const { fetchCustomers, customers, isLoading } = useCustomerStore();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Handle auto-opening drawer if ID is in URL
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const customerId = parseInt(id);
      if (!isNaN(customerId)) {
        setSelectedCustomerId(customerId);
        setIsDrawerOpen(true);
      }
    }
  }, [searchParams]);

  // Stats
  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.isActive).length;
    const newCustomers = customers.filter((c) => c.isNewCustomer).length;
    const totalOrders = customers.reduce((acc, c) => acc + c.orderCount, 0);
    return { total, active, newCustomers, totalOrders };
  }, [customers]);

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        !searchQuery ||
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery);
      
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? customer.isActive : !customer.isActive);
      
      const matchesType = 
        typeFilter === 'all' ||
        (typeFilter === 'new' ? customer.isNewCustomer : !customer.isNewCustomer);

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [customers, searchQuery, statusFilter, typeFilter]);

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomerId(customer.customerId);
    setIsDrawerOpen(true);
  };

  const handleAddAddress = (customer: Customer) => {
    setSelectedCustomerId(customer.customerId);
    setIsDrawerOpen(true);
    // Ideally, we could open the address modal directly, but opening the drawer first is okay too
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const hasActiveFilters = statusFilter !== 'all' || typeFilter !== 'all' || searchQuery !== '';

  const clearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setSearchQuery('');
  };

  const statCards = [
    {
      label: 'إجمالي العملاء',
      value: stats.total,
      icon: Users,
      iconColor: 'text-[var(--primary)]',
      iconBg: 'bg-[var(--primary)]/10',
    },
    {
      label: 'عملاء جدد',
      value: stats.newCustomers,
      icon: UserPlus,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-500/10',
    },
    {
      label: 'نشط حالياً',
      value: stats.active,
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-500/10',
    },
    {
      label: 'إجمالي الطلبات',
      value: stats.totalOrders,
      icon: Package,
      iconColor: 'text-sky-500',
      iconBg: 'bg-sky-500/10',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto flex-1 w-full flex flex-col space-y-6 lg:space-y-8 pb-4 overflow-hidden">
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
              إدارة العملاء
            </h1>
            <p className="text-[var(--muted-foreground)] font-bold text-xs sm:text-sm lg:text-base">
              تتبع بيانات العملاء، عناوينهم، وتاريخ طلباتهم
            </p>
          </div>
        </div>

        <Button
          onClick={handleCreate}
          className="h-11 lg:h-12 px-5 lg:px-6 rounded-xl bg-gradient-to-l from-[#0784b5] to-[#39ace7] text-white font-black shadow-lg shadow-[#39ace7]/20 hover:shadow-[#39ace7]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm lg:text-base w-full sm:w-auto border-none"
        >
          <Plus className="h-5 w-5 ml-2" />
          إضافة عميل جديد
        </Button>
      </motion.div>

      {/* ═══════════ STATS GRID ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 shrink-0"
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
              <p className="text-[11px] lg:text-xs font-bold text-[var(--muted-foreground)] mt-1 uppercase tracking-wider">
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
              placeholder="بحث بالاسم أو رقم الجوال..."
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
              تصفية
              {hasActiveFilters && (
                <span className="h-5 w-5 rounded-full bg-[var(--primary)] text-white text-[10px] font-black flex items-center justify-center">
                  {(statusFilter !== 'all' ? 1 : 0) + (typeFilter !== 'all' ? 1 : 0)}
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
                {/* Status filter */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider">
                    حالة العميل
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'all' as StatusFilter, label: 'الكل' },
                      { value: 'active' as StatusFilter, label: 'نشط' },
                      { value: 'inactive' as StatusFilter, label: 'معطل' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setStatusFilter(opt.value)}
                        className={`h-9 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
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

                {/* Type filter */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider">
                    نوع العميل
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'all' as TypeFilter, label: 'الكل' },
                      { value: 'new' as TypeFilter, label: 'عملاء جدد' },
                      { value: 'loyal' as TypeFilter, label: 'عملاء قدامى' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setTypeFilter(opt.value)}
                        className={`h-9 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          typeFilter === opt.value
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
      </motion.div>

      {/* ═══════════ CONTENT AREA ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex-1 min-h-0 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isLoading && filteredCustomers.length === 0 ? (
            <motion.div 
               key="loading"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="h-full flex flex-col items-center justify-center gap-4 bg-[var(--secondary)] rounded-2xl lg:rounded-[2rem] border border-[var(--border)]"
            >
               <div className="h-12 w-12 border-4 border-[var(--primary)]/20 border-t-[var(--primary)] rounded-full animate-spin" />
               <p className="text-sm font-black text-[var(--muted-foreground)]">جاري تحميل بيانات العملاء...</p>
            </motion.div>
          ) : viewMode === 'table' ? (
            <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
               <CustomerTable
                  customers={filteredCustomers}
                  onEdit={handleEdit}
                  onView={handleViewDetails}
                  onAddAddress={handleAddAddress}
               />
            </motion.div>
          ) : (
            <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
               <CustomerCards
                  customers={filteredCustomers}
                  onEdit={handleEdit}
                  onView={handleViewDetails}
                  onAddAddress={handleAddAddress}
               />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══════════ MODALS & DRAWERS ═══════════ */}
      <CustomerModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        customer={selectedCustomer} 
      />
      
      <CustomerDetailsDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        customerId={selectedCustomerId} 
      />
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center font-black text-[var(--muted-foreground)]">جاري التحميل...</div>}>
      <CustomerListContent />
    </Suspense>
  );
}
