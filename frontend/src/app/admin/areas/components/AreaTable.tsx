'use client';

import { useState, memo } from 'react';
import { Area } from '@/dto/area.dto';
import { Button } from '@/components/ui/button';
import { 
  Edit2, 
  Trash2, 
  MapPin, 
  ArrowUpDown, 
  Coins, 
  ListOrdered,
  CheckCircle2,
  XCircle,
  MoreVertical,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAreaStore } from '@/store/use-area-store';
import { ConfirmModal } from '@/components/common/confirm-modal';

interface AreaTableProps {
  areas: Area[];
  onEdit: (area: Area) => void;
}

export function AreaTable({ areas, onEdit }: AreaTableProps) {
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
    <div className="h-full flex flex-col bg-[var(--secondary)] border border-[var(--border)] rounded-2xl lg:rounded-3xl shadow-sm overflow-hidden">
      <div className="flex-1 overflow-auto blue-scrollbar">
        <table className="w-full border-separate border-spacing-0 text-right" dir="rtl">
          <thead className="sticky top-0 z-30 bg-[var(--secondary)] shadow-sm">
            <tr className="bg-[var(--muted)]/50">
              <th className="sticky top-0 z-30 px-6 py-4 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider border-b border-[var(--border)] bg-[var(--muted)]">
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  الحي
                </div>
              </th>
              <th className="sticky top-0 z-30 px-6 py-4 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider border-b border-[var(--border)] bg-[var(--muted)]">
                <div className="flex items-center gap-2">
                  <Coins size={14} />
                  تكلفة التوصيل
                </div>
              </th>
              <th className="sticky top-0 z-30 px-6 py-4 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider border-b border-[var(--border)] bg-[var(--muted)]">
                <div className="flex items-center gap-2">
                  <ListOrdered size={14} />
                  الترتيب
                </div>
              </th>
              <th className="sticky top-0 z-10 px-6 py-4 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider text-center border-b border-[var(--border)] bg-[var(--muted)]">
                الحالة
              </th>
              <th className="sticky top-0 z-10 px-6 py-4 text-xs font-black text-[var(--muted-foreground)] uppercase tracking-wider text-left border-b border-[var(--border)] bg-[var(--muted)]">
                العمليات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] bg-[var(--secondary)]">
              {areas.map((area, index) => (
                <motion.tr
                  key={area.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group hover:bg-[var(--muted)]/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap border-b border-[var(--border)]">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-[var(--foreground)]">{area.nameAr}</span>
                      {area.nameEn && (
                        <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                          {area.nameEn}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-[var(--border)]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-[var(--foreground)]">{area.deliveryCost}</span>
                      <span className="text-[10px] font-bold text-[var(--muted-foreground)]">ر.س</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-[var(--border)]">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-xs font-black text-[var(--foreground)]">
                      {area.sortOrder}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center border-b border-[var(--border)]">
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left border-b border-[var(--border)]">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(area)}
                        className="h-8 w-8 rounded-lg transition-colors hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 cursor-pointer"
                        title="تعديل"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>

                      {area.isActive ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setAreaToDeactivate(area.id);
                            setIsConfirmOpen(true);
                          }}
                          className="h-8 w-8 rounded-lg transition-colors hover:text-red-500 hover:bg-red-50 cursor-pointer"
                          title="تعطيل"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUpdateStatus(area.id, true)}
                          className="h-8 w-8 rounded-lg transition-colors hover:text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                          title="تنشيط"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </table>
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
