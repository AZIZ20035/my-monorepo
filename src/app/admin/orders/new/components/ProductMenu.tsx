'use client';

import { useState, useMemo } from 'react';
import { Product } from '@/dto/product.dto';
import { Category } from '@/dto/category.dto';
import { 
  Search, 
  Utensils, 
  ChevronLeft, 
  ShoppingBag,
  Plus,
  Flame,
  Star,
  Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PricePicker, CartItem } from './PricePicker';

interface ProductMenuProps {
  products: Product[];
  categories: Category[];
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  cartItems: CartItem[];
}

export function ProductMenu({ products, categories, onAddToCart, cartItems }: ProductMenuProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategoryId === 'all' || product.categoryId === selectedCategoryId;
      const matchesSearch = product.nameAr.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategoryId, searchQuery]);

  // Map to get total quantity of a product in cart
  const productQuantities = useMemo(() => {
    const map: Record<number, number> = {};
    cartItems.forEach(item => {
      map[item.productId] = (map[item.productId] || 0) + item.quantity;
    });
    return map;
  }, [cartItems]);

  return (
    <div className="flex flex-col h-full gap-4" dir="rtl">
      
      {/* Search & Categories Bar */}
      <div className="shrink-0 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full h-14 bg-[var(--secondary)] border-2 border-[var(--border)] rounded-2xl pr-12 pl-4 text-lg font-black outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all shadow-sm"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar no-scrollbar">
            <CategoryTab 
              label="الكل" 
              active={selectedCategoryId === 'all'} 
              onClick={() => setSelectedCategoryId('all')} 
              icon={Utensils}
            />
            {categories.map((cat) => (
              <CategoryTab 
                key={cat.categoryId}
                label={cat.nameAr} 
                active={selectedCategoryId === cat.categoryId} 
                onClick={() => setSelectedCategoryId(cat.categoryId)} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-1">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.productId} 
                product={product} 
                quantity={productQuantities[product.productId]}
                onClick={() => setActiveProduct(product)}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-12 text-[var(--muted-foreground)]">
            <Utensils size={48} className="opacity-20 mb-4" />
            <p className="font-black text-xl">لا توجد نتائج تطابق بحثك</p>
          </div>
        )}
      </div>

      {/* Price Picker Modal */}
      <AnimatePresence>
        {activeProduct && (
          <PricePicker 
            product={activeProduct} 
            onClose={() => setActiveProduct(null)}
            onAdd={onAddToCart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryTab({ label, active, onClick, icon: Icon }: { label: string, active: boolean, onClick: () => void, icon?: any }) {
  return (
    <button
      onClick={onClick}
      className={`h-14 px-8 rounded-2xl border-2 whitespace-nowrap font-black text-sm transition-all flex items-center gap-2 ${
        active 
          ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-lg shadow-[var(--primary)]/20' 
          : 'bg-white text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--primary)]/30'
      }`}
    >
      {Icon && <Icon size={18} />}
      {label}
    </button>
  );
}

function ProductCard({ product, quantity, onClick }: { product: Product, quantity?: number, onClick: () => void }) {
  const minPrice = Math.min(...product.prices.map(p => p.price));
  const hasMultiplePrices = product.prices.length > 1;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={onClick}
      className="group relative flex flex-col bg-white rounded-3xl border-2 border-[var(--border)] overflow-hidden transition-all hover:border-[var(--primary)] hover:shadow-xl hover:shadow-[var(--primary)]/5 text-right w-full"
    >
      {/* Image Placeholder with Icon */}
      <div className="relative h-32 bg-gradient-to-br from-[var(--secondary)] to-white flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
        <Utensils size={48} className="text-[var(--primary)]/20 group-hover:scale-110 transition-transform" />
        
        {/* Badges */}
        {quantity && quantity > 0 && (
          <div className="absolute top-3 left-3 h-8 w-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-black text-xs shadow-lg ring-4 ring-white">
            {quantity}
          </div>
        )}
        
        {product.isActive ? (
          <div className="absolute top-3 right-3 bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 backdrop-blur-md">
            <Flame size={10} />
            متوفر
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-red-500/10 text-red-600 px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 backdrop-blur-md">
            غير متوفر
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h4 className="font-black text-[15px] text-[var(--foreground)] line-clamp-2 leading-tight">
            {product.nameAr}
          </h4>
          <p className="text-[10px] font-bold text-[var(--muted-foreground)] mt-1 uppercase tracking-wider">
            {product.categoryName}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div className="space-y-0.5">
            <p className="text-[9px] font-black text-[var(--muted-foreground)]">يبدأ من</p>
            <p className="text-xl font-black text-[var(--primary)]">
              {minPrice}
              <span className="text-[10px] mr-1 opacity-70">ر.س</span>
            </p>
          </div>
          
          <div className="h-10 w-10 rounded-xl bg-[var(--secondary)] text-[var(--primary)] flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-all shadow-sm">
            {hasMultiplePrices ? <Hash size={20} /> : <Plus size={20} />}
          </div>
        </div>
      </div>
    </motion.button>
  );
}
