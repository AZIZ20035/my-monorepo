import api from '@/lib/api-client';
import { ApiResponse } from '@/dto/api-response.dto';
import {
  DayPeriodResponse,
  CreateDayPeriodRequest,
  CreateDayPeriodWithCategoriesRequest,
  EidDayPeriodResponse,
  UpdateEidDayPeriodRequest,
  GroupedEidDayPeriodResponse
} from '@/dto/period.dto';
import { CategoryResponse } from '@/dto/category.dto';

export const periodService = {
  // ============================================================================
  // Template Management (DayPeriod)
  // ============================================================================

  /**
   * GET /api/periods/templates
   * List all DayPeriod templates with linked categories
   */
  getTemplates: async (): Promise<DayPeriodResponse[]> => {
    const { data } = await api.get<ApiResponse<DayPeriodResponse[]>>('/periods/templates');
    console.log('Raw templates from API:', data.data);
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل تحميل قوالب الفترات');
    }
    return data.data || [];
  },

  /**
   * GET /api/periods/templates/{id}/categories
   * Get categories linked to a specific template
   */
  getTemplateCategories: async (periodId: number): Promise<CategoryResponse[]> => {
    const { data } = await api.get<ApiResponse<CategoryResponse[]>>(`/periods/templates/${periodId}/categories`);
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل تحميل أقسام القالب');
    }
    return data.data;
  },

  /**
   * POST /api/periods/templates
   * Create a DayPeriod template (without categories)
   */
  createTemplate: async (request: CreateDayPeriodRequest): Promise<DayPeriodResponse> => {
    const { data } = await api.post<ApiResponse<DayPeriodResponse>>('/periods/templates', request);
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل إنشاء القالب');
    }
    return data.data;
  },

  /**
   * POST /api/periods/template-with-categories
   * Create a DayPeriod template and link categories in one call
   */
  createTemplateWithCategories: async (request: CreateDayPeriodWithCategoriesRequest): Promise<DayPeriodResponse> => {
    const { data } = await api.post<ApiResponse<DayPeriodResponse>>('/periods/template-with-categories', request);
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل إنشاء القالب مع الأقسام');
    }
    return data.data;
  },

  /**
   * POST /api/periods/{periodId}/categories
   * Add a category to an existing template
   */
  addCategoryToTemplate: async (periodId: number, categoryId: number): Promise<DayPeriodResponse> => {
    const { data } = await api.post<ApiResponse<DayPeriodResponse>>(`/periods/${periodId}/categories`, categoryId, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل إضافة القسم للفترة');
    }
    return data.data;
  },

  /**
   * DELETE /api/periods/{periodId}/categories/{categoryId}
   * Remove a category link from a template
   */
  removeCategoryFromTemplate: async (periodId: number, categoryId: number): Promise<DayPeriodResponse> => {
    const { data } = await api.delete<ApiResponse<DayPeriodResponse>>(`/periods/${periodId}/categories/${categoryId}`);
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل إزالة القسم من الفترة');
    }
    return data.data;
  },

  // ============================================================================
  // Assignment Management (EidDayPeriod)
  // ============================================================================

  /**
   * GET /api/periods
   * List all EidDayPeriods (assigned slots)
   * Optional filters: eidDayId, categoryId
   */
  getAssignments: async (filters?: { eidDayId?: number; categoryId?: number }): Promise<EidDayPeriodResponse[]> => {
    const params = new URLSearchParams();
    if (filters?.eidDayId) params.append('eidDayId', filters.eidDayId.toString());
    if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());
    
    const { data } = await api.get<ApiResponse<EidDayPeriodResponse[]>>(`/periods?${params.toString()}`);
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل تحميل التعيينات');
    }
    return data.data;
  },

  /**
   * GET /api/periods/day/{eidDayId}/grouped
   * Get periods grouped by template for a specific day
   * Returns period rows with category capacities
   */
  getDayGrouped: async (eidDayId: number): Promise<GroupedEidDayPeriodResponse[]> => {
    const { data } = await api.get<ApiResponse<GroupedEidDayPeriodResponse[]>>(`/periods/day/${eidDayId}/grouped`);
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل تحميل الفترات المجمعة');
    }
    return data.data;
  },

  /**
   * GET /api/periods/available
   * Get active, non-full EidDayPeriods (for booking flows)
   * Optional filter: categoryId
   */
  getAvailable: async (categoryId?: number): Promise<EidDayPeriodResponse[]> => {
    const params = categoryId ? `?categoryId=${categoryId}` : '';
    const { data } = await api.get<ApiResponse<EidDayPeriodResponse[]>>(`/periods/available${params}`);
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل تحميل الفترات المتاحة');
    }
    return data.data;
  },

  /**
   * POST /api/periods/{eidDayId}/assign/{dayPeriodCategoryId}?capacity={capacity}
   * Assign a DayPeriodCategory to an EidDay (creates EidDayPeriod)
   * Optional capacity override
   */
  assignToDay: async (eidDayId: number, dayPeriodCategoryId: number, capacity?: number): Promise<EidDayPeriodResponse> => {
    const params = capacity ? `?capacity=${capacity}` : '';
    const { data } = await api.post<ApiResponse<EidDayPeriodResponse>>(
      `/periods/${eidDayId}/assign/${dayPeriodCategoryId}${params}`
    );
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل تعيين الفترة لليوم');
    }
    return data.data;
  },

  /**
   * PUT /api/periods/{id}
   * Update an existing EidDayPeriod (capacity or active status)
   */
  updateAssignment: async (eidDayPeriodId: number, request: UpdateEidDayPeriodRequest): Promise<EidDayPeriodResponse> => {
    const { data } = await api.put<ApiResponse<EidDayPeriodResponse>>(`/periods/${eidDayPeriodId}`, request);
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل تحديث الفترة');
    }
    return data.data;
  }
};
