import { apiClient } from './api';

export interface Customer {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  company_name: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomersResponse {
  customers: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CustomerFilters {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  country?: string;
}

export interface CustomerFormData {
  name: string;
  email?: string;
  phone: string;
  companyName?: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
}

export const customerService = {
  async getCustomers(filters: CustomerFilters = {}): Promise<CustomersResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.city) params.append('city', filters.city);
    if (filters.country) params.append('country', filters.country);

    const queryString = params.toString();
    const endpoint = `/api/customers${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<CustomersResponse>(endpoint);
    return response.data;
  },

  async getCustomerById(id: number): Promise<Customer> {
    const response = await apiClient.get<{ customer: Customer }>(`/api/customers/${id}`);
    return response.data.customer;
  },

  async createCustomer(data: CustomerFormData): Promise<Customer> {
    const response = await apiClient.post<{ customer: Customer }>(`/api/customers`, data);
    return response.data.customer;
  },

  async updateCustomer(id: number, data: CustomerFormData): Promise<Customer> {
    const response = await apiClient.put<{ customer: Customer }>(`/api/customers/${id}`, data);
    return response.data.customer;
  },

  async deleteCustomer(id: number): Promise<void> {
    await apiClient.delete(`/api/customers/${id}`);
  },
};
