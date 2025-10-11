import api from '@/lib/axios';

export interface VnPayCallbackResponseData {
  transactionId: string;
  orderId: string;
  paymentMethod: string;
  paymentId: string;
  success: boolean;
  token?: string;
  vnPayResponseCode?: string;
  transactionOrderIdReference?: number;
}

export interface VnPayCallbackResponse {
  success: boolean;
  message: string;
  data?: VnPayCallbackResponseData;
  timestamp?: string;
}

/**
 * Call VnPay callback endpoint provided by backend.
 * The API expects the full linkResponse query param already encoded.
 */
export async function paymentCallbackVnpay(
  linkResponse: string
): Promise<VnPayCallbackResponse> {
  const url = `/Payment/Checkout/PaymentCallbackVnpay?linkResponse=${encodeURIComponent(linkResponse)}`;
  const resp = await api.get<VnPayCallbackResponse>(url);
  return resp.data;
}

export const paymentService = {
  paymentCallbackVnpay,
};

export default paymentService;
