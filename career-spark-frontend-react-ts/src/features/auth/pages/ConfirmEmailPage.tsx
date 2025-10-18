import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Alert, Typography, Button } from 'antd';
import { useConfirmEmail } from '../hooks/useConfirmEmail';

const ConfirmEmailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const email = params.get('email') || '';
  const token = params.get('token') || '';

  const { confirmEmail, isLoading, error, data } = useConfirmEmail();
  const [executed, setExecuted] = useState(false); // ✅ chặn lặp
  const [redirectTimer, setRedirectTimer] = useState<number>(3);

  useEffect(() => {
    if (!email || !token || executed) return;
    setExecuted(true); // chạy 1 lần duy nhất

    (async () => {
      try {
        await confirmEmail(email, token);
      } catch {
        // lỗi đã được handle trong hook
      }
    })();
  }, [email, token, executed, confirmEmail]);

  // Redirect sau 3 giây nếu thành công
  useEffect(() => {
    if (data?.success) {
      const timer = setInterval(() => {
        setRedirectTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/login');
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [data, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50"
      style={{ padding: 24 }}
    >
      <Card style={{ width: 'min(480px, 95vw)', borderRadius: 12 }}>
        <div className="text-center mb-4">
          <Typography.Title level={3}>Xác thực Email</Typography.Title>
          <Typography.Paragraph type="secondary">
            Hệ thống đang xử lý yêu cầu xác nhận email của bạn.
          </Typography.Paragraph>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-6">
            <div className="animate-spin inline-block">
              <svg
                className="h-8 w-8 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            </div>
            <div className="mt-4 text-gray-600">Đang xác thực email...</div>
          </div>
        )}

        {/* Thành công */}
        {data && data.success && (
          <Alert
            type="success"
            message={data.message || 'Email đã được xác nhận thành công!'}
            description={`Bạn sẽ được chuyển đến trang đăng nhập sau ${redirectTimer}s.`}
            showIcon
            className="mb-4"
          />
        )}

        {/* Lỗi */}
        {error && (
          <Alert
            type="error"
            message="Xác thực thất bại"
            description={error}
            showIcon
            className="mb-4"
          />
        )}

        {/* Nút hành động phụ */}
        {!isLoading && !data?.success && (
          <div className="text-center mt-4">
            <Button
              type="link"
              onClick={() => navigate('/resend-verification')}
            >
              Gửi lại email xác nhận
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ConfirmEmailPage;
