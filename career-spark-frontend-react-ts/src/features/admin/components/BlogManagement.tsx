import React, { useMemo } from 'react';
import { Table, Button, Space, Modal, message } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import usePublishedBlogs from '@/features/admin/hooks/usePublishedBlogs';
import CreateBlogModal from '@/features/user/forum/components/CreateBlogModal';
import BlogDetail from '@/features/user/forum/components/BlogDetail';
import useUnpublishBlog from '@/features/user/forum/hooks/useUnpublishBlog';
import { BLOG_TAG_OPTIONS } from '@/features/user/forum/type';
import type { BlogItem } from '@/features/user/forum/type';

const BlogManagement: React.FC = () => {
  const {
    data,
    pagination,
    isLoading,

    page,
    size,
    setPage,
    setSize,
    refresh,
  } = usePublishedBlogs(1, 10);

  const [createVisible, setCreateVisible] = React.useState(false);
  const [detailVisible, setDetailVisible] = React.useState(false);
  const [selectedBlogId, setSelectedBlogId] = React.useState<number | null>(
    null
  );
  const { unpublish } = useUnpublishBlog();
  const [unpublishingId, setUnpublishingId] = React.useState<number | null>(
    null
  );
  const [unpublishModalOpen, setUnpublishModalOpen] = React.useState(false);
  const [unpublishTargetId, setUnpublishTargetId] = React.useState<
    number | null
  >(null);

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
          <Button
            type="link"
            onClick={() => {
              setSelectedBlogId(record.id);
              setDetailVisible(true);
            }}
          >
            Xem
          </Button>
          <Button
            type="link"
            loading={unpublishingId === record.id}
            onClick={() => {
              setUnpublishTargetId(record.id);
              setUnpublishModalOpen(true);
            }}
          >
            Ẩn
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
          <Button type="primary" onClick={() => setCreateVisible(true)}>
            Tạo mới
          </Button>
        </Space>
      </div>

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
      <CreateBlogModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        onCreated={() => {
          setCreateVisible(false);
          refresh();
        }}
      />

      {/* Controlled unpublish confirmation modal */}
      <Modal
        open={!!unpublishModalOpen}
        title="Ẩn bài viết"
        onCancel={() => setUnpublishModalOpen(false)}
        okText="Ẩn"
        cancelText="Hủy"
        confirmLoading={unpublishingId === unpublishTargetId}
        onOk={async () => {
          if (!unpublishTargetId) return setUnpublishModalOpen(false);
          setUnpublishingId(unpublishTargetId);
          try {
            const resp = await unpublish(unpublishTargetId);
            message.success(resp?.message || 'Đã ẩn bài viết');
            refresh();
            setUnpublishModalOpen(false);
          } catch (err) {
            console.error('Unpublish error', err);
            message.error('Không thể ẩn bài viết');
          } finally {
            setUnpublishingId(null);
          }
        }}
      >
        <p>Bạn có chắc muốn ẩn bài viết này?</p>
      </Modal>

      {detailVisible && (
        <Modal
          open
          onCancel={() => setDetailVisible(false)}
          footer={null}
          width={900}
        >
          <BlogDetail id={selectedBlogId} showBack={false} />
        </Modal>
      )}
    </div>
  );
};

export default BlogManagement;
