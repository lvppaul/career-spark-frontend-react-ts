import { Card, Typography, Button, Space } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import qrDemo from '@/assets/images/qr_code_demo.png';

const { Title, Text } = Typography;

export default function PurchasePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const locState =
    (location.state as {
      billingCycle?: 'monthly' | 'quarterly' | 'yearly';
    } | null) || {};
  const billing = locState.billingCycle || 'monthly';

  const priceMap: Record<string, string> = {
    monthly: '39.000₫',
    quarterly: '99.000₫',
    yearly: '289.000₫',
  };

  const price = priceMap[billing] || priceMap.monthly;
  const qrUrl = qrDemo;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        padding: 24,
      }}
    >
      <Card style={{ width: 560, textAlign: 'center' }}>
        <Title level={3}>Thanh toán</Title>
        <Text>Chu kỳ: {billing}</Text>
        <div style={{ marginTop: 12 }}>
          <Text strong style={{ fontSize: 20 }}>
            {price}
          </Text>
        </div>

        <div style={{ marginTop: 24 }}>
          <img
            src={qrUrl}
            alt="QR code"
            style={{
              width: 260,
              height: 260,
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
            }}
          />

          <div style={{ marginTop: 16 }}>
            <Text>Quét mã QR để thanh toán bằng ứng dụng ngân hàng</Text>
          </div>

          <div style={{ marginTop: 20 }}>
            <Space>
              <Button onClick={() => navigate(-1)}>Quay lại</Button>
              <Button
                type="primary"
                onClick={() => {
                  // Read persisted result and pass to matching-jobs page
                  try {
                    const raw = localStorage.getItem('riasecResult');
                    const result = raw ? JSON.parse(raw) : null;
                    navigate('/matching-jobs', { state: { result } });
                  } catch (e) {
                    console.warn('Failed to read riasecResult', e);
                    navigate('/matching-jobs');
                  }
                }}
              >
                Next
              </Button>
            </Space>
          </div>
        </div>
      </Card>
    </div>
  );
}
