'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useProductStore } from '@/store/use-product-store';
import { useCategoryStore } from '@/store/use-category-store';
import { useEidDayStore } from '@/store/use-eid-day-store';
import { useOrderStore } from '@/store/use-order-store';
import { useAreaStore } from '@/store/use-area-store';
import { useCustomerStore } from '@/store/use-customer-store';
import { Customer } from '@/dto/customer.dto';
import { CreateOrderRequest } from '@/dto/order.dto';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  CreditCard, 
  CheckCircle2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

// Types
import { OrderStep } from './types';

// Components
import { CascadingOrderFlow } from './components/CascadingOrderFlow';
import { LiveReceipt } from './components/LiveReceipt';
import { CartItem } from './components/PricePicker';
import { PrintTemplate } from './components/PrintTemplate';

// Steps
import { CustomerStep } from './components/steps/CustomerStep';
import { AddressStep } from './components/steps/AddressStep';
import { PaymentStep } from './components/steps/PaymentStep';
import { ConfirmationStep } from './components/steps/ConfirmationStep';
import { SuccessStep } from './components/steps/SuccessStep';

export default function NewOrderPage() {
  const router = useRouter();
  
  // Stores
  const { products, fetchProducts, fetchReferenceData } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { eidDays, fetchEidDays } = useEidDayStore();
  const { createOrder } = useOrderStore();
  const { fetchAreas } = useAreaStore();
  const { customers } = useCustomerStore();

  // Navigation State
  const [currentStep, setCurrentStep] = useState<OrderStep>('customer');
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string | null>(null);
  
  // Data State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [paidAmount, setPaidAmount] = useState(0);
  const [notes, setNotes] = useState('');
  
  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentCustomer = useMemo(() => {
    if (!selectedCustomer) return null;
    return customers.find(c => c.customerId === selectedCustomer.customerId) || selectedCustomer;
  }, [customers, selectedCustomer]);

  // Load Initial Data
  useEffect(() => {
    async function init() {
      try {
        await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchEidDays(),
          fetchReferenceData(),
          fetchAreas()
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [fetchProducts, fetchCategories, fetchEidDays, fetchReferenceData, fetchAreas]);

  // Derived Values
  const subtotal = useMemo(() => cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0), [cartItems]);
  const deliveryCost = useMemo(() => {
    if (!currentCustomer || !selectedAddressId) return 0;
    const addr = currentCustomer.addresses.find(a => a.addressId === selectedAddressId);
    return addr?.deliveryCost || 0;
  }, [currentCustomer, selectedAddressId]);
  const total = subtotal + deliveryCost;
  
  const deliveryInfo = useMemo(() => {
    const selectedDay = eidDays.find(d => d.eidDayId === selectedDayId);
    const selectedAddress = currentCustomer?.addresses.find(a => a.addressId === selectedAddressId);
    const assignment = selectedDay?.periods.find(p => p.eidDayPeriodId === selectedAssignmentId);
    
    let pName = assignment?.periodName;
    let pTime = assignment ? `${assignment.startTime.substring(0, 5)} - ${assignment.endTime.substring(0, 5)}` : undefined;

    if (!pName && selectedPeriodId) {
      const generic = selectedDay?.periods.find(p => p.periodId === selectedPeriodId);
      if (generic) {
        pName = generic.periodName;
        pTime = `${generic.startTime.substring(0, 5)} - ${generic.endTime.substring(0, 5)}`;
      }
    }

    return {
      areaName: selectedAddress?.areaName || selectedAddress?.addressDetails,
      dayName: selectedDay?.nameAr,
      periodName: pName,
      periodTime: pTime
    };
  }, [eidDays, selectedDayId, currentCustomer, selectedAddressId, selectedAssignmentId, selectedPeriodId]);

  // Step Validation
  const isStepDisabled = useCallback((stepId: OrderStep) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    if (stepIndex === 0) return false;
    
    // Check previous steps
    for (let i = 0; i < stepIndex; i++) {
      const prevStep = steps[i].id;
      if (prevStep === 'customer' && !selectedCustomer) return true;
      if (prevStep === 'address' && !selectedAddressId) return true;
      if (prevStep === 'selection' && (!selectedAssignmentId || cartItems.length === 0)) return true;
    }
    return false;
  }, [selectedCustomer, selectedAddressId, cartItems]);

  const canGoNext = useMemo(() => {
    switch (currentStep) {
      case 'customer': return !!selectedCustomer;
      case 'address': return !!selectedAddressId;
      case 'selection': return !!selectedAssignmentId && cartItems.length > 0;
      case 'payment': return true;
      default: return false;
    }
  }, [currentStep, selectedCustomer, selectedAddressId, cartItems]);

  const steps: { id: OrderStep; label: string; icon: any }[] = [
    { id: 'customer', label: 'العميل', icon: User },
    { id: 'address', label: 'العنوان', icon: MapPin },
    { id: 'selection', label: 'تجهيز الطلب', icon: ShoppingBag },
    { id: 'payment', label: 'الدفع', icon: CreditCard },
    { id: 'confirmation', label: 'تأكيد', icon: CheckCircle2 },
  ];

  const handleNext = () => {
    if (!canGoNext) return;
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handleBack = () => {
    if (currentStep === 'success') return;
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  // Cart Handlers
  const addToCart = useCallback((item: Omit<CartItem, 'id'>) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(
        i => i.productPriceId === item.productPriceId && i.plateTypeId === item.plateTypeId
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + item.quantity,
        };
        return updated;
      }
      return [...prev, { ...item, id: crypto.randomUUID() }];
    });
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(i => (i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
        .filter(i => i.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const handleReset = useCallback(() => {
    setCartItems([]);
    setSelectedDayId(null);
    setSelectedPeriodId(null);
    setSelectedCategoryId(null);
    setSelectedAssignmentId(null);
    setSelectedAddressId(null);
    setPaidAmount(0);
    setNotes('');
    setCreatedOrderNumber(null);
    setCurrentStep('customer');
  }, []);

  // Submit Order
  const handleSubmit = async () => {
    if (!currentCustomer || cartItems.length === 0) return;

    setIsSubmitting(true);
    try {
      // Find a period assignment ID if possible (fallback logic if needed)
      // For now, using selectedPeriodId as eidDayPeriodId just like before
      // but assuming the cascading flow sets it.
      
      const payload: CreateOrderRequest = {
        customerId: currentCustomer.customerId,
        addressId: selectedAddressId || undefined,
        eidDayPeriodId: selectedAssignmentId!, // This is the actual assignment ID
        paidAmount: paidAmount || undefined,
        notes: notes.trim() || undefined,
        items: cartItems.map(item => ({
          productPriceId: item.productPriceId,
          plateTypeId: item.plateTypeId || undefined,
          quantity: item.quantity,
        })),
      };

      const result = await createOrder(payload);
      if (result) {
        // Robust detection of order number from response
        const orderNum = (result as any).orderNumber || (result as any).OrderNumber || (result as any).orderId?.toString() || '';
        setCreatedOrderNumber(orderNum);
        setCurrentStep('success');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent shadow-lg" />
          <p className="text-lg font-black text-[var(--muted-foreground)]">جاري تهيئة النظام...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col overflow-hidden gap-4" dir="rtl">
      
      {/* 🚩 Step Indicator (Hidden in Success) */}
      {currentStep !== 'success' && (
        <div className="bg-[var(--secondary)] border border-[var(--border)] rounded-2xl p-4 shadow-sm shrink-0">
          <div className="flex items-center justify-between max-w-4xl mx-auto px-4 relative">
            <div className="absolute top-[20px] left-0 right-0 h-1 bg-[var(--border)] z-0 rounded-full overflow-hidden mx-12">
              <motion.div 
                initial={{ width: '0%' }}
                animate={{ width: `${(steps.findIndex(s => s.id === currentStep) / (steps.length - 1)) * 100}%` }}
                className="h-full bg-gradient-to-l from-[#0784b5] to-[#39ace7]"
              />
            </div>

            {steps.map((step, idx) => {
              const stepIndex = steps.findIndex(s => s.id === currentStep);
              const isCompleted = idx < stepIndex;
              const isActive = idx === stepIndex;
              const Icon = step.icon;

              return (
                <div 
                  key={step.id} 
                  className={`relative z-10 flex flex-col items-center group/step ${isStepDisabled(step.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={() => !isStepDisabled(step.id) && setCurrentStep(step.id)}
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      backgroundColor: isCompleted || isActive ? 'var(--background)' : 'var(--muted)',
                      borderColor: isCompleted || isActive ? 'var(--primary)' : 'var(--border)',
                    }}
                    className={`h-10 w-10 rounded-xl border-2 flex items-center justify-center shadow-md transition-all z-10 ${
                      isCompleted || isActive ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Icon size={18} />}
                  </motion.div>
                  <span className={`text-[10px] font-black mt-2 whitespace-nowrap transition-colors hidden sm:block ${
                    isActive ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 🏛️ Main Layout */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 overflow-hidden">
        
        {/* ⬅️ Left Panel (Dynamic Content) */}
        <div className={`flex-[65] min-w-0 flex flex-col bg-[var(--background)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden min-h-[400px] ${currentStep === 'success' ? 'lg:flex-1' : ''}`}>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className={`h-full ${currentStep === 'selection' ? '' : 'p-4 sm:p-6'}`}
              >
                {currentStep === 'customer' && <CustomerStep onSelected={setSelectedCustomer} selected={selectedCustomer} />}
                {currentStep === 'address' && <AddressStep customer={currentCustomer!} onSelected={setSelectedAddressId} selectedId={selectedAddressId} />}
                {currentStep === 'selection' && (
                  <CascadingOrderFlow
                    onAddToCart={addToCart}
                    cartItems={cartItems}
                    selectedDayId={selectedDayId}
                    selectedPeriodId={selectedPeriodId}
                    selectedCategoryId={selectedCategoryId}
                    onSelectDay={setSelectedDayId}
                    onSelectPeriod={(id) => {
                      setSelectedPeriodId(id);
                      setSelectedAssignmentId(null); // Reset when period changes
                    }}
                    onSelectCategory={(catId, assignId) => {
                      setSelectedCategoryId(catId);
                      setSelectedAssignmentId(assignId);
                    }}
                  />
                )}
                {currentStep === 'payment' && (
                  <PaymentStep 
                    subtotal={subtotal} 
                    deliveryCost={deliveryCost} 
                    total={total} 
                    paidAmount={paidAmount} 
                    onChangePaid={setPaidAmount} 
                    notes={notes} 
                    onChangeNotes={setNotes} 
                  />
                )}
                {currentStep === 'confirmation' && (
                  <ConfirmationStep 
                    orderData={{
                      selectedCustomer: currentCustomer,
                      selectedPeriodId,
                      cartItems,
                      total,
                      paidAmount,
                      notes,
                      ...deliveryInfo
                    }}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit}
                  />
                )}
                {currentStep === 'success' && (
                    <SuccessStep 
                      orderNumber={createdOrderNumber || ''} 
                     customerName={currentCustomer?.name || ''}
                     total={total}
                     items={cartItems}
                     onPrint={handlePrint}
                     onFinish={() => router.push('/admin/orders')}
                     onReset={handleReset}
                   />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls (Hidden in Success) */}
          {currentStep !== 'success' && (
            <div className="shrink-0 p-4 border-t border-[var(--border)] bg-[var(--secondary)]/50 flex items-center justify-between">
              <Button
                onClick={handleBack}
                disabled={currentStep === 'customer'}
                variant="outline"
                className="h-12 px-6 rounded-xl font-black border-2 gap-2 cursor-pointer transition-all hover:bg-slate-50"
              >
                <ArrowRight size={18} />
                السابق
              </Button>

              {currentStep !== 'confirmation' && (
                <Button
                  onClick={handleNext}
                  disabled={!canGoNext}
                  className="h-12 px-10 rounded-xl bg-gradient-to-l from-[#0784b5] to-[#39ace7] text-white font-black shadow-lg shadow-[#39ace7]/20 border-none gap-2 flex items-center cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>{currentStep === 'payment' ? 'مراجعة الطلب' : 'المتابعة'}</span>
                  <ArrowLeft size={18} />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* ➡️ Right Panel (Always Visible Receipt - Hidden in Success) */}
        {currentStep !== 'success' && (
          <div className="flex-[35] min-w-0 min-w-[320px] hidden lg:block">
            <LiveReceipt
              cartItems={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              selectedCustomer={currentCustomer}
              selectedAddressId={selectedAddressId}
              selectedPeriodId={selectedPeriodId}
              selectedAssignmentId={selectedAssignmentId}
              eidDays={eidDays}
              selectedDayId={selectedDayId}
              paidAmount={paidAmount}
              notes={notes}
              subtotal={subtotal}
              deliveryCost={deliveryCost}
              total={total}
              currentStep={currentStep}
            />
          </div>
        )}
      </div>

      {/* 📄 Print Template (Hidden from screen) */}
      {createdOrderNumber && currentCustomer && (
        <PrintTemplate 
          order={{
            orderNumber: createdOrderNumber,
            customerName: currentCustomer.name,
            customerPhone: currentCustomer.phone,
            items: cartItems,
            total,
            paidAmount,
            notes
          }}
        />
      )}
    </div>
  );
}
