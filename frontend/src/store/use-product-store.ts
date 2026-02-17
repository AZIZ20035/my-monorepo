import { create } from 'zustand';
import { 
  Product, 
  ProductSize, 
  ProductPortion, 
  PlateType,
  CreateProductRequest
} from '@/dto/product.dto';
import { productService } from '@/services/product-service';
import { toast } from 'sonner';
import { useCategoryStore } from './use-category-store';

interface ProductState {
  products: Product[];
  sizes: ProductSize[];
  portions: ProductPortion[];
  plateTypes: PlateType[];
  isLoading: boolean;
  error: string | null;
  
  fetchProducts: (categoryId?: number) => Promise<void>;
  fetchReferenceData: () => Promise<void>;
  createProduct: (data: CreateProductRequest) => Promise<Product>;
  updateProduct: (id: number, data: Partial<CreateProductRequest>) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
  toggleProductActive: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  sizes: [],
  portions: [],
  plateTypes: [],
  isLoading: false,
  error: null,

  fetchProducts: async (categoryId) => {
    set({ isLoading: true, error: null });
    try {
      const products = await productService.getAll(categoryId);
      set({ products, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('خطأ في تحميل المنتجات', {
        description: error.message,
      });
    }
  },

  fetchReferenceData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [sizes, portions, plateTypes] = await Promise.all([
        productService.getSizes(),
        productService.getPortions(),
        productService.getPlateTypes(),
      ]);
      set({ sizes, portions, plateTypes, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('خطأ في تحميل البيانات المساعدة', {
        description: error.message,
      });
    }
  },

  createProduct: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newProduct = await productService.create(data);
      // Re-fetch to get all JOINed data and update counts
      await Promise.all([
        get().fetchProducts(),
        useCategoryStore.getState().fetchCategories()
      ]);
      set({ isLoading: false });
      toast.success('تم إنشاء المنتج بنجاح');
      return newProduct;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل إنشاء المنتج', {
        description: error.message,
      });
      throw error;
    }
  },

  updateProduct: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProduct = await productService.update(id, data);
      // Re-fetch to ensure all state is in sync
      await Promise.all([
        get().fetchProducts(),
        useCategoryStore.getState().fetchCategories()
      ]);
      set({ isLoading: false });
      toast.success('تم تحديث المنتج بنجاح');
      return updatedProduct;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل تحديث المنتج', {
        description: error.message,
      });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await productService.delete(id);
      await Promise.all([
        get().fetchProducts(),
        useCategoryStore.getState().fetchCategories()
      ]);
      set({ isLoading: false });
      toast.success('تم حذف المنتج بنجاح');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل حذف المنتج', {
        description: error.message,
      });
      throw error;
    }
  },

  toggleProductActive: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const product = get().products.find((p) => p.productId === id);
      if (!product) throw new Error('المنتج غير موجود');

      const updatedProduct = await productService.update(id, {
        isActive: !product.isActive,
      });

      set((state) => ({
        products: state.products.map((p) => (p.productId === id ? updatedProduct : p)),
        isLoading: false,
      }));
      toast.success(updatedProduct.isActive ? 'تم تفعيل المنتج' : 'تم تعطيل المنتج');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل تغيير حالة المنتج', {
        description: error.message,
      });
      throw error;
    }
  },
}));
