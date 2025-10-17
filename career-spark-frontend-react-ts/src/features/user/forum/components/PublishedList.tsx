import { useEffect } from 'react';
import { Card, List, Tag, Typography, Pagination, Empty, Spin } from 'antd';
import { usePublishedBlogs } from '../hooks/usePublishedBlogs';
import type { BlogItem } from '../type';

const { Paragraph } = Typography;

function stripMarkdown(md = ''): string {
  // Very small utility to remove common markdown tokens for excerpting
  return md
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/#+\s?/g, '')
    .replace(/>\s?/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

function excerpt(text = '', max = 240) {
  const stripped = stripMarkdown(text);
  if (stripped.length <= max) return stripped;
  return stripped.slice(0, max).trim() + '...';
}

type Props = {
  search?: string;
  tag?: string;
  // a numeric signal that when changed will force the list to refresh (e.g., timestamp)
  reloadSignal?: number;
};

export default function PublishedList({
  search = '',
  tag,
  reloadSignal,
}: Props) {
  const { data, pagination, setPage, isLoading } = usePublishedBlogs(1, 5);

  // if parent toggles reloadSignal, reset to first page to re-fetch
  useEffect(() => {
    setPage(1);
  }, [reloadSignal, setPage]);

  if (isLoading)
    return (
      <div style={{ textAlign: 'center', padding: 24 }}>
        <Spin />
      </div>
    );

  if (!data || data.length === 0)
    return <Empty description="Chưa có bài viết" />;

  // Apply client-side search & tag filter (backend pagination still applies)
  const filtered = data.filter((d) => {
    const matchesTag = !tag || tag === 'Tất Cả' ? true : String(d.tag) === tag;
    const hay = (d.title + ' ' + d.content).toLowerCase();
    const matchesSearch = !search ? true : hay.includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div>
      <Card>
        <List<BlogItem>
          itemLayout="vertical"
          dataSource={filtered}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                title={
                  <Typography.Text strong style={{ fontSize: 18 }}>
                    {item.title}
                  </Typography.Text>
                }
                description={
                  <div style={{ marginTop: 8 }}>
                    <div style={{ marginBottom: 8 }}>
                      <Tag color="blue">{item.tag}</Tag>
                    </div>
                    <Paragraph type="secondary">
                      {excerpt(item.content)}
                    </Paragraph>
                  </div>
                }
              />
            </List.Item>
          )}
        />
        {pagination ? (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Pagination
              current={pagination.pageNumber}
              pageSize={pagination.pageSize}
              total={pagination.totalCount}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
            />
          </div>
        ) : null}
      </Card>
    </div>
  );
}
