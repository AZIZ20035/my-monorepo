'use client';

import { usePeriodStore } from '@/store/use-period-store';
import { EidDayPeriodResponse } from '@/dto/period.dto';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Edit2, CheckCircle2, XCircle, TrendingUp, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';

interface AssignmentListProps {
  onEdit: (assignment: EidDayPeriodResponse) => void;
}

export function AssignmentList({ onEdit }: AssignmentListProps) {
  const { assignments, isLoading, updateAssignment } = usePeriodStore();
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Group by day then by period
  const groupedByDay = useMemo(() => {
    const dayGroups: Record<number, { dayId: number; dayName: string; dayDate: string; items: EidDayPeriodResponse[] }> = {};
    
    assignments.forEach(assignment => {
      if (!dayGroups[assignment.eidDayId]) {
        dayGroups[assignment.eidDayId] = {
          dayId: assignment.eidDayId,
          dayName: assignment.eidDayName,
          dayDate: assignment.eidDayDate,
          items: []
        };
      }
      dayGroups[assignment.eidDayId].items.push(assignment);
    });

    return Object.values(dayGroups).sort((a, b) => a.dayDate.localeCompare(b.dayDate)).map(dayGroup => {
      const periodGroups: Record<number, { 
        periodId: number; 
        periodName: string; 
        startTime: string; 
        endTime: string; 
        assignments: EidDayPeriodResponse[] 
      }> = {};

      dayGroup.items.forEach(assignment => {
        if (!periodGroups[assignment.periodId]) {
          periodGroups[assignment.periodId] = {
            periodId: assignment.periodId,
            periodName: assignment.periodName,
            startTime: assignment.startTime,
            endTime: assignment.endTime,
            assignments: []
          };
        }
        periodGroups[assignment.periodId].assignments.push(assignment);
      });

      return {
        ...dayGroup,
        periods: Object.values(periodGroups).sort((a, b) => a.startTime.localeCompare(b.startTime))
      };
    });
  }, [assignments]);

  const handleToggleActive = async (assignment: EidDayPeriodResponse) => {
    setUpdatingId(assignment.eidDayPeriodId);
    try {
      await updateAssignment(assignment.eidDayPeriodId, { isActive: !assignment.isActive });
    } finally {
      setUpdatingId(null);
    }
  };

  const selectedDay = useMemo(() => 
    groupedByDay.find(d => d.dayId === selectedDayId), 
  [groupedByDay, selectedDayId]);

  const selectedPeriod = useMemo(() => 
    selectedDay?.periods.find(p => p.periodId === selectedPeriodId), 
  [selectedDay, selectedPeriodId]);

  if (isLoading && assignments.length === 0) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <div key={i} className="h-40 bg-[var(--muted)]/50 rounded-[1.5rem] border border-[var(--border)]" />
          ))}
        </div>
      </div>
    );
  }

  if (groupedByDay.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-[var(--secondary)] border border-[var(--border)] rounded-[2.5rem] shadow-sm">
        <div className="h-20 w-20 rounded-3xl bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] mb-6">
          <Calendar size={40} />
        </div>
        <h3 className="text-2xl font-black text-[var(--foreground)] mb-2">لا توجد تعيينات بعد</h3>
        <p className="text-[var(--muted-foreground)] font-bold text-center max-w-sm">
          ابدأ بتعيين الفترات لأيام العيد لإنشاء الجدول التشغيلي
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-[400px]">
        {/* Calendar View (Days Grid) */}
        {!selectedPeriodId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Calendar size={24} className="text-[var(--primary)]" />
              <h3 className="text-xl font-black text-[var(--foreground)]">اختر يوم العيد</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {groupedByDay.map((group) => (
                <Card
                  key={group.dayId}
                  className="bg-[var(--card)] border border-[var(--border)] rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full"
                >
                  <div className="p-4 bg-[var(--primary)]/5 border-b border-[var(--border)] text-center shrink-0">
                    <h4 className="text-base font-black text-[var(--foreground)]">{group.dayName}</h4>
                  </div>
                  <div className="p-3 space-y-2 flex-1">
                    <p className="text-[10px] font-black text-[var(--muted-foreground)] mb-2 text-center">الفترات المتاحة</p>
                    <div className="flex flex-col gap-2">
                      {group.periods.map(period => (
                        <button
                          key={period.periodId}
                          onClick={() => {
                            setSelectedDayId(group.dayId);
                            setSelectedPeriodId(period.periodId);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--secondary)] border border-[var(--border)] hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all group"
                        >
                          <span className="text-xs font-black">{period.periodName}</span>
                          <span className="text-[10px] opacity-70 font-bold group-hover:opacity-100">
                            {period.startTime.substring(0, 5)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Period Detail View */}
        {selectedPeriodId && selectedDay && selectedPeriod && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Header / Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--secondary)] p-4 sm:p-6 rounded-[2rem] border border-[var(--border)]">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedPeriodId(null);
                    setSelectedDayId(null);
                  }}
                  className="h-10 w-10 rounded-xl bg-[var(--background)] border border-[var(--border)] shadow-sm hover:bg-[var(--muted)]"
                >
                  <ChevronLeft className="rotate-180" size={20} />
                </Button>
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--muted-foreground)] mb-1">
                    <span>{selectedDay.dayName}</span>
                    <ChevronLeft size={12} />
                    <span className="text-[var(--primary)]">{selectedPeriod.periodName}</span>
                  </div>
                  <h3 className="text-xl font-black text-[var(--foreground)]">
                    تفاصيل الفترة التشغيلية
                  </h3>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-[var(--card)]/50 px-5 py-2.5 rounded-2xl border border-[var(--border)]">
                <Clock size={18} className="text-[var(--primary)]" />
                <div className="flex items-center gap-2 text-sm font-black">
                  <span className="text-emerald-600">{selectedPeriod.startTime.substring(0, 5)}</span>
                  <span className="text-[var(--muted-foreground)]">—</span>
                  <span className="text-red-600">{selectedPeriod.endTime.substring(0, 5)}</span>
                </div>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {selectedPeriod.assignments.map((assignment) => (
                <Card
                  key={assignment.eidDayPeriodId}
                  className={`bg-[var(--card)] border rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all h-full flex flex-col ${
                    assignment.isActive ? 'border-[var(--border)]' : 'border-dashed opacity-80'
                  }`}
                >
                  <div className="p-6 space-y-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="h-10 w-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] mb-3">
                          <Users size={20} />
                        </div>
                        <h4 className="text-base font-black text-[var(--foreground)]">
                          {assignment.categoryName || 'بدون قسم'}
                        </h4>
                      </div>
                      <Badge
                        variant={assignment.isActive ? 'default' : 'secondary'}
                        className={`text-[10px] px-3 py-1 font-black ${
                          assignment.isActive
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-600 border-red-500/20'
                        }`}
                      >
                        {assignment.isActive ? 'نشط' : 'معطل'}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-black">
                        <span className="text-[var(--muted-foreground)]">السعة المحجوزة</span>
                        <span className={assignment.isFull ? 'text-red-600' : 'text-sky-600'}>
                          {assignment.currentOrders} / {assignment.maxCapacity}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-[var(--muted)] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${assignment.isFull ? 'bg-red-500' : 'bg-sky-500'}`}
                          style={{ width: `${Math.min((assignment.currentOrders / assignment.maxCapacity) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                          <TrendingUp size={14} />
                          متاح {assignment.availableAmount} طلب
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-[var(--border)]">
                      <Button
                        variant="secondary"
                        onClick={() => handleToggleActive(assignment)}
                        disabled={updatingId === assignment.eidDayPeriodId}
                        className={`flex-1 h-11 rounded-1.5xl font-black gap-2 transition-colors ${
                          assignment.isActive
                            ? 'hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20'
                            : 'hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/20'
                        }`}
                      >
                        {assignment.isActive ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
                        {assignment.isActive ? 'تعطيل' : 'تفعيل'}
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => onEdit(assignment)}
                        className="h-11 w-11 rounded-1.5xl hover:bg-indigo-500/10 hover:text-indigo-500 hover:border-indigo-500/20 transition-colors"
                      >
                        <Edit2 size={18} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
