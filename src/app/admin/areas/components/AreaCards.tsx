'use client';

import { useState } from 'react';
import { Area } from '@/dto/area.dto';
import { Button } from '@/components/ui/button';
import { 
  Edit2, 
  Trash2, 
  MapPin, 
  Coins, 
  ListOrdered,
  CheckCircle2,
  XCircle,
  MoreVertical,
  UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAreaStore } from '@/store/use-area-store';
import { ConfirmModal } from '@/components/common/confirm-modal';

interface AreaCardsProps {
  areas: Area[];
  onEdit: (area: Area) => void;
}

export function AreaCards({ areas, onEdit }: AreaCardsProps) {
  const { isLoading, updateArea } = useAreaStore();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [areaToDeactivate, setAreaToDeactivate] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async (id: number, isActive: boolean) => {
    const area = areas.find(a => a.id === id);
    if (!area) return;

    setIsUpdating(true);
    try {
      await updateArea(id, {
        nameAr: area.nameAr,
        nameEn: area.nameEn,
        deliveryCost: area.deliveryCost,
        sortOrder: area.sortOrder,
        isActive: isActive
      });
      setIsConfirmOpen(false);
    } catch (error) {
      // Error handled in store
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading && areas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 lg:p-32 bg-[var(--secondary)] border border-[var(--border)] rounded-2xl lg:rounded-[2rem] shadow-sm">
        <div className="h-16 w-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center mb-6">
          <MapPin className="h-8 w-8 text-[var(--primary)] animate-pulse" />
        </div>
        <p className="text-[var(--muted-foreground)] font-bold">جاري تحميل الأحياء...</p>
      </div>
    );
  }

  if (areas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 lg:p-32 bg-[var(--secondary)] border border-[var(--border)] rounded-2xl lg:rounded-[2rem] shadow-sm">
        <div className="h-16 w-16 rounded-2xl bg-[var(--muted)] flex items-center justify-center mb-6">
          <MapPin className="h-8 w-8 text-[var(--muted-foreground)]" />
        </div>
        <p className="text-[var(--foreground)] font-black text-xl mb-2">لا توجد أحياء حالياً</p>
        <p className="text-[var(--muted-foreground)] font-bold text-center max-w-xs">
          ابدأ بإضافة أول حي للمطعم لتحديد تكاليف التوصيل
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto blue-scrollbar pb-6 px-1">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {areas.map((area, index) => (
          <motion.div
            key={area.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="group bg-[var(--secondary)] border border-[var(--border)] rounded-3xl p-5 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              {area.isActive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black">
                  <CheckCircle2 size={10} />
                  نشط
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-[10px] font-black">
                  <XCircle size={10} />
                  معطل
                </span>
              )}
            </div>

            {/* Icon & Name */}
            <div className="flex items-center gap-4 mb-6 pt-2">
              <div className="h-12 w-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0 transition-transform group-hover:scale-110 duration-300">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-black text-[var(--foreground)] truncate">{area.nameAr}</h3>
                {area.nameEn && (
                  <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider truncate">
                    {area.nameEn}
                  </p>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[var(--muted)]/50 border border-[var(--border)] rounded-2xl p-3 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <Coins size={12} />
                  <span className="text-[10px] font-black uppercase">التوصيل</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-black text-[var(--foreground)]">{area.deliveryCost}</span>
                  <span className="text-[10px] font-bold text-[var(--muted-foreground)]">ر.س</span>
                </div>
              </div>

              <div className="bg-[var(--muted)]/50 border border-[var(--border)] rounded-2xl p-3 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <ListOrdered size={12} />
                  <span className="text-[10px] font-black uppercase">الترتيب</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-black text-[var(--foreground)]">{area.sortOrder}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => onEdit(area)}
                className="flex-1 h-11 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border-none"
              >
                <Edit2 className="h-4 w-4" />
                تعديل
              </Button>
              
              {area.isActive ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setAreaToDeactivate(area.id);
                    setIsConfirmOpen(true);
                  }}
                  className="h-11 w-11 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer border border-red-500/10 shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => handleUpdateStatus(area.id, true)}
                  className="h-11 w-11 rounded-xl bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer border border-emerald-500/10 shrink-0"
                >
                  <UserCheck className="h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => areaToDeactivate && handleUpdateStatus(areaToDeactivate, false)}
        title="تعطيل الحي"
        description="هل أنت متأكد من رغبتك في تعطيل هذا الحي؟ لن يظهر في خيارات التوصيل للعملاء بعد التعطيل."
        confirmText="تعطيل الحي"
        cancelText="تراجع"
        variant="danger"
        isLoading={isUpdating}
      />
    </div>
  );
}
