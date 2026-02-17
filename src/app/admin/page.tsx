'use client';

import { useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboard-service';
import { DashboardStats, TodayOrder, PeriodAvailability } from '@/dto/dashboard.dto';

// Modular Components
import { DashboardHeader } from './components/dashboard-header';
import { StatsGrid } from './components/stats-grid';
import { RecentOrders } from './components/recent-orders';
import { AvailabilityList } from './components/availability-list';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [availability, setAvailability] = useState<PeriodAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, availabilityData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getPeriodAvailability(),
        ]);
        setStats(statsData);
        setAvailability(availabilityData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 lg:gap-8 overflow-hidden">
      {/* Header Section */}
      <DashboardHeader />

      {/* Stats Grid */}
      <div className="shrink-0">
        <StatsGrid stats={stats} />
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 overflow-hidden">
        {/* Recent Orders List */}
        <div className="xl:col-span-2 min-h-0">
          <RecentOrders orders={[]} />
        </div>

        {/* Period Availability - Right Side */}
        <div className="min-h-0">
          <AvailabilityList availability={availability} />
        </div>
      </div>
    </div>
  );
}
