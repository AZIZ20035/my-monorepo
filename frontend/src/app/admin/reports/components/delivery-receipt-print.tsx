'use client';

import { DeliveryInvoiceResponse } from '@/dto/report.dto';

interface DeliveryReceiptPrintProps {
  data: DeliveryInvoiceResponse;
}

export function DeliveryReceiptPrint({ data }: DeliveryReceiptPrintProps) {
  return (
    <div className="bg-white text-right p-8 min-h-[297mm] flex flex-col font-sans" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
        <div className="text-right">
           <h1 className="text-3xl font-black text-slate-900 tracking-tighter">مطابخ المدفون</h1>
           <p className="text-sm font-bold text-slate-500 mt-1 uppercase">كشف عمليات التسليم / DELIVERY RECEIPT</p>
        </div>
        <div className="text-left bg-slate-100 text-slate-900 p-4 rounded-2xl min-w-[180px] border border-slate-200">
           <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">رقم الطلب / Order Ref.</p>
           <p className="text-2xl font-black leading-none">#{100 + data.invoiceNumber}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 h-full flex flex-col justify-center">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">عنوان التوصيل / DELIVERY ADDRESS</h3>
             <p className="text-sm font-black text-slate-900 leading-relaxed">
                {data.address || 'لم يتم تحديد عنوان'}
             </p>
             <p className="text-[10px] font-bold text-slate-400 mt-4 leading-relaxed">
                * يرجى التأكد من دقة العنوان قبل التحرك لتفادي التأخير
             </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 h-full">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">بيانات العميل / Customer Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-xs font-bold text-slate-500">اسم العميل:</span>
                <span className="text-sm font-black text-slate-900">{data.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-bold text-slate-500">الجوال:</span>
                <span className="text-sm font-black text-slate-900" dir="ltr">{data.customer.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Checklist Table */}
      <div className="flex-1">
        <table className="w-full text-right overflow-hidden rounded-2xl border border-slate-200">
          <thead>
            <tr className="bg-slate-900 text-white text-[11px] font-black">
              <th className="px-6 py-4 w-12 text-center">✓</th>
              <th className="px-6 py-4">المنتج / Item</th>
              <th className="px-6 py-4">الحجم / Size</th>
              <th className="px-6 py-4">نوع الطبق / Plate</th>
              <th className="px-6 py-4 text-center">الكمية / Qty</th>
              <th className="px-6 py-4 text-left">ملاحظات التحقق</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.map((item, i) => (
              <tr key={i} className="text-sm font-bold text-slate-700">
                <td className="px-6 py-6 text-center border-l border-slate-100">
                   <div className="w-6 h-6 border-2 border-slate-900 rounded mx-auto"></div>
                </td>
                <td className="px-6 py-6">
                  <div className="font-black text-slate-900">{item.product}</div>
                </td>
                <td className="px-6 py-6 text-slate-500">{item.size || '-'}</td>
                <td className="px-6 py-6 text-slate-500">{item.plateType}</td>
                <td className="px-6 py-6 text-center font-black text-lg text-slate-900 bg-slate-50/50">{item.quantity}</td>
                <td className="px-6 py-6 text-left text-slate-300 italic">..................</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals & Footer */}
      <div className="mt-8 pt-8 border-t-2 border-slate-900">
        <div className="flex justify-between items-start gap-12">
          {/* Signatures Area */}
          <div className="flex-1 pt-4">
             <div className="max-w-xs space-y-8">
                <div className="border-b-2 border-slate-200 pb-2">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-4">توقيع مراجع الطلب / REVIEWER SIGNATURE</p>
                </div>
                <p className="text-[9px] font-bold text-slate-400 italic">I confirm that I have checked all the above items</p>
             </div>
          </div>

          {/* Verification Box - Detailed like Invoice */}
          <div className="w-80 space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-200">
            {(() => {
              const subtotal = data.items.reduce((sum, item) => sum + item.totalPrice, 0);
              const deliveryFee = data.totalCost - subtotal;
              return (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                    <span>المجموع الفرعي:</span>
                    <span>{subtotal.toLocaleString()} ر.س</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 border-b border-slate-200 pb-2">
                    <span>خدمة التوصيل:</span>
                    <span>{deliveryFee.toLocaleString()} ر.س</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-1">
                    <span>الإجمالي الكلي:</span>
                    <span>{data.totalCost.toLocaleString()} ر.س</span>
                  </div>
                  <div className="mt-4 bg-red-50 p-3 rounded-xl border border-red-100 flex justify-between items-center">
                    <span className="text-[10px] font-black text-red-600 uppercase">المتبقي للتحصيل:</span>
                    <span className="text-lg font-black text-red-600">{data.remainingAmount.toLocaleString()} ر.س</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
        
        <div className="mt-12 flex justify-between items-end border-t border-slate-100 pt-6">
           <p className="text-[9px] font-bold text-slate-300">Printed via ERP System - License #8822</p>
           <p className="text-xs font-black text-slate-900 uppercase tracking-widest">مطابخ المدفون - كشف العمليات</p>
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
