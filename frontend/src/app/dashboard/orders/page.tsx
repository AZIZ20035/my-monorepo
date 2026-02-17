'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { PeriodAvailability } from '@/components/dashboard/period-availability';
import { OrdersTable } from '@/components/orders/orders-table';
import { dashboardService } from '@/services/dashboard-service';
import { orderService } from '@/services/order-service';
import { DashboardStats as StatsDto, PeriodAvailability as PeriodDto } from '@/dto/dashboard.dto';
import { Order, OrdersListResponse } from '@/dto/order.dto';
import { toast } from 'sonner';

export default function CallCenterDashboard() {
  const router = useRouter();
  
  // State
  const [stats, setStats] = useState<StatsDto | null>(null);
  const [periods, setPeriods] = useState<PeriodDto[]>([]);
  const [ordersData, setOrdersData] = useState<OrdersListResponse | null>(null);
  
  // Loading States
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingPeriods, setLoadingPeriods] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);

  // Fetch Data
  const fetchData = async () => {
    setLoadingStats(true);
    setLoadingPeriods(true);
    setLoadingOrders(true);

    try {
      const [statsData, periodsData, ordersRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getPeriodAvailability(),
        orderService.getOrders({ page, pageSize: 10 })
      ]);

      setStats(statsData);
      setPeriods(periodsData);
      setOrdersData(ordersRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoadingStats(false);
      setLoadingPeriods(false);
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleRefresh = () => {
    fetchData();
    toast.success('تم تحديث البيانات');
  };

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">نظرة عامة على النظام</h1>
          <p className="text-gray-500 text-sm mt-1">إحصائيات مباشرة وحالة العمل الحالية</p>
        </div>
        
        <div className="flex items-center gap-2">
           <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            تحديث
          </Button>
          <Button onClick={() => router.push('/dashboard/orders/create')} className="gap-2 bg-primary hover:bg-primary/90 text-white">
            <Plus className="w-4 h-4" />
            طلب جديد
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} loading={loadingStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Period Availability - 1/3 Width */}
        <div className="lg:col-span-1">
          <PeriodAvailability periods={periods} loading={loadingPeriods} />
        </div>

        {/* Orders Table - 2/3 Width */}
        <div className="lg:col-span-2">
          <OrdersTable 
            orders={ordersData?.items || []}
            loading={loadingOrders}
            totalCount={ordersData?.totalCount || 0}
            currentPage={page}
            totalPages={ordersData?.totalPages || 1}
            onPageChange={setPage}
            onView={(order) => router.push(`/dashboard/orders/${order.orderId}`)}
            onEdit={(order) => router.push(`/dashboard/orders/${order.orderId}/edit`)}
            onCancel={(order) => {
              toast('سيتم تنفيذ إلغاء الطلب قريباً');
            }}
          />
        </div>
      </div>
    </div>
  );
}
