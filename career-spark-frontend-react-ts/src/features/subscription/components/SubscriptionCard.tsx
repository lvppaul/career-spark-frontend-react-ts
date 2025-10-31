import { Card, Button, Badge, Space, message } from 'antd';
import {
  CheckCircleOutlined,
  CrownOutlined,
  StarOutlined,
} from '@ant-design/icons';
import type { SubscriptionPlan } from '@/features/subscription/services/subscriptionPlanService';
import { useNavigate } from 'react-router-dom';
import { tokenUtils } from '@/utils/tokenUtils';
import useCreateOrder from '@/features/order/hooks/useCreateOrder';

interface Props {
  plan: SubscriptionPlan;
  featured?: boolean;
}

export default function SubscriptionCard({ plan, featured = false }: Props) {
  const navigate = useNavigate();

  const { create, isLoading } = useCreateOrder();

  const handlePurchase = async () => {
    const user = tokenUtils.getUserData();
    if (!user || !user.sub) {
      // Ask user to login before purchase
      navigate('/login');
      return;
    }

    try {
      const resp = await create({
        subscriptionPlanId: plan.id,
        userId: Number(user.sub),
      });
      if (resp && resp.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = resp.paymentUrl;
        return;
      }

      // Fallback: navigate to purchase route if no paymentUrl
      navigate('/purchase', { state: { planId: plan.id } });
    } catch (err: unknown) {
      console.error('Order creation failed', err);
      const msg = err instanceof Error ? err.message : 'Tạo đơn hàng thất bại';
      message.error(msg);
    }
  };

  // Determine card styling based on price/features
  const isPremium = plan.price > 200000;
  const isFree = plan.price === 0;

  const getCardStyle = () => {
    if (featured || isPremium) {
      return {
        border: '2px solid #1890ff',
        boxShadow: '0 8px 24px rgba(24, 144, 255, 0.2)',
        transform: 'scale(1.02)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
      };
    }
    return {
      border: '1px solid #f0f0f0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease',
    };
  };

  const benefits =
    plan.benefits
      ?.split(',')
      .map((b) => b.trim())
      .filter(Boolean) || [];

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {featured && (
        <Badge.Ribbon text="PHỔ BIẾN" color="red" style={{ fontSize: 12 }}>
          <div />
        </Badge.Ribbon>
      )}
      <Card
        hoverable
        style={{
          ...getCardStyle(),
          borderRadius: 16,
          height: '100%',
          overflow: 'hidden',
        }}
        bodyStyle={{
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* Header with Icon */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 64,
              height: 64,
              margin: '0 auto 16px',
              background:
                featured || isPremium ? 'rgba(255,255,255,0.2)' : '#f0f5ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isPremium ? (
              <CrownOutlined
                style={{
                  fontSize: 32,
                  color: featured || isPremium ? '#fff' : '#1890ff',
                }}
              />
            ) : isFree ? (
              <StarOutlined
                style={{
                  fontSize: 32,
                  color: featured || isPremium ? '#fff' : '#52c41a',
                }}
              />
            ) : (
              <CheckCircleOutlined
                style={{
                  fontSize: 32,
                  color: featured || isPremium ? '#fff' : '#1890ff',
                }}
              />
            )}
          </div>

          {/* Plan Name */}
          <h3
            style={{
              fontSize: 24,
              fontWeight: 700,
              margin: 0,
              color: featured || isPremium ? '#fff' : '#262626',
            }}
          >
            {plan.name}
          </h3>

          {/* Description */}
          <p
            style={{
              color:
                featured || isPremium ? 'rgba(255,255,255,0.9)' : '#8c8c8c',
              marginTop: 8,
              fontSize: 14,
            }}
          >
            {plan.description}
          </p>
        </div>

        {/* Price */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: 42,
                fontWeight: 800,
                color: featured || isPremium ? '#fff' : '#262626',
                lineHeight: 1,
              }}
            >
              {plan.price === 0 ? 'Miễn phí' : plan.price.toLocaleString()}
            </span>
            {plan.price > 0 && (
              <span
                style={{
                  fontSize: 18,
                  color:
                    featured || isPremium ? 'rgba(255,255,255,0.8)' : '#8c8c8c',
                }}
              >
                ₫
              </span>
            )}
          </div>
          <div
            style={{
              marginTop: 8,
              color:
                featured || isPremium ? 'rgba(255,255,255,0.9)' : '#8c8c8c',
              fontSize: 14,
            }}
          >
            {plan.durationDays} ngày sử dụng
          </div>
        </div>

        {/* Benefits List */}
        {benefits.length > 0 && (
          <div style={{ flex: 1, marginBottom: 24 }}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                  }}
                >
                  <CheckCircleOutlined
                    style={{
                      color: featured || isPremium ? '#fff' : '#52c41a',
                      fontSize: 16,
                      marginTop: 2,
                    }}
                  />
                  <span
                    style={{
                      color:
                        featured || isPremium
                          ? 'rgba(255,255,255,0.95)'
                          : '#595959',
                      fontSize: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    {benefit}
                  </span>
                </div>
              ))}
            </Space>
          </div>
        )}

        {/* Action Button */}
        <Button
          type={featured || isPremium ? 'default' : 'primary'}
          size="large"
          block
          onClick={handlePurchase}
          loading={isLoading}
          style={{
            height: 48,
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            ...(featured || isPremium
              ? {
                  background: '#fff',
                  borderColor: '#fff',
                  color: '#1890ff',
                }
              : {}),
          }}
        >
          {isFree ? 'Bắt đầu miễn phí' : 'Chọn gói này'}
        </Button>
      </Card>
    </div>
  );
}
