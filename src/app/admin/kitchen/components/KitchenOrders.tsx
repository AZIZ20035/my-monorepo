'use client';

import { KitchenOrder } from '@/dto/kitchen.dto';
import { useKitchenStore } from '@/store/use-kitchen-store';
import { 
  User, 
  Phone, 
  MapPin, 
  Clock, 
  StickyNote, 
  Box, 
  ChefHat, 
  CheckCircle2, 
  Truck,
  AlertCircle,
  ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function KitchenOrders({ orders }: { orders: KitchenOrder[] }) {
  const { updateOrderStatus, isUpdating } = useKitchenStore();

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-[var(--muted-foreground)] bg-[var(--secondary)]/20 rounded-3xl border-2 border-dashed border-[var(--border)]">
        <ChefHat size={64} className="opacity-10 mb-4" />
        <h3 className="text-xl font-bold">لا يوجد طلبات حالياً</h3>
        <p>انتظر حتى يتم إضافة طلبات جديدة للمطبخ</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {orders.map((order) => (
          <motion.div
            key={order.orderId}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`bg-transparent rounded-3xl border-2 shadow-sm flex flex-col overflow-hidden transition-all ${
              order.status === 'ready' 
                ? 'border-emerald-500/30 bg-emerald-500/[0.02]' 
                : order.status === 'preparing'
                ? 'border-amber-500/30 bg-amber-500/[0.02]'
                : 'border-[var(--border)]'
            }`}
          >
            {/* Ticket Header */}
            <div className={`p-4 flex items-center justify-between border-b-2 ${
              order.status === 'ready' ? 'border-emerald-500/10' : 'border-[var(--border)]'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-black text-lg ${
                  order.status === 'ready' ? 'bg-emerald-500 text-white' : 'bg-[var(--primary)] text-white'
                }`}>
                  #{order.orderId}
                </div>
                <div>
                  <h4 className="font-black text-[var(--foreground)]">{order.customerName}</h4>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1">
                    <Clock size={10} /> {order.period} - {order.deliveryTime}
                  </p>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                order.status === 'ready' ? 'bg-emerald-500/10 text-emerald-600' : 
                order.status === 'preparing' ? 'bg-amber-500/10 text-amber-600' :
                'bg-[var(--secondary)] text-[var(--muted-foreground)]'
              }`}>
                {order.status === 'ready' ? 'جاهز' : 
                 order.status === 'preparing' ? 'جاري التحضير' : 'قيد الانتظار'}
              </div>
            </div>

            {/* Ticket Body - Items */}
            <div className="flex-1 p-5 space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="h-10 w-10 min-w-[40px] rounded-xl bg-[var(--secondary)] flex items-center justify-center text-[var(--foreground)] border border-[var(--border)]">
                    <Box size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-black text-[15px]">{item.productName}</span>
                      <span className="h-7 w-7 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-black text-xs">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.size && (
                        <span className="text-[11px] font-black bg-white border border-[var(--border)] px-2 py-0.5 rounded-md text-[var(--muted-foreground)]">
                          {item.size}
                        </span>
                      )}
                      {item.plateType && (
                        <span className="text-[11px] font-black bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md text-amber-600">
                          {item.plateType}
                        </span>
                      )}
                    </div>
                    {item.notes && (
                      <div className="mt-1.5 flex items-start gap-1.5 text-red-500">
                        <AlertCircle size={12} className="shrink-0 mt-0.5" />
                        <p className="text-[11px] font-bold italic">{item.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {order.notes && (
                <div className="mt-4 p-3 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-2">
                  <StickyNote size={14} className="text-amber-500 mt-0.5" />
                  <p className="text-xs font-bold text-[var(--muted-foreground)] leading-relaxed">
                    <span className="text-amber-600 font-black block text-[10px] uppercase mb-1">ملاحظات الطلب:</span>
                    {order.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Ticket Footer - Actions */}
            <div className="p-4 bg-[var(--secondary)]/30 border-t-2 border-[var(--border)] flex gap-2">
              {order.status !== 'ready' && order.status !== 'delivered' && (
                <Button 
                  onClick={() => updateOrderStatus(order.orderId, order.status === 'preparing' ? 'ready' : 'preparing')}
                  disabled={isUpdating}
                  className={`flex-1 rounded-xl h-11 font-black shadow-lg transition-all gap-2 ${
                    order.status === 'preparing' 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20' 
                    : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                  }`}
                >
                  {order.status === 'preparing' ? <CheckCircle2 size={18} /> : <ChefHat size={18} />}
                  {order.status === 'preparing' ? 'تجهيز الطلب' : 'بدء التحضير'}
                </Button>
              )}
              
              {order.status === 'ready' && (
                <Button 
                  onClick={() => updateOrderStatus(order.orderId, 'delivered')}
                  disabled={isUpdating}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 font-black shadow-lg shadow-emerald-600/20 gap-2"
                >
                  <Truck size={18} />
                  تسليم الطلب
                </Button>
              )}

              <Button 
                variant="outline"
                className="h-11 w-11 p-0 rounded-xl bg-white border-2"
                onClick={() => window.open(`/admin/orders/${order.orderId}`, '_blank')}
              >
                <ClipboardList size={18} />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
