'use client';

import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Package, 
  MapPin, 
  ClipboardList, 
  UserCircle, 
  Settings,
  Calendar,
  PlusCircle,
  ChefHat,
  History,
  BarChart3
} from 'lucide-react';
import { DashboardLayout } from './dashboard-layout';
import { MenuItem } from './sidebar';

const adminMenuItems: MenuItem[] = [
  { label: 'لوحة التحكم', icon: LayoutDashboard, href: '/admin' },
  { label: 'أيام العيد', icon: Calendar, href: '/admin/eid-days' },
  { label: 'طلب جديد', icon: PlusCircle, href: '/admin/orders/new' },
  { label: 'الطلبات', icon: ShoppingBag, href: '/admin/orders' },
  { label: 'العملاء', icon: Users, href: '/admin/customers' },
  { label: 'المنتجات', icon: Package, href: '/admin/products' },
  { label: 'الأحياء', icon: MapPin, href: '/admin/areas' },
  { label: 'الفترات', icon: ClipboardList, href: '/admin/periods' },
  { label: 'المطبخ', icon: ChefHat, href: '/admin/kitchen' },
  { label: 'المستخدمين', icon: UserCircle, href: '/admin/users' },
  { label: 'سجل النشاطات', icon: History, href: '/admin/activity-logs' },
  { label: 'التقارير', icon: BarChart3, href: '/admin/reports' },
  { label: 'الإعدادات', icon: Settings, href: '/admin/settings' },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout menuItems={adminMenuItems} roleTitle="مدير النظام">
      {children}
    </DashboardLayout>
  );
}
