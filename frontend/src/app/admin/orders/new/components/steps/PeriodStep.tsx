'use client';

import { useMemo } from 'react';
import { EidDayResponse } from '@/dto/eid-day.dto';
import { EidDayPeriodResponse } from '@/dto/period.dto';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Users,
  ChevronLeft,
  CalendarCheck,
  CalendarDays
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PeriodStepProps {
  eidDays: EidDayResponse[];
  selectedDayId: number | null;
  onSelectedDay: (id: number | null) => void;
  selectedPeriodId: number | null;
  onSelectedPeriod: (id: number | null) => void;
}

export function PeriodStep({ 
  eidDays, 
  selectedDayId, 
  onSelectedDay, 
  selectedPeriodId, 
  onSelectedPeriod 
}: PeriodStepProps) {

  const activeDays = useMemo(() => {
    return eidDays.filter(d => d.isActive).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [eidDays]);

  const selectedDay = useMemo(() => {
    return activeDays.find(d => d.eidDayId === selectedDayId) || null;
  }, [activeDays, selectedDayId]);

  const activePeriods = useMemo(() => {
    return selectedDay?.periods.filter(p => p.isActive).sort((a, b) => a.startTime.localeCompare(b.startTime)) || [];
  }, [selectedDay]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long' });
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* 📅 Step 3.1: Day Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
            <CalendarDays size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-[var(--foreground)]">اختيار يوم العيد</h2>
            <p className="text-sm text-[var(--muted-foreground)] font-bold">يرجى تحديد اليوم المناسب لتوصيل الطلب</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {activeDays.length === 0 ? (
            <div className="col-span-full p-8 border-2 border-dashed border-[var(--border)] rounded-2xl text-center font-bold text-[var(--muted-foreground)]">
              لا توجد أيام نشطة حالياً
            </div>
          ) : (
            activeDays.map((day) => {
              const isActive = selectedDayId === day.eidDayId;
              return (
                <button
                  key={day.eidDayId}
                  onClick={() => {
                    onSelectedDay(day.eidDayId);
                    onSelectedPeriod(null); // Reset period when day changes
                  }}
                  className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${
                    isActive 
                      ? 'bg-indigo-50 border-indigo-500 shadow-md ring-4 ring-indigo-500/10' 
                      : 'bg-[var(--card)] border-[var(--border)] hover:border-indigo-300'
                  }`}
                >
                  <Calendar size={24} className={isActive ? 'text-indigo-600' : 'text-[var(--muted-foreground)] group-hover:text-indigo-400'} />
                  <div className="text-center">
                    <p className={`font-black text-sm ${isActive ? 'text-indigo-700' : 'text-[var(--foreground)]'}`}>
                      {day.nameAr}
                    </p>
                    <p className="text-[10px] font-bold text-[var(--muted-foreground)]">
                      {formatDate(day.date)}
                    </p>
                  </div>
                  {isActive && (
                    <motion.div 
                      layoutId="day-active"
                      className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-sm"
                    >
                      <CheckCircle2 size={12} />
                    </motion.div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 🕒 Step 3.2: Period Selection */}
      <AnimatePresence mode="wait">
        {selectedDayId && (
          <motion.div
            key={`periods-${selectedDayId}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-4 pt-4 border-t border-[var(--border)]"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
                <Clock size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-[var(--foreground)]">الفترة الزمنية</h2>
                <p className="text-sm text-[var(--muted-foreground)] font-bold">تحديد فترة التوصيل المتاحة في {selectedDay?.nameAr}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePeriods.length === 0 ? (
                <div className="col-span-full p-8 text-center font-bold text-[var(--muted-foreground)]">
                  لا توجد فترات نشطة لهذا اليوم
                </div>
              ) : (
                activePeriods.map((period) => {
                  const isActive = selectedPeriodId === period.eidDayPeriodId;
                  const isFull = period.isFull;
                  const capacityPercent = (period.currentOrders / period.maxCapacity) * 100;
                  
                  return (
                    <button
                      key={period.eidDayPeriodId}
                      disabled={isFull}
                      onClick={() => onSelectedPeriod(period.eidDayPeriodId)}
                      className={`relative p-5 rounded-3xl border-2 text-right transition-all flex flex-col gap-3 group ${
                        isActive 
                          ? 'bg-sky-50 border-sky-500 shadow-md ring-4 ring-sky-500/10' 
                          : isFull 
                            ? 'bg-red-50/50 border-red-100 opacity-60 cursor-not-allowed' 
                            : 'bg-[var(--card)] border-[var(--border)] hover:border-sky-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-colors ${
                          isActive ? 'bg-sky-500 text-white' : isFull ? 'bg-red-200 text-red-700' : 'bg-sky-50 text-sky-600 group-hover:bg-sky-100'
                        }`}>
                          <Clock size={22} />
                        </div>
                        {isActive && (
                          <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                            <CheckCircle2 size={14} />
                          </div>
                        )}
                        {isFull && !isActive && (
                          <div className="h- w-fit px-2 py-1 rounded-lg bg-red-100 text-red-600 text-[10px] font-black flex items-center gap-1">
                            <AlertTriangle size={12} />
                            ممتلئة
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className={`font-black text-lg ${isActive ? 'text-sky-900' : isFull ? 'text-red-900' : 'text-[var(--foreground)]'}`}>
                          {period.periodName}
                        </h4>
                        <p className="text-xs font-bold text-[var(--muted-foreground)] mt-1">
                          {period.startTime.slice(0, 5)} - {period.endTime.slice(0, 5)}
                        </p>
                      </div>

                      {/* Capacity Bar */}
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-black">
                          <span className={isFull ? 'text-red-600' : capacityPercent > 80 ? 'text-amber-600' : 'text-emerald-600'}>
                            {isFull ? 'الفترة ممتلئة' : `متاح ${period.availableAmount} طلب`}
                          </span>
                          <span className="text-[var(--muted-foreground)]">
                            {period.currentOrders}/{period.maxCapacity}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-[var(--border)] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${capacityPercent}%` }}
                            className={`h-full rounded-full ${
                              isFull ? 'bg-red-500' : capacityPercent > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
            
            {/* Full Warning */}
            {selectedPeriodId && activePeriods.find(p => p.eidDayPeriodId === selectedPeriodId)?.isFull && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center gap-3 text-red-700 font-bold">
                <AlertTriangle className="shrink-0" />
                <p>⚠️ هذه الفترة ممتلئة تماماً، يرجى اختيار فترة أخرى للمتابعة.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
