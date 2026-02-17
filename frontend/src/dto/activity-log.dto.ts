export interface ActivityLogResponse {
  logId: number;
  userId: number;
  userName: string;
  action: string;
  entityType: string;
  entityId: number;
  ipAddress: string;
  createdAt: string;
}

export interface ActivityLogFilterRequest {
  page?: number;
  pageSize?: number;
  entityType?: string;
  userId?: number;
  startDate?: string;
  endDate?: string;
}
