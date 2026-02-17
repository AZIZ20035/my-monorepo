'use client';

import { useState, useEffect } from 'react';
import { usePeriodStore } from '@/store/use-period-store';
import { useEidDayStore } from '@/store/use-eid-day-store';
import { EidDayResponse } from '@/dto/eid-day.dto';
import { DayPeriodResponse } from '@/dto/period.dto';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectItem } from '@/components/ui/select';
import { Clock, Users, ArrowRight, Plus, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PeriodAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  eidDay: EidDayResponse | null;
}

export function PeriodAssignmentModal({ isOpen, onClose, eidDay }: PeriodAssignmentModalProps) {
  const { templates, fetchTemplates, assignToDay, isLoading } = usePeriodStore();
  
  // Helper to get property from object regardless of casing (camelCase vs PascalCase)
  const getProp = (obj: any, propName: string) => {
    if (!obj) return undefined;
    const pascalName = propName.charAt(0).toUpperCase() + propName.slice(1);
    return obj[propName] !== undefined ? obj[propName] : obj[pascalName];
  };

  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('');
  // selectedTemplate is now derived, not a state
  // const [selectedTemplate, setSelectedTemplate] = useState<DayPeriodResponse | null>(null);
  const [categoryAssignments, setCategoryAssignments] = useState<
    Record<number, { dayPeriodCategoryId: number; capacity: string; isSelected: boolean }>
  >({});

  const selectedTemplate = templates.find(t => {
    const tid = getProp(t, 'periodId');
    return tid?.toString() === selectedPeriodId;
  });

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
      setSelectedPeriodId('');
      // setSelectedTemplate(null); // No longer a state
      setCategoryAssignments({});
    }
  }, [isOpen, fetchTemplates]);

  useEffect(() => {
    if (selectedTemplate) {
      const initialAssignments: typeof categoryAssignments = {};
      const categories = getProp(selectedTemplate, 'categories') || [];
      
      categories.forEach((cat: any) => {
        const mappingId = getProp(cat, 'dayPeriodCategoryId');
        if (mappingId) {
          initialAssignments[mappingId] = {
            dayPeriodCategoryId: mappingId,
            capacity: String(getProp(selectedTemplate, 'defaultCapacity') || "0"),
            isSelected: true
          };
        }
      });
      setCategoryAssignments(initialAssignments);
    } else {
      setCategoryAssignments({});
    }
  }, [selectedTemplate]);

  const toggleCategorySelection = (dayPeriodCategoryId: number) => {
    setCategoryAssignments(prev => ({
      ...prev,
      [dayPeriodCategoryId]: {
        ...prev[dayPeriodCategoryId],
        isSelected: !prev[dayPeriodCategoryId]?.isSelected
      }
    }));
  };

  const updateCategoryCapacity = (dayPeriodCategoryId: number, capacity: string) => {
    setCategoryAssignments(prev => ({
      ...prev,
      [dayPeriodCategoryId]: {
        ...prev[dayPeriodCategoryId],
        capacity
      }
    }));
  };

  const handleAssign = async () => {
    if (!eidDay || !selectedTemplate) return;

    const selectedCategories = Object.values(categoryAssignments).filter(a => a.isSelected);
    
    if (selectedCategories.length === 0) return;

    try {
      for (const assignment of selectedCategories) {
        const capacityValue = assignment.capacity ? parseInt(assignment.capacity) : undefined;
        
        // Use the dayPeriodCategoryId (or fallback)
        const mappingId = assignment.dayPeriodCategoryId;
        
        if (!mappingId) {
          console.error('Mapping ID missing during assignment:', assignment);
          continue;
        }

        await assignToDay(
          eidDay.eidDayId,
          mappingId,
          capacityValue
        );
      }
      onClose();
    } catch (error) {
      // Error is handled by the store/toast
    }
  };

  const selectedCount = Object.values(categoryAssignments).filter(a => a.isSelected).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تعيين فترة لليوم"
      description={eidDay?.nameAr}
      className="max-w-[500px]"
    >
      <div className="space-y-6">
        {/* Template Selection */}
        <div className="space-y-2">
          <Label className="text-xs font-black text-[var(--muted-foreground)] uppercase mr-1">اختيار قالب الفترة</Label>
          <Select 
            value={selectedPeriodId} 
            onValueChange={setSelectedPeriodId}
            placeholder="اختر قالباً من القائمة..."
            className="h-14"
          >
            {(templates || []).map((template: any) => {
              const pid = getProp(template, 'periodId');
              return (
                <SelectItem 
                  key={pid} 
                  value={pid?.toString() || ""}
                >
                  <div className="flex flex-col gap-0.5 items-start">
                    <span className="text-sm font-black">{getProp(template, 'nameAr')}</span>
                    <span className="text-[10px] opacity-60 font-bold">
                      {getProp(template, 'startTime')?.substring(0, 5)} - {getProp(template, 'endTime')?.substring(0, 5)}
                    </span>
                  </div>
                </SelectItem>
              );
            })}
          </Select>
        </div>

        <AnimatePresence>
          {selectedTemplate && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              className="space-y-6 overflow-hidden"
            >
              {/* Template Details Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[var(--muted)]/40 to-white/5 border border-[var(--border)] shadow-sm">
                <h4 className="text-[10px] font-black text-[var(--muted-foreground)] uppercase mb-4 tracking-wider flex items-center gap-2">
                  <Clock size={12} className="text-[var(--primary)]" />
                  تفاصيل الفترة المختارة
                </h4>
                <div className="grid grid-cols-3 gap-4 text-right">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-[var(--muted-foreground)]">وقت البدء</p>
                    <p className="text-sm font-black text-[var(--foreground)] tracking-tighter">
                      {getProp(selectedTemplate, 'startTime')?.substring(0, 5)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-[var(--muted-foreground)]">وقت الانتهاء</p>
                    <p className="text-sm font-black text-[var(--foreground)] tracking-tighter">
                      {getProp(selectedTemplate, 'endTime')?.substring(0, 5)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-[var(--muted-foreground)]">السعة الافتراضية</p>
                    <p className="text-sm font-black text-emerald-600">
                      {getProp(selectedTemplate, 'defaultCapacity')} طلب
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Selection with Capacity Override */}
              {selectedTemplate.categories.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mr-1">
                    <Users size={14} className="text-[var(--primary)]" />
                    <Label className="text-xs font-black text-[var(--muted-foreground)] uppercase">اختر الأقسام وحدد السعة</Label>
                  </div>
                  {(getProp(selectedTemplate, 'categories') || []).map((cat: any) => {
                    const mid = getProp(cat, 'dayPeriodCategoryId') || getProp(cat, 'id');
                    const assignment = categoryAssignments[mid];
                    const isSelected = assignment?.isSelected;

                    return (
                      <div
                        key={mid}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center gap-4 ${
                          isSelected
                            ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-sm'
                            : 'border-[var(--border)] bg-[var(--secondary)]/50 opacity-60'
                        }`}
                      >
                        <div
                          className="flex items-center gap-3 flex-1 cursor-pointer"
                          onClick={() => toggleCategorySelection(mid)}
                        >
                          <div className={`
                            w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                            ${isSelected ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--muted-foreground)]/30'}
                          `}>
                            {isSelected && <Plus className="h-4 w-4 text-white rotate-45" />}
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-sm font-black ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>
                              {getProp(cat, 'nameAr')}
                            </span>
                            <span className="text-[10px] font-bold text-[var(--muted-foreground)]">
                              {getProp(cat, 'nameEn') || 'N/A'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <label className="text-[10px] font-black text-[var(--muted-foreground)] whitespace-nowrap">السعة:</label>
                          <div className="relative w-24">
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"><Hash className="h-3.5 w-3.5" /></span>
                            <Input
                              type="number"
                              disabled={!isSelected}
                              value={assignment?.capacity || ''}
                              onChange={(e) => updateCategoryCapacity(mid, e.target.value)}
                              className="h-10 rounded-xl border-[var(--border)] pr-8 text-xs font-black bg-white focus:bg-white transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
                  <p className="text-xs font-bold text-amber-600">
                    هذا القالب لا يحتوي على أقسام مرتبطة. يرجى ربط الأقسام أولاً من صفحة القوالب.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-row gap-3 mt-8">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-12 rounded-xl text-[var(--foreground)] font-black hover:bg-[var(--muted)]/50 transition-all border border-transparent hover:border-[var(--border)]"
          >
            إلغاء
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedPeriodId || selectedCount === 0 || isLoading}
            className="flex-[2] h-12 rounded-xl bg-gradient-to-l from-[#0784b5] to-[#39ace7] text-white font-black shadow-lg shadow-[#39ace7]/20 hover:shadow-[#39ace7]/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 group"
          >
            {isLoading ? 'جاري التعيين...' : (
              <div className="flex items-center justify-center gap-2">
                <ArrowRight size={18} className="transition-transform group-hover:-translate-x-1" />
                إتمام التعيين ({selectedCount})
              </div>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
