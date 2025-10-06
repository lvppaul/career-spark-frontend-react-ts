import { useMemo, useState } from 'react';
import {
  Card,
  Button,
  Checkbox,
  Steps,
  Space,
  Typography,
  message,
  Modal,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useRiasecTest } from '../hooks/useRiasecTest';
import { useStartRiasecTest } from '../hooks/useStartRiasecTest';
import { useSubmitRiasecTest } from '../hooks/useSubmitRiasecTest';
import { tokenUtils } from '@/utils/tokenUtils';
import type { RiasecQuestion, SubmitResponse } from '../types';

const { Title, Text } = Typography;
const { Step } = Steps;

const TYPE_ORDER: Array<{
  key: string;
  label: string;
}> = [
  { key: 'Realistic', label: 'Realistic (R)' },
  { key: 'Investigative', label: 'Investigative (I)' },
  { key: 'Artistic', label: 'Artistic (A)' },
  { key: 'Social', label: 'Social (S)' },
  { key: 'Enterprising', label: 'Enterprising (E)' },
  { key: 'Conventional', label: 'Conventional (C)' },
];

export default function TestPage() {
  const navigate = useNavigate();
  const { data: questions, isLoading, error, refresh } = useRiasecTest();
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);
  // selected ids set
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

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
    setCurrentTypeIndex((i) => Math.min(TYPE_ORDER.length - 1, i + 1));
  }

  function goPrev() {
    setCurrentTypeIndex((i) => Math.max(0, i - 1));
  }

  async function handleSubmit() {
    // prevent submit when no selections
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

      // Get current user id from token
      const user = tokenUtils.getUserData();
      if (!user || !user.sub) {
        message.error('Bạn cần đăng nhập để nộp bài');
        return;
      }
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
      setSubmitResult(result);
      message.success('Nộp bài thành công');
      // store session locally for history access
      localStorage.setItem('riasecSession', JSON.stringify(session));
      console.log('RIASEC submit result:', result);
      // navigate to result view after successful submit
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
    // Close modal and run submit
    setConfirmOpen(false);
    // double-check selections just before submitting
    if (selectedCount === 0) {
      message.warning(
        'Bạn chưa chọn câu nào. Vui lòng chọn ít nhất một câu trước khi nộp.'
      );
      return;
    }
    void handleSubmit();
  }

  if (isLoading) return <div>Đang tải câu hỏi...</div>;
  if (error)
    return (
      <div>
        <div>Không thể tải câu hỏi: {String(error.message)}</div>
        <Button onClick={refresh}>Thử lại</Button>
      </div>
    );

  return (
    <div className="p-6">
      <Card>
        <Title level={3}>Bài test RIASEC</Title>

        <Steps current={currentTypeIndex} size="small" className="mb-6">
          {TYPE_ORDER.map((t) => (
            <Step key={t.key} title={t.label} />
          ))}
        </Steps>

        <div className="mb-4">
          <Text strong>Loại: </Text>
          <Text>{currentType.label}</Text>
        </div>

        <div>
          {currentQuestions.length === 0 ? (
            <div>Không có câu hỏi cho loại này.</div>
          ) : (
            <Space direction="vertical" style={{ width: '100%' }}>
              {currentQuestions.map((q, index) => (
                <Card key={q.id} size="small">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        <span className="font-semibold mr-2">{index + 1}.</span>
                        {q.content}
                      </div>
                    </div>
                    <div>
                      <Checkbox
                        checked={Boolean(selected[q.id])}
                        onChange={() => toggleQuestion(q.id)}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </Space>
          )}
        </div>

        <div className="mt-6">
          <div className="mb-4">
            <Text>Đã chọn: </Text>
            <Text strong>
              {Object.values(selected).filter(Boolean).length} mục
            </Text>
          </div>
        </div>

        <div className="mt-2 flex justify-between">
          <div>
            <Button onClick={goPrev} disabled={currentTypeIndex === 0}>
              Quay lại
            </Button>
          </div>

          <div>
            {currentTypeIndex < TYPE_ORDER.length - 1 ? (
              <Button type="primary" onClick={goNext}>
                Tiếp theo
              </Button>
            ) : (
              <>
                <Button
                  type="primary"
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
                >
                  Nộp bài
                </Button>

                <Modal
                  title="Xác nhận nộp bài"
                  open={confirmOpen}
                  onOk={onConfirmSubmit}
                  onCancel={() => setConfirmOpen(false)}
                  okText="Nộp"
                  cancelText="Hủy"
                >
                  <p>
                    Bạn có chắc chắn muốn nộp bài không? Sau khi nộp bạn sẽ xem
                    kết quả.
                  </p>
                </Modal>
              </>
            )}
          </div>
        </div>
        {submitResult && (
          <div className="mt-6">
            <Card title="Kết quả bài test">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div>
                    R: {submitResult.r} ({submitResult.r_Normalized.toFixed(1)}
                    %)
                  </div>
                  <div>
                    I: {submitResult.i} ({submitResult.i_Normalized.toFixed(1)}
                    %)
                  </div>
                  <div>
                    A: {submitResult.a} ({submitResult.a_Normalized.toFixed(1)}
                    %)
                  </div>
                </div>
                <div>
                  <div>
                    S: {submitResult.s} ({submitResult.s_Normalized.toFixed(1)}
                    %)
                  </div>
                  <div>
                    E: {submitResult.e} ({submitResult.e_Normalized.toFixed(1)}
                    %)
                  </div>
                  <div>
                    C: {submitResult.c} ({submitResult.c_Normalized.toFixed(1)}
                    %)
                  </div>
                </div>
              </div>

              {submitResult.suggestedCareerFields &&
                submitResult.suggestedCareerFields.length > 0 && (
                  <div className="mt-4">
                    <div className="font-semibold">Gợi ý ngành nghề:</div>
                    <ul className="list-disc pl-5">
                      {submitResult.suggestedCareerFields.map((f) => (
                        <li key={f.id}>
                          <div className="font-medium">{f.name}</div>
                          {f.description && (
                            <div className="text-sm text-gray-600">
                              {f.description}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
}
