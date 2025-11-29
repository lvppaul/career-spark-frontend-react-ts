import api from '@/lib/axios';

/**
 * Comment data interface
 */
export interface Comment {
  id: number;
  content: string;
  userId: number;
  userName: string;
  userAvatarUrl?: string;
  blogId: number;
  blogTitle: string;
  createAt: string;
  updateAt: string | null;
}

/**
 * Create comment request payload
 */
export interface CreateCommentRequest {
  content: string;
  blogId: number;
  userId: number;
}

/**
 * API Response for comment operations
 */
export interface CommentResponse {
  success: boolean;
  message: string;
  data: Comment;
  timestamp: string;
}

/**
 * API Response for comments list
 */
export interface CommentsListResponse {
  success: boolean;
  message: string;
  data: Comment[];
  count: number;
  timestamp: string;
}

/**
 * Create a new comment on a blog
 * @param payload Comment data
 */
export async function createComment(
  payload: CreateCommentRequest
): Promise<CommentResponse> {
  const resp = await api.post<CommentResponse>('/Comment', payload);
  return resp.data;
}

/**
 * Get all comments for a specific blog
 * @param blogId Blog ID
 */
export async function getCommentsByBlogId(
  blogId: number
): Promise<CommentsListResponse> {
  const resp = await api.get<CommentsListResponse>(`/Comment/blog/${blogId}`);
  return resp.data;
}

/**
 * Update a comment
 * @param commentId Comment ID
 * @param content New content
 */
export async function updateComment(
  commentId: number,
  content: string
): Promise<CommentResponse> {
  const resp = await api.put<CommentResponse>(`/Comment/${commentId}`, {
    content,
  });
  return resp.data;
}

/**
 * API Response for delete comment operation
 */
export interface DeleteCommentResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

/**
 * Delete a comment
 * @param commentId Comment ID
 */
export async function deleteComment(
  commentId: number
): Promise<DeleteCommentResponse> {
  const resp = await api.delete<DeleteCommentResponse>(`/Comment/${commentId}`);
  return resp.data;
}

export const commentService = {
  createComment,
  getCommentsByBlogId,
  updateComment,
  deleteComment,
};

export default commentService;
