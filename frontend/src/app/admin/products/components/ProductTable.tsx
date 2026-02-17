'use client';

import { Product } from '@/dto/product.dto';
import { useProductStore } from '@/store/use-product-store';
import {
  Edit2,
  Trash2,
  Power,
  ChevronRight,
  Package,
  Layers,
  Tag
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const { toggleProductActive } = useProductStore();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-[var(--secondary)] rounded-2xl border border-dashed border-[var(--border)]">
        <Package size={40} className="text-[var(--muted-foreground)]/30 mb-3" />
        <p className="text-[var(--muted-foreground)] font-black">لا يوجد منتجات في هذا التصنيف حالياً</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--secondary)] rounded-[2rem] border border-[var(--border)] overflow-hidden shadow-sm">
      <div className="overflow-x-auto overflow-y-hidden">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]/20">
              <th className="px-8 py-5 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider">المنتج</th>
              <th className="px-8 py-5 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider">الأسعار</th>
              <th className="px-8 py-5 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider">الصحون</th>
              <th className="px-8 py-5 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider">الحالة</th>
              <th className="px-8 py-5 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider text-left">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {products.map((product, index) => (
              <motion.tr
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                key={product.productId}
                className="group hover:bg-[var(--muted)]/10 transition-colors"
              >
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0784b5]/10 to-[#39ace7]/10 text-[var(--primary)] border border-[var(--primary)]/10">
                      <Package size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-[var(--foreground)]">{product.nameAr}</p>
                      <p className="text-[10px] font-bold text-[var(--muted-foreground)] mt-0.5">{product.categoryName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                    {product.prices.length > 0 ? (
                      product.prices.slice(0, 2).map((p, i) => (
                        <div key={i} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-[10px] font-black">
                          <Tag size={10} className="text-sky-500" />
                          <span>{p.price} ر.س</span>
                          {(p.sizeName || p.portionName) && (
                            <span className="text-[var(--muted-foreground)] opacity-60">
                              ({p.sizeName || p.portionName})
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-red-400 font-bold">بدون سعر</span>
                    )}
                    {product.prices.length > 2 && (
                      <div className="px-2 py-1 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-[9px] font-black text-[var(--muted-foreground)]">
                        +{product.prices.length - 2}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2 space-x-reverse overflow-hidden">
                      {product.plateTypes.slice(0, 3).map((pt, i) => (
                        <div key={i} title={pt.nameAr} className="h-6 w-6 rounded-full bg-emerald-500/10 border-2 border-[var(--secondary)] flex items-center justify-center text-[10px] font-black text-emerald-600">
                          {pt.nameAr.charAt(0)}
                        </div>
                      ))}
                      {product.plateTypes.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-[var(--muted)] border-2 border-[var(--secondary)] flex items-center justify-center text-[9px] font-black text-[var(--muted-foreground)]">
                          +{product.plateTypes.length - 3}
                        </div>
                      )}
                    </div>
                    <span className={`text-[10px] font-black ${
                      product.plateOption === 'required' ? 'text-red-500' : product.plateOption === 'optional' ? 'text-sky-500' : 'text-[var(--muted-foreground)]'
                    }`}>
                      {product.plateOption === 'required' ? 'إجباري' : product.plateOption === 'optional' ? 'اختياري' : 'لا يوجد'}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black border tracking-wider ${
                    product.isActive 
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-600 border-red-500/20'
                  }`}>
                    {product.isActive ? 'نشط' : 'معطل'}
                  </span>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-left">
                  <div className="flex items-center justify-end gap-2.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleProductActive(product.productId)}
                      className={`h-10 w-10 rounded-2xl transition-all border border-transparent hover:border-current ${
                        product.isActive 
                        ? 'text-emerald-600 hover:bg-emerald-50/50' 
                        : 'text-red-500 hover:bg-red-50/50'
                      }`}
                    >
                      <Power className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(product)}
                      className="h-10 w-10 rounded-2xl text-sky-600 hover:bg-sky-50 shadow-sm border border-transparent hover:border-sky-200 transition-all"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(product)}
                      className="h-10 w-10 rounded-2xl text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
