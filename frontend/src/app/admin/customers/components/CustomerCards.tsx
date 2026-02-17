'use client';

import { 
  Edit2, 
  Eye, 
  MapPinPlus, 
  Phone, 
  MessageCircle,
  Calendar,
  Package,
  CheckCircle2,
  XCircle,
  MoreVertical,
  MapPin,
  StickyNote
} from 'lucide-react';
import { Customer } from '@/dto/customer.dto';
import { formatDate } from '@/lib/utils';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../../../components/ui/dropdown-menu';
import { motion } from 'framer-motion';

interface CustomerCardsProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onView: (customer: Customer) => void;
  onAddAddress: (customer: Customer) => void;
}

export function CustomerCards({ customers, onEdit, onView, onAddAddress }: CustomerCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 overflow-y-auto custom-scrollbar p-1 pb-10">
      {customers.map((customer, index) => (
        <motion.div
          key={customer.customerId}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="bg-[var(--secondary)] border border-[var(--border)] rounded-2xl lg:rounded-[2rem] p-5 lg:p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
        >
          {/* Status Badge */}
          <div className="absolute left-6 top-6">
             {customer.isActive ? (
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
             ) : (
                <div className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
             )}
          </div>

          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/5 border border-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] font-black text-xl shrink-0">
              {customer.name.charAt(0)}
            </div>
            
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">
                  {customer.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-1">
                 <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px] font-black border-none h-5">
                    ID: #{customer.customerId}
                 </Badge>
                 {customer.isNewCustomer && (
                   <Badge className="bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-black border-none h-5">
                      عميل جديد
                   </Badge>
                 )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg hover:bg-[var(--muted)] transition-all cursor-pointer -mt-1 -mr-1"
                >
                  <MoreVertical className="h-4 w-4 text-[var(--muted-foreground)]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl border-[var(--border)] shadow-xl p-1.5">
                <DropdownMenuItem 
                  onClick={() => onView(customer)}
                  className="rounded-lg h-10 px-3 font-bold text-sm flex items-center gap-2 cursor-pointer hover:bg-[var(--primary)]/5"
                >
                  <Eye className="h-4 w-4 text-[var(--primary)]" />
                  عرض التفاصيل
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onEdit(customer)}
                  className="rounded-lg h-10 px-3 font-bold text-sm flex items-center gap-2 cursor-pointer hover:bg-[var(--primary)]/5"
                >
                  <Edit2 className="h-4 w-4 text-blue-500" />
                  تعديل البيانات
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onAddAddress(customer)}
                  className="rounded-lg h-10 px-3 font-bold text-sm flex items-center gap-2 cursor-pointer hover:bg-[var(--primary)]/5"
                >
                  <MapPinPlus className="h-4 w-4 text-emerald-500" />
                  إضافة عنوان
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
             <div className="bg-[var(--background)] p-3 rounded-xl border border-[var(--border)]">
                <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase mb-1 flex items-center gap-1.5">
                   <Package className="h-3 w-3" />
                   الطلبات
                </p>
                <p className="text-xl font-black text-[var(--foreground)]">{customer.orderCount}</p>
             </div>
             <div className="bg-[var(--background)] p-3 rounded-xl border border-[var(--border)]">
                <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase mb-1 flex items-center gap-1.5">
                   <MapPin className="h-3 w-3" />
                   العناوين
                </p>
                <p className="text-xl font-black text-[var(--foreground)]">{customer.addresses.length}</p>
             </div>
          </div>

          <div className="mt-5 space-y-2.5">
             <div className="flex items-center gap-3 h-10 px-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                <Phone className="h-4 w-4 text-[var(--primary)] shrink-0" />
                <span className="text-sm font-black text-[var(--foreground)] tracking-tight" dir="ltr">{customer.phone}</span>
             </div>
             
             {customer.addresses.length > 0 && (
               <div className="flex items-center gap-3 h-10 px-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                  <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                  <span className="text-xs font-bold text-[var(--foreground)] truncate">
                    {customer.addresses.find(a => a.isDefault)?.areaName || customer.addresses[0].areaName}: {customer.addresses.find(a => a.isDefault)?.addressDetails || customer.addresses[0].addressDetails}
                  </span>
               </div>
             )}
          </div>

          <div className="mt-5 pt-5 border-t border-[var(--border)] flex items-center justify-between">
             <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--muted-foreground)]">
                <Calendar className="h-3.5 w-3.5" />
                انضم {formatDate(customer.createdAt)}
             </div>
             
             <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(customer)}
                className="h-8 px-3 rounded-lg text-[var(--primary)] font-black text-[11px] hover:bg-[var(--primary)]/10 cursor-pointer"
             >
                التفاصيل
             </Button>
          </div>

          {/* Decorative background element */}
          <div className="absolute -right-6 -bottom-6 h-24 w-24 bg-[var(--primary)]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        </motion.div>
      ))}

      {customers.length === 0 && (
        <div className="col-span-full h-64 flex flex-col items-center justify-center gap-4 bg-[var(--secondary)] rounded-[2rem] border-2 border-dashed border-[var(--border)]">
          <div className="h-16 w-16 rounded-full bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)]">
            <Eye className="h-8 w-8 opacity-20" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-black text-[var(--foreground)]">لا توجد نتائج</h3>
            <p className="text-sm font-bold text-[var(--muted-foreground)]">جرب تغيير معايير البحث أو إضافة عميل جديد</p>
          </div>
        </div>
      )}
    </div>
  );
}
