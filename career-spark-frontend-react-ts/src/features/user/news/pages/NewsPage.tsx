import { useMemo, useState } from 'react';
import { Input, Select, Pagination, Spin, Empty } from 'antd';
import useActiveNews from '@/features/user/news/hooks/useActiveNews';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

export default function NewsPage() {
  const { data, isLoading } = useActiveNews();

  const [searchText, setSearchText] = useState('');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const news = useMemo(() => data ?? [], [data]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    news.forEach((n) => set.add(n.tag ?? 'Khác'));
    return Array.from(set);
  }, [news]);

  const filtered = useMemo(() => {
    const s = searchText.trim().toLowerCase();
    return news.filter((n) => {
      if (tagFilter !== 'all' && (n.tag || 'other') !== tagFilter) return false;

      if (!s) return true;
      return (
        (n.title || '').toLowerCase().includes(s) ||
        (n.content || '').toLowerCase().includes(s)
      );
    });
  }, [news, searchText, tagFilter]);

  const total = filtered.length;
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Tin Tức Nghề Nghiệp
          </h1>
          <p className="text-gray-600">
            Cập nhật xu hướng và kiến thức nghề nghiệp mới nhất để phát triển sự
            nghiệp của bạn
          </p>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Search
                placeholder="🔍 Tìm kiếm theo tiêu đề hoặc nội dung..."
                onSearch={(v) => {
                  setSearchText(v);
                  setPage(1);
                }}
                allowClear
                enterButton="Tìm kiếm"
                size="large"
                className="search-input"
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={tagFilter}
                onChange={(v) => {
                  setTagFilter(v);
                  setPage(1);
                }}
                size="large"
                className="w-full"
                placeholder="Chọn chủ đề"
              >
                <Select.Option value="all"> Tất cả chủ đề</Select.Option>
                {tags.map((t) => (
                  <Select.Option key={t} value={t}>
                    {t}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spin size="large" />
            <p className="text-gray-600 mt-4">Đang tải tin tức...</p>
          </div>
        ) : total === 0 ? (
          <div className="text-center py-20">
            <Empty
              description={
                <span className="text-gray-500 text-lg">
                  Không tìm thấy bài viết nào
                </span>
              }
            />
          </div>
        ) : (
          <>
            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {paginated.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/news/${item.id}`)}
                  className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl text-blue-300">📰</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800">
                          {item.tag || 'Khác'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString(
                                'vi-VN'
                              )
                            : ''}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {item.title || 'Không có tiêu đề'}
                      </h3>

                      {item.content && (
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {item.content
                            .replace(/<[^>]*>/g, '')
                            .substring(0, 150)}
                          ...
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-medium group-hover:text-indigo-600 transition-colors duration-300">
                          Đọc thêm →
                        </span>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>Bài viết mới</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl shadow-lg px-6 py-4 border border-gray-100">
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={total}
                  onChange={(p, size) => {
                    setPage(p);
                    setPageSize(size);
                  }}
                  showSizeChanger
                  pageSizeOptions={[6, 12, 24]}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} của ${total} bài viết`
                  }
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
