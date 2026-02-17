'use client';

import { useState } from 'react';
import { Search, UserPlus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Customer } from '@/dto/customer.dto';
import { customerService } from '@/services/customer-service';
import { toast } from 'sonner';

interface CustomerSelectorProps {
  onSelect: (customer: Customer) => void;
  selectedCustomer: Customer | null;
}

export function CustomerSelector({ onSelect, selectedCustomer }: CustomerSelectorProps) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!phone) return;
    setLoading(true);
    setError('');

    try {
      const customer = await customerService.searchByPhone(phone);
      if (customer) {
        onSelect(customer);
        toast.success('تم العثور على العميل');
      } else {
        setError('لم يتم العثور على عميل بهذا الرقم');
        // Optional: Trigger "Create New Customer" flow here
      }
    } catch (err) {
      setError('حدث خطأ أثناء البحث');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-xl bg-white shadow-sm">
      <h3 className="font-bold text-lg border-b pb-2">1. بيانات العميل</h3>
      
      {selectedCustomer ? (
        <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
          <div>
            <p className="font-bold text-green-800">{selectedCustomer.name}</p>
            <p className="text-sm text-green-600">{selectedCustomer.phone}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onSelect(null as any)}>
            تغيير
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder="رقم الجوال (05xxxxxxxx)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? 'جاري البحث...' : <Search className="w-4 h-4" />}
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
      
      {!selectedCustomer && (
        <div className="text-center pt-2">
          <Button variant="link" className="text-primary">
            <UserPlus className="w-4 h-4 ml-1" />
            تسجيل عميل جديد
          </Button>
        </div>
      )}
    </div>
  );
}
