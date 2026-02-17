'use client';

import { useEffect } from 'react';
import { useAreaStore } from '@/store/use-area-store';
import { CreateAddressDto } from '@/dto/customer.dto';
import { Select, SelectItem } from '../../../../components/ui/select';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Checkbox } from '../../../../components/ui/checkbox';
import { MapPin, Info, Tag } from 'lucide-react';

interface AddressFormProps {
  formData: CreateAddressDto;
  onChange: (data: Partial<CreateAddressDto>) => void;
  errors?: Record<string, string>;
}

export function AddressForm({ formData, onChange, errors }: AddressFormProps) {
  const { areas, fetchAreas, isLoading } = useAreaStore();

  useEffect(() => {
    if (areas.length === 0) {
      fetchAreas();
    }
  }, [areas.length, fetchAreas]);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid grid-cols-1 gap-6">
        {/* Area Selection - Full Width */}
        <div className="space-y-2 text-right">
          <Label className="text-sm font-black flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[var(--primary)]" />
            الحي / المنطقة <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.areaId?.toString()}
            onValueChange={(val: string) => onChange({ areaId: parseInt(val) })}
            placeholder={isLoading ? 'جاري التحميل...' : 'اختر الحي'}
            className={errors?.areaId ? 'border-red-500' : ''}
            searchable
            searchPlaceholder="ابحث عن الحي..."
          >
            {areas.filter(a => a.isActive).map((area) => (
              <SelectItem 
                key={area.id} 
                value={area.id.toString()}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{area.nameAr}</span>
                  <span className="text-[10px] bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-0.5 rounded-full mr-2">
                     {area.deliveryCost} ر.س توصيل
                  </span>
                </div>
              </SelectItem>
            ))}
          </Select>
          {errors?.areaId && <p className="text-[11px] font-bold text-red-500">{errors.areaId}</p>}
        </div>

        {/* Address Details - Full Width */}
        <div className="space-y-2 text-right">
          <Label className="text-sm font-black flex items-center gap-2">
            <Info className="h-4 w-4 text-[var(--primary)]" />
            تفاصيل العنوان <span className="text-red-500">*</span>
          </Label>
          <textarea
            value={formData.addressDetails || ''}
            onChange={(e) => onChange({ addressDetails: e.target.value })}
            placeholder="رقم الشارع، رقم المبنى، علامة مميزة..."
            className={`w-full min-h-[120px] p-4 rounded-xl border-2 font-bold resize-none ${errors?.addressDetails ? 'border-red-500 bg-red-50/50' : 'border-[var(--border)] bg-[var(--background)]'} focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all placeholder:text-[var(--muted-foreground)] text-right text-lg`}
          />
          {errors?.addressDetails && <p className="text-[11px] font-bold text-red-500">{errors.addressDetails}</p>}
        </div>

        {/* Label (Home, Work, etc) - Full Width */}
        <div className="space-y-2 text-right">
          <Label className="text-sm font-black flex items-center gap-2">
            <Tag className="h-4 w-4 text-[var(--primary)]" />
            تسمية العنوان (اختياري)
          </Label>
          <Input
            value={formData.label || ''}
            onChange={(e) => onChange({ label: e.target.value })}
            placeholder="مثال: المنزل، العمل، استراحة..."
            className="h-12 rounded-xl border-2 font-bold border-[var(--border)] bg-[var(--background)] focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all text-right"
          />
        </div>

        {/* Default Checkbox - Full Width Styled */}
        <div 
          className="flex items-center gap-3 p-4 bg-[var(--secondary)] rounded-xl border border-[var(--border)] group cursor-pointer h-12" 
          onClick={() => onChange({ isDefault: !formData.isDefault })}
        >
          <Checkbox
            checked={formData.isDefault}
            onCheckedChange={(checked: boolean) => onChange({ isDefault: checked })}
            className="h-5 w-5"
          />
          <Label 
            className="text-sm font-black cursor-pointer select-none flex-1"
          >
            تعيين كعنوان افتراضي
          </Label>
        </div>
      </div>
    </div>
  );
}
