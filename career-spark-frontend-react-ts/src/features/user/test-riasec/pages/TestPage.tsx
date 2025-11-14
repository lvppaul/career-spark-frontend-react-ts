import { useMemo, useState } from 'react';
import {
  Card,
  Button,
  Checkbox,
  Space,
  Typography,
  message,
  Modal,
  Progress,
  Row,
  Col,
} from 'antd';
import {
  CheckCircleOutlined,
  TrophyOutlined,
  ExperimentOutlined,
  BulbOutlined,
  TeamOutlined,
  RocketOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useRiasecTest } from '../hooks/useRiasecTest';
import { useStartRiasecTest } from '../hooks/useStartRiasecTest';
import { useSubmitRiasecTest } from '../hooks/useSubmitRiasecTest';
import { tokenUtils } from '@/utils/tokenUtils';
import type { RiasecQuestion } from '../types';

const { Title, Text } = Typography;

const TYPE_ORDER: Array<{
  key: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}> = [
  {
    key: 'Realistic',
    label: 'Realistic (R)',
    icon: <TrophyOutlined />,
    color: '#1890ff',
    bgColor: '#e6f7ff',
  },
  {
    key: 'Investigative',
    label: 'Investigative (I)',
    icon: <ExperimentOutlined />,
    color: '#722ed1',
    bgColor: '#f9f0ff',
  },
  {
    key: 'Artistic',
    label: 'Artistic (A)',
    icon: <BulbOutlined />,
    color: '#fa8c16',
    bgColor: '#fff7e6',
  },
  {
    key: 'Social',
    label: 'Social (S)',
    icon: <TeamOutlined />,
    color: '#52c41a',
    bgColor: '#f6ffed',
  },
  {
    key: 'Enterprising',
    label: 'Enterprising (E)',
    icon: <RocketOutlined />,
    color: '#eb2f96',
    bgColor: '#fff0f6',
  },
  {
    key: 'Conventional',
    label: 'Conventional (C)',
    icon: <FileTextOutlined />,
    color: '#13c2c2',
    bgColor: '#e6fffb',
  },
];

export default function TestPage() {
  const navigate = useNavigate();
  const { data: questions, isLoading, error, refresh } = useRiasecTest();

  // Initialize state from localStorage if available (restored after login)
  const [currentTypeIndex, setCurrentTypeIndex] = useState(() => {
    const saved = localStorage.getItem('riasecTestProgress');
    if (saved) {
      try {
        const { currentTypeIndex: savedIndex, timestamp } = JSON.parse(saved);
        // Only restore if saved within last 24 hours
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          return savedIndex;
        }
      } catch (e) {
        console.error('Error parsing saved progress:', e);
      }
    }
    return 0;
  });

  const [selected, setSelected] = useState<Record<number, boolean>>(() => {
    const saved = localStorage.getItem('riasecTestProgress');
    if (saved) {
      try {
        const { selected: savedSelected, timestamp } = JSON.parse(saved);
        // Only restore if saved within last 24 hours
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          message.info('Đã khôi phục tiến trình làm bài của bạn');
          return savedSelected;
        }
      } catch (e) {
        console.error('Error parsing saved progress:', e);
      }
    }
    return {};
  });

  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const { start, isLoading: isStarting } = useStartRiasecTest();
  const { submit, isLoading: isSubmittingRemote } = useSubmitRiasecTest();

  const grouped = useMemo(() => {
    const map = new Map<string, RiasecQuestion[]>();
    if (!questions) return map;
    for (const q of questions) {
      const arr = map.get(q.questionType) ?? [];
      arr.push(q);
      map.set(q.questionType, arr);
    }
    return map;
  }, [questions]);

  const currentType = TYPE_ORDER[currentTypeIndex];
  const currentQuestions = grouped.get(currentType.key) ?? [];

  const selectedCount = Object.values(selected).filter(Boolean).length;

  function toggleQuestion(id: number) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function goNext() {
    setCurrentTypeIndex((i: number) => Math.min(TYPE_ORDER.length - 1, i + 1));
  }

  function goPrev() {
    setCurrentTypeIndex((i: number) => Math.max(0, i - 1));
  }

  async function handleSubmit() {
    // Check if user is authenticated with valid token
    const isAuthenticated = tokenUtils.isAuthenticated();
    const user = tokenUtils.getUserData();

    if (!isAuthenticated || !user || !user.sub) {
      // Show warning message
      message.warning('Bạn cần đăng nhập để nộp bài test và xem kết quả!', 3);

      // Save current selections to localStorage before navigating
      localStorage.setItem(
        'riasecTestProgress',
        JSON.stringify({
          selected,
          currentTypeIndex,
          timestamp: Date.now(),
        })
      );

      // Show custom login modal
      setLoginModalOpen(true);
      return;
    }

    // Prevent submit when no selections
    if (Object.values(selected).filter(Boolean).length === 0) {
      message.warning(
        'Bạn chưa chọn câu nào. Vui lòng chọn ít nhất một câu trước khi nộp.'
      );
      return;
    }

    setSubmitting(true);
    try {
      // Build answers array for all questions: unchecked -> false
      const answers = (questions ?? []).map((q) => ({
        questionId: Number(q.id),
        isSelected: Boolean(selected[q.id]),
      }));

      const userId = Number(user.sub);

      // Start test session
      const session = await start(userId);
      if (!session || !session.sessionId) {
        throw new Error('Không thể tạo phiên làm bài');
      }

      // Submit answers with sessionId
      const payload = {
        userId,
        sessionId: session.sessionId,
        answers,
      };

      const result = await submit(payload);
      message.success('Nộp bài thành công');
      // Store session locally for history access
      localStorage.setItem('riasecSession', JSON.stringify(session));
      // Clear saved progress after successful submission
      localStorage.removeItem('riasecTestProgress');
      console.log('RIASEC submit result:', result);
      // Navigate to result view after successful submit
      navigate('/test-riasec/result', { state: { result } });
    } catch (err) {
      console.error('Submit failed', err);
      const msg = err instanceof Error ? err.message : 'Nộp thất bại';
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function onConfirmSubmit() {
    // Close modal
    setConfirmOpen(false);
    // Run submit (authentication check is inside handleSubmit)
    void handleSubmit();
  }

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #f0f2f5 0%, #ffffff 100%)',
        }}
      >
        <Card style={{ textAlign: 'center', borderRadius: 16, minWidth: 300 }}>
          <Space direction="vertical" size={16}>
            <div style={{ fontSize: 40 }}>📝</div>
            <Text style={{ fontSize: 16 }}>Đang tải câu hỏi...</Text>
          </Space>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #f0f2f5 0%, #ffffff 100%)',
          padding: 24,
        }}
      >
        <Card style={{ textAlign: 'center', borderRadius: 16, maxWidth: 500 }}>
          <Space direction="vertical" size={16}>
            <div style={{ fontSize: 40 }}>❌</div>
            <Title level={4}>Không thể tải câu hỏi</Title>
            <Text type="secondary">{String(error.message)}</Text>
            <Button type="primary" size="large" onClick={refresh}>
              Thử lại
            </Button>
          </Space>
        </Card>
      </div>
    );
  }

  const progressPercent = ((currentTypeIndex + 1) / TYPE_ORDER.length) * 100;

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)',
        minHeight: 'calc(100vh - 64px)',
        padding: '24px',
      }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Header Card */}
        <Card
          bordered={false}
          style={{
            borderRadius: 16,
            marginBottom: 24,
            background: `linear-gradient(135deg, ${currentType.color} 0%, ${currentType.color}dd 100%)`,
            color: '#fff',
          }}
        >
          <Row justify="space-between" align="middle">
            <Col xs={24} md={16}>
              <Space direction="vertical" size={4}>
                <Title level={2} style={{ color: '#fff', margin: 0 }}>
                  Bài test RIASEC
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
                  Khám phá tính cách và định hướng nghề nghiệp của bạn
                </Text>
              </Space>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'right', marginTop: 16 }}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '12px 20px',
                  borderRadius: 12,
                  display: 'inline-block',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 14 }}>Tiến độ</Text>
                <div style={{ marginTop: 8 }}>
                  <Progress
                    percent={progressPercent}
                    strokeColor="#fff"
                    trailColor="rgba(255,255,255,0.3)"
                    showInfo={false}
                    strokeWidth={8}
                  />
                </div>
                <Text style={{ color: '#fff', fontSize: 12 }}>
                  {currentTypeIndex + 1} / {TYPE_ORDER.length} phần
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Steps Navigation */}
        <Card
          bordered={false}
          style={{
            borderRadius: 16,
            marginBottom: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <Row gutter={[8, 8]}>
            {TYPE_ORDER.map((t, index) => {
              const isActive = index === currentTypeIndex;
              const isDone = index < currentTypeIndex;
              return (
                <Col xs={12} sm={8} md={4} key={t.key}>
                  <div
                    style={{
                      padding: '12px 8px',
                      borderRadius: 8,
                      textAlign: 'center',
                      background: isActive
                        ? t.bgColor
                        : isDone
                          ? '#f0f0f0'
                          : '#fafafa',
                      border: `2px solid ${isActive ? t.color : isDone ? '#d9d9d9' : '#f0f0f0'}`,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                    onClick={() => setCurrentTypeIndex(index)}
                  >
                    <div
                      style={{
                        fontSize: 20,
                        color: isActive
                          ? t.color
                          : isDone
                            ? '#52c41a'
                            : '#bfbfbf',
                        marginBottom: 4,
                      }}
                    >
                      {isDone ? <CheckCircleOutlined /> : t.icon}
                    </div>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? t.color : '#595959',
                      }}
                    >
                      {t.label}
                    </Text>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Card>

        {/* Current Type Card */}
        <Card
          bordered={false}
          style={{
            borderRadius: 16,
            marginBottom: 24,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
        >
          {/* Type Header */}
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: currentType.bgColor,
              marginBottom: 24,
              borderLeft: `4px solid ${currentType.color}`,
            }}
          >
            <Space size={12}>
              <div
                style={{
                  fontSize: 32,
                  color: currentType.color,
                }}
              >
                {currentType.icon}
              </div>
              <div>
                <Title
                  level={4}
                  style={{ margin: 0, color: currentType.color }}
                >
                  {currentType.label}
                </Title>
                <Text type="secondary">Chọn các câu hỏi phù hợp với bạn</Text>
              </div>
            </Space>
          </div>

          {/* Questions List */}
          {currentQuestions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
              <Text type="secondary">Không có câu hỏi cho loại này</Text>
            </div>
          ) : (
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              {currentQuestions.map((q, index) => {
                const isSelected = Boolean(selected[q.id]);
                return (
                  <Card
                    key={q.id}
                    size="small"
                    hoverable
                    onClick={() => toggleQuestion(q.id)}
                    style={{
                      cursor: 'pointer',
                      borderColor: isSelected ? currentType.color : '#f0f0f0',
                      background: isSelected ? currentType.bgColor : '#fff',
                      borderWidth: 2,
                      transition: 'all 0.3s',
                    }}
                    bodyStyle={{ padding: '16px 20px' }}
                  >
                    <Row justify="space-between" align="middle">
                      <Col flex="auto">
                        <Space size={12}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: isSelected
                                ? currentType.color
                                : '#f0f0f0',
                              color: isSelected ? '#fff' : '#595959',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 600,
                              fontSize: 14,
                            }}
                          >
                            {index + 1}
                          </div>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: isSelected ? 500 : 400,
                              color: isSelected ? currentType.color : '#262626',
                            }}
                          >
                            {q.content}
                          </Text>
                        </Space>
                      </Col>
                      <Col>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleQuestion(q.id)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            transform: 'scale(1.2)',
                          }}
                        />
                      </Col>
                    </Row>
                  </Card>
                );
              })}
            </Space>
          )}

          {/* Selected Count */}
          <div
            style={{
              marginTop: 24,
              padding: 16,
              background: '#f6ffed',
              borderRadius: 8,
              border: '1px solid #b7eb8f',
            }}
          >
            <Row justify="space-between" align="middle">
              <Col>
                <Space>
                  <CheckCircleOutlined
                    style={{ color: '#52c41a', fontSize: 18 }}
                  />
                  <Text strong>Đã chọn:</Text>
                  <Text
                    style={{ fontSize: 18, fontWeight: 700, color: '#52c41a' }}
                  >
                    {selectedCount}
                  </Text>
                  <Text type="secondary">/ {questions?.length || 0} câu</Text>
                </Space>
              </Col>
            </Row>
          </div>
        </Card>

        {/* Navigation Buttons */}
        <Card
          bordered={false}
          style={{
            borderRadius: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Button
                size="large"
                onClick={goPrev}
                disabled={currentTypeIndex === 0}
                icon={<ArrowLeftOutlined />}
                style={{ height: 48, minWidth: 120 }}
              >
                Quay lại
              </Button>
            </Col>

            <Col>
              {currentTypeIndex < TYPE_ORDER.length - 1 ? (
                <Button
                  type="primary"
                  size="large"
                  onClick={goNext}
                  icon={<ArrowRightOutlined />}
                  iconPosition="end"
                  style={{
                    height: 48,
                    minWidth: 120,
                    background: currentType.color,
                    borderColor: currentType.color,
                  }}
                >
                  Tiếp theo
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    if (selectedCount === 0) {
                      message.warning(
                        'Bạn chưa chọn câu nào. Vui lòng chọn ít nhất một câu trước khi nộp.'
                      );
                      return;
                    }
                    setConfirmOpen(true);
                  }}
                  loading={submitting || isStarting || isSubmittingRemote}
                  disabled={
                    selectedCount === 0 ||
                    submitting ||
                    isStarting ||
                    isSubmittingRemote
                  }
                  icon={<SendOutlined />}
                  style={{
                    height: 48,
                    minWidth: 140,
                    fontSize: 16,
                    fontWeight: 600,
                    background:
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderColor: 'transparent',
                  }}
                >
                  Nộp bài
                </Button>
              )}
            </Col>
          </Row>
        </Card>

        {/* Confirm Modal */}
        <Modal
          title={
            <Space>
              <SendOutlined style={{ color: '#1890ff' }} />
              <span>Xác nhận nộp bài</span>
            </Space>
          }
          open={confirmOpen}
          onOk={onConfirmSubmit}
          onCancel={() => setConfirmOpen(false)}
          okText="Nộp bài"
          cancelText="Kiểm tra lại"
          okButtonProps={{
            size: 'large',
            style: {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderColor: 'transparent',
            },
          }}
          cancelButtonProps={{ size: 'large' }}
        >
          <div style={{ padding: '16px 0' }}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <div
                style={{
                  padding: 16,
                  background: '#e6f7ff',
                  borderRadius: 8,
                  border: '1px solid #91d5ff',
                }}
              >
                <Text>
                  ℹ️ Bạn đã chọn <strong>{selectedCount}</strong> câu hỏi.
                </Text>
              </div>
              <Text>
                Bạn có chắc chắn muốn nộp bài không? Sau khi nộp, bạn sẽ nhận
                được kết quả phân tích tính cách và gợi ý nghề nghiệp phù hợp.
              </Text>
            </Space>
          </div>
        </Modal>

        {/* Login Required Modal */}
        <Modal
          title={
            <Space>
              <div
                style={{
                  fontSize: 24,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                ⚠️
              </div>
              <span style={{ fontSize: 18, fontWeight: 600 }}>
                Yêu cầu đăng nhập
              </span>
            </Space>
          }
          open={loginModalOpen}
          onOk={() => {
            setLoginModalOpen(false);
            navigate('/login', { state: { from: '/test-riasec' } });
          }}
          onCancel={() => setLoginModalOpen(false)}
          okText="Đăng nhập ngay"
          cancelText="Để sau"
          width={520}
          okButtonProps={{
            size: 'large',
            style: {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderColor: 'transparent',
              height: 48,
              fontSize: 16,
              fontWeight: 600,
            },
          }}
          cancelButtonProps={{
            size: 'large',
            style: { height: 48 },
          }}
        >
          <div style={{ padding: '24px 0' }}>
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <div
                style={{
                  padding: 20,
                  background: '#fff7e6',
                  borderRadius: 12,
                  border: '2px solid #ffd591',
                }}
              >
                <Title level={5} style={{ margin: 0, marginBottom: 12 }}>
                  📝 Bạn cần đăng nhập để:
                </Title>
                <ul
                  style={{
                    paddingLeft: 24,
                    margin: 0,
                    fontSize: 15,
                    lineHeight: '28px',
                  }}
                >
                  <li>Lưu kết quả bài test của bạn</li>
                  <li>Xem phân tích chi tiết về tính cách</li>
                  <li>Nhận gợi ý nghề nghiệp phù hợp</li>
                  <li>Xem lại lịch sử các bài test đã làm</li>
                </ul>
              </div>

              <div
                style={{
                  padding: 16,
                  background: '#f6ffed',
                  borderRadius: 8,
                  border: '1px solid #b7eb8f',
                  textAlign: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: '#52c41a',
                    fontWeight: 500,
                  }}
                >
                  ✓ Tiến trình làm bài của bạn đã được lưu tự động!
                </Text>
              </div>

              <Text
                type="secondary"
                style={{ fontSize: 14, textAlign: 'center', display: 'block' }}
              >
                Bạn có thể tiếp tục làm bài sau khi đăng nhập
              </Text>
            </Space>
          </div>
        </Modal>
      </div>
    </div>
  );
}
