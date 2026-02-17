'use client';

import { useState } from 'react';
import { Customer, Address, CreateAddressDto } from '@/dto/customer.dto';
import { useCustomerStore } from '@/store/use-customer-store';
import { useAreaStore } from '@/store/use-area-store';
import { 
  MapPin, 
  Plus, 
  CheckCircle2, 
  Home, 
  Briefcase, 
  Building, 
  Tag, 
  ArrowLeft,
  X,
  PlusCircle,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { AddressForm } from '@/app/admin/customers/components/AddressForm';

interface AddressStepProps {
  customer: Customer;
  onSelected: (addressId: number) => void;
  selectedId: number | null;
}

export function AddressStep({ customer, onSelected, selectedId }: AddressStepProps) {
  if (!customer) return null;
  const { addAddress, isLoading } = useCustomerStore();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState<CreateAddressDto>({
    areaId: 0,
    addressDetails: '',
    label: '',
    isDefault: false,
  });

  const handleAddNew = async () => {
    if (!newAddress.areaId || !newAddress.addressDetails) return;
    try {
      const added = await addAddress(customer.customerId, newAddress);
      if (added && typeof added === 'object' && 'addressId' in added) {
        onSelected(added.addressId);
        setIsAddingNew(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getAddressIcon = (label?: string) => {
    const l = label?.toLowerCase() || '';
    if (l.includes('بيت') || l.includes('منزل') || l.includes('home')) return <Home size={18} />;
    if (l.includes('عمل') || l.includes('مكتب') || l.includes('work')) return <Briefcase size={18} />;
    return <Building size={18} />;
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
            <MapPin size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-[var(--foreground)]">اختيار العنوان</h2>
            <p className="text-sm text-[var(--muted-foreground)] font-bold">اختر عنوان التوصيل للعميل {customer.name}</p>
          </div>
        </div>
        {!isAddingNew && (
          <Button
            onClick={() => setIsAddingNew(true)}
            className="bg-[var(--primary)] text-white font-black rounded-xl h-11 px-6 gap-2 cursor-pointer transition-all hover:scale-105"
          >
            <PlusCircle size={18} />
            عنوان جديد
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isAddingNew ? (
          <motion.div
            key="add-new-address"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 bg-[var(--card)] p-6 rounded-3xl border-2 border-[var(--border)] shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[var(--foreground)]">إضافة عنوان جديد</h3>
              <Button
                variant="ghost"
                onClick={() => setIsAddingNew(false)}
                className="h-8 w-8 p-0 cursor-pointer"
              >
                <X size={18} />
              </Button>
            </div>

            <AddressForm 
              formData={newAddress} 
              onChange={(data) => setNewAddress(prev => ({ ...prev, ...data }))} 
            />

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsAddingNew(false)}
                className="font-black h-12 px-6 rounded-xl cursor-pointer"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleAddNew}
                disabled={isLoading || !newAddress.areaId || !newAddress.addressDetails}
                className="bg-[var(--primary)] text-white font-black h-12 px-10 rounded-xl gap-2 shadow-lg shadow-[var(--primary)]/20 cursor-pointer"
              >
                {isLoading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 size={18} />}
                حفظ واختيار
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list-addresses"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {customer.addresses.length === 0 ? (
              <div className="col-span-full p-12 border-2 border-dashed border-[var(--border)] rounded-3xl bg-[var(--secondary)]/30 flex flex-col items-center text-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <MapPin size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[var(--foreground)]">لا يوجد عناوين مسجلة</h3>
                  <p className="text-sm text-[var(--muted-foreground)] font-bold mt-1">يجب إضافة عنوان واحد على الأقل لتوصيل الطلب</p>
                </div>
                <Button
                  onClick={() => setIsAddingNew(true)}
                  className="bg-[var(--primary)] text-white font-black rounded-xl px-8 h-12 shadow-lg shadow-[var(--primary)]/20 cursor-pointer"
                >
                  إضافة العنوان الأول
                </Button>
              </div>
            ) : (
              customer.addresses.map((addr) => {
                const isActive = selectedId === addr.addressId;
                return (
                  <button
                    key={addr.addressId}
                    onClick={() => onSelected(addr.addressId)}
                    className={`relative p-5 rounded-2xl border-2 text-right transition-all flex flex-col gap-3 group cursor-pointer ${
                      isActive 
                        ? 'bg-[var(--primary)]/5 border-[var(--primary)] shadow-md' 
                        : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
                        isActive ? 'bg-[var(--primary)] text-white' : 'bg-[var(--secondary)] text-[var(--muted-foreground)] group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)]'
                      }`}>
                        {getAddressIcon(addr.label)}
                      </div>
                      {isActive && (
                        <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                          <CheckCircle2 size={14} />
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-black text-[16px] text-[var(--foreground)] flex items-center gap-1.5 min-h-[1.5rem]">
                        {addr.label || addr.areaName}
                        {addr.isDefault && (
                          <span className="text-[10px] bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-0.5 rounded-full font-black">افتراضي</span>
                        )}
                      </h4>
                      <p className="text-[13px] font-bold text-[var(--muted-foreground)] line-clamp-2 mt-1 min-h-[2.5rem]">
                        {addr.addressDetails}
                      </p>
                    </div>

                    <div className={`mt-2 flex items-center justify-between border-t transition-colors ${isActive ? 'border-[var(--primary)]/20 pt-3' : 'border-transparent pt-0'}`}>
                      <div className="flex items-center gap-1.5 text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1.5 rounded-lg font-black text-[12px]">
                        <Truck size={14} />
                        توصيل {addr.deliveryCost} ر.س
                      </div>
                      <span className="text-[11px] font-black text-[var(--muted-foreground)] uppercase tracking-wider">{addr.areaName}</span>
                    </div>
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
