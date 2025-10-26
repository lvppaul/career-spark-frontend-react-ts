import React, { useState } from 'react';
import { Alert, Typography } from 'antd';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { tokenUtils } from '@/utils/tokenUtils';

const { Title, Text } = Typography;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPasswordSection: React.FC = () => {
  const [email] = useState(() => tokenUtils.getUserData()?.email || '');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const { request, isLoading, error, message, resetState } =
    useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);
    resetState();
    if (!email || !emailRegex.test(email)) {
      setFieldError('Vui lòng nhập email hợp lệ');
      return;
    }
    try {
      await request(email);
    } catch {
      // handled in hook
    }
  };

  return (
    <div>
      <Title level={4}>Quên mật khẩu</Title>
      <Text>Nhập email để nhận đường dẫn đặt lại mật khẩu.</Text>
      <div className="mt-4">
        {message && (
          <Alert type="success" message={message} showIcon className="mb-3" />
        )}
        {error && (
          <Alert type="error" message={error} showIcon className="mb-3" />
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className={`mt-1 w-full px-3 py-2 border ${fieldError ? 'border-red-300' : 'border-gray-300'} rounded-md bg-gray-100`}
              value={email}
              readOnly
              placeholder="you@example.com"
            />
            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="cs-primary-btn px-4 py-2 rounded text-white disabled:opacity-50"
          >
            {isLoading ? 'Đang gửi...' : 'Gửi email đặt lại'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordSection;
