import { create } from 'zustand';
import { Area, CreateAreaRequest, UpdateAreaRequest } from '@/dto/area.dto';
import { areaService } from '@/services/area-service';
import { toast } from 'sonner';

interface AreaState {
  areas: Area[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAreas: () => Promise<void>;
  createArea: (data: CreateAreaRequest) => Promise<void>;
  updateArea: (id: number, data: UpdateAreaRequest) => Promise<void>;
  deleteArea: (id: number) => Promise<void>;
}

export const useAreaStore = create<AreaState>((set, get) => ({
  areas: [],
  isLoading: false,
  error: null,

  fetchAreas: async () => {
    set({ isLoading: true, error: null });
    try {
      const areas = await areaService.getAllAreas();
      set({ areas, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('خطأ في تحميل الأحياء', {
        description: error.message
      });
    }
  },

  createArea: async (data: CreateAreaRequest) => {
    set({ isLoading: true });
    try {
      const newArea = await areaService.createArea(data);
      set((state) => ({
        areas: [...state.areas, newArea].sort((a, b) => a.sortOrder - b.sortOrder),
        isLoading: false
      }));
      toast.success('تمت إضافة الحي بنجاح');
    } catch (error: any) {
      set({ isLoading: false });
      toast.error('فشل إضافة الحي', {
        description: error.message
      });
      throw error;
    }
  },

  updateArea: async (id: number, data: UpdateAreaRequest) => {
    set({ isLoading: true });
    try {
      const updatedArea = await areaService.updateArea(id, data);
      set((state) => ({
        areas: state.areas.map((a) => (a.id === id ? updatedArea : a)).sort((a, b) => a.sortOrder - b.sortOrder),
        isLoading: false
      }));
      toast.success('تم تحديث الحي بنجاح');
    } catch (error: any) {
      set({ isLoading: false });
      toast.error('فشل تحديث الحي', {
        description: error.message
      });
      throw error;
    }
  },

  deleteArea: async (id: number) => {
    set({ isLoading: true });
    try {
      await areaService.deleteArea(id);
      set((state) => ({
        areas: state.areas.map((a) => (a.id === id ? { ...a, isActive: false } : a)),
        isLoading: false
      }));
      toast.success('تم حذف الحي بنجاح');
    } catch (error: any) {
      set({ isLoading: false });
      toast.error('فشل حذف الحي', {
        description: error.message
      });
      throw error;
    }
  },
}));
