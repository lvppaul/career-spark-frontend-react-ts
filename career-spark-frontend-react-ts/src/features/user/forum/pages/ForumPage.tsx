import React, { useState } from 'react';
import PublishedList from '@/features/user/forum/components/PublishedList';
import CreateBlogModal from '@/features/user/forum/components/CreateBlogModal';
import { Alert } from 'antd';
import { BLOG_TAG_OPTIONS } from '@/features/user/forum/type';

interface ForumPageProps {
  onNavigate?: (
    page: 'home' | 'login' | 'forum' | 'news' | 'ai' | 'signup'
  ) => void;
}

const ForumPage: React.FC<ForumPageProps> = ({ onNavigate: _ }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('Tất Cả');
  const [isCreateVisible, setCreateVisible] = useState(false);
  const [reloadSignal, setReloadSignal] = useState<number>(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const tagOptions = [
    { value: 'Tất Cả', label: 'Tất Cả' },
    ...BLOG_TAG_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Diễn Đàn Cộng Đồng
            </h1>
            <p className="text-gray-600">
              Kết nối, chia sẻ và học hỏi cùng cộng đồng chuyên nghiệp
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {alertVisible && (
          <div className="mb-4">
            <Alert
              message={alertMessage}
              type="success"
              showIcon
              closable
              onClose={() => setAlertVisible(false)}
            />
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo từ khóa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setCreateVisible(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  + Tạo bài viết
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-wrap gap-2">
                {tagOptions.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setSelectedTag(t.value)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      selectedTag === t.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <PublishedList
                search={searchTerm}
                tag={selectedTag === 'Tất Cả' ? '' : selectedTag}
                reloadSignal={reloadSignal}
              />
            </div>
          </div>
        </div>
      </div>
      <CreateBlogModal
        visible={isCreateVisible}
        onClose={() => setCreateVisible(false)}
        onCreated={() => {
          // trigger reload and show inline success alert on the page
          setReloadSignal(Date.now());
          setAlertMessage('Tạo thành công, chờ admin duyệt');
          // wait for modal close animation then show alert
          setTimeout(() => setAlertVisible(true), 250);
          // auto-dismiss after 5 seconds
          setTimeout(() => setAlertVisible(false), 5250);
        }}
      />
    </div>
  );
};

export default ForumPage;
