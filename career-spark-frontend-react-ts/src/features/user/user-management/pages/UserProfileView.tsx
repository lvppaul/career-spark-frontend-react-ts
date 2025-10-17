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
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useUser } from '../hooks/useUser';
import { getSessionsByUser } from '../../test-riasec/services/testRiasecService';
import type { SessionSummary } from '../../test-riasec/types';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

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
          paddingBottom: 24,
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
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: 80, // giảm padding trên
        paddingBottom: 0, // bỏ padding dưới
        paddingLeft: 12,
        paddingRight: 12,
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
            padding: 24,
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
                onClick={() => navigate(`/profile/edit`)}
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
            padding: 16,
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
    </div>
  );
}
