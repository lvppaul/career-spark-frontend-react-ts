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
        minHeight: 'calc(100vh - 80px)',
        paddingTop: 24,
        paddingBottom: 24,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          width: 'min(1100px, 95%)',
          display: 'flex',
          gap: 24,
        }}
      >
        <Card style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Avatar size={96} src={data.avatarURL ?? undefined}>
              {data.name?.[0]}
            </Avatar>
            <div style={{ flex: 1 }}>
              <Title level={4}>{data.name}</Title>
              <Text type="secondary">{data.email}</Text>
            </div>
            <div>
              <Button
                icon={<EditOutlined />}
                onClick={() => navigate(`/profile/edit`)}
              >
                Chỉnh sửa
              </Button>
            </div>
          </div>

          <Descriptions column={1} style={{ marginTop: 24 }}>
            <Descriptions.Item label="Số điện thoại">
              {data.phone ?? 'Chưa có'}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">{data.role}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {data.isActive ? 'Hoạt động' : 'Không hoạt động'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {new Date(data.createdAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card style={{ width: 360 }} title="Bài test đã làm">
          <List
            loading={loadingSessions}
            dataSource={sessions || []}
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
