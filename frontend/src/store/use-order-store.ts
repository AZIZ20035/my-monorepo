'use client';

import { create } from 'zustand';
import { 
  OrderListResponse, 
  OrderResponse, 
  OrderFilterRequest, 
  PaginatedResponse,
  CreateOrderRequest,
  UpdateOrderRequest,
  AddPaymentRequest
} from '@/dto/order.dto';
import { orderService } from '@/services/order-service';
import { toast } from 'sonner';

interface OrderState {
  orders: OrderListResponse[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  isLoading: boolean;
  activeOrder: OrderResponse | null;
  filters: OrderFilterRequest;
  stats: {
    total: number;
    preparing: number;
    ready: number;
    delivered: number;
  };
  
  // Actions
  fetchOrders: (filter?: OrderFilterRequest) => Promise<void>;
  fetchStats: () => Promise<void>;
  setFilters: (filters: OrderFilterRequest) => void;
  fetchOrderById: (id: number) => Promise<void>;
  fetchOrderByNumber: (orderNumber: string) => Promise<void>;
  createOrder: (payload: CreateOrderRequest) => Promise<OrderResponse | null | false>;
  updateOrder: (id: number, payload: UpdateOrderRequest) => Promise<boolean>;
  updateOrderStatus: (id: number, status: string) => Promise<boolean>;
  cancelOrder: (id: number) => Promise<boolean>;
  addOrderPayment: (id: number, payload: AddPaymentRequest) => Promise<boolean>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  totalCount: 0,
  page: 1,
  pageSize: 20,
  totalPages: 0,
  isLoading: false,
  activeOrder: null,
  filters: {
    page: 1,
    pageSize: 20
  },
  stats: {
    total: 0,
    preparing: 0,
    ready: 0,
    delivered: 0
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 } // Reset to page 1 on filter change
    }));
    get().fetchOrders();
  },

  fetchStats: async () => {
    try {
      const response = await orderService.getToday();
      if (response.success && response.data) {
        const todayOrders = response.data;
        set({
          stats: {
            total: todayOrders.length,
            preparing: todayOrders.filter(o => o.status === 'preparing').length,
            ready: todayOrders.filter(o => o.status === 'ready').length,
            delivered: todayOrders.filter(o => o.status === 'delivered').length,
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  },

  fetchOrders: async (filterOverride) => {
    set({ isLoading: true });
    try {
      const currentFilters = get().filters;
      const finalFilter = filterOverride ? { ...currentFilters, ...filterOverride } : currentFilters;
      const response = await orderService.getOrders(finalFilter);
      if (response.success && response.data) {
        set({ 
          orders: response.data.items,
          totalCount: response.data.totalCount,
          page: response.data.page,
          pageSize: response.data.pageSize,
          totalPages: response.data.totalPages,
          filters: finalFilter
        });
        // Also fetch stats to keep them in sync
        get().fetchStats();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء جلب الطلبات');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOrderById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await orderService.getOrder(id);
      if (response.success && response.data) {
        set({ activeOrder: response.data });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'الطلب غير موجود');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOrderByNumber: async (orderNumber) => {
    set({ isLoading: true });
    try {
      const response = await orderService.getOrderByNumber(orderNumber);
      if (response.success && response.data) {
        set({ activeOrder: response.data });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'الطلب غير موجود');
    } finally {
      set({ isLoading: false });
    }
  },

  createOrder: async (payload) => {
    set({ isLoading: true });
    try {
      const response = await orderService.createOrder(payload);
      if (response.success) {
        toast.success(response.message || 'تم إنشاء الطلب بنجاح');
        get().fetchOrders();
        return response.data;
      }
      return null;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'فشل إنشاء الطلب');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updateOrder: async (id, payload) => {
    set({ isLoading: true });
    try {
      const response = await orderService.updateOrder(id, payload);
      if (response.success) {
        toast.success(response.message || 'تم تحديث الطلب بنجاح');
        if (get().activeOrder?.orderId === id) {
          get().fetchOrderById(id);
        }
        get().fetchOrders();
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'فشل تحديث الطلب');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ isLoading: true });
    try {
      const response = await orderService.updateOrderStatus(id, status);
      if (response.success) {
        toast.success(response.message || 'تم تحديث حالة الطلب');
        if (get().activeOrder?.orderId === id) {
          get().fetchOrderById(id);
        }
        get().fetchOrders();
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'فشل تحديث الحالة');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  cancelOrder: async (id) => {
    set({ isLoading: true });
    try {
      const response = await orderService.cancelOrder(id);
      if (response.success) {
        toast.success(response.message || 'تم إلغاء الطلب');
        if (get().activeOrder?.orderId === id) {
          get().fetchOrderById(id);
        }
        get().fetchOrders();
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'فشل إلغاء الطلب');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  addOrderPayment: async (id, payload) => {
    set({ isLoading: true });
    try {
      const response = await orderService.addOrderPayment(id, payload);
      if (response.success) {
        toast.success(response.message || 'تم إضافة الدفعة بنجاح');
        if (get().activeOrder?.orderId === id) {
          get().fetchOrderById(id);
        }
        get().fetchOrders();
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'فشل إضافة الدفعة');
      return false;
    } finally {
      set({ isLoading: false });
    }
  }
}));
