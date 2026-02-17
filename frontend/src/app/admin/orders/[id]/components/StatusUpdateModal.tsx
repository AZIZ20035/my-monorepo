'use client';

import { useState } from 'react';
import { useOrderStore } from '@/store/use-order-store';
import { OrderResponse, OrderStatus } from '@/dto/order.dto';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  Package, 
  Truck, 
  XCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';

// Re-using some custom icons as indicators
const statusOptions: { status: OrderStatus; label: string; icon: any; color: string; bg: string }[] = [
  { status: 'pending', label: 'قيد الانتظار', icon: Clock, color: 'text-gray-500', bg: 'bg-gray-50' },
  { status: 'confirmed', label: 'تم التأكيد', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-50' },
  { status: 'preparing', label: 'جاري التجهيز', icon: RefreshCw, color: 'text-orange-500', bg: 'bg-orange-50' },
  { status: 'ready', label: 'جاهز للاستلام', icon: Package, color: 'text-purple-500', bg: 'bg-purple-50' },
  { status: 'delivered', label: 'تم التوصيل', icon: Truck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { status: 'cancelled', label: 'ملغي', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
];

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderResponse;
}

export function StatusUpdateModal({ isOpen, onClose, order }: StatusUpdateModalProps) {
  const { updateOrderStatus, isLoading } = useOrderStore();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);

  const handleUpdate = async () => {
    if (selectedStatus === order.status) {
      onClose();
      return;
    }
    
    const success = await updateOrderStatus(order.orderId, selectedStatus);
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
                <h3 className="text-xl font-black text-gray-900 leading-tight">تحديث حالة الطلب</h3>
                <p className="text-xs text-gray-500 font-bold mt-1">تغيير حالة الطلب #{order.orderNumber}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
                <X size={20} />
              </Button>
            </div>

            <div className="p-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {statusOptions.map((option) => {
                  const isActive = selectedStatus === option.status;
                  const Icon = option.icon;
                  
                  return (
                    <button
                      key={option.status}
                      onClick={() => setSelectedStatus(option.status)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        isActive 
                          ? `border-[var(--primary)] bg-[var(--primary)]/5` 
                          : 'border-gray-50 bg-gray-50/30 hover:bg-gray-50 hover:border-gray-100'
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20' : `${option.bg} ${option.color}`}`}>
                        <Icon size={20} className={isActive && option.status === 'preparing' ? 'animate-spin' : ''} />
                      </div>
                      <span className={`text-xs font-black ${isActive ? 'text-[var(--primary)]' : 'text-gray-500'}`}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 mt-4">
                 <div className="flex gap-3">
                    <CheckCircle2 size={18} className="text-blue-600 shrink-0" />
                    <p className="text-[11px] text-blue-700 font-bold leading-relaxed">
                      الحالة الحالية هي <span className="font-black underline mx-1">{statusOptions.find(s => s.status === order.status)?.label}</span>. 
                      سيتم إخطار أقسام المطبخ والتوصيل تلقائياً عند تغيير الحالة.
                    </p>
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
                disabled={isLoading || selectedStatus === order.status}
                className="flex-[2] h-12 rounded-xl bg-[var(--primary)] text-white font-black shadow-lg shadow-[var(--primary)]/20"
              >
                {isLoading ? 'جاري التحديث...' : 'تأكيد التغيير'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
