'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  BarChart3, 
  DollarSign, 
  ChefHat, 
  Truck, 
  Users 
} from 'lucide-react';

interface ReportTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin: boolean;
}

export function ReportTabs({ activeTab, onTabChange, isAdmin }: ReportTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="bg-[var(--secondary)] border border-[var(--border)] h-20 p-2 rounded-2xl shadow-sm w-full justify-between">
        {isAdmin && (
          <>
            <TabsTrigger value="management" className="flex-col gap-1 h-full flex-1 rounded-xl data-[state=active]:bg-[var(--card)] data-[state=active]:shadow-sm">
              <BarChart3 className="h-5 w-5" />
              <span className="text-[10px] sm:text-xs font-black">ملخص الإدارة</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex-col gap-1 h-full flex-1 rounded-xl data-[state=active]:bg-[var(--card)] data-[state=active]:shadow-sm">
              <DollarSign className="h-5 w-5" />
              <span className="text-[10px] sm:text-xs font-black">التقرير المالي</span>
            </TabsTrigger>
          </>
        )}
        <TabsTrigger value="kitchen" className="flex-col gap-1 h-full flex-1 rounded-xl data-[state=active]:bg-[var(--card)] data-[state=active]:shadow-sm">
          <ChefHat className="h-5 w-5" />
          <span className="text-[10px] sm:text-xs font-black">تقرير المطبخ</span>
        </TabsTrigger>
        <TabsTrigger value="delivery" className="flex-col gap-1 h-full flex-1 rounded-xl data-[state=active]:bg-[var(--card)] data-[state=active]:shadow-sm">
          <Truck className="h-5 w-5" />
          <span className="text-[10px] sm:text-xs font-black">تقرير التوصيل</span>
        </TabsTrigger>
        <TabsTrigger value="customers" className="flex-col gap-1 h-full flex-1 rounded-xl data-[state=active]:bg-[var(--card)] data-[state=active]:shadow-sm">
          <Users className="h-5 w-5" />
          <span className="text-[10px] sm:text-xs font-black">بيانات العملاء</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
