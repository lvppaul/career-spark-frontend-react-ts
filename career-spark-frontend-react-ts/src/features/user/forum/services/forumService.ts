import api from '@/lib/axios';
import type { PublishedResponse, CreateBlogResponse } from '../type';

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

export async function createBlog(payload: {
  title: string;
  tag: string;
  content: string;
}) {
  const url = `/Blog`;
  const resp = await api.post(url, payload);
  return resp.data;
}

/**
 * Fetch a single blog by id
 * @param id blog id
 */
export async function getBlogById(id: number) {
  const url = `/Blog/${id}`;
  const resp = await api.get<CreateBlogResponse>(url);
  return resp.data;
}

/**
 * Publish a blog (PATCH /Blog/{id}/publish)
 * @param id blog id
 */
export async function publishBlog(id: number | string) {
  const url = `/Blog/${id}/publish`;
  // Debug log to help trace requests during development

  // use patch to match server swagger
  const resp = await api.patch<{ success: boolean; message: string }>(url);
  return resp.data;
}

/**
 * Unpublish a blog (PATCH /Blog/{id}/unpublish)
 * @param id blog id
 */
export async function unpublishBlog(id: number | string) {
  const url = `/Blog/${id}/unpublish`;
  // Debug log to help trace requests during development

  const resp = await api.patch<{ success: boolean; message: string }>(url);
  return resp.data;
}

export const forumService = {
  getPublishedBlogs,
  createBlog,
  getBlogById,
  publishBlog,
  unpublishBlog,
};

export default forumService;
