'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Category, CreateCategoryRequest } from '@/dto/category.dto';
import { useCategoryStore } from '@/store/use-category-store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderEdit, 
  FolderPlus, 
  Type, 
  AlignRight, 
  Hash, 
  FileText,
  Check
} from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

export function CategoryModal({ isOpen, onClose, category }: CategoryModalProps) {
  const { createCategory, updateCategory, isLoading } = useCategoryStore();
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    nameAr: '',
    nameEn: '',
    description: '',
    sortOrder: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (category) {
      setFormData({
        nameAr: category.nameAr,
        nameEn: category.nameEn || '',
        description: category.description || '',
        sortOrder: category.sortOrder,
      });
    } else {
      setFormData({
        nameAr: '',
        nameEn: '',
        description: '',
        sortOrder: 0,
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nameAr.trim()) newErrors.nameAr = 'الاسم العربي مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (category) {
        await updateCategory(category.categoryId, formData);
      } else {
        await createCategory(formData);
      }
      onClose();
    } catch (error) {
      // toast is handled in store
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
      description={category ? 'قم بتحديث بيانات التصنيف الحالي' : 'أدخل بيانات التصنيف الجديد للمتجر'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6">
          <div className="space-y-3">
            <Label className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-2 pr-1">
              <AlignRight size={14} className="text-[var(--primary)]" />
              الاسم بالعربية
            </Label>
            <div className="relative group">
              <Input
                value={formData.nameAr}
                onChange={(e) => {
                  setFormData({ ...formData, nameAr: e.target.value });
                  if (e.target.value.trim() && errors.nameAr) {
                    setErrors(prev => {
                      const { nameAr, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
                className={`h-12 rounded-xl bg-[var(--background)] font-bold text-right border-2 transition-all ${
                  errors.nameAr ? 'border-red-500/50 shadow-sm shadow-red-500/10' : 'border-[var(--border)] group-hover:border-[var(--primary)]/30'
                }`}
                placeholder="مثال: مقبلات، طبق رئيسي..."
              />
            </div>
            <AnimatePresence>
              {errors.nameAr && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-[10px] font-black text-red-500 pr-1 flex items-center gap-1.5"
                >
                  <div className="h-1 w-1 rounded-full bg-red-500" />
                  {errors.nameAr}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-2 pr-1">
              <Type size={14} />
              الاسم بالإنجليزية (اختياري)
            </Label>
            <Input
              value={formData.nameEn || ''}
              onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
              className="h-12 rounded-xl bg-[var(--background)] font-bold text-left border-2 border-[var(--border)]"
              placeholder="Example: Appetizers"
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-2 pr-1">
                <Hash size={14} />
                ترتيب العرض
              </Label>
              <Input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                className="h-12 rounded-xl bg-[var(--background)] font-black text-center border-2 border-[var(--border)]"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-2 pr-1">
              <FileText size={14} />
              الوصف (اختياري)
            </Label>
            <Textarea
              value={formData.description || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px] rounded-xl bg-[var(--background)] font-bold text-right border-2 border-[var(--border)] resize-none"
              placeholder="أضف وصفاً مختصراً لهذا التصنيف..."
            />
          </div>
        </div>

        <div className="pt-4 flex items-center gap-3 w-full">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl font-black text-[var(--muted-foreground)] border border-[var(--border)]"
            disabled={isLoading}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            className="flex-[2] h-12 rounded-xl bg-gradient-to-l from-[#0784b5] to-[#39ace7] text-white font-black shadow-lg shadow-[#39ace7]/20 hover:shadow-[#39ace7]/30 hover:scale-[1.02] active:scale-[0.98] transition-all border-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <Check size={20} />
                {category ? 'حفظ التعديلات' : 'إضافة التصنيف'}
              </div>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
