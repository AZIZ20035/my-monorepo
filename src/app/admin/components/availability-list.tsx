'use client';

import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PeriodAvailability } from '@/dto/dashboard.dto';

interface AvailabilityListProps {
  availability: PeriodAvailability[];
}

export function AvailabilityList({ availability }: AvailabilityListProps) {
  return (
    <div className="h-full flex flex-col gap-6 lg:gap-8 min-h-0">
      <Card className="flex-1 flex flex-col p-4 lg:p-8 border-[var(--border)] bg-[var(--background)] shadow-2xl shadow-gray-200/50 dark:shadow-none rounded-2xl lg:rounded-3xl overflow-hidden min-h-0">
        <h3 className="shrink-0 text-lg lg:text-xl font-black mb-6 lg:mb-8 flex items-center gap-2 text-orange-600">
          <Utensils size={20} />
          توفر الفترات اليوم
        </h3>
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-6 lg:space-y-8 scrollbar-hide">
          {availability.length > 0 ? (
            availability.map((item) => {
              const available = item.available ?? 0;
              const total = item.total ?? 0;
              const percentage = total > 0 ? Math.round(((total - available) / total) * 100) : 0;
              
              return (
                <div key={item.eidDayPeriodId} className="space-y-2 lg:space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="font-black text-[var(--foreground)] text-xs lg:text-sm">{item.dayName}</h4>
                      <p className="text-[9px] lg:text-[10px] text-[var(--muted-foreground)] font-bold">{item.periodName}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-xs lg:text-sm font-black text-[var(--foreground)] leading-none">{percentage}%</p>
                      <p className="text-[9px] lg:text-[10px] text-[var(--muted-foreground)] font-bold mt-1">
                        {item.isFull ? 'مكتمل' : `متبقي ${available}`}
                      </p>
                    </div>
                  </div>
                  <div className="h-2.5 lg:h-3 w-full bg-[var(--secondary)] rounded-full overflow-hidden p-0.5">
                    <motion.div 
                      className={`h-full rounded-full bg-gradient-to-l ${
                        item.isFull || percentage > 90 
                          ? 'from-red-500 to-red-600' 
                          : percentage > 70 
                            ? 'from-orange-500 to-orange-600' 
                            : 'from-[#0784b5] to-[#39ace7]'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, type: 'spring' }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-[var(--muted-foreground)] font-bold">لا توجد فترات متاحة</p>
          )}
        </div>
        <Button className="shrink-0 w-full mt-6 lg:mt-8 rounded-xl bg-[var(--secondary)] text-[var(--foreground)] font-bold py-5 lg:py-6 hover:bg-[var(--border)] transition-all text-sm lg:text-base">
          إدارة الفترات
        </Button>
      </Card>

      <Card className="shrink-0 p-6 lg:p-8 border-none bg-gradient-to-br from-[#0784b5] to-[#055574] text-white shadow-xl shadow-[#0784b5]/30 rounded-2xl lg:rounded-3xl relative overflow-hidden group">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
        <h3 className="text-base lg:text-lg font-black mb-2 relative z-10">تحتاج مساعدة؟</h3>
        <p className="text-xs lg:text-sm text-blue-100 mb-6 relative z-10">راجع دليل الاستخدام السريع للنظام أو تواصل مع الدعم الفني</p>
        <Button className="w-full bg-white text-[#0784b5] hover:bg-blue-50 font-black rounded-xl py-5 lg:py-6 relative z-10 text-sm lg:text-base">
          الدعم الفني
        </Button>
      </Card>
    </div>
  );
}
