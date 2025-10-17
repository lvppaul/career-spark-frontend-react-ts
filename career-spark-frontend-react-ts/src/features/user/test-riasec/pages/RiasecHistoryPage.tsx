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
} from 'antd';
import {
  FileTextOutlined,
  EyeOutlined,
  CheckOutlined,
} from '@ant-design/icons';
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
                    className="group rounded-md border border-transparent px-10 py-4 mb-4 transition-all hover:shadow-sm hover:border-[#1b61fc] hover:bg-blue-50/20"
                    actions={[
                      <div key="view" className="flex items-center">
                        <button
                          onClick={() => openDetail(s!.sessionId)}
                          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-transparent transition-colors"
                          aria-label={`Xem chi tiết lần ${s!.sessionId}`}
                        >
                          <EyeOutlined className="text-gray-600 group-hover:text-[#1b61fc] transition-colors" />
                        </button>
                      </div>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<FileTextOutlined />}
                          style={{ backgroundColor: '#1b61fc', color: '#fff' }}
                        />
                      }
                      title={<Text strong>Lần {s!.sessionId}</Text>}
                      description={new Date(s!.startAt).toLocaleString()}
                    />
                  </List.Item>
                )}
              />
            )}
          </div>
        )}

        <Drawer
          title={detail ? `Lần ${detail.sessionId}` : 'Chi tiết phiên'}
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
                            {a.questionContent}{' '}
                            {a.isSelected ? (
                              <Tag color="green" icon={<CheckOutlined />}></Tag>
                            ) : (
                              <div></div>
                            )}
                          </div>
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
