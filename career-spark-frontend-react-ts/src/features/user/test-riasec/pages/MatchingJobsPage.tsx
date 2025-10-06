import { Card, Typography, Row, Col, Tag, Button } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { SubmitResponse } from '../types';

const { Title, Text } = Typography;

const JOBS_BY_TYPE: Record<string, Array<{ title: string; company: string }>> = {
  Realistic: [
    { title: 'Kỹ sư cơ khí', company: 'Công ty A' },
    { title: 'Công nhân vận hành máy', company: 'Nhà máy B' },
  ],
  Investigative: [
    { title: 'Kỹ sư dữ liệu', company: 'Startup X' },
    { title: 'Nhà phân tích nghiên cứu', company: 'Viện Y' },
  ],
  Artistic: [
    { title: 'Thiết kế đồ họa', company: 'Studio C' },
    { title: 'Nhà thiết kế UX', company: 'Agency D' },
  ],
  Social: [
    { title: 'Nhân viên tư vấn', company: 'Tổ chức E' },
    { title: 'Giáo viên', company: 'Trường F' },
  ],
  Enterprising: [
    { title: 'Nhân viên bán hàng', company: 'Công ty G' },
    { title: 'Quản lý sản phẩm', company: 'Công ty H' },
  ],
  Conventional: [
    { title: 'Kế toán', company: 'Công ty I' },
    { title: 'Nhân viên văn phòng', company: 'Công ty J' },
  ],
};

export default function MatchingJobsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as { result?: SubmitResponse } | null) || {};

  const [result, setResult] = useState<SubmitResponse | null>(state.result ?? null);

  useEffect(() => {
    if (!result) {
      try {
        const raw = localStorage.getItem('riasecResult');
        if (raw) setResult(JSON.parse(raw));
      } catch (e) {
        console.warn('Failed to load riasecResult', e);
      }
    }
  }, [result]);

  const topType = useMemo(() => {
    if (!result) return null;
    // derive top type similarly to result page logic
    const keys: Array<{ key: string; short: string }> = [
      { key: 'Realistic', short: 'r' },
      { key: 'Investigative', short: 'i' },
      { key: 'Artistic', short: 'a' },
      { key: 'Social', short: 's' },
      { key: 'Enterprising', short: 'e' },
      { key: 'Conventional', short: 'c' },
    ];
    const scores = keys.map((k) => ({ key: k.key, value: Number((result as any)[k.short] ?? 0) }));
    scores.sort((a, b) => b.value - a.value);
    return scores[0]?.key ?? null;
  }, [result]);

  if (!result) {
    return (
      <div className="p-6">
        <Card>
          <Text>Không có kết quả. Vui lòng hoàn thành bài test trước.</Text>
          <div style={{ marginTop: 12 }}>
            <Button type="primary" onClick={() => navigate('/test-riasec')}>
              Làm bài
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const jobs = topType ? JOBS_BY_TYPE[topType] ?? [] : [];

  return (
    <div className="p-6">
      <Title level={3}>Công việc phù hợp</Title>
      <Text type="secondary">Dựa trên kết quả bài test của bạn</Text>

      <div style={{ marginTop: 16 }}>
        <Tag color="blue">Lĩnh vực gợi ý: {topType}</Tag>
      </div>

      <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
        {jobs.map((j, idx) => (
          <Col xs={24} sm={12} md={8} key={idx}>
            <Card hoverable>
              <Title level={5}>{j.title}</Title>
              <Text type="secondary">{j.company}</Text>
              <div style={{ marginTop: 12 }}>
                <Button type="primary" onClick={() => navigate('/test-riasec/result')}>
                  Xem chi tiết lộ trình
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
