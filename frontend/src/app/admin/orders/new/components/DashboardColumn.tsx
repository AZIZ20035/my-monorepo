'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface DashboardColumnProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: ReactNode;
  loading?: boolean;
  isCollapsed?: boolean;
  onExpand?: () => void;
  summary?: ReactNode;
  active?: boolean;
}

export function DashboardColumn({ 
  title, 
  subtitle, 
  icon: Icon, 
  children,
  loading,
  isCollapsed,
  onExpand,
  summary,
  active
}: DashboardColumnProps) {
  return (
    <motion.div 
      layout
      initial={false}
      animate={{ 
        flex: isCollapsed ? "0 0 100px" : "1 1 0px",
        backgroundColor: isCollapsed ? 'rgba(248, 250, 252, 0.5)' : 'rgba(255, 255, 255, 1)'
      }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`relative flex flex-col h-full border-l border-slate-100 last:border-l-0 overflow-hidden min-w-0 group/col ${active ? 'z-10 shadow-2xl shadow-slate-200' : ''}`}
    >
      {isCollapsed ? (
        /* 🌑 Collapsed View */
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-full flex flex-col items-center py-10 cursor-pointer hover:bg-slate-100/50 transition-colors w-[100px]"
          onClick={onExpand}
        >
          {Icon && (
            <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-10 shadow-lg">
              <Icon size={18} />
            </div>
          )}
          
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <h3 className="text-sm font-black text-slate-400 font-cairo rotate-180 [writing-mode:vertical-lr] whitespace-nowrap">
              {title}
            </h3>
            {summary && (
              <div className="rotate-180 [writing-mode:vertical-lr] text-slate-900 font-black text-xs whitespace-nowrap px-3 py-1 bg-white border border-slate-200 rounded-full">
                {summary}
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        /* 🌕 Expanded View */
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col h-full w-full min-w-[320px]"
        >
          {/* Column Header */}
          <div className="shrink-0 p-8 pt-10 pb-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {Icon && (
                  <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/10 group-hover/col:scale-110 transition-transform duration-500">
                    <Icon size={22} />
                  </div>
                )}
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight font-cairo">
                    {title}
                  </h3>
                  {subtitle && (
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Column Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-10 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-32 w-full bg-slate-50 animate-pulse rounded-3xl" />
                ))}
              </div>
            ) : (
              children
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
