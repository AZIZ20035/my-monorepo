import api from '@/lib/api-client';
import { ApiResponse } from '@/dto/api-response.dto';
import { 
  Area, 
  AreaResponse, 
  CreateAreaRequest, 
  UpdateAreaRequest,
  AreaDto 
} from '@/dto/area.dto';

export const areaService = {
  getAllAreas: async (): Promise<Area[]> => {
    const { data } = await api.get<ApiResponse<AreaResponse[]>>('/areas');
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل تحميل الأحياء');
    }

    return data.data.map(AreaDto.fromApi);
  },

  getAreaById: async (id: number): Promise<Area> => {
    const { data } = await api.get<ApiResponse<AreaResponse>>(`/areas/${id}`);
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'الحي غير موجود');
    }

    return AreaDto.fromApi(data.data);
  },

  createArea: async (areaData: CreateAreaRequest): Promise<Area> => {
    const { data } = await api.post<ApiResponse<AreaResponse>>('/areas', areaData);
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل إضافة الحي');
    }

    return AreaDto.fromApi(data.data);
  },

  updateArea: async (id: number, areaData: UpdateAreaRequest): Promise<Area> => {
    const { data } = await api.put<ApiResponse<AreaResponse>>(`/areas/${id}`, areaData);
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل تحديث الحي');
    }

    return AreaDto.fromApi(data.data);
  },

  deleteArea: async (id: number): Promise<void> => {
    const { data } = await api.delete<ApiResponse<null>>(`/areas/${id}`);
    
    if (!data.success) {
      throw new Error(data.message || 'فشل حذف الحي');
    }
  },
};
