import api from '@/lib/api-client';
import { 
  Product, 
  ProductSize, 
  ProductPortion, 
  PlateType,
  CreateProductRequest,
  CreateProductPriceRequest,
  CreateSizeRequest,
  CreatePortionRequest,
  CreatePlateTypeRequest
} from '@/dto/product.dto';

export const productService = {
  async getAll(categoryId?: number) {
    const url = categoryId ? `/products?categoryId=${categoryId}` : '/products';
    const response = await api.get<any>(url);
    return response.data.data as Product[];
  },

  async getById(id: number) {
    const response = await api.get<any>(`/products/${id}`);
    return response.data.data as Product;
  },

  async getSizes() {
    const response = await api.get<any>('/products/sizes');
    return response.data.data as ProductSize[];
  },

  async getPortions() {
    const response = await api.get<any>('/products/portions');
    return response.data.data as ProductPortion[];
  },

  async getPlateTypes() {
    const response = await api.get<any>('/products/plate-types');
    return response.data.data as PlateType[];
  },

  async create(data: CreateProductRequest) {
    const response = await api.post<any>('/products', data);
    return response.data.data as Product;
  },

  async update(id: number, data: Partial<CreateProductRequest>) {
    const response = await api.put<any>(`/products/${id}`, data);
    return response.data.data as Product;
  },

  async delete(id: number) {
    await api.delete(`/products/${id}`);
  },

  async createPrice(productId: number, data: CreateProductPriceRequest) {
    const response = await api.post<any>(`/products/${productId}/prices`, data);
    return response.data;
  },

  async createSize(data: CreateSizeRequest) {
    const response = await api.post<any>('/products/sizes', data);
    return response.data.data as ProductSize;
  },

  async createPortion(data: CreatePortionRequest) {
    const response = await api.post<any>('/products/portions', data);
    return response.data.data as ProductPortion;
  },

  async createPlateType(data: CreatePlateTypeRequest) {
    const response = await api.post<any>('/products/plate-types', data);
    return response.data.data as PlateType;
  }
};
