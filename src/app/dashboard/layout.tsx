'use client';

import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  Package, 
  Settings 
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { MenuItem } from '@/components/layout/sidebar';

const callCenterMenuItems: MenuItem[] = [
  { label: 'لوحة التحكم', icon: LayoutDashboard, href: '/dashboard/orders' },
  { label: 'طلب جديد', icon: PlusCircle, href: '/dashboard/orders/create' },
  { label: 'العملاء', icon: Users, href: '/dashboard/customers' },
  { label: 'المنتجات', icon: Package, href: '/dashboard/products' },
  { label: 'الإعدادات', icon: Settings, href: '/dashboard/settings' },
];

export default function CallCenterLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout menuItems={callCenterMenuItems} roleTitle="مركز الاتصال">
      {children}
    </DashboardLayout>
  );
}
