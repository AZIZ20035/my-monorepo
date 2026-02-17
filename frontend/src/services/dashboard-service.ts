import api from '@/lib/api-client';
import { DashboardStats, TodayOrder, PeriodAvailability } from '@/dto/dashboard.dto';
import { ApiResponse } from '@/dto/api-response.dto';

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      const { data } = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
      if (data.success && data.data) {
        return data.data;
      }
      throw new Error(data.message || 'فشل تحميل الإحصائيات');
    } catch (error) {
      console.warn('Dashboard Stats API failed, using mock data');
      return {
        totalOrders: 1500,
        todayOrders: 12,
        pendingOrders: 5,
        preparingOrders: 3,
        deliveredOrders: 4,
        totalRevenue: 1250000.50,
        todayRevenue: 8500.00,
        unpaidAmount: 2300.00,
        totalCustomers: 870,
        newCustomersToday: 4
      };
    }
  },

  getPeriodAvailability: async (): Promise<PeriodAvailability[]> => {
    try {
      const { data } = await api.get<ApiResponse<PeriodAvailability[]>>('/dashboard/period-availability');
      if (data.success && data.data) {
        return data.data;
      }
      throw new Error(data.message || 'فشل تحميل توفر الفترات');
    } catch (error) {
      console.error('Period Availability API failed', error);
      return [];
    }
  },
};
