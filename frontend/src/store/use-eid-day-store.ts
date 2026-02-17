import { create } from 'zustand';
import { EidDayResponse, CreateEidDayRequest, UpdateEidDayRequest } from '@/dto/eid-day.dto';
import { eidDayService } from '@/services/eid-day-service';
import { toast } from 'sonner';
import { normalizeKeys } from '@/lib/data-normalization';

interface EidDayState {
  eidDays: EidDayResponse[];
  isLoading: boolean;
  error: string | null;

  fetchEidDays: () => Promise<void>;
  createEidDay: (payload: CreateEidDayRequest) => Promise<EidDayResponse>;
  updateEidDay: (id: number, payload: UpdateEidDayRequest) => Promise<EidDayResponse>;
  deleteEidDay: (id: number) => Promise<void>;
  toggleEidDayActive: (id: number) => Promise<void>;
  assignPeriod: (eidDayId: number, dayPeriodCategoryId: number, capacity?: number) => Promise<void>;
}

export const useEidDayStore = create<EidDayState>((set, get) => ({
  eidDays: [],
  isLoading: false,
  error: null,

  fetchEidDays: async () => {
    set({ isLoading: true, error: null });
    try {
      const eidDays = await eidDayService.getEidDays();
      set({ eidDays, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('خطأ في تحميل أيام العيد', {
        description: error.message,
      });
    }
  },

  createEidDay: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const newEidDay = await eidDayService.createEidDay(payload);
      await get().fetchEidDays();
      set({ isLoading: false });
      toast.success('تم إنشاء يوم العيد بنجاح');
      return newEidDay;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل إنشاء يوم العيد', {
        description: error.message,
      });
      throw error;
    }
  },

  updateEidDay: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const updatedEidDay = await eidDayService.updateEidDay(id, payload);
      await get().fetchEidDays();
      set({ isLoading: false });
      toast.success('تم تحديث يوم العيد بنجاح');
      return updatedEidDay;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل تحديث يوم العيد', {
        description: error.message,
      });
      throw error;
    }
  },

  deleteEidDay: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await eidDayService.deleteEidDay(id);
      await get().fetchEidDays();
      set({ isLoading: false });
      toast.success('تم حذف يوم العيد بنجاح');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل حذف يوم العيد', {
        description: error.message,
      });
      throw error;
    }
  },

  toggleEidDayActive: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const eidDay = get().eidDays.find((d) => d.eidDayId === id);
      if (!eidDay) throw new Error('اليوم غير موجود');

      const updatedEidDay = await eidDayService.updateEidDay(id, {
        isActive: !eidDay.isActive,
      });

      set((state) => ({
        eidDays: state.eidDays.map((d) => (d.eidDayId === id ? updatedEidDay : d)),
        isLoading: false,
      }));
      toast.success(updatedEidDay.isActive ? 'تم تفعيل يوم العيد' : 'تم تعطيل يوم العيد');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل تغيير حالة يوم العيد', {
        description: error.message,
      });
      throw error;
    }
  },

  assignPeriod: async (eidDayId, dayPeriodCategoryId, capacity) => {
    set({ isLoading: true, error: null });
    try {
      await eidDayService.assignPeriodToDay(eidDayId, dayPeriodCategoryId, capacity);
      await get().fetchEidDays();
      set({ isLoading: false });
      toast.success('تم تعيين الفترة لليوم بنجاح');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل تعيين الفترة لليوم', {
        description: error.message,
      });
      throw error;
    }
  }
}));
