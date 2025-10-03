import { useMemo, useState } from 'react';
import {
  Card,
  List,
  Spin,
  Alert,
  Typography,
  Button,
  Avatar,
  Tag,
  Drawer,
  Divider,
  Space,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import useRiasecSessions from '../hooks/useRiasecSessions';
import { tokenUtils } from '@/utils/tokenUtils';
import service from '../services/testRiasecService';
import type { TestHistory, HistoryAnswer } from '../types';

const { Title, Text } = Typography;

export default function RiasecHistoryPage() {
  const navigate = useNavigate();
  const user = tokenUtils.getUserData();
  const userId = user?.sub ? Number(user.sub) : undefined;

  const { data, isLoading, error } = useRiasecSessions(userId);

  const sessions = useMemo(() => data ?? [], [data]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<TestHistory | null>(null);

  async function openDetail(sessionId: number) {
    if (!userId) return;
    setDrawerOpen(true);
    setDetailLoading(true);
    setDetail(null);
    try {
      const d = await service.getTestDetail(sessionId, userId);
      setDetail(d);
    } catch (e) {
      console.error('Failed to load session detail', e);
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <div className="p-6">
      <Card bodyStyle={{ minHeight: 360 }}>
        <Title level={3}>Lịch sử bài test RIASEC</Title>

        {isLoading && (
          <div className="py-8 flex justify-center">
            <Spin />
          </div>
        )}

        {error && (
          <Alert
            type="error"
            message="Không thể tải lịch sử"
            description={String(error.message)}
          />
        )}

        {!isLoading && !error && (
          <div>
            {sessions.length === 0 ? (
              <div>
                <Text>Không tìm thấy lịch sử nào.</Text>
                <div className="mt-4">
                  <Button
                    type="primary"
                    onClick={() => navigate('/test-riasec')}
                  >
                    Làm bài ngay
                  </Button>
                </div>
              </div>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={sessions}
                pagination={{ pageSize: 6 }}
                renderItem={(s) => (
                  <List.Item
                    key={s!.sessionId}
                    actions={[
                      <Button
                        key="view"
                        onClick={() => openDetail(s!.sessionId)}
                      >
                        Xem chi tiết
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar>{String(s!.sessionId).slice(-1)}</Avatar>}
                      title={<Text strong>Phiên #{s!.sessionId}</Text>}
                      description={new Date(s!.startAt).toLocaleString()}
                    />
                    <div style={{ minWidth: 180, textAlign: 'right' }}>
                      <Space direction="vertical" align="end">
                        <Tag color="blue">RIASEC</Tag>
                      </Space>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </div>
        )}

        <Drawer
          title={detail ? `Phiên ${detail.sessionId}` : 'Chi tiết phiên'}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={700}
        >
          {detailLoading && (
            <div className="py-6 flex justify-center">
              <Spin />
            </div>
          )}

          {!detailLoading && detail && (
            <div>
              <Text strong>Ngày bắt đầu: </Text>
              <Text>{new Date(detail.startAt).toLocaleString()}</Text>
              <Divider />

              <div>
                <Text strong>Danh sách câu trả lời</Text>
                <List
                  dataSource={detail.answers}
                  renderItem={(a: HistoryAnswer) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <div>
                            <Tag>{a.questionType}</Tag> {a.questionContent}
                          </div>
                        }
                        description={
                          a.isSelected ? (
                            <Tag color="green">Đã chọn</Tag>
                          ) : (
                            <Tag>Không chọn</Tag>
                          )
                        }
                      />
                    </List.Item>
                  )}
                />
              </div>
            </div>
          )}
        </Drawer>
      </Card>
    </div>
  );
}
