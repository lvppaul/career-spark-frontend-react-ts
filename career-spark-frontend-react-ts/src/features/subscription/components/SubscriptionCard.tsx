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
import { useState } from 'react';

interface Props {
  plan: SubscriptionPlan;
  featured?: boolean;
}

export default function SubscriptionCard({ plan, featured = false }: Props) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

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
        border: '3px solid transparent',
        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.25)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      };
    }
    return {
      border: '2px solid #f0f0f0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      background: '#ffffff',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };
  };

  const getHoverStyle = () => {
    if (featured || isPremium) {
      return {
        boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
        transform: 'translateY(-8px) scale(1.02)',
        border: '3px solid rgba(255, 255, 255, 0.5)',
      };
    }
    return {
      border: '2px solid #1890ff',
      boxShadow: '0 8px 24px rgba(24, 144, 255, 0.2)',
      transform: 'translateY(-8px)',
    };
  };

  const benefits =
    plan.benefits
      ?.split(',')
      .map((b) => b.trim())
      .filter(Boolean) || [];

  return (
    <div
      style={{ position: 'relative', height: '100%' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {featured && (
        <Badge.Ribbon text="PHỔ BIẾN" color="red" style={{ fontSize: 12 }}>
          <div />
        </Badge.Ribbon>
      )}
      <Card
        hoverable
        style={{
          ...getCardStyle(),
          ...(isHovered ? getHoverStyle() : {}),
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
              width: 72,
              height: 72,
              margin: '0 auto 16px',
              background:
                featured || isPremium ? 'rgba(255,255,255,0.2)' : '#f0f5ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
              boxShadow: isHovered
                ? featured || isPremium
                  ? '0 8px 20px rgba(255,255,255,0.3)'
                  : '0 8px 20px rgba(24, 144, 255, 0.3)'
                : 'none',
            }}
          >
            {isPremium ? (
              <CrownOutlined
                style={{
                  fontSize: 36,
                  color: featured || isPremium ? '#fff' : '#1890ff',
                  transition: 'all 0.3s ease',
                }}
              />
            ) : isFree ? (
              <StarOutlined
                style={{
                  fontSize: 36,
                  color: featured || isPremium ? '#fff' : '#52c41a',
                  transition: 'all 0.3s ease',
                }}
              />
            ) : (
              <CheckCircleOutlined
                style={{
                  fontSize: 36,
                  color: featured || isPremium ? '#fff' : '#1890ff',
                  transition: 'all 0.3s ease',
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
        <div
          style={{
            textAlign: 'center',
            marginBottom: 24,
            padding: '16px 0',
            borderRadius: 12,
            background: isHovered
              ? featured || isPremium
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(24, 144, 255, 0.05)'
              : 'transparent',
            transition: 'all 0.3s ease',
          }}
        >
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
                fontSize: isHovered ? 46 : 42,
                fontWeight: 800,
                color: featured || isPremium ? '#fff' : '#262626',
                lineHeight: 1,
                transition: 'all 0.3s ease',
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
              fontWeight: 500,
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
            transition: 'all 0.3s ease',
            ...(featured || isPremium
              ? {
                  background: '#fff',
                  borderColor: '#fff',
                  color: '#667eea',
                  boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                }
              : {
                  boxShadow: isHovered
                    ? '0 4px 12px rgba(24, 144, 255, 0.3)'
                    : 'none',
                  transform: isHovered ? 'translateY(-2px)' : 'none',
                }),
          }}
        >
          {isFree ? 'Bắt đầu miễn phí' : 'Chọn gói này'}
        </Button>
      </Card>
    </div>
  );
}
