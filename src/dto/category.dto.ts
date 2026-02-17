export interface Category {
  categoryId: number;
  nameAr: string;
  nameEn: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
}

export interface CategoryResponse {
  categoryId: number;
  nameAr: string;
  nameEn?: string | null;
}

export interface CreateCategoryRequest {
  nameAr: string;
  nameEn?: string | null;
  description?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}
