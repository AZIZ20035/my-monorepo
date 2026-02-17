'use client';

import { useState } from 'react';
import { useOrderStore } from '@/store/use-order-store';
import { OrderResponse, AddPaymentRequest } from '@/dto/order.dto';
import { 
  X, 
  CreditCard, 
  DollarSign, 
  FileText,
  AlertCircle,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

const paymentMethods = [
  { value: 'cash', label: 'نقدي (Cash)', icon: DollarSign },
  { value: 'card', label: 'بطاقة (Card)', icon: CreditCard },
  { value: 'bank_transfer', label: 'تحويل بنكي', icon: CreditCard },
  { value: 'online', label: 'دفع أونلاين', icon: CreditCard },
];

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderResponse;
}

export function AddPaymentModal({ isOpen, onClose, order }: AddPaymentModalProps) {
  const { addOrderPayment, isLoading } = useOrderStore();
  const [formData, setFormData] = useState<AddPaymentRequest>({
    amount: order.remainingAmount > 0 ? order.remainingAmount : 0,
    paymentMethod: 'cash',
    isRefund: false,
    notes: ''
  });

  const handleUpdate = async () => {
    if (formData.amount <= 0) return;
    
    const success = await addOrderPayment(order.orderId, formData);
    if (success) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-all"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden"
            dir="rtl"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-gray-900 leading-tight">إدارة المدفوعات</h3>
                <p className="text-xs text-gray-500 font-bold mt-1">إضافة دفعة أو استرداد للطلب #{order.orderNumber}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
                <X size={20} />
              </Button>
            </div>

            <div className="p-6 space-y-5">
              {/* Refund Toggle */}
              <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                <button
                  onClick={() => setFormData({ ...formData, isRefund: false })}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all ${
                    !formData.isRefund ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <PlusCircle size={18} />
                  إضافة دفعة
                </button>
                <button
                  onClick={() => setFormData({ ...formData, isRefund: true })}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all ${
                    formData.isRefund ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <MinusCircle size={18} />
                  استرداد مبلغ
                </button>
              </div>

              {/* Amount Label & Input */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-bold text-gray-500">المبلغ</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="h-14 pr-12 rounded-2xl border-2 border-gray-100 focus:border-[var(--primary)] font-black text-xl text-left"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">ر.س</div>
                </div>
                <div className="flex justify-between items-center px-1">
                   <p className="text-[10px] text-gray-400 font-bold uppercase">الحد الأقصى للمتبقي: {order.remainingAmount.toLocaleString()} ر.س</p>
                   {formData.amount > order.remainingAmount && !formData.isRefund && (
                     <p className="text-[10px] text-orange-500 font-bold">سيتم إنشاء رصيد زائد للعميل</p>
                   )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-bold text-gray-500">وسيلة الدفع</Label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map((method) => {
                    const isActive = formData.paymentMethod === method.value;
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.value}
                        onClick={() => setFormData({ ...formData, paymentMethod: method.value })}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                          isActive 
                            ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]' 
                            : 'border-gray-50 bg-gray-50/20 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <Icon size={16} />
                        </div>
                        <span className="text-xs font-bold">{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-bold text-gray-500">ملاحظات (اختياري)</Label>
                <div className="relative">
                   <FileText className="absolute right-4 top-4 text-gray-400" size={18} />
                   <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="مثال: دفعة فودافون كاش، استلام نقدي بالفرع..."
                    className="w-full min-h-[80px] pr-10 pl-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-[var(--primary)] font-medium text-sm text-right bg-white resize-none"
                   />
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50/50 flex gap-3 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 rounded-xl font-bold"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={isLoading || formData.amount <= 0}
                className={`flex-[2] h-12 rounded-xl text-white font-black shadow-lg shadow-${formData.isRefund ? 'red' : 'emerald'}-500/20 ${
                  formData.isRefund ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isLoading ? 'جاري المعالجة...' : formData.isRefund ? 'تأكيد الاسترداد' : 'تأكيد الدفع'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
