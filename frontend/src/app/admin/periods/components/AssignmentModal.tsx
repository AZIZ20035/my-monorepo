'use client';

import { useState, useEffect } from 'react';
import { usePeriodStore } from '@/store/use-period-store';
import { useEidDayStore } from '@/store/use-eid-day-store';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectItem } from '@/components/ui/select';
import { Calendar, Clock, Users, Plus, Tag, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AssignmentModal({ isOpen, onClose }: AssignmentModalProps) {
  const { templates, fetchTemplates, assignToDay, isLoading } = usePeriodStore();
  const { eidDays, fetchEidDays } = useEidDayStore();

  const [formData, setFormData] = useState({
    eidDayId: '',
    periodId: '',
    categoryAssignments: {} as Record<number, { capacity: string; isSelected: boolean }>
  });

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
      fetchEidDays();
      setFormData({
        eidDayId: '',
        periodId: '',
        categoryAssignments: {}
      });
    }
  }, [isOpen, fetchTemplates, fetchEidDays]);

  // Helper to get property from object regardless of casing (camelCase vs PascalCase)
  const getProp = (obj: any, propName: string) => {
    if (!obj) return undefined;
    const pascalName = propName.charAt(0).toUpperCase() + propName.slice(1);
    return obj[propName] !== undefined ? obj[propName] : obj[pascalName];
  };

  const selectedTemplate = templates.find(t => {
    const tid = getProp(t, 'periodId');
    return tid?.toString() === formData.periodId;
  });

  useEffect(() => {
    if (selectedTemplate) {
      const assignments: typeof formData.categoryAssignments = {};
      const categories = (selectedTemplate as any).categories || (selectedTemplate as any).Categories || [];
      
      categories.forEach((cat: any) => {
        const cid = getProp(cat, 'categoryId');
        if (cid !== undefined) {
          assignments[cid] = {
            capacity: getProp(selectedTemplate, 'defaultCapacity')?.toString() || "0",
            isSelected: true
          };
        }
      });
      setFormData(prev => ({ ...prev, categoryAssignments: assignments }));
    }
  }, [selectedTemplate]);

  const toggleCategory = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      categoryAssignments: {
        ...prev.categoryAssignments,
        [categoryId]: {
          ...prev.categoryAssignments[categoryId],
          isSelected: !prev.categoryAssignments[categoryId]?.isSelected
        }
      }
    }));
  };

  const updateCapacity = (categoryId: number, capacity: string) => {
    setFormData(prev => ({
      ...prev,
      categoryAssignments: {
        ...prev.categoryAssignments,
        [categoryId]: {
          ...prev.categoryAssignments[categoryId],
          capacity
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTemplate) return;

    const categories = (selectedTemplate as any).categories || (selectedTemplate as any).Categories || [];
    const selectedCategories = categories.filter((cat: any) => {
      const cid = getProp(cat, 'categoryId');
      return formData.categoryAssignments[cid]?.isSelected;
    });

    if (selectedCategories.length === 0) return;

    try {
      for (const category of selectedCategories) {
        const cid = getProp(category, 'categoryId');
        const assignment = formData.categoryAssignments[cid];
        const capacity = assignment.capacity ? parseInt(assignment.capacity) : undefined;
        
        // Standardized Day-Period-Category ID lookup
        const mappingId = getProp(category, 'dayPeriodCategoryId');
        
        if (!mappingId) {
          console.error('Mapping ID (dayPeriodCategoryId) not found for category:', category);
          continue; 
        }

        await assignToDay(
          parseInt(formData.eidDayId),
          mappingId,
          capacity
        );
      }
      onClose();
    } catch (error) {
      // Error handled in store
    }
  };

  const selectedCount = Object.values(formData.categoryAssignments).filter(a => a.isSelected).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تعيين فترة ليوم"
      description="اختر اليوم والفترة والأقسام المراد تعيينها"
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Select Day */}
        <div className="space-y-2">
          <Label className="text-xs font-black text-[var(--muted-foreground)] uppercase flex items-center gap-2">
            <Calendar size={12} className="text-[var(--primary)]" />
            اختر اليوم *
          </Label>
          <Select
            value={formData.eidDayId}
            onValueChange={(value) => setFormData({ ...formData, eidDayId: value })}
            placeholder="اختر يوم العيد..."
            className="h-12"
          >
            {eidDays.map((day) => (
              <SelectItem key={day.eidDayId} value={day.eidDayId.toString()}>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-black">{day.nameAr}</span>
                  <span className="text-[10px] opacity-60 font-bold">
                    {new Date(day.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}
                  </span>
                </div>
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Select Template */}
        <div className="space-y-2">
          <Label className="text-xs font-black text-[var(--muted-foreground)] uppercase flex items-center gap-2">
            <Clock size={12} className="text-[var(--primary)]" />
            اختر قالب الفترة *
          </Label>
          <Select
            value={formData.periodId}
            onValueChange={(value) => setFormData({ ...formData, periodId: value })}
            placeholder="اختر القالب..."
            className="h-12"
          >
            {templates.map((template) => (
              <SelectItem key={template.periodId} value={template.periodId.toString()}>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-black">{template.nameAr}</span>
                  <span className="text-[10px] opacity-60 font-bold">
                    {template.startTime.substring(0, 5)} - {template.endTime.substring(0, 5)}
                  </span>
                </div>
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Category Selection */}
        <AnimatePresence>
          {selectedTemplate && selectedTemplate.categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden"
            >
              <Label className="text-xs font-black text-[var(--muted-foreground)] uppercase flex items-center gap-2">
                <Tag size={12} className="text-[var(--primary)]" />
                اختر الأقسام وحدد السعة
              </Label>
              <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar p-4 bg-[var(--secondary)]/50 rounded-xl border border-[var(--border)]">
                {(selectedTemplate.categories || (selectedTemplate as any).Categories || []).map((cat: any) => {
                  const cid = getProp(cat, 'categoryId');
                  const assignment = formData.categoryAssignments[cid];
                  const isSelected = assignment?.isSelected;

                  return (
                    <div
                      key={cid}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col sm:flex-row sm:items-center gap-4 ${
                        isSelected
                          ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                          : 'border-[var(--border)] opacity-60'
                      }`}
                    >
                      <div
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                        onClick={() => toggleCategory(cid)}
                      >
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--muted-foreground)]/30'
                        }`}>
                          {isSelected && <Plus className="h-4 w-4 text-white rotate-45" />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-[var(--foreground)]">{getProp(cat, 'nameAr')}</p>
                          {getProp(cat, 'nameEn') && (
                            <p className="text-[10px] font-bold text-[var(--muted-foreground)]">{getProp(cat, 'nameEn')}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="text-[10px] font-black text-[var(--muted-foreground)] whitespace-nowrap">
                          السعة:
                        </label>
                        <div className="relative w-24">
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
                            <Hash className="h-3.5 w-3.5" />
                          </span>
                          <Input
                            type="number"
                            disabled={!isSelected}
                            value={assignment?.capacity || ''}
                            onChange={(e) => updateCapacity(cid, e.target.value)}
                            className="h-10 rounded-xl pr-8 text-xs font-black"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
            disabled={!formData.eidDayId || !formData.periodId || selectedCount === 0 || isLoading}
            className="h-12 w-full sm:flex-[2] rounded-xl bg-gradient-to-l from-[#0784b5] to-[#39ace7] text-white font-black shadow-lg shadow-[#39ace7]/20 disabled:opacity-50"
          >
            <Plus className="h-5 w-5 ml-2" />
            إتمام التعيين ({selectedCount})
          </Button>
        </div>
      </form>
    </Modal>
  );
}
