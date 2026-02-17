export interface Address {
  addressId: number;
  areaId: number;
  areaName: string;
  addressDetails: string;
  label: string;
  isDefault: boolean;
  deliveryCost: number;
}

export interface Customer {
  customerId: number;
  name: string;
  phone: string;
  phone2: string | null;
  whatsappNumber: string | null;
  serviceStatus: string;
  notes: string | null;
  isActive: boolean;
  isNewCustomer: boolean;
  orderCount: number;
  createdAt: string;
  addresses: Address[];
}

export interface CreateAddressDto {
  areaId: number;
  addressDetails: string;
  label?: string;
  isDefault?: boolean;
}

export interface CreateCustomerDto {
  name: string;
  phone: string;
  phone2?: string;
  whatsappNumber?: string;
  notes?: string;
  address?: CreateAddressDto;
}

export interface UpdateCustomerDto {
  name?: string;
  phone?: string;
  phone2?: string;
  whatsappNumber?: string;
  serviceStatus?: string;
  notes?: string;
  isActive?: boolean;
}
