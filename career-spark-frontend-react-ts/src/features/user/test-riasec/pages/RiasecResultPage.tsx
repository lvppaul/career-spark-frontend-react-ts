import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Divider,
  Button,
  Space,
  Empty,
  Tag,
  Progress,
} from 'antd';
import {
  ArrowLeftOutlined,
  RedoOutlined,
  TrophyOutlined,
  ExperimentOutlined,
  BulbOutlined,
  TeamOutlined,
  RocketOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { SubmitResponse } from '../types';
import { useLocation, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const TYPE_ORDER = [
  { key: 'Realistic', label: 'Realistic (R)', short: 'r' },
  { key: 'Investigative', label: 'Investigative (I)', short: 'i' },
  { key: 'Artistic', label: 'Artistic (A)', short: 'a' },
  { key: 'Social', label: 'Social (S)', short: 's' },
  { key: 'Enterprising', label: 'Enterprising (E)', short: 'e' },
  { key: 'Conventional', label: 'Conventional (C)', short: 'c' },
];

const PERSONALITY_DESCRIPTIONS: Record<
  string,
  {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
  }
> = {
  Realistic: {
    title: 'Người thực tế (Realistic)',
    description:
      'Thường thích hoạt động tay chân, kỹ thuật, máy móc, xây dựng. Thực tế, kiên trì và hành động hơn là nói.',
    icon: <TrophyOutlined />,
    color: '#1890ff',
    bgColor: '#e6f7ff',
  },
  Investigative: {
    title: 'Người nghiên cứu (Investigative)',
    description:
      'Thích tìm tòi, phân tích, quan sát. Có tư duy logic, tò mò, thường hứng thú với khoa học và công nghệ.',
    icon: <ExperimentOutlined />,
    color: '#722ed1',
    bgColor: '#f9f0ff',
  },
  Artistic: {
    title: 'Người sáng tạo (Artistic)',
    description:
      'Yêu cái đẹp, tự do, sáng tạo. Thường thích nghệ thuật, viết lách, thiết kế, âm nhạc, hội họa.',
    icon: <BulbOutlined />,
    color: '#fa8c16',
    bgColor: '#fff7e6',
  },
  Social: {
    title: 'Người xã hội (Social)',
    description:
      'Thân thiện, thích giúp đỡ, giao tiếp, làm việc nhóm. Hợp với giáo dục, chăm sóc, y tế, cộng đồng.',
    icon: <TeamOutlined />,
    color: '#52c41a',
    bgColor: '#f6ffed',
  },
  Enterprising: {
    title: 'Người quản lý (Enterprising)',
    description:
      'Tự tin, thích lãnh đạo, thuyết phục, kinh doanh. Có khả năng điều hành và hướng tới thành công.',
    icon: <RocketOutlined />,
    color: '#eb2f96',
    bgColor: '#fff0f6',
  },
  Conventional: {
    title: 'Người quy củ (Conventional)',
    description:
      'Ngăn nắp, tỉ mỉ, thích sắp xếp, quản lý dữ liệu, tài chính. Giỏi tổ chức và tuân thủ quy trình.',
    icon: <FileTextOutlined />,
    color: '#13c2c2',
    bgColor: '#e6fffb',
  },
};

export default function RiasecResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { result?: SubmitResponse } | undefined;

  const [result, setResult] = useState<SubmitResponse | null>(
    state?.result ?? null
  );

  // roadmap details removed from result page
  // session/user id state removed (roadmap not shown here)

  // Persist result to localStorage so page can be reloaded/bookmarked
  useEffect(() => {
    if (state?.result) {
      try {
        localStorage.setItem('riasecResult', JSON.stringify(state.result));
      } catch (e) {
        console.warn('Failed to persist riasecResult to localStorage', e);
      }
    } else {
      // try load from storage if no state provided
      try {
        const raw = localStorage.getItem('riasecResult');
        if (raw) setResult(JSON.parse(raw));
      } catch (e) {
        // parsing failed
        console.warn('Failed to parse riasecResult from localStorage', e);
      }
    }
  }, [state]);

  // roadmap not displayed on this page so we don't derive session/user here

  // roadmap removed from result page

  const scores = useMemo(() => {
    if (!result)
      return [] as Array<{
        key: string;
        label: string;
        value: number;
        normalized: number;
      }>;
    // First try to read backend normalized values; fall back to raw values if needed
    const raw = TYPE_ORDER.map((t) => {
      const short = t.short as keyof SubmitResponse; // 'r' | 'i' | ...
      const valueKey = short as keyof SubmitResponse;
      const normalizedKey1 = `${short}_Normalized` as keyof SubmitResponse;
      const normalizedKey2 = `${short}_normalized` as keyof SubmitResponse;
      const normalizedKey3 = `${short}Normalized` as keyof SubmitResponse;

      const value = Number(result[valueKey] ?? 0);
      const normalizedCandidate = Number(
        result[normalizedKey1] ??
          result[normalizedKey2] ??
          result[normalizedKey3] ??
          0
      );
      return { key: t.key, label: t.label, value, normalizedCandidate };
    });

    const anyNormalized = raw.some(
      (r) =>
        r.normalizedCandidate &&
        !Number.isNaN(r.normalizedCandidate) &&
        r.normalizedCandidate > 0
    );
    if (anyNormalized) {
      return raw.map((r) => ({
        key: r.key,
        label: r.label,
        value: r.value,
        normalized: r.normalizedCandidate,
      }));
    }

    // Fallback: compute normalized percentages from raw scores (relative to total)
    const totalRaw = raw.reduce((s, r) => s + (Number(r.value) || 0), 0) || 1;
    return raw.map((r) => ({
      key: r.key,
      label: r.label,
      value: r.value,
      normalized: (Number(r.value) / totalRaw) * 100,
    }));
  }, [result]);

  const topTypes = useMemo(() => {
    return [...scores].sort((a, b) => b.normalized - a.normalized).slice(0, 3);
  }, [scores]);

  if (!result) {
    return (
      <div
        style={{
          padding: 48,
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #f0f2f5 0%, #ffffff 100%)',
        }}
      >
        <Card style={{ maxWidth: 500, textAlign: 'center', borderRadius: 16 }}>
          <Empty
            description={
              <span style={{ fontSize: 16 }}>Không có kết quả để hiển thị</span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/test-riasec')}
            >
              Làm bài test ngay
            </Button>
          </Empty>
        </Card>
      </div>
    );
  }

  const topPersonality = PERSONALITY_DESCRIPTIONS[topTypes[0]?.key];

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
            marginBottom: 24,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
          }}
        >
          <Row justify="space-between" align="middle">
            <Col xs={24} md={16}>
              <Space direction="vertical" size={4}>
                <Title level={2} style={{ color: '#fff', margin: 0 }}>
                  🎉 Kết quả bài test RIASEC của bạn
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
                  Ngày thực hiện: {new Date().toLocaleDateString('vi-VN')}
                </Text>
              </Space>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'right', marginTop: 16 }}>
              <Space wrap>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate(-1)}
                  size="large"
                >
                  Quay lại
                </Button>
                <Button
                  icon={<RedoOutlined />}
                  onClick={() => {
                    localStorage.removeItem('riasecResult');
                    navigate('/test-riasec');
                  }}
                  size="large"
                >
                  Làm lại
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Row gutter={[24, 24]}>
          {/* Top Result Card */}
          <Col xs={24} lg={12}>
            <Card
              bordered={false}
              style={{
                borderRadius: 16,
                height: '100%',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    margin: '0 auto 16px',
                    background: topPersonality?.bgColor || '#f0f0f0',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 40,
                    color: topPersonality?.color || '#666',
                  }}
                >
                  {topPersonality?.icon}
                </div>
                <Tag
                  color={topPersonality?.color}
                  style={{ fontSize: 14, padding: '4px 12px' }}
                >
                  Tính cách nổi bật
                </Tag>
                <Title level={3} style={{ marginTop: 16, marginBottom: 8 }}>
                  {topPersonality?.title}
                </Title>
                <Text style={{ fontSize: 16, color: '#595959' }}>
                  {topPersonality?.description}
                </Text>
              </div>

              <Divider />

              {/* Top 3 Types */}
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Title level={5} style={{ marginBottom: 16 }}>
                  <CheckCircleOutlined
                    style={{ color: '#52c41a', marginRight: 8 }}
                  />
                  Top 3 tính cách của bạn
                </Title>
                {topTypes.map((type, index) => {
                  const desc = PERSONALITY_DESCRIPTIONS[type.key];
                  return (
                    <div
                      key={type.key}
                      style={{
                        padding: 16,
                        background: desc.bgColor,
                        borderRadius: 12,
                        borderLeft: `4px solid ${desc.color}`,
                      }}
                    >
                      <Row justify="space-between" align="middle">
                        <Col>
                          <Space>
                            <div
                              style={{
                                fontSize: 20,
                                color: desc.color,
                              }}
                            >
                              {desc.icon}
                            </div>
                            <div>
                              <Text strong style={{ fontSize: 16 }}>
                                {index + 1}. {type.label}
                              </Text>
                              <br />
                              <Text type="secondary" style={{ fontSize: 14 }}>
                                Điểm số: {type.value}
                              </Text>
                            </div>
                          </Space>
                        </Col>
                        <Col>
                          <Text
                            strong
                            style={{
                              fontSize: 20,
                              color: desc.color,
                            }}
                          >
                            {type.normalized.toFixed(1)}%
                          </Text>
                        </Col>
                      </Row>
                    </div>
                  );
                })}
              </Space>

              <Divider />

              <Button
                type="primary"
                size="large"
                block
                style={{
                  height: 48,
                  fontSize: 16,
                  borderRadius: 8,
                }}
                onClick={() => {
                  navigate('/matching-jobs');
                }}
              >
                🎯 Khám phá các công việc phù hợp
              </Button>
            </Card>
          </Col>

          {/* All Scores Card */}
          <Col xs={24} lg={12}>
            <Card
              bordered={false}
              style={{
                borderRadius: 16,
                height: '100%',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <Title level={4} style={{ marginBottom: 24 }}>
                📊 Chi tiết tất cả các nhóm tính cách
              </Title>

              <Space direction="vertical" size={20} style={{ width: '100%' }}>
                {scores.map((score) => {
                  const desc = PERSONALITY_DESCRIPTIONS[score.key];
                  return (
                    <div key={score.key}>
                      <Row
                        justify="space-between"
                        align="middle"
                        style={{ marginBottom: 8 }}
                      >
                        <Col>
                          <Space>
                            <div style={{ fontSize: 18, color: desc.color }}>
                              {desc.icon}
                            </div>
                            <Text strong style={{ fontSize: 15 }}>
                              {score.label}
                            </Text>
                          </Space>
                        </Col>
                        <Col>
                          <Space size={4}>
                            <Text type="secondary" style={{ fontSize: 13 }}>
                              {score.value} điểm
                            </Text>
                            <Text
                              strong
                              style={{ color: desc.color, fontSize: 15 }}
                            >
                              {score.normalized.toFixed(1)}%
                            </Text>
                          </Space>
                        </Col>
                      </Row>
                      <Progress
                        percent={score.normalized}
                        strokeColor={{
                          '0%': desc.color,
                          '100%': desc.color,
                        }}
                        showInfo={false}
                        strokeWidth={12}
                        trailColor="#f0f0f0"
                      />
                    </div>
                  );
                })}
              </Space>

              <Divider />

              <div
                style={{
                  background: '#f6ffed',
                  padding: 16,
                  borderRadius: 12,
                  border: '1px solid #b7eb8f',
                }}
              >
                <Text style={{ color: '#52c41a' }}>
                  💡 <strong>Gợi ý:</strong> Kết quả test giúp bạn hiểu rõ hơn
                  về bản thân và định hướng nghề nghiệp phù hợp. Hãy tham khảo
                  thêm các bài viết và tư vấn để phát triển sự nghiệp!
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
