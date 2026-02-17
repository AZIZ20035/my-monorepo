'use client';

import { useEffect, useState } from 'react';
import { useProductStore } from '@/store/use-product-store';
import { useCategoryStore } from '@/store/use-category-store';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Package,
  Layers,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductTable } from './components/ProductTable';
import { ProductModal } from './components/ProductModal';
import { CategoryTable } from './components/CategoryTable';
import { CategoryModal } from './components/CategoryModal';
import { Product } from '@/dto/product.dto';
import { Category } from '@/dto/category.dto';

type Tab = 'products' | 'categories';

export default function ProductsPage() {
  const { fetchProducts, fetchReferenceData, products, isLoading: isProductLoading } = useProductStore();
  const { fetchCategories, categories, isLoading: isCategoryLoading, deleteCategory } = useCategoryStore();
  const { deleteProduct } = useProductStore();

  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchReferenceData();
  }, [fetchProducts, fetchCategories, fetchReferenceData]);

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (confirm(`هل أنت متأكد من حذف "${product.nameAr}"؟`)) {
      await deleteProduct(product.productId);
    }
  };

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (category: Category) => {
    if (confirm(`هل أنت متأكد من حذف التصنيف "${category.nameAr}"؟`)) {
      await deleteCategory(category.categoryId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col space-y-6 lg:space-y-8 pb-4 overflow-hidden">
      {/* ═══════════ HEADER ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 bg-[var(--secondary)] border border-[var(--border)] p-6 lg:p-8 rounded-2xl lg:rounded-[2rem] shadow-sm shrink-0"
      >
        <div className="flex items-center gap-4 lg:gap-5">
          <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shadow-sm border border-[var(--primary)]/20 shrink-0">
            <Package className="h-6 w-6 lg:h-7 lg:w-7" />
          </div>
          <div className="space-y-0.5 lg:space-y-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[var(--foreground)] tracking-tight">
              إدارة المنتجات والتصنيفات
            </h1>
            <p className="text-[var(--muted-foreground)] font-bold text-xs sm:text-sm lg:text-base">
              إدارة قائمة المنتجات وتصنيفاتها وأسعارها
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {activeTab === 'products' ? (
            <Button
              onClick={handleCreateProduct}
              className="h-11 lg:h-12 px-5 lg:px-6 rounded-xl lg:rounded-2xl bg-gradient-to-l from-[#0784b5] to-[#39ace7] text-white font-black shadow-lg shadow-[#39ace7]/20 hover:shadow-[#39ace7]/30 hover:scale-[1.02] active:scale-[0.98] transition-all border-none gap-2 text-sm"
            >
              <Plus className="h-5 w-5" />
              إضافة منتج
            </Button>
          ) : (
            <Button
              onClick={handleCreateCategory}
              className="h-11 lg:h-12 px-5 lg:px-6 rounded-xl lg:rounded-2xl bg-gradient-to-l from-[#0784b5] to-[#39ace7] text-white font-black shadow-lg shadow-[#39ace7]/20 hover:shadow-[#39ace7]/30 hover:scale-[1.02] active:scale-[0.98] transition-all border-none gap-2 text-sm"
            >
              <Plus className="h-5 w-5" />
              إضافة تصنيف
            </Button>
          )}
        </div>
      </motion.div>

      {/* ═══════════ TABS ═══════════ */}
      <div className="flex gap-1 p-1 rounded-xl bg-[var(--muted)] shrink-0 max-w-md">
        {[
          { key: 'products' as const, label: 'المنتجات', icon: Package, count: products.length },
          { key: 'categories' as const, label: 'التصنيفات', icon: Layers, count: categories.length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-black transition-all ${
              activeTab === tab.key ? 'bg-[var(--card)] text-[var(--primary)] shadow-sm' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
              activeTab === tab.key ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'bg-[var(--border)] text-[var(--muted-foreground)]'
            }`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* ═══════════ CONTENT ═══════════ */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        {activeTab === 'products' ? (
          <motion.div
            key="products-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isProductLoading && products.length === 0 ? (
              <div className="flex items-center justify-center p-12">
                <div className="h-8 w-8 border-3 border-[var(--primary)]/20 border-t-[var(--primary)] rounded-full animate-spin" />
              </div>
            ) : (
              <ProductTable
                products={products}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="categories-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isCategoryLoading && categories.length === 0 ? (
              <div className="flex items-center justify-center p-12">
                <div className="h-8 w-8 border-3 border-[var(--primary)]/20 border-t-[var(--primary)] rounded-full animate-spin" />
              </div>
            ) : (
              <CategoryTable
                categories={categories}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
              />
            )}
          </motion.div>
        )}
      </div>

      {/* ═══════════ MODALS ═══════════ */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
      />
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        category={selectedCategory}
      />
    </div>
  );
}
