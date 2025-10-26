import { Card, Button, Divider, message } from 'antd';
import type { SubscriptionPlan } from '@/features/subscription/services/subscriptionPlanService';
import { useNavigate } from 'react-router-dom';
import { tokenUtils } from '@/utils/tokenUtils';
import useCreateOrder from '@/features/order/hooks/useCreateOrder';

interface Props {
  plan: SubscriptionPlan;
}

export default function SubscriptionCard({ plan }: Props) {
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

  return (
    <Card bodyStyle={{ padding: 20 }} style={{ borderRadius: 12 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{plan.name}</div>
          <div style={{ color: '#666', marginTop: 6 }}>{plan.description}</div>
          {plan.benefits ? (
            <div style={{ color: '#444', marginTop: 8, fontSize: 13 }}>
              <strong>Lợi ích:</strong> {plan.benefits}
            </div>
          ) : null}
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>
            {plan.price === 0 ? '0 ' : plan.price.toLocaleString()}₫
          </div>
          <div style={{ color: '#888', marginTop: 6 }}>
            {plan.durationDays} ngày
          </div>
          <div style={{ marginTop: 12 }}>
            <Button type="primary" onClick={handlePurchase} loading={isLoading}>
              Chọn
            </Button>
          </div>
        </div>
      </div>
      <Divider />
    </Card>
  );
}
