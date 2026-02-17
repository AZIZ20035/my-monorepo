// ============================================================================
// Period DTOs - Aligned with API specification
// ============================================================================

import { CategoryResponse } from './category.dto';

// ============================================================================
// Template DTOs (DayPeriod)
// ============================================================================

export interface DayPeriodResponse {
  periodId: number;
  nameAr: string;
  nameEn?: string | null;
  startTime: string; // HH:mm:ss format
  endTime: string;   // HH:mm:ss format
  defaultCapacity: number;
  isActive: boolean;
  sortOrder: number;
  categories: DayPeriodCategoryInfo[];
}

export interface DayPeriodCategoryInfo {
  dayPeriodCategoryId: number;
  categoryId: number;
  nameAr: string;
  nameEn?: string | null;
  productCount?: number;
}

export interface CreateDayPeriodRequest {
  nameAr: string;
  nameEn?: string | null;
  startTime: string; // HH:mm:ss
  endTime: string;   // HH:mm:ss
  defaultCapacity?: number;
  sortOrder?: number;
}

export interface CreateDayPeriodWithCategoriesRequest extends CreateDayPeriodRequest {
  categoryIds: number[];
}

// ============================================================================
// Assignment DTOs (EidDayPeriod)
// ============================================================================

export interface EidDayPeriodResponse {
  eidDayPeriodId: number;
  eidDayId: number;
  eidDayName: string;
  eidDayDate: string; // ISO datetime
  dayPeriodCategoryId: number;
  periodId: number;
  periodName: string;
  categoryId?: number | null;
  categoryName?: string | null;
  startTime: string; // HH:mm:ss
  endTime: string;   // HH:mm:ss
  maxCapacity: number;
  currentOrders: number;
  availableAmount: number;
  isActive: boolean;
  isFull: boolean;
}

export interface UpdateEidDayPeriodRequest {
  maxCapacity?: number;
  isActive?: boolean;
}

// ============================================================================
// Grouped View DTO (for day-grouped endpoint)
// ============================================================================

export interface CategoryCapacity {
  eidDayPeriodId: number;
  categoryId?: number | null;
  categoryName?: string | null;
  maxCapacity: number;
  currentOrders: number;
  availableAmount: number;
  isActive: boolean;
  isFull: boolean;
}

export interface GroupedEidDayPeriodResponse {
  periodId: number;
  periodName: string;
  startTime: string;
  endTime: string;
  categoryCapacities: CategoryCapacity[];
}
