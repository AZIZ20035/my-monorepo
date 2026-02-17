'use client';

import { useState, useEffect } from 'react';
import { Modal } from '../../../../components/ui/modal';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import { 
  User, 
  Phone, 
  Smartphone, 
  MessageCircle, 
  StickyNote, 
  MapPin,
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { useCustomerStore } from '@/store/use-customer-store';
import { AddressForm } from './AddressForm';
import { Customer, CreateCustomerDto, UpdateCustomerDto, CreateAddressDto } from '@/dto/customer.dto';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
}

export function CustomerModal({ isOpen, onClose, customer }: CustomerModalProps) {
  const { createCustomer, updateCustomer, isLoading } = useCustomerStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CreateCustomerDto>({
    name: '',
    phone: '',
    phone2: '',
    whatsappNumber: '',
    notes: '',
    address: {
      areaId: 0,
      addressDetails: '',
      label: '',
      isDefault: true,
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isWhatsappManual, setIsWhatsappManual] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        phone: customer.phone,
        phone2: customer.phone2 || '',
        whatsappNumber: customer.whatsappNumber || '',
        notes: customer.notes || '',
      });
      setIsWhatsappManual(true);
      setStep(1);
    } else {
      setFormData({
        name: '',
        phone: '',
        phone2: '',
        whatsappNumber: '',
        notes: '',
        address: {
          areaId: 0,
          addressDetails: '',
          label: '',
          isDefault: true,
        }
      });
      setIsWhatsappManual(false);
      setStep(1);
    }
    setErrors({});
  }, [customer, isOpen]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'الاسم مطلوب';
    if (!formData.phone) newErrors.phone = 'رقم الهاتف مطلوب';
    else if (!/^05\d{8}$/.test(formData.phone)) newErrors.phone = 'رقم الجوال السعودي يجب أن يبدأ بـ 05 ويتكون من 10 أرقام';

    if (formData.phone2 && !/^05\d{8}$/.test(formData.phone2)) {
      newErrors.phone2 = 'تنسيق رقم الجوال الإضافي غير صحيح (يجب أن يبدأ بـ 05)';
    }

    if (formData.whatsappNumber && !/^05\d{8}$/.test(formData.whatsappNumber)) {
      newErrors.whatsappNumber = 'تنسيق رقم الواتساب غير صحيح (يجب أن يبدأ بـ 05)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.address?.areaId) newErrors.areaId = 'يجب اختيار الحي';
    if (!formData.address?.addressDetails) newErrors.addressDetails = 'يجب إدخال تفاصيل العنوان';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      if (customer) {
        handleSubmit();
      } else {
        setStep(2);
      }
    }
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (!customer && step === 2 && !validateStep2()) return;
    
    try {
      if (customer) {
        const updateData: UpdateCustomerDto = {
          name: formData.name,
          phone: formData.phone,
          phone2: formData.phone2,
          whatsappNumber: formData.whatsappNumber,
          notes: formData.notes,
        };
        await updateCustomer(customer.customerId, updateData);
      } else {
        await createCustomer(formData);
      }
      onClose();
    } catch (error) {
      // Error is handled by store/toast
    }
  };

  const updateAddress = (addressUpdates: Partial<CreateAddressDto>) => {
    setFormData(prev => ({
      ...prev,
      address: prev.address ? { ...prev.address, ...addressUpdates } : {
        areaId: 0,
        addressDetails: '',
        label: '',
        isDefault: true,
        ...addressUpdates
      }
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}
      description={customer ? 'تحديث معلومات العميل الحالي' : 'قم بإدخال بيانات العميل وعنوانه الأول'}
      size="2xl"
    >
      <div className="space-y-6">
        {!customer && (
          <div className="flex items-center justify-center py-4 mb-8" dir="rtl">
            <div className="flex items-center w-full max-w-2xl relative">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-[var(--border)] -translate-y-1/2 z-0 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: step === 1 ? '50%' : '100%' }}
                  className="h-full bg-gradient-to-l from-[#0784b5] to-[#39ace7]"
                />
              </div>

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center flex-1">
                <motion.div 
                  animate={{ 
                    scale: step === 1 ? 1.1 : 1,
                    backgroundColor: step >= 1 ? 'var(--background)' : 'var(--muted)',
                    borderColor: step >= 1 ? '#39ace7' : 'var(--border)'
                  }}
                  className={`h-12 w-12 rounded-2xl border-4 flex items-center justify-center shadow-lg transition-colors ${step >= 1 ? 'text-[#39ace7]' : 'text-[var(--muted-foreground)]'}`}
                >
                  <User className="h-6 w-6" />
                </motion.div>
                <div className="absolute -bottom-7 whitespace-nowrap">
                  <span className={`text-xs font-black transition-colors ${step === 1 ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'}`}>
                    البيانات الأساسية
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center flex-1">
                <motion.div 
                  animate={{ 
                    scale: step === 2 ? 1.1 : 1,
                    backgroundColor: step === 2 ? 'var(--background)' : 'var(--muted)',
                    borderColor: step === 2 ? '#39ace7' : 'var(--border)'
                  }}
                  className={`h-12 w-12 rounded-2xl border-4 flex items-center justify-center shadow-lg transition-colors ${step === 2 ? 'text-[#39ace7]' : 'text-[var(--muted-foreground)]'}`}
                >
                  <MapPin className="h-6 w-6" />
                </motion.div>
                <div className="absolute -bottom-7 whitespace-nowrap">
                  <span className={`text-xs font-black transition-colors ${step === 2 ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'}`}>
                    العنوان الأول
                  </span>
                </div>
              </div>

              {/* Completion (Optional Visual) */}
              <div className="relative z-10 flex flex-col items-center shrink-0">
                <div className={`h-12 w-12 rounded-2xl border-4 border-dashed border-[var(--border)] bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] opacity-50`}>
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
              dir="rtl"
            >
              <div className="grid grid-cols-1 gap-6 text-right">
                {/* Full Width Name */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[var(--primary)]" />
                    اسم العميل <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, name: val });
                      if (val && errors.name) {
                        setErrors(prev => {
                          const { name, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                    placeholder="الأسم الثلاثي للعميل..."
                    error={errors.name}
                    className="h-12 lg:h-14 rounded-xl bg-[var(--secondary)] font-bold text-lg text-right"
                  />
                </div>

                {/* Contacts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[var(--primary)]" />
                      رقم الجوال <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData(prev => ({ 
                          ...prev, 
                          phone: val,
                          whatsappNumber: isWhatsappManual ? prev.whatsappNumber : val
                        }));
                        
                        const isValid = /^05\d{8}$/.test(val);
                        if (isValid && (errors.phone || (!isWhatsappManual && errors.whatsappNumber))) {
                          setErrors(prev => {
                            const next = { ...prev };
                            if (prev.phone) delete next.phone;
                            if (!isWhatsappManual && prev.whatsappNumber) delete next.whatsappNumber;
                            return next;
                          });
                        }
                      }}
                      placeholder="05xxxxxxxx"
                      dir="ltr"
                      error={errors.phone}
                      maxLength={10}
                      className="h-12 rounded-xl bg-[var(--secondary)] font-bold text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[var(--muted-foreground)]">
                      <Smartphone className="h-4 w-4" />
                      رقم جوال إضافي
                    </Label>
                    <Input
                      value={formData.phone2 || ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({ ...formData, phone2: val });
                        
                        if ((!val || /^05\d{8}$/.test(val)) && errors.phone2) {
                          setErrors(prev => {
                            const { phone2, ...rest } = prev;
                            return rest;
                          });
                        }
                      }}
                      placeholder="05xxxxxxxx"
                      dir="ltr"
                      error={errors.phone2}
                      maxLength={10}
                      className="h-12 rounded-xl bg-[var(--secondary)] font-bold text-right opacity-80"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[var(--muted-foreground)]">
                      <MessageCircle className="h-4 w-4" />
                      رقم الواتساب
                    </Label>
                    <Input
                      value={formData.whatsappNumber || ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({ ...formData, whatsappNumber: val });
                        setIsWhatsappManual(true);
                        
                        if ((!val || /^05\d{8}$/.test(val)) && errors.whatsappNumber) {
                          setErrors(prev => {
                            const { whatsappNumber, ...rest } = prev;
                            return rest;
                          });
                        }
                      }}
                      placeholder="05xxxxxxxx"
                      dir="ltr"
                      error={errors.whatsappNumber}
                      maxLength={10}
                      className="h-12 rounded-xl bg-[var(--secondary)] font-bold text-right opacity-80"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-right">
                <Label className="flex items-center gap-2">
                  <StickyNote className="h-4 w-4 text-[var(--primary)]" />
                  ملاحظات عن العميل
                </Label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="أي معلومات إضافية عن العميل..."
                  className="w-full min-h-[100px] p-4 rounded-xl border-2 font-bold border-[var(--border)] bg-[var(--secondary)] focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all resize-none text-right"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AddressForm 
                formData={formData.address!} 
                onChange={updateAddress} 
                errors={errors} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Footer */}
        <div className="flex flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-[var(--border)]" dir="rtl">
          {step === 2 && !customer ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isLoading}
              className="h-12 px-6 rounded-xl font-black border-2 transition-all hover:bg-[var(--secondary)] flex items-center gap-2 group"
            >
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              <span>السابق</span>
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-12 px-6 rounded-xl font-black text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
            >
              إلغاء
            </Button>
            
            <Button
              type="button"
              onClick={step === 1 && !customer ? handleNext : handleSubmit}
              disabled={isLoading}
              className="h-12 px-10 rounded-xl bg-gradient-to-l from-[#0784b5] to-[#39ace7] text-white font-black shadow-xl shadow-[#39ace7]/20 hover:shadow-[#39ace7]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 border-none group"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {customer 
                      ? 'حفظ التعديلات' 
                      : step === 1 
                        ? 'المتابعة للعنوان' 
                        : 'إنشاء العميل'}
                  </span>
                  {(step === 1 && !customer) ? (
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5" />
                  )}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
