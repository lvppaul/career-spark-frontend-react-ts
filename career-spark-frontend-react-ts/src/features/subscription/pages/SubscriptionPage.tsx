import { Row, Col, Card, Empty, Spin } from 'antd';
import SubscriptionCard from '@/features/subscription/components/SubscriptionCard';
import useSubscriptionPlans from '@/features/subscription/hooks/useSubscriptionPlans';

export default function SubscriptionPage() {
  const { data, isLoading } = useSubscriptionPlans();

  if (isLoading) return <Spin />;

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <h2>Gói dịch vụ</h2>
        <p>Chọn gói phù hợp với nhu cầu của bạn</p>

        <div style={{ marginTop: 16 }}>
          {data && data.length > 0 ? (
            <Row gutter={[16, 16]}>
              {data.map((plan) => (
                <Col xs={24} sm={12} md={8} key={plan.id}>
                  <SubscriptionCard plan={plan} />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty description="Không có gói nào" />
          )}
        </div>
      </Card>
    </div>
  );
}
