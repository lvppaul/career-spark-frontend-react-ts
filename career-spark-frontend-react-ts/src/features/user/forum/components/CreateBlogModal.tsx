import React from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import useCreateBlog from '@/features/user/forum/hooks/useCreateBlog';
import { BLOG_TAG_OPTIONS } from '@/features/user/forum/type';
import type { CreateBlogResponse } from '@/features/user/forum/type';

interface CreateBlogModalProps {
  visible: boolean;
  onClose: () => void;
  onCreated?: (data: CreateBlogResponse['data']) => void;
}

const { TextArea } = Input;

const CreateBlogModal: React.FC<CreateBlogModalProps> = ({
  visible,
  onClose,
  onCreated,
}) => {
  const [form] = Form.useForm();
  const { create, isLoading } = useCreateBlog();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        title: values.title,
        tag: values.tag,
        content: values.content,
      };

      const resp = await create(payload);
      form.resetFields();
      // close modal first so page-level toast is visible above the content
      onClose();
      onCreated?.(resp?.data ?? resp);
    } catch (err) {
      // validation errors are handled by antd form; network errors caught here
      if (err instanceof Error) {
        message.error(err.message);
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Tạo bài viết"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={900}
      bodyStyle={{ padding: '24px 32px' }}
      okButtonProps={{ loading: isLoading }}
      cancelButtonProps={{ disabled: isLoading }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          style={{ marginBottom: 20 }}
        >
          <Input size="large" placeholder="Tiêu đề bài viết" />
        </Form.Item>

        <Form.Item
          name="tag"
          label="Chủ đề"
          rules={[{ required: true, message: 'Vui lòng chọn chủ đề' }]}
          style={{ marginBottom: 20 }}
        >
          <Select size="large" placeholder="Chọn chủ đề">
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
          rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
        >
          <TextArea
            rows={12}
            placeholder="Nội dung bài viết"
            style={{ fontSize: 16, lineHeight: '1.6' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateBlogModal;
