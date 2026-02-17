'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Flame, Star, Package } from 'lucide-react';
import { Product } from '@/dto/product.dto';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const isAvailable = product.isActive;
  const minPrice = Math.min(...product.prices.map(p => p.price));

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={!isAvailable}
      className={`relative w-full p-4 rounded-3xl border-2 transition-all duration-300 text-right overflow-hidden group cursor-pointer ${
        isAvailable 
          ? 'bg-white border-slate-100 hover:border-slate-900 hover:shadow-xl hover:shadow-slate-900/10' 
          : 'bg-slate-50 border-slate-100 opacity-60 grayscale cursor-not-allowed'
      }`}
    >
      <div className="relative z-10 flex items-center gap-4">
        {/* Status indicator */}
        <div className={`shrink-0 h-10 w-10 rounded-2xl flex items-center justify-center transition-colors duration-500 ${isAvailable ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'bg-slate-200 text-slate-400'}`}>
          <Package size={18} />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0 text-right">
          <h4 className="text-sm font-black text-slate-900 group-hover:text-slate-900 transition-colors font-cairo truncate">
            {product.nameAr}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-black text-slate-400">ر.س</span>
            <span className="text-sm font-black text-slate-900 tabular-nums">{minPrice}</span>
            {!isAvailable && (
              <span className="mr-auto text-[8px] font-black text-red-500 uppercase bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                نفذت
              </span>
            )}
          </div>
        </div>

        {/* Action */}
        <div className="shrink-0 h-10 w-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white group-hover:scale-110 transition-all duration-500">
          <ShoppingBag size={18} />
        </div>
      </div>
    </motion.button>
  );
}
