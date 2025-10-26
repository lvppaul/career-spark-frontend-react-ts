import React from 'react';
import { Card, Spin, Empty, Typography } from 'antd';
import useBlogById from '@/features/user/forum/hooks/useBlogById';

interface BlogDetailProps {
  id?: number | null;
  showBack?: boolean;
  onBack?: () => void;
}

const { Title } = Typography;

const BlogDetail: React.FC<BlogDetailProps> = ({
  id,
  showBack = false,
  onBack,
}) => {
  const { data, isLoading, error } = useBlogById(id ?? null);

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <Spin />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <Empty description={error.message || 'Lỗi khi tải bài viết'} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-12">
        <Empty description="Bài viết không tồn tại" />
      </div>
    );
  }

  return (
    <Card bordered className="max-w-4xl mx-auto my-8">
      {showBack && (
        <div className="mb-4">
          <a onClick={onBack} className="text-blue-600 cursor-pointer">
            ← Quay lại
          </a>
        </div>
      )}

      <Title level={2} style={{ textAlign: 'left' }}>
        {data.title}
      </Title>

      <div className="mb-4 flex items-center gap-3">
        <span className="text-gray-500 text-sm">
          Đăng: {new Date(data.createAt).toLocaleString()}
        </span>
      </div>

      <div style={{ whiteSpace: 'pre-wrap', fontSize: 16, lineHeight: '1.7' }}>
        {data.content}
      </div>
    </Card>
  );
};

export default BlogDetail;
