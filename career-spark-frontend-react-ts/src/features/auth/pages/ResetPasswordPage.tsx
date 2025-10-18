import React, { useCallback, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Alert, Card, Typography } from 'antd';
import { useResetPassword } from '@/features/user/user-management/hooks/useResetPassword';

const { Title, Text } = Typography;

const ResetPasswordPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const email = useMemo(() => params.get('email') || '', [params]);
  const token = useMemo(() => params.get('token') || '', [params]);

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { request, isLoading, error, message, resetState } = useResetPassword();

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!email) errs.email = 'Thiếu email trong đường dẫn';
    if (!token) errs.token = 'Thiếu token trong đường dẫn';
    if (!newPassword) errs.newPassword = 'Nhập mật khẩu mới';
    if (newPassword !== confirmNewPassword)
      errs.confirmNewPassword = 'Mật khẩu xác nhận không khớp';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }, [email, token, newPassword, confirmNewPassword]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();
    if (!validate()) return;
    try {
      const res = await request({
        email,
        token,
        newPassword,
        confirmNewPassword,
      });
      if (res.success) {
        // Optionally redirect to login
        setTimeout(() => navigate('/login', { replace: true }), 1200);
      }
    } catch {
      // handled via hook error state
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <Title level={3} style={{ marginTop: 0 }}>
          Đặt lại mật khẩu
        </Title>
        <Text>Nhập mật khẩu mới cho tài khoản của bạn.</Text>

        <div className="mt-4">
          {message && (
            <Alert type="success" message={message} showIcon className="mb-3" />
          )}
          {error && (
            <Alert type="error" message={error} showIcon className="mb-3" />
          )}

          {/* Hidden meta info if needed for debugging */}
          {/* <pre className="text-xs text-gray-500">email={email}\ntoken={token?.slice(0, 6)}...</pre> */}

          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mật khẩu mới
              </label>
              <input
                type="password"
                className={`mt-1 w-full px-3 py-2 border ${fieldErrors.newPassword ? 'border-red-300' : 'border-gray-300'} rounded-md`}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
              {fieldErrors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                className={`mt-1 w-full px-3 py-2 border ${fieldErrors.confirmNewPassword ? 'border-red-300' : 'border-gray-300'} rounded-md`}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="••••••••"
              />
              {fieldErrors.confirmNewPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.confirmNewPassword}
                </p>
              )}
            </div>

            {/* Top-level errors for missing params */}
            {(fieldErrors.email || fieldErrors.token) && (
              <Alert
                type="error"
                message={fieldErrors.email || fieldErrors.token}
                showIcon
                className="mb-2"
              />
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="cs-primary-btn px-4 py-2 rounded text-white disabled:opacity-50"
            >
              {isLoading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
