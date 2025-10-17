// Using automatic JSX runtime; no default React import needed
import { useParams } from 'react-router-dom';
import { Button, Card, Spin, Empty } from 'antd';
import useNewsById from '@/features/user/news/hooks/useNewsById';

export default function NewsDetailPage() {
  const { id } = useParams();
  const nid = id ? Number(id) : null;
  const { data, isLoading, error, refetch } = useNewsById(nid);

  return (
    <div style={{ padding: 24 }}>
      <Card
        styles={{
          body: { padding: 30, backgroundColor: '#fff' },
          header: { fontWeight: 'bold', fontSize: 18 },
        }}
        style={{
          borderRadius: 8,
          margin: '0 auto', // căn giữa
          maxWidth: 900, // giới hạn chiều rộng
          paddingInline: 0, // không cần nếu styles.body đã xử lý
        }}
      >
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 30 }}>
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
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ maxWidth: 1000, width: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                  color: '#666',
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  {data.tag ? <span>{data.tag}</span> : null}
                </div>
                <div style={{ textAlign: 'right' }}>
                  {new Date(data.createdAt).toLocaleString()}
                </div>
              </div>

              <h1
                style={{
                  textAlign: 'left',
                  fontSize: 28,
                  fontWeight: 700,
                }}
              >
                {data.title || 'Không có tiêu đề'}
              </h1>

              {data.imageUrl && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <img
                    src={data.imageUrl}
                    alt={data.title}
                    style={{
                      width: '100%',
                      maxHeight: 700,
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                </div>
              )}

              <div
                style={{
                  lineHeight: 1.8,
                  textAlign: 'justify',
                  textJustify: 'inter-word',
                  fontSize: 18,
                }}
              >
                {!data.content || data.content.trim() === '' ? (
                  <i>Không có nội dung</i>
                ) : (
                  data.content.split(/\r?\n\r?\n/).map((para, idx) => (
                    <p
                      key={idx}
                      style={{ marginBottom: 16, textAlign: 'justify' }}
                    >
                      {para.split(/\r?\n/).map((line, i, arr) => (
                        <span key={i}>
                          {line}
                          {i < arr.length - 1 ? <br /> : null}
                        </span>
                      ))}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
