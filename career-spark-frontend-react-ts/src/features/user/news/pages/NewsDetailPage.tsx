// Using automatic JSX runtime; no default React import needed
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Spin, Empty, Tag } from 'antd';
import useNewsById from '@/features/user/news/hooks/useNewsById';

export default function NewsDetailPage() {
  const { id } = useParams();
  const nid = id ? Number(id) : null;
  const { data, isLoading, error, refetch } = useNewsById(nid);
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <Button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>
        Quay lại
      </Button>

      <Card>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin />
          </div>
        ) : error ? (
          <div>
            <div style={{ marginBottom: 12 }}>Không thể tải bài viết.</div>
            <Button onClick={() => refetch(nid)}>Thử lại</Button>
          </div>
        ) : !data ? (
          <Empty description="Bài viết không tồn tại" />
        ) : (
          <div>
            {data.imageUrl && (
              <div style={{ marginBottom: 16 }}>
                <img
                  src={data.imageUrl}
                  alt={data.title}
                  style={{ width: '100%', maxHeight: 420, objectFit: 'cover' }}
                />
              </div>
            )}

            <h1>{data.title || 'Không có tiêu đề'}</h1>

            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <Tag>{new Date(data.createdAt).toLocaleString()}</Tag>
              {data.imageUrl ? <Tag color="blue">Có hình</Tag> : null}
            </div>

            <div
              style={{ lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{
                __html: data.content || '<i>Không có nội dung</i>',
              }}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
