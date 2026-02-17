import { create } from 'zustand';
import { periodService } from '@/services/period-service';
import {
  DayPeriodResponse,
  CreateDayPeriodRequest,
  CreateDayPeriodWithCategoriesRequest,
  EidDayPeriodResponse,
  UpdateEidDayPeriodRequest,
  GroupedEidDayPeriodResponse
} from '@/dto/period.dto';
import { toast } from 'sonner';
import { normalizeKeys } from '@/lib/data-normalization';

interface PeriodState {
  // Data
  templates: DayPeriodResponse[];
  assignments: EidDayPeriodResponse[];
  groupedPeriods: GroupedEidDayPeriodResponse[];
  availablePeriods: EidDayPeriodResponse[];
  
  // UI State
  isLoading: boolean;
  error: string | null;

  // Template Actions
  fetchTemplates: () => Promise<void>;
  createTemplate: (request: CreateDayPeriodRequest) => Promise<void>;
  createTemplateWithCategories: (request: CreateDayPeriodWithCategoriesRequest) => Promise<void>;
  addCategoryToTemplate: (periodId: number, categoryId: number) => Promise<void>;
  removeCategoryFromTemplate: (periodId: number, categoryId: number) => Promise<void>;

  // Assignment Actions
  fetchAssignments: (filters?: { eidDayId?: number; categoryId?: number }) => Promise<void>;
  fetchDayGrouped: (eidDayId: number) => Promise<void>;
  fetchAvailable: (categoryId?: number) => Promise<void>;
  assignToDay: (eidDayId: number, dayPeriodCategoryId: number, capacity?: number) => Promise<void>;
  updateAssignment: (eidDayPeriodId: number, request: UpdateEidDayPeriodRequest) => Promise<void>;

  // Utility
  clearError: () => void;
}

export const usePeriodStore = create<PeriodState>((set, get) => ({
  // Initial State
  templates: [],
  assignments: [],
  groupedPeriods: [],
  availablePeriods: [],
  isLoading: false,
  error: null,

  // ============================================================================
  // Template Actions
  // ============================================================================

  fetchTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const rawTemplates = await periodService.getTemplates();
      const templates = normalizeKeys(rawTemplates);
      set({ templates, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل تحميل القوالب', {
        description: error.message,
      });
      throw error;
    }
  },

  createTemplate: async (request) => {
    set({ isLoading: true, error: null });
    try {
      await periodService.createTemplate(request);
      await get().fetchTemplates();
      toast.success('تم إنشاء القالب بنجاح');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل إنشاء القالب', {
        description: error.message,
      });
      throw error;
    }
  },

  createTemplateWithCategories: async (request) => {
    set({ isLoading: true, error: null });
    try {
      await periodService.createTemplateWithCategories(request);
      await get().fetchTemplates();
      toast.success('تم إنشاء القالب مع الأقسام بنجاح');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل إنشاء القالب', {
        description: error.message,
      });
      throw error;
    }
  },

  addCategoryToTemplate: async (periodId, categoryId) => {
    set({ isLoading: true, error: null });
    try {
      await periodService.addCategoryToTemplate(periodId, categoryId);
      await get().fetchTemplates();
      toast.success('تم إضافة القسم للفترة بنجاح');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل إضافة القسم للفترة', {
        description: error.message,
      });
      throw error;
    }
  },

  removeCategoryFromTemplate: async (periodId, categoryId) => {
    set({ isLoading: true, error: null });
    try {
      await periodService.removeCategoryFromTemplate(periodId, categoryId);
      await get().fetchTemplates();
      toast.success('تم إزالة القسم من الفترة بنجاح');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل إزالة القسم من الفترة', {
        description: error.message,
      });
      throw error;
    }
  },

  // ============================================================================
  // Assignment Actions
  // ============================================================================

  fetchAssignments: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const rawAssignments = await periodService.getAssignments(filters);
      const assignments = normalizeKeys(rawAssignments);
      set({ assignments, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل تحميل التعيينات', {
        description: error.message,
      });
      throw error;
    }
  },

  fetchDayGrouped: async (eidDayId) => {
    set({ isLoading: true, error: null });
    try {
      const rawGrouped = await periodService.getDayGrouped(eidDayId);
      const groupedPeriods = normalizeKeys(rawGrouped);
      set({ groupedPeriods, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل تحميل الفترات المجمعة', {
        description: error.message,
      });
      throw error;
    }
  },

  fetchAvailable: async (categoryId) => {
    set({ isLoading: true, error: null });
    try {
      const rawAvailable = await periodService.getAvailable(categoryId);
      const availablePeriods = normalizeKeys(rawAvailable);
      set({ availablePeriods, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل تحميل الفترات المتاحة', {
        description: error.message,
      });
      throw error;
    }
  },

  assignToDay: async (eidDayId, dayPeriodCategoryId, capacity) => {
    set({ isLoading: true, error: null });
    try {
      await periodService.assignToDay(eidDayId, dayPeriodCategoryId, capacity);
      await get().fetchAssignments();
      toast.success('تم تعيين الفترة لليوم بنجاح');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل تعيين الفترة', {
        description: error.message,
      });
      throw error;
    }
  },

  updateAssignment: async (eidDayPeriodId, request) => {
    set({ isLoading: true, error: null });
    try {
      await periodService.updateAssignment(eidDayPeriodId, request);
      await get().fetchAssignments();
      toast.success('تم تحديث الفترة بنجاح');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل تحديث الفترة', {
        description: error.message,
      });
      throw error;
    }
  },

  // ============================================================================
  // Utility
  // ============================================================================

  clearError: () => set({ error: null }),
}));
