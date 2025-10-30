import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Result, Button, Typography } from 'antd';
import { tokenUtils } from '@/utils/tokenUtils';
import { useAuth } from '@/features/auth/hooks/useAuth';

const { Text } = Typography;

export default function PaymentResult() {
  const [params] = useSearchParams();
  const status = params.get('status');
  const message = params.get('message');
  const orderId = params.get('orderId');
  const txnRef = params.get('txnRef');
  const code = params.get('code');

  const isSuccess = status === 'success' && code === '00';

  const { logout } = useAuth();
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // After 3 seconds clear localStorage and perform logout (which redirects to /login)
    const t = window.setTimeout(() => {
      try {
        tokenUtils.clearAll();
      } catch (e) {
        console.warn('Failed to clear local storage', e);
      }
      // Call logout from hook (it will attempt API logout and redirect)
      logout().catch((e) => console.warn('Logout failed', e));
    }, 3000);

    // store timeout id so the immediate button can cancel it
    timeoutRef.current = t;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [logout]);

  return (
    <div className="flex flex-col justify-center items-center">
      {isSuccess ? (
        <Result
          status="success"
          title="Thanh toán thành công!"
          subTitle={`Đơn hàng #${orderId} (Mã tham chiếu: ${txnRef}) đã được xử lý thành công.`}
        />
      ) : (
        <Result
          status="error"
          title="Thanh toán thất bại!"
          subTitle={`Lỗi: ${decodeURIComponent(message ?? 'Giao dịch không hợp lệ.')}`}
          extra={[
            <Button type="primary" key="retry" href="/">
              Thử lại
            </Button>,
          ]}
        />
      )}

      <div style={{ marginTop: 12 }}>
        <Text type="secondary">
          Bạn sẽ được chuyển về trang đăng nhập trong 3 giây...
        </Text>
      </div>
      <div style={{ marginTop: 12 }}>
        <Button
          type="default"
          onClick={() => {
            // Cancel the pending timeout and perform immediate logout/redirect
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }

            try {
              tokenUtils.clearAll();
            } catch (e) {
              console.warn('Failed to clear local storage', e);
            }
            logout().catch((e) => {
              console.warn('Logout failed, fallback to redirect', e);
              window.location.replace('/login');
            });
          }}
        >
          Đăng nhập ngay
        </Button>
      </div>
    </div>
  );
}
