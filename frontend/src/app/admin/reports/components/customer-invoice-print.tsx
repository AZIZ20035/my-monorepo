'use client';

import { InvoiceResponse } from '@/dto/report.dto';

interface CustomerInvoicePrintProps {
  data: InvoiceResponse;
}

export function CustomerInvoicePrint({ data }: CustomerInvoicePrintProps) {
  return (
    <div className="bg-white text-right p-8 min-h-[297mm] flex flex-col font-sans" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
        <div className="text-right">
           <h1 className="text-3xl font-black text-slate-900 tracking-tighter">مطابخ المدفون</h1>
           <p className="text-sm font-bold text-slate-500 mt-1">الرقم الضريبي: 30045678900003</p>
        </div>
        <div className="text-left bg-slate-900 text-white p-4 rounded-2xl min-w-[180px]">
           <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">رقم الفاتورة / Invoice No.</p>
           <p className="text-2xl font-black leading-none">#{100 + data.invoiceNumber}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">بيانات العميل / Customer Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs font-bold text-slate-500">الاسم:</span>
                <span className="text-sm font-black text-slate-900">{data.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-bold text-slate-500">الجوال:</span>
                <span className="text-sm font-black text-slate-900" dir="ltr">{data.customer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-bold text-slate-500">العنوان:</span>
                <span className="text-sm font-black text-slate-900">{data.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">تفاصيل الطلب / Order Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs font-bold text-slate-500">تاريخ الطلب:</span>
                <span className="text-sm font-black text-slate-900">{data.day}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-bold text-slate-500">الفترة:</span>
                <span className="text-sm font-black text-slate-900">{data.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-bold text-slate-500">وقت التوصيل:</span>
                <span className="text-sm font-black text-slate-900">{data.deliveryDate} {data.deliveryTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="flex-1">
        <table className="w-full text-right overflow-hidden rounded-2xl border border-slate-200">
          <thead>
            <tr className="bg-slate-900 text-white text-[11px] font-black">
              <th className="px-6 py-4">المنتج / Item</th>
              <th className="px-6 py-4">الحجم / Size</th>
              <th className="px-6 py-4">نوع الطبق / Plate</th>
              <th className="px-6 py-4 text-center">الكمية / Qty</th>
              <th className="px-6 py-4 text-center">السعر / Price</th>
              <th className="px-6 py-4 text-left">الإجمالي / Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.map((item, i) => (
              <tr key={i} className="text-sm font-bold text-slate-700">
                <td className="px-6 py-4">
                  <div className="font-black text-slate-900">{item.product}</div>
                  {item.notes && <div className="text-[10px] text-slate-400 mt-1">{item.notes}</div>}
                </td>
                <td className="px-6 py-4 text-slate-500">{item.size || '-'}</td>
                <td className="px-6 py-4 text-slate-500">{item.plateType}</td>
                <td className="px-6 py-4 text-center font-black">{item.quantity} {item.portion}</td>
                <td className="px-6 py-4 text-center text-slate-500">{item.unitPrice.toLocaleString()}</td>
                <td className="px-6 py-4 text-left font-black text-slate-900">{item.totalPrice.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals & Footer */}
      <div className="mt-8 pt-8 border-t-2 border-slate-900">
        {/* Money Totals */}
        <div className="w-full bg-slate-900 text-white p-8 rounded-3xl">
          <div className="grid grid-cols-2 gap-12 items-center">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs opacity-70">
                <span>المجموع الفرعي:</span>
                <span>{data.subtotal.toLocaleString()} ر.س</span>
              </div>
              <div className="flex justify-between items-center text-xs opacity-70">
                <span>خدمة التوصيل:</span>
                <span>{data.deliveryCost.toLocaleString()} ر.س</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end border-r border-white/10 pr-12">
               <div className="flex items-center gap-8">
                  <span className="text-lg font-black opacity-70">الإجمالي الكلي:</span>
                  <span className="text-4xl font-black">{data.totalCost.toLocaleString()} ر.س</span>
               </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
             <div className="flex items-center gap-3">
                {data.remainingAmount > 0 ? (
                   <div className="bg-amber-500/20 text-amber-400 px-4 py-2 rounded-xl border border-amber-500/20 font-black text-xs uppercase tracking-widest">
                      المتبقي: {data.remainingAmount.toLocaleString()} ر.س
                   </div>
                ) : (
                   <div className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl border border-emerald-500/20 font-black text-xs uppercase tracking-widest">
                      مدفوعة بالكامل / PAID
                   </div>
                )}
             </div>
             <p className="text-[10px] font-bold opacity-30 italic">Generated per legal requirements - {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="mt-12 flex justify-between items-end border-t border-slate-100 pt-6">
           <p className="text-[9px] font-bold text-slate-300">Printed via ERP System - License #8822</p>
           <p className="text-xs font-black text-slate-900">مطابخ المدفون - جودة نثق بها</p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
            @page {
                size: A4;
                margin: 0;
            }
            body { 
                print-color-adjust: exact; 
                -webkit-print-color-adjust: exact; 
            }
        }
      `}</style>
    </div>
  );
}
