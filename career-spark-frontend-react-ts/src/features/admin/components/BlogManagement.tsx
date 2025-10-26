import React, { useMemo } from 'react';
import { Table, Button, Space, Alert } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import usePublishedBlogs from '@/features/admin/hooks/usePublishedBlogs';
import { BLOG_TAG_OPTIONS } from '@/features/user/forum/type';
import type { BlogItem } from '@/features/user/forum/type';

const BlogManagement: React.FC = () => {
  const {
    data,
    pagination,
    isLoading,
    error,
    message,
    page,
    size,
    setPage,
    setSize,
    refresh,
  } = usePublishedBlogs(1, 10);

  const tagMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const opt of BLOG_TAG_OPTIONS) m.set(opt.value as string, opt.label);
    return m;
  }, []);

  const columns: ColumnsType<BlogItem> = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (v: string) => <span>{v}</span>,
    },
    {
      title: 'Chủ đề',
      dataIndex: 'tag',
      key: 'tag',
      render: (t: string) => <span>{tagMap.get(t) ?? t}</span>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (d: string) => <span>{new Date(d).toLocaleString()}</span>,
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: unknown, record: BlogItem) => (
        <Space>
          <Button type="link" onClick={() => console.log('view', record.id)}>
            Xem
          </Button>
          <Button type="link" onClick={() => console.log('edit', record.id)}>
            Sửa
          </Button>
          <Button
            type="link"
            danger
            onClick={() => console.log('delete', record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const onChange = (paginationConfig: TablePaginationConfig) => {
    const { current, pageSize } = paginationConfig as TablePaginationConfig;
    if (current && current !== page) setPage(current);
    if (pageSize && pageSize !== size) setSize(pageSize);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Quản lý bài viết</h2>
        <Space>
          <Button onClick={() => refresh()}>Tải lại</Button>
        </Space>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}
      {message && <Alert type="info" message={message} className="mb-4" />}

      <Table
        rowKey={(r) => r.id}
        columns={columns}
        dataSource={data}
        loading={isLoading}
        pagination={
          pagination
            ? {
                current: pagination.pageNumber,
                pageSize: pagination.pageSize,
                total: pagination.totalCount,
                showSizeChanger: true,
              }
            : false
        }
        onChange={onChange}
      />
    </div>
  );
};

export default BlogManagement;
