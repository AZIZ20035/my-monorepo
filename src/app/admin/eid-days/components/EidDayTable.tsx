'use client';

import { EidDayResponse } from '@/dto/eid-day.dto';
import { useEidDayStore } from '@/store/use-eid-day-store';
import {
  Calendar,
  Clock,
  Plus,
  Power,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useState, Fragment } from 'react';

interface EidDayTableProps {
  onAssignPeriod: (eidDay: EidDayResponse) => void;
}

export function EidDayTable({ onAssignPeriod }: EidDayTableProps) {
  const { eidDays, toggleEidDayActive } = useEidDayStore();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (eidDays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-[var(--secondary)] rounded-2xl border border-dashed border-[var(--border)]">
        <Calendar size={40} className="text-[var(--muted-foreground)]/30 mb-3" />
        <p className="text-[var(--muted-foreground)] font-black">لا يوجد أيام عيد معرفة حالياً</p>
      </div>
    );
  }

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-[var(--secondary)] rounded-[2rem] border border-[var(--border)] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]/20">
              <th className="px-8 py-5 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider">يوم العيد</th>
              <th className="px-8 py-5 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider text-center">الفترات</th>
              <th className="px-8 py-5 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider text-center">الحالة</th>
              <th className="px-8 py-5 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider text-left">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {eidDays.map((day, index) => (
              <Fragment key={day.eidDayId}>
                <motion.tr
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="group hover:bg-[var(--muted)]/10 transition-colors"
                >
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0784b5]/10 to-[#39ace7]/10 text-[var(--primary)] border border-[var(--primary)]/10">
                        <Calendar size={22} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[var(--foreground)]">{day.nameAr}</p>
                        <p className="text-[10px] font-bold text-[var(--muted-foreground)] mt-0.5">اليوم رقم {day.dayNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(day.eidDayId)}
                      className="h-8 px-3 rounded-lg bg-[var(--muted)]/50 hover:bg-[var(--muted)] text-sky-600 font-bold text-[10px] gap-2 border border-[var(--border)]"
                    >
                      <Clock size={12} />
                      {day.periods.length} فترات
                      {expandedId === day.eidDayId ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </Button>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black border tracking-wider ${
                      day.isActive 
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                      : 'bg-red-500/10 text-red-600 border-red-500/20'
                    }`}>
                      {day.isActive ? 'نشط' : 'معطل'}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-left">
                    <div className="flex items-center justify-end gap-2.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleEidDayActive(day.eidDayId)}
                        className={`h-10 w-10 rounded-2xl transition-all border border-transparent hover:border-current ${
                          day.isActive 
                          ? 'text-emerald-600 hover:bg-emerald-50/50' 
                          : 'text-red-500 hover:bg-red-50/50'
                        }`}
                        title={day.isActive ? 'تعطيل' : 'تفعيل'}
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => onAssignPeriod(day)}
                        className="h-9 px-4 rounded-xl bg-[var(--primary)] text-white font-bold text-[11px] gap-2 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        <Plus size={14} />
                        تعيين فترة
                      </Button>
                    </div>
                  </td>
                </motion.tr>

                <AnimatePresence>
                  {expandedId === day.eidDayId && (
                    <motion.tr
                      key={`expanded-${day.eidDayId}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-[var(--muted)]/5"
                    >
                      <td colSpan={4} className="p-0">
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="px-8 py-6 overflow-hidden"
                        >
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[var(--primary)] mb-2">
                              <Info size={16} />
                              <h4 className="text-sm font-black">الفترات المعينة لهذا اليوم</h4>
                            </div>
                            
                            {day.periods.length === 0 ? (
                              <div className="text-center py-6 bg-[var(--secondary)]/50 rounded-2xl border border-dashed border-[var(--border)]">
                                <p className="text-xs font-bold text-[var(--muted-foreground)]">لا توجد فترات معينة بعد</p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {day.periods.map((period) => (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={period.eidDayPeriodId}
                                    className="p-4 rounded-2xl bg-[var(--secondary)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all group"
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <h5 className="text-sm font-black text-[var(--foreground)]">{period.periodName}</h5>
                                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black border ${
                                        period.isActive ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'
                                      }`}>
                                        {period.isActive ? 'نشط' : 'معطل'}
                                      </span>
                                    </div>
                                    <div className="space-y-2 mt-3">
                                      <div className="flex items-center justify-between text-[10px] font-bold">
                                        <span className="text-[var(--muted-foreground)]">التوقيت:</span>
                                        <span className="text-[var(--foreground)]">{period.startTime.substring(0, 5)} - {period.endTime.substring(0, 5)}</span>
                                      </div>
                                      <div className="flex items-center justify-between text-[10px] font-bold">
                                        <span className="text-[var(--muted-foreground)]">السعة:</span>
                                        <span className="text-[var(--foreground)]">{period.currentOrders} / {period.maxCapacity}</span>
                                      </div>
                                      <div className="w-full h-1.5 bg-[var(--muted)] rounded-full overflow-hidden mt-1">
                                        <div 
                                          className={`h-full transition-all ${period.isFull ? 'bg-red-500' : 'bg-sky-500'}`}
                                          style={{ width: `${Math.min((period.currentOrders / period.maxCapacity) * 100, 100)}%` }}
                                        />
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
