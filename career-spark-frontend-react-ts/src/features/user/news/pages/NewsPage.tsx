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
} from 'antd';
import useActiveNews from '@/features/user/news/hooks/useActiveNews';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

export default function NewsPage() {
  const { data, isLoading } = useActiveNews();

  const [searchText, setSearchText] = useState('');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const news = useMemo(() => data ?? [], [data]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    news.forEach((n) => set.add(n.tag ?? 'Khác'));
    return Array.from(set);
  }, [news]);

  const filtered = useMemo(() => {
    const s = searchText.trim().toLowerCase();
    return news.filter((n) => {
      if (tagFilter !== 'all' && (n.tag || 'other') !== tagFilter) return false;

      if (!s) return true;
      return (
        (n.title || '').toLowerCase().includes(s) ||
        (n.content || '').toLowerCase().includes(s)
      );
    });
  }, [news, searchText, tagFilter]);

  const total = filtered.length;
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const navigate = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Row gutter={24}>
          <Col xs={24} lg={24}>
            <div style={{ marginBottom: 16 }}>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
                Tin Tức Nghề Nghiệp
              </h1>
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
                value={tagFilter}
                onChange={(v) => {
                  setTagFilter(v);
                  setPage(1);
                }}
                style={{ width: 180 }}
              >
                <Select.Option value="all">Tất cả chủ đề</Select.Option>
                {tags.map((t) => (
                  <Select.Option key={t} value={t}>
                    {t}
                  </Select.Option>
                ))}
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
                <List
                  grid={{ gutter: 16, column: 2 }}
                  dataSource={paginated}
                  renderItem={(item) => (
                    <List.Item>
                      <Card
                        hoverable
                        onClick={() => navigate(`/news/${item.id}`)}
                        style={{ cursor: 'pointer' }}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            navigate(`/news/${item.id}`);
                          }
                        }}
                      >
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
                            <h3
                              style={{
                                marginTop: 0,
                                fontSize: 25,
                                fontWeight: 700,
                              }}
                            >
                              {item.title || 'Không có tiêu đề'}
                            </h3>
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
        </Row>
      </Card>
    </div>
  );
}
