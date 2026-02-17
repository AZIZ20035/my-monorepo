'use client';

import { useReportStore } from '@/store/use-report-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Printer, 
  UserPlus, 
  CalendarCheck, 
  Search,
  Layout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export function CustomerReport() {
  const { customerData, fetchCustomer, isLoading, fromEidDayId, toEidDayId } = useReportStore();

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer, fromEidDayId, toEidDayId]);

  if (isLoading && !customerData) {
    return <div className="p-20 text-center font-bold text-slate-400 animate-pulse">جاري تحميل سجلات العملاء...</div>;
  }

  if (!customerData) return null;

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <h3 className="text-xl font-black text-[var(--foreground)] flex items-center gap-3">
          <Users className="h-6 w-6 text-purple-600" />
          سجل تفاعل العملاء
        </h3>
        <Button variant="outline" className="gap-2 rounded-xl border-[var(--border)] shadow-sm hover:bg-[var(--secondary)] text-[var(--foreground)]" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          طباعة كشوف العملاء
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'إجمالي العملاء', value: customerData.totalCustomers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-500/10' },
          { label: 'عملاء جدد', value: customerData.newCustomers, icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
          { label: 'بعقد / حجز', value: customerData.withBooking, icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-500/10' },
          { label: 'بدون حجز', value: customerData.withoutBooking, icon: Search, color: 'text-[var(--muted-foreground)]', bg: 'bg-[var(--secondary)]' },
        ].map((item, i) => (
          <Card key={i} className="bg-[var(--card)] border-[var(--border)] rounded-3xl shadow-sm overflow-hidden">
             <CardContent className="p-6">
                <div className="flex items-center gap-4">
                   <div className={`h-12 w-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center`}>
                      <item.icon className="h-6 w-6" />
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-1">{item.label}</p>
                      <h4 className="text-2xl font-black text-[var(--foreground)] text-right">{item.value}</h4>
                   </div>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-[var(--card)] border-[var(--border)] rounded-3xl overflow-hidden shadow-sm">
        <CardHeader className="bg-[var(--secondary)]/50 border-b border-[var(--border)] py-4 px-6">
          <CardTitle className="text-base font-black flex items-center gap-2 text-[var(--foreground)]">
            <Layout className="h-4 w-4 text-purple-600" />
            بيانات العملاء التفصيلية
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-right" dir="rtl">
            <thead>
              <tr className="bg-[var(--secondary)]/30 text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest border-b border-[var(--border)]">
                <th className="px-6 py-4">اسم العميل / Name</th>
                <th className="px-6 py-4">رقم الجوال / Phone</th>
                <th className="px-6 py-4 text-center">حالة العميل / Status</th>
                <th className="px-6 py-4 text-center">حالة الحجز / Booking</th>
                <th className="px-6 py-4 text-left">إجمالي الإنفاق</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {customerData.customers.map((customer, i) => (
                <tr key={i} className="hover:bg-[var(--secondary)]/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[10px] font-black text-[var(--muted-foreground)] border border-[var(--border)]">
                          {(customer.name || '?').substring(0, 1)}
                       </div>
                       <span className="text-sm font-black text-[var(--foreground)]">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-[var(--muted-foreground)] font-mono" dir="ltr">{customer.phone}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black ${
                      customer.isNewCustomer 
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                        : 'bg-[var(--secondary)] text-[var(--muted-foreground)] border border-[var(--border)]'
                    }`}>
                      {customer.isNewCustomer ? 'عميل جديد' : 'عميل سابق'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black ${
                      customer.hasBooking 
                        ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' 
                        : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    }`}>
                      {customer.hasBooking ? 'تم الحجز' : 'بدون حجز'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-left font-black text-[var(--foreground)]">
                    {customer.totalSpent?.toLocaleString() || 0} ر.س
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
