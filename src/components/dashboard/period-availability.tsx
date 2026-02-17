'use client';

import { motion } from 'framer-motion';
import { PeriodAvailability as PeriodDto } from '@/dto/dashboard.dto';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PeriodAvailabilityProps {
  periods: PeriodDto[];
  loading: boolean;
}

export function PeriodAvailability({ periods, loading }: PeriodAvailabilityProps) {
  if (loading) {
    return <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />;
  }

  return (
    <Card className="p-6 border-none shadow-sm">
      <h3 className="text-lg font-bold mb-4">توفر الفترات (السعة الاستيعابية)</h3>
      <div className="space-y-6">
        {periods.map((period, index) => {
          // Calculate percentage based on (total - available) / total
          const used = period.total - period.available;
          const percentage = period.total > 0 ? Math.round((used / period.total) * 100) : 0;
          const isFull = period.isFull || period.available <= 0;
          
          return (
            <motion.div 
              key={`${period.eidDayPeriodId}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-semibold ml-2">{period.dayName}</span>
                  <span className="text-sm text-gray-500">({period.periodName})</span>
                </div>
                <div className="text-sm">
                  <span className={isFull ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
                    {isFull ? 'مكتمل' : 'متاح'}
                  </span>
                  <span className="text-gray-400 mx-2">|</span>
                  <span>{used} / {period.total}</span>
                </div>
              </div>
              <Progress 
                value={percentage} 
                className={`h-2.5 ${isFull ? 'bg-red-100' : 'bg-gray-100'}`}
              /> 
            </motion.div>
          );
        })}
        {periods.length === 0 && (
          <p className="text-center text-gray-500 py-4">لا توجد بيانات توفر متاحة حالياً</p>
        )}
      </div>
    </Card>
  );
}
