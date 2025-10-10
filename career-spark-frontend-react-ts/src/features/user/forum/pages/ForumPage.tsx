import React, { useState } from 'react';
import PublishedList from '@/features/user/forum/components/PublishedList';
import { BLOG_TAG_OPTIONS } from '@/features/user/forum/type';

interface ForumPageProps {
  onNavigate?: (
    page: 'home' | 'login' | 'forum' | 'news' | 'ai' | 'signup'
  ) => void;
}

const ForumPage: React.FC<ForumPageProps> = ({ onNavigate: _ }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('Tất Cả');

  const tagOptions = [
    { value: 'Tất Cả', label: 'Tất Cả' },
    ...BLOG_TAG_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
  ];

  const topUsers = [
    { name: 'Nguyễn Thắng', points: 'TOP' },
    { name: 'Minh Quân', points: 'TOP' },
    { name: 'Vũ Phát', points: 'TOP' },
    { name: 'Bùi Phương', points: 'TOP' },
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
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
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
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
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Thống kê Cộng Đồng
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">👥</span>
                    <span className="text-sm text-gray-600">Thành viên</span>
                  </div>
                  <span className="font-semibold">12,456</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">💬</span>
                    <span className="text-sm text-gray-600">Bài viết</span>
                  </div>
                  <span className="font-semibold">3,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm text-gray-600">
                      Hoạt động hôm nay
                    </span>
                  </div>
                  <span className="font-semibold">89</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-4">
                Người Đóng Góp Hàng Đầu
              </h3>
              <div className="space-y-3">
                {topUsers.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                        👤
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {user.name}
                      </span>
                    </div>
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                      {user.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 mt-6 text-white">
              <h3 className="font-semibold mb-2">Hướng Dẫn Giao Diện</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>5 ưu đại một trang 1 gần quá</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>13 trang mới mỗi tháng gần</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>Số liên một tháng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
