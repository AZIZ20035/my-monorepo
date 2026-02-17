'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';
import { Order, OrderListResponse } from '@/dto/order.dto';
import { OrderStatusBadge, PaymentStatusBadge } from './order-status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface OrdersTableProps {
  orders: (Order | OrderListResponse)[];
  loading: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onView: (order: any) => void;
  onEdit: (order: any) => void;
  onCancel: (order: any) => void;
}

export function OrdersTable({ 
  orders, 
  loading, 
  totalCount, 
  currentPage, 
  totalPages, 
  onPageChange,
  onView,
  onEdit,
  onCancel
}: OrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Helper to get nested properties safely for both Order and OrderListResponse
  const getCustomerInfo = (order: any) => {
    if ('customer' in order) {
      return { name: order.customer.name, phone: order.customer.phone };
    }
    return { name: order.customerName, phone: order.customerPhone };
  };

  const getPeriodInfo = (order: any) => {
    if ('period' in order) {
      return { day: order.period.eidDayName, period: order.period.periodName };
    }
    return { day: '', period: order.periodName };
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/50">
        <div className="flex items-center gap-2">
           <h3 className="font-bold text-gray-900">قائمة الطلبات</h3>
           <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
             {totalCount} طلب
           </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="بحث برقم الطلب أو اسم العميل..." 
              className="pr-9 h-10 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-50/50 text-gray-500 font-bold text-xs uppercase tracking-wider">
            <tr>
              <th className="px-5 py-4">رقم الطلب</th>
              <th className="px-5 py-4">العميل</th>
              <th className="px-5 py-4">الفترة</th>
              <th className="px-5 py-4 text-left">القيمة</th>
              <th className="px-5 py-4">الحالة</th>
              <th className="px-5 py-4">الدفع</th>
              <th className="px-5 py-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="px-5 py-4">
                    <div className="h-12 bg-gray-100 rounded-xl w-full" />
                  </td>
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-20 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-3">
                    <Search className="h-10 w-10 opacity-20" />
                    <p className="font-bold">لا توجد طلبات لعرضها حالياً</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order, index) => {
                const customer = getCustomerInfo(order);
                const period = getPeriodInfo(order);
                
                return (
                  <motion.tr 
                    key={order.orderId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-5 py-4 font-black text-gray-900">#{order.orderNumber}</td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-gray-900">{customer.name}</div>
                      <div className="text-[11px] text-gray-500 font-medium">{customer.phone}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-gray-700">{period.period}</div>
                      {period.day && <div className="text-[11px] text-gray-500 font-medium">{period.day}</div>}
                    </td>
                    <td className="px-5 py-4 font-black text-primary text-left text-lg">
                      {order.totalCost.toLocaleString()} <span className="text-[10px] opacity-70">ر.س</span>
                    </td>
                    <td className="px-5 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-4">
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-blue-600 hover:bg-blue-100" onClick={() => onView(order)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-orange-600 hover:bg-orange-100" onClick={() => onEdit(order)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-red-600 hover:bg-red-100" onClick={() => onCancel(order)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
          <p className="text-xs font-bold text-gray-500">
            عرض {orders.length} من أصل {totalCount} طلب
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="h-9 px-3 rounded-lg gap-1 border-gray-200"
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const p = i + 1;
                return (
                  <Button
                    key={p}
                    variant={(currentPage === p ? 'default' : 'ghost') as any}
                    size="sm"
                    onClick={() => onPageChange(p)}
                    className={`h-9 w-9 rounded-lg font-bold ${currentPage === p ? 'bg-primary text-white' : ''}`}
                  >
                    {p}
                  </Button>
                );
              })}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="h-9 px-3 rounded-lg gap-1 border-gray-200"
            >
              التالي
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
