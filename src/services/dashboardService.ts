import { apiClient } from '@/services/api';

export interface DashboardStats {
  overview: {
    totalOrders: number;
    totalCustomers: number;
    totalUsers: number;
    totalRevenue: number;
  };
  ordersByStatus: Array<{
    current_status: string;
    count: number;
  }>;
  deliveryStats: {
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    delayedDeliveries: number;
  };
  recentOrders: Array<{
    id: number;
    tracking_number: string;
    current_status: string;
    created_at: string;
    customer_name: string;
    origin_city: string;
    destination_city: string;
  }>;
}

export interface OrderTrend {
  date: string;
  orders_count: number;
}

export interface TopCourier {
  id: number;
  full_name: string;
  total_deliveries: number;
  successful_deliveries: number;
}

export const dashboardService = {
  async getDashboardStats(dateFrom?: string, dateTo?: string): Promise<DashboardStats> {
    const params = new URLSearchParams();
    
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    const queryString = params.toString();
    const endpoint = `/api/dashboard/stats${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<DashboardStats>(endpoint);
    return response.data;
  },

  async getOrderTrends(days = 30): Promise<OrderTrend[]> {
    const endpoint = `/api/dashboard/trends?days=${days}`;
    const response = await apiClient.get<{ trends: OrderTrend[] }>(endpoint);
    return response.data.trends;
  },

  async getTopCouriers(limit = 5): Promise<TopCourier[]> {
    const endpoint = `/api/dashboard/top-couriers?limit=${limit}`;
    const response = await apiClient.get<{ couriers: TopCourier[] }>(endpoint);
    return response.data.couriers;
  },
};
