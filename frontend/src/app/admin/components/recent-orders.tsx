'use client';

import { ShoppingBag, ChevronRight, ArrowUpRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TodayOrder } from '@/dto/dashboard.dto';

interface RecentOrdersProps {
  orders: TodayOrder[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'مكتمل':
        return { color: 'text-green-600', bg: 'bg-green-500', icon: CheckCircle2 };
      case 'قيد المراجعة':
        return { color: 'text-orange-600', bg: 'bg-orange-500', icon: Clock };
      default:
        return { color: 'text-blue-600', bg: 'bg-blue-500', icon: AlertCircle };
    }
  };

  return (
    <Card className="h-full flex flex-col p-4 lg:p-8 border-[var(--border)] bg-[var(--background)] shadow-2xl shadow-gray-200/50 dark:shadow-none rounded-2xl lg:rounded-3xl overflow-hidden">
      <div className="shrink-0 flex items-center justify-between mb-6 lg:mb-8">
        <h3 className="text-lg lg:text-xl font-black flex items-center gap-2 text-[var(--foreground)]">
          <ShoppingBag className="text-[var(--primary)]" size={20} />
          آخر الطلبات المستلمة
        </h3>
        <Button variant="ghost" className="text-xs lg:text-sm text-[var(--primary)] font-bold hover:bg-[var(--primary)]/5 rounded-xl px-2 lg:px-4">
          عرض الكل
          <ChevronRight size={14} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <table className="w-full text-right border-separate border-spacing-y-3 lg:border-spacing-y-4">
          <thead>
            <tr className="text-[var(--muted-foreground)] text-[10px] lg:text-sm font-bold">
              <th className="pb-2 pr-4">الطلب</th>
              <th className="pb-2">العميل</th>
              <th className="pb-2 hidden sm:table-cell">الفترة</th>
              <th className="pb-2">القيمة</th>
              <th className="pb-2 hidden md:table-cell">الحالة</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <tr key={order.orderId} className="group hover:bg-[var(--secondary)]/50 transition-colors">
                    <td className="py-3 lg:py-4 pr-4 rounded-r-xl lg:rounded-r-2xl bg-[var(--secondary)] group-hover:bg-transparent transition-colors">
                      <p className="font-bold text-sm lg:text-base text-[var(--foreground)]">{order.orderNumber}</p>
                      <p className="text-[9px] lg:text-[10px] text-[var(--muted-foreground)] font-medium mt-0.5">{order.createdAt}</p>
                    </td>
                    <td className="py-3 lg:py-4 bg-[var(--secondary)] group-hover:bg-transparent transition-colors">
                      <p className="font-bold text-xs lg:text-sm text-[var(--foreground)]">{order.customerName}</p>
                    </td>
                    <td className="py-3 lg:py-4 bg-[var(--secondary)] group-hover:bg-transparent transition-colors hidden sm:table-cell">
                      <span className="text-[9px] lg:text-xs font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2 lg:px-3 py-0.5 lg:py-1 rounded-full uppercase">
                        {order.periodName}
                      </span>
                    </td>
                    <td className="py-3 lg:py-4 bg-[var(--secondary)] group-hover:bg-transparent transition-colors">
                      <p className="font-black text-sm lg:text-base text-[var(--foreground)]">{order.totalCost} ر.س</p>
                    </td>
                    <td className="py-3 lg:py-4 bg-[var(--secondary)] group-hover:bg-transparent transition-colors hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <StatusIcon size={12} className={statusInfo.color} />
                        <span className={`text-[9px] lg:text-[10px] font-bold ${statusInfo.color}`}>{order.status}</span>
                      </div>
                    </td>
                    <td className="py-3 lg:py-4 pl-4 rounded-l-xl lg:rounded-l-2xl bg-[var(--secondary)] group-hover:bg-transparent transition-colors">
                      <button className="p-1.5 lg:p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--background)] shadow-sm transition-all opacity-0 group-hover:opacity-100 dark:bg-white/5">
                        <ArrowUpRight size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-[var(--muted-foreground)] font-bold">لا يوجد طلبات لليوم</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
