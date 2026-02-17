'use client';

import { useState, useEffect } from 'react';
import { usePeriodStore } from '@/store/use-period-store';
import { EidDayPeriodResponse } from '@/dto/period.dto';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Save, Power } from 'lucide-react';

interface EditAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: EidDayPeriodResponse | null;
}

export function EditAssignmentModal({ isOpen, onClose, assignment }: EditAssignmentModalProps) {
  const { updateAssignment, isLoading } = usePeriodStore();

  const [formData, setFormData] = useState({
    maxCapacity: '',
    isActive: true,
  });

  useEffect(() => {
    if (isOpen && assignment) {
      setFormData({
        maxCapacity: assignment.maxCapacity.toString(),
        isActive: assignment.isActive,
      });
    }
  }, [isOpen, assignment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assignment) return;

    try {
      await updateAssignment(assignment.eidDayPeriodId, {
        maxCapacity: parseInt(formData.maxCapacity),
        isActive: formData.isActive,
      });
      onClose();
    } catch (error) {
      // Error handled in store
    }
  };

  if (!assignment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تعديل تعيين الفترة"
      description={`${assignment.periodName} - ${assignment.eidDayName}`}
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Assignment Info */}
        <div className="p-4 bg-[var(--secondary)]/50 rounded-xl border border-[var(--border)] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[var(--muted-foreground)]">الفترة:</span>
            <span className="font-black text-[var(--foreground)]">{assignment.periodName}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[var(--muted-foreground)]">القسم:</span>
            <span className="font-black text-[var(--foreground)]">{assignment.categoryName || 'غير محدد'}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[var(--muted-foreground)]">التوقيت:</span>
            <span className="font-black text-[var(--foreground)]">
              {assignment.startTime.substring(0, 5)} - {assignment.endTime.substring(0, 5)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[var(--muted-foreground)]">الطلبات الحالية:</span>
            <span className="font-black text-sky-600">{assignment.currentOrders} طلب</span>
          </div>
        </div>

        {/* Max Capacity */}
        <div className="space-y-2">
          <Label className="text-xs font-black text-[var(--muted-foreground)] uppercase flex items-center gap-2">
            <Users size={12} className="text-sky-500" />
            السعة القصوى *
          </Label>
          <Input
            required
            type="number"
            min={assignment.currentOrders}
            value={formData.maxCapacity}
            onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
            className="h-12 rounded-xl"
          />
          <p className="text-[10px] font-bold text-[var(--muted-foreground)]">
            يجب أن تكون السعة أكبر من أو تساوي عدد الطلبات الحالية ({assignment.currentOrders})
          </p>
        </div>

        {/* Active Status */}
        <div className="flex items-center justify-between p-4 bg-[var(--secondary)]/50 rounded-xl border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <Power size={16} className={formData.isActive ? 'text-emerald-500' : 'text-red-500'} />
            <div>
              <p className="text-sm font-black text-[var(--foreground)]">حالة التفعيل</p>
              <p className="text-[10px] font-bold text-[var(--muted-foreground)]">
                {formData.isActive ? 'الفترة نشطة ومتاحة للحجز' : 'الفترة معطلة'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              formData.isActive ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                formData.isActive ? 'translate-x-1' : 'translate-x-7'
              }`}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="h-12 w-full sm:flex-1 rounded-xl font-black border-2"
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full sm:flex-[2] rounded-xl bg-gradient-to-l from-[#0784b5] to-[#39ace7] text-white font-black shadow-lg shadow-[#39ace7]/20"
          >
            <Save className="h-5 w-5 ml-2" />
            حفظ التعديلات
          </Button>
        </div>
      </form>
    </Modal>
  );
}
