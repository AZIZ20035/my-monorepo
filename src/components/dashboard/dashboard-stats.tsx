'use client';

import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Clock, 
  CheckCircle2, 
  UserPlus 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { DashboardStats as StatsDto } from '@/dto/dashboard.dto';

interface DashboardStatsProps {
  stats: StatsDto | null;
  loading: boolean;
}

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 rounded-xl" />
      ))}
    </div>;
  }

  if (!stats) return null;

  const cards = [
    {
      label: 'إيرادات اليوم',
      value: `${stats.todayRevenue.toLocaleString()} ر.س`,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100',
      description: 'مبيعات محققة'
    },
    {
      label: 'طلبات اليوم',
      value: stats.todayOrders,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      description: 'إجمالي الطلبات'
    },
    {
      label: 'عملاء جدد',
      value: stats.newCustomersToday,
      icon: UserPlus,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      description: 'تم تسجيلهم اليوم'
    },
    {
      label: 'قيد التجهيز',
      value: stats.preparingOrders,
      icon: Package,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      description: 'جاري العمل عليها'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6 border-none shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                <h3 className="text-2xl font-bold mt-2">{card.value}</h3>
                <p className="text-xs text-gray-400 mt-1">{card.description}</p>
              </div>
              <div className={`p-3 rounded-full ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
