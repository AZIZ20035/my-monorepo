import api from '@/lib/api-client';
import { ApiResponse } from '@/dto/api-response.dto';
import { 
  ManagementReportResponse, 
  FinancialReportResponse, 
  KitchenReportResponse, 
  DeliveryReportResponse, 
  CustomerInfoReportResponse,
  InvoiceResponse,
  DeliveryInvoiceResponse
} from '@/dto/report.dto';

export const reportService = {
  async getInvoice(orderId: number) {
    const response = await api.get<ApiResponse<InvoiceResponse>>(`/Reports/invoice/${orderId}`);
    return response.data;
  },

  async getKitchenReport(eidDayId?: number, periodId?: number) {
    const response = await api.get<ApiResponse<KitchenReportResponse>>('/Reports/kitchen', {
      params: { eidDayId, periodId }
    });
    return response.data;
  },

  async getManagementReport(startDate?: string, endDate?: string) {
    const response = await api.get<ApiResponse<ManagementReportResponse>>('/Reports/management', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  async getFinancialReport(startDate?: string, endDate?: string) {
    const response = await api.get<ApiResponse<FinancialReportResponse>>('/Reports/financial', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  async getDeliveryReport(eidDayId?: number, periodId?: number) {
    const response = await api.get<ApiResponse<DeliveryReportResponse>>('/Reports/delivery', {
      params: { eidDayId, periodId }
    });
    return response.data;
  },

  async getDeliveryInvoice(orderId: number) {
    const response = await api.get<ApiResponse<DeliveryInvoiceResponse>>(`/Reports/delivery-invoice/${orderId}`);
    return response.data;
  },

  async getCustomersInfoReport(startDate?: string, endDate?: string) {
    const response = await api.get<ApiResponse<CustomerInfoReportResponse>>('/Reports/customers-info', {
      params: { startDate, endDate }
    });
    return response.data;
  }
};
