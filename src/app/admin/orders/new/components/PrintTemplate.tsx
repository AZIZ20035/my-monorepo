'use client';

import { CartItem } from './PricePicker';

interface PrintTemplateProps {
  order: {
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    items: CartItem[];
    total: number;
    paidAmount: number;
    notes?: string;
  };
}

export function PrintTemplate({ order }: PrintTemplateProps) {
  const { orderNumber, customerName, customerPhone, items, total, paidAmount, notes } = order;
  const remaining = Math.max(0, total - paidAmount);
  const now = new Date().toLocaleString('ar-SA');

  return (
    <div 
      id="thermal-receipt" 
      className="hidden print:block bg-white text-black p-4 w-[80mm] font-sans text-sm"
      dir="rtl"
    >
      <div className="text-center space-y-2 border-b-2 border-dashed border-black pb-4 mb-4">
        <h1 className="text-2xl font-black">مطابخ المدفون</h1>
        <p className="text-xs font-bold text-gray-600">فرع السوق المركزي - صبيا</p>
        <p className="text-xs font-bold">هاتف: 0500000000</p>
      </div>

      <div className="space-y-1 mb-4 text-xs font-bold">
        <div className="flex justify-between">
          <span>فاتورة رقم:</span>
          <span className="font-black text-lg">#{orderNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>التاريخ:</span>
          <span>{now}</span>
        </div>
        <div className="flex justify-between">
          <span>العميل:</span>
          <span>{customerName}</span>
        </div>
        <div className="flex justify-between">
          <span>الجوال:</span>
          <span>{customerPhone}</span>
        </div>
      </div>

      <table className="w-full text-xs mb-4">
        <thead className="border-y border-black font-black">
          <tr>
            <th className="text-right py-1">الصنف</th>
            <th className="text-center py-1">الكمية</th>
            <th className="text-left py-1">السعر</th>
          </tr>
        </thead>
        <tbody className="font-bold">
          {items.map((item, idx) => (
            <tr key={idx} className="border-b border-gray-200">
              <td className="py-2">
                <div>{item.productName}</div>
                <div className="text-[10px] opacity-70">{item.sizeName} {item.portionName && `(${item.portionName})`}</div>
                {item.plateTypeName && <div className="text-[10px] opacity-70">{item.plateTypeName}</div>}
              </td>
              <td className="text-center py-2">{item.quantity}</td>
              <td className="text-left py-2">{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="space-y-1 border-t-2 border-dashed border-black pt-4 mb-4 font-black">
        <div className="flex justify-between">
          <span>المجموع:</span>
          <span>{total} ر.س</span>
        </div>
        <div className="flex justify-between">
          <span>المدفوع:</span>
          <span>{paidAmount} ر.س</span>
        </div>
        <div className="flex justify-between text-lg border-t border-black pt-1">
          <span>المتبقي:</span>
          <span>{remaining} ر.س</span>
        </div>
      </div>

      {notes && (
        <div className="text-[10px] italic border-t border-gray-300 pt-2 mb-4 font-bold">
          <span className="font-black">ملاحظات: </span>
          {notes}
        </div>
      )}

      <div className="text-center space-y-1 mt-6 border-t font-bold pt-4">
        <p className="text-[10px]">شكراً لزيارتكم!</p>
        <p className="text-[8px] opacity-50">نظام إدارة مطابخ المدفون v2.0</p>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #thermal-receipt, #thermal-receipt * {
            visibility: visible;
          }
          #thermal-receipt {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            padding: 8mm;
          }
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
