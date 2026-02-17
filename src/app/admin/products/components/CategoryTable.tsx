'use client';

import { Category } from '@/dto/category.dto';
import { useCategoryStore } from '@/store/use-category-store';
import {
  Edit2,
  Trash2,
  Power,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
  const { toggleCategoryActive } = useCategoryStore();

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[var(--secondary)] rounded-2xl border border-dashed border-[var(--border)]">
        <p className="text-[var(--muted-foreground)] font-bold">لا يوجد تصنيفات حالياً</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--secondary)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
      <div className="overflow-x-auto overflow-y-hidden">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]/30">
              <th className="px-6 py-4 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider">التصنيف</th>
              <th className="px-6 py-4 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider">الحالة</th>
              <th className="px-6 py-4 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider">ترتيب العرض</th>
              <th className="px-6 py-4 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider text-left">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {categories.map((category, index) => (
              <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={category.categoryId}
                className="group hover:bg-[var(--muted)]/20 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] font-black">
                      {category.nameAr.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-[var(--foreground)]">{category.nameAr}</p>
                      {category.nameEn && (
                        <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-tight">
                          {category.nameEn}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                    category.isActive 
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-600 border-red-500/20'
                  }`}>
                    {category.isActive ? 'نشط' : 'معطل'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[var(--foreground)]">
                  {category.sortOrder}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleCategoryActive(category.categoryId)}
                      className={`h-9 w-9 rounded-xl transition-all ${
                        category.isActive 
                        ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50' 
                        : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <Power className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(category)}
                      className="h-9 w-9 rounded-xl text-sky-600 hover:text-sky-700 hover:bg-sky-50 transition-all"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(category)}
                      className="h-9 w-9 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="h-8 w-px bg-[var(--border)] mx-1" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-[var(--muted-foreground)]"
                    >
                      <ChevronRight className="h-4 w-4" />
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
