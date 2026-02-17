import api from '@/lib/api-client';
import { Category, CreateCategoryRequest } from '@/dto/category.dto';

export const categoryService = {
  async getAll() {
    const response = await api.get<any>('/categories');
    return response.data.data as Category[];
  },

  async getById(id: number) {
    const response = await api.get<any>(`/categories/${id}`);
    return response.data.data as Category;
  },

  async create(data: CreateCategoryRequest) {
    const response = await api.post<any>('/categories', data);
    return response.data.data as Category;
  },

  async update(id: number, data: Partial<CreateCategoryRequest>) {
    const response = await api.put<any>(`/categories/${id}`, data);
    return response.data.data as Category;
  },

  async delete(id: number) {
    await api.delete(`/categories/${id}`);
  }
};
