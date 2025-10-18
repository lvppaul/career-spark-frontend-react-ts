import api from '@/lib/axios';
import type {
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '../type';

/**
 * Request backend to send a reset password email to the given address.
 * POST /Authentication/forgot-password
 */
export async function forgotPasswordFn(
  email: string
): Promise<ForgotPasswordResponse> {
  const resp = await api.post<ForgotPasswordResponse>(
    '/Authentication/forgot-password',
    { email }
  );
  return resp.data;
}

export const passwordService = {
  forgotPassword: forgotPasswordFn,
  async resetPassword(
    payload: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    // Backend expects { email, token, newPassword, confirmNewPassword }
    const { email, token, newPassword, confirmNewPassword } = payload;
    const resp = await api.post<ResetPasswordResponse>(
      '/Authentication/reset-password',
      { email, token, newPassword, confirmNewPassword }
    );
    return resp.data;
  },
};

export default passwordService;
