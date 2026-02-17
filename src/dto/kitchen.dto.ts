import { OrderStatus } from './order.dto';

export interface KitchenOrderItem {
  productName: string;
  size: string | null;
  plateType: string | null;
  quantity: number;
  notes: string | null;
}

export interface KitchenOrder {
  orderId: number;
  customerName: string;
  customerPhone: string;
  address: string;
  period: string;
  deliveryTime: string;
  status: OrderStatus;
  notes: string | null;
  items: KitchenOrderItem[];
}

export interface KitchenProductSummary {
  category: string;
  product: string;
  size: string | null;
  totalQuantity: number;
}

export interface KitchenPlateSummary {
  plateType: string;
  count: number;
}

export interface KitchenSummaryResponse {
  products: KitchenProductSummary[];
  plates: KitchenPlateSummary[];
}

export interface KitchenPeriod {
  eidDayPeriodId: number;
  periodName: string;
  startTime: string;
  endTime: string;
  orderCount: number;
}

export interface KitchenReportResponse {
  eidDayId: number;
  categories: {
    category: string;
    products: {
      product: string;
      size: string | null;
      total: number;
    }[];
  }[];
  plates: {
    plateType: string;
    count: number;
  }[];
  totalOrders: number;
}

export interface UpdateKitchenStatusRequest {
  status: 'preparing' | 'ready' | 'delivered';
}
