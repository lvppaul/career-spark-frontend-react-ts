import { useEffect, useRef, useState } from 'react';
import { Button, Typography, Card } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { tokenUtils } from '@/utils/tokenUtils';
import { useAuth } from '@/features/auth/hooks/useAuth';

const { Text, Title } = Typography;

export default function PaymentResult() {
  const { logout } = useAuth();
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Countdown timer
    const interval = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    intervalRef.current = interval;

    // After 10 seconds clear localStorage and perform logout (which redirects to /login)
    const t = window.setTimeout(() => {
      try {
        tokenUtils.clearAll();
      } catch (e) {
        console.warn('Failed to clear local storage', e);
      }
      // Call logout from hook (it will attempt API logout and redirect)
      logout().catch((e) => console.warn('Logout failed', e));
    }, 10000);

    // store timeout id so the immediate button can cancel it
    timeoutRef.current = t;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [logout]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 24,
      }}
    >
      <Card
        style={{
          maxWidth: 600,
          width: '100%',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          textAlign: 'center',
        }}
        bodyStyle={{ padding: '48px 32px' }}
      >
        {/* Success Icon */}
        <div
          style={{
            width: 100,
            height: 100,
            margin: '0 auto 24px',
            background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(82, 196, 26, 0.3)',
          }}
        >
          <CheckCircleOutlined
            style={{
              fontSize: 56,
              color: '#fff',
            }}
          />
        </div>

        {/* Success Title */}
        <Title
          level={2}
          style={{
            margin: '0 0 16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          🎉 Chúc mừng!
        </Title>

        {/* Success Message */}
        <div style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              color: '#262626',
              display: 'block',
              marginBottom: 12,
              fontWeight: 500,
            }}
          >
            Bạn đã thanh toán thành công!
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: '#595959',
              display: 'block',
            }}
          >
            Tiếp theo bạn hãy đăng nhập lại để sử dụng dịch vụ.
          </Text>
        </div>

        {/* Countdown Notice */}
        <div
          style={{
            padding: 16,
            background: '#f0f5ff',
            borderRadius: 8,
            marginBottom: 24,
          }}
        >
          <Text type="secondary" style={{ fontSize: 14 }}>
            ⏱️ Bạn sẽ được chuyển về trang đăng nhập trong{' '}
            <strong>{countdown} giây</strong>...
          </Text>
        </div>

        {/* Login Button */}
        <Button
          type="primary"
          size="large"
          block
          onClick={() => {
            // Cancel the pending timeout and perform immediate logout/redirect
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
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
          style={{
            height: 48,
            fontSize: 16,
            fontWeight: 600,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
          }}
        >
          Đăng nhập ngay
        </Button>
      </Card>
    </div>
  );
}
