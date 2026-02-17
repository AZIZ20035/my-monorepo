'use client';

import { useEffect, useState } from 'react';
import { useKitchenStore } from '@/store/use-kitchen-store';
import { useEidDayStore } from '@/store/use-eid-day-store';
import { 
  ChefHat, 
  LayoutDashboard, 
  ClipboardList, 
  RefreshCw,
  Printer,
  ChevronDown,
  Calendar,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from 'framer-motion';

// Inner Components
import { KitchenOrders } from './components/KitchenOrders';
import { KitchenSummary } from './components/KitchenSummary';

export default function KitchenPage() {
  const { 
    orders, 
    summary, 
    periods, 
    filters, 
    setFilters, 
    refreshAll, 
    isLoading 
  } = useKitchenStore();
  
  const { eidDays, fetchEidDays } = useEidDayStore();
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    fetchEidDays();
    refreshAll();
    
    // Auto-refresh every 15 seconds
    const interval = setInterval(refreshAll, 15000);
    return () => clearInterval(interval);
  }, [fetchEidDays, refreshAll]);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-[var(--primary)] text-white flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
            <ChefHat size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--foreground)]">لوحة المطبخ</h1>
            <p className="text-[var(--muted-foreground)] font-bold">متابعة الإنتاج والتحضير المباشر</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => refreshAll()}
            disabled={isLoading}
            className="rounded-xl h-11 w-11"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </Button>
          <Button 
            className="bg-gradient-to-l from-[#0784b5] to-[#39ace7] text-white font-black rounded-xl h-11 px-6 gap-2 shadow-lg shadow-[#39ace7]/20 border-none"
            onClick={() => window.print()}
          >
            <Printer size={18} />
            طباعة التقرير
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-6 py-2">
        <div className="flex items-center gap-3 flex-1 min-w-[250px]">
          <div className="text-[var(--primary)] flex items-center justify-center shrink-0">
            <Calendar size={20} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-1 mr-1">يوم العيد</p>
            <Select 
              className="h-11 rounded-xl font-bold border-2 bg-transparent shadow-none border-[var(--border)]"
              value={filters.eidDayId?.toString()} 
              onValueChange={(val) => setFilters({ eidDayId: parseInt(val), periodId: undefined })}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر يوم العيد" />
              </SelectTrigger>
              <SelectContent>
                {eidDays.map((day) => (
                  <SelectItem key={day.eidDayId} value={day.eidDayId.toString()} className="font-bold">
                    {day.nameAr} ({new Date(day.date).toLocaleDateString('ar-SA')})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-1 min-w-[250px]">
          <div className="text-[var(--primary)] flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-1 mr-1">الفترة الزمنية</p>
            <Select 
              className="h-11 rounded-xl font-bold border-2 bg-transparent shadow-none border-[var(--border)]"
              value={filters.periodId?.toString() || "all"} 
              onValueChange={(val) => setFilters({ periodId: val === "all" ? undefined : parseInt(val) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="كل الفترات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-bold">كل الفترات</SelectItem>
                {periods.map((period) => (
                  <SelectItem key={period.eidDayPeriodId} value={period.eidDayPeriodId.toString()} className="font-bold">
                    {period.periodName} ({period.orderCount} طلب)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-transparent p-0 rounded-none h-auto self-start border-none max-w-2xl gap-2">
            <TabsTrigger 
              value="orders" 
              className="rounded-xl px-10 py-3 font-black data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-[var(--primary)] transition-all gap-3"
            >
              <div className="flex items-center gap-2 relative z-10">
                <ClipboardList size={20} />
                <span className="text-base">طلبات المباشرة</span>
                <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs h-6 w-6 flex items-center justify-center rounded-full font-black">
                  {orders.length}
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="summary" 
              className="rounded-xl px-10 py-3 font-black data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-[var(--primary)] transition-all gap-3"
            >
              <div className="flex items-center gap-2 relative z-10">
                <LayoutDashboard size={20} />
                <span className="text-base">ملخص التحضير</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="orders" className="m-0">
               <KitchenOrders orders={orders} />
            </TabsContent>
            
            <TabsContent value="summary" className="m-0">
              <KitchenSummary summary={summary} />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
