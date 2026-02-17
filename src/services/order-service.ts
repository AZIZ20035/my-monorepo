import api from '@/lib/api-client';
import { ApiResponse } from '@/dto/api-response.dto';
import { 
  OrderResponse, 
  OrderListResponse, 
  PaginatedResponse, 
  CreateOrderRequest, 
  UpdateOrderRequest, 
  AddPaymentRequest,
  PaymentResponse,
  OrderFilterRequest
} from '@/dto/order.dto';

export const orderService = {
  async getOrders(filter?: OrderFilterRequest) {
    const response = await api.get<ApiResponse<PaginatedResponse<OrderListResponse>>>('/Orders', { 
      params: filter 
    });
    return response.data;
  },

  async getToday() {
    const response = await api.get<ApiResponse<OrderListResponse[]>>('/Orders/today');
    return response.data;
  },

  async getByPeriod(periodId: number) {
    const response = await api.get<ApiResponse<OrderListResponse[]>>(`/Orders/by-period/${periodId}`);
    return response.data;
  },

  async getOrder(id: number) {
    const response = await api.get<ApiResponse<OrderResponse>>(`/Orders/${id}`);
    return response.data;
  },

  async getOrderByNumber(orderNumber: string) {
    const response = await api.get<ApiResponse<OrderResponse>>(`/Orders/by-number/${orderNumber}`);
    return response.data;
  },

  async createOrder(payload: CreateOrderRequest) {
    const response = await api.post<ApiResponse<OrderResponse>>('/Orders', payload);
    return response.data;
  },

  async updateOrder(id: number, payload: UpdateOrderRequest) {
    const response = await api.put<ApiResponse<OrderResponse>>(`/Orders/${id}`, payload);
    return response.data;
  },

  async updateOrderStatus(id: number, status: string) {
    const response = await api.patch<ApiResponse<object>>(`/Orders/${id}/status`, { status });
    return response.data;
  },

  async cancelOrder(id: number) {
    const response = await api.post<ApiResponse<object>>(`/Orders/${id}/cancel`);
    return response.data;
  },

  async addOrderPayment(id: number, payload: AddPaymentRequest) {
    const response = await api.post<ApiResponse<PaymentResponse>>(`/Orders/${id}/payments`, payload);
    return response.data;
  }
};
