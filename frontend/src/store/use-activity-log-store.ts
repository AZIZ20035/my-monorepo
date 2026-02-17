import { create } from 'zustand';
import { ActivityLogResponse, ActivityLogFilterRequest } from '@/dto/activity-log.dto';
import { activityLogService } from '@/services/activity-log-service';
import { toast } from 'sonner';

interface ActivityLogState {
  logs: ActivityLogResponse[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isLoading: boolean;
  error: string | null;
  filters: ActivityLogFilterRequest;

  fetchLogs: (page?: number) => Promise<void>;
  setFilters: (filters: ActivityLogFilterRequest) => void;
  resetFilters: () => void;
}

export const useActivityLogStore = create<ActivityLogState>((set, get) => ({
  logs: [],
  totalCount: 0,
  page: 1,
  pageSize: 20,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false,
  isLoading: false,
  error: null,
  filters: {
    page: 1,
    pageSize: 20,
  },

  fetchLogs: async (page) => {
    const { filters } = get();
    const currentPage = page || filters.page || 1;
    
    set({ isLoading: true, error: null });
    try {
      const response = await activityLogService.getLogs({
        ...filters,
        page: currentPage,
      });

      if (response?.data) {
        set({
          logs: response.data.items,
          totalCount: response.data.totalCount,
          page: response.data.page,
          pageSize: response.data.pageSize,
          totalPages: response.data.totalPages,
          hasNext: response.data.hasNext,
          hasPrevious: response.data.hasPrevious,
          isLoading: false,
        });
      } else {
         set({ isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('خطأ في تحميل سجل النشاطات', {
        description: error.message,
      });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 }, // Reset to page 1 on filter change
    }));
    get().fetchLogs(1);
  },

  resetFilters: () => {
    set({
      filters: {
        page: 1,
        pageSize: 20,
      },
    });
    get().fetchLogs(1);
  },
}));
