import { apiClient } from '@/services/api';

export type OrderStatus = 
  | 'Draft'
  | 'Registered'
  | 'In Warehouse'
  | 'In Transit'
  | 'Arrived at Destination'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Delivery Failed'
  | 'Delayed'
  | 'Returned'
  | 'Cancelled';

export interface Order {
  id: number;
  tracking_number: string;
  customer_id: number;
  customer_name: string;
  sender_name: string;
  sender_phone: string;
  receiver_name: string;
  receiver_phone: string;
  origin_address: string;
  destination_address: string;
  origin_city: string;
  destination_city: string;
  weight_kg: number;
  cargo_type: string;
  declared_value: number;
  delivery_price: number;
  current_status: OrderStatus;
  assigned_courier_id: number | null;
  courier_name: string | null;
  estimated_delivery_date: string | null;
  created_by_user_id: number;
  created_by_user_name: string;
  created_at: string;
  updated_at: string;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  customerId?: string;
  courierId?: string;
  originCity?: string;
  destinationCity?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface OrderFormData {
  customerId: number;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  originAddress: string;
  destinationAddress: string;
  originCity: string;
  destinationCity: string;
  weightKg: number;
  cargoType: string;
  declaredValue?: number;
  deliveryPrice?: number;
  estimatedDeliveryDate?: string;
}

export const orderService = {
  async getOrders(filters: OrderFilters = {}): Promise<OrdersResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.customerId) params.append('customerId', filters.customerId);
    if (filters.courierId) params.append('courierId', filters.courierId);
    if (filters.originCity) params.append('originCity', filters.originCity);
    if (filters.destinationCity) params.append('destinationCity', filters.destinationCity);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);

    const queryString = params.toString();
    const endpoint = `/api/orders${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<{ items: Order[]; page: number; limit: number; total: number }>(endpoint);
    return {
      orders: response.items,
      pagination: {
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: Math.ceil(response.total / response.limit),
      },
    };
  },

  async getOrderById(id: number): Promise<Order> {
    const response = await apiClient.get<{ order: Order }>(`/api/orders/${id}`);
    return response.order;
  },

  async getOrderByTrackingNumber(trackingNumber: string): Promise<Order> {
    const response = await apiClient.get<{ order: Order }>(`/api/orders/tracking/${trackingNumber}`);
    return response.order;
  },

  async createOrder(data: OrderFormData): Promise<Order> {
    const response = await apiClient.post<{ order: Order }>(`/api/orders`, data);
    return response.order;
  },

  async updateOrder(id: number, data: OrderFormData): Promise<Order> {
    const response = await apiClient.put<{ order: Order }>(`/api/orders/${id}`, data);
    return response.order;
  },

  async deleteOrder(id: number): Promise<void> {
    await apiClient.delete(`/api/orders/${id}`);
  },

  async assignCourier(orderId: number, courierId: number): Promise<Order> {
    const response = await apiClient.patch<{ order: Order }>(`/api/orders/${orderId}/assign-courier`, { courierId });
    return response.order;
  },
};
