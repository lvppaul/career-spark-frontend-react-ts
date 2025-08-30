import React, { useState } from 'react';
import { Header, Footer } from '@/components/shared';

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  timeAgo: string;
  category: string;
  image: string;
  isHot?: boolean;
  isNew?: boolean;
  readTime: string;
  views: number;
}

interface NewsPageProps {
  onNavigate?: (
    page: 'home' | 'login' | 'forum' | 'news' | 'ai' | 'signup'
  ) => void;
}

const NewsPage: React.FC<NewsPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const featuredArticle: NewsArticle = {
    id: 1,
    title:
      'Xu hướng việc làm trong thời đại AI: Những ngành nghề nào sẽ bùng nổ?',
    excerpt:
      'Trí tuệ nhân tạo đang thay đổi cục diện thị trường lao động toàn cầu. Hãy cùng khám phá những ngành nghề có triển vọng tươi sáng nhất trong thời đại số.',
    author: 'Nguyễn Minh Hoàng',
    timeAgo: '2 giờ trước',
    category: 'Xu hướng',
    image: '/news-ai-trend.jpg',
    isHot: true,
    readTime: '5 phút đọc',
    views: 1204,
  };

  const newsArticles: NewsArticle[] = [
    {
      id: 2,
      title: 'Lương trung bình ngành IT tại Việt Nam tăng 15% trong năm 2024',
      excerpt:
        'Báo cáo mới nhất cho thấy mức lương ngành công nghệ thông tin tại Việt Nam có mức tăng trưởng ấn tượng.',
      author: 'Trần Văn Nam',
      timeAgo: '4 giờ trước',
      category: 'Lương bổng',
      image: '/news-salary.jpg',
      readTime: '3 phút đọc',
      views: 856,
    },
    {
      id: 3,
      title: 'Kỹ năng mềm quan trọng gì trong môi trường làm việc hiện đại',
      excerpt:
        'Ngoài kỹ năng chuyên môn, các nhà tuyển dụng ngày càng chú trọng đến kỹ năng mềm của ứng viên.',
      author: 'Lê Thị Hoa',
      timeAgo: '6 giờ trước',
      category: 'Kỹ năng',
      image: '/news-soft-skills.jpg',
      readTime: '4 phút đọc',
      views: 723,
    },
    {
      id: 4,
      title: 'Hướng dẫn viết CV ấn tượng cho fresh graduate',
      excerpt:
        'Những bí quyết giúp sinh viên mới ra trường tạo ấn tượng tốt với nhà tuyển dụng thông qua CV.',
      author: 'Phạm Đức Thành',
      timeAgo: '8 giờ trước',
      category: 'Hướng dẫn',
      image: '/news-cv-tips.jpg',
      readTime: '6 phút đọc',
      views: 945,
    },
    {
      id: 5,
      title: 'Top 10 công ty có văn hóa làm việc tốt nhất Việt Nam 2024',
      excerpt:
        'Danh sách những công ty được nhân viên đánh giá cao về môi trường và văn hóa làm việc.',
      author: 'Võ Minh Tuấn',
      timeAgo: '10 giờ trước',
      category: 'Doanh nghiệp',
      image: '/news-companies.jpg',
      readTime: '7 phút đọc',
      views: 1123,
    },
    {
      id: 6,
      title: 'Cách chuẩn bị tốt nhất cho cuộc phỏng vấn online',
      excerpt:
        'Hướng dẫn chi tiết để thể hiện tốt nhất bản thân trong các cuộc phỏng vấn trực tuyến.',
      author: 'Nguyễn Thu Hà',
      timeAgo: '12 giờ trước',
      category: 'Phỏng vấn',
      image: '/news-interview.jpg',
      isNew: true,
      readTime: '5 phút đọc',
      views: 634,
    },
  ];

  const categories = [
    'Tất cả',
    'Công nghệ (111)',
    'Kinh doanh (67)',
    'Tài chính (32)',
    'Giáo dục (45)',
    'Marketing (28)',
  ];

  const trendingTopics = [
    'Chu Đại Thụy Hoạch',
    'AI trong Nghiệp',
    'Những Chiến Lược',
    'Management Consultant',
    'Kỹ năng mềm',
  ];

  const quickLinks = [
    'Việc Làm Tốt Nhất',
    'Test RIASEC',
    'Tư Vấn Nghề Nghiệp',
    'Diễn Đàn',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="news" onNavigate={onNavigate} />

      {/* Header section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Tin Tức Nghề Nghiệp
            </h1>
            <p className="text-gray-600">
              Cập nhật những tin tức, xu hướng và kiến thức mới nhất về thị
              trường nghề nghiệp
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Article */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <div className="relative h-80">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-90"></div>
                <div className="absolute inset-0 bg-black opacity-30"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    {featuredArticle.isHot && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        HOT
                      </span>
                    )}
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                      {featuredArticle.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 leading-tight">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-gray-200 mb-4 line-clamp-2">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span>📝 {featuredArticle.author}</span>
                      <span>🕒 {featuredArticle.timeAgo}</span>
                      <span>👀 {featuredArticle.views} lượt xem</span>
                    </div>
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
                      {featuredArticle.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {newsArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-gray-200 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-600 opacity-80"></div>
                    <div className="absolute top-4 left-4">
                      {article.isNew && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium mr-2">
                          NEW
                        </span>
                      )}
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <span>📝 {article.author}</span>
                        <span>🕒 {article.timeAgo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>👀 {article.views}</span>
                        <span>• {article.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition-colors">
                Xem thêm bài viết
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Trending Topics */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                🔥 Chủ Đề Thịnh Hành
              </h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
                        {topic}
                      </span>
                    </div>
                    <span className="text-green-500 text-xs">✓</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white mb-6">
              <h3 className="font-semibold mb-2">Nhận Tin Tức Mới Nhất</h3>
              <p className="text-sm text-blue-100 mb-4">
                Đăng ký để nhận tin tức và xu hướng nghề nghiệp mới nhất qua
                email.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full px-3 py-2 rounded text-gray-800 text-sm"
                />
                <button className="w-full bg-white text-blue-600 py-2 rounded font-medium text-sm hover:bg-gray-100 transition-colors">
                  Đăng Ký Ngay
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-4">
                Liên Kết Nhanh
              </h3>
              <div className="space-y-3">
                {quickLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs">
                        {index === 0
                          ? '💼'
                          : index === 1
                            ? '📊'
                            : index === 2
                              ? '💡'
                              : '💬'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
                      {link}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
              <h3 className="font-semibold text-gray-800 mb-4">Thống Kê</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Bài viết hôm nay
                  </span>
                  <span className="font-semibold text-blue-600">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Lượt xem tuần này
                  </span>
                  <span className="font-semibold text-green-600">2,145</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Người đăng ký</span>
                  <span className="font-semibold text-purple-600">8,234</span>
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

export default NewsPage;
