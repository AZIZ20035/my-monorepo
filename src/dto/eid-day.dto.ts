import { EidDayPeriodResponse } from './period.dto';

export interface EidDayResponse {
  eidDayId: number;
  nameAr: string;
  nameEn?: string | null;
  date: string; // ISO 8601
  dayNumber: number;
  isActive: boolean;
  sortOrder: number;
  periods: EidDayPeriodResponse[];
}

export interface CreateEidDayRequest {
  nameAr: string;
  nameEn?: string | null;
  date: string; // ISO 8601
  dayNumber: number;
  sortOrder?: number;
}

export interface UpdateEidDayRequest {
  nameAr?: string;
  nameEn?: string;
  date?: string; // ISO 8601
  dayNumber?: number;
  isActive?: boolean;
  sortOrder?: number;
}
