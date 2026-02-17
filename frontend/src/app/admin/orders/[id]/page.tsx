'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useOrderStore } from '@/store/use-order-store';
import { 
  ArrowRight, 
  Printer, 
  Trash2, 
  CreditCard, 
  RefreshCw, 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  ShoppingBag,
  Plus,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/orders/order-status-badge';
import { toast } from 'sonner';

// Utility for formatting date in Arabic
const formatDate = (dateStr: string, includeTime = true) => {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: includeTime ? '2-digit' : undefined,
      minute: includeTime ? '2-digit' : undefined,
      hour12: true
    }).format(date);
  } catch (e) {
    return dateStr;
  }
};

// Modals will be implemented next
import { StatusUpdateModal } from './components/StatusUpdateModal';
import { AddPaymentModal } from './components/AddPaymentModal';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const orderId = parseInt(id);
  const router = useRouter();
  const { activeOrder, fetchOrderById, cancelOrder, isLoading } = useOrderStore();
  
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId);
    }
  }, [orderId, fetchOrderById]);

  const handleCancelOrder = async () => {
    if (!activeOrder) return;
    if (activeOrder.status === 'delivered') {
      toast.error('لا يمكن إلغاء طلب تم تسليمه');
      return;
    }

    if (window.confirm('هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟')) {
      setIsCancelling(true);
      const success = await cancelOrder(activeOrder.orderId);
      if (success) {
        toast.success('تم إلغاء الطلب بنجاح');
      }
      setIsCancelling(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading && !activeOrder) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent shadow-lg" />
          <p className="text-lg font-black text-[var(--muted-foreground)]">جاري تحميل تفاصيل الطلب...</p>
        </div>
      </div>
    );
  }

  if (!activeOrder) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">الطلب غير موجود</h2>
          <p className="text-gray-500 mb-6">عذراً، لم نتمكن من العثور على الطلب المطلوب.</p>
          <Button onClick={() => router.push('/admin/orders')} variant="outline">العودة لقائمة الطلبات</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 p-4 lg:p-8 overflow-y-auto custom-scrollbar" dir="rtl">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push('/admin/orders')}
            className="h-10 w-10 rounded-xl bg-[var(--secondary)] border border-[var(--border)]"
          >
            <ArrowRight size={20} />
          </Button>
            <h3 className="text-xl font-black text-gray-900 leading-tight">
              طلب #{activeOrder.orderNumber}
              <OrderStatusBadge status={activeOrder.status} />
            </h3>
            <p className="text-sm text-gray-500 font-bold mt-1">
              تم الإنشاء في {formatDate(activeOrder.createdAt)} بواسطة {activeOrder.createdBy}
            </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={handlePrint}
            variant="outline" 
            className="h-11 px-4 rounded-xl font-bold gap-2"
          >
            <Printer size={18} />
            طباعة الفاتورة
          </Button>
          <Button 
            onClick={() => router.push(`/admin/orders/${activeOrder.orderId}/edit`)}
            variant="outline"
            disabled={activeOrder.status === 'delivered' || activeOrder.status === 'cancelled'}
            className="h-11 px-4 rounded-xl font-bold gap-2"
          >
            تعديل الطلب
          </Button>
          <Button 
            onClick={() => setIsStatusModalOpen(true)}
            className="h-11 px-6 rounded-xl bg-[var(--primary)] text-white font-black gap-2 shadow-lg shadow-[var(--primary)]/20"
          >
            <RefreshCw size={18} />
            تحديث الحالة
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Items Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag size={18} className="text-[var(--primary)]" />
                محتويات الطلب
              </h3>
              <span className="text-xs font-bold text-gray-500 bg-gray-200/50 px-2 py-1 rounded-lg">
                {activeOrder.items.length} أصناف
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="text-gray-500 font-bold border-b border-gray-50">
                  <tr>
                    <th className="px-6 py-4">الصنف</th>
                    <th className="px-6 py-4 text-center">الكمية</th>
                    <th className="px-6 py-4 text-left">سعر الوحدة</th>
                    <th className="px-6 py-4 text-left">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {activeOrder.items.map((item) => (
                    <tr key={item.orderItemId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{item.productName}</div>
                        <div className="text-xs text-gray-500 font-medium">
                          {item.sizeName} {item.portionName ? ` - ${item.portionName}` : ''}
                          {item.plateTypeName && ` (${item.plateTypeName})`}
                        </div>
                        {item.notes && <div className="text-xs text-orange-600 mt-1">ملاحظة: {item.notes}</div>}
                      </td>
                      <td className="px-6 py-4 text-center font-black">x{item.quantity}</td>
                      <td className="px-6 py-4 text-left font-bold text-gray-600">{item.unitPrice.toLocaleString()} ر.س</td>
                      <td className="px-6 py-4 text-left font-black text-gray-900">{item.totalPrice.toLocaleString()} ر.س</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-gray-50/30 border-t border-gray-50">
              <div className="space-y-3 max-w-sm mr-auto">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold">المجموع الفرعي:</span>
                  <span className="font-bold text-gray-900">{activeOrder.subtotal.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold">تكلفة التوصيل:</span>
                  <span className="font-bold text-gray-900">{activeOrder.deliveryCost.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-lg font-black text-gray-900">الإجمالي الكلي:</span>
                  <span className="text-xl font-black text-[var(--primary)]">{activeOrder.totalCost.toLocaleString()} ر.س</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Payments History */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Notes Section */}
             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
               <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                 <FileText size={18} className="text-orange-500" />
                 <h3 className="font-bold text-gray-900">ملاحظات الطلب</h3>
               </div>
               <div className="p-6 flex-1 text-gray-600 font-medium text-sm leading-relaxed">
                 {activeOrder.notes || 'لا توجد ملاحظات على هذا الطلب'}
               </div>
             </div>

             {/* Payment Stats */}
             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                 <h3 className="font-bold text-gray-900 flex items-center gap-2">
                   <CreditCard size={18} className="text-emerald-500" />
                   حالة الدفع
                 </h3>
                 <PaymentStatusBadge status={activeOrder.paymentStatus} />
               </div>
               <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-bold text-sm">المسدد:</span>
                    <span className="font-black text-emerald-600 text-lg">{activeOrder.paidAmount.toLocaleString()} ر.س</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (activeOrder.paidAmount / activeOrder.totalCost) * 100)}%` }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-bold text-sm">المتبقي:</span>
                    <span className="font-black text-red-600 text-lg">{activeOrder.remainingAmount.toLocaleString()} ر.س</span>
                  </div>
                  <Button 
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full mt-2 h-10 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none font-bold gap-2"
                  >
                    <Plus size={16} />
                    إضافة دفعة / استرداد
                  </Button>
               </div>
             </div>
          </div>

          {/* Payments Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-4 border-b border-gray-50 bg-gray-50/50">
               <h3 className="font-bold text-gray-900 flex items-center gap-2">
                 <Clock size={18} className="text-blue-500" />
                 سجل المدفوعات
               </h3>
             </div>
             <div className="p-4">
               {activeOrder.payments.length === 0 ? (
                 <div className="text-center py-8 text-gray-400 font-medium italic">لم يتم تسجيل أي عمليات دفع بعد</div>
               ) : (
                 <div className="space-y-4">
                    {activeOrder.payments.map((payment) => (
                      <div key={payment.paymentId} className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${payment.isRefund ? 'bg-red-50/30 border-red-100' : 'bg-gray-50/50 border-gray-100'}`}>
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${payment.isRefund ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          <CreditCard size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                             <div className="font-black text-gray-900">
                               {payment.isRefund ? 'عملية استرداد مبلغ' : 'عملية دفع جديدة'}
                             </div>
                             <div className={`font-black text-lg ${payment.isRefund ? 'text-red-700' : 'text-emerald-700'}`}>
                               {payment.isRefund ? '-' : '+'}{payment.amount.toLocaleString()} ر.س
                             </div>
                          </div>
                          <div className="text-xs text-gray-500 font-bold flex items-center gap-3">
                             <span className="flex items-center gap-1"><Clock size={12} /> {formatDate(payment.createdAt)}</span>
                             <span className="flex items-center gap-1"><User size={12} /> {payment.createdBy}</span>
                             <span className="px-2 py-0.5 rounded-md bg-white border border-gray-100 text-[10px] uppercase">{payment.paymentMethod}</span>
                          </div>
                          {payment.notes && <p className="text-xs text-gray-600 mt-2 font-medium bg-white/50 p-2 rounded-lg italic">"{payment.notes}"</p>}
                        </div>
                      </div>
                    ))}
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
           {/* Customer Info Card */}
           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-4 border-b border-gray-50 bg-gray-50/50">
               <h3 className="font-bold text-gray-900 flex items-center gap-2">
                 <User size={18} className="text-blue-500" />
                 بيانات العميل
               </h3>
             </div>
             <div className="p-6 space-y-4">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl">
                    {activeOrder.customer.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg leading-tight">{activeOrder.customer.name}</h4>
                    <p className="text-gray-500 font-bold text-sm mt-1">{activeOrder.customer.phone}</p>
                  </div>
               </div>
               <div className="pt-4 border-t border-gray-50 flex items-center gap-2">
                  <Button variant="outline" className="flex-1 rounded-xl h-10 text-xs font-bold" onClick={() => router.push(`/admin/customers?id=${activeOrder.customer.customerId}`)}>
                    عرض ملف العميل
                  </Button>
               </div>
             </div>
           </div>

           {/* Delivery Info Card */}
           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-4 border-b border-gray-50 bg-gray-50/50">
               <h3 className="font-bold text-gray-900 flex items-center gap-2">
                 <MapPin size={18} className="text-red-500" />
                 بيانات التوصيل
               </h3>
             </div>
             <div className="p-6 space-y-6">
                <div>
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2">منطقة التوصيل</label>
                   <div className="flex items-center gap-2 text-[var(--foreground)] font-black">
                     <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-sm">{activeOrder.address?.areaName || 'غير محدد'}</span>
                   </div>
                </div>

                <div>
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2">العنوان بالتفصيل</label>
                   <p className="text-sm font-bold text-gray-700 bg-gray-50 p-3 rounded-xl min-h-[60px]">
                     {activeOrder.address?.addressDetails || 'لا توجد تفاصيل للعنوان'}
                   </p>
                </div>

                <div className="pt-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2">موعد التوصيل</label>
                   <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                        <Calendar size={18} className="text-blue-600" />
                        <div>
                          <p className="text-[10px] font-black text-gray-400">التاريخ</p>
                          <p className="text-sm font-black text-gray-900">
                            {formatDate(activeOrder.deliveryDate || activeOrder.createdAt, false)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-purple-50/50 p-3 rounded-xl border border-purple-100/50">
                        <Clock size={18} className="text-purple-600" />
                        <div>
                          <p className="text-[10px] font-black text-gray-400">الفترة / الوقت</p>
                          <p className="text-sm font-black text-gray-900">
                            {activeOrder.period.periodName} ({activeOrder.deliveryTime || activeOrder.period.startTime})
                          </p>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
           </div>

           {/* Cancellation Action */}
           {activeOrder.status !== 'delivered' && activeOrder.status !== 'cancelled' && (
             <div className="p-4 bg-red-50 rounded-2xl border border-red-100 mt-auto">
                <Button 
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  variant="ghost" 
                  className="w-full text-red-600 hover:bg-red-100/50 font-black gap-2 h-12"
                >
                  <Trash2 size={18} />
                  إلغاء هذا الطلب
                </Button>
                <p className="text-[10px] text-red-400 text-center font-bold mt-2">ملاحظة: لا يمكن التراجع عن إلغاء الطلب</p>
             </div>
           )}
        </div>
      </div>

      {/* Modals */}
      <StatusUpdateModal 
        isOpen={isStatusModalOpen} 
        onClose={() => setIsStatusModalOpen(false)} 
        order={activeOrder} 
      />
      <AddPaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        order={activeOrder} 
      />
    </div>
  );
}
