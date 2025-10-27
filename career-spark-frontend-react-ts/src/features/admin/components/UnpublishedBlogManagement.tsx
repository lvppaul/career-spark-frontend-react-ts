import React, { useMemo } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  message as antdMessage,
  Avatar,
} from 'antd';
import usePublishBlog from '@/features/user/forum/hooks/usePublishBlog';
import useUpdateBlog from '@/features/admin/hooks/useUpdateBlog';
import useDeleteBlog from '@/features/admin/hooks/useDeleteBlog';
import BlogDetail from '@/features/user/forum/components/BlogDetail';
import { Form, Input, Select } from 'antd';
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
  } = useUnpublishedBlogs();

  const { publish } = usePublishBlog();
  const [detailVisible, setDetailVisible] = React.useState(false);
  const [selectedBlogId, setSelectedBlogId] = React.useState<number | null>(
    null
  );
  const [publishingId, setPublishingId] = React.useState<number | null>(null);
  const [publishModalOpen, setPublishModalOpen] = React.useState(false);
  const [publishTargetId, setPublishTargetId] = React.useState<number | null>(
    null
  );
  const { updateBlog, isLoading: updating } = useUpdateBlog();
  const { deleteBlog } = useDeleteBlog();
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editForm] = Form.useForm();
  const [deletingId, setDeletingId] = React.useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [deleteTargetId, setDeleteTargetId] = React.useState<number | null>(
    null
  );

  const tagMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const opt of BLOG_TAG_OPTIONS) m.set(opt.value as string, opt.label);
    return m;
  }, []);

  // Filters
  const [searchTerm, setSearchTerm] = React.useState('');
  const [tagFilter, setTagFilter] = React.useState<string>('');
  const [authorFilter, setAuthorFilter] = React.useState<string>('');

  const authorOptions = useMemo(() => {
    const s = new Set<string>();
    for (const b of data || []) if (b.authorName) s.add(b.authorName);
    return Array.from(s).sort();
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [] as BlogItem[];
    return data.filter((d) => {
      const matchesTag = !tagFilter || String(d.tag) === tagFilter;
      const hay = (
        d.title +
        ' ' +
        d.content +
        ' ' +
        (d.authorName ?? '')
      ).toLowerCase();
      const matchesSearch = !searchTerm
        ? true
        : hay.includes(searchTerm.toLowerCase());
      const matchesAuthor = !authorFilter || d.authorName === authorFilter;
      return matchesTag && matchesSearch && matchesAuthor;
    });
  }, [data, searchTerm, tagFilter, authorFilter]);

  const handlePublish = (id: number) => {
    setPublishTargetId(id);
    setPublishModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteTargetId(id);
    setDeleteModalOpen(true);
  };

  const columns: ColumnsType<BlogItem> = [
    {
      title: 'Tác giả',
      dataIndex: 'authorName',
      key: 'author',
      render: (_: unknown, record: BlogItem) => (
        <Space align="center">
          <Avatar src={record.authorAvatarUrl} alt={record.authorName} />
          <span>{record.authorName ?? '—'}</span>
        </Space>
      ),
    },
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
            onClick={() => {
              setSelectedBlogId(record.id);
              setDetailVisible(true);
            }}
          >
            Xem
          </Button>

          <Button
            type="link"
            loading={publishingId === record.id}
            onClick={() => handlePublish(record.id)}
          >
            Đăng
          </Button>

          <Button
            type="link"
            onClick={() => {
              setEditingId(record.id);
              editForm.setFieldsValue({
                title: record.title,
                tag: record.tag,
                content: record.content,
              });
              setEditModalOpen(true);
            }}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            loading={deletingId === record.id}
            onClick={() => handleDelete(record.id)}
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
      <div className="mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Bài viết đang chờ duyệt</h2>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Input.Search
            placeholder="Tìm theo tiêu đề, nội dung, tác giả..."
            allowClear
            onSearch={(v) => setSearchTerm(v)}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minWidth: 220 }}
            value={searchTerm}
          />
          <Select
            placeholder="Lọc theo chủ đề"
            allowClear
            style={{ width: 180 }}
            value={tagFilter || undefined}
            onChange={(v) => setTagFilter(v || '')}
          >
            {BLOG_TAG_OPTIONS.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="Lọc theo tác giả"
            allowClear
            style={{ width: 180 }}
            value={authorFilter || undefined}
            onChange={(v) => setAuthorFilter(v || '')}
          >
            {authorOptions.map((a) => (
              <Select.Option key={a} value={a}>
                {a}
              </Select.Option>
            ))}
          </Select>
          <Space>
            <Button onClick={() => refresh()}>Tải lại</Button>
            <Button
              onClick={() => {
                setSearchTerm('');
                setTagFilter('');
                setAuthorFilter('');
              }}
            >
              Reset
            </Button>
          </Space>
        </div>
      </div>

      <Table
        rowKey={(r) => r.id}
        columns={columns}
        dataSource={filtered}
        loading={isLoading}
        pagination={
          // Drive pagination from hook state
          {
            current: page,
            pageSize: size,
            total: pagination?.totalCount ?? 0,
            showSizeChanger: true,
          }
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

      {/* Controlled delete confirmation modal for unpublished items */}
      <Modal
        open={deleteModalOpen}
        title="Xóa bài viết"
        onCancel={() => {
          setDeleteModalOpen(false);
          setDeleteTargetId(null);
        }}
        okText="Xóa"
        okType="danger"
        cancelText="Hủy"
        confirmLoading={deletingId === deleteTargetId}
        onOk={async () => {
          if (!deleteTargetId) return setDeleteModalOpen(false);
          setDeletingId(deleteTargetId);
          try {
            await deleteBlog(deleteTargetId);
            antdMessage.success(`Đã xóa bài viết ${deleteTargetId}`);
            refresh();
            setDeleteModalOpen(false);
            setDeleteTargetId(null);
          } catch (err) {
            console.error('Delete failed', err);
            antdMessage.error('Xóa bài viết thất bại');
          } finally {
            setDeletingId(null);
          }
        }}
      >
        <p>
          Bạn có chắc muốn xóa bài viết này không? Hành động này không thể hoàn
          tác.
        </p>
      </Modal>

      {/* Edit blog modal for unpublished items */}
      <Modal
        title="Sửa bài viết"
        open={editModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          editForm.resetFields();
          setEditingId(null);
        }}
        width={900}
        okText="Lưu"
        confirmLoading={updating}
        onOk={async () => {
          try {
            const values = await editForm.validateFields();
            if (!editingId) return;
            await updateBlog(editingId, {
              title: values.title,
              tag: values.tag,
              content: values.content,
            });
            antdMessage.success('Cập nhật bài viết thành công');
            setEditModalOpen(false);
            editForm.resetFields();
            setEditingId(null);
            refresh();
          } catch (err) {
            console.error('Update failed', err);
            antdMessage.error('Cập nhật thất bại');
          }
        }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tag" label="Chủ đề" rules={[{ required: true }]}>
            <Select>
              {BLOG_TAG_OPTIONS.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={10} />
          </Form.Item>
        </Form>
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

export default UnpublishedBlogManagement;
