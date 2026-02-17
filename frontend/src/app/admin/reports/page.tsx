'use client';

import { useState, useEffect } from 'react';
import { useReportStore } from '@/store/use-report-store';
import { useAuthStore } from '@/store/use-auth-store';
import { useEidDayStore } from '@/store/use-eid-day-store';
import { ReportTabs } from './components/report-tabs';
import { ManagementReport } from './components/management-report';
import { FinancialReport } from './components/financial-report';
import { KitchenReport } from './components/kitchen-report';
import { DeliveryReport } from './components/delivery-report';
import { CustomerReport } from './components/customer-report';
import { OrderPrintSection } from './components/order-print-section';
import { CustomerInvoicePrint } from './components/customer-invoice-print';
import { DeliveryReceiptPrint } from './components/delivery-receipt-print';
import { Modal } from '@/components/ui/modal';
import { 
  BarChart, 
  Calendar as CalendarIcon, 
  Filter,
  Download,
  RotateCcw,
  Printer,
  FileDown
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoicePDF } from './components/pdf/InvoicePDF';
import { DeliveryReceiptPDF } from './components/pdf/DeliveryReceiptPDF';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { InvoiceResponse, DeliveryInvoiceResponse } from '@/dto/report.dto';

export default function ReportsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState(isAdmin ? 'management' : 'kitchen');
  
  // Printing State
  const [invoiceData, setInvoiceData] = useState<InvoiceResponse | null>(null);
  const [receiptData, setReceiptData] = useState<DeliveryInvoiceResponse | null>(null);

  const { 
    setEidRange,
    fromEidDayId,
    toEidDayId,
    eidDayId, 
    periodId, 
    setEidFilters 
  } = useReportStore();

  const reportRef = useRef<HTMLDivElement>(null);
  
  const handlePrintReport = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Report-${activeTab}-${new Date().toLocaleDateString()}`,
  });

  const { eidDays, fetchEidDays } = useEidDayStore();

  useEffect(() => {
    fetchEidDays();
  }, [fetchEidDays]);

  // Set default filters once eidDays are loaded
  useEffect(() => {
    if (eidDays.length > 0) {
      if (!fromEidDayId || !toEidDayId) {
        setEidRange(eidDays[0].eidDayId, eidDays[eidDays.length - 1].eidDayId);
      }
      if (!eidDayId) {
        setEidFilters(eidDays[0].eidDayId, periodId);
      }
    }
  }, [eidDays, fromEidDayId, toEidDayId, eidDayId, periodId, setEidRange, setEidFilters]);

  const selectedEidDay = eidDays.find((d: any) => d.eidDayId === eidDayId);

  return (
    <div className="h-full flex flex-col gap-6 lg:gap-8 overflow-hidden print:hidden">
      {/* Header & Main Filters */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 shrink-0">
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-sky-600 flex items-center justify-center text-white shadow-lg shadow-[var(--primary)]/20">
            <BarChart className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-[var(--foreground)] tracking-tight font-outfit">التقارير والإحصائيات</h1>
            <p className="text-sm lg:text-base text-[var(--muted-foreground)] font-bold">تحليل أداء النظام وتتبع العمليات</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           {/* New Order Search & Print Section */}
           <OrderPrintSection 
              onPrintInvoice={setInvoiceData} 
              onPrintReceipt={setReceiptData} 
           />

           <Button variant="outline" className="rounded-xl border-[var(--border)] h-11 px-6 font-bold hover:bg-[var(--secondary)]">
              <Download className="h-4 w-4 ml-2" />
              تصدير البيانات
           </Button>
        </div>
      </div>

      {/* Global Filters Bar */}
      <div className="bg-[var(--secondary)] border border-[var(--border)] rounded-[2rem] shadow-sm overflow-visible shrink-0 text-right">
        <div className="p-6 flex flex-col md:flex-row items-end gap-6">
          {/* Eid Day Range - Relevant for Management, Financial, Customer */}
          {(activeTab === 'management' || activeTab === 'financial' || activeTab === 'customers') ? (
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="space-y-1.5 text-right">
                <label className="text-[10px] font-black text-[var(--muted-foreground)] flex items-center gap-1 justify-end">
                  من يوم <CalendarIcon className="h-3 w-3" />
                </label>
                <Select 
                  value={fromEidDayId?.toString()} 
                  onValueChange={(v: string) => setEidRange(parseInt(v), toEidDayId)}
                  placeholder="اختر بداية الفترة"
                >
                  {eidDays.map(day => (
                    <SelectItem key={day.eidDayId} value={day.eidDayId.toString()} className="font-bold">
                      {day.nameAr}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5 text-right">
                <label className="text-[10px] font-black text-[var(--muted-foreground)] flex items-center gap-1 justify-end">
                  إلى يوم <CalendarIcon className="h-3 w-3" />
                </label>
                <Select 
                  value={toEidDayId?.toString()} 
                  onValueChange={(v: string) => setEidRange(fromEidDayId, parseInt(v))}
                  placeholder="اختر نهاية الفترة"
                >
                  {eidDays.map(day => (
                    <SelectItem key={day.eidDayId} value={day.eidDayId.toString()} className="font-bold">
                      {day.nameAr}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          ) : (
            /* Singular Eid Day Filter - Relevant for Kitchen, Delivery */
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="space-y-1.5 text-right">
                <label className="text-[10px] font-black text-[var(--muted-foreground)] flex items-center gap-1 justify-end">
                  يوم العيد <Filter className="h-3 w-3" />
                </label>
                <Select 
                  value={eidDayId?.toString()} 
                  onValueChange={(v: string) => setEidFilters(parseInt(v), periodId)}
                  placeholder="اختر يوم العيد"
                >
                  {eidDays.map(day => (
                    <SelectItem key={day.eidDayId} value={day.eidDayId.toString()} className="font-bold">
                      {day.nameAr}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5 text-right">
                <label className="text-[10px] font-black text-[var(--muted-foreground)] flex items-center gap-1 justify-end">
                  الفترة <Filter className="h-3 w-3" />
                </label>
                <Select 
                  value={periodId?.toString() || "0"} 
                  onValueChange={(v: string) => setEidFilters(eidDayId, parseInt(v))}
                  placeholder="كافة الفترات"
                >
                  <SelectItem value="0" className="font-bold">كافة الفترات</SelectItem>
                  {selectedEidDay?.periods.map((period: any) => (
                    <SelectItem key={period.eidDayPeriodId} value={period.eidDayPeriodId.toString()} className="font-bold">
                      {period.periodName}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          )}

          <Button 
            variant="ghost" 
            className="h-11 rounded-xl text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 gap-2 border border-dashed border-[var(--border)] px-4"
            onClick={() => {
                setEidRange(undefined, undefined);
                setEidFilters(undefined, undefined);
            }}
          >
            <RotateCcw className="h-4 w-4" />
            إعادة تعيين
          </Button>
        </div>
      </div>

      {/* Report Tabs Navigation */}
      <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} isAdmin={isAdmin} />

      {/* Print Controls for Reports */}
      <div className="flex justify-end gap-3 px-1 -mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-xl gap-2 font-black border-dashed"
          onClick={() => handlePrintReport()}
        >
          <Printer className="h-4 w-4" />
          طباعة التقرير الحالي (A4)
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-10 px-1" ref={reportRef}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'management' && <ManagementReport />}
            {activeTab === 'financial' && <FinancialReport />}
            {activeTab === 'kitchen' && <KitchenReport />}
            {activeTab === 'delivery' && <DeliveryReport onPrintInvoice={setInvoiceData} onPrintReceipt={setReceiptData} />}
            {activeTab === 'customers' && <CustomerReport />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Printing Modals */}
      <Modal 
        isOpen={!!invoiceData} 
        onClose={() => setInvoiceData(null)}
        title="معاينة الفاتورة"
        className="max-w-4xl"
      >
        <div className="flex flex-col h-full max-h-[80vh]">
          <div className="flex justify-end p-4 border-b gap-3">
            {invoiceData && (
              <PDFDownloadLink
                document={<InvoicePDF data={invoiceData} />}
                fileName={`invoice-${invoiceData.invoiceNumber}.pdf`}
              >
                {({ loading }) => (
                  <Button variant="outline" className="gap-2 rounded-xl border-blue-500 text-blue-600" disabled={loading}>
                    <FileDown className="h-4 w-4" />
                    {loading ? 'جاري التجهيز...' : 'تحميل PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
            <Button className="gap-2 rounded-xl" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              تأكيد الطباعة
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto min-h-[500px]">
             {invoiceData && <CustomerInvoicePrint data={invoiceData} />}
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={!!receiptData} 
        onClose={() => setReceiptData(null)}
        title="معاينة كشف التسليم"
        className="max-w-4xl"
      >
        <div className="flex flex-col h-full max-h-[80vh]">
          <div className="flex justify-end p-4 border-b gap-3">
            {receiptData && (
              <PDFDownloadLink
                document={<DeliveryReceiptPDF data={receiptData} />}
                fileName={`delivery-receipt-${receiptData.invoiceNumber}.pdf`}
              >
                {({ loading }) => (
                  <Button variant="outline" className="gap-2 rounded-xl border-emerald-500 text-emerald-600" disabled={loading}>
                    <FileDown className="h-4 w-4" />
                    {loading ? 'جاري التجهيز...' : 'تحميل PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
            <Button className="gap-2 rounded-xl" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              تأكيد الطباعة
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto min-h-[500px]">
             {receiptData && <DeliveryReceiptPrint data={receiptData} />}
          </div>
        </div>
      </Modal>
    </div>
  );
}

