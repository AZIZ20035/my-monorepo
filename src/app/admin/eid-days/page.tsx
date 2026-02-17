'use client';

import { useEffect, useState } from 'react';
import { useEidDayStore } from '@/store/use-eid-day-store';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { EidDayTable } from './components/EidDayTable';
import { PeriodAssignmentModal } from './components/PeriodAssignmentModal';
import { EidDayResponse } from '@/dto/eid-day.dto';

export default function EidDaysPage() {
  const { fetchEidDays, isLoading } = useEidDayStore();
  
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<EidDayResponse | null>(null);
  
  useEffect(() => {
    fetchEidDays();
  }, [fetchEidDays]);

  const handleAssignPeriod = (day: EidDayResponse) => {
    setSelectedDay(day);
    setIsAssignModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col space-y-6 lg:space-y-8 pb-4 overflow-hidden">
      {/* ═══════════ HEADER ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 bg-[var(--secondary)] border border-[var(--border)] p-6 lg:p-8 rounded-2xl lg:rounded-[2rem] shadow-sm shrink-0"
      >
        <div className="flex items-center gap-4 lg:gap-5">
          <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shadow-sm border border-[var(--primary)]/20 shrink-0">
            <Calendar className="h-6 w-6 lg:h-7 lg:w-7" />
          </div>
          <div className="space-y-0.5 lg:space-y-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[var(--foreground)] tracking-tight">
              إدارة أيام العيد
            </h1>
            <p className="text-[var(--muted-foreground)] font-bold text-xs sm:text-sm lg:text-base">
              عرض أيام العيد وتعيين فترات العمل لكل يوم
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-sky-50 border border-sky-100 rounded-xl">
          <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
          <span className="text-[10px] font-black text-sky-700">وضع العرض والتعيين فقط</span>
        </div>
      </motion.div>

      {/* ═══════════ CONTENT ═══════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 min-h-0 overflow-hidden"
      >
        <div className="h-full overflow-y-auto custom-scrollbar pb-6">
          <EidDayTable onAssignPeriod={handleAssignPeriod} />
        </div>
      </motion.div>

      {/* ═══════════ MODALS ═══════════ */}
      <PeriodAssignmentModal 
        isOpen={isAssignModalOpen} 
        onClose={() => setIsAssignModalOpen(false)} 
        eidDay={selectedDay}
      />
    </div>
  );
}
