'use client';

import { KitchenSummaryResponse } from '@/dto/kitchen.dto';
import { 
  ShoppingBag, 
  Box, 
  Layers, 
  Activity,
  ArrowRight,
  TrendingUp,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

export function KitchenSummary({ summary }: { summary: KitchenSummaryResponse | null }) {
  if (!summary) return null;

  return (
    <div className="space-y-8 pb-10">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-gradient-to-br from-[#0784b5] to-[#39ace7] rounded-3xl text-white shadow-xl shadow-[#39ace7]/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[12px] font-black opacity-80 uppercase tracking-widest mb-1">إجمالي الأصناف</p>
            <h3 className="text-4xl font-black">{summary.products.length}</h3>
          </div>
          <Activity className="absolute -bottom-2 -right-2 text-white/10 h-24 w-24" />
        </div>
        
        <div className="p-6 bg-transparent rounded-3xl border-2 border-[var(--border)] shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[12px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-1">إجمالي القطع/الصحون</p>
            <h3 className="text-4xl font-black text-[var(--foreground)]">
              {summary.products.reduce((acc, p) => acc + p.totalQuantity, 0)}
            </h3>
          </div>
          <ShoppingBag className="absolute -bottom-2 -right-2 text-[var(--primary)]/5 h-24 w-24" />
        </div>

        <div className="p-6 bg-transparent rounded-3xl border-2 border-[var(--border)] shadow-sm relative overflow-hidden lg:col-span-2">
          <div className="relative z-10 flex items-center justify-between h-full">
             <div>
               <p className="text-[12px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-1">توزيع التغليف (Plates)</p>
               <div className="flex gap-4 mt-2">
                 {summary.plates.map((p, idx) => (
                   <div key={idx} className="flex flex-col">
                     <span className="text-lg font-black text-[var(--foreground)]">{p.count}</span>
                     <span className="text-[10px] font-black text-[var(--primary)] uppercase">{p.plateType}</span>
                   </div>
                 ))}
               </div>
             </div>
             <Layers className="text-[var(--primary)]/10 h-16 w-16" />
          </div>
        </div>
      </div>

      {/* Grouped Products */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className="text-[var(--primary)]" />
          <h3 className="text-xl font-black text-[var(--foreground)]">قائمة الإنتاج</h3>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(
            summary.products.reduce((acc, p) => {
              if (!acc[p.category]) acc[p.category] = [];
              acc[p.category].push(p);
              return acc;
            }, {} as Record<string, typeof summary.products>)
          ).map(([category, products], idx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-transparent rounded-3xl border-2 border-[var(--border)] overflow-hidden shadow-sm flex flex-col"
            >
              <div className="bg-[var(--secondary)]/50 p-4 border-b-2 border-[var(--border)] flex items-center justify-between">
                <h4 className="font-black text-[16px] text-[var(--primary)]">{category}</h4>
                <div className="px-3 py-1 bg-white rounded-lg text-xs font-black border">
                  {products.reduce((acc, p) => acc + p.totalQuantity, 0)} قطعة
                </div>
              </div>
              
              <div className="divide-y-2 divide-[var(--border)]">
                {products.map((p, pIdx) => (
                   <div key={pIdx} className="p-4 hover:bg-[var(--primary)]/[0.01] transition-colors">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-[var(--secondary)] flex items-center justify-center text-[var(--muted-foreground)] border">
                            <Box size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-[15px] text-[var(--foreground)]">{p.product}</p>
                            {p.size && (
                              <p className="text-[11px] font-black text-[var(--muted-foreground)] uppercase">{p.size}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-center min-w-[60px] h-12 bg-[var(--primary)]/5 rounded-2xl border border-[var(--primary)]/10">
                          <span className="text-xl font-black text-[var(--primary)]">{p.totalQuantity}</span>
                          <span className="text-[9px] font-black uppercase text-[var(--primary)] opacity-70">المجموع</span>
                        </div>
                      </div>
                   </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tip Box */}
      <div className="bg-amber-500/5 border-2 border-dashed border-amber-500/20 p-6 rounded-3xl flex items-start gap-4">
        <div className="h-10 w-10 min-w-[40px] rounded-xl bg-amber-500 text-white flex items-center justify-center">
          <Info size={24} />
        </div>
        <div>
          <h4 className="font-black text-amber-600 mb-1">تعليمات المطبخ</h4>
          <p className="text-sm font-bold text-[var(--muted-foreground)] leading-relaxed">
            تأكد من مراجعة ملاحظات كل طلب قبل البدء في التحضير. يتم تحديث الكميات في هذا الملخص فور تأكيد الطلبات الجديدة أو إلغاء الطلبات القديمة.
          </p>
        </div>
      </div>
    </div>
  );
}
