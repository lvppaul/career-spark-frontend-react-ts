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
};

export default adminOrderService;
