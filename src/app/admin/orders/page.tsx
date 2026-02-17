'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrderStore } from '@/store/use-order-store';
import { OrdersTable } from '@/components/orders/orders-table';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Filter,
  RefreshCw,
  Calendar,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

export default function OrdersListPage() {
  const router = useRouter();
  const { 
    orders, 
    totalCount, 
    totalPages, 
    page, 
    isLoading, 
    fetchOrders, 
    setFilters,
    filters,
    stats
  } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleSearch = (term: string) => {
    // Search is handled via filters in the store if implemented, 
    // or we can add a search filter to OrderFilterRequest
    setFilters({ ...filters, date: term }); // Simplified for now as placeholder
  };

  return (
    <div className="h-full flex flex-col gap-6 p-4 lg:p-8">
      {/* Header Section ... (unchanged) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-black text-[var(--foreground)] flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
              <ShoppingBag size={24} />
            </div>
            إدارة الطلبات
          </h1>
          <p className="text-[var(--muted-foreground)] font-bold text-sm lg:text-base mr-13">
            متابعة وإدارة جميع طلبات العملاء وحالات التجهيز والتوصيل
          </p>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <Button 
            onClick={() => fetchOrders()}
            variant="ghost" 
            size="icon"
            disabled={isLoading}
            className="h-11 w-11 rounded-xl bg-[var(--muted)]/50 text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            onClick={() => router.push('/admin/orders/new')}
            className="h-11 px-6 rounded-xl bg-gradient-to-tr from-[#0784b5] to-[#39ace7] text-white font-black shadow-lg shadow-[#0784b5]/20 hover:scale-[1.02] transition-transform flex items-center gap-2"
          >
            <Plus size={18} />
            إنشاء طلب جديد
          </Button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي الطلبات', value: stats.total, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'قيد التجهيز', value: stats.preparing, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'بانتظار الاستلام', value: stats.ready, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'تم التوصيل', value: stats.delivered, icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-[var(--secondary)] p-4 rounded-2xl border border-[var(--border)] flex items-center gap-4">
            <div className={`h-12 w-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--muted-foreground)]">{stat.label}</p>
              <p className="text-xl font-black text-[var(--foreground)]">{isLoading && stat.value === 0 ? '...' : stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Section */}
      <div className="flex-1 min-h-0">
        <OrdersTable 
          orders={orders}
          loading={isLoading}
          totalCount={totalCount}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onView={(order) => router.push(`/admin/orders/${order.orderId}`)}
          onEdit={(order) => router.push(`/admin/orders/${order.orderId}/edit`)}
          onCancel={() => {}} // Handle cancel logic if needed
        />
      </div>
    </div>
  );
}
