'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEidDayStore } from '@/store/use-eid-day-store';
import { usePeriodStore } from '@/store/use-period-store';
import { useProductStore } from '@/store/use-product-store';
import { DashboardColumn } from './DashboardColumn';
import { ProductCard } from './ProductCard';
import { PricePicker, CartItem } from './PricePicker';
import { Calendar, Clock, Tag, ShoppingBag, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Product } from '@/dto/product.dto';

interface CascadingOrderFlowProps {
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  cartItems: CartItem[];
  selectedDayId: number | null;
  selectedPeriodId: number | null;
  selectedCategoryId: number | null;
  onSelectDay: (id: number | null) => void;
  onSelectPeriod: (id: number | null) => void;
  onSelectCategory: (categoryId: number | null, assignmentId: number | null) => void;
}

export function CascadingOrderFlow({ 
  onAddToCart, 
  cartItems,
  selectedDayId,
  selectedPeriodId,
  selectedCategoryId,
  onSelectDay,
  onSelectPeriod,
  onSelectCategory
}: CascadingOrderFlowProps) {
  const { eidDays, fetchEidDays } = useEidDayStore();
  const { groupedPeriods, fetchDayGrouped, isLoading: isPeriodsLoading } = usePeriodStore();
  const { products } = useProductStore();

  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [focusedColumn, setFocusedColumn] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Initial Fetch
  useEffect(() => {
    fetchEidDays();
  }, [fetchEidDays]);

  // Fetch Periods when Day changes
  useEffect(() => {
    if (selectedDayId) {
      fetchDayGrouped(selectedDayId);
    }
  }, [selectedDayId, fetchDayGrouped]);

  // Derived Data
  const selectedDay = useMemo(() => eidDays.find(d => d.eidDayId === selectedDayId), [eidDays, selectedDayId]);
  const selectedPeriod = useMemo(() => 
    groupedPeriods.find(p => p.periodId === selectedPeriodId),
  [groupedPeriods, selectedPeriodId]);
  const selectedCategory = useMemo(() => 
    selectedPeriod?.categoryCapacities.find(c => c.categoryId === selectedCategoryId),
  [selectedPeriod, selectedCategoryId]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategoryId) return [];
    let filtered = products.filter(p => p.categoryId === selectedCategoryId);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.nameAr.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [products, selectedCategoryId, searchQuery]);

  return (
    <div className="h-full flex flex-col font-cairo">
      <div className="flex-1 flex overflow-x-auto overflow-y-hidden bg-slate-50/50 scroll-smooth custom-scrollbar">
        
        {/* Column 1: Eid Days */}
        <DashboardColumn 
          title="أيام العيد" 
          subtitle="اختر يوم الاستلام" 
          icon={Calendar}
          isCollapsed={focusedColumn !== 1}
          onExpand={() => setFocusedColumn(1)}
          summary={selectedDay?.nameAr}
          active={focusedColumn === 1}
        >
          <div className="flex flex-col gap-4">
            {eidDays.map((day) => {
              const isActive = selectedDayId === day.eidDayId;
              return (
                <motion.button
                  key={day.eidDayId}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSelectDay(day.eidDayId);
                      onSelectPeriod(null);
                      onSelectCategory(null, null);
                      setFocusedColumn(2); // Auto-advance
                    }}
                  className={`relative w-full p-6 rounded-3xl border-2 transition-all duration-300 text-right group overflow-hidden cursor-pointer ${
                    isActive 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/40' 
                      : 'bg-white border-slate-100 font-medium hover:border-slate-300 text-slate-600 shadow-sm'
                  }`}
                >
                  <div className="relative z-10 flex flex-col gap-2">
                    <p className="font-black text-lg font-cairo">{day.nameAr}</p>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive ? 'text-white/40' : 'text-slate-400'}`}>
                      Expected Delivery Window
                    </p>
                  </div>
                  {isActive && (
                    <div className="absolute top-6 left-6 text-white h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center">
                      <CheckCircle2 size={18} />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </DashboardColumn>

        {/* Column 2: Periods */}
        <DashboardColumn 
          title="فترات التسليم" 
          subtitle="توقيت جاهزية الطلب" 
          icon={Clock}
          loading={isPeriodsLoading}
          isCollapsed={focusedColumn !== 2}
          onExpand={() => setFocusedColumn(2)}
          summary={selectedPeriod?.periodName}
          active={focusedColumn === 2}
        >
          {!selectedDayId ? (
            <SelectionPlaceholder text="الرجاء اختيار يوم العيد أولاً" />
          ) : (
            <div className="flex flex-col gap-4">
              {groupedPeriods.map((period) => {
                const isActive = selectedPeriodId === period.periodId;
                return (
                  <motion.button
                    key={period.periodId}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSelectPeriod(period.periodId);
                      onSelectCategory(null, null);
                      setFocusedColumn(3); // Auto-advance
                    }}
                    className={`relative w-full p-6 rounded-3xl border-2 transition-all duration-300 text-right group overflow-hidden cursor-pointer ${
                      isActive 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/40' 
                        : 'bg-white border-slate-100 font-medium hover:border-slate-300 text-slate-600 shadow-sm'
                    }`}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-black text-lg">{period.periodName}</p>
                        {isActive && <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />}
                      </div>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black ${isActive ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-500'}`} dir="ltr">
                        <Clock size={16} />
                        {period.startTime.substring(0, 5)} - {period.endTime.substring(0, 5)}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </DashboardColumn>

        {/* Column 3: Categories & Capacity */}
        <DashboardColumn 
          title="الأقسام" 
          subtitle="السعة التشغيلية" 
          icon={Tag}
          isCollapsed={focusedColumn !== 3}
          onExpand={() => setFocusedColumn(3)}
          summary={selectedCategory?.categoryName}
          active={focusedColumn === 3}
        >
          {!selectedPeriodId ? (
            <SelectionPlaceholder text="الرجاء اختيار الفترة الزمنية" />
          ) : (
            <div className="flex flex-col gap-4">
              {selectedPeriod?.categoryCapacities.map((cap) => {
                const isActive = selectedCategoryId === cap.categoryId;
                const isFull = cap.isFull;
                
                return (
                  <motion.button
                    key={cap.eidDayPeriodId}
                    disabled={isFull && !isActive}
                    whileHover={!isFull || isActive ? { y: -4 } : {}}
                    whileTap={!isFull || isActive ? { scale: 0.98 } : {}}
                    onClick={() => {
                      onSelectCategory(cap.categoryId || null, cap.eidDayPeriodId);
                      setFocusedColumn(4); // Auto-advance
                    }}
                    className={`relative w-full p-6 rounded-3xl border-2 transition-all duration-300 text-right overflow-hidden group cursor-pointer ${
                      isActive 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-600/30' 
                        : isFull
                          ? 'bg-red-50 opacity-40 grayscale cursor-not-allowed border-red-100'
                          : 'bg-white border-slate-100 font-medium hover:border-indigo-200 text-slate-600 shadow-sm'
                    }`}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-black text-lg">{cap.categoryName}</p>
                        {isActive ? <ShoppingBag size={22} /> : isFull && <AlertTriangle size={20} className="text-red-500" />}
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider">
                          <span className={isActive ? 'text-white' : isFull ? 'text-red-500' : 'text-emerald-500'}>
                            {isFull ? 'مكتمل' : `متاح: ${cap.availableAmount}`}
                          </span>
                          <span className={isActive ? 'text-white/60' : 'text-slate-400'}>
                            {cap.currentOrders} / {cap.maxCapacity}
                          </span>
                        </div>
                        <div className={`h-2 w-full rounded-full overflow-hidden ${isActive ? 'bg-white/20' : 'bg-slate-100'}`}>
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(cap.currentOrders / (cap.maxCapacity || 1)) * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${isActive ? 'bg-white' : isFull ? 'bg-red-500' : 'bg-emerald-500'}`}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </DashboardColumn>

        {/* Column 4: Products */}
        <DashboardColumn 
          title="المنتجات" 
          subtitle="قائمة الأصناف" 
          icon={ShoppingBag}
          isCollapsed={focusedColumn !== 4}
          onExpand={() => setFocusedColumn(4)}
          active={focusedColumn === 4}
        >
          {!selectedCategoryId ? (
            <SelectionPlaceholder text="اختر القسم لعرض المنتجات" />
          ) : (
            <div className="flex flex-col gap-6">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                  <ShoppingBag size={18} />
                </div>
                <input
                  type="text"
                  placeholder="بحث عن منتج..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 focus:border-slate-900 focus:bg-white rounded-[1.25rem] py-3 pr-12 pl-4 text-sm font-bold font-cairo transition-all outline-none placeholder:text-slate-300"
                />
              </div>

              {filteredProducts.length === 0 ? (
                <SelectionPlaceholder text={searchQuery ? "لا توجد منتجات تطابق بحثك" : "لا توجد منتجات في هذا القسم"} />
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.productId} 
                      product={product} 
                      onClick={() => setActiveProduct(product)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </DashboardColumn>
      </div>

      {/* Popups */}
      <AnimatePresence>
        {activeProduct && (
          <PricePicker
            product={activeProduct}
            onClose={() => setActiveProduct(null)}
            onAdd={(item) => {
              onAddToCart(item);
              setActiveProduct(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SelectionPlaceholder({ text }: { text: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-30">
      <div className="h-24 w-24 rounded-[3rem] bg-slate-100 flex items-center justify-center mb-6">
        <AlertTriangle size={48} className="text-slate-300" />
      </div>
      <p className="font-black text-lg text-slate-400 leading-relaxed font-cairo">
        {text}
      </p>
    </div>
  );
}
