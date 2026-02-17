'use client';

import { create } from 'zustand';
import { 
  KitchenOrder, 
  KitchenSummaryResponse, 
  KitchenPeriod,
  UpdateKitchenStatusRequest
} from '@/dto/kitchen.dto';
import { kitchenService } from '@/services/kitchen-service';
import { toast } from 'sonner';

interface KitchenState {
  orders: KitchenOrder[];
  summary: KitchenSummaryResponse | null;
  periods: KitchenPeriod[];
  isLoading: boolean;
  isUpdating: boolean;
  filters: {
    eidDayId?: number;
    periodId?: number;
  };

  // Actions
  setFilters: (filters: { eidDayId?: number; periodId?: number }) => void;
  fetchOrders: () => Promise<void>;
  fetchSummary: () => Promise<void>;
  fetchPeriods: () => Promise<void>;
  updateOrderStatus: (orderId: number, status: UpdateKitchenStatusRequest['status']) => Promise<boolean>;
  refreshAll: () => Promise<void>;
}

export const useKitchenStore = create<KitchenState>((set, get) => ({
  orders: [],
  summary: null,
  periods: [],
  isLoading: false,
  isUpdating: false,
  filters: {},

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    get().refreshAll();
  },

  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const { eidDayId, periodId } = get().filters;
      const response = await kitchenService.getTodayOrders(eidDayId, periodId);
      if (response.success && response.data) {
        set({ orders: response.data });
      }
    } catch (error: any) {
      toast.error('خطأ في جلب طلبات المطبخ');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSummary: async () => {
    try {
      const { eidDayId, periodId } = get().filters;
      const response = await kitchenService.getSummary(eidDayId, periodId);
      if (response.success && response.data) {
        set({ summary: response.data });
      }
    } catch (error) {
      console.error('Failed to fetch kitchen summary:', error);
    }
  },

  fetchPeriods: async () => {
    try {
      const { eidDayId } = get().filters;
      const response = await kitchenService.getPeriods(eidDayId);
      if (response.success && response.data) {
        set({ periods: response.data });
      }
    } catch (error) {
      console.error('Failed to fetch kitchen periods:', error);
    }
  },

  updateOrderStatus: async (orderId, status) => {
    set({ isUpdating: true });
    try {
      const response = await kitchenService.updateStatus(orderId, status);
      if (response.success) {
        toast.success(response.message || `تم تحديث حالة الطلب إلى ${status}`);
        // Optimistic local update
        set((state) => ({
          orders: state.orders.map((o) => 
            o.orderId === orderId ? { ...o, status } : o
          )
        }));
        // Refresh summary as stats might change
        get().fetchSummary();
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'فشل تحديث الحالة');
      return false;
    } finally {
      set({ isUpdating: false });
    }
  },

  refreshAll: async () => {
    await Promise.all([
      get().fetchOrders(),
      get().fetchSummary(),
      get().fetchPeriods()
    ]);
  }
}));
