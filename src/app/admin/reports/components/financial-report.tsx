'use client';

import { useReportStore } from '@/store/use-report-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  DollarSign, 
  Printer, 
  Wallet, 
  BarChart3, 
  ArrowUpRight, 
  FileText,
  CreditCard,
  PieChart,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export function FinancialReport() {
  const { financialData, fetchFinancial, isLoading, fromEidDayId, toEidDayId } = useReportStore();

  useEffect(() => {
    fetchFinancial();
  }, [fetchFinancial, fromEidDayId, toEidDayId]);

  if (isLoading && !financialData) {
    return <div className="p-20 text-center font-bold text-slate-400 animate-pulse">جاري تحميل البيانات المالية...</div>;
  }

  if (!financialData) return null;

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <h3 className="text-xl font-black text-[var(--foreground)] flex items-center gap-3">
          <DollarSign className="h-6 w-6 text-emerald-600" />
          التقرير المالي والحسابات
        </h3>
        <Button variant="outline" className="gap-2 rounded-xl border-slate-200 shadow-sm hover:bg-slate-50" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          طباعة كشوف الحسابات
        </Button>
      </div>

      {/* Main KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'إجمالي قيمة المبيعات', value: financialData.totalRevenue, icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'المبالغ المحصلة', value: financialData.totalPaid, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'المبالغ المتبقية', value: financialData.totalUnpaid, icon: ArrowUpRight, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'عدد الفواتير الكلي', value: financialData.totalInvoices, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((item, i) => (
          <Card key={i} className="bg-[var(--card)] border-[var(--border)] rounded-3xl shadow-sm overflow-hidden">
            <CardContent className="p-6">
               <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-1">{item.label}</p>
                    <h4 className="text-2xl font-black text-[var(--foreground)]">{item.value.toLocaleString()}</h4>
                  </div>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Payment Methods */}
        <Card className="bg-[var(--card)] border-[var(--border)] rounded-3xl overflow-hidden shadow-sm">
          <CardHeader className="bg-[var(--secondary)]/50 border-b border-[var(--border)] py-4 px-6">
            <CardTitle className="text-base font-black flex items-center gap-2 text-[var(--foreground)]">
              <CreditCard className="h-4 w-4 text-emerald-600" />
              طرق الدفع والتحصيل
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-[var(--border)]">
               {financialData.paymentsByMethod.map((method, i) => (
                 <div key={i} className="px-6 py-5 flex items-center justify-between hover:bg-[var(--secondary)]/50 transition-colors">
                   <div className="flex flex-col">
                      <span className="text-sm font-black text-[var(--foreground)]">{method.method}</span>
                      <span className="text-[10px] font-bold text-[var(--muted-foreground)]">تحصيل مباشر</span>
                   </div>
                   <span className="text-base font-black text-[var(--foreground)]">{method.amount.toLocaleString()} <span className="text-[10px] font-bold text-[var(--muted-foreground)]">ر.س</span></span>
                 </div>
               ))}
               {financialData.paymentsByMethod.length === 0 && (
                 <div className="p-12 text-center text-xs font-bold text-[var(--muted-foreground)] italic">لا توجد عمليات دفع مسجلة</div>
               )}
             </div>
          </CardContent>
        </Card>

        {/* Payment Status Breakdown */}
        <div className="xl:col-span-2 space-y-8">
          <Card className="bg-[var(--card)] border-[var(--border)] rounded-3xl overflow-hidden shadow-sm">
            <CardHeader className="bg-[var(--secondary)]/50 border-b border-[var(--border)] py-4 px-6">
              <CardTitle className="text-base font-black flex items-center gap-2 text-[var(--foreground)]">
                <PieChart className="h-4 w-4 text-emerald-600" />
                توزيع فواتير الموسم حسب حالة السداد
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-right" dir="rtl">
                <thead>
                  <tr className="bg-[var(--secondary)]/30 text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest border-b border-[var(--border)]">
                    <th className="px-6 py-4">حالة السداد / Status</th>
                    <th className="px-6 py-4 text-center">عدد الفواتير / Count</th>
                    <th className="px-6 py-4 text-left">المبلغ الإجمالي / Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-sm">
                  {financialData.byPaymentStatus.map((status, i) => (
                    <tr key={i} className="hover:bg-[var(--secondary)]/50 transition-colors">
                      <td className="px-6 py-5">
                         <span className="font-black text-[var(--foreground)]">{status.status}</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                         <span className="inline-flex h-8 w-12 items-center justify-center rounded-xl bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] font-bold">
                            {status.count}
                         </span>
                      </td>
                      <td className="px-6 py-5 text-left font-black text-[var(--foreground)]">
                        {status.amount.toLocaleString()} ر.س
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-8 rounded-[2.5rem] shadow-xl shadow-emerald-100 border border-emerald-400/20">
             <div className="flex items-center justify-between mb-6">
               <p className="text-emerald-100 font-bold text-[10px] uppercase tracking-widest">إجمالي المبيعات المؤكدة</p>
               <TrendingUp className="h-5 w-5 opacity-40" />
             </div>
             <div className="flex justify-between items-end">
                <h3 className="text-4xl font-black">
                   {financialData.totalRevenue.toLocaleString()}
                   <span className="text-lg font-normal text-emerald-200 mr-2">ر.س</span>
                </h3>
                <div className="text-left bg-white/10 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-sm">
                   <p className="text-[10px] font-bold text-emerald-100 mb-0.5">نسبة التحصيل</p>
                   <p className="text-lg font-black">
                      {financialData.totalRevenue > 0 
                        ? ((financialData.totalPaid / financialData.totalRevenue) * 100).toFixed(1) 
                        : 0}%
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
