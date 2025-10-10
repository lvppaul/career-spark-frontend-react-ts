import React from 'react';
import { Card, Form, Input, Button, Avatar, message, Upload } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import useUpdateUser from '../hooks/useUpdateUser';
import useUploadAvatar from '../hooks/useUploadAvatar';

export default function UserProfileEdit() {
  const params = useParams();
  const id = params.id ?? '1';
  const { data } = useUser(id);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | undefined>(undefined);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const { updateUser } = useUpdateUser();
  const { uploadAvatar } = useUploadAvatar();

  React.useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        email: data.email,
        phone: data.phone,
      });
      setPreview(data.avatarURL ?? undefined);
    }
  }, [data, form]);

  type FormValues = { name?: string; email?: string; phone?: string };

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = (err) => reject(err);
    });

  const beforeUpload = async (file: File) => {
    // prevent auto upload; we will upload with the form submit
    setAvatarFile(file);
    try {
      const dataUrl = await getBase64(file);
      setPreview(dataUrl);
    } catch (err) {
      // ignore preview errors
      // keep a console warning to avoid unused var lint
      console.warn(err);
    }
    return false;
  };

  const onRemove = () => {
    setAvatarFile(null);
    setPreview(undefined);
  };

  const onFinish = async (values: FormValues) => {
    try {
      setIsUpdating(true);

      // First, update JSON fields
      const payload = {
        email: values.email,
        name: values.name,
        phone: values.phone,
        roleId: 3, // default 'User' role for self-editing
        isActive: true,
        // roleId and isActive could be added when admin edits
      };

      // Update profile fields
      await updateUser(Number(id), payload);

      // If avatar selected, upload separately. userService will update local auth user.
      if (avatarFile) {
        await uploadAvatar(Number(id), avatarFile);
      }

      message.success('Cập nhật thành công');
      navigate(`/profile`);
    } catch (err) {
      console.error(err);
      message.error('Cập nhật thất bại');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 80px)',
        paddingTop: 24,
        paddingBottom: 24,
      }}
    >
      <Card style={{ maxWidth: 800, width: 'min(800px, 95%)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 16,
          }}
        >
          <Avatar size={80} src={preview ?? data?.avatarURL ?? undefined} />
          <div>
            <h3>Chỉnh sửa hồ sơ</h3>
            <div style={{ color: '#888' }}>Thông tin cơ bản</div>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{}}
        >
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>

          <Form.Item label="Ảnh đại diện">
            <Upload
              accept="image/*"
              beforeUpload={beforeUpload}
              showUploadList={false}
              onRemove={onRemove}
            >
              <Button>Chọn ảnh...</Button>
            </Upload>
            {preview ? (
              <div style={{ marginTop: 8 }}>
                <img
                  src={preview}
                  alt="preview"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: 'cover',
                    borderRadius: 6,
                  }}
                />
              </div>
            ) : null}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              Lưu
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => navigate(-1)}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
