'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
}

export const Select = ({ 
  value, 
  onValueChange, 
  placeholder, 
  children, 
  className, 
  disabled,
  searchable,
  searchPlaceholder = "بحث..."
}: SelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [coords, setCoords] = React.useState({ top: 0, left: 0, width: 0 });
  const [isMounted, setIsMounted] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close on click outside and reset search
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // Also check if click was on the portal content (which is outside containerRef)
        const portalContent = document.getElementById('select-portal-content');
        if (portalContent && portalContent.contains(event.target as Node)) return;
        
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const updateCoords = React.useCallback(() => {
    if (containerRef.current && isOpen) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom,
        left: rect.left,
        width: rect.width
      });
    }
  }, [isOpen]);

  React.useEffect(() => {
    updateCoords();
    if (isOpen) {
      window.addEventListener('scroll', updateCoords, true);
      window.addEventListener('resize', updateCoords);
    }
    return () => {
      window.removeEventListener('scroll', updateCoords, true);
      window.removeEventListener('resize', updateCoords);
    };
  }, [isOpen, updateCoords]);

  const selectedChild = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && (child as any).props.value === value
  ) as React.ReactElement | undefined;

  const extractText = (node: React.ReactNode): string => {
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (!node || !React.isValidElement(node)) return '';
    const props = (node as any).props;
    if (Array.isArray(props.children)) {
      return props.children.map(extractText).join(' ');
    }
    return extractText(props.children);
  };

  const childrenArray = React.Children.toArray(children);
  const filteredChildren = searchable && searchTerm 
    ? childrenArray.filter(child => {
        if (React.isValidElement(child)) {
          const content = extractText((child as any).props.children);
          return content.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      })
    : childrenArray;

  const portalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="select-portal-content"
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 4, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="fixed z-[9999] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-2xl"
          style={{ 
            top: coords.top, 
            left: coords.left, 
            width: coords.width 
          }}
          dir="rtl"
        >
          {searchable && (
            <div className="p-2 border-b border-[var(--border)] bg-[var(--secondary)]/50">
              <input
                autoFocus
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-9 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs font-bold focus:outline-none focus:border-[var(--primary)] transition-colors text-right"
                dir="rtl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
            {(() => {
              // Flatten children to extract SelectItems from SelectContent if present
              const items: React.ReactNode[] = [];
              React.Children.forEach(children, (child) => {
                if (React.isValidElement(child)) {
                  // If it's SelectContent, extract its children
                  if ((child.type as any).displayName === 'SelectContent' || (child as any).props?.children && !((child as any).props as any).value) {
                    React.Children.forEach((child as any).props.children, (nestedChild) => {
                      items.push(nestedChild);
                    });
                  } else if (((child as any).props as any).value) {
                    items.push(child);
                  }
                }
              });

              const filteredItems = searchable && searchTerm 
                ? items.filter(child => {
                    if (React.isValidElement(child)) {
                      const content = extractText((child as any).props.children);
                      return content.toLowerCase().includes(searchTerm.toLowerCase());
                    }
                    return false;
                  })
                : items;

              if (filteredItems.length > 0) {
                return filteredItems.map((child, index) => {
                  if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement, {
                      key: index,
                      onClick: () => {
                        onValueChange((child as any).props.value);
                        setIsOpen(false);
                        setSearchTerm('');
                      },
                      isSelected: (child as any).props.value === value
                    } as any);
                  }
                  return child;
                });
              }

              return (
                <div className="py-4 text-center text-xs font-bold text-[var(--muted-foreground)]">
                  لا توجد نتائج
                </div>
              );
            })()}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border-2 px-4 py-2 text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/10 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px]",
          !className?.includes('bg-') && "bg-[var(--background)]",
          isOpen ? "border-[var(--primary)] ring-4 ring-[var(--primary)]/10" : "border-[var(--border)]",
          "hover:border-[var(--primary)]/50",
          !className?.includes('h-') && "h-12",
          className
        )}
      >
        <span className={cn("flex-1 text-right truncate", !value && "text-[var(--muted-foreground)]")}>
          {selectedChild ? (selectedChild as any).props.children : placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200 text-[var(--muted-foreground)] mr-2", isOpen && "rotate-180")} />
      </button>

      {isMounted && createPortal(portalContent, document.body)}
    </div>
  );
};

export const SelectTrigger = ({ children }: { children: React.ReactNode }) => children;
SelectTrigger.displayName = 'SelectTrigger';
export const SelectValue = ({ placeholder }: { placeholder?: string }) => placeholder;
SelectValue.displayName = 'SelectValue';
export const SelectContent = ({ children }: { children: React.ReactNode }) => children;
SelectContent.displayName = 'SelectContent';

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export const SelectItem = ({ value, children, className, onClick, isSelected }: SelectItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 px-3 text-sm font-bold outline-none transition-colors",
        isSelected ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "text-[var(--foreground)] hover:bg-[var(--muted)]",
        className
      )}
    >
      <div className="flex-1 flex items-center justify-between w-full">
         {children}
         {isSelected && <Check className="h-4 w-4 shrink-0" />}
      </div>
    </button>
  );
};
