import api from '@/lib/api-client';
import { ApiResponse } from '@/dto/api-response.dto';
import { 
  KitchenOrder, 
  KitchenSummaryResponse, 
  KitchenPeriod, 
  KitchenReportResponse,
  UpdateKitchenStatusRequest 
} from '@/dto/kitchen.dto';

export const kitchenService = {
  async getTodayOrders(eidDayId?: number, periodId?: number) {
    const response = await api.get<ApiResponse<KitchenOrder[]>>('/Kitchen/today', {
      params: { eidDayId, periodId }
    });
    return response.data;
  },

  async getSummary(eidDayId?: number, periodId?: number) {
    const response = await api.get<ApiResponse<KitchenSummaryResponse>>('/Kitchen/summary', {
      params: { eidDayId, periodId }
    });
    return response.data;
  },

  async updateStatus(orderId: number, status: UpdateKitchenStatusRequest['status']) {
    const response = await api.patch<ApiResponse<object>>(`/Kitchen/orders/${orderId}/status`, { status });
    return response.data;
  },

  async getPeriods(eidDayId?: number) {
    const response = await api.get<ApiResponse<KitchenPeriod[]>>('/Kitchen/periods-by-day', {
      params: { eidDayId }
    });
    return response.data;
  },

  async getReport(eidDayId?: number, periodId?: number) {
    const response = await api.get<ApiResponse<KitchenReportResponse>>('/Reports/kitchen', {
      params: { eidDayId, periodId }
    });
    return response.data;
  }
};
