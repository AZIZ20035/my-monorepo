import api from '@/lib/api-client';
import { ApiResponse } from '@/dto/api-response.dto';
import { 
  EidDayResponse, 
  CreateEidDayRequest, 
  UpdateEidDayRequest 
} from '@/dto/eid-day.dto';
import { EidDayPeriodResponse } from '@/dto/period.dto';

export const eidDayService = {
  // GET /api/EidDays
  getEidDays: async (): Promise<EidDayResponse[]> => {
    const { data } = await api.get<ApiResponse<EidDayResponse[]>>('/EidDays');
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل تحميل أيام العيد');
    }
    return data.data;
  },

  // GET /api/EidDays/{id}
  getEidDay: async (id: number): Promise<EidDayResponse> => {
    const { data } = await api.get<ApiResponse<EidDayResponse>>(`/EidDays/${id}`);
    if (!data.success || !data.data) {
      throw new Error(data.message || 'اليوم غير موجود');
    }
    return data.data;
  },

  // POST /api/EidDays
  createEidDay: async (payload: CreateEidDayRequest): Promise<EidDayResponse> => {
    const { data } = await api.post<ApiResponse<EidDayResponse>>('/EidDays', payload);
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل إنشاء يوم العيد');
    }
    return data.data;
  },

  // PUT /api/EidDays/{id}
  updateEidDay: async (id: number, payload: UpdateEidDayRequest): Promise<EidDayResponse> => {
    const { data } = await api.put<ApiResponse<EidDayResponse>>(`/EidDays/${id}`, payload);
    if (!data.success || !data.data) {
      throw new Error(data.message || 'اليوم غير موجود');
    }
    return data.data;
  },

  // DELETE /api/EidDays/{id} (Soft delete)
  deleteEidDay: async (id: number): Promise<void> => {
    const { data } = await api.delete<ApiResponse<object>>(`/EidDays/${id}`);
    if (!data.success) {
      throw new Error(data.message || 'اليوم غير موجود');
    }
  },

  // POST /api/periods/{eidDayId}/assign/{dayPeriodCategoryId}
  assignPeriodToDay: async (eidDayId: number, dayPeriodCategoryId: number, capacity?: number): Promise<EidDayPeriodResponse> => {
    const q = capacity ? `?capacity=${capacity}` : '';
    const { data } = await api.post<ApiResponse<EidDayPeriodResponse>>(`/periods/${eidDayId}/assign/${dayPeriodCategoryId}${q}`);
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل تعيين الفترة لليوم');
    }
    return data.data;
  }
};
