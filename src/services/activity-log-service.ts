import api from '@/lib/api-client';
import { ApiResponse } from '@/dto/api-response.dto';
import { ActivityLogResponse, ActivityLogFilterRequest } from '@/dto/activity-log.dto';
import { PaginatedResponse } from '@/dto/order.dto';

export const activityLogService = {
  async getLogs(filter?: ActivityLogFilterRequest) {
    const response = await api.get<ApiResponse<PaginatedResponse<ActivityLogResponse>>>('/ActivityLogs', {
      params: filter
    });
    return response.data;
  },

  async getLogsByEntity(entityType: string, entityId: number) {
    const response = await api.get<ApiResponse<ActivityLogResponse[]>>(`/ActivityLogs/entity/${entityType}/${entityId}`);
    return response.data;
  },

  async getLogsByUser(userId: number) {
    const response = await api.get<ApiResponse<ActivityLogResponse[]>>(`/ActivityLogs/user/${userId}`);
    return response.data;
  }
};
