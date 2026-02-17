'use client';

import { useState } from 'react';
import { Search, Printer, FileText, Receipt, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { reportService } from '@/services/report-service';
import { toast } from 'sonner';
import { 
  InvoiceResponse, 
  DeliveryInvoiceResponse 
} from '@/dto/report.dto';

interface OrderPrintSectionProps {
  onPrintInvoice: (data: InvoiceResponse | null) => void;
  onPrintReceipt: (data: DeliveryInvoiceResponse | null) => void;
}

export function OrderPrintSection({ onPrintInvoice, onPrintReceipt }: OrderPrintSectionProps) {
  const [orderId, setOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFetch = async (type: 'invoice' | 'receipt') => {
    if (!orderId) {
      toast.error('يرجى إدخال رقم الطلب');
      return;
    }

    const fetchId = parseInt(orderId);
    if (fetchId < 100) {
      toast.error('يرجى إدخال رقم طلب صحيح (يبدأ من 100)');
      return;
    }

    const systemId = fetchId - 100;
    setIsLoading(true);
    try {
      if (type === 'invoice') {
        const response = await reportService.getInvoice(systemId);
        onPrintInvoice(response.data);
      } else {
        const response = await reportService.getDeliveryInvoice(systemId);
        onPrintReceipt(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'تعذر العثور على الطلب');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 bg-[var(--secondary)] p-2 rounded-2xl border border-[var(--border)] shadow-sm">
      <div className="relative w-full md:w-48">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
        <Input 
          placeholder="رقم الطلب..." 
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="pr-9 pl-9 h-10 bg-[var(--background)] border-[var(--border)] rounded-xl focus:ring-[var(--primary)] font-bold text-[var(--foreground)]"
          type="number"
        />
        {orderId && (
          <button 
            onClick={() => setOrderId('')}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Button 
          variant="secondary" 
          className="flex-1 md:flex-none h-10 px-4 rounded-xl gap-2 font-black text-xs bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20"
          onClick={() => handleFetch('invoice')}
          disabled={isLoading}
        >
          <FileText className="h-4 w-4" />
          فاتورة العميل
        </Button>
        <Button 
          variant="secondary" 
          className="flex-1 md:flex-none h-10 px-4 rounded-xl gap-2 font-black text-xs bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20"
          onClick={() => handleFetch('receipt')}
          disabled={isLoading}
        >
          <Receipt className="h-4 w-4" />
          كشف التسليم
        </Button>
      </div>
    </div>
  );
}
