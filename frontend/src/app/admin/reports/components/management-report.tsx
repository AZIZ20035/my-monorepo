'use client';

import { useEffect } from 'react';
import { useReportStore } from '@/store/use-report-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  ClipboardList, 
  Printer, 
  Timer, 
  LayoutDashboard, 
  ChefHat,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ManagementReport() {
  const { managementData, fetchManagement, isLoading, fromEidDayId, toEidDayId } = useReportStore();

  useEffect(() => {
    fetchManagement();
  }, [fetchManagement, fromEidDayId, toEidDayId]);

  if (isLoading && !managementData) {
    return <div className="p-20 text-center font-bold text-slate-400 animate-pulse">جاري تحميل بيانات الإدارة...</div>;
  }

  if (!managementData) return null;

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <h3 className="text-xl font-black text-[var(--foreground)] flex items-center gap-3">
          <ClipboardList className="h-6 w-6 text-blue-600" />
          تقرير الإدارة والمتابعة
        </h3>
        <Button variant="outline" className="gap-2 rounded-xl border-[var(--border)] shadow-sm hover:bg-[var(--secondary)] text-[var(--foreground)]" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          طباعة التقرير الإداري
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Breakdown by Day and Period */}
          <div className="space-y-6 text-right">
             <h4 className="text-sm font-black text-[var(--muted-foreground)] uppercase tracking-widest flex items-center gap-2">
                <Timer className="h-4 w-4" />
                توزيع الإنتاج حسب الفترات
             </h4>
             {managementData.byDay.map((day, i) => (
                <Card key={i} className="bg-[var(--card)] border-[var(--border)] rounded-3xl overflow-hidden shadow-sm">
                   <CardHeader className="bg-[var(--secondary)]/50 border-b border-[var(--border)] py-4 px-6 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-black text-[var(--foreground)]">
                         اليوم: {day.day}
                      </CardTitle>
                      <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest bg-[var(--background)] px-3 py-1 rounded-full border border-[var(--border)]">
                         إجمالي اليوم: {day.orderCount} طلب
                      </div>
                   </CardHeader>
                   <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 text-right">
                         {day.byPeriod.map((p, j) => (
                            <div key={j} className="bg-[var(--secondary)]/50 rounded-2xl p-4 border border-[var(--border)] hover:bg-[var(--card)] hover:shadow-sm transition-all">
                               <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase mb-2">{p.period}</p>
                               <div className="flex justify-between items-end">
                                  <span className="text-2xl font-black text-[var(--foreground)]">{p.count}</span>
                                  <span className="text-[10px] font-bold text-[var(--muted-foreground)]">ذبيحة/طلب</span>
                               </div>
                            </div>
                         ))}
                      </div>
                   </CardContent>
                </Card>
             ))}
          </div>

          {/* By Category / Carcass Type */}
          <Card className="bg-[var(--card)] border-[var(--border)] rounded-3xl overflow-hidden shadow-sm">
             <CardHeader className="bg-[var(--secondary)]/50 border-b border-[var(--border)] px-6 py-4">
                <CardTitle className="text-base font-black flex items-center gap-2 text-[var(--foreground)]">
                   <ChefHat className="h-4 w-4 text-blue-600" />
                   تنوع الإنتاج (الذبائح ونوع الطبخ)
                </CardTitle>
             </CardHeader>
             <CardContent className="p-0">
                <table className="w-full text-right" dir="rtl">
                   <thead>
                      <tr className="bg-[var(--secondary)]/30 text-[10px] font-black text-[var(--muted-foreground)] border-b border-[var(--border)]">
                         <th className="px-6 py-3">الصنف / نوع الطبخ</th>
                         <th className="px-6 py-3 text-center">الكمية / عدد الذبائح</th>
                         <th className="px-6 py-3 text-left">الإيرادات المحققة</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[var(--border)]">
                      {managementData.byCategory.map((cat, i) => (
                         <tr key={i} className="hover:bg-[var(--secondary)]/50 transition-colors">
                            <td className="px-6 py-4">
                               <span className="text-sm font-black text-[var(--foreground)]">{cat.category}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                               <span className="inline-flex h-9 min-w-[50px] items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 font-black text-base shadow-inner px-4">
                                  {cat.quantity}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-left font-bold text-[var(--muted-foreground)]">
                               {cat.revenue.toLocaleString()} <span className="text-[10px]">ر.س</span>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-slate-900 dark:bg-[var(--card)] text-white dark:text-[var(--foreground)] rounded-[2.5rem] border-none dark:border border-[var(--border)] shadow-2xl p-8 relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8 opacity-60">
                   <LayoutDashboard className="h-5 w-5" />
                   <p className="text-[10px] font-black uppercase tracking-widest">إجمالي اليوم / DAILY TOTAL</p>
                </div>
                <div className="space-y-8">
                   <div className="flex items-center justify-between">
                      <div>
                         <p className="text-[10px] font-bold text-blue-300 dark:text-[var(--muted-foreground)] mb-1 uppercase tracking-tight">إجمالي الإيرادات / REVENUE</p>
                         <h4 className="text-4xl font-black">{managementData.totalRevenue.toLocaleString()}</h4>
                      </div>
                      <TrendingUp className="h-8 w-8 text-emerald-400 opacity-20" />
                   </div>
                   <div className="pt-8 border-t border-white/10 dark:border-[var(--border)] flex items-center justify-between">
                      <div>
                         <p className="text-[10px] font-bold text-blue-300 dark:text-[var(--muted-foreground)] mb-1 uppercase tracking-tight">إجمالي عدد الطلبات / ORDERS</p>
                         <h4 className="text-3xl font-black">{managementData.totalOrders}</h4>
                      </div>
                      <ShoppingBag className="h-6 w-6 text-blue-400 opacity-20" />
                   </div>
                </div>
                <div className="mt-10 pt-6 border-t border-white/10 dark:border-[var(--border)] text-[10px] font-bold text-blue-300/50 dark:text-[var(--muted-foreground)]/50 italic">
                   * التقرير يغطي الفترات المختارة في الفلتر العلوي
                </div>
             </div>
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
          </Card>

          <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10">
             <h4 className="text-xs font-black text-[var(--foreground)] mb-4 flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-blue-500" />
                ملاحظات المتابعة الإدارية
             </h4>
             <ul className="space-y-3">
                <li className="flex gap-3 text-xs font-bold text-[var(--muted-foreground)]">
                   <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                   يرجى التأكد من تسوية كافة العهود المالية في نهاية كل فترة
                </li>
                <li className="flex gap-3 text-xs font-bold text-[var(--muted-foreground)]">
                   <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                   مراجعة تقارير المرتجعات وإلغاء الطلبات بشكل دوري
                </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
