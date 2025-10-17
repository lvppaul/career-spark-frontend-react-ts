import { useMemo, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  Select,
  List,
  Pagination,
  Spin,
  Empty,
  Tag,
} from 'antd';
import useActiveNews from '@/features/user/news/hooks/useActiveNews';

const { Search } = Input;

export default function NewsPage() {
  const { data, isLoading } = useActiveNews();

  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState<'all' | 'withImage' | 'noImage'>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const news = useMemo(() => data ?? [], [data]);

  // Featured: first item
  const featured = news[0];

  const filtered = useMemo(() => {
    const s = searchText.trim().toLowerCase();
    return news.filter((n) => {
      if (filter === 'withImage' && !n.imageUrl) return false;
      if (filter === 'noImage' && n.imageUrl) return false;

      if (!s) return true;
      return (
        (n.title || '').toLowerCase().includes(s) ||
        (n.content || '').toLowerCase().includes(s)
      );
    });
  }, [news, searchText, filter]);

  const total = filtered.length;
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ margin: 0 }}>Tin Tức Nghề Nghiệp</h2>
              <div style={{ color: '#666' }}>
                Cập nhật xu hướng và kiến thức nghề nghiệp
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <Search
                placeholder="Tìm kiếm theo tiêu đề hoặc nội dung"
                onSearch={(v) => {
                  setSearchText(v);
                  setPage(1);
                }}
                allowClear
                enterButton
                style={{ flex: 1 }}
              />

              <Select
                value={filter}
                onChange={(v) => {
                  setFilter(v);
                  setPage(1);
                }}
                style={{ width: 180 }}
              >
                <Select.Option value="all">Tất cả</Select.Option>
                <Select.Option value="withImage">Có ảnh</Select.Option>
                <Select.Option value="noImage">Không ảnh</Select.Option>
              </Select>
            </div>

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <Spin />
              </div>
            ) : total === 0 ? (
              <Empty description="Không có bài viết" />
            ) : (
              <>
                {featured && (
                  <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 0 }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                      {featured.imageUrl && (
                        <div
                          style={{
                            width: 320,
                            height: 180,
                            overflow: 'hidden',
                          }}
                        >
                          <img
                            src={featured.imageUrl}
                            alt={featured.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                      )}
                      <div style={{ padding: 16, flex: 1 }}>
                        <h3 style={{ marginTop: 0 }}>{featured.title}</h3>
                        <div style={{ color: '#666', marginBottom: 12 }}>
                          {(featured.content || '').slice(0, 250)}
                          {(featured.content || '').length > 250 ? '...' : ''}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: 12,
                            alignItems: 'center',
                          }}
                        >
                          <Tag>
                            {new Date(featured.createdAt).toLocaleDateString()}
                          </Tag>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                <List
                  grid={{ gutter: 16, column: 2 }}
                  dataSource={paginated}
                  renderItem={(item) => (
                    <List.Item>
                      <Card hoverable>
                        <Row gutter={12}>
                          <Col span={10}>
                            <div
                              style={{
                                width: '100%',
                                height: 120,
                                overflow: 'hidden',
                                background: '#f0f0f0',
                              }}
                            >
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.title}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                  }}
                                />
                              ) : null}
                            </div>
                          </Col>
                          <Col span={14}>
                            <h4 style={{ marginTop: 0 }}>
                              {item.title || 'Không có tiêu đề'}
                            </h4>
                            <div
                              style={{
                                color: '#666',
                                fontSize: 13,
                                marginBottom: 8,
                              }}
                            >
                              {(item.content || '').slice(0, 180)}
                              {(item.content || '').length > 180 ? '...' : ''}
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                gap: 8,
                                alignItems: 'center',
                              }}
                            >
                              <Tag>
                                {new Date(item.createdAt).toLocaleString()}
                              </Tag>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </List.Item>
                  )}
                />

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 16,
                  }}
                >
                  <Pagination
                    current={page}
                    pageSize={pageSize}
                    total={total}
                    onChange={(p, size) => {
                      setPage(p);
                      setPageSize(size);
                    }}
                    showSizeChanger
                    pageSizeOptions={[6, 12, 24]}
                  />
                </div>
              </>
            )}
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Chủ Đề Thịnh Hành" style={{ marginBottom: 16 }}>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                {/* derive some topics from recent titles */}
                {news.slice(0, 6).map((n) => (
                  <div
                    key={n.id}
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <div style={{ color: '#333' }}>
                      {n.title?.slice(0, 60) || '—'}
                    </div>
                    <div style={{ color: '#999', fontSize: 12 }}>
                      {new Date(n.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Thống kê">
              <div>
                Hiện có <strong>{news.length}</strong> tin tức
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
