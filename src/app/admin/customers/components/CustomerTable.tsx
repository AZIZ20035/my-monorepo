'use client';

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../../../components/ui/table';
import { Button } from '../../../../components/ui/button';
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
  ChevronLeft
} from 'lucide-react';
import { Customer } from '@/dto/customer.dto';
import { formatDate } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../../../components/ui/dropdown-menu';
import { Badge } from '../../../../components/ui/badge';
import { motion } from 'framer-motion';

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onView: (customer: Customer) => void;
  onAddAddress: (customer: Customer) => void;
}

export function CustomerTable({ customers, onEdit, onView, onAddAddress }: CustomerTableProps) {
  return (
    <div className="bg-[var(--secondary)] border border-[var(--border)] rounded-2xl lg:rounded-[2rem] overflow-hidden shadow-sm flex flex-col h-full">
      <div className="overflow-x-auto flex-1 custom-scrollbar">
        <Table>
          <TableHeader className="bg-[var(--muted)]/30 sticky top-0 z-10 backdrop-blur-md">
            <TableRow className="hover:bg-transparent border-[var(--border)]">
              <TableHead className="text-right font-black text-[var(--foreground)] w-[250px] h-14">العميل</TableHead>
              <TableHead className="text-right font-black text-[var(--foreground)]">التواصل</TableHead>
              <TableHead className="text-right font-black text-[var(--foreground)]">الحالة</TableHead>
              <TableHead className="text-right font-black text-[var(--foreground)]">العناوين</TableHead>
              <TableHead className="text-center font-black text-[var(--foreground)]">الطلبات</TableHead>
              <TableHead className="text-right font-black text-[var(--foreground)]">تاريخ الانضمام</TableHead>
              <TableHead className="text-left font-black text-[var(--foreground)] p-4">العمليات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer, index) => (
              <motion.tr
                key={customer.customerId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="group hover:bg-[var(--primary)]/5 border-[var(--border)] transition-colors"
              >
                {/* Customer Info */}
                <TableCell className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-black text-sm shrink-0 border border-[var(--primary)]/20">
                      {customer.name.charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-black text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">
                        {customer.name}
                      </span>
                      {customer.isNewCustomer && (
                        <div className="flex mt-0.5">
                           <Badge className="bg-emerald-500/10 text-emerald-600 text-[9px] font-black border-none h-4 px-1.5">
                             عميل جديد
                           </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Contact */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--foreground)]">
                      <Phone className="h-3 w-3 text-[var(--primary)]" />
                      <span dir="ltr">{customer.phone}</span>
                    </div>
                    {customer.whatsappNumber && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                        <MessageCircle className="h-3 w-3" />
                        <span dir="ltr">{customer.whatsappNumber}</span>
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  {customer.isActive ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] font-black">
                      <CheckCircle2 className="h-3 w-3" />
                      نشط
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-[11px] font-black">
                      <XCircle className="h-3 w-3" />
                      معطل
                    </div>
                  )}
                </TableCell>

                {/* Addresses */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[var(--foreground)]">
                        {customer.addresses.length} عنوان
                      </span>
                      {customer.addresses.find(a => a.isDefault) && (
                        <span className="text-[10px] text-[var(--muted-foreground)] font-bold truncate max-w-[120px]">
                          {customer.addresses.find(a => a.isDefault)?.areaName}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Orders */}
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <div className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl bg-[var(--muted)] text-[var(--foreground)] text-xs font-black">
                      <Package className="h-3.5 w-3.5 text-[var(--primary)]" />
                      {customer.orderCount}
                    </div>
                  </div>
                </TableCell>

                {/* Joined At */}
                <TableCell>
                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--muted-foreground)]">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(customer.createdAt)}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(customer)}
                      className="h-9 w-9 rounded-xl hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-all cursor-pointer"
                      title="عرض التفاصيل"
                    >
                      <Eye className="h-4.5 w-4.5" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-all cursor-pointer"
                        >
                          <MoreVertical className="h-4.5 w-4.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl border-[var(--border)] shadow-xl p-1.5">
                        <DropdownMenuItem 
                          onClick={() => onEdit(customer)}
                          className="rounded-lg h-10 px-3 font-bold text-sm flex items-center gap-2 cursor-pointer hover:bg-[var(--primary)]/5 text-[var(--foreground)]"
                        >
                          <Edit2 className="h-4 w-4 text-blue-500" />
                          تعديل البيانات
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onAddAddress(customer)}
                          className="rounded-lg h-10 px-3 font-bold text-sm flex items-center gap-2 cursor-pointer hover:bg-[var(--primary)]/5 text-[var(--foreground)]"
                        >
                          <MapPinPlus className="h-4 w-4 text-emerald-500" />
                          إضافة عنوان جديد
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </motion.tr>
            ))}

            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="h-16 w-16 rounded-full bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)]">
                      <Eye className="h-8 w-8 opacity-20" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[var(--foreground)]">لا يوجد عملاء</h3>
                      <p className="text-sm font-bold text-[var(--muted-foreground)]">جرب تغيير معايير البحث أو إضافة عميل جديد</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Footer / Pagination Placeholder */}
      <div className="p-4 border-t border-[var(--border)] bg-[var(--muted)]/20 flex items-center justify-between">
        <p className="text-xs font-bold text-[var(--muted-foreground)]">
          عرض {customers.length} من إجمالي {customers.length} عميل
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="h-8 px-3 rounded-lg font-bold text-xs">السابق</Button>
          <Button variant="outline" size="sm" disabled className="h-8 px-3 rounded-lg font-bold text-xs flex items-center gap-1">
            التالي
            <ChevronLeft className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
