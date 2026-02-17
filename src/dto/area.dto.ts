export interface Area {
  id: number;
  nameAr: string;
  nameEn: string | null;
  deliveryCost: number;
  isActive: boolean;
  sortOrder: number;
}

export interface AreaResponse {
  areaId: number;
  nameAr: string;
  nameEn: string | null;
  deliveryCost: number;
  isActive: boolean;
  sortOrder: number;
}

export interface CreateAreaRequest {
  nameAr: string;
  nameEn: string | null;
  deliveryCost: number;
  sortOrder: number;
}

export interface UpdateAreaRequest {
  nameAr: string;
  nameEn: string | null;
  deliveryCost: number;
  sortOrder: number;
  isActive: boolean;
}

export class AreaDto {
  static fromApi(apiArea: AreaResponse): Area {
    return {
      id: apiArea.areaId,
      nameAr: apiArea.nameAr,
      nameEn: apiArea.nameEn,
      deliveryCost: apiArea.deliveryCost,
      isActive: apiArea.isActive,
      sortOrder: apiArea.sortOrder,
    };
  }
}
