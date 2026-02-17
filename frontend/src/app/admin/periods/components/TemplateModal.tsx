'use client';

import { useState, useEffect } from 'react';
import { usePeriodStore } from '@/store/use-period-store';
import { useCategoryStore } from '@/store/use-category-store';
import { DayPeriodResponse } from '@/dto/period.dto';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Users, Save, Tag, Plus } from 'lucide-react';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: DayPeriodResponse | null;
}

export function TemplateModal({ isOpen, onClose, template }: TemplateModalProps) {
  const { createTemplateWithCategories, addCategoryToTemplate, removeCategoryFromTemplate, isLoading } = usePeriodStore();
  const { categories } = useCategoryStore();

  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    startTime: '',
    endTime: '',
    defaultCapacity: '20',
    categoryIds: [] as number[],
  });

  // Helper to get property from object regardless of casing (camelCase vs PascalCase)
  const getProp = (obj: any, propName: string) => {
    if (!obj) return undefined;
    const pascalName = propName.charAt(0).toUpperCase() + propName.slice(1);
    return obj[propName] !== undefined ? obj[propName] : obj[pascalName];
  };

  useEffect(() => {
    if (isOpen) {
      if (template) {
        const categories = getProp(template, 'categories') || [];
        setFormData({
          nameAr: getProp(template, 'nameAr') || '',
          nameEn: getProp(template, 'nameEn') || '',
          startTime: (getProp(template, 'startTime') || '').substring(0, 5),
          endTime: (getProp(template, 'endTime') || '').substring(0, 5),
          defaultCapacity: (getProp(template, 'defaultCapacity') || '20').toString(),
          categoryIds: categories.map((c: any) => getProp(c, 'categoryId')),
        });
      } else {
        setFormData({
          nameAr: '',
          nameEn: '',
          startTime: '',
          endTime: '',
          defaultCapacity: '20',
          categoryIds: [],
        });
      }
    }
  }, [isOpen, template]);

  const toggleCategory = async (categoryId: number) => {
    if (template) {
      const periodId = getProp(template, 'periodId');
      const isSelected = formData.categoryIds.includes(categoryId);
      
      try {
        if (isSelected) {
          await removeCategoryFromTemplate(periodId, categoryId);
        } else {
          await addCategoryToTemplate(periodId, categoryId);
        }
      } catch (error) {
        // Error handled in store
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createTemplateWithCategories({
        nameAr: formData.nameAr,
        nameEn: formData.nameEn || null,
        startTime: `${formData.startTime}:00`,
        endTime: `${formData.endTime}:00`,
        defaultCapacity: parseInt(formData.defaultCapacity),
        categoryIds: formData.categoryIds,
      });
      onClose();
    } catch (error) {
      // Error handled in store
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={template ? 'عرض تفاصيل القالب' : 'إنشاء قالب فترة جديد'}
      description="حدد الوقت والسعة والأقسام المرتبطة"
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-black text-[var(--muted-foreground)] uppercase">الاسم بالعربية *</Label>
            <Input
              required
              value={formData.nameAr}
              onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
              placeholder="مثال: الفترة الصباحية"
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black text-[var(--muted-foreground)] uppercase">الاسم بالإنجليزية</Label>
            <Input
              value={formData.nameEn}
              onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
              placeholder="Morning Period"
              className="h-12 rounded-xl"
            />
          </div>
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-black text-[var(--muted-foreground)] uppercase flex items-center gap-2">
              <Clock size={12} className="text-emerald-500" />
              وقت البدء *
            </Label>
            <Input
              required
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black text-[var(--muted-foreground)] uppercase flex items-center gap-2">
              <Clock size={12} className="text-red-500" />
              وقت الانتهاء *
            </Label>
            <Input
              required
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="h-12 rounded-xl"
            />
          </div>
        </div>

        {/* Default Capacity */}
        <div className="space-y-2">
          <Label className="text-xs font-black text-[var(--muted-foreground)] uppercase flex items-center gap-2">
            <Users size={12} className="text-sky-500" />
            السعة الافتراضية *
          </Label>
          <Input
            required
            type="number"
            min="1"
            value={formData.defaultCapacity}
            onChange={(e) => setFormData({ ...formData, defaultCapacity: e.target.value })}
            className="h-12 rounded-xl"
          />
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <Label className="text-xs font-black text-[var(--muted-foreground)] uppercase flex items-center gap-2">
            <Tag size={12} className="text-[var(--primary)]" />
            الأقسام المرتبطة
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto custom-scrollbar p-4 bg-[var(--secondary)]/50 rounded-xl border border-[var(--border)]">
            {categories.map((category) => (
              <div
                key={category.categoryId}
                onClick={() => toggleCategory(category.categoryId)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.categoryIds.includes(category.categoryId)
                    ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                    : 'border-[var(--border)] hover:border-[var(--primary)]/30'
                }`}
              >
                <Checkbox
                  checked={formData.categoryIds.includes(category.categoryId)}
                  onCheckedChange={() => toggleCategory(category.categoryId)}
                  className="pointer-events-none"
                />
                <div className="flex-1">
                  <p className="text-sm font-black text-[var(--foreground)]">{category.nameAr}</p>
                  {category.nameEn && (
                    <p className="text-[10px] font-bold text-[var(--muted-foreground)]">{category.nameEn}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="h-12 w-full sm:flex-1 rounded-xl font-black border-2"
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={isLoading || template !== null}
            className="h-12 w-full sm:flex-[2] rounded-xl bg-gradient-to-l from-[#0784b5] to-[#39ace7] text-white font-black shadow-lg shadow-[#39ace7]/20 disabled:opacity-50"
          >
            <Save className="h-5 w-5 ml-2" />
            {template ? 'القالب للعرض فقط' : 'حفظ القالب'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
