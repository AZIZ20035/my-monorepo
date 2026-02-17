'use client';

import { useState, useEffect } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from '../../../../components/ui/sheet';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '../../../../components/ui/tabs';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { 
  User, 
  MapPin, 
  Package, 
  Phone, 
  MessageCircle, 
  Calendar,
  Plus,
  ArrowLeft,
  X,
  MapPinned,
  Clock,
  StickyNote
} from 'lucide-react';
import { useCustomerStore } from '@/store/use-customer-store';
import { AddressForm } from './AddressForm';
import { Modal } from '../../../../components/ui/modal';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '@/lib/utils';
import { Order } from '@/dto/order.dto';

interface CustomerDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: number | null;
}

export function CustomerDetailsDrawer({ isOpen, onClose, customerId }: CustomerDetailsDrawerProps) {
  const { customers, customerOrders, fetchCustomerOrders, addAddress, isLoading } = useCustomerStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    areaId: 0,
    addressDetails: '',
    label: '',
    isDefault: false
  });

  const customer = customers.find(c => c.customerId === customerId);

  useEffect(() => {
    if (isOpen && customerId) {
      fetchCustomerOrders(customerId);
      setActiveTab('profile');
    }
  }, [isOpen, customerId, fetchCustomerOrders]);

  const handleAddAddress = async () => {
    if (!customerId) return;
    if (!newAddress.areaId || !newAddress.addressDetails) {
      toast.error('يرجى إكمال بيانات العنوان');
      return;
    }

    try {
      await addAddress(customerId, newAddress);
      setIsAddAddressOpen(false);
      setNewAddress({ areaId: 0, addressDetails: '', label: '', isDefault: false });
    } catch (error) {
      // Handled in store
    }
  };

  if (!customer) return null;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-full sm:max-w-xl p-0 border-none bg-[var(--background)] flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-6 lg:p-8 bg-gradient-to-l from-[var(--primary)]/5 to-transparent border-b border-[var(--border)] shrink-0">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={onClose}
                className="h-10 w-10 flex items-center justify-center rounded-2xl text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-all cursor-pointer bg-[var(--muted)]"
              >
                <X className="h-5 w-5" />
              </button>
              <Badge variant={customer.isActive ? 'success' : 'destructive'} className="h-7">
                {customer.isActive ? 'نشط' : 'معطل'}
              </Badge>
            </div>

            <div className="flex items-center gap-5">
              <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-[1.5rem] lg:rounded-[2rem] bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-black text-2xl lg:text-3xl shadow-inner border border-[var(--primary)]/20">
                {customer.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <SheetTitle className="text-2xl lg:text-3xl font-black text-[var(--foreground)] tracking-tight">
                  {customer.name}
                </SheetTitle>
                <div className="flex items-center gap-3 text-[var(--muted-foreground)] font-bold text-sm">
                   <div className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      <span dir="ltr">{customer.phone}</span>
                   </div>
                   <div className="h-1 w-1 rounded-full bg-[var(--border)]" />
                   <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>انضم في {formatDate(customer.createdAt)}</span>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <div className="px-6 lg:px-8 mt-4 shrink-0">
              <TabsList className="bg-[var(--secondary)] border border-[var(--border)] h-12">
                <TabsTrigger value="profile" className="gap-2">
                  <User className="h-4 w-4" />
                  الملف الشخصي
                </TabsTrigger>
                <TabsTrigger value="addresses" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  العناوين ({customer.addresses?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="orders" className="gap-2">
                  <Package className="h-4 w-4" />
                  الطلبات ({customer.orderCount})
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 lg:px-8 pb-8 mt-6">
              <AnimatePresence mode="wait">
                <TabsContent key="profile" value="profile" className="m-0 focus-visible:outline-none">
                  <div className="space-y-6">
                     {/* Stats Cards */}
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-[var(--secondary)] border border-[var(--border)] space-y-1">
                           <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-wider">إجمالي الطلبات</p>
                           <p className="text-2xl font-black text-[var(--primary)]">{customer.orderCount}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-[var(--secondary)] border border-[var(--border)] space-y-1">
                           <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-wider">عدد العناوين</p>
                           <p className="text-2xl font-black text-amber-500">{customer.addresses?.length || 0}</p>
                        </div>
                     </div>

                     {/* Contact Info */}
                     <div className="space-y-4">
                        <h3 className="text-sm font-black text-[var(--foreground)] flex items-center gap-2">
                           <Phone className="h-4 w-4 text-[var(--primary)]" />
                           معلومات التواصل
                        </h3>
                        <div className="space-y-3">
                           <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--secondary)] border border-[var(--border)]">
                              <span className="text-xs font-bold text-[var(--muted-foreground)]">الجوال الرئيسي</span>
                              <span className="font-black text-[var(--foreground)]" dir="ltr">{customer.phone}</span>
                           </div>
                           {customer.phone2 && (
                             <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--secondary)] border border-[var(--border)]">
                                <span className="text-xs font-bold text-[var(--muted-foreground)]">الجوال الإضافي</span>
                                <span className="font-black text-[var(--foreground)]" dir="ltr">{customer.phone2}</span>
                             </div>
                           )}
                           {customer.whatsappNumber && (
                             <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--secondary)] border border-[var(--border)]">
                                <span className="text-xs font-bold text-[var(--muted-foreground)]">واتساب</span>
                                <div className="flex items-center gap-2">
                                   <MessageCircle className="h-4 w-4 text-emerald-500" />
                                   <span className="font-black text-[var(--foreground)]" dir="ltr">{customer.whatsappNumber}</span>
                                </div>
                             </div>
                           )}
                        </div>
                     </div>

                     {/* Notes */}
                     {customer.notes && (
                        <div className="space-y-4">
                           <h3 className="text-sm font-black text-[var(--foreground)] flex items-center gap-2">
                              <StickyNote className="h-4 w-4 text-amber-500" />
                              ملاحظات إضافية
                           </h3>
                           <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/50 text-sm font-bold text-amber-900 leading-relaxed">
                              {customer.notes}
                           </div>
                        </div>
                     )}
                  </div>
                </TabsContent>

                <TabsContent key="addresses" value="addresses" className="m-0 focus-visible:outline-none">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="text-sm font-black text-[var(--foreground)]">قائمة العناوين المسجلة</h3>
                       <Button 
                          onClick={() => setIsAddAddressOpen(true)}
                          variant="ghost" 
                          size="sm" 
                          className="text-[var(--primary)] font-black hover:bg-[var(--primary)]/5"
                       >
                          <Plus className="h-4 w-4 ml-1" />
                          إضافة عنوان
                       </Button>
                    </div>

                    {customer.addresses && customer.addresses.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                        {customer.addresses.map((addr, index) => (
                          <div key={addr.addressId || `addr-${index}`} className={`p-4 rounded-xl border-2 transition-all ${addr.isDefault ? 'border-[var(--primary)]/30 bg-[var(--primary)]/5' : 'border-[var(--border)] bg-[var(--secondary)]'}`}>
                            <div className="flex items-start justify-between mb-2">
                               <div className="flex items-center gap-2">
                                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${addr.isDefault ? 'bg-[var(--primary)] text-white' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
                                     <MapPinned className="h-4 w-4" />
                                  </div>
                                  <span className="font-black text-[var(--foreground)]">{addr.label || 'عنوان'}</span>
                               </div>
                               {addr.isDefault && <Badge variant="default" className="text-[10px]">الافتراضي</Badge>}
                            </div>
                            <p className="text-sm font-bold text-[var(--muted-foreground)] pr-10">{addr.addressDetails}</p>
                            <p className="text-[11px] font-black text-[var(--primary)] mt-2 pr-10">{addr.areaName}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 border-2 border-dashed border-[var(--border)] rounded-2xl flex flex-col items-center justify-center text-[var(--muted-foreground)]">
                         <MapPin className="h-10 w-10 mb-3 opacity-20" />
                         <p className="text-sm font-bold">لا توجد عناوين مسجلة</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent key="orders" value="orders" className="m-0 focus-visible:outline-none">
                   <div className="space-y-4">
                      <h3 className="text-sm font-black text-[var(--foreground)] mb-4">سجل طلبات العميل</h3>
                      
                      {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                           <div className="h-10 w-10 border-4 border-[var(--primary)]/20 border-t-[var(--primary)] rounded-full animate-spin" />
                           <p className="text-xs font-bold text-[var(--muted-foreground)]">جاري تحميل الطلبات...</p>
                        </div>
                      ) : customerOrders.length > 0 ? (
                        <div className="space-y-3">
                           {customerOrders.map((order: Order, index: number) => (
                              <div key={order.orderId || `order-${index}`} className="group p-4 rounded-xl bg-[var(--secondary)] border border-[var(--border)] hover:border-[var(--primary)]/30 transition-all cursor-pointer">
                                 <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-xs font-black text-[var(--foreground)]">
                                       <span className="bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-0.5 rounded-lg">#{order.orderId}</span>
                                       <span className="text-[var(--muted-foreground)] font-bold">{formatDate(order.createdAt)}</span>
                                    </div>
                                    <Badge variant="ghost" className="bg-[var(--muted)] text-[var(--muted-foreground)]">
                                       {order.status === 'delivered' ? 'مكتمل' : 'قيد التنفيذ'}
                                    </Badge>
                                 </div>
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                       <Clock className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                                     <span className="text-xs font-bold text-[var(--muted-foreground)]">إجمالي الأصناف: {order.items?.length || 0}</span>
                                    </div>
                                    <span className="text-sm font-black text-[var(--foreground)]">{order.totalCost} ج.م</span>
                                 </div>
                              </div>
                           ))}
                        </div>
                      ) : (
                        <div className="py-12 border-2 border-dashed border-[var(--border)] rounded-2xl flex flex-col items-center justify-center text-[var(--muted-foreground)]">
                           <Package className="h-10 w-10 mb-3 opacity-20" />
                           <p className="text-sm font-bold">لا توجد طلبات سابقة</p>
                        </div>
                      )}
                   </div>
                </TabsContent>
              </AnimatePresence>
            </div>
          </Tabs>
        </SheetContent>
      </Sheet>

      {/* Add Address Modal */}
      <Modal 
        isOpen={isAddAddressOpen} 
        onClose={() => setIsAddAddressOpen(false)}
        title="إضافة عنوان جديد"
        description={`إضافة عنوان جديد للعميل: ${customer.name}`}
      >
        <div className="space-y-6">
          <AddressForm 
            formData={newAddress} 
            onChange={(updates) => setNewAddress(prev => ({ ...prev, ...updates }))} 
          />
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Button variant="ghost" onClick={() => setIsAddAddressOpen(false)} className="font-bold">إلغاء</Button>
            <Button onClick={handleAddAddress} isLoading={isLoading} className="bg-[var(--primary)] text-white font-black px-8 rounded-xl">إضافة العنوان</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
