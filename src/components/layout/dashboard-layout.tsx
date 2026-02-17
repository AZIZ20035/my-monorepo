'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { Sidebar, MenuItem } from './sidebar';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Menu, Calendar, Clock } from 'lucide-react';
import { ThemeToggle } from '../common/theme-toggle';

interface DashboardLayoutProps {
  children: React.ReactNode;
  menuItems: MenuItem[];
  roleTitle?: string;
}

export function DashboardLayout({ children, menuItems, roleTitle = 'المستخدم' }: DashboardLayoutProps) {
  const { user } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Client-side only to avoid hydration mismatch
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Gregorian (Global) Date
  const formatGlobalDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      calendar: 'gregory',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Format Hijri (Islamic) Date
  const formatHijriDate = (date: Date) => {
    try {
      return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
    } catch (e) {
      return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
    }
  };

  // Format Local Time
  const formatLocalTime = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)] transition-colors duration-500" dir="rtl">
      {/* Sidebar - Desktop & Mobile */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        items={menuItems}
      />
      
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <main className={cn(
        "flex-1 flex flex-col min-w-0 relative bg-[var(--background)] transition-all duration-300",
        isCollapsed ? "lg:mr-20" : "lg:mr-72"
      )}>
        {/* Top Header */}
        <header className={cn(
          "fixed top-0 left-0 z-40 h-20 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between transition-all duration-300 shadow-sm dark:shadow-none",
          isCollapsed ? "right-0 lg:right-20" : "right-0 lg:right-72"
        )}>
          <div className="flex items-center gap-4 lg:gap-6 flex-1">
             {/* Mobile Menu Toggle */}
             <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all"
            >
              <Menu size={24} />
            </button>

            {/* Detailed Clock & Date Display */}
            {mounted && (
              <div className="hidden lg:flex flex-wrap items-center gap-3 px-4 py-2 bg-[var(--secondary)]/50 rounded-2xl border border-[var(--border)] shadow-sm">
                <div className="flex items-center gap-2 text-[var(--primary)]">
                  <Calendar size={18} />
                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-2">
                    <span className="text-[10px] lg:text-xs font-black opacity-70">الهجري:</span>
                    <span className="text-xs lg:text-sm font-bold whitespace-nowrap leading-none">{formatHijriDate(time)}</span>
                  </div>
                </div>
                <div className="hidden lg:block w-px h-6 bg-[var(--border)]" />
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-2">
                    <span className="text-[10px] lg:text-xs font-black opacity-70">الميلادي:</span>
                    <span className="text-xs lg:text-sm font-bold whitespace-nowrap leading-none">{formatGlobalDate(time)}</span>
                  </div>
                </div>
                <div className="w-px h-6 bg-[var(--border)]" />
                <div className="flex items-center gap-2 text-[var(--foreground)]">
                  <Clock size={16} className="animate-pulse text-[var(--primary)]" />
                  <span className="text-xs lg:text-sm font-black tabular-nums">{formatLocalTime(time)}</span>
                </div>
              </div>
            )}

            <div className="relative w-full max-w-sm group hidden sm:block">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="بحث..." 
                className="w-full bg-[var(--secondary)] border-none rounded-xl py-2.5 pr-11 pl-4 text-sm outline-none ring-2 ring-transparent focus:ring-[var(--primary)]/20 transition-all text-[var(--foreground)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            
            <button className="relative p-2.5 rounded-xl bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-[var(--secondary)]" />
            </button>

            <div className="h-8 w-px bg-[var(--border)] mx-1 sm:mx-2" />

            <div className="flex items-center gap-2 sm:gap-3 px-1.5 sm:px-2 py-1.5 rounded-xl hover:bg-[var(--secondary)] transition-all cursor-pointer group shrink-0">
              <div className="text-left hidden lg:block">
                <p className="text-sm font-bold text-[var(--foreground)] leading-tight">{user?.name || user?.username}</p>
                <p className="text-[10px] text-[var(--muted-foreground)] uppercase text-right">{roleTitle}</p>
              </div>
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-bl from-[#0784b5] to-[#39ace7] flex items-center justify-center text-white font-bold border-2 border-[var(--border)] group-hover:border-[var(--primary)]/50 transition-all shadow-md dark:shadow-none shrink-0">
                {user?.name?.[0] || user?.username?.[0] || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 lg:p-8 pt-24 lg:pt-28 scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
