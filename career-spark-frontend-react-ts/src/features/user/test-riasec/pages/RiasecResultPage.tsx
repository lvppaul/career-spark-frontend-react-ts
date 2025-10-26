import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Divider,
  // List removed (not used on result page)
  Button,
  Space,
  Empty,
  Tag,
} from 'antd';
import type { SubmitResponse } from '../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, RedoOutlined } from '@ant-design/icons';
// roadmap details removed from result page
import { tokenUtils } from '@/utils/tokenUtils';

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
  { title: string; description: string }
> = {
  Realistic: {
    title: 'Người thực tế (Realistic)',
    description:
      'Thường thích hoạt động tay chân, kỹ thuật, máy móc, xây dựng. Thực tế, kiên trì và hành động hơn là nói.',
  },
  Investigative: {
    title: 'Người nghiên cứu (Investigative)',
    description:
      'Thích tìm tòi, phân tích, quan sát. Có tư duy logic, tò mò, thường hứng thú với khoa học và công nghệ.',
  },
  Artistic: {
    title: 'Người sáng tạo (Artistic)',
    description:
      'Yêu cái đẹp, tự do, sáng tạo. Thường thích nghệ thuật, viết lách, thiết kế, âm nhạc, hội họa.',
  },
  Social: {
    title: 'Người xã hội (Social)',
    description:
      'Thân thiện, thích giúp đỡ, giao tiếp, làm việc nhóm. Hợp với giáo dục, chăm sóc, y tế, cộng đồng.',
  },
  Enterprising: {
    title: 'Người quản lý (Enterprising)',
    description:
      'Tự tin, thích lãnh đạo, thuyết phục, kinh doanh. Có khả năng điều hành và hướng tới thành công.',
  },
  Conventional: {
    title: 'Người quy củ (Conventional)',
    description:
      'Ngăn nắp, tỉ mỉ, thích sắp xếp, quản lý dữ liệu, tài chính. Giỏi tổ chức và tuân thủ quy trình.',
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
      <div className="p-6">
        <Card>
          <Empty description={<span>Không có kết quả để hiển thị</span>}>
            <Button type="primary" onClick={() => navigate('/test-riasec')}>
              Làm bài ngay
            </Button>
          </Empty>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              Kết quả bài test RIASEC
            </Title>
            <Text type="secondary">Ngày: {new Date().toLocaleString()}</Text>
          </Col>
          <Col>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                Quay lại
              </Button>
              <Button
                icon={<RedoOutlined />}
                onClick={() => {
                  // clear persisted result and retake
                  localStorage.removeItem('riasecResult');
                  navigate('/test-riasec');
                }}
              >
                Làm lại
              </Button>
            </Space>
          </Col>
        </Row>

        <Divider />

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Card bordered={false} className="mb-4">
              <Title level={5}>Nhận xét tính cách</Title>
              {topTypes.length > 0 ? (
                <div>
                  <Text strong>
                    {PERSONALITY_DESCRIPTIONS[topTypes[0].key].title}
                  </Text>
                  <p>{PERSONALITY_DESCRIPTIONS[topTypes[0].key].description}</p>
                  <div className="mt-4">
                    <Text>Phù hợp với lĩnh vực: </Text>
                    <Tag color="blue">{topTypes[0].label}</Tag>
                  </div>

                  <div className="mt-4">
                    <Button
                      type="primary"
                      onClick={() => {
                        // If user has a subscription level > 0, allow access to matching jobs
                        const level = tokenUtils.getSubscriptionLevel();
                        if (level && level > 0) {
                          navigate('/matching-jobs');
                        } else {
                          // Otherwise send them to subscription page
                          navigate('/subscription');
                        }
                      }}
                    >
                      Các công việc phù hợp
                    </Button>
                  </div>
                </div>
              ) : (
                <Text>Không có dữ liệu để nhận xét.</Text>
              )}
            </Card>
          </Col>
        </Row>

        {/* Previously displayed a modal with demo purchase options; now use /subscription page */}
      </Card>
      {/* Roadmap removed from this page */}
    </div>
  );
}
