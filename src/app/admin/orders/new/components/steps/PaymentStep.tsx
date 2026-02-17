'use client';

import { 
  CreditCard, 
  FileText, 
  Wallet, 
  Banknote, 
  Receipt,
  Truck,
  Plus,
  Minus,
  AlertCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

interface PaymentStepProps {
  subtotal: number;
  deliveryCost: number;
  total: number;
  paidAmount: number;
  onChangePaid: (val: number) => void;
  notes: string;
  onChangeNotes: (val: string) => void;
}

export function PaymentStep({ 
  subtotal, 
  deliveryCost, 
  total, 
  paidAmount, 
  onChangePaid, 
  notes, 
  onChangeNotes 
}: PaymentStepProps) {

  const remaining = Math.max(0, total - paidAmount);
  const isPaidFull = paidAmount >= total;

  return (
    <div className="space-y-8" dir="rtl">
      {/* Summary Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
          <CreditCard size={22} />
        </div>
        <div>
          <h2 className="text-xl font-black text-[var(--foreground)]">تفاصيل الدفع والملاحظات</h2>
          <p className="text-sm text-[var(--muted-foreground)] font-bold">تسجيل المبلغ المقدم وإضافة أي ملاحظات خاصة بالطلب</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Financial Inputs */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[var(--secondary)]/30 border-2 border-[var(--border)] space-y-4">
            <h3 className="text-lg font-black text-[var(--foreground)] flex items-center gap-2">
              <Banknote size={20} className="text-emerald-500" />
              المبلغ المدفوع (المقدم)
            </h3>
            
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-black text-[var(--muted-foreground)]">ر.س</span>
              <input
                type="number"
                value={paidAmount || ''}
                onChange={(e) => onChangePaid(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-full h-16 bg-[var(--card)] border-2 border-[var(--border)] rounded-2xl pl-16 pr-6 text-2xl font-black text-left outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[10, 50, 100].map(val => (
                <button
                  key={val}
                  onClick={() => onChangePaid(paidAmount + val)}
                  className="h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] font-bold text-sm hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus size={14} />
                  {val} ر.س
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => onChangePaid(total)}
                className={`flex-1 h-12 rounded-xl font-black text-sm transition-all border-2 cursor-pointer ${
                  isPaidFull 
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' 
                    : 'bg-white text-emerald-600 border-emerald-200 hover:border-emerald-400'
                }`}
              >
                دفع بالكامل ({total} ر.س)
              </button>
              <button
                onClick={() => onChangePaid(0)}
                className="px-6 h-12 rounded-xl font-black text-sm text-[var(--muted-foreground)] border-2 border-[var(--border)] hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all cursor-pointer"
              >
                تصفير
              </button>
             </div>
          </div>

          <div className="p-6 rounded-3xl border-2 border-[var(--border)] bg-[var(--card)] space-y-4">
            <h3 className="text-lg font-black text-[var(--foreground)] flex items-center gap-2">
              <FileText size={20} className="text-indigo-500" />
              ملاحظات الطلب
            </h3>
            <textarea
              value={notes}
              onChange={(e) => onChangeNotes(e.target.value)}
              placeholder="أدخل أي ملاحظات خاصة بتجهيز أو توصيل الطلب..."
              className="w-full min-h-[120px] p-4 rounded-2xl border-2 border-[var(--border)] bg-[var(--secondary)]/30 focus:outline-none focus:border-indigo-500 transition-all resize-none text-right font-bold text-lg"
            />
          </div>
        </div>

        {/* Right: Detailed Breakdown Card */}
        <div className="p-8 rounded-[2.5rem] bg-gradient-to-b from-[#1a1c1e] to-[#2d2f31] text-white shadow-2xl relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-[-50px] left-[-50px] w-40 h-40 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute bottom-[-50px] right-[-50px] w-60 h-60 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black opacity-80">ملخص الحساب</h3>
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Receipt size={20} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-lg opacity-80">
                <span className="font-bold">المجموع الفرعي</span>
                <span className="font-black">{subtotal} ر.س</span>
              </div>
              <div className="flex items-center justify-between text-lg opacity-80 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Truck size={18} className="text-sky-400" />
                  <span className="font-bold">تكلفة التوصيل</span>
                </div>
                <span className="font-black">{deliveryCost} ر.س</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-2xl font-black text-emerald-400">الإجمالي</span>
                <span className="text-4xl font-black text-emerald-400">{total} <span className="text-sm opacity-60">ر.س</span></span>
              </div>
            </div>

            {paidAmount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-2 ${
                  isPaidFull ? 'bg-emerald-500/10 border-emerald-500' : 'bg-amber-500/10 border-amber-500'
                }`}
              >
                <div className="flex items-center justify-between w-full font-black">
                  <span className="opacity-80">المدفوع حالياً</span>
                  <span>{paidAmount} ر.س</span>
                </div>
                <div className="h-[2px] w-full bg-white/10 my-1" />
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl font-black opacity-90">{remaining === 0 ? 'مدفوع بالكامل' : 'المتبقي'}</span>
                  <span className={`text-2xl font-black ${remaining === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {remaining} ر.س
                  </span>
                </div>
              </motion.div>
            )}

            {!isPaidFull && remaining > 0 && (
              <div className="flex items-center gap-2 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-200 text-xs font-bold leading-relaxed">
                <AlertCircle size={16} className="shrink-0" />
                <p>سيتم تسجيل المبلغ المتبقي ({remaining} ر.س) كمديونية على العميل عند حفظ الطلب.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
