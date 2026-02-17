'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Area, 
  CreateAreaRequest, 
  UpdateAreaRequest 
} from '@/dto/area.dto';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAreaStore } from '@/store/use-area-store';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import {
  MapPin,
  Map,
  Coins,
  ListOrdered,
  Activity,
  CheckCircle2,
  Globe
} from 'lucide-react';

interface AreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  area: Area | null;
}

export function AreaModal({ isOpen, onClose, area }: AreaModalProps) {
  const { createArea, updateArea, isLoading } = useAreaStore();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [formData, setFormData] = useState<Partial<CreateAreaRequest> & { isActive?: boolean }>({
    nameAr: '',
    nameEn: '',
    deliveryCost: 0,
    sortOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    if (area) {
      setFormData({
        nameAr: area.nameAr,
        nameEn: area.nameEn,
        deliveryCost: area.deliveryCost,
        sortOrder: area.sortOrder,
        isActive: area.isActive,
      });
    } else {
      setFormData({
        nameAr: '',
        nameEn: '',
        deliveryCost: 0,
        sortOrder: 0,
        isActive: true,
      });
    }
  }, [area, isOpen]);

  // Entrance animation for form fields
  useEffect(() => {
    if (isOpen) {
      gsap.fromTo('.form-group', 
        { opacity: 0, y: 15 }, 
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.08, 
          duration: 0.5, 
          ease: 'power3.out',
          delay: 0.1 
        }
      );
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (area) {
        const updateData: UpdateAreaRequest = {
          nameAr: formData.nameAr!,
          nameEn: formData.nameEn || null,
          deliveryCost: Number(formData.deliveryCost),
          sortOrder: Number(formData.sortOrder),
          isActive: formData.isActive!,
        };
        await updateArea(area.id, updateData);
      } else {
        await createArea(formData as CreateAreaRequest);
      }
      onClose();
    } catch (error) {
      // Error handled in store
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={area ? 'تعديل بيانات الحي' : 'إضافة حي جديد'}
    >
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 py-2">
        {/* Names Header */}
        <div className="flex items-center gap-3 mb-1">
          <div className="h-8 w-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
            <MapPin size={18} />
          </div>
          <h3 className="text-sm font-black text-[var(--foreground)] tracking-tight">معلومات الحي</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Arabic Name */}
          <div className="form-group space-y-2">
            <label className="text-xs font-black text-[var(--muted-foreground)] mr-1 flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-[var(--primary)]"></span>
              اسم الحي (عربي)
            </label>
            <div className="relative">
              <Input
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                placeholder="مثال: البستان"
                required
                disabled={isLoading}
                className="h-11 rounded-xl pr-10 border-[var(--border)] focus:ring-[var(--primary)]/20 transition-all font-bold text-[var(--foreground)] bg-[var(--background)]"
              />
              <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            </div>
          </div>

          {/* English Name */}
          <div className="form-group space-y-2">
            <label className="text-xs font-black text-[var(--muted-foreground)] mr-1 flex items-center gap-1.5">
              اسم الحي (إنجليزي)
              <span className="text-[9px] opacity-70">(اختياري)</span>
            </label>
            <div className="relative">
              <Input
                value={formData.nameEn || ''}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                placeholder="Example: Al-Bustan"
                disabled={isLoading}
                className="h-11 rounded-xl pr-10 border-[var(--border)] focus:ring-[var(--primary)]/20 transition-all font-bold text-[var(--foreground)] bg-[var(--background)]"
              />
              <Globe className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Delivery Cost */}
          <div className="form-group space-y-2">
            <label className="text-xs font-black text-[var(--muted-foreground)] mr-1 flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-amber-500"></span>
              تكلفة التوصيل
            </label>
            <div className="relative">
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.deliveryCost}
                onChange={(e) => setFormData({ ...formData, deliveryCost: Number(e.target.value) })}
                required
                disabled={isLoading}
                className="h-11 rounded-xl pr-10 border-[var(--border)] focus:ring-amber-500/20 transition-all font-bold text-[var(--foreground)] bg-[var(--background)]"
              />
              <Coins className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500/70" />
            </div>
          </div>

          {/* Sort Order */}
          <div className="form-group space-y-2">
            <label className="text-xs font-black text-[var(--muted-foreground)] mr-1 flex items-center gap-1.5">
              ترتيب العرض
            </label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                required
                disabled={isLoading}
                className="h-11 rounded-xl pr-10 border-[var(--border)] focus:ring-[var(--primary)]/20 transition-all font-bold text-[var(--foreground)] bg-[var(--background)]"
              />
              <ListOrdered className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            </div>
          </div>
        </div>

        {/* Account Status - Only for Edit */}
        {area && (
          <div className="form-group p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${formData.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-[var(--foreground)]">حالة الحي</p>
                  <p className="text-[10px] font-bold text-[var(--muted-foreground)]">
                    {formData.isActive ? 'الحي نشط ويظهر في خيارات التوصيل' : 'الحي معطل ولا يظهر في المتجر'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`relative h-6 w-11 rounded-full p-1 transition-colors cursor-pointer ${formData.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}
              >
                <motion.div
                  animate={{ x: formData.isActive ? 20 : 0 }}
                  className="h-4 w-4 bg-white rounded-full shadow-sm"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
          <Button
            type="submit"
            isLoading={isLoading}
            className="flex-1 h-12 rounded-xl bg-gradient-to-tr from-[#0784b5] to-[#39ace7] text-white font-black shadow-lg shadow-[#0784b5]/20 hover:scale-[1.02] transition-transform flex items-center gap-2 justify-center"
          >
            {area ? (
              <>
                <CheckCircle2 size={18} />
                حفظ التعديلات
              </>
            ) : (
              <>
                <Map size={18} />
                إضافة الحي
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="h-12 px-6 rounded-xl font-black text-[var(--muted-foreground)] hover:bg-[var(--muted)] cursor-pointer"
          >
            إلغاء
          </Button>
        </div>
      </form>
    </Modal>
  );
}
