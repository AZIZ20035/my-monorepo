'use client';

import { useEffect } from 'react';
import { useActivityLogStore } from '@/store/use-activity-log-store';
import { useUserStore } from '@/store/use-user-store';
import { ActivityLogsTable } from './components/activity-logs-table';
import { ActivityLogsFilters } from './components/activity-logs-filters';
import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  History, 
  ShieldCheck, 
  FileText, 
  Download,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ActivityLogsPage() {
  const { 
    logs, 
    isLoading, 
    page, 
    totalPages, 
    hasNext, 
    hasPrevious, 
    fetchLogs, 
    filters, 
    setFilters, 
    resetFilters 
  } = useActivityLogStore();
  
  const { fetchUsers, users } = useUserStore();

  useEffect(() => {
    fetchLogs();
    if (users.length === 0) {
      fetchUsers();
    }
  }, [fetchLogs, fetchUsers, users.length]);

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col space-y-6 lg:space-y-8 pb-4 overflow-hidden">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 bg-[var(--secondary)] border border-[var(--border)] p-6 lg:p-8 rounded-2xl lg:rounded-[2rem] shadow-sm shrink-0"
      >
        <div className="flex items-center gap-4 lg:gap-5">
          <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shadow-sm border border-[var(--primary)]/20 shrink-0">
            <History className="h-6 w-6 lg:h-7 lg:w-7" />
          </div>
          <div className="space-y-0.5 lg:space-y-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[var(--foreground)] tracking-tight">
              سجل النشاطات
            </h1>
            <p className="text-[var(--muted-foreground)] font-bold text-xs sm:text-sm lg:text-base">
              مراقبة العمليات وتحركات المستخدمين في النظام
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
             <Button
                variant="outline"
                className="h-11 lg:h-12 px-5 lg:px-6 rounded-xl border-2 border-[var(--border)] font-black text-sm lg:text-base gap-2 hover:bg-[var(--primary)] hover:text-white transition-all cursor-pointer shadow-sm"
                onClick={() => window.print()}
            >
                <Download className="h-5 w-5" />
                تصدير التقرير
            </Button>
        </div>
      </motion.div>

      {/* FILTERS */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <ActivityLogsFilters 
          filters={filters} 
          onFilterChange={setFilters} 
          onReset={resetFilters} 
        />
      </motion.div>

      {/* TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-1 min-h-0"
      >
        <ActivityLogsTable 
          logs={logs}
          isLoading={isLoading}
          page={page}
          totalPages={totalPages}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          onPageChange={fetchLogs}
        />
      </motion.div>
    </div>
  );
}
