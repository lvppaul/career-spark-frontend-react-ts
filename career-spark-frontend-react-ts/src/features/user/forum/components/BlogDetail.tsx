import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Paper,
  Stack,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  MessageCircle,
  User as UserIcon,
  X,
  Send,
  Edit,
  Check,
  X as XIcon,
  Trash2,
} from 'lucide-react';
import useBlogById from '@/features/user/forum/hooks/useBlogById';
import { useCommentsByBlog } from '@/features/user/forum/hooks/useCommentsByBlog';
import { useCreateComment } from '@/features/user/forum/hooks/useCreateComment';
import { useUpdateComment } from '@/features/user/forum/hooks/useUpdateComment';
import { useDeleteComment } from '@/features/user/forum/hooks/useDeleteComment';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface BlogDetailProps {
  id?: number | null;
  showBack?: boolean;
  onBack?: () => void;
}

const BlogDetail: React.FC<BlogDetailProps> = ({
  id,
  showBack = false,
  onBack,
}) => {
  const { user } = useAuth();
  const { data, isLoading, error } = useBlogById(id ?? null);
  const {
    data: comments,
    count: commentCount,
    isLoading: commentsLoading,
    refetch: refetchComments,
  } = useCommentsByBlog(id ?? null);
  const { create: createComment, isLoading: isCreating } = useCreateComment();
  const { update: updateComment, isLoading: isUpdating } = useUpdateComment();
  const { remove: deleteComment, isLoading: isDeleting } = useDeleteComment();

  const [commentContent, setCommentContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(3);

  const handleSubmitComment = async () => {
    if (!commentContent.trim() || !user || !id) return;

    try {
      await createComment({
        content: commentContent.trim(),
        blogId: id,
        userId: parseInt(user.sub),
      });
      setCommentContent('');
      refetchComments();
    } catch (err) {
      console.error('Failed to submit comment:', err);
    }
  };

  const handleEditComment = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditContent(currentContent);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleSaveEdit = async (commentId: number) => {
    if (!editContent.trim()) return;

    try {
      await updateComment(commentId, editContent.trim());
      setEditingCommentId(null);
      setEditContent('');
      refetchComments();
    } catch (err) {
      console.error('Failed to update comment:', err);
    }
  };

  const handleDeleteComment = (commentId: number) => {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      await deleteComment(commentToDelete);
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
      refetchComments();
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const cancelDeleteComment = () => {
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={12}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box py={12} textAlign="center">
        <Typography color="error">
          {error.message || 'Lỗi khi tải bài viết'}
        </Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box py={12} textAlign="center">
        <Typography>Bài viết không tồn tại</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="900px" mx="auto" p={2}>
      <Paper elevation={2} sx={{ borderRadius: 2, position: 'relative' }}>
        {/* Close Button */}
        {showBack && (
          <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
            <IconButton
              onClick={onBack}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: '50%',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s',
              }}
              size="small"
            >
              <X size={20} />
            </IconButton>
          </Box>
        )}

        <Box p={4}>
          {/* Title */}
          <Typography variant="h4" fontWeight={600} mb={3}>
            {data.title}
          </Typography>

          {/* Author Info */}
          <Stack direction="row" spacing={2} alignItems="center" mb={3}>
            <Avatar src={data.authorAvatarUrl} alt={data.authorName}>
              {!data.authorAvatarUrl && data.authorName ? (
                <UserIcon size={20} />
              ) : null}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {data.authorName || 'Người dùng'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(data.createAt).toLocaleString('vi-VN')}
              </Typography>
            </Box>
            {data.tag && <Chip label={data.tag} size="small" color="primary" />}
          </Stack>

          <Divider />

          {/* Content */}
          <Typography
            component="div"
            sx={{
              whiteSpace: 'pre-wrap',
              fontSize: 16,
              lineHeight: 1.7,
              mt: 3,
            }}
          >
            {data.content}
          </Typography>
        </Box>

        {/* Comments Section */}
        <Divider />
        <Box p={4} bgcolor="#fafafa">
          <Stack direction="row" spacing={1} alignItems="center" mb={3}>
            <MessageCircle size={20} />
            <Typography variant="h6" fontWeight={600}>
              Bình luận ({commentCount || 0})
            </Typography>
          </Stack>

          {/* Comment Input */}
          {user ? (
            <Paper sx={{ p: 2, mb: 3 }}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Viết bình luận của bạn..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  variant="outlined"
                />
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Send size={18} />}
                    onClick={handleSubmitComment}
                    disabled={!commentContent.trim() || isCreating}
                  >
                    {isCreating ? 'Đang gửi...' : 'Gửi bình luận'}
                  </Button>
                </Box>
              </Stack>
            </Paper>
          ) : (
            <Paper sx={{ p: 2, mb: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Vui lòng đăng nhập để bình luận
              </Typography>
            </Paper>
          )}

          {commentsLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : comments && comments.length > 0 ? (
            <>
              <Stack spacing={2}>
                {comments.slice(0, visibleCommentsCount).map((comment) => (
                  <Paper key={comment.id} sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2}>
                      <Avatar
                        src={comment.userAvatarUrl}
                        alt={comment.userName}
                      >
                        {!comment.userAvatarUrl && comment.userName
                          ? comment.userName
                              .split(' ')
                              .map((s) => s[0])
                              .slice(0, 2)
                              .join('')
                              .toUpperCase()
                          : null}
                      </Avatar>
                      <Box flex={1}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {comment.userName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(comment.createAt).toLocaleString(
                                'vi-VN'
                              )}
                              {comment.updateAt && ' (đã chỉnh sửa)'}
                            </Typography>
                          </Box>
                          {user && parseInt(user.sub) === comment.userId && (
                            <Box>
                              {editingCommentId === comment.id ? (
                                <Stack direction="row" spacing={0.5}>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleSaveEdit(comment.id)}
                                    disabled={isUpdating}
                                  >
                                    <Check size={16} />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={handleCancelEdit}
                                    disabled={isUpdating}
                                  >
                                    <XIcon size={16} />
                                  </IconButton>
                                </Stack>
                              ) : (
                                <Stack direction="row" spacing={0.5}>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleEditComment(
                                        comment.id,
                                        comment.content
                                      )
                                    }
                                  >
                                    <Edit size={16} />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                    disabled={isDeleting}
                                  >
                                    <Trash2 size={16} />
                                  </IconButton>
                                </Stack>
                              )}
                            </Box>
                          )}
                        </Stack>
                        {editingCommentId === comment.id ? (
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            sx={{ mt: 1 }}
                            disabled={isUpdating}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{ whiteSpace: 'pre-wrap', mt: 1 }}
                          >
                            {comment.content}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>

              {/* Load More Button */}
              {visibleCommentsCount < comments.length && (
                <Box display="flex" justifyContent="center" mt={3}>
                  <Button
                    variant="outlined"
                    onClick={() => setVisibleCommentsCount((prev) => prev + 6)}
                  >
                    Xem thêm ({comments.length - visibleCommentsCount} bình
                    luận)
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="body2" color="text.secondary">
                Chưa có bình luận nào
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDeleteComment}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Xóa bình luận
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Bạn có chắc chắn muốn xóa bình luận này không?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={cancelDeleteComment} variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={confirmDeleteComment}
            variant="contained"
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogDetail;
