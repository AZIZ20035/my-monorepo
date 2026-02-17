'use client';

import { 
  CheckCircle2, 
  Printer, 
  ArrowRight,
  Share2,
  Copy,
  Clock,
  ExternalLink,
  LayoutDashboard,
  CalendarCheck,
  User,
  ShoppingBag,
  PlusCircle,
  Receipt,
  CreditCard
} from 'lucide-react';
import { CartItem } from '@/app/admin/orders/new/components/PricePicker';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface SuccessStepProps {
  orderNumber: string;
  customerName: string;
  total: number;
  items: CartItem[];
  onFinish: () => void;
  onPrint: () => void;
  onReset: () => void;
}

export function SuccessStep({ 
  orderNumber, 
  customerName, 
  total, 
  items, 
  onFinish, 
  onPrint, 
  onReset 
}: SuccessStepProps) {
  
  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    toast.success('تم نسخ رقم الطلب');
  };

  const totalItemsCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="flex flex-col items-center justify-center py-4 text-center space-y-6 max-w-2xl mx-auto" dir="rtl">
      {/* 🎊 Branded Header */}
      <div className="space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="h-16 w-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 mx-auto"
        >
          <CheckCircle2 size={36} />
        </motion.div>
        
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-[var(--foreground)]">تم تأكيد الطلب بنجاح!</h2>
          <p className="text-sm font-bold text-[var(--muted-foreground)]">الطلب جاهز الآن للطباعة والمعالجة</p>
        </div>
      </div>

      {/* 📄 Invoice Style Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white border-2 border-[var(--border)] rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col"
      >
        {/* Invoice Header */}
        <div className="p-6 bg-slate-50 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center font-black">
               <Receipt size={20} />
             </div>
             <div className="text-right">
               <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest">رقم الفاتورة</p>
               <p className="text-lg font-black text-[var(--foreground)]">#{orderNumber}</p>
             </div>
          </div>
          <button 
            onClick={copyOrderNumber}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all text-[11px] font-black"
          >
            <Copy size={12} />
            نسخ
          </button>
        </div>

        {/* Invoice Content */}
        <div className="p-6 space-y-6">
          {/* Customer Info Mini */}
          <div className="flex justify-between items-center text-sm">
            <div className="text-right">
              <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase">العميل</p>
              <p className="font-black">{customerName}</p>
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase">التفاصيل</p>
              <p className="font-black text-[var(--primary)]">{totalItemsCount} منتجات</p>
            </div>
          </div>

          <div className="h-px bg-dashed bg-[var(--border)] w-full border-t border-dashed" />

          {/* Items List */}
          <div className="space-y-3 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm group">
                <div className="text-right">
                  <p className="font-black text-slate-700 leading-tight">{item.productName}</p>
                  <p className="text-[10px] font-bold text-[var(--muted-foreground)]">
                    {item.sizeName} · {item.plateTypeName || 'صحن عادي'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-bold text-slate-400">×{item.quantity}</span>
                  <span className="font-black text-slate-900 w-16 text-left">{item.price * item.quantity} ر.س</span>
                </div>
              </div>
            ))}
          </div>

          <div className="h-px bg-slate-100 w-full" />

          {/* Grand Total Bar */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white flex items-center justify-between shadow-lg">
             <div className="flex items-center gap-3">
               <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60">
                 <CreditCard size={16} />
               </div>
               <span className="text-xs font-black uppercase tracking-widest opacity-60">إجمالي المبلغ</span>
             </div>
             <div className="flex items-baseline gap-1">
               <span className="text-3xl font-black">{total}</span>
               <span className="text-xs font-bold opacity-60">ر.س</span>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Action Grid */}
      <div className="w-full space-y-3 px-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={onPrint}
            className="h-14 rounded-2xl bg-gradient-to-l from-[#0784b5] to-[#39ace7] text-white font-black text-lg shadow-lg shadow-[#39ace7]/20 border-none gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Printer size={20} />
            طباعة الفاتورة
          </Button>

          <Button
            onClick={onReset}
            className="h-14 rounded-2xl bg-emerald-600 text-white font-black text-lg shadow-lg shadow-emerald-600/20 border-none gap-2 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <PlusCircle size={20} />
            بدء طلب جديد
          </Button>
        </div>

        <Button
          onClick={onFinish}
          variant="ghost"
          className="h-12 w-full rounded-xl font-black text-[var(--muted-foreground)] hover:text-[var(--foreground)] gap-2 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <LayoutDashboard size={18} />
          العودة للوحة التحكم
        </Button>
      </div>

      <p className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--muted-foreground)] opacity-40">
        <Clock size={12} />
        تم تأكيد الطلب في {new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
}
