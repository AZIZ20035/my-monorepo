import { create } from 'zustand';
import { 
  ManagementReportResponse, 
  FinancialReportResponse, 
  KitchenReportResponse, 
  DeliveryReportResponse, 
  CustomerInfoReportResponse 
} from '@/dto/report.dto';
import { reportService } from '@/services/report-service';
import { toast } from 'sonner';
import { useEidDayStore } from './use-eid-day-store';

interface ReportState {
  // Data
  managementData: ManagementReportResponse | null;
  financialData: FinancialReportResponse | null;
  kitchenData: KitchenReportResponse | null;
  deliveryData: DeliveryReportResponse | null;
  customerData: CustomerInfoReportResponse | null;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Filters
  fromEidDayId?: number;
  toEidDayId?: number;
  eidDayId?: number; // For singular reports like Kitchen/Delivery
  periodId?: number;

  // Handlers
  setEidRange: (fromId?: number, toId?: number) => void;
  setEidFilters: (dayId?: number, pId?: number) => void;
  
  fetchManagement: () => Promise<void>;
  fetchFinancial: () => Promise<void>;
  fetchKitchen: () => Promise<void>;
  fetchDelivery: () => Promise<void>;
  fetchCustomer: () => Promise<void>;
  
  getDatesFromIds: () => { startDate?: string; endDate?: string };
}

export const useReportStore = create<ReportState>((set, get) => ({
  managementData: null,
  financialData: null,
  kitchenData: null,
  deliveryData: null,
  customerData: null,
  isLoading: false,
  error: null,
  fromEidDayId: undefined,
  toEidDayId: undefined,
  eidDayId: undefined,
  periodId: undefined,

  setEidRange: (fromId, toId) => {
    set({ fromEidDayId: fromId, toEidDayId: toId });
  },

  setEidFilters: (dayId, pId) => {
      // If pId is 0 (All Periods), set to undefined
      set({ eidDayId: dayId, periodId: pId === 0 ? undefined : pId });
  },

  // Helper to get dates from EidDay IDs (if the API still requires dates)
  getDatesFromIds: () => {
      const { eidDays } = useEidDayStore.getState();
      const fromDay = eidDays.find(d => d.eidDayId === get().fromEidDayId);
      const toDay = eidDays.find(d => d.eidDayId === get().toEidDayId);
      return {
          startDate: fromDay?.date,
          endDate: toDay?.date
      };
  },

  fetchManagement: async () => {
    set({ isLoading: true, error: null });
    try {
      const { startDate, endDate } = get().getDatesFromIds();
      const response = await reportService.getManagementReport(startDate, endDate);
      set({ managementData: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل تحميل تقرير الإدارة');
    }
  },

  fetchFinancial: async () => {
    set({ isLoading: true, error: null });
    try {
      const { startDate, endDate } = get().getDatesFromIds();
      const response = await reportService.getFinancialReport(startDate, endDate);
      set({ financialData: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل تحميل التقرير المالي');
    }
  },

  fetchKitchen: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await reportService.getKitchenReport(get().eidDayId, get().periodId);
      set({ kitchenData: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل تحميل تقرير المطبخ');
    }
  },

  fetchDelivery: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await reportService.getDeliveryReport(get().eidDayId, get().periodId);
      set({ deliveryData: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل تحميل تقرير التوصيل');
    }
  },

  fetchCustomer: async () => {
    set({ isLoading: true, error: null });
    try {
      const { startDate, endDate } = get().getDatesFromIds();
      const response = await reportService.getCustomersInfoReport(startDate, endDate);
      set({ customerData: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل تحميل تقرير العملاء');
    }
  },
}));
