'use client';

import { 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  CreditCard,
  User,
  Printer,
  Save,
  Clock,
  Truck,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CartItem } from '../PricePicker';

interface ConfirmationStepProps {
  orderData: {
    selectedCustomer: any;
    selectedPeriodId: number | null;
    cartItems: CartItem[];
    total: number;
    paidAmount: number;
    notes?: string;
    areaName?: string;
    periodName?: string;
    periodTime?: string;
    dayName?: string;
  };
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function ConfirmationStep({ orderData, isSubmitting, onSubmit }: ConfirmationStepProps) {
  const { selectedCustomer, cartItems, total, paidAmount, notes, areaName, periodName, periodTime, dayName } = orderData;

  const totalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="space-y-8 max-w-3xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="h-20 w-20 rounded-[2rem] bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-black text-[var(--foreground)] mt-4">مراجعة وتأكيد الطلب</h2>
        <p className="text-[var(--muted-foreground)] font-bold text-lg">يرجى مراجعة بيانات الطلب النهائية قبل الحفظ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Customer & Address Summary */}
        <div className="p-6 rounded-3xl border-2 border-[var(--border)] bg-[var(--card)] space-y-4">
          <div className="flex items-center gap-2 text-[var(--primary)] font-black uppercase text-xs tracking-widest pb-2 border-b border-[var(--border)]">
            <User size={14} />
            بيانات العميل
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-bold text-[var(--muted-foreground)]">الاسم</p>
              <p className="text-lg font-black">{selectedCustomer?.name}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-sm font-bold text-[var(--muted-foreground)]">الجوال</p>
                <p className="font-black" dir="ltr">{selectedCustomer?.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Summary */}
        <div className="p-6 rounded-3xl border-2 border-[var(--border)] bg-[var(--card)] space-y-4">
          <div className="flex items-center gap-2 text-indigo-500 font-black uppercase text-xs tracking-widest pb-2 border-b border-[var(--border)]">
            <MapPin size={14} />
            التوصيل والفترة
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-bold text-[var(--muted-foreground)]">العنوان</p>
              <p className="text-md font-black line-clamp-1">{areaName || 'تم اختيار العنوان'}</p>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-bold text-[var(--muted-foreground)]">اليوم والفترة</p>
                <div className="flex flex-col gap-0.5 font-black text-indigo-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>{dayName} - {periodName}</span>
                  </div>
                  {periodTime && (
                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--muted-foreground)]">
                      <Clock size={12} />
                      <span>{periodTime}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Summary - Full Width */}
        <div className="col-span-full p-6 rounded-3xl border-2 border-[var(--border)] bg-[var(--card)] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 text-sky-500 font-black uppercase text-xs tracking-widest">
              <ShoppingBag size={14} />
              المنتجات ({totalItems})
            </div>
            <span className="text-[var(--primary)] font-black text-sm">{total} ر.س</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[180px] overflow-y-auto custom-scrollbar pr-2">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-[var(--secondary)]/30 border border-[var(--border)]">
                <div className="text-right">
                  <p className="font-black text-sm">{item.productName}</p>
                  <p className="text-[10px] font-bold text-[var(--muted-foreground)]">
                    {item.sizeName} · {item.plateTypeName || 'صحن عادي'}
                  </p>
                </div>
                <div className="text-left font-black">
                  <span className="text-xs opacity-60 ml-1">×{item.quantity}</span>
                  <span className="text-[var(--primary)]">{item.price * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary - Full Width */}
        <div className="col-span-full p-8 rounded-[2.5rem] bg-gradient-to-l from-[#0784b5] to-[#39ace7] text-white shadow-xl flex flex-col items-center gap-6">
          <div className="grid grid-cols-3 w-full text-center divide-x divide-white/10 divide-x-reverse">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase opacity-60">الإجمالي</p>
              <p className="text-2xl font-black">{total} <span className="text-xs opacity-70">ر.س</span></p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase opacity-60">المدفوع</p>
              <p className="text-2xl font-black">{paidAmount} <span className="text-xs opacity-70">ر.س</span></p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase opacity-60">المتبقي</p>
              <p className="text-2xl font-black">{Math.max(0, total - paidAmount)} <span className="text-xs opacity-70">ر.س</span></p>
            </div>
          </div>

          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full h-16 rounded-3xl bg-white text-[var(--primary)] hover:bg-white/90 font-black text-2xl shadow-2xl transition-all active:scale-[0.98] gap-3 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="h-6 w-6 border-4 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin" />
            ) : (
              <>
                <Save size={24} />
                حفظ وتأكيد الطلب
              </>
            )}
          </Button>
          
          <div className="flex items-center gap-2 opacity-70 text-[11px] font-bold">
            <Printer size={14} />
            سيتم عرض خيار الطباعة فور الحفظ
          </div>
        </div>
      </div>
    </div>
  );
}
