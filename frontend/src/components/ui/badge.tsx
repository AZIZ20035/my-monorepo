'use client';

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'ghost' | 'info' | 'warning';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: "bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:border-primary/30",
    secondary: "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    destructive: "bg-red-500/10 text-red-600 border border-red-200 shadow-sm shadow-red-500/5 dark:bg-red-500/20 dark:text-red-400 dark:border-red-900/50",
    outline: "text-foreground border border-slate-100 dark:border-slate-700 hover:bg-sky-50/50 dark:hover:bg-slate-900",
    success: "bg-emerald-500/10 text-emerald-600 border border-emerald-200 shadow-sm shadow-emerald-500/5 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-900/50",
    ghost: "bg-transparent text-slate-500 border border-transparent dark:text-slate-400",
    info: "bg-sky-500/10 text-sky-600 border border-sky-200 shadow-sm shadow-sky-500/5 dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-900/50",
    warning: "bg-amber-500/10 text-amber-600 border border-amber-200 shadow-sm shadow-amber-500/5 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-900/50",
  };

  const dotColors = {
    default: "bg-primary",
    secondary: "bg-slate-400",
    destructive: "bg-red-500",
    outline: "bg-slate-400",
    success: "bg-emerald-500",
    ghost: "bg-slate-400",
    info: "bg-sky-500",
    warning: "bg-amber-500",
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black tracking-tight transition-all duration-300 uppercase",
        variants[variant],
        className
      )}
    >
      <span className="relative flex h-2 w-2 ml-2">
        <span className={cn(
          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
          dotColors[variant]
        )}></span>
        <span className={cn(
          "relative inline-flex rounded-full h-2 w-2",
          dotColors[variant]
        )}></span>
      </span>
      {children}
    </motion.span>
  );
}
