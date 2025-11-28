import React, { useMemo } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Avatar,
  Form,
  Input,
  Select,
} from 'antd';
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import usePublishedBlogs from '@/features/admin/hooks/usePublishedBlogs';
import CreateBlogModal from '@/features/user/forum/components/CreateBlogModal';
import BlogDetail from '@/features/user/forum/components/BlogDetail';
import useUnpublishBlog from '@/features/user/forum/hooks/useUnpublishBlog';
import useUpdateBlog from '@/features/admin/hooks/useUpdateBlog';
import useDeleteBlog from '@/features/admin/hooks/useDeleteBlog';
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
  } = usePublishedBlogs();

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
  // edit blog state
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editForm] = Form.useForm();
  const { updateBlog, isLoading: updating } = useUpdateBlog();
  const { deleteBlog } = useDeleteBlog();
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
    const setNames = new Set<string>();
    for (const b of data || []) if (b.authorName) setNames.add(b.authorName);
    return Array.from(setNames).sort();
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
      title: 'Thao tác',
      key: 'actions',
      width: 180,
      render: (_: unknown, record: BlogItem) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedBlogId(record.id);
              setDetailVisible(true);
            }}
            size="small"
            type="default"
          />
          <Button
            icon={<EyeInvisibleOutlined />}
            loading={unpublishingId === record.id}
            onClick={() => {
              setUnpublishTargetId(record.id);
              setUnpublishModalOpen(true);
            }}
            size="small"
          />

          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingId(record.id);
              editForm.setFieldsValue({
                title: record.title,
                tag: record.tag,
                content: record.content,
              });
              setEditModalOpen(true);
            }}
            size="small"
            type="primary"
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            loading={deletingId === record.id}
            onClick={() => {
              setDeleteTargetId(record.id);
              setDeleteModalOpen(true);
            }}
            size="small"
          />
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
        <h2 className="text-lg font-semibold">Quản lý bài viết</h2>
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
            <Button type="primary" onClick={() => setCreateVisible(true)}>
              Tạo mới
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
          // Always show pagination control and drive current/pageSize from hook state
          {
            current: page,
            pageSize: size,
            total: pagination?.totalCount ?? 0,
            showSizeChanger: true,
          }
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

      {/* Edit blog modal */}
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
            message.success('Cập nhật bài viết thành công');
            setEditModalOpen(false);
            editForm.resetFields();
            setEditingId(null);
            refresh();
          } catch (err) {
            if (err instanceof Error) message.error(err.message);
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

      {/* Controlled delete confirmation modal */}
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
            message.success('Đã xóa bài viết');
            refresh();
            setDeleteModalOpen(false);
            setDeleteTargetId(null);
          } catch (err) {
            console.error('Delete failed', err);
            message.error('Xóa bài viết thất bại');
          } finally {
            setDeletingId(null);
          }
        }}
      >
        <p>
          Bạn có chắc muốn xóa bài viết này? Hành động này không thể hoàn tác.
        </p>
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
