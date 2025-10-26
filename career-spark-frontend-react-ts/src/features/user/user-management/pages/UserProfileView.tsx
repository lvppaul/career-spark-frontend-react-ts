import React from 'react';
import {
  Card,
  Avatar,
  Typography,
  Button,
  Descriptions,
  Spin,
  List,
  Empty,
  Badge,
  Progress,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useUser } from '../hooks/useUser';
import { getSessionsByUser } from '../../test-riasec/services/testRiasecService';
import type { SessionSummary } from '../../test-riasec/types';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import useMyActiveSubscription from '@/features/subscription/hooks/useMyActiveSubscription';

const { Title, Text } = Typography;

export default function UserProfileView() {
  const params = useParams();
  // Prefer the authenticated user's id (via useAuth) otherwise fall back to route param
  const { user: authUser } = useAuth();
  const id = authUser?.sub ?? params.id ?? '1';
  const { data, isLoading } = useUser(id);
  const navigate = useNavigate();
  const [sessions, setSessions] = React.useState<SessionSummary[] | null>(null);
  const [loadingSessions, setLoadingSessions] = React.useState(false);
  const { data: activeSub, isLoading: loadingSub } = useMyActiveSubscription();

  const computeSubscriptionPercent = React.useCallback((sub: any) => {
    if (!sub) return 0;
    const now = Date.now();
    const start = sub.startDate ? new Date(sub.startDate).getTime() : NaN;
    const end = sub.endDate ? new Date(sub.endDate).getTime() : NaN;

    // If valid dates available, compute percent from time range
    if (!isNaN(start) && !isNaN(end) && end > start) {
      const total = end - start;
      const remaining = Math.max(0, end - now);
      const percent = Math.round((remaining / total) * 100);
      return Math.max(0, Math.min(100, percent));
    }

    // Fallback: use remainingDays and planDurationDays if provided
    if (
      typeof sub.remainingDays === 'number' &&
      typeof sub.planDurationDays === 'number' &&
      sub.planDurationDays > 0
    ) {
      const pct = Math.round((sub.remainingDays / sub.planDurationDays) * 100);
      return Math.max(0, Math.min(100, pct));
    }

    return 0;
  }, []);

  const percentRemaining = React.useMemo(
    () => computeSubscriptionPercent(activeSub),
    [activeSub, computeSubscriptionPercent]
  );
  const isExpired = React.useMemo(() => {
    if (!activeSub || !activeSub.endDate) return false;
    const end = new Date(activeSub.endDate).getTime();
    if (isNaN(end)) return false;
    return end < Date.now();
  }, [activeSub]);

  React.useEffect(() => {
    const load = async () => {
      setLoadingSessions(true);
      try {
        const list = await getSessionsByUser(Number(id));
        setSessions(list || []);
      } catch (err) {
        console.error('Failed to load sessions', err);
        setSessions([]);
      } finally {
        setLoadingSessions(false);
      }
    };

    load();
  }, [id]);

  if (isLoading) return <Spin />;

  if (!data)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 80px)',
          paddingTop: 24,
          paddingBottom: 10,
        }}
      >
        <Card>
          <Text>Người dùng không tồn tại</Text>
        </Card>
      </div>
    );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: 'calc(100vh - 80px)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          width: 'min(1200px, 98%)',
          display: 'flex',
          gap: 28,
          margin: 30,
        }}
      >
        <Card
          style={{
            flex: 1,

            borderRadius: 12,
            border: '2px solid #d9d9d9', // ✅ viền to hơn, màu xám nhẹ
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)', // thêm bóng nhẹ
          }}
        >
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Avatar size={140} src={data.avatarURL ?? undefined}>
              {data.name?.[0]}
            </Avatar>
            <div style={{ flex: 1 }}>
              <Title level={3} style={{ margin: 0 }}>
                {data.name}
              </Title>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">{data.email}</Text>
              </div>
            </div>
            <div>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => navigate(`/profile/edit/${id}`)}
                size="large"
              >
                Chỉnh sửa
              </Button>
            </div>
          </div>

          <Descriptions column={1} style={{ marginTop: 28 }}>
            <Descriptions.Item label="Số điện thoại">
              {data.phone ?? 'Chưa có'}
            </Descriptions.Item>

            <Descriptions.Item label="Ngày tạo">
              {new Date(data.createdAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card
          title="Các bài test đã làm gần đây"
          style={{
            width: 420,

            borderRadius: 12,
            border: '2px solid #d9d9d9',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <List
            loading={loadingSessions}
            dataSource={(sessions || [])
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
              )
              .slice(0, 3)}
            locale={{ emptyText: <Empty description="Chưa có bài test" /> }}
            renderItem={(item: SessionSummary) => (
              <List.Item>
                <List.Item.Meta
                  title={`Lần ${item.sessionId}`}
                  description={new Date(item.startAt).toLocaleString()}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>

      {/* Active subscription - full width below profile and tests */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {String(authUser?.sub) === String(id) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div style={{ margin: 30 }}>
              <Card
                title="Gói đăng ký hiện tại"
                style={{
                  width: 1200,
                  borderRadius: 12,
                  border: '2px solid #d9d9d9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                {loadingSub ? (
                  <Spin />
                ) : activeSub ? (
                  <div
                    style={{ display: 'flex', gap: 24, alignItems: 'center' }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ fontSize: 16, fontWeight: 700 }}>
                          {activeSub.planName}
                        </div>
                        {/* Badge showing active/expired */}
                        {isExpired ? (
                          <Badge status="error" text="Expired" />
                        ) : (
                          <Badge status="success" text="Active" />
                        )}
                      </div>

                      <div style={{ color: '#666', marginTop: 6 }}>
                        Cấp độ: {activeSub.level}
                      </div>
                      <div style={{ color: '#666', marginTop: 6 }}>
                        Thời gian:{' '}
                        {new Date(activeSub.startDate).toLocaleDateString()} →{' '}
                        {new Date(activeSub.endDate).toLocaleDateString()}
                      </div>

                      <div style={{ marginTop: 10 }}>
                        <Progress
                          percent={percentRemaining}
                          status={isExpired ? 'exception' : 'active'}
                        />
                        <div style={{ color: '#666', marginTop: 6 }}>
                          {isExpired
                            ? 'Gói đã hết hạn'
                            : `Còn lại: ${
                                typeof activeSub.remainingDays === 'number'
                                  ? activeSub.remainingDays
                                  : Math.max(
                                      0,
                                      Math.ceil(
                                        (new Date(activeSub.endDate).getTime() -
                                          Date.now()) /
                                          (1000 * 60 * 60 * 24)
                                      )
                                    )
                              } ngày (${percentRemaining}%)`}
                        </div>
                      </div>

                      {activeSub.benefits ? (
                        <div style={{ marginTop: 8, color: '#444' }}>
                          <strong>Lợi ích:</strong> {activeSub.benefits}
                        </div>
                      ) : null}

                      <div style={{ marginTop: 12, textAlign: 'right' }}>
                        <Button
                          type="primary"
                          onClick={() =>
                            navigate('/subscription', {
                              state: { planId: activeSub.planId },
                            })
                          }
                        >
                          Gia hạn
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div>Chưa có gói đăng ký hoạt động</div>
                    <div style={{ marginTop: 12, textAlign: 'right' }}>
                      <Button
                        type="primary"
                        onClick={() => navigate('/subscription')}
                      >
                        Mua gói
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
