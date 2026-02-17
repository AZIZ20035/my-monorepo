'use client';

import { create } from 'zustand';
import { 
  Customer, 
  CreateCustomerDto, 
  UpdateCustomerDto, 
  CreateAddressDto,
  Address 
} from '@/dto/customer.dto';
import { Order } from '@/dto/order.dto';
import { customerService } from '@/services/customer-service';
import { toast } from 'sonner';

interface CustomerState {
  customers: Customer[];
  isLoading: boolean;
  error: string | null;
  
  fetchCustomers: () => Promise<void>;
  searchCustomerByPhone: (phone: string) => Promise<Customer | null>;
  getCustomerById: (id: number) => Promise<Customer | null>;
  createCustomer: (customerData: CreateCustomerDto) => Promise<Customer>;
  updateCustomer: (id: number, updates: UpdateCustomerDto) => Promise<Customer>;
  addAddress: (id: number, addressData: CreateAddressDto) => Promise<Address | null>;
  getCustomerOrders: (id: number) => Promise<Order[]>;
  customerOrders: Order[];
  fetchCustomerOrders: (id: number) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  customerOrders: [],
  isLoading: false,
  error: null,

  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const customers = await customerService.getAll();
      set({ customers, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('خطأ في تحميل العملاء', {
        description: error.message,
      });
    }
  },

  searchCustomerByPhone: async (phone: string) => {
    set({ isLoading: true, error: null });
    try {
      const customer = await customerService.searchByPhone(phone);
      set({ isLoading: false });
      return customer;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('خطأ في البحث عن العميل', {
        description: error.message,
      });
      return null;
    }
  },

  getCustomerById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const customer = await customerService.getById(id);
      set({ isLoading: false });
      return customer;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('خطأ في جلب بيانات العميل', {
        description: error.message,
      });
      return null;
    }
  },

  createCustomer: async (customerData) => {
    set({ isLoading: true, error: null });
    try {
      const newCustomer = await customerService.create(customerData);
      set((state) => ({ 
        customers: [newCustomer, ...state.customers],
        isLoading: false 
      }));
      toast.success('تم إنشاء العميل بنجاح');
      return newCustomer;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل إنشاء العميل', {
        description: error.message,
      });
      throw error;
    }
  },

  updateCustomer: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCustomer = await customerService.update(id, updates);
      set((state) => ({
        customers: state.customers.map((c) => (c.customerId === id ? updatedCustomer : c)),
        isLoading: false,
      }));
      toast.success('تم تحديث بيانات العميل بنجاح');
      return updatedCustomer;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل تحديث العميل', {
        description: error.message,
      });
      throw error;
    }
  },

  addAddress: async (id, addressData) => {
    set({ isLoading: true, error: null });
    try {
      const newAddress = await customerService.addAddress(id, addressData);
      // Refresh customer data to get updated addresses
      const updatedCustomer = await customerService.getById(id);
      set((state) => ({
        customers: state.customers.map((c) => (c.customerId === id ? updatedCustomer : c)),
        isLoading: false,
      }));
      toast.success('تم إضافة العنوان بنجاح');
      return newAddress;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل إضافة العنوان', {
        description: error.message,
      });
      return null;
    }
  },

  getCustomerOrders: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const orders = await customerService.getOrders(id);
      set({ isLoading: false });
      return orders;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('خطأ في جلب طلبات العميل', {
        description: error.message,
      });
      return [];
    }
  },

  fetchCustomerOrders: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const orders = await customerService.getOrders(id);
      set({ customerOrders: orders, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('خطأ في تحميل طلبات العميل', {
        description: error.message,
      });
    }
  },
}));
