'use client';

import { useState } from 'react';
import { useCustomerStore } from '@/store/use-customer-store';
import { Customer, CreateCustomerDto } from '@/dto/customer.dto';
import { 
  User, 
  Phone, 
  Search, 
  Plus, 
  X, 
  UserPlus, 
  CheckCircle2,
  Smartphone,
  MessageCircle,
  StickyNote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomerStepProps {
  onSelected: (customer: Customer | null) => void;
  selected: Customer | null;
}

export function CustomerStep({ onSelected, selected }: CustomerStepProps) {
  const { searchCustomerByPhone, createCustomer, isLoading } = useCustomerStore();
  const [phone, setPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);

  // New Customer Form State
  const [newCustomer, setNewCustomer] = useState<Partial<CreateCustomerDto>>({
    name: '',
    phone: '',
    phone2: '',
    whatsappNumber: '',
    notes: '',
  });

  const handleSearch = async () => {
    if (!phone.trim()) return;
    setIsSearching(true);
    setSearchAttempted(true);
    try {
      const customer = await searchCustomerByPhone(phone.trim());
      if (customer) {
        onSelected(customer);
        setIsAddingNew(false);
      } else {
        onSelected(null);
        // Pre-fill phone in new customer form
        setNewCustomer(prev => ({ ...prev, phone: phone.trim() }));
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateNew = async () => {
    if (!newCustomer.name || !newCustomer.phone) return;
    setCreationError(null);
    try {
      const payload: CreateCustomerDto = {
        name: newCustomer.name,
        phone: newCustomer.phone,
        phone2: newCustomer.phone2,
        whatsappNumber: newCustomer.whatsappNumber,
        notes: newCustomer.notes,
      };
      
      const created = await createCustomer(payload);
      if (created) {
        onSelected(created);
        setIsAddingNew(false);
      }
    } catch (e: any) {
      console.error(e);
      let errorMsg = 'حدث خطأ أثناء إنشاء العميل. يرجى المحاولة مرة أخرى.';
      
      // Extract error message from axios response if available
      if (e.response?.data?.message) {
        errorMsg = e.response.data.message;
      } else if (e.message) {
        errorMsg = e.message;
      }
      
      setCreationError(errorMsg);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
          <User size={22} />
        </div>
        <div>
          <h2 className="text-xl font-black text-[var(--foreground)]">بيانات العميل</h2>
          <p className="text-sm text-[var(--muted-foreground)] font-bold">ابحث عن عميل موجود أو أضف عميلاً جديداً</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selected && !isAddingNew ? (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Phone size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhone(val);
                    setSearchAttempted(false);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="05xxxxxxxx"
                  className="w-full h-14 bg-[var(--card)] border-2 border-[var(--border)] rounded-2xl pr-12 pl-4 text-xl font-black text-left outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all shadow-sm"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching || phone.length < 10}
                className="h-14 px-8 rounded-2xl bg-[var(--primary)] text-white font-black text-lg gap-2 shadow-lg shadow-[var(--primary)]/20 cursor-pointer"
              >
                {isSearching ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search size={22} />}
                بحث
              </Button>
            </div>

            {searchAttempted && !isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 border-2 border-dashed border-[var(--border)] rounded-3xl bg-[var(--secondary)]/30 flex flex-col items-center text-center gap-4"
              >
                <div className="h-16 w-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <UserPlus size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[var(--foreground)]">العميل غير موجود</h3>
                  <p className="text-sm text-[var(--muted-foreground)] font-bold mt-1">هل تريد إضافة عميل جديد بهذا الرقم؟</p>
                </div>
                <Button
                  onClick={() => setIsAddingNew(true)}
                  className="bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 font-black rounded-xl px-6 h-11 cursor-pointer"
                >
                  نعم، إضافة عميل جديد
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : selected ? (
          <motion.div
            key="selected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-[var(--primary)]/5 to-transparent border-2 border-[var(--primary)]/20 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <User size={120} />
            </div>
            
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-2xl bg-[var(--primary)] text-white flex items-center justify-center shadow-lg shadow-[var(--primary)]/30">
                  <User size={32} />
                </div>
                <div className="text-right">
                  <h3 className="text-2xl font-black text-[var(--foreground)]">{selected.name}</h3>
                  <div className="flex items-center gap-4 mt-1 font-bold">
                    <span className="flex items-center gap-1.5 text-[var(--primary)]" dir="ltr">
                      <Phone size={14} />
                      {selected.phone}
                    </span>
                    {selected.phone2 && (
                      <span className="flex items-center gap-1.5 text-[var(--muted-foreground)]" dir="ltr">
                        <Smartphone size={14} />
                        {selected.phone2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => { onSelected(null); setSearchAttempted(false); setPhone(''); }}
                className="h-10 w-10 p-0 rounded-xl text-red-500 hover:bg-red-500/10 cursor-pointer"
              >
                <X size={20} />
              </Button>
            </div>

            {selected.notes && (
              <div className="mt-4 p-3 rounded-xl bg-white/50 border border-[var(--border)] flex items-start gap-2 text-right">
                <StickyNote size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-[var(--muted-foreground)] line-clamp-2">{selected.notes}</p>
              </div>
            )}

            <div className="mt-6 flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-500/10 w-fit px-3 py-1.5 rounded-lg">
              <CheckCircle2 size={16} />
              تم اختيار العميل بنجاح
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="add-new"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 bg-[var(--card)] p-6 rounded-3xl border-2 border-[var(--border)] shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[var(--foreground)] flex items-center gap-2">
                <UserPlus size={20} className="text-[var(--primary)]" />
                إضافة عميل جديد
              </h3>
              <Button
                variant="ghost"
                onClick={() => setIsAddingNew(false)}
                className="h-8 w-8 p-0 rounded-lg"
              >
                <X size={18} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-bold">الاسم الثلاثي <span className="text-red-500">*</span></Label>
                <Input
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="أدخل اسم العميل..."
                  className="h-12 rounded-xl font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-bold">رقم الجوال <span className="text-red-500">*</span></Label>
                <Input
                  value={newCustomer.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setNewCustomer({ ...newCustomer, phone: val });
                  }}
                  dir="ltr"
                  placeholder="05xxxxxxxx"
                  className="h-12 rounded-xl font-bold text-right"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-bold text-[var(--muted-foreground)]">جوال إضافي</Label>
                <Input
                  value={newCustomer.phone2}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setNewCustomer({ ...newCustomer, phone2: val });
                  }}
                  dir="ltr"
                  placeholder="05xxxxxxxx (اختياري)"
                  className="h-12 rounded-xl font-bold text-right opacity-80"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-bold text-[var(--muted-foreground)]">رقم الواتساب</Label>
                <Input
                  value={newCustomer.whatsappNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setNewCustomer({ ...newCustomer, whatsappNumber: val });
                  }}
                  dir="ltr"
                  placeholder="05xxxxxxxx (اختياري)"
                  className="h-12 rounded-xl font-bold text-right opacity-80"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-bold text-[var(--muted-foreground)]">ملاحظات</Label>
              <textarea
                value={newCustomer.notes}
                onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                placeholder="أي معلومات إضافية عن العميل..."
                className="w-full min-h-[80px] p-3 rounded-xl border-2 border-[var(--border)] bg-[var(--secondary)]/30 focus:outline-none focus:border-[var(--primary)] transition-all resize-none text-right font-bold"
              />
            </div>

            <AnimatePresence>
              {creationError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-xl flex items-center gap-3"
                >
                  <X className="h-5 w-5 bg-red-500 text-white rounded-full p-1 shrink-0" />
                  <p className="font-bold text-sm">{creationError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => setIsAddingNew(false)}
                className="font-black h-12 px-6 rounded-xl cursor-pointer"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleCreateNew}
                disabled={isLoading || !newCustomer.name || !newCustomer.phone || newCustomer.phone?.length < 10}
                className="bg-[var(--primary)] text-white font-black h-12 px-10 rounded-xl gap-2 shadow-lg shadow-[var(--primary)]/20 shadow-xl cursor-pointer"
              >
                {isLoading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 size={18} />}
                إنشاء ومتابعة
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
