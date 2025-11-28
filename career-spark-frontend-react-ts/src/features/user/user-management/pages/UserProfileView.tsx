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
import type { ActiveSubscription } from '@/features/subscription/services/userSubscriptionService';

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

  const computeSubscriptionPercent = React.useCallback(
    (sub: ActiveSubscription | null) => {
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
        const pct = Math.round(
          (sub.remainingDays / sub.planDurationDays) * 100
        );
        return Math.max(0, Math.min(100, pct));
      }

      return 0;
    },
    []
  );

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

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Spin size="large" />
          <Text className="text-gray-600">
            Đang tải thông tin người dùng...
          </Text>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">❌</span>
            </div>
            <Text className="text-gray-600 text-lg">
              Người dùng không tồn tại
            </Text>
          </div>
        </div>
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

      {/* Subscription Section */}
      {String(authUser?.sub) === String(id) && (
        <div
          style={{
            maxWidth: 1200,
            width: 'min(1200px, 98%)',
            marginTop: 30,
          }}
        >
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <Title level={4} className="!mb-0">
                Gói đăng ký hiện tại
              </Title>
            </div>

            {loadingSub ? (
              <div className="flex items-center justify-center py-12">
                <Spin size="large" />
              </div>
            ) : activeSub ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-gray-800">
                        {activeSub.planName}
                      </div>
                      {isExpired ? (
                        <Badge
                          status="error"
                          text="Đã hết hạn"
                          className="text-lg"
                        />
                      ) : (
                        <Badge
                          status="success"
                          text="Đang hoạt động"
                          className="text-lg"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="text-sm text-gray-500">Cấp độ</div>
                          <div className="font-medium text-gray-800">
                            {activeSub.level}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="text-sm text-gray-500">Thời gian</div>
                          <div className="font-medium text-gray-800">
                            {new Date(activeSub.startDate).toLocaleDateString(
                              'vi-VN'
                            )}{' '}
                            →{' '}
                            {new Date(activeSub.endDate).toLocaleDateString(
                              'vi-VN'
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Thời gian còn lại
                        </span>
                        <span className="text-sm text-gray-500">
                          {percentRemaining}%
                        </span>
                      </div>
                      <Progress
                        percent={percentRemaining}
                        status={isExpired ? 'exception' : 'active'}
                        strokeColor={
                          isExpired
                            ? '#ef4444'
                            : { '0%': '#3b82f6', '100%': '#6366f1' }
                        }
                      />
                      <div className="text-sm text-gray-600 mt-2">
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
                            } ngày`}
                      </div>
                    </div>

                    {activeSub.benefits && (
                      <div className="bg-white rounded-xl p-4 border border-blue-100">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          Lợi ích gói:
                        </div>
                        <div className="text-gray-600">
                          {activeSub.benefits}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-3">
                    <Button
                      type="primary"
                      size="large"
                      onClick={() =>
                        navigate('/subscription', {
                          state: { planId: activeSub.planId },
                        })
                      }
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 border-none hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      {isExpired ? 'Gia hạn ngay' : 'Nâng cấp gói'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-3xl">💎</span>
                </div>
                <div className="text-xl font-medium text-gray-800 mb-2">
                  Chưa có gói đăng ký
                </div>
                <div className="text-gray-500 mb-6">
                  Nâng cấp tài khoản để trải nghiệm đầy đủ tính năng
                </div>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate('/subscription')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 border-none hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Mua gói ngay
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
