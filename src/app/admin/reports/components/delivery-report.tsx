'use client';

import { useReportStore } from '@/store/use-report-store';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Truck, 
  Printer, 
  MapPin, 
  Clock,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { reportService } from '@/services/report-service';
import { InvoiceResponse, DeliveryInvoiceResponse } from '@/dto/report.dto';
import { FileText, Receipt } from 'lucide-react';

interface DeliveryReportProps {
  onPrintInvoice: (data: InvoiceResponse) => void;
  onPrintReceipt: (data: DeliveryInvoiceResponse) => void;
}

export function DeliveryReport({ onPrintInvoice, onPrintReceipt }: DeliveryReportProps) {
  const { deliveryData, fetchDelivery, isLoading, fromEidDayId, toEidDayId } = useReportStore();
  const [fetchingId, setFetchingId] = useState<number | null>(null);

  useEffect(() => {
    fetchDelivery();
  }, [fetchDelivery, fromEidDayId, toEidDayId]);

  const handleFetchDocument = async (orderId: number, type: 'invoice' | 'receipt') => {
    setFetchingId(orderId);
    try {
      if (type === 'invoice') {
        const response = await reportService.getInvoice(orderId);
        if (response.data) onPrintInvoice(response.data);
      } else {
        const response = await reportService.getDeliveryInvoice(orderId);
        if (response.data) onPrintReceipt(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'تعذر تحميل المستند');
    } finally {
      setFetchingId(null);
    }
  };

  if (isLoading && !deliveryData) {
    return <div className="p-20 text-center font-bold text-slate-400 animate-pulse">جاري تحميل كشوف التوصيل...</div>;
  }

  if (!deliveryData) return null;

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
          <Truck className="h-6 w-6 text-indigo-600" />
          تقرير التوزيع اللوجستي
        </h3>
        <Button variant="outline" className="gap-2 rounded-xl border-slate-200 shadow-sm hover:bg-slate-50" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          طباعة كشوف التوصيل
        </Button>
      </div>

      <div className="space-y-12">
        {deliveryData.byArea
          .map(area => ({
             ...area,
             totalValue: area.orders.reduce((sum, o) => sum + o.totalCost, 0)
          }))
          .sort((a, b) => b.totalValue - a.totalValue) // FINANCIAL ORDER
          .map((area, i) => (
            <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-sm shadow-indigo-100/20 text-right">
              {/* Area Header */}
              <div className="bg-[var(--secondary)] border-b border-[var(--border)] px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-100">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-[var(--foreground)]">{area.area}</h4>
                    <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest mt-0.5">منطقة التوزيع / Neighborhood</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-[var(--background)] px-5 py-3 rounded-2xl border border-[var(--border)] shadow-sm">
                   <div className="text-right">
                      <p className="text-[9px] font-black text-[var(--muted-foreground)] uppercase leading-none mb-1">القيمة الإجمالية للمنطقة</p>
                      <p className="text-lg font-black text-indigo-600 leading-none">{area.totalValue.toLocaleString()} ر.س</p>
                   </div>
                </div>
              </div>

              {/* Table View */}
              <div className="overflow-x-auto">
                <table className="w-full text-right" dir="rtl">
                  <thead>
                    <tr className="bg-[var(--secondary)]/50 text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-tighter border-b border-[var(--border)]">
                      <th className="px-8 py-4 w-20 text-center"># الطلب</th>
                      <th className="px-6 py-4">العميل والجوال</th>
                      <th className="px-6 py-4">العنوان التفصيلي</th>
                      <th className="px-6 py-4">الفترة والوقت</th>
                      <th className="px-6 py-4 text-center">الإجمالي</th>
                      <th className="px-6 py-4 text-center">المتبقي</th>
                      <th className="px-8 py-4 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {area.orders.map((order, j) => (
                      <tr key={j} className="hover:bg-[var(--secondary)]/50 transition-colors group">
                        <td className="px-8 py-5 text-center">
                          <span className="inline-flex px-2 py-1 bg-[var(--foreground)] text-[var(--background)] rounded-lg text-[11px] font-black">
                             #{100 + order.orderId}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-[var(--foreground)]">{order.customerName}</span>
                            <span className="text-[10px] font-bold text-[var(--muted-foreground)] font-mono" dir="ltr">{order.customerPhone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                           <p className="text-xs font-bold text-[var(--muted-foreground)] max-w-[250px] leading-relaxed line-clamp-2">
                             {order.address}
                           </p>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex flex-col gap-1">
                              <span className="text-[11px] font-bold text-[var(--muted-foreground)] flex items-center gap-1.5">
                                 <Clock className="h-3 w-3" />
                                 {order.period}
                              </span>
                              <span className="text-[11px] font-black text-indigo-600">
                                 {order.deliveryTime || 'غير محدد'}
                              </span>
                           </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                           <span className="text-sm font-black text-[var(--foreground)]">
                              {order.totalCost.toLocaleString()}
                           </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                           {order.remainingAmount > 0 ? (
                              <span className="inline-flex items-center px-2 py-1 bg-red-500/10 text-red-500 rounded-lg text-[11px] font-black border border-red-500/20">
                                 {order.remainingAmount.toLocaleString()} ر.س
                              </span>
                           ) : (
                              <span className="text-[var(--muted-foreground)] text-[10px] font-bold">مدفوع</span>
                           )}
                        </td>
                        <td className="px-8 py-5">
                           <div className="flex items-center justify-center gap-2">
                              {/* Map Action */}
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 border border-transparent hover:border-indigo-100 transition-all"
                                onClick={() => {
                                  if (order.address) {
                                    const query = encodeURIComponent(order.address);
                                    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                                  } else {
                                    toast.error('لم يتم تحديد موقع للعميل');
                                  }
                                }}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>

                              <div className="h-4 w-[1px] bg-[var(--border)] mx-1" />

                              {/* Print Invoice */}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-9 px-4 gap-2 rounded-xl text-[11px] font-black bg-[var(--card)] border-[var(--border)] shadow-sm hover:border-emerald-500 hover:text-emerald-600 transition-all"
                                disabled={fetchingId === order.orderId}
                                onClick={() => handleFetchDocument(order.orderId, 'invoice')}
                              >
                                <FileText className={`h-3.5 w-3.5 ${fetchingId === order.orderId ? 'animate-pulse' : ''}`} />
                                الفاتورة
                              </Button>

                              {/* Print Receipt */}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-9 px-4 gap-2 rounded-xl text-[11px] font-black bg-[var(--card)] border-[var(--border)] shadow-sm hover:border-blue-500 hover:text-blue-600 transition-all"
                                disabled={fetchingId === order.orderId}
                                onClick={() => handleFetchDocument(order.orderId, 'receipt')}
                              >
                                <Receipt className={`h-3.5 w-3.5 ${fetchingId === order.orderId ? 'animate-pulse' : ''}`} />
                                فاتورة التسليم
                              </Button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
