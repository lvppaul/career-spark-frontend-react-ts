import api from '@/lib/axios';
import type { PublishedResponse } from '../type';

/**
 * Fetch published blogs with pagination
 * @param pageNumber page index (1-based)
 * @param pageSize number of items per page
 */
export async function getPublishedBlogs(
  pageNumber = 1,
  pageSize = 10
): Promise<PublishedResponse> {
  const url = `/Blog/PublishedPagination?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  const resp = await api.get<PublishedResponse>(url);
  return resp.data;
}

export const forumService = {
  getPublishedBlogs,
};

export default forumService;
