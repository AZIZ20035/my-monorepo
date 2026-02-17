'use client';

import { useEffect, useState, useMemo } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectItem, 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Product, 
  CreateProductRequest,
  ProductSize,
  ProductPortion,
  PlateType
} from '@/dto/product.dto';
import { useProductStore } from '@/store/use-product-store';
import { useCategoryStore } from '@/store/use-category-store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Package, 
  PackagePlus, 
  Tag, 
  Type, 
  AlignRight, 
  Hash, 
  FileText,
  DollarSign,
  Layers,
  Settings2,
  Check,
  LayoutGrid,
  ArrowLeft,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { createProduct, updateProduct, sizes, portions, plateTypes, isLoading } = useProductStore();
  const { categories } = useCategoryStore();
  
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0); // 1 for forward, -1 for backward

  const [formData, setFormData] = useState<CreateProductRequest>({
    categoryId: 0,
    nameAr: '',
    nameEn: '',
    description: '',
    plateOption: 'none',
    sortOrder: 0,
    prices: [],
    plateTypeIds: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        categoryId: product.categoryId,
        nameAr: product.nameAr,
        nameEn: product.nameEn || '',
        description: product.description || '',
        plateOption: product.plateOption,
        sortOrder: product.sortOrder,
        prices: product.prices.map(p => ({
          sizeId: p.sizeId,
          portionId: p.portionId,
          price: p.price
        })),
        plateTypeIds: product.plateTypes.map(pt => pt.plateTypeId),
      });
      setStep(1);
    } else {
      setFormData({
        categoryId: categories.length > 0 ? categories[0].categoryId : 0,
        nameAr: '',
        nameEn: '',
        description: '',
        plateOption: 'none',
        sortOrder: 0,
        prices: [{ price: 0, sizeId: null, portionId: null }],
        plateTypeIds: [],
      });
      setStep(1);
    }
    setErrors({});
  }, [product, isOpen, categories]);

  const addPriceRow = () => {
    setFormData({
      ...formData,
      prices: [...(formData.prices || []), { price: 0, sizeId: null, portionId: null }]
    });
  };

  const removePriceRow = (index: number) => {
    const newPrices = [...(formData.prices || [])];
    newPrices.splice(index, 1);
    setFormData({ ...formData, prices: newPrices });
  };

  const updatePriceRow = (index: number, field: string, value: any) => {
    const newPrices = [...(formData.prices || [])];
    newPrices[index] = { ...newPrices[index], [field]: value };
    setFormData({ ...formData, prices: newPrices });
  };

  const togglePlateType = (id: number) => {
    const nextIds = formData.plateTypeIds?.includes(id)
      ? formData.plateTypeIds.filter(i => i !== id)
      : [...(formData.plateTypeIds || []), id];
    setFormData({ ...formData, plateTypeIds: nextIds });
  };

  const validateStep = (s: number) => {
    const newErrors: Record<string, string> = {};
    if (s === 1) {
      if (!formData.nameAr.trim()) newErrors.nameAr = 'الاسم العربي مطلوب';
      if (!formData.categoryId) newErrors.categoryId = 'يجب اختيار التصنيف';
    } else if (s === 2) {
      if (!formData.prices || formData.prices.length === 0) {
        newErrors.prices = 'يجب إضافة سعر واحد على الأقل';
      } else {
        formData.prices.forEach((p, idx) => {
          if (p.price <= 0) newErrors[`price_${idx}`] = 'يجب إدخال سعر صحيح';
        });
      }
    } else if (s === 3) {
      if (formData.plateOption !== 'none' && (!formData.plateTypeIds || formData.plateTypeIds.length === 0)) {
        newErrors.plateTypeIds = 'يجب اختيار نوع صحن واحد على الأقل';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setDirection(1);
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    try {
      if (product) {
        await updateProduct(product.productId, formData);
      } else {
        await createProduct(formData);
      }
      onClose();
    } catch (error) {
      // toast is handled in store
    }
  };

  const steps = [
    { title: 'البيانات الأساسية', icon: Package },
    { title: 'قائمة الأسعار', icon: Tag },
    { title: 'خيارات التقديم', icon: Layers },
  ];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'تعديل المنتج' : 'إضافة منتج جديد'}
      description={product ? 'تحديث قائمة الأسعار وبيانات المنتج' : 'أضف منتجاً جديداً إلى قائمة المتجر الخاصة بك'}
      size="xl"
    >
      <div className="flex flex-col space-y-8 min-h-[500px]">
        {/* Progress Stepper */}
        <div className="px-4" dir="rtl">
          <div className="flex items-center justify-between relative max-w-2xl mx-auto border-none">
            {/* Progress Background Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[var(--border)] -translate-y-1/2 z-0 rounded-full overflow-hidden">
              <motion.div 
                initial={false}
                animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                className="h-full bg-gradient-to-l from-[#0784b5] to-[#39ace7]"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>

            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === i + 1;
              const isCompleted = step > i + 1;

              return (
                <div key={i} className="relative z-10 flex flex-col items-center">
                  <motion.div
                    initial={false}
                    animate={{ 
                      scale: isActive ? 1.15 : 1,
                      backgroundColor: isCompleted || isActive ? 'var(--background)' : 'var(--muted)',
                      borderColor: isCompleted || isActive ? '#39ace7' : 'var(--border)',
                      color: isCompleted || isActive ? '#39ace7' : 'var(--muted-foreground)'
                    }}
                    className="h-12 w-12 rounded-2xl border-4 flex items-center justify-center shadow-lg transition-colors cursor-default"
                  >
                    {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                  </motion.div>
                  <div className="absolute -bottom-7 whitespace-nowrap">
                    <span className={`text-[10px] font-black uppercase tracking-wider transition-colors ${isActive ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'}`}>
                      {s.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto max-h-[60vh] custom-scrollbar px-1 -mx-1">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="space-y-8 pb-4"
            >
              <form className="px-1">
                {step === 1 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-2 pr-1">
                          <AlignRight size={14} className="text-[var(--primary)]" />
                          اسم المنتج (بالعربية)
                        </Label>
                        <Input
                          value={formData.nameAr}
                          onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                          className={`h-12 rounded-xl bg-[var(--background)] font-bold text-right border-2 transition-all ${
                            errors.nameAr ? 'border-red-500/30' : 'border-[var(--border)] focus:border-[var(--primary)]/30'
                          }`}
                          placeholder="مثال: كبسة دجاج"
                        />
                        {errors.nameAr && <p className="text-[10px] font-black text-red-500 pr-1">{errors.nameAr}</p>}
                      </div>

                      <div className="space-y-3">
                        <Label className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-2 pr-1">
                          <Type size={14} />
                          اسم المنتج (بالإنجليزية)
                        </Label>
                        <Input
                          value={formData.nameEn || ''}
                          onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                          className="h-12 rounded-xl bg-[var(--background)] font-bold text-left border-2 border-[var(--border)]"
                          placeholder="Example: Chicken Kabsa"
                          dir="ltr"
                        />
                      </div>

                      <div className="space-y-4">
                        <Label className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-2 pr-1">
                          <LayoutGrid size={14} className="text-sky-500" />
                          تصنيف المنتج
                        </Label>
                        <Select
                          value={formData.categoryId.toString()}
                          onValueChange={(val) => setFormData({ ...formData, categoryId: parseInt(val) })}
                          placeholder="اختر التصنيف"
                        >
                          {categories.map((cat) => (
                            <SelectItem key={cat.categoryId} value={cat.categoryId.toString()}>
                              {cat.nameAr}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-2 pr-1">
                          <Hash size={14} />
                          ترتيب العرض
                        </Label>
                        <Input
                          type="number"
                          value={formData.sortOrder}
                          onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                          className="h-12 rounded-xl bg-[var(--background)] font-black text-center border-2 border-[var(--border)]"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-2 pr-1">
                        <FileText size={14} />
                        الوصف
                      </Label>
                      <Textarea
                        value={formData.description || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                        className="min-h-[120px] rounded-xl bg-[var(--background)] font-bold text-right border-2 border-[var(--border)] resize-none"
                        placeholder="تفاصيل المنتج أو المكونات..."
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1 text-right">
                        <Label className="text-sm lg:text-base font-black text-[var(--foreground)] uppercase tracking-tight flex items-center gap-2">
                          <Tag size={18} className="text-[var(--primary)]" />
                          قائمة الأسعار والأحجام
                        </Label>
                        <p className="text-[10px] font-bold text-[var(--muted-foreground)]">يمكنك إضافة عدة أسعار لنفس المنتج بناءً على الحجم أو الحصة</p>
                      </div>
                      <Button
                        type="button"
                        onClick={addPriceRow}
                        className="h-10 px-6 rounded-xl font-black text-xs bg-[var(--primary)]/5 text-[var(--primary)] border-2 border-[var(--primary)]/20 hover:bg-[var(--primary)]/10 hover:border-[var(--primary)]/30 transition-all shadow-sm flex items-center gap-2"
                      >
                        <Plus size={16} />
                        إضافة سعر جديد
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <AnimatePresence initial={false}>
                        {formData.prices?.map((price, idx) => (
                          <motion.div 
                            layout
                            initial={{ opacity: 0, x: 20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, x: -20 }}
                            key={idx} 
                            className="group relative flex flex-wrap md:flex-nowrap items-end gap-3 p-6 rounded-3xl bg-[var(--background)] border-2 border-[var(--border)] shadow-sm transition-all hover:shadow-md hover:border-[var(--primary)]/20"
                          >
                            {/* Row Indicator */}
                            <div className="absolute -right-3 -top-3 h-8 w-8 rounded-xl bg-[var(--background)] border-2 border-[var(--border)] flex items-center justify-center text-xs font-black text-[var(--muted-foreground)] shadow-sm group-hover:border-[var(--primary)]/30 group-hover:text-[var(--primary)] transition-all">
                              {idx + 1}
                            </div>

                            <div className="flex-1 min-w-[140px] space-y-2">
                              <Label className="text-[10px] font-black text-[var(--muted-foreground)] uppercase mr-1 flex items-center gap-1">
                                <Package size={10} />
                                الحجم
                              </Label>
                              <Select
                                value={price.sizeId?.toString() || 'null'}
                                onValueChange={(val) => updatePriceRow(idx, 'sizeId', val === 'null' ? null : parseInt(val))}
                                placeholder="عادي"
                              >
                                <SelectItem value="null">عادي / الكل</SelectItem>
                                {sizes.map((s) => (
                                  <SelectItem key={s.sizeId} value={s.sizeId.toString()}>{s.nameAr}</SelectItem>
                                ))}
                              </Select>
                            </div>

                            <div className="flex-1 min-w-[140px] space-y-2">
                              <Label className="text-[10px] font-black text-[var(--muted-foreground)] uppercase mr-1 flex items-center gap-1">
                                <AlignRight size={10} />
                                الكمية / الحصة
                              </Label>
                              <Select
                                value={price.portionId?.toString() || 'null'}
                                onValueChange={(val) => updatePriceRow(idx, 'portionId', val === 'null' ? null : parseInt(val))}
                                placeholder="عادي"
                              >
                                <SelectItem value="null">عادي / الكل</SelectItem>
                                {portions.map((p) => (
                                  <SelectItem key={p.portionId} value={p.portionId.toString()}>{p.nameAr}</SelectItem>
                                ))}
                              </Select>
                            </div>

                            <div className="w-[140px] space-y-2">
                              <Label className="text-[10px] font-black text-[var(--muted-foreground)] uppercase mr-1 flex items-center gap-1">
                                <DollarSign size={10} />
                                السعر
                              </Label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-[var(--muted-foreground)]">SAR</span>
                                <Input
                                  type="number"
                                  value={price.price}
                                  onChange={(e) => updatePriceRow(idx, 'price', parseFloat(e.target.value) || 0)}
                                  className={`h-12 rounded-xl bg-[var(--muted)]/30 font-black text-center border-none shadow-inner pl-12 pr-4 transition-all focus:ring-2 focus:ring-[var(--primary)]/20 ${
                                    errors[`price_${idx}`] ? 'ring-2 ring-red-500/20' : ''
                                  }`}
                                />
                              </div>
                            </div>

                            {(formData.prices?.length ?? 0) > 1 && (
                              <div className="pb-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removePriceRow(idx)}
                                  className="h-12 w-12 text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0 border-2 border-transparent hover:border-red-100 shadow-sm"
                                  title="حذف هذا السعر"
                                >
                                  <Trash2 size={18} />
                                </Button>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {errors.prices && (
                        <p className="text-center py-4 bg-red-500/5 rounded-2xl border-2 border-dashed border-red-500/20 text-red-500 text-xs font-black">
                          {errors.prices}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-6">
                      <Label className="text-sm font-black text-[var(--foreground)] uppercase tracking-tight flex items-center gap-2">
                        <Settings2 size={18} className="text-indigo-500" />
                        خيارات الصحن
                      </Label>
                      <div className="grid grid-cols-3 gap-3 p-2 bg-[var(--muted)]/50 rounded-2xl border border-[var(--border)]">
                        {['none', 'optional', 'required'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setFormData({ 
                                ...formData, 
                                plateOption: opt as any,
                                plateTypeIds: opt === 'none' ? [] : formData.plateTypeIds 
                              });
                              if (opt === 'none') {
                                setErrors(prev => {
                                  const { plateTypeIds, ...rest } = prev;
                                  return rest;
                                });
                              }
                            }}
                            className={`h-12 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                              formData.plateOption === opt 
                              ? 'bg-[var(--background)] text-[var(--primary)] shadow-md border border-[var(--border)]' 
                              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] px-2'
                            }`}
                          >
                            {opt === 'none' ? 'لا يوجد' : opt === 'optional' ? 'اختياري' : 'إجباري'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className={`space-y-6 transition-all duration-300 ${formData.plateOption === 'none' ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
                      <Label className="text-sm font-black text-[var(--foreground)] uppercase tracking-tight flex items-center gap-2">
                        <Layers size={18} className="text-emerald-500" />
                        أنواع الصحن المتاحة
                      </Label>
                      <div className="flex flex-wrap gap-3">
                        {plateTypes.map((pt) => (
                          <button
                            key={pt.plateTypeId}
                            type="button"
                            onClick={() => togglePlateType(pt.plateTypeId)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold border-2 transition-all ${
                              formData.plateTypeIds?.includes(pt.plateTypeId)
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 shadow-sm'
                              : 'bg-[var(--background)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/20'
                            }`}
                          >
                            <AnimatePresence>
                              {formData.plateTypeIds?.includes(pt.plateTypeId) && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                  <Check size={14} strokeWidth={4} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                            {pt.nameAr}
                          </button>
                        ))}
                      </div>
                      <AnimatePresence>
                        {errors.plateTypeIds && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] font-black text-red-500 pr-1"
                          >
                            {errors.plateTypeIds}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                        <Settings2 size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-black text-blue-900 text-sm">تلميح ذكي</h4>
                        <p className="text-blue-800/70 text-xs font-bold leading-relaxed">
                          يمكنك تحديد أنواع الأطباق التي تتناسب مع هذا المنتج ليتمكن العميل من اختيار الطبق المناسب له عند الطلب.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="pt-6 flex items-center justify-between border-t border-[var(--border)]" dir="rtl">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="h-12 px-6 rounded-xl font-black border-2 border-[var(--border)] hover:bg-[var(--muted)] flex items-center gap-2 group"
              disabled={isLoading}
            >
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              السابق
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-12 px-6 rounded-xl font-black text-[var(--muted-foreground)]"
            >
              إلغاء
            </Button>
          )}

          <div className="flex items-center gap-3">
            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="h-12 px-10 rounded-xl bg-gradient-to-l from-[#0784b5] to-[#39ace7] text-white font-black shadow-lg shadow-[#39ace7]/20 flex items-center gap-2 group border-none"
              >
                المتابعة
                <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                onClick={handleSubmit}
                className="h-12 px-10 rounded-xl bg-gradient-to-l from-[#0784b5] to-[#39ace7] text-white font-black shadow-lg shadow-[#39ace7]/20 border-none"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    {product ? 'حفظ التعديلات' : 'إضافة المنتج'}
                  </div>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
