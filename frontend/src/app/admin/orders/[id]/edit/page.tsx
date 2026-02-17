'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useOrderStore } from '@/store/use-order-store';
import { useEidDayStore } from '@/store/use-eid-day-store';
import { useCustomerStore } from '@/store/use-customer-store';
import { 
  ArrowRight, 
  Save, 
  Clock, 
  MapPin, 
  Calendar as CalendarIcon, 
  FileText,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UpdateOrderRequest } from '@/dto/order.dto';
import { Customer } from '@/dto/customer.dto';

export default function OrderEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const orderId = parseInt(id);
  const router = useRouter();
  
  const { activeOrder, fetchOrderById, updateOrder, isLoading: isOrderLoading } = useOrderStore();
  const { eidDays, fetchEidDays, isLoading: isEidLoading } = useEidDayStore();
  const { getCustomerById } = useCustomerStore();
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<UpdateOrderRequest>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEidDays();
    if (orderId) {
      fetchOrderById(orderId);
    }
  }, [orderId, fetchOrderById, fetchEidDays]);

  useEffect(() => {
    if (activeOrder) {
      setFormData({
        addressId: activeOrder.address?.addressId,
        eidDayPeriodId: activeOrder.period.eidDayPeriodId,
        deliveryDate: activeOrder.deliveryDate ? activeOrder.deliveryDate.split('T')[0] : '',
        deliveryTime: activeOrder.deliveryTime || '',
        notes: activeOrder.notes || ''
      });

      // Fetch full customer data to get addresses
      getCustomerById(activeOrder.customer.customerId).then(setCustomer);
    }
  }, [activeOrder, getCustomerById]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;

    setIsSubmitting(true);
    try {
      const success = await updateOrder(activeOrder.orderId, formData);
      if (success) {
        router.push(`/admin/orders/${activeOrder.orderId}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if ((isOrderLoading || isEidLoading) && !activeOrder) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent shadow-lg" />
          <p className="text-lg font-black text-[var(--muted-foreground)]">جاري تحميل بيانات الطلب...</p>
        </div>
      </div>
    );
  }

  if (!activeOrder) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">الطلب غير موجود</h2>
          <Button onClick={() => router.push('/admin/orders')} variant="outline">العودة للطلبات</Button>
        </div>
      </div>
    );
  }

  // Prevent editing if delivered
  if (activeOrder.status === 'delivered' || activeOrder.status === 'cancelled') {
    return (
      <div className="flex h-[80vh] items-center justify-center text-center p-6" dir="rtl">
        <div className="max-w-md bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
          <div className="h-16 w-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">لا يمكن تعديل هذا الطلب</h2>
          <p className="text-gray-500 font-bold mb-6">عذراً، الطلبات التي تم تسليمها أو إلغاؤها لا يمكن تعديل بياناتها.</p>
          <Button onClick={() => router.push(`/admin/orders/${activeOrder.orderId}`)} className="w-full h-12 rounded-xl bg-[var(--primary)] text-white font-black">
            العودة لتفاصيل الطلب
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 p-4 lg:p-8 overflow-y-auto custom-scrollbar" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="h-10 w-10 rounded-xl bg-[var(--secondary)] border border-[var(--border)]"
        >
          <ArrowRight size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-black text-gray-900">تعديل الطلب #{activeOrder.orderNumber}</h1>
          <p className="text-sm text-gray-500 font-bold">تحديث بيانات التوصيل أو الملاحظات</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8 space-y-8">
            
            {/* Delivery Details Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-4">
                <MapPin size={20} className="text-red-500" />
                بيانات التوصيل والوقت
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Address Selection */}
                <div className="space-y-2">
                  <Label className="font-bold text-gray-600 block mb-1">عنوان التوصيل</Label>
                  <div className="relative">
                    <select
                      value={formData.addressId || ''}
                      onChange={(e) => setFormData({ ...formData, addressId: parseInt(e.target.value) })}
                      className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 bg-gray-50/30 focus:border-[var(--primary)] focus:bg-white outline-none font-bold text-sm appearance-none transition-all"
                    >
                      {customer?.addresses.map((addr) => (
                        <option key={addr.addressId} value={addr.addressId}>
                          {addr.areaName} - {addr.label} ({addr.addressDetails})
                        </option>
                      ))}
                      {!customer && <option value="">جاري تحميل العناوين...</option>}
                      {customer && customer.addresses.length === 0 && <option value="">لا توجد عناوين مسجلة</option>}
                    </select>
                    <ChevronDown size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold">يمكنك اختيار أحد العناوين المسجلة للعميل فقط</p>
                </div>

                {/* Period Selection */}
                <div className="space-y-2">
                  <Label className="font-bold text-gray-600 block mb-1">فترة التوصيل</Label>
                  <div className="relative">
                    <select
                      value={formData.eidDayPeriodId || ''}
                      onChange={(e) => setFormData({ ...formData, eidDayPeriodId: parseInt(e.target.value) })}
                      className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 bg-gray-50/30 focus:border-[var(--primary)] focus:bg-white outline-none font-bold text-sm appearance-none transition-all"
                    >
                      {eidDays.map((day) => (
                        <optgroup key={day.eidDayId} label={day.nameAr}>
                          {day.periods.map((period) => (
                            <option key={period.eidDayPeriodId} value={period.eidDayPeriodId}>
                              {period.periodName} ({period.startTime})
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <ChevronDown size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label className="font-bold text-gray-600 block mb-1">تاريخ التوصيل</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="date"
                      value={formData.deliveryDate || ''}
                      onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                      className="h-12 pr-12 rounded-xl border-2 border-gray-100 bg-gray-50/30 focus:bg-white font-bold"
                    />
                  </div>
                </div>

                {/* Time */}
                <div className="space-y-2">
                  <Label className="font-bold text-gray-600 block mb-1">وقت التوصيل التقديري</Label>
                  <div className="relative">
                    <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="time"
                      value={formData.deliveryTime || ''}
                      onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                      className="h-12 pr-12 rounded-xl border-2 border-gray-100 bg-gray-50/30 focus:bg-white font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-6 pt-4">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-4">
                <FileText size={20} className="text-orange-500" />
                ملاحظات إضافية
              </h3>
              <div className="space-y-2">
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="أي ملاحظات إضافية عن التوصيل أو محتوى الطلب..."
                  className="w-full min-h-[150px] p-4 rounded-2xl border-2 border-gray-100 bg-gray-50/30 focus:border-[var(--primary)] focus:bg-white outline-none font-medium text-sm transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions Column */}
        <div className="space-y-6">
           <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6 sticky top-0">
             <div className="space-y-1">
                <h4 className="font-black text-gray-900 text-lg">تأكيد التعديلات</h4>
                <p className="text-xs text-gray-500 font-bold leading-relaxed">يرجى التأكد من المواعيد الجديدة والعناوين قبل الحفظ.</p>
             </div>

             <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex gap-3">
                <AlertTriangle size={20} className="text-orange-600 shrink-0" />
                <p className="text-[11px] text-orange-700 font-bold leading-relaxed">
                  عند تغيير الفترة أو التاريخ، سيتم إعادة التحقق من القدرة الاستيعابية للفرع تلقائياً. المطبخ قد لا يستقبل التغييرات المفاجئة.
                </p>
             </div>

             <div className="space-y-3 pt-2">
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl bg-[var(--primary)] text-white font-black text-lg gap-3 shadow-xl shadow-[var(--primary)]/20 hover:scale-[1.02] transition-all"
                >
                  <Save size={22} />
                  {isSubmitting ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </Button>
                <Button 
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                  className="w-full h-12 rounded-2xl text-gray-500 font-black"
                >
                  إلغاء التعديل
                </Button>
             </div>
           </div>
        </div>
      </form>
    </div>
  );
}
