'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-right" ref={containerRef}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const contentChild = child as React.ReactElement<any>;
          if (contentChild.type === DropdownMenuTrigger) {
            return React.cloneElement(contentChild, { onClick: () => setIsOpen(!isOpen) });
          }
          if (contentChild.type === DropdownMenuContent) {
            return (
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                     initial={{ opacity: 0, scale: 0.95, y: 10 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95, y: 10 }}
                     className="absolute z-[120]"
                     style={{ 
                       top: '100%', 
                       left: contentChild.props.align === 'end' ? '0' : 'auto',
                       right: contentChild.props.align === 'start' ? '0' : 'auto',
                       minWidth: '12rem'
                     }}
                  >
                     {React.cloneElement(contentChild, { onClose: () => setIsOpen(false) })}
                  </motion.div>
                )}
              </AnimatePresence>
            );
          }
        }
        return child;
      })}
    </div>
  );
};

export const DropdownMenuTrigger = ({ children, asChild, onClick }: { children: React.ReactNode; asChild?: boolean; onClick?: () => void }) => {
  if (asChild && React.isValidElement(children)) {
    const triggerChild = children as React.ReactElement<any>;
    return React.cloneElement(triggerChild, { onClick: (e: any) => {
      onClick?.();
      triggerChild.props.onClick?.(e);
    } });
  }
  return <button type="button" onClick={onClick}>{children}</button>;
};

export const DropdownMenuContent = ({ children, className, onClose }: { children: React.ReactNode; className?: string; align?: 'start' | 'end'; onClose?: () => void }) => {
  return (
    <div className={cn("mt-2 rounded-xl border border-[var(--border)] bg-[var(--background)] p-1.5 shadow-xl", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const itemChild = child as React.ReactElement<any>;
          return React.cloneElement(itemChild, { onClick: (e: any) => {
            itemChild.props.onClick?.(e);
            onClose?.();
          } });
        }
        return child;
      })}
    </div>
  );
};

export const DropdownMenuItem = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: (e: any) => void }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center rounded-lg px-3 py-2 text-sm font-bold text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]",
        className
      )}
    >
      {children}
    </button>
  );
};
