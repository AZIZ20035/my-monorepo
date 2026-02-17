'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CustomerSelector } from '@/components/orders/create-order/customer-selector';
import { OrderItemsSelector } from '@/components/orders/create-order/order-items-selector';
import { Customer } from '@/dto/customer.dto';
import { CreateOrderRequest } from '@/dto/order.dto';
import { orderService } from '@/services/order-service';
import { toast } from 'sonner';

export default function CreateOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const handleSubmit = async () => {
    if (!selectedCustomer) {
      toast.error('الرجاء اختيار العميل');
      return;
    }

    setLoading(true);
    try {
      // Dummy data for skeletal implementation
      const orderData: CreateOrderRequest = {
        customerId: selectedCustomer.customerId,
        eidDayPeriodId: 1,
        items: [] 
      };

      await orderService.createOrder(orderData);
      toast.success('تم إنشاء الطلب بنجاح');
      router.push('/dashboard/orders');
    } catch (error) {
      toast.error('فشل إنشاء الطلب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">إنشاء طلب جديد</h1>
        <Button variant="ghost" onClick={() => router.back()}>إلغاء</Button>
      </div>

      <div className="grid gap-6">
        <CustomerSelector 
          selectedCustomer={selectedCustomer}
          onSelect={setSelectedCustomer}
        />
        
        <OrderItemsSelector onItemsChange={() => {}} />
        
        <div className="flex justify-end pt-4">
          <Button 
            size="lg" 
            className="w-full sm:w-auto" 
            onClick={handleSubmit} 
            disabled={loading}
          >
            {loading ? 'جاري الإنشاء...' : 'إتمام الطلب'}
          </Button>
        </div>
      </div>
    </div>
  );
}
