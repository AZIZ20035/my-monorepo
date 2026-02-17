import { create } from 'zustand';
import { Category, CreateCategoryRequest } from '@/dto/category.dto';
import { categoryService } from '@/services/category-service';
import { toast } from 'sonner';
import { normalizeKeys } from '@/lib/data-normalization';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  
  fetchCategories: () => Promise<void>;
  createCategory: (data: CreateCategoryRequest) => Promise<Category>;
  updateCategory: (id: number, data: Partial<CreateCategoryRequest>) => Promise<Category>;
  deleteCategory: (id: number) => Promise<void>;
  toggleCategoryActive: (id: number) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await categoryService.getAll();
      set({ categories, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('خطأ في تحميل التصنيفات', {
        description: error.message,
      });
    }
  },

  createCategory: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newCategory = await categoryService.create(data);
      await get().fetchCategories();
      set({ isLoading: false });
      toast.success('تم إنشاء التصنيف بنجاح');
      return newCategory;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل إنشاء التصنيف', {
        description: error.message,
      });
      throw error;
    }
  },

  updateCategory: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCategory = await categoryService.update(id, data);
      await get().fetchCategories();
      set({ isLoading: false });
      toast.success('تم تحديث التصنيف بنجاح');
      return updatedCategory;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل تحديث التصنيف', {
        description: error.message,
      });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await categoryService.delete(id);
      await get().fetchCategories();
      set({ isLoading: false });
      toast.success('تم حذف التصنيف بنجاح');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل حذف التصنيف', {
        description: error.message,
      });
      throw error;
    }
  },

  toggleCategoryActive: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const category = get().categories.find((c) => c.categoryId === id);
      if (!category) throw new Error('التصنيف غير موجود');

      const updatedCategory = await categoryService.update(id, {
        isActive: !category.isActive,
      });

      set((state) => ({
        categories: state.categories.map((c) => (c.categoryId === id ? updatedCategory : c)),
        isLoading: false,
      }));
      toast.success(updatedCategory.isActive ? 'تم تفعيل التصنيف' : 'تم تعطيل التصنيف');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل تغيير حالة التصنيف', {
        description: error.message,
      });
      throw error;
    }
  },
}));
