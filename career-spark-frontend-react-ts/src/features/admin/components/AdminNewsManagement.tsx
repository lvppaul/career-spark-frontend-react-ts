import React, { useMemo } from 'react';
import {
  Table,
  Input,
  Select,
  Space,
  Button,
  Modal,
  Popconfirm,
  Spin,
  Empty,
  Avatar,
  Form,
  message,
  Upload,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import useActiveNews from '@/features/user/news/hooks/useActiveNews';
import useNewsById from '@/features/user/news/hooks/useNewsById';
import useCreateNews from '@/features/user/news/hooks/useCreateNews';
import useUpdateNews from '@/features/user/news/hooks/useUpdateNews';
import useDeleteNews from '@/features/user/news/hooks/useDeleteNews';
import type { NewsItem } from '@/features/user/news/services/newsService';
import { NEWS_TAG_OPTIONS } from '@/features/user/news/type';

const AdminNewsManagement: React.FC = () => {
  const { data, isLoading, refetch } = useActiveNews();

  const [createVisible, setCreateVisible] = React.useState(false);
  const [createForm] = Form.useForm();
  const { create, isLoading: creating } = useCreateNews();
  const { remove } = useDeleteNews();

  // edit modal state
  const [editVisible, setEditVisible] = React.useState(false);
  const [editForm] = Form.useForm();
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const { update, isLoading: updating } = useUpdateNews();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [tagFilter, setTagFilter] = React.useState<string>('');

  // selected news id for view modal
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const { data: detail, isLoading: detailLoading } = useNewsById(selectedId);

  // detail for edit modal
  const { data: editDetail, isLoading: editDetailLoading } =
    useNewsById(editingId);

  // track which id is being deleted to show per-row loading state
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (editDetail) {
      // Prefill edit form fields
      editForm.setFieldsValue({
        title: editDetail.title,
        tag: editDetail.tag,
        content: editDetail.content,
        // imageFile is left empty; user can choose to upload a new one
      });
    }
  }, [editDetail, editForm]);

  const tagMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const t of NEWS_TAG_OPTIONS) m.set(t.value as string, t.label);
    return m;
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [] as NewsItem[];
    return data.filter((n) => {
      const hay = (
        n.title +
        ' ' +
        n.content +
        ' ' +
        (n.tag ?? '')
      ).toLowerCase();
      const matchesSearch =
        !searchTerm || hay.includes(searchTerm.toLowerCase());
      const matchesTag = !tagFilter || String(n.tag) === tagFilter;
      return matchesSearch && matchesTag;
    });
  }, [data, searchTerm, tagFilter]);

  const columns: ColumnsType<NewsItem> = [
    {
      title: 'Hình',
      key: 'image',
      render: (_: unknown, record: NewsItem) => (
        <Avatar src={record.imageUrl} shape="square" size={64} />
      ),
      width: 96,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (v: string) => <span style={{ fontWeight: 600 }}>{v}</span>,
    },
    {
      title: 'Chủ đề',
      dataIndex: 'tag',
      key: 'tag',
      render: (t: string) => <span>{tagMap.get(t) ?? t}</span>,
      width: 160,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (d: string) => <span>{new Date(d).toLocaleString()}</span>,
      width: 180,
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: unknown, record: NewsItem) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setSelectedId(record.id);
            }}
          >
            Xem
          </Button>
          <Button
            type="link"
            onClick={() => {
              setEditingId(record.id);
              setEditVisible(true);
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc muốn xóa tin tức này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={async () => {
              try {
                setDeletingId(record.id);
                await remove(record.id);
                message.success('Xóa tin tức thành công');
                refetch();
              } catch (err) {
                const e = err instanceof Error ? err : new Error(String(err));
                message.error(e.message || 'Xóa tin tức thất bại');
              } finally {
                setDeletingId(null);
              }
            }}
          >
            <Button type="link" danger loading={deletingId === record.id}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 160,
    },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Quản lý tin tức</h2>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Input.Search
            placeholder="Tìm theo tiêu đề hoặc nội dung..."
            allowClear
            onSearch={(v) => setSearchTerm(v)}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minWidth: 240 }}
            value={searchTerm}
          />
          <Select
            placeholder="Lọc theo chủ đề"
            allowClear
            style={{ width: 200 }}
            value={tagFilter || undefined}
            onChange={(v) => setTagFilter(v || '')}
          >
            {NEWS_TAG_OPTIONS.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
          <Space>
            <Button onClick={() => refetch()}>Tải lại</Button>
            <Button
              onClick={() => {
                setSearchTerm('');
                setTagFilter('');
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

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 24 }}>
          <Spin />
        </div>
      ) : !data || data.length === 0 ? (
        <Empty description="Chưa có tin tức" />
      ) : (
        <Table
          rowKey={(r) => r.id}
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 8 }}
        />
      )}

      <Modal
        open={selectedId != null}
        onCancel={() => setSelectedId(null)}
        footer={null}
        width={900}
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <Spin />
          </div>
        ) : !detail ? (
          <Empty description="Tin tức không tồn tại" />
        ) : (
          <div>
            <h2 style={{ marginBottom: 8 }}>{detail.title}</h2>
            <div style={{ color: '#666', marginBottom: 12 }}>
              {new Date(detail.createdAt).toLocaleString()}
            </div>
            {detail.imageUrl && (
              <div style={{ marginBottom: 12 }}>
                <img
                  src={detail.imageUrl}
                  alt={detail.title}
                  style={{ width: '100%', borderRadius: 6 }}
                />
              </div>
            )}
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
              {detail.content}
            </div>
          </div>
        )}
      </Modal>

      {/* Create news modal */}
      <Modal
        title="Tạo tin tức"
        open={createVisible}
        onCancel={() => {
          setCreateVisible(false);
          createForm.resetFields();
        }}
        okText="Tạo"
        cancelText="Hủy"
        confirmLoading={creating}
        onOk={async () => {
          try {
            const values = await createForm.validateFields();
            // values: { title, content, tag, imageFile }
            // extract the File object from Upload value (antd stores fileList)
            const fileList = values.imageFile || [];
            const file =
              fileList && fileList.length > 0
                ? fileList[0].originFileObj
                : undefined;

            await create({
              title: values.title,
              content: values.content,
              tag: values.tag,
              imageFile: file,
            });
            message.success('Tạo tin tức thành công');
            setCreateVisible(false);
            createForm.resetFields();
            refetch();
          } catch (err) {
            const e = err instanceof Error ? err : new Error(String(err));
            message.error(e.message || 'Tạo tin tức thất bại');
          }
        }}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="imageFile"
            label="Hình ảnh"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              // e can be file list or upload event
              if (!e) return [];
              if (Array.isArray(e)) return e;
              return e.fileList;
            }}
          >
            <Upload beforeUpload={() => false} listType="picture" maxCount={1}>
              <Button>Chọn hình</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="tag" label="Chủ đề">
            <Select allowClear>
              {NEWS_TAG_OPTIONS.map((opt) => (
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
            <Input.TextArea rows={6} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit news modal */}
      <Modal
        title="Sửa tin tức"
        open={editVisible}
        onCancel={() => {
          setEditVisible(false);
          setEditingId(null);
          editForm.resetFields();
        }}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={updating}
        onOk={async () => {
          if (!editingId) return;
          try {
            const values = await editForm.validateFields();
            const fileList = values.imageFile || [];
            const file =
              fileList && fileList.length > 0
                ? fileList[0].originFileObj
                : undefined;

            await update(editingId, {
              title: values.title,
              content: values.content,
              tag: values.tag,
              imageFile: file,
            });

            message.success('Cập nhật tin tức thành công');
            setEditVisible(false);
            setEditingId(null);
            editForm.resetFields();
            refetch();
          } catch (err) {
            const e = err instanceof Error ? err : new Error(String(err));
            message.error(e.message || 'Cập nhật thất bại');
          }
        }}
      >
        {editDetailLoading ? (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <Spin />
          </div>
        ) : !editDetail ? (
          <Empty description="Tin tức không tồn tại" />
        ) : (
          <Form form={editForm} layout="vertical">
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="imageFile"
              label="Hình ảnh"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (!e) return [];
                if (Array.isArray(e)) return e;
                return e.fileList;
              }}
            >
              <Upload
                beforeUpload={() => false}
                listType="picture"
                maxCount={1}
              >
                <Button>Chọn hình</Button>
              </Upload>
            </Form.Item>
            <Form.Item name="tag" label="Chủ đề">
              <Select allowClear>
                {NEWS_TAG_OPTIONS.map((opt) => (
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
              <Input.TextArea rows={6} />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AdminNewsManagement;
