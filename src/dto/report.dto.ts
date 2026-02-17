export interface ReportPeriod {
  start: string;
  end: string;
}

// Management Report
export interface ManagementReportResponse {
  period: ReportPeriod;
  totalOrders: number;
  totalRevenue: number;
  byDay: {
    day: string;
    orderCount: number;
    revenue: number;
    byPeriod: {
      period: string;
      count: number;
      total: number;
    }[];
  }[];
  byCategory: {
    category: string;
    quantity: number;
    revenue: number;
  }[];
}

// Financial Report
export interface FinancialReportResponse {
  period: ReportPeriod;
  totalInvoices: number;
  totalRevenue: number;
  totalPaid: number;
  totalUnpaid: number;
  paymentsByMethod: {
    method: string;
    amount: number;
  }[];
  byPaymentStatus: {
    status: string;
    count: number;
    amount: number;
  }[];
}

// Kitchen Report
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

// Delivery Report
export interface DeliveryReportResponse {
  eidDayId: number;
  byArea: {
    area: string;
    orders: {
      orderId: number;
      customerName: string;
      customerPhone: string;
      address: string;
      period: string;
      deliveryTime: string;
      totalCost: number;
      remainingAmount: number;
    }[];
  }[];
}

// Customer Info Report
export interface CustomerInfoReportResponse {
  period: ReportPeriod;
  totalCustomers: number;
  newCustomers: number;
  withBooking: number;
  withoutBooking: number;
  customers: {
    name: string;
    phone: string;
    isNewCustomer: boolean;
    hasBooking: boolean;
    serviceStatus: string;
    orderCount: number;
    totalSpent: number;
  }[];
}

// Invoice (General)
export interface InvoiceResponse {
  invoiceNumber: number;
  customer: {
    name: string;
    phone: string;
  };
  address: string;
  day: string;
  period: string;
  deliveryDate: string | null;
  deliveryTime: string | null;
  items: {
    product: string;
    size: string | null;
    portion: string;
    plateType: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    notes: string | null;
  }[];
  subtotal: number;
  deliveryCost: number;
  totalCost: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

export interface DeliveryInvoiceResponse {
  invoiceNumber: number;
  customer: {
    name: string;
    phone: string;
  };
  address: string;
  items: {
    product: string;
    size: string | null;
    plateType: string;
    quantity: number;
    totalPrice: number;
    checked: boolean;
  }[];
  totalCost: number;
  remainingAmount: number;
  reviewerName: string;
}
