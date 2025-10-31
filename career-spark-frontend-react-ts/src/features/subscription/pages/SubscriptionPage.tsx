import { Row, Col, Empty, Spin } from 'antd';
import SubscriptionCard from '@/features/subscription/components/SubscriptionCard';
import useSubscriptionPlans from '@/features/subscription/hooks/useSubscriptionPlans';

export default function SubscriptionPage() {
  const { data, isLoading } = useSubscriptionPlans();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '48px 24px',
        background: 'linear-gradient(180deg, #f0f2f5 0%, #ffffff 100%)',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              margin: 0,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Chọn gói dịch vụ phù hợp
          </h1>
          <p
            style={{
              fontSize: 18,
              color: '#8c8c8c',
              marginTop: 16,
              maxWidth: 600,
              margin: '16px auto 0',
            }}
          >
            Nâng cao trải nghiệm của bạn với các gói dịch vụ đa dạng và linh
            hoạt
          </p>
        </div>

        {/* Plans Grid */}
        <div>
          {data && data.length > 0 ? (
            <Row gutter={[24, 24]} justify="center">
              {data.map((plan, index) => (
                <Col xs={24} sm={24} md={12} lg={8} key={plan.id}>
                  <SubscriptionCard
                    plan={plan}
                    featured={index === 1 || plan.price > 200000}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 48,
                textAlign: 'center',
              }}
            >
              <Empty description="Không có gói dịch vụ nào" />
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div
          style={{
            textAlign: 'center',
            marginTop: 48,
            padding: 24,
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <p style={{ color: '#8c8c8c', margin: 0, fontSize: 14 }}>
            💡 Tất cả các gói đều có thể hủy bất cứ lúc nào. Không có phí ẩn.
          </p>
        </div>
      </div>
    </div>
  );
}
