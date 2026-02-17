'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Clock, TrendingUp, AlertCircle, Users, CheckCircle2, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { DashboardStats } from '@/dto/dashboard.dto';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsGridProps {
  stats: DashboardStats | null;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const statCards = [
    { 
      label: 'إيرادات اليوم', 
      value: `${stats?.todayRevenue?.toLocaleString()} ر.س`, 
      subValue: 'مبيعات حقيقية',
      trend: 'up',
      icon: TrendingUp, 
      color: 'from-green-500 to-green-600',
      trendColor: 'text-green-500',
      shadow: 'shadow-green-500/20'
    },
    { 
      label: 'إجمالي طلبات اليوم', 
      value: stats?.todayOrders || 0, 
      subValue: 'طلبات جديدة اليوم',
      trend: 'up',
      icon: ShoppingBag, 
      color: 'from-blue-500 to-blue-600',
      trendColor: 'text-blue-500',
      shadow: 'shadow-blue-500/20'
    },
    { 
      label: 'قيد التجهيز', 
      value: stats?.preparingOrders || 0, 
      subValue: 'يتم تحضيرها الآن',
      trend: 'warning',
      icon: Package, 
      color: 'from-orange-500 to-orange-600',
      trendColor: 'text-orange-500',
      shadow: 'shadow-orange-500/20'
    },
    { 
      label: 'قيد المراجعة', 
      value: stats?.pendingOrders || 0, 
      subValue: 'في انتظار التأكيد',
      trend: 'warning',
      icon: Clock, 
      color: 'from-amber-500 to-amber-600',
      trendColor: 'text-amber-500',
      shadow: 'shadow-amber-500/20'
    },
    { 
      label: 'تم التسليم', 
      value: stats?.deliveredOrders || 0, 
      subValue: 'طلبات مكتملة اليوم',
      trend: 'up',
      icon: CheckCircle2, 
      color: 'from-teal-500 to-teal-600',
      trendColor: 'text-teal-500',
      shadow: 'shadow-teal-500/20'
    },
    { 
      label: 'مبالغ غير مدفوعة', 
      value: `${stats?.unpaidAmount?.toLocaleString()} ر.س`, 
      subValue: 'ذمم مدينة',
      trend: 'down',
      icon: AlertCircle, 
      color: 'from-red-500 to-red-600',
      trendColor: 'text-red-500',
      shadow: 'shadow-red-500/20'
    },
    { 
      label: 'إجمالي العملاء', 
      value: stats?.totalCustomers || 0, 
      subValue: 'قاعدة البيانات',
      trend: 'up',
      icon: Users, 
      color: 'from-purple-500 to-purple-600',
      trendColor: 'text-purple-500',
      shadow: 'shadow-purple-500/20'
    },
    { 
      label: 'عملاء جدد اليوم', 
      value: stats?.newCustomersToday || 0, 
      subValue: 'منذ بداية اليوم',
      trend: 'up',
      icon: Users, 
      color: 'from-indigo-500 to-indigo-600',
      trendColor: 'text-indigo-500',
      shadow: 'shadow-indigo-500/20'
    },
    { 
      label: 'إجمالي الطلبات (عام)', 
      value: stats?.totalOrders || 0, 
      subValue: 'تراكمي منذ البداية',
      trend: 'up',
      icon: Package, 
      color: 'from-slate-500 to-slate-600',
      trendColor: 'text-slate-500',
      shadow: 'shadow-slate-500/20'
    },
    { 
      label: 'الإيرادات الكلية', 
      value: `${stats?.totalRevenue?.toLocaleString()} ر.س`, 
      subValue: 'تراكمي منذ البداية',
      trend: 'up',
      icon: TrendingUp, 
      color: 'from-emerald-500 to-emerald-600',
      trendColor: 'text-emerald-500',
      shadow: 'shadow-emerald-500/20'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
      {statCards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`group relative p-4 lg:p-6 overflow-hidden border-none bg-[var(--background)] shadow-xl ${card.shadow} hover:scale-[1.02] transition-all duration-300`}>
            <div className={`absolute top-0 right-0 h-1 w-full bg-gradient-to-l ${card.color}`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-[var(--muted-foreground)]">{card.label}</p>
                <h3 className="text-xl lg:text-2xl font-black text-[var(--foreground)] mt-1">{card.value}</h3>
                <div className="mt-2 flex items-center gap-1.5">
                  {card.trend === 'down' ? (
                    <ArrowDownRight size={14} className={card.trendColor} />
                  ) : (
                    <ArrowUpRight size={14} className={card.trendColor} />
                  )}
                  <span className="text-[10px] font-bold text-[var(--muted-foreground)]">
                    {card.subValue}
                  </span>
                </div>
              </div>
              <div className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-lg`}>
                <card.icon size={20} className="lg:w-6 lg:h-6" />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
