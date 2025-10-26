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
};

export default adminBlogService;
