'use client';

import { Button } from '@/components/ui/button';

export function DashboardHeader() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-[var(--foreground)] tracking-tight">نظرة عامة على النظام</h2>
          <p className="text-sm lg:text-base text-[var(--muted-foreground)] mt-1">إحصائيات مباشرة وحالة العمل الحالية</p>
        </div>
      </div>

      <div className="flex gap-2 lg:gap-3">
        <Button variant="outline" className="flex-1 sm:flex-none rounded-xl border-[var(--border)] px-4 lg:px-6 text-sm lg:text-base hover:bg-[var(--secondary)] transition-all">تصدير التقرير</Button>
        <Button className="flex-1 sm:flex-none rounded-xl bg-gradient-to-l from-[#0784b5] to-[#39ace7] px-4 lg:px-6 shadow-lg shadow-[#39ace7]/20 text-sm lg:text-base hover:scale-[1.02] active:scale-[0.98] transition-all">طلب جديد</Button>
      </div>
    </div>
  );
}
