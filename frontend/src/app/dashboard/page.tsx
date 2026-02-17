'use client';

import { usePermissions } from '@/hooks/use-permissions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogOut, User, ShoppingBag, Bell, Heart } from 'lucide-react';
import { useAuthStore } from '@/store/use-auth-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function UserDashboard() {
  const { isCallCenter, isOrderReviewer, isAuthenticated, user } = usePermissions();
  const { logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      router.push('/admin');
    } else if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || (!isCallCenter && !isOrderReviewer)) {
    if (user?.role !== 'admin') return null;
  }

  const quickActions = [
    { label: 'طلباتي', icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { label: 'المفضلة', icon: Heart, color: 'bg-red-50 text-red-600' },
    { label: 'التنبيهات', icon: Bell, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'الملف الشخصي', icon: User, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 sm:p-6 transition-colors duration-500 scrollbar-hide">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        <header className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between bg-[var(--background)] p-4 sm:p-6 rounded-2xl shadow-sm border border-[var(--border)]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#39ace7] to-[#0784b5] flex items-center justify-center text-white font-bold text-lg sm:text-xl">
              {user?.name?.[0]}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">مرحباً، {user?.name}</h1>
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">نحن سعداء برؤيتك مرة أخرى</p>
            </div>
          </div>
          <Button 
            variant="error" 
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="flex gap-2 w-full sm:w-auto"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </Button>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="p-3 sm:p-4 flex flex-col items-center justify-center gap-2 sm:gap-3 hover:shadow-md transition-shadow cursor-pointer border-none bg-[var(--background)] shadow-lg shadow-gray-200/50 dark:shadow-none">
              <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${action.color}`}>
                <action.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="font-medium text-sm sm:text-base text-[var(--foreground)]">{action.label}</span>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <Card className="lg:col-span-2 p-4 sm:p-8 border-[var(--border)] bg-[var(--background)]">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-[var(--foreground)]">نشاطك الأخير</h2>
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-[var(--secondary)] transition-colors border border-transparent hover:border-[var(--border)]">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[var(--secondary)] flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--muted-foreground)]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm sm:text-base text-[var(--foreground)]">طلب رقم #{1000 + i}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">منذ {i * 2} أيام</p>
                  </div>
                  <span className="text-[10px] sm:text-sm font-medium text-green-600 bg-green-50 dark:bg-green-500/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">مكتمل</span>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-4 sm:p-8 border-[var(--border)] bg-[var(--background)]">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-[var(--foreground)]">معلومات الحساب</h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-[10px] text-[var(--muted-foreground)] uppercase font-bold tracking-wider">اسم المستخدم</label>
                <p className="text-sm sm:text-base text-[var(--foreground)] font-medium">{user?.username || user?.name}</p>
              </div>
              <div>
                <label className="text-[10px] text-[var(--muted-foreground)] uppercase font-bold tracking-wider">نوع الحساب</label>
                <p className="text-sm sm:text-base text-[var(--foreground)] font-medium">{user?.role === 'call_center' ? 'موظف' : 'مدير'}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
