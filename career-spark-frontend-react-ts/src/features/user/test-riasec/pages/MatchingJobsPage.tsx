import {
  Card,
  Typography,
  Row,
  Col,
  Tag,
  Button,
  Drawer,
  Divider,
  Timeline,
  Empty,
  Spin,
  Space,
  Avatar,
  Progress,
} from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import useLatestSession from '../hooks/useLatestSession';

import { useRiasecRoadmap } from '../hooks/useRiasecRoadmap';
import { tokenUtils } from '@/utils/tokenUtils';

const { Title, Text } = Typography;

export default function MatchingJobsPage() {
  // Use latest session from server instead of localStorage
  const {
    data: latestSession,
    isLoading: loadingLatest,
    error: latestError,
  } = useLatestSession();

  const sessionId = latestSession?.sessionId
    ? Number(latestSession.sessionId)
    : undefined;

  const user = tokenUtils.getUserData();
  const userId = user?.sub ? Number(user.sub) : undefined;

  const { data, uiData, isLoading, error } = useRiasecRoadmap(
    sessionId,
    userId
  );

  const combinedError = error ?? latestError;

  const paths = uiData?.paths ?? [];

  const [selectedPath, setSelectedPath] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // compute aggregate info for the selected path (total weeks)
  const totalWeeks = (selectedPath?.roadmaps ?? []).reduce(
    (acc: number, r: any) => acc + (r.durationWeeks ?? 0),
    0
  );

  return (
    <div className="p-6">
      <Title level={3}>Các ngành nghề / lộ trình gợi ý</Title>
      <Text type="secondary">Chọn một ngành nghề để xem lộ trình chi tiết</Text>

      <div style={{ marginTop: 16 }}>
        <Tag color="blue">Lĩnh vực: {data?.careerField?.name ?? '—'}</Tag>
      </div>

      <div style={{ marginTop: 12 }}>
        {loadingLatest || isLoading ? (
          <Spin />
        ) : paths.length === 0 ? (
          <Empty
            description={
              combinedError ? 'Không có dữ liệu' : 'Không tìm thấy lộ trình'
            }
          />
        ) : (
          <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
            {paths.map((p) => (
              <Col xs={24} sm={12} md={8} key={p.id}>
                <Card
                  hoverable
                  onClick={() => {
                    setSelectedPath(p);
                    setDrawerOpen(true);
                  }}
                >
                  <Title level={5}>{p.title}</Title>
                  <Text type="secondary">{p.description}</Text>
                  <div style={{ marginTop: 12 }}>
                    <Button type="link">Xem lộ trình →</Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      <Drawer
        title={null}
        placement="right"
        width={760}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        bodyStyle={{ padding: 0 }}
      >
        {selectedPath ? (
          <div>
            {/* Header with gradient and meta */}
            <div
              style={{
                padding: 20,
                background:
                  'linear-gradient(135deg, rgba(58,123,213,0.12), rgba(0,210,255,0.08))',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar size={56} style={{ background: '#1890ff' }}>
                    {selectedPath.title?.charAt(0) ?? 'R'}
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <Title level={4} style={{ margin: 0 }}>
                      {selectedPath.title}
                    </Title>
                    <Text type="secondary">{selectedPath.description}</Text>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Tag color="blue">
                      {selectedPath.difficultyLevel ?? '—'}
                    </Tag>
                    <div style={{ marginTop: 6 }}>
                      <Text type="secondary">
                        <ClockCircleOutlined />{' '}
                        {totalWeeks > 0
                          ? `${totalWeeks} tuần`
                          : 'Thời lượng: —'}
                      </Text>
                    </div>
                  </div>
                </div>
              </Space>
            </div>

            <div style={{ padding: '12px 20px 20px 0' }}>
              <Divider />

              <Timeline
                mode="left"
                style={{ paddingTop: 12, marginLeft: -300, paddingLeft: 0 }}
              >
                {selectedPath.roadmaps?.map((step: any, idx: number) => (
                  <Timeline.Item
                    key={step.id}
                    label={`${step.durationWeeks ?? '-'} tuần`}
                    dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  >
                    <div
                      style={{
                        padding: 14,
                        background: '#ffffff',
                        borderRadius: 8,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        borderLeft: '4px solid rgba(24,144,255,0.08)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: 12,
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <Title level={5} style={{ margin: 0 }}>
                            {idx + 1}. {step.title}
                          </Title>
                          <div
                            style={{ marginTop: 8, color: 'rgba(0,0,0,0.65)' }}
                          >
                            {step.description}
                          </div>
                          {step.skillFocus && (
                            <div style={{ marginTop: 10 }}>
                              <Tag color="geekblue">{step.skillFocus}</Tag>
                            </div>
                          )}
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                          }}
                        >
                          <Tag>{step.difficultyLevel ?? '—'}</Tag>
                          {step.suggestedCourseUrl && (
                            <Button
                              type="link"
                              href={step.suggestedCourseUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Khóa học gợi ý →
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          </div>
        ) : (
          <div style={{ padding: 20 }}>Không có chi tiết</div>
        )}
      </Drawer>
    </div>
  );
}
