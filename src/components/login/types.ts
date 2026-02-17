import { Shield, User, ClipboardList, LucideIcon } from 'lucide-react';

export type LoginRole = 'admin' | 'call_center' | 'order_reviewer';

export interface RoleConfigItem {
  label: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  lightBg: string;
  borderColor: string;
}

export const roleConfig: Record<LoginRole, RoleConfigItem> = {
  call_center: {
    label: 'موظف استقبال',
    description: 'استقبال وتسجيل طلبات العميل',
    icon: User,
    gradient: 'from-[#39ace7] to-[#0784b5]',
    lightBg: 'bg-[#cadeef]/50',
    borderColor: 'border-[#39ace7]',
  },
  order_reviewer: {
    label: 'مراجع طلبات',
    description: 'مراجعة وتدقيق الطلبات المستلمة',
    icon: ClipboardList,
    gradient: 'from-[#60a5fa] to-[#2563eb]',
    lightBg: 'bg-blue-500/10',
    borderColor: 'border-blue-500',
  },
  admin: {
    label: 'مدير النظام',
    description: 'إدارة كل شيء في النظام',
    icon: Shield,
    gradient: 'from-[#0784b5] to-[#055574]',
    lightBg: 'bg-[#0784b5]/10',
    borderColor: 'border-[#0784b5]',
  },
};
