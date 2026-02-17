'use client';

import { useMemo } from 'react';
import { CartItem } from '@/app/admin/orders/new/components/PricePicker';
import { Customer } from '@/dto/customer.dto';
import { EidDayResponse } from '@/dto/eid-day.dto';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, MapPin, Calendar, Clock,
  Plus, Minus, Trash2, Receipt, CreditCard,
  ShoppingBag, X, CheckCircle2, ChevronLeft, Truck
} from 'lucide-react';
import { OrderStep } from '../types';

interface LiveReceiptProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  selectedCustomer: Customer | null;
  selectedAddressId: number | null;
  selectedPeriodId: number | null;
  selectedAssignmentId: number | null;
  eidDays: EidDayResponse[];
  selectedDayId: number | null;
  paidAmount: number;
  notes: string;
  subtotal: number;
  deliveryCost: number;
  total: number;
  currentStep: OrderStep;
}

export function LiveReceipt({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  selectedCustomer,
  selectedAddressId,
  selectedPeriodId,
  selectedAssignmentId,
  eidDays,
  selectedDayId,
  paidAmount,
  notes,
  subtotal,
  deliveryCost,
  total,
  currentStep,
}: LiveReceiptProps) {

  const totalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const remaining = Math.max(0, total - paidAmount);

  const selectedDay = eidDays.find(d => d.eidDayId === selectedDayId);
  const selectedAddress = selectedCustomer?.addresses.find(a => a.addressId === selectedAddressId);

  // Find period info: specific assignment preferred, fallback to generic for label
  const assignment = selectedDay?.periods.find(p => p.eidDayPeriodId === selectedAssignmentId);
  
  // If no specific assignment yet, try to find generic name from eidDays periods
  // or use the periodId from page.tsx props
  const displayPeriodName = useMemo(() => {
    if (assignment) return assignment.periodName;
    
    // Fallback: search across all days or use a name if we had one
    // But since selectedDay exists, look for any period with that generic periodId
    const generic = selectedDay?.periods.find(p => p.periodId === selectedPeriodId);
    return generic?.periodName;
  }, [assignment, selectedDay, selectedPeriodId]);

  const displayTime = useMemo(() => {
    if (assignment) return `${assignment.startTime.substring(0, 5)} - ${assignment.endTime.substring(0, 5)}`;
    const generic = selectedDay?.periods.find(p => p.periodId === selectedPeriodId);
    if (generic) return `${generic.startTime.substring(0, 5)} - ${generic.endTime.substring(0, 5)}`;
    return null;
  }, [assignment, selectedDay, selectedPeriodId]);

  return (
    <div className="flex flex-col h-full bg-[var(--secondary)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden" dir="rtl">
      {/* Receipt Header */}
      <div className="shrink-0 p-4 border-b border-[var(--border)] bg-white/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt size={18} className="text-[var(--primary)]" />
            <h2 className="text-sm font-black text-[var(--foreground)] tracking-tight">ملخص الفاتورة</h2>
          </div>
          <div className="bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            POS MODE
          </div>
        </div>
      </div>

      {/* Scrollable Summary */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 space-y-6">
        
        {/* 👤 Customer & Address */}
        <div className="space-y-3">
          <SectionHeader icon={User} label="العميل والعنوان" />
          {selectedCustomer ? (
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-white border border-[var(--border)]">
                <p className="text-sm font-black truncate">{selectedCustomer.name}</p>
                <p className="text-[11px] font-bold text-[var(--muted-foreground)]" dir="ltr">{selectedCustomer.phone}</p>
              </div>
              {selectedAddress && (
                <div className="px-3 py-2 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-2">
                  <MapPin size={14} className="text-indigo-500 mt-0.5" />
                  <p className="text-[11px] font-bold text-indigo-900 line-clamp-2">{selectedAddress.addressDetails}</p>
                </div>
              )}
            </div>
          ) : (
             <Placeholder text="بانتظار اختيار العميل" />
          )}
        </div>

        {/* 📅 Day & Period */}
        <div className="space-y-3">
          <SectionHeader icon={Calendar} label="الموعد" />
          {selectedDay && (displayPeriodName || displayTime) ? (
            <div className="p-3 rounded-xl bg-white border border-[var(--border)] flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm font-black">{selectedDay.nameAr}</p>
                <div className="flex flex-col gap-0.5 mt-1">
                   {displayPeriodName && <p className="text-[11px] font-black text-[var(--primary)]">{displayPeriodName}</p>}
                   {displayTime && (
                     <p className="text-[10px] font-bold text-[var(--muted-foreground)] flex items-center gap-1">
                       <Clock size={10} />
                       {displayTime}
                     </p>
                   )}
                </div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Calendar size={18} />
              </div>
            </div>
          ) : selectedDay ? (
             <div className="p-3 rounded-xl bg-white border border-[var(--border)]">
                <p className="text-sm font-black">{selectedDay.nameAr}</p>
                <p className="text-[10px] font-bold text-amber-600 mt-1">بانتظار اختيار الفترة...</p>
             </div>
          ) : (
            <Placeholder text="بانتظار اختيار اليوم والفترة" />
          )}
        </div>

        {/* 🛒 Cart Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <SectionHeader icon={ShoppingBag} label="المنتجات" />
            <span className="text-[10px] font-black opacity-60 bg-[var(--border)] px-1.5 py-0.5 rounded-md">{totalItems}</span>
          </div>
          
          <AnimatePresence initial={false}>
            {cartItems.length === 0 ? (
              <Placeholder text="السلة فارغة" />
            ) : (
              <div className="space-y-1.5">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[var(--border)] group"
                  >
                    <div className="flex-1 min-w-0 pr-1">
                      <p className="text-[11px] font-black truncate">{item.productName}</p>
                      <p className="text-[9px] font-bold text-[var(--muted-foreground)]">
                        {item.sizeName} · {item.plateTypeName || 'صحن عادي'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 bg-[var(--secondary)] rounded-lg p-0.5">
                        <button onClick={() => onUpdateQuantity(item.id, -1)} className="h-5 w-5 flex items-center justify-center text-[var(--muted-foreground)] hover:text-red-500"><Minus size={10} /></button>
                        <span className="text-[11px] font-black w-3 text-center">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, 1)} className="h-5 w-5 flex items-center justify-center text-[var(--primary)] hover:scale-110"><Plus size={10} /></button>
                      </div>
                      <span className="text-[11px] font-black text-[var(--primary)] w-12 text-left">{item.price * item.quantity}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Totals Section */}
      <div className="shrink-0 p-5 bg-white border-t border-[var(--border)] space-y-4">
        {/* Breakdown */}
        <div className="space-y-2 text-[12px] font-bold">
          <div className="flex justify-between text-[var(--muted-foreground)]">
            <span>المجموع</span>
            <span>{subtotal} ر.س</span>
          </div>
          {deliveryCost > 0 && (
            <div className="flex justify-between text-indigo-600">
              <span className="flex items-center gap-1"><Truck size={12} /> التوصيل</span>
              <span>{deliveryCost} ر.س</span>
            </div>
          )}
        </div>

        {/* Grand Total */}
        <div className="flex items-center justify-between pt-2 border-t border-dashed border-[var(--border)]">
          <span className="text-sm font-black opacity-80 uppercase">الإجمالي</span>
          <div className="text-right">
            <span className="text-2xl font-black text-[var(--foreground)]">{total}</span>
            <span className="text-[10px] font-black opacity-50 mr-1">ر.س</span>
          </div>
        </div>

        {/* Payment Stats */}
        {paidAmount > 0 && (
          <div className={`p-3 rounded-xl flex items-center justify-between text-[11px] font-black ${
            remaining === 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
          }`}>
             <div className="flex flex-col">
               <span className="opacity-70">المدفوع</span>
               <span>{paidAmount} ر.س</span>
             </div>
             <div className="w-px h-6 bg-current opacity-20" />
             <div className="flex flex-col text-left">
               <span className="opacity-70">{remaining === 0 ? 'مكتمل' : 'المتبقي'}</span>
               <span>{remaining} ر.س</span>
             </div>
          </div>
        )}

        {/* Step Indicator Mini */}
        <div className="flex gap-1 justify-center">
          {['customer', 'address', 'period', 'products', 'payment', 'confirmation'].map((s, idx) => (
            <div 
              key={s} 
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                currentStep === s ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
              }`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest">
      <Icon size={12} className="opacity-50" />
      {label}
    </div>
  );
}

function Placeholder({ text }: { text: string }) {
  return (
    <div className="p-3 rounded-xl border-2 border-dashed border-[var(--border)] text-center text-[10px] font-bold text-[var(--muted-foreground)] bg-[var(--secondary)]/20">
      {text}
    </div>
  );
}
