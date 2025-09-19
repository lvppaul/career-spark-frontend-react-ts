import { useMemo, useState } from 'react';
import {
  Card,
  Button,
  Checkbox,
  Steps,
  Space,
  Typography,
  message,
} from 'antd';
import { useRiasecTest } from '../hooks/useRiasecTest';
import type { RiasecQuestion } from '../types';

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
  const { data: questions, isLoading, error, refresh } = useRiasecTest();
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);
  // selected ids set
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

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
    setSubmitting(true);
    try {
      // For now persist selections to localStorage. Backend submission can be added here.
      const selectedIds = Object.entries(selected)
        .filter(([_, v]) => v)
        .map(([k]) => Number(k));

      const payload = {
        timestamp: new Date().toISOString(),
        selections: selectedIds,
      };

      localStorage.setItem('riasecSelections', JSON.stringify(payload));
      message.success('Lưu lựa chọn thành công');
      // optional: log for debugging
      console.log('RIASEC selections saved:', payload);
    } catch (err) {
      console.error('Save riasec selections failed', err);
      message.error('Lưu thất bại');
    } finally {
      setSubmitting(false);
    }
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
              {currentQuestions.map((q) => (
                <Card key={q.id} size="small">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{q.content}</div>
                      {q.description && (
                        <div className="text-sm text-gray-500">
                          {q.description}
                        </div>
                      )}
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

        <div className="mt-6 flex justify-between">
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
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={submitting}
              >
                Nộp bài
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
