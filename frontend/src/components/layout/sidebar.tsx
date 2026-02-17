'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Package, 
  MapPin, 
  ClipboardList, 
  UserCircle, 
  Settings,
  ChevronRight,
  LogOut,
  X,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/use-auth-store';

export interface MenuItem {
  label: string;
  icon: any;
  href: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (value: boolean) => void;
  items: MenuItem[];
}

export function Sidebar({ 
  isCollapsed, 
  setIsCollapsed, 
  isMobileOpen = false, 
  setIsMobileOpen,
  items
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 1024;

  const handleLogout = async () => {
    await logout();
  };

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '100%', opacity: 0 },
  };

  return (
    <>
      <motion.div 
        initial={false}
        animate={isMobile 
          ? (isMobileOpen ? 'open' : 'closed') 
          : { x: 0, opacity: 1, width: isCollapsed ? 80 : 288 }}
        variants={sidebarVariants}
        className={`fixed top-0 right-0 flex h-screen flex-none z-50 transition-colors duration-500 ${
          isMobile ? (isMobileOpen ? 'flex' : 'hidden') : 'flex'
        }`}
      >
        <motion.div 
          animate={{ width: isCollapsed ? 80 : 288 }}
          className="flex h-full flex-col bg-gradient-to-b from-[var(--sidebar-bg)] to-[var(--background)] border-l border-[var(--border)] transition-colors duration-500 overflow-hidden shadow-2xl shadow-black/10 relative"
        >
          {/* Subtle inner depth for premium feel */}
          <div className="absolute inset-x-0 top-0 h-px bg-white/5 opacity-50" />
          <div className="absolute left-0 inset-y-0 w-px bg-white/5 opacity-30" />
          
          {/* Sidebar Header */}
          <div className={`flex h-20 items-center border-b border-[var(--border)] transition-all duration-300 ${isCollapsed ? 'px-4 justify-center' : 'px-8'} relative bg-[var(--secondary)]/30 backdrop-blur-sm`}>
            <div className={`flex items-center gap-3.5 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#0784b5] to-[#39ace7] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative h-11 w-11 shrink-0 rounded-xl bg-gradient-to-tr from-[#0784b5] to-[#39ace7] flex items-center justify-center shadow-lg shadow-[#39ace7]/20 border border-white/20">
                  <span className="text-white font-black text-2xl tracking-tighter">M</span>
                </div>
              </div>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="whitespace-nowrap flex flex-col"
                >
                  <h1 className="text-lg font-black text-[var(--foreground)] leading-tight tracking-tight">فنون المدفون</h1>
                  <p className="text-[9px] font-black text-[var(--primary)] uppercase tracking-[0.2em] opacity-80 mt-0.5">نظام إدارة العيد</p>
                </motion.div>
              )}
            </div>

            {/* Mobile Close Button */}
            {isMobile && (
              <button 
                onClick={() => setIsMobileOpen?.(false)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-[var(--background)]/50 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className={`flex-1 space-y-1.5 py-6 overflow-y-auto overflow-x-hidden blue-scrollbar ${isCollapsed ? 'px-3' : 'px-4'}`}>
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen?.(false)}
                  title={isCollapsed ? item.label : ''}
                  className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm transition-all duration-300 ${
                    isActive
                      ? 'text-[var(--primary)] font-black'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-bold'
                  } ${isCollapsed ? 'justify-center mx-1' : ''}`}
                >
                  {/* Floating Pill Background for Active Item */}
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        layoutId="activePill"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 bg-white dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-sm rounded-2xl z-0"
                      >
                        {/* High-visibility Accent Bar */}
                        <motion.div 
                          layoutId="activeAccent"
                          className="absolute right-0 top-3 bottom-3 w-1.25 rounded-l-full bg-gradient-to-b from-[var(--primary)] to-[var(--ring)] shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Hover Background - Subtle Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-[var(--primary)]/0 group-hover:bg-[var(--primary)]/[0.03] transition-colors duration-300 z-0" />

                  <div className="relative z-10 flex items-center gap-3 w-full">
                    <item.icon 
                      size={20} 
                      className={`shrink-0 transition-all duration-500 ${
                        isActive 
                        ? 'text-[var(--primary)] scale-110 drop-shadow-[0_2px_8px_rgba(var(--primary-rgb),0.3)]' 
                        : 'group-hover:text-[var(--primary)] group-hover:scale-110'
                      }`} 
                    />
                    {!isCollapsed && (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`flex-1 whitespace-nowrap overflow-hidden text-ellipsis text-right tracking-tight transition-colors duration-300 ${isActive ? 'text-[var(--primary)]' : ''}`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                    {!isCollapsed && isActive && (
                      <motion.div 
                        initial={{ opacity: 0, x: -5 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="h-1 w-1 rounded-full bg-[var(--primary)]/40"
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className={`p-5 border-t border-[var(--border)] ${isCollapsed ? 'flex justify-center' : ''}`}>
            <button
              onClick={handleLogout}
              title={isCollapsed ? 'تسجيل الخروج' : ''}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-black text-red-500/80 transition-all duration-300 hover:bg-red-500/10 hover:text-red-600 hover:shadow-inner ${isCollapsed ? 'justify-center w-auto' : 'w-full'}`}
            >
              <LogOut size={20} className="shrink-0 transition-transform group-hover:-translate-x-1" />
              {!isCollapsed && <span className="whitespace-nowrap flex-1 text-right">تسجيل الخروج</span>}
            </button>
          </div>
        </motion.div>

        {/* Toggle Button - Desktop Only */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -left-3.5 top-22 z-[100] h-7 w-7 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)] shadow-lg shadow-black/5 cursor-pointer transition-all duration-500 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)]/0 to-[var(--primary)]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative z-10"
          >
            <ChevronRight size={14} className="group-hover:scale-125 transition-transform" />
          </motion.div>
        </button>
      </motion.div>
    </>
  );
}
