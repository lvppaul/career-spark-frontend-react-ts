import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Progress,
  Divider,
  List,
  Button,
  Space,
  Empty,
  Tag,
} from 'antd';
import type { SubmitResponse } from '../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, RedoOutlined } from '@ant-design/icons';
import { Drawer, Spin, Alert } from 'antd';
import { useRiasecRoadmap } from '../hooks/useRiasecRoadmap';
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

  const [showRoadmap, setShowRoadmap] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // Persist result to localStorage so page can be reloaded/bookmarked
  useEffect(() => {
    if (state?.result) {
      try {
        localStorage.setItem('riasecResult', JSON.stringify(state.result));
      } catch {}
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

  // derive sessionId and userId from local storage / token
  useEffect(() => {
    try {
      const raw = localStorage.getItem('riasecSession');
      if (raw) {
        const s = JSON.parse(raw);
        if (s && s.sessionId) setSessionId(Number(s.sessionId));
      }
    } catch (e) {
      // ignore
    }

    const user = tokenUtils.getUserData();
    if (user && user.sub) setUserId(Number(user.sub));
  }, []);

  // hook to fetch roadmap (will only fetch when both ids present)
  const {
    data: roadmap,
    isLoading: roadmapLoading,
    error: roadmapError,
  } = useRiasecRoadmap(sessionId ?? undefined, userId ?? undefined);

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
              <Button onClick={() => setShowRoadmap(true)}>
                Xem chi tiết lộ trình
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
          <Col xs={24} md={10}>
            <Card bordered={false}>
              <Title level={5}>Xếp hạng chính</Title>
              <div className="mb-4">
                {topTypes.map((t) => (
                  <Tag key={t.key} color="blue" style={{ marginBottom: 8 }}>
                    {t.label}
                  </Tag>
                ))}
              </div>

              <Title level={5}>Điểm theo nhóm</Title>
              <div>
                {scores.map((s) => (
                  <div key={s.key} className="mb-3">
                    <Text strong>{s.label}</Text>
                    <div className="flex items-center">
                      <div style={{ flex: 1, marginRight: 12 }}>
                        <Progress
                          showInfo={false}
                          percent={Number(s.normalized.toFixed(1))}
                          status="active"
                        />
                      </div>
                      <div style={{ width: 110, textAlign: 'right' }}>
                        <Text>{Number(s.normalized.toFixed(1))}%</Text>
                        <div
                          style={{ fontSize: 12, color: '#888' }}
                        >{`(${s.value})`}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>

          <Col xs={24} md={14}>
            <Card bordered={false} className="mb-4">
              <Title level={5}>Nhận xét tính cách</Title>
              {topTypes.length > 0 ? (
                <div>
                  <Text strong>
                    {PERSONALITY_DESCRIPTIONS[topTypes[0].key].title}
                  </Text>
                  <p>{PERSONALITY_DESCRIPTIONS[topTypes[0].key].description}</p>
                </div>
              ) : (
                <Text>Không có dữ liệu để nhận xét.</Text>
              )}
            </Card>
            <Card bordered={false}>
              <Title level={5}>Gợi ý ngành nghề</Title>
              {result.suggestedCareerFields &&
              result.suggestedCareerFields.length > 0 ? (
                <List
                  itemLayout="vertical"
                  dataSource={result.suggestedCareerFields}
                  renderItem={(item) => (
                    <List.Item key={item.id}>
                      <List.Item.Meta
                        title={<Text strong>{item.name}</Text>}
                        description={<div>{item.description}</div>}
                      />
                      {/* details field not present in SuggestedCareerField; render description above */}
                    </List.Item>
                  )}
                />
              ) : (
                <Text>Không có gợi ý ngành nghề.</Text>
              )}
              {/* Button to show detailed roadmap for the strongest field */}
              <div className="mt-4">
                <Button type="primary" onClick={() => setShowRoadmap(true)}>
                  Xem chi tiết lộ trình
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
      <Drawer
        title="Chi tiết lộ trình phát triển"
        open={showRoadmap}
        onClose={() => setShowRoadmap(false)}
        width={720}
      >
        {roadmapLoading && (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        )}

        {roadmapError && (
          <Alert
            type="error"
            message="Không thể tải lộ trình"
            description={String(roadmapError.message)}
          />
        )}

        {roadmap && (
          <div>
            <div className="mb-4">
              <Text strong>Ngành mạnh: </Text>
              <Text>{roadmap.careerField}</Text>
            </div>

            {roadmap.paths.map((p, idx) => (
              <Card key={idx} size="small" className="mb-4">
                <Title level={5}>{p.title}</Title>
                {p.description && <Text>{p.description}</Text>}

                {p.milestones && p.milestones.length > 0 && (
                  <List
                    dataSource={p.milestones}
                    renderItem={(m) => (
                      <List.Item>
                        <List.Item.Meta
                          title={<Text strong>{m.title}</Text>}
                          description={<div>{m.description}</div>}
                        />
                        {m.suggestedCourseUrl && (
                          <a
                            href={m.suggestedCourseUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Khóa học gợi ý
                          </a>
                        )}
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  );
}
