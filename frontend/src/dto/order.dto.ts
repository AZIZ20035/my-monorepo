import { Customer, Address } from './customer.dto';
import { EidDayPeriodResponse } from './period.dto';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'online';

export interface OrderItem {
  orderItemId: number;
  productPriceId: number;
  productName: string;
  sizeName: string | null;
  portionName: string;
  plateTypeId: number | null;
  plateTypeName: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes: string | null;
}

export interface PaymentResponse {
  paymentId: number;
  amount: number;
  paymentMethod: string;
  isRefund: boolean;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface OrderResponse {
  orderId: number;
  orderNumber: string;
  customer: {
    customerId: number;
    name: string;
    phone: string;
  };
  address?: Address;
  period: EidDayPeriodResponse;
  deliveryDate?: string;
  deliveryTime?: string;
  subtotal: number;
  deliveryCost: number;
  totalCost: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  notes?: string;
  items: OrderItem[];
  payments: PaymentResponse[];
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderListResponse {
  orderId: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  periodName: string;
  deliveryDate?: string;
  totalCost: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  itemCount: number;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface OrderItemRequest {
  productPriceId: number;
  plateTypeId?: number | null;
  quantity: number;
  notes?: string;
}

export interface CreateOrderRequest {
  customerId: number;
  addressId?: number | null;
  eidDayPeriodId: number;
  deliveryDate?: string;
  deliveryTime?: string;
  paidAmount?: number;
  notes?: string;
  items: OrderItemRequest[];
}

export interface UpdateOrderRequest {
  addressId?: number;
  eidDayPeriodId?: number;
  deliveryDate?: string;
  deliveryTime?: string;
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: string;
}

export interface AddPaymentRequest {
  amount: number;
  paymentMethod?: string;
  isRefund?: boolean;
  notes?: string;
}

export interface OrderFilterRequest {
  date?: string;
  eidDayId?: number;
  periodId?: number;
  status?: string;
  paymentStatus?: string;
  customerId?: number;
  page?: number;
  pageSize?: number;
}

// Backward-compatible aliases for existing code
export type Order = OrderResponse;
export type OrdersListResponse = PaginatedResponse<OrderListResponse>;
export type CreateOrderDto = CreateOrderRequest;
export type UpdateOrderDto = UpdateOrderRequest;
export type AddPaymentDto = AddPaymentRequest;
export type Payment = PaymentResponse;
