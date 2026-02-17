import api from '@/lib/api-client';
import { 
  Customer, 
  CreateCustomerDto, 
  UpdateCustomerDto, 
  CreateAddressDto 
} from '@/dto/customer.dto';
import { Order } from '@/dto/order.dto';

export const customerService = {
  async getAll() {
    const response = await api.get<any>('/customers');
    return response.data.data as Customer[];
  },

  async searchByPhone(phone: string) {
    const response = await api.get<any>(`/customers/search?phone=${phone}`);
    return response.data.data as Customer | null;
  },

  async getById(id: number) {
    const response = await api.get<any>(`/customers/${id}`);
    return response.data.data as Customer;
  },

  async create(customerData: CreateCustomerDto) {
    const response = await api.post<any>('/customers', customerData);
    return response.data.data as Customer;
  },

  async update(id: number, updates: UpdateCustomerDto) {
    const response = await api.put<any>(`/customers/${id}`, updates);
    return response.data.data as Customer;
  },

  async addAddress(id: number, addressData: CreateAddressDto) {
    const response = await api.post<any>(`/customers/${id}/addresses`, addressData);
    return response.data.data;
  },

  async getOrders(id: number) {
    const response = await api.get<any>(`/customers/${id}/orders`);
    return response.data.data as Order[];
  }
};
