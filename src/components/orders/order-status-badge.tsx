import { OrderStatus, PaymentStatus } from '@/dto/order.dto';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-emerald-100 text-emerald-800',
    preparing: 'bg-orange-100 text-orange-800',
    ready: 'bg-blue-100 text-blue-800',
    delivering: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const labels = {
    pending: 'قيد الانتظار',
    preparing: 'جاري التجهيز',
    ready: 'جاهز للاستلام',
    delivering: 'جاري التوصيل',
    delivered: 'تم التوصيل',
    cancelled: 'تم الإلغاء',
    confirmed: 'تم التأكيد',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const styles = {
    paid: 'bg-green-100 text-green-800',
    partial: 'bg-blue-100 text-blue-800',
    unpaid: 'bg-red-100 text-red-800',
  };

  const labels = {
    paid: 'مدفوع',
    partial: 'دفع جزئي',
    unpaid: 'غير مدفوع',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
