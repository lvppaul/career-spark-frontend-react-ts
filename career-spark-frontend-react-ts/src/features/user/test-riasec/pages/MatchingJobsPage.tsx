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
} from 'antd';
import { useEffect, useState } from 'react';
import useLatestSession from '../hooks/useLatestSession';
import { useLocation, useNavigate } from 'react-router-dom';
import type { SubmitResponse, RoadmapPath } from '../types';
import { useRiasecRoadmap } from '../hooks/useRiasecRoadmap';
import { tokenUtils } from '@/utils/tokenUtils';

const { Title, Text } = Typography;

export default function MatchingJobsPage() {
  const location = useLocation();
  useNavigate();
  const state = (location.state as { result?: SubmitResponse } | null) || {};

  const [result, setResult] = useState<SubmitResponse | null>(
    state.result ?? null
  );
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

  const [selectedPath, setSelectedPath] = useState<RoadmapPath | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
        title={selectedPath?.title}
        placement="right"
        width={720}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        {selectedPath ? (
          <div>
            <Text type="secondary">{selectedPath.description}</Text>
            <Divider />
            <div style={{ marginBottom: 12 }}>
              <Text strong>{selectedPath.roadmaps?.length ?? 0} bước</Text>
            </div>

            <Timeline mode="left">
              {selectedPath.roadmaps?.map((step) => (
                <Timeline.Item
                  key={step.id}
                  label={`${step.durationWeeks ?? '-'} tuần`}
                >
                  <div
                    style={{ padding: 12, background: '#fff', borderRadius: 8 }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Title level={5} style={{ margin: 0 }}>
                        {step.title}
                      </Title>
                      <Tag>{step.difficultyLevel ?? '—'}</Tag>
                    </div>
                    <div style={{ marginTop: 8 }}>{step.description}</div>
                    {step.skillFocus && (
                      <div style={{ marginTop: 8 }}>
                        <Tag color="cyan">{step.skillFocus}</Tag>
                      </div>
                    )}
                    {step.suggestedCourseUrl && (
                      <div style={{ marginTop: 8 }}>
                        <a
                          href={step.suggestedCourseUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Khóa học gợi ý
                        </a>
                      </div>
                    )}
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </div>
        ) : (
          <div>Không có chi tiết</div>
        )}
      </Drawer>
    </div>
  );
}
