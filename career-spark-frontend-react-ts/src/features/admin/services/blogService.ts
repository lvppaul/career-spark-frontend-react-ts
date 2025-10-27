import api from '@/lib/axios';
import type { PublishedResponse } from '@/features/user/forum/type';

/**
 * Admin-facing blog service. Currently exposes the same endpoint for published blogs.
 */
export async function getPublishedBlogsAdmin(
  pageNumber = 1,
  pageSize = 10
): Promise<PublishedResponse> {
  const url = `/Blog/PublishedPagination?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  const resp = await api.get<PublishedResponse>(url);
  return resp.data;
}

export async function getUnpublishedBlogsAdmin(
  pageNumber = 1,
  pageSize = 10
): Promise<PublishedResponse> {
  const url = `/Blog/BlogUnpublishedPagination?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  const resp = await api.get<PublishedResponse>(url);
  return resp.data;
}

export const adminBlogService = {
  getPublishedBlogsAdmin,
  getUnpublishedBlogsAdmin,
  // Update blog by id (PUT /Blog/{id})
  updateBlog: async (
    id: number | string,
    payload: { title?: string; tag?: string; content?: string },
    options?: { skipLoading?: boolean }
  ) => {
    const headers: Record<string, string> = {};
    if (options?.skipLoading) headers['x-skip-loading'] = 'true';
    const resp = await api.put<
      import('@/features/user/forum/type').CreateBlogResponse
    >(`/Blog/${id}`, payload, { headers });
    return resp.data;
  },
  // Delete blog by id (DELETE /Blog/{id})
  deleteBlog: async (
    id: number | string,
    options?: { skipLoading?: boolean }
  ): Promise<{ success: boolean; message?: string; timestamp?: string }> => {
    const headers: Record<string, string> = {};
    if (options?.skipLoading) headers['x-skip-loading'] = 'true';
    const resp = await api.delete<{
      success: boolean;
      message?: string;
      timestamp?: string;
    }>(`/Blog/${id}`, { headers });
    return resp.data;
  },
};

export default adminBlogService;
