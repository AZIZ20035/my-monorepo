export interface ProductSize {
  sizeId: number;
  nameAr: string;
  nameEn: string;
  isActive: boolean;
  sortOrder: number;
}

export interface ProductPortion {
  portionId: number;
  nameAr: string;
  nameEn: string;
  multiplier: number;
  isActive: boolean;
  sortOrder: number;
}

export interface PlateType {
  plateTypeId: number;
  nameAr: string;
  nameEn: string;
  isActive: boolean;
  sortOrder: number;
}

export interface ProductPrice {
  productPriceId: number;
  sizeId: number;
  sizeName: string;
  portionId: number;
  portionName: string;
  price: number;
  isActive: boolean;
}

export interface Product {
  productId: number;
  categoryId: number;
  categoryName: string;
  nameAr: string;
  nameEn: string;
  description: string | null;
  plateOption: 'required' | 'optional' | 'none';
  isActive: boolean;
  sortOrder: number;
  prices: ProductPrice[];
  plateTypes: PlateType[];
}

export interface CreateProductRequest {
  categoryId: number;
  nameAr: string;
  nameEn?: string | null;
  description?: string | null;
  plateOption?: 'none' | 'required' | 'optional';
  sortOrder?: number;
  prices?: {
    sizeId?: number | null;
    portionId?: number | null;
    price: number;
  }[];
  plateTypeIds?: number[];
  isActive?: boolean;
}

export interface CreateProductPriceRequest {
  sizeId?: number | null;
  portionId?: number | null;
  price: number;
}

export interface CreateSizeRequest {
  nameAr: string;
  nameEn?: string | null;
  sortOrder?: number;
}

export interface CreatePortionRequest {
  nameAr: string;
  multiplier: number;
  sortOrder?: number;
}

export interface CreatePlateTypeRequest {
  nameAr: string;
  nameEn?: string | null;
  sortOrder?: number;
}
