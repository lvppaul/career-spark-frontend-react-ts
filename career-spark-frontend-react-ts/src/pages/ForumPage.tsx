import React, { useState } from 'react';
import { Header, Footer } from '@/components/shared';

interface Post {
  id: number;
  title: string;
  author: string;
  timeAgo: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  avatar: string;
  isHot?: boolean;
  isNew?: boolean;
}

interface ForumPageProps {
  onNavigate?: (
    page: 'home' | 'login' | 'forum' | 'news' | 'ai' | 'signup'
  ) => void;
}

const ForumPage: React.FC<ForumPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('Tất Cả');

  const posts: Post[] = [
    {
      id: 1,
      title: 'Lộ trình học tập trình cho người mới bắt đầu',
      author: 'Nguyễn Văn A',
      timeAgo: '2 giờ trước',
      content:
        'Chào mọi người! Mình muốn hỏi về lộ trình học tập cho những người mới bắt đầu học lập trình. Mọi người có thể chia sẻ kinh nghiệm được không?',
      tags: ['Lập trình', 'Hỏi đáp'],
      likes: 102,
      comments: 45,
      shares: 12,
      avatar: '👤',
      isHot: true,
    },
    {
      id: 2,
      title: 'Kinh nghiệm phỏng vấn vị trí Marketing Manager',
      author: 'Đỗ Loan',
      timeAgo: '4 giờ trước',
      content:
        'Mình vừa trải qua buổi phỏng vấn vị trí Marketing Manager tại 1 công ty fintech. Chia sẻ một chút kinh nghiệm...',
      tags: ['Marketing', 'Phỏng vấn'],
      likes: 58,
      comments: 23,
      shares: 7,
      avatar: '👩',
    },
    {
      id: 3,
      title: 'Xu hướng công nghệ AI trong năm 2024',
      author: 'Trần Đức Minh',
      timeAgo: '1 ngày trước',
      content:
        'AI đang phát triển nhanh chóng. Những xu hướng nào sẽ thực sự bùng nổ trong thời gian tới?',
      tags: ['AI', 'Công nghệ'],
      likes: 84,
      comments: 31,
      shares: 15,
      avatar: '👨',
      isNew: true,
    },
  ];

  const tags = [
    'Tất Cả (111)',
    'Tài liệu nghề nghiệp (45)',
    'Tìm việc làm (32)',
    'Phát triển bản thân (67)',
    'Tài liệu ngành (10)',
  ];

  const topUsers = [
    { name: 'Nguyễn Thắng', points: 'TOP' },
    { name: 'Minh Quân', points: 'TOP' },
    { name: 'Vũ Phát', points: 'TOP' },
    { name: 'Bùi Phương', points: 'TOP' },
  ];

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="forum" onNavigate={onNavigate} />

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
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Create Post */}
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

            {/* Tags Filter */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      selectedTag === tag
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                      {post.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">
                          {post.title}
                        </h3>
                        {post.isHot && (
                          <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                            HOT
                          </span>
                        )}
                        {post.isNew && (
                          <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="font-medium">{post.author}</span>
                        <span className="mx-2">•</span>
                        <span>{post.timeAgo}</span>
                      </div>
                      <p className="text-gray-700 mb-4">{post.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <button className="flex items-center gap-1 hover:text-blue-600">
                            <span>👍</span>
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-blue-600">
                            <span>💬</span>
                            <span>{post.comments}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-blue-600">
                            <span>📤</span>
                            <span>{post.shares}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Stats */}
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

            {/* Top Users */}
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

            {/* Help Section */}
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

      <Footer />
    </div>
  );
};

export default ForumPage;
