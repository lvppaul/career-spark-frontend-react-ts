import api from '@/lib/axios';

/**
 * Order data interface
 */
export interface AdminOrderData {
  id: number;
  userId: number;
  userName: string;
  subscriptionPlanId: number;
  subscriptionPlanName: string;
  amount: number;
  status: string;
  payOSTransactionId?: string;
  payOSOrderInfo?: string;
  payOSResponseCode?: string;
  createdAt: string;
  paidAt?: string;
  expiredAt?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMetadata {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

/**
 * API Response for orders list
 */
export interface AdminOrdersResponse {
  success: boolean;
  message: string;
  data: AdminOrderData[];
  pagination: PaginationMetadata;
  timestamp?: string;
}

/**
 * API Response for single order
 */
export interface AdminOrderResponse {
  success: boolean;
  message: string;
  data: AdminOrderData;
  timestamp?: string;
}

/**
 * Query parameters for fetching orders
 */
export interface GetOrdersParams {
  pageNumber?: number;
  pageSize?: number;
  year?: number;
  month?: number;
  day?: number;
}

/**
 * Revenue by day data item
 */
export interface RevenueByDay {
  key: number; // day of the month
  value: number; // revenue amount
}

/**
 * Query parameters for fetching revenue by day
 */
export interface GetRevenueByDayParams {
  year: number;
  month: number;
}

/**
 * API Response for revenue by day
 */
export interface RevenueByDayResponse {
  success: boolean;
  message: string;
  data: RevenueByDay[];
  timestamp?: string;
}

/**
 * Revenue by month data item
 */
export interface RevenueByMonth {
  key: number; // month of the year (1-12)
  value: number; // revenue amount
}

/**
 * Query parameters for fetching revenue by month
 */
export interface GetRevenueByMonthParams {
  year: number;
}

/**
 * API Response for revenue by month
 */
export interface RevenueByMonthResponse {
  success: boolean;
  message: string;
  data: RevenueByMonth[];
  timestamp?: string;
}

/**
 * Revenue by year data item
 */
export interface RevenueByYear {
  key: number; // year
  value: number; // revenue amount
}

/**
 * API Response for revenue by year
 */
export interface RevenueByYearResponse {
  success: boolean;
  message: string;
  data: RevenueByYear[];
  timestamp?: string;
}

/**
 * Top spender data item
 */
export interface TopSpender {
  userId: number;
  userName: string;
  email: string;
  total: number;
}

/**
 * Query parameters for fetching top spenders
 */
export interface GetTopSpendersParams {
  top?: number;
}

/**
 * API Response for top spenders
 */
export interface TopSpendersResponse {
  success: boolean;
  message: string;
  data: TopSpender[];
  timestamp?: string;
}

/**
 * Admin service for managing orders
 */
export const adminOrderService = {
  /**
   * Get all orders with pagination and filters
   */
  getOrders: async (
    params?: GetOrdersParams,
    options?: { skipLoading?: boolean }
  ): Promise<AdminOrdersResponse> => {
    const headers: Record<string, string> = {};
    if (options?.skipLoading) headers['x-skip-loading'] = 'true';

    const queryParams = new URLSearchParams();
    if (params?.pageNumber)
      queryParams.append('pageNumber', params.pageNumber.toString());
    if (params?.pageSize)
      queryParams.append('pageSize', params.pageSize.toString());
    if (params?.year) queryParams.append('year', params.year.toString());
    if (params?.month) queryParams.append('month', params.month.toString());
    if (params?.day) queryParams.append('day', params.day.toString());

    const url = `/Order${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const resp = await api.get<AdminOrdersResponse>(url, { headers });
    return resp.data;
  },

  /**
   * Get a single order by ID
   */
  getOrderById: async (
    id: number | string,
    options?: { skipLoading?: boolean }
  ): Promise<AdminOrderResponse> => {
    const headers: Record<string, string> = {};
    if (options?.skipLoading) headers['x-skip-loading'] = 'true';

    const resp = await api.get<AdminOrderResponse>(`/Order/${id}`, { headers });
    return resp.data;
  },

  /**
   * Update order status (if needed)
   */
  updateOrderStatus: async (
    id: number | string,
    status: string,
    options?: { skipLoading?: boolean }
  ): Promise<AdminOrderResponse> => {
    const headers: Record<string, string> = {};
    if (options?.skipLoading) headers['x-skip-loading'] = 'true';

    const resp = await api.put<AdminOrderResponse>(
      `/Order/${id}/status`,
      { status },
      { headers }
    );
    return resp.data;
  },

  /**
   * Delete/Cancel an order
   */
  deleteOrder: async (
    id: number | string,
    options?: { skipLoading?: boolean }
  ): Promise<{ success: boolean; message?: string; timestamp?: string }> => {
    const headers: Record<string, string> = {};
    if (options?.skipLoading) headers['x-skip-loading'] = 'true';

    const resp = await api.delete<{
      success: boolean;
      message?: string;
      timestamp?: string;
    }>(`/Order/${id}`, { headers });
    return resp.data;
  },

  /**
   * Get revenue by day for a specific month and year
   */
  getRevenueByDay: async (
    params: GetRevenueByDayParams,
    options?: { skipLoading?: boolean }
  ): Promise<RevenueByDayResponse> => {
    const headers: Record<string, string> = {};
    if (options?.skipLoading) headers['x-skip-loading'] = 'true';

    const queryParams = new URLSearchParams();
    queryParams.append('year', params.year.toString());
    queryParams.append('month', params.month.toString());

    const url = `/Order/revenue/days?${queryParams.toString()}`;
    const resp = await api.get<RevenueByDayResponse>(url, { headers });
    return resp.data;
  },

  /**
   * Get revenue by month for a specific year
   */
  getRevenueByMonth: async (
    params: GetRevenueByMonthParams,
    options?: { skipLoading?: boolean }
  ): Promise<RevenueByMonthResponse> => {
    const headers: Record<string, string> = {};
    if (options?.skipLoading) headers['x-skip-loading'] = 'true';

    const queryParams = new URLSearchParams();
    queryParams.append('year', params.year.toString());

    const url = `/Order/revenue/months?${queryParams.toString()}`;
    const resp = await api.get<RevenueByMonthResponse>(url, { headers });
    return resp.data;
  },

  /**
   * Get revenue by year (all years)
   */
  getRevenueByYear: async (options?: {
    skipLoading?: boolean;
  }): Promise<RevenueByYearResponse> => {
    const headers: Record<string, string> = {};
    if (options?.skipLoading) headers['x-skip-loading'] = 'true';

    const url = `/Order/revenue/years`;
    const resp = await api.get<RevenueByYearResponse>(url, { headers });
    return resp.data;
  },

  /**
   * Get top spenders for current month
   */
  getTopSpendersCurrentMonth: async (
    params?: GetTopSpendersParams,
    options?: { skipLoading?: boolean }
  ): Promise<TopSpendersResponse> => {
    const headers: Record<string, string> = {};
    if (options?.skipLoading) headers['x-skip-loading'] = 'true';

    const queryParams = new URLSearchParams();
    if (params?.top) queryParams.append('top', params.top.toString());

    const url = `/Order/top-spenders/current-month${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const resp = await api.get<TopSpendersResponse>(url, { headers });
    return resp.data;
  },

  /**
   * Get top spenders for last 7 days
   */
  getTopSpendersLast7Days: async (
    params?: GetTopSpendersParams,
    options?: { skipLoading?: boolean }
  ): Promise<TopSpendersResponse> => {
    const headers: Record<string, string> = {};
    if (options?.skipLoading) headers['x-skip-loading'] = 'true';

    const queryParams = new URLSearchParams();
    if (params?.top) queryParams.append('top', params.top.toString());

    const url = `/Order/top-spenders/last-7-days${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const resp = await api.get<TopSpendersResponse>(url, { headers });
    return resp.data;
  },
};

export default adminOrderService;
