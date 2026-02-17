'use client';

import { useState, useMemo } from 'react';
import { usePeriodStore } from '@/store/use-period-store';
import { DayPeriodResponse } from '@/dto/period.dto';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Clock, Users, Edit2, ChevronLeft, Tag, LayoutGrid, List, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface TemplateListProps {
  onEdit: (template: DayPeriodResponse) => void;
}

type ViewType = 'card' | 'table';

export function TemplateList({ onEdit }: TemplateListProps) {
  const { templates, isLoading } = usePeriodStore();
  const [viewType, setViewType] = useState<ViewType>('card');
  const [detailsTemplate, setDetailsTemplate] = useState<DayPeriodResponse | null>(null);

  // Helper to get property from object regardless of casing (camelCase vs PascalCase)
  const getProp = (obj: any, propName: string) => {
    if (!obj) return undefined;
    const pascalName = propName.charAt(0).toUpperCase() + propName.slice(1);
    return obj[propName] !== undefined ? obj[propName] : obj[pascalName];
  };

  if (isLoading && templates.length === 0) {
    // ... (keep loading UI)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-64 bg-[var(--muted)]/50 rounded-[2rem] border border-[var(--border)]" />
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-[var(--secondary)] border border-[var(--border)] rounded-[2.5rem] shadow-sm">
        <div className="h-20 w-20 rounded-3xl bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] mb-6">
          <LayoutGrid size={40} />
        </div>
        <h3 className="text-2xl font-black text-[var(--foreground)] mb-2">لا توجد قوالب بعد</h3>
        <p className="text-[var(--muted-foreground)] font-bold text-center max-w-sm">
          ابدأ بإنشاء قالب فترة جديد لتحديد الأوقات والسعات الافتراضية
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-[var(--muted)]/50 rounded-xl border border-[var(--border)]">
          <button
            onClick={() => setViewType('card')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
              viewType === 'card'
                ? 'bg-[var(--card)] text-[var(--primary)] shadow-sm border border-[var(--border)]'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <LayoutGrid size={14} />
            بطاقات
          </button>
          <button
            onClick={() => setViewType('table')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
              viewType === 'table'
                ? 'bg-[var(--card)] text-[var(--primary)] shadow-sm border border-[var(--border)]'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <List size={14} />
            جدول
          </button>
        </div>
      </div>

      {viewType === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => {
            const periodId = getProp(template, 'periodId');
            const nameAr = getProp(template, 'nameAr');
            const nameEn = getProp(template, 'nameEn');
            const startTime = getProp(template, 'startTime') || "00:00";
            const endTime = getProp(template, 'endTime') || "00:00";
            const defaultCapacity = getProp(template, 'defaultCapacity');
            const isActive = getProp(template, 'isActive');
            const categories = (template as any).categories || (template as any).Categories || [];

            return (
              <motion.div
                key={periodId || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="h-full"
              >
                <Card className="bg-[var(--card)] border border-[var(--border)] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all group h-full flex flex-col">
                  {/* Header */}
                  <div className="p-6 bg-gradient-to-br from-[var(--secondary)] to-[var(--card)] border-b border-[var(--border)]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-black text-[var(--foreground)] mb-1">
                          {nameAr}
                        </h3>
                        {nameEn && (
                          <p className="text-xs font-bold text-[var(--muted-foreground)]">
                            {nameEn}
                          </p>
                        )}
                      </div>
                        <Badge
                          variant={isActive ? 'default' : 'secondary'}
                          className={`text-[9px] font-black ${
                            isActive
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                              : 'bg-red-500/10 text-red-600 border-red-500/20'
                          }`}
                        >
                          {isActive ? 'نشط' : 'معطل'}
                        </Badge>
                      </div>

                    {/* Time Range */}
                    <div className="flex items-center gap-2 bg-[var(--muted)]/50 px-3 py-2 rounded-xl">
                      <Clock size={16} className="text-[var(--primary)]" />
                      <div className="flex items-center gap-1 text-sm font-black">
                        <span className="text-emerald-600">{startTime.substring(0, 5)}</span>
                        <ChevronLeft size={14} className="text-[var(--muted-foreground)]" />
                        <span className="text-red-600">{endTime.substring(0, 5)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col">
                    {/* Capacity */}
                    <div className="flex items-center justify-between p-3 bg-[var(--secondary)]/50 rounded-xl shrink-0">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-sky-500" />
                        <span className="text-xs font-black text-[var(--muted-foreground)]">السعة الافتراضية</span>
                      </div>
                      <span className="text-sm font-black text-sky-600">{defaultCapacity} طلب</span>
                    </div>

                    {/* Categories */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag size={14} className="text-[var(--primary)]" />
                        <span className="text-xs font-black text-[var(--muted-foreground)]">الأقسام المرتبطة</span>
                      </div>
                      {categories.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {categories.map((cat: any, i: number) => {
                            const cNameAr = getProp(cat, 'nameAr');
                            const cid = getProp(cat, 'categoryId');
                            return (
                              <Badge
                                key={cid || i}
                                variant="outline"
                                className="text-[9px] font-bold bg-[var(--background)]/50"
                              >
                                {cNameAr}
                              </Badge>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs font-bold text-[var(--muted-foreground)] italic">
                          لا توجد أقسام مرتبطة
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <Button
                      onClick={() => onEdit(template)}
                      variant="outline"
                      className="w-full h-10 rounded-xl font-black text-xs gap-2 border-2 hover:bg-indigo-500/10 hover:text-indigo-500 hover:border-indigo-500/20 transition-all shrink-0 mt-auto"
                    >
                      <Edit2 size={14} />
                      عرض التفاصيل
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="rounded-[1.5rem] border border-[var(--border)] overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-[var(--muted)]/50">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-right font-black text-xs py-5">اسم القالب</TableHead>
                <TableHead className="text-right font-black text-xs">الوقت</TableHead>
                <TableHead className="text-right font-black text-xs">السعة</TableHead>
                <TableHead className="text-right font-black text-xs">الحالة</TableHead>
                <TableHead className="text-left font-black text-xs px-6">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => {
                const startTime = getProp(template, 'startTime') || "00:00";
                const endTime = getProp(template, 'endTime') || "00:00";
                const isActive = getProp(template, 'isActive');

                return (
                  <TableRow key={getProp(template, 'periodId')} className="hover:bg-[var(--muted)]/20 transition-colors border-b border-[var(--border)] last:border-none">
                    <TableCell className="font-bold py-4">
                      <div className="space-y-0.5">
                        <p className="text-sm font-black">{getProp(template, 'nameAr')}</p>
                        <p className="text-[10px] text-[var(--muted-foreground)]">{getProp(template, 'nameEn')}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-black">
                        <span className="text-emerald-600">{startTime.substring(0, 5)}</span>
                        <ChevronLeft size={10} className="text-[var(--muted-foreground)]" />
                        <span className="text-red-600">{endTime.substring(0, 5)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-sky-500/10 text-sky-500 border-sky-500/20 text-[10px] font-black">
                        {getProp(template, 'defaultCapacity')} طلب
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={isActive ? 'default' : 'secondary'}
                        className={`text-[9px] font-black ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-600 border-red-500/20'
                        }`}
                      >
                        {isActive ? 'نشط' : 'معطل'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-left px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDetailsTemplate(template)}
                          className="h-8 w-8 rounded-lg hover:text-sky-500 hover:bg-sky-500/10 transition-colors"
                        >
                          <Eye size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(template)}
                          className="h-8 w-8 rounded-lg hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                        >
                          <Edit2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={!!detailsTemplate}
        onClose={() => setDetailsTemplate(null)}
        title="تفاصيل قالب الفترة"
        className="max-w-md"
      >
        {detailsTemplate && (
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--secondary)] p-3 rounded-[1rem] border border-[var(--border)]">
                <p className="text-[10px] font-bold text-[var(--muted-foreground)] mb-1">وقت البدء</p>
                <p className="text-sm font-black text-emerald-600">{getProp(detailsTemplate, 'startTime')?.substring(0, 5)}</p>
              </div>
              <div className="bg-[var(--secondary)] p-3 rounded-[1rem] border border-[var(--border)]">
                <p className="text-[10px] font-bold text-[var(--muted-foreground)] mb-1">وقت الانتهاء</p>
                <p className="text-sm font-black text-red-600">{getProp(detailsTemplate, 'endTime')?.substring(0, 5)}</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black text-[var(--foreground)] mb-3 flex items-center gap-2">
                <Tag size={14} className="text-[var(--primary)]" />
                الأقسام المرتبطة
              </h4>
              <div className="bg-[var(--secondary)]/30 rounded-[1.2rem] border border-[var(--border)] p-4 min-h-[100px]">
                {((detailsTemplate as any).categories || (detailsTemplate as any).Categories || []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {((detailsTemplate as any).categories || (detailsTemplate as any).Categories || []).map((cat: any, i: number) => (
                      <Badge key={i} variant="outline" className="bg-[var(--background)]/50 text-[10px] font-bold py-1 px-3 border-2">
                        {getProp(cat, 'nameAr')}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-4 text-[var(--muted-foreground)]">
                    <p className="text-xs font-bold italic">لا توجد أقسام مرتبطة بهذا القالب</p>
                  </div>
                )}
              </div>
            </div>

            <Button
              className="w-full h-11 rounded-xl font-black"
              onClick={() => {
                onEdit(detailsTemplate);
                setDetailsTemplate(null);
              }}
            >
              تعديل القالب
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
