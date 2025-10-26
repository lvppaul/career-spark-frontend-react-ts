import React, { useMemo } from 'react';
import { Table, Button, Space, Modal, message as antdMessage } from 'antd';
import usePublishBlog from '@/features/user/forum/hooks/usePublishBlog';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import useUnpublishedBlogs from '@/features/admin/hooks/useUnpublishedBlogs';
import { BLOG_TAG_OPTIONS } from '@/features/user/forum/type';
import type { BlogItem } from '@/features/user/forum/type';

// controlled modal state will be used instead of Modal.confirm

const UnpublishedBlogManagement: React.FC = () => {
  const {
    data,
    pagination,
    isLoading,

    page,
    size,
    setPage,
    setSize,
    refresh,
  } = useUnpublishedBlogs(1, 10);

  const { publish } = usePublishBlog();
  const [publishingId, setPublishingId] = React.useState<number | null>(null);
  const [publishModalOpen, setPublishModalOpen] = React.useState(false);
  const [publishTargetId, setPublishTargetId] = React.useState<number | null>(
    null
  );

  const tagMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const opt of BLOG_TAG_OPTIONS) m.set(opt.value as string, opt.label);
    return m;
  }, []);

  const handlePublish = (id: number) => {
    setPublishTargetId(id);
    setPublishModalOpen(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Xóa bài viết',
      content:
        'Bạn có chắc muốn xóa bài viết này không? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        // Placeholder: call delete API then refresh
        antdMessage.success(`Đã xóa bài viết ${id} (API not implemented)`);
        console.log('delete', id);
      },
    });
  };

  const columns: ColumnsType<BlogItem> = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
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
            loading={publishingId === record.id}
            onClick={() => handlePublish(record.id)}
          >
            Đăng
          </Button>
          <Button type="link" onClick={() => console.log('edit', record.id)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
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
        <h2 className="text-lg font-semibold">Bài viết đang chờ duyệt</h2>
        <Space>
          <Button onClick={() => refresh()}>Tải lại</Button>
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
      {/* Controlled publish confirmation modal */}
      <Modal
        open={!!publishModalOpen}
        title="Đăng bài viết"
        onCancel={() => setPublishModalOpen(false)}
        okText="Đăng"
        cancelText="Hủy"
        confirmLoading={publishingId === publishTargetId}
        onOk={async () => {
          if (!publishTargetId) return setPublishModalOpen(false);
          setPublishingId(publishTargetId);
          try {
            const resp = await publish(publishTargetId);
            antdMessage.success(
              resp?.message || `Đã đăng bài ${publishTargetId}`
            );
            refresh();
            setPublishModalOpen(false);
          } catch (err) {
            console.error('Publish failed', err);
            antdMessage.error('Không thể đăng bài viết');
          } finally {
            setPublishingId(null);
          }
        }}
      >
        <p>Bạn có chắc muốn đăng bài viết này không?</p>
      </Modal>
    </div>
  );
};

export default UnpublishedBlogManagement;
