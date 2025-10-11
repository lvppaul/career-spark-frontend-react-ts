import api from '@/lib/axios';

export interface CreateOrderRequest {
  subscriptionPlanId: number;
  userId: number;
}

export interface OrderData {
  id: number;
  userId: number;
  userName: string;
  subscriptionPlanId: number;
  subscriptionPlanName: string;
  amount: number;
  status: string;
  vnPayOrderInfo?: string;
  createdAt: string;
  expiredAt?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data?: OrderData;
  paymentUrl?: string;
  timestamp?: string;
}

export async function createOrder(
  payload: CreateOrderRequest
): Promise<CreateOrderResponse> {
  const resp = await api.post<CreateOrderResponse>('/Order/create', payload);
  return resp.data;
}

export const orderService = {
  createOrder,
};

export default orderService;
