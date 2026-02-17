export interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  unpaidAmount: number;
  totalCustomers: number;
  newCustomersToday: number;
}

export interface PeriodAvailability {
  eidDayPeriodId: number;
  dayName: string;
  periodName: string;
  available: number;
  total: number;
  isFull: boolean;
}

export interface TodayOrder {
  orderId: number;
  orderNumber: string;
  customerName: string;
  periodName: string;
  totalCost: number;
  status: string;
  createdAt: string;
}
