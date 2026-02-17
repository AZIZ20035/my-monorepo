'use client';

import { useEffect } from 'react';
import { useReportStore } from '@/store/use-report-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  ChefHat, 
  Hash, 
  Layers,
  Package,
  Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function KitchenReport() {
  const { kitchenData, fetchKitchen, isLoading, eidDayId, periodId } = useReportStore();

  useEffect(() => {
    fetchKitchen();
  }, [fetchKitchen, eidDayId, periodId]);

  if (isLoading && !kitchenData) {
    return <div className="p-20 text-center font-bold text-[var(--muted-foreground)] animate-pulse">جاري تحميل تقرير المطبخ...</div>;
  }

  if (!kitchenData) return null;

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <h3 className="text-xl font-black text-[var(--foreground)] flex items-center gap-3">
          <ChefHat className="h-6 w-6 text-indigo-600" />
          تقرير المطبخ والإنتاج
        </h3>
        <Button variant="outline" className="gap-2 rounded-xl border-slate-200 shadow-sm hover:bg-slate-50" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          طباعة كشوف المطبخ
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Categories & Products */}
        <div className="xl:col-span-3 space-y-8">
          {kitchenData.categories.map((cat, i) => (
            <Card key={i} className="bg-[var(--card)] border-[var(--border)] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow print:shadow-none print:border-slate-200 text-right">
              <CardHeader className="bg-[var(--secondary)]/50 border-b border-[var(--border)] py-4 px-6">
                <CardTitle className="text-base font-black flex items-center justify-between text-[var(--foreground)]">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-indigo-600" />
                    {cat.category}
                  </div>
                  <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">تجهيز الأصناف</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-right" dir="rtl">
                  <thead>
                    <tr className="bg-[var(--secondary)]/30 text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-tighter border-b border-[var(--border)]">
                      <th className="px-6 py-3">المنتج / Detail</th>
                      <th className="px-6 py-3">الحجم / Size</th>
                      <th className="px-6 py-3 text-center">الكمية الإجمالية / Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {cat.products.map((prod, j) => (
                      <tr key={j} className="hover:bg-[var(--secondary)]/50 transition-colors">
                        <td className="px-6 py-4">
                           <span className="text-sm font-black text-[var(--foreground)]">{prod.product}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-[var(--muted-foreground)]">{prod.size || '-'}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex h-9 w-14 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 font-black text-base shadow-inner">
                             {prod.total}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Plates Summary */}
        <div className="space-y-8">
          <Card className="bg-[var(--card)] border-[var(--border)] rounded-3xl overflow-hidden shadow-sm print:border-slate-200 text-right">
            <CardHeader className="bg-[var(--secondary)]/50 border-b border-[var(--border)]">
              <CardTitle className="text-base font-black flex items-center gap-2 text-[var(--foreground)]">
                <Layers className="h-4 w-4 text-indigo-600" />
                توزيع الصحون والعلب
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-[var(--border)]">
                 {kitchenData.plates.map((plate, i) => (
                   <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-[var(--secondary)]/50 transition-colors">
                     <span className="text-sm font-bold text-[var(--muted-foreground)]">{plate.plateType}</span>
                     <span className="h-9 w-12 rounded-xl bg-[var(--secondary)] flex items-center justify-center font-black text-sm border border-[var(--border)] text-[var(--foreground)]">
                       {plate.count}
                     </span>
                   </div>
                 ))}
                 {kitchenData.plates.length === 0 && (
                   <div className="p-8 text-center text-xs font-bold text-[var(--muted-foreground)] italic">لا توجد بيانات صحون</div>
                 )}
               </div>
            </CardContent>
          </Card>

          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 rounded-[2.5rem] shadow-xl shadow-indigo-100 border border-indigo-400/20">
             <div className="flex items-center justify-between mb-4">
               <p className="text-indigo-100 font-bold text-[10px] uppercase tracking-widest">إجمالي الطلبات</p>
               <Hash className="h-4 w-4 opacity-40" />
             </div>
             <h3 className="text-4xl font-black flex items-baseline gap-2">
                {kitchenData.totalOrders}
                <span className="text-sm font-normal text-indigo-200">طلب مؤكد</span>
             </h3>
             <div className="mt-6 pt-4 border-t border-white/10 text-[10px] font-bold text-indigo-100 italic">
                * جميع الكميات مجمعة حسب التصنيف والفترة المختارة
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
