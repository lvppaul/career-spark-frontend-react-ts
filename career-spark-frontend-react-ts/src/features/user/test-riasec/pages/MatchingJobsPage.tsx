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
  Progress,
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  BookOutlined,
  RocketOutlined,
  StarOutlined,
  FireOutlined,
  BulbOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import useLatestSession from '../hooks/useLatestSession';

import { useRiasecRoadmap } from '../hooks/useRiasecRoadmap';
import { tokenUtils } from '@/utils/tokenUtils';

const { Title, Text, Paragraph } = Typography;

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

  // Helper function to get difficulty color
  const getDifficultyColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
      case 'easy':
        return '#52c41a';
      case 'intermediate':
      case 'medium':
        return '#fa8c16';
      case 'advanced':
      case 'hard':
        return '#f5222d';
      default:
        return '#1890ff';
    }
  };

  // Helper function to get difficulty icon
  const getDifficultyIcon = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
      case 'easy':
        return <StarOutlined />;
      case 'intermediate':
      case 'medium':
        return <FireOutlined />;
      case 'advanced':
      case 'hard':
        return <TrophyOutlined />;
      default:
        return <BulbOutlined />;
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)',
        minHeight: 'calc(100vh - 64px)',
        padding: '48px 24px',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header Section */}
        <Card
          bordered={false}
          style={{
            borderRadius: 16,
            marginBottom: 32,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
          }}
        >
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                }}
              >
                🎯
              </div>
              <div style={{ flex: 1 }}>
                <Title level={2} style={{ color: '#fff', margin: 0 }}>
                  Nghề nghiệp phù hợp với bạn
                </Title>
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: 16,
                  }}
                >
                  Khám phá lộ trình nghề nghiệp dựa trên kết quả test RIASEC
                </Text>
              </div>
            </div>

            {data?.careerField?.name && (
              <div style={{ marginTop: 12 }}>
                <Tag
                  color="white"
                  style={{
                    color: '#667eea',
                    fontSize: 14,
                    padding: '6px 16px',
                    borderRadius: 20,
                    fontWeight: 600,
                  }}
                >
                  <RocketOutlined style={{ marginRight: 6 }} />
                  Lĩnh vực: {data.careerField.name}
                </Tag>
              </div>
            )}
          </Space>
        </Card>

        {/* Content Section */}
        {loadingLatest || isLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 400,
            }}
          >
            <Space
              direction="vertical"
              size={16}
              style={{ textAlign: 'center' }}
            >
              <Spin size="large" />
              <Text type="secondary" style={{ fontSize: 16 }}>
                Đang tải dữ liệu...
              </Text>
            </Space>
          </div>
        ) : paths.length === 0 ? (
          <Card
            style={{
              borderRadius: 16,
              textAlign: 'center',
              padding: 48,
            }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical" size={8}>
                  <Text strong style={{ fontSize: 16 }}>
                    {combinedError
                      ? 'Không có dữ liệu'
                      : 'Chưa có lộ trình phù hợp'}
                  </Text>
                  <Text type="secondary">
                    Vui lòng hoàn thành bài test RIASEC để nhận gợi ý nghề
                    nghiệp
                  </Text>
                </Space>
              }
            />
          </Card>
        ) : (
          <>
            {/* Info Card */}
            <div
              style={{
                marginBottom: 24,
                padding: 16,
                background: '#e6f7ff',
                borderRadius: 12,
                border: '1px solid #91d5ff',
              }}
            >
              <Space>
                <BulbOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                <Text style={{ color: '#0050b3' }}>
                  💡 Chúng tôi đã tìm thấy <strong>{paths.length}</strong> lộ
                  trình nghề nghiệp phù hợp với bạn. Nhấn vào từng thẻ để xem
                  chi tiết roadmap!
                </Text>
              </Space>
            </div>

            {/* Career Cards Grid */}
            <Row gutter={[24, 24]}>
              {paths.map((p) => {
                const difficultyColor = getDifficultyColor(
                  (p as any).difficultyLevel
                );
                const totalWeeks = (p.roadmaps ?? []).reduce(
                  (acc: number, r: any) => acc + (r.durationWeeks ?? 0),
                  0
                );

                return (
                  <Col xs={24} sm={24} md={12} lg={8} key={p.id}>
                    <Card
                      hoverable
                      bordered={false}
                      onClick={() => {
                        setSelectedPath(p);
                        setDrawerOpen(true);
                      }}
                      style={{
                        borderRadius: 16,
                        height: '100%',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                      }}
                      bodyStyle={{ padding: 24 }}
                    >
                      {/* Card Header */}
                      <div style={{ marginBottom: 16 }}>
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: `linear-gradient(135deg, ${difficultyColor}22, ${difficultyColor}11)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 24,
                            marginBottom: 12,
                          }}
                        >
                          {getDifficultyIcon(
                            (p as { difficultyLevel?: string }).difficultyLevel
                          )}
                        </div>

                        <Title level={4} style={{ marginBottom: 8 }}>
                          {p.title}
                        </Title>

                        <Paragraph
                          ellipsis={{ rows: 2 }}
                          type="secondary"
                          style={{ marginBottom: 12, minHeight: 44 }}
                        >
                          {p.description}
                        </Paragraph>
                      </div>

                      <Divider style={{ margin: '16px 0' }} />

                      {/* Card Footer */}
                      <Space
                        direction="vertical"
                        size={12}
                        style={{ width: '100%' }}
                      >
                        <Row justify="space-between" align="middle">
                          <Col>
                            <Space size={4}>
                              <ClockCircleOutlined
                                style={{ color: '#8c8c8c' }}
                              />
                              <Text type="secondary" style={{ fontSize: 13 }}>
                                {totalWeeks > 0
                                  ? `${totalWeeks} tuần`
                                  : 'Chưa xác định'}
                              </Text>
                            </Space>
                          </Col>
                        </Row>

                        <Row justify="space-between" align="middle">
                          <Col>
                            <Space size={4}>
                              <BookOutlined style={{ color: '#8c8c8c' }} />
                              <Text type="secondary" style={{ fontSize: 13 }}>
                                {p.roadmaps?.length ?? 0} bước
                              </Text>
                            </Space>
                          </Col>
                          <Col>
                            <Button
                              type="link"
                              style={{
                                padding: 0,
                                height: 'auto',
                                fontWeight: 600,
                              }}
                              icon={<ArrowRightOutlined />}
                              iconPosition="end"
                            >
                              Xem chi tiết
                            </Button>
                          </Col>
                        </Row>
                      </Space>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </>
        )}
      </div>

      {/* Detailed Roadmap Drawer */}
      <Drawer
        title={null}
        placement="right"
        width={Math.min(800, window.innerWidth - 48)}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ display: 'none' }}
      >
        {selectedPath ? (
          <div>
            {/* Drawer Header */}
            <div
              style={{
                padding: 32,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                <div
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 32,
                      flexShrink: 0,
                    }}
                  >
                    {selectedPath.title?.charAt(0).toUpperCase() ?? '🎯'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Title level={3} style={{ color: '#fff', margin: 0 }}>
                      {selectedPath.title}
                    </Title>
                    <Paragraph
                      style={{
                        color: 'rgba(255,255,255,0.9)',
                        marginTop: 8,
                        marginBottom: 0,
                        fontSize: 15,
                      }}
                    >
                      {selectedPath.description}
                    </Paragraph>
                  </div>
                </div>

                {/* Meta Information */}
                <Row gutter={16} style={{ marginTop: 16 }}>
                  <Col>
                    <div
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: 8,
                      }}
                    >
                      <Space size={8}>
                        <ClockCircleOutlined />
                        <Text style={{ color: '#fff' }}>
                          <strong>{totalWeeks}</strong> tuần
                        </Text>
                      </Space>
                    </div>
                  </Col>
                  <Col>
                    <div
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: 8,
                      }}
                    >
                      <Space size={8}>
                        <BookOutlined />
                        <Text style={{ color: '#fff' }}>
                          <strong>{selectedPath.roadmaps?.length ?? 0}</strong>{' '}
                          bước
                        </Text>
                      </Space>
                    </div>
                  </Col>
                  <Col>
                    <div
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: 8,
                      }}
                    >
                      <Space size={8}>
                        {getDifficultyIcon(selectedPath.difficultyLevel)}
                        <Text style={{ color: '#fff' }}>
                          {selectedPath.difficultyLevel ?? 'Medium'}
                        </Text>
                      </Space>
                    </div>
                  </Col>
                </Row>
              </Space>
            </div>

            {/* Progress Overview
            <div style={{ padding: '24px 32px', background: '#fafafa' }}>
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Text strong>Tiến độ hoàn thành</Text>
                  <Text type="secondary">0%</Text>
                </div>
                <Progress
                  percent={0}
                  strokeColor={{
                    '0%': '#667eea',
                    '100%': '#764ba2',
                  }}
                  showInfo={false}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Bắt đầu học ngay để theo dõi tiến độ của bạn!
                </Text>
              </Space>
            </div> */}

            <Divider style={{ margin: 0 }} />

            {/* Roadmap Timeline */}
            <div style={{ padding: '32px' }}>
              <Title level={4} style={{ marginBottom: 24 }}>
                <BookOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                Lộ trình chi tiết
              </Title>

              <Timeline>
                {selectedPath.roadmaps?.map((step: any, idx: number) => {
                  const stepColor = getDifficultyColor(step.difficultyLevel);

                  return (
                    <Timeline.Item
                      key={step.id}
                      dot={
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: `${stepColor}22`,
                            border: `3px solid ${stepColor}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            color: stepColor,
                          }}
                        >
                          {idx + 1}
                        </div>
                      }
                    >
                      <Card
                        bordered={false}
                        style={{
                          marginBottom: 16,
                          borderRadius: 12,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                          borderLeft: `4px solid ${stepColor}`,
                        }}
                      >
                        <Space
                          direction="vertical"
                          size={12}
                          style={{ width: '100%' }}
                        >
                          {/* Step Header */}
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <Title level={5} style={{ marginBottom: 4 }}>
                                {step.title}
                              </Title>
                              <Text type="secondary" style={{ fontSize: 14 }}>
                                {step.description}
                              </Text>
                            </div>
                          </div>

                          <Divider style={{ margin: '8px 0' }} />

                          {/* Step Meta */}
                          <Row gutter={[12, 12]}>
                            <Col>
                              <Tag
                                icon={<ClockCircleOutlined />}
                                color="blue"
                                style={{ borderRadius: 8 }}
                              >
                                {step.durationWeeks ?? '-'} tuần
                              </Tag>
                            </Col>
                            <Col>
                              <Tag
                                icon={getDifficultyIcon(step.difficultyLevel)}
                                color={stepColor}
                                style={{ borderRadius: 8 }}
                              >
                                {step.difficultyLevel ?? 'Medium'}
                              </Tag>
                            </Col>
                            {step.skillFocus && (
                              <Col>
                                <Tag color="purple" style={{ borderRadius: 8 }}>
                                  <CheckCircleOutlined
                                    style={{ marginRight: 4 }}
                                  />
                                  {step.skillFocus}
                                </Tag>
                              </Col>
                            )}
                          </Row>

                          {/* Course Link */}
                          {step.suggestedCourseUrl && (
                            <div
                              style={{
                                padding: 12,
                                background: '#f0f5ff',
                                borderRadius: 8,
                                marginTop: 8,
                              }}
                            >
                              <Button
                                type="primary"
                                href={step.suggestedCourseUrl}
                                target="_blank"
                                rel="noreferrer"
                                icon={<BookOutlined />}
                                style={{ width: '100%' }}
                              >
                                Xem khóa học gợi ý
                              </Button>
                            </div>
                          )}
                        </Space>
                      </Card>
                    </Timeline.Item>
                  );
                })}
              </Timeline>

              {/* Footer CTA */}
              <Card
                style={{
                  marginTop: 24,
                  borderRadius: 12,
                  background:
                    'linear-gradient(135deg, #f6ffed 0%, #e6fffb 100%)',
                  border: '1px solid #b7eb8f',
                }}
              >
                <Space
                  direction="vertical"
                  size={8}
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  <div style={{ fontSize: 24 }}>🚀</div>
                  <Title level={5} style={{ margin: 0 }}>
                    Sẵn sàng bắt đầu?
                  </Title>
                  <Text type="secondary">
                    Hãy kiên trì học tập và thực hành để đạt được mục tiêu nghề
                    nghiệp của bạn!
                  </Text>
                </Space>
              </Card>
            </div>
          </div>
        ) : (
          <div style={{ padding: 32, textAlign: 'center' }}>
            <Empty description="Không có chi tiết" />
          </div>
        )}
      </Drawer>
    </div>
  );
}
