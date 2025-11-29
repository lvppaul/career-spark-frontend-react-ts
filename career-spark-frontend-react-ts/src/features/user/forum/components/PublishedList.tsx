import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Pagination,
  Dialog,
  DialogContent,
  Stack,
  Paper,
  IconButton,
  Divider,
} from '@mui/material';
import { MessageCircle, Clock, User as UserIcon } from 'lucide-react';
import { Empty, Modal } from 'antd';
import { usePublishedBlogs } from '../hooks/usePublishedBlogs';
import BlogDetail from './BlogDetail';
import type { BlogItem } from '../type';

function stripMarkdown(md = ''): string {
  // Very small utility to remove common markdown tokens for excerpting
  return md
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/#+\s?/g, '')
    .replace(/>\s?/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

function excerpt(text = '', max = 167) {
  const stripped = stripMarkdown(text);
  if (stripped.length <= max) return stripped;
  return stripped.slice(0, max).trim() + '...';
}

type Props = {
  search?: string;
  tag?: string;
  // a numeric signal that when changed will force the list to refresh (e.g., timestamp)
  reloadSignal?: number;
};

export default function PublishedList({
  search = '',
  tag,
  reloadSignal,
}: Props) {
  const { data, pagination, setPage, isLoading } = usePublishedBlogs(1, 5);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  // if parent toggles reloadSignal, reset to first page to re-fetch
  useEffect(() => {
    setPage(1);
  }, [reloadSignal, setPage]);

  if (isLoading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <CircularProgress />
      </Box>
    );

  if (!data || data.length === 0)
    return <Empty description="Chưa có bài viết" />;

  // Apply client-side search & tag filter (backend pagination still applies)
  const filtered = data.filter((d) => {
    const matchesTag = !tag || tag === 'Tất Cả' ? true : String(d.tag) === tag;
    const hay = (d.title + ' ' + d.content).toLowerCase();
    const matchesSearch = !search ? true : hay.includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <Box>
      <Stack spacing={3}>
        {filtered.map((item) => (
          <Paper
            key={item.id}
            elevation={2}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
              },
            }}
            onClick={() => {
              setSelectedId(item.id);
              setDetailVisible(true);
            }}
          >
            <Card sx={{ border: 'none', boxShadow: 'none' }}>
              <CardContent sx={{ p: 3 }}>
                {/* Author Info */}
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    src={item.authorAvatarUrl}
                    alt={item.authorName}
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: 'primary.main',
                      mr: 2,
                    }}
                  >
                    {!item.authorAvatarUrl && item.authorName ? (
                      <UserIcon size={24} />
                    ) : null}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {item.authorName || 'Người dùng'}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Clock size={14} color="#666" />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(item.createAt).toLocaleString('vi-VN')}
                      </Typography>
                    </Box>
                  </Box>
                  {item.tag && (
                    <Chip
                      label={item.tag}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Title */}
                <Typography
                  variant="h6"
                  fontWeight={700}
                  gutterBottom
                  sx={{
                    color: 'primary.main',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {item.title}
                </Typography>

                {/* Excerpt */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.6,
                  }}
                >
                  {excerpt(item.content)}
                </Typography>

                {/* Footer */}
                <Box display="flex" alignItems="center" gap={2} mt={2}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <MessageCircle size={16} color="#666" />
                    <Typography variant="caption" color="text.secondary">
                      Thảo luận
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Paper>
        ))}
      </Stack>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.pageNumber}
            onChange={(_, page) => setPage(page)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Modal */}
      <Modal
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={900}
        bodyStyle={{ padding: 0 }}
      >
        <BlogDetail id={selectedId} onBack={() => setDetailVisible(false)} />
      </Modal>
    </Box>
  );
}
