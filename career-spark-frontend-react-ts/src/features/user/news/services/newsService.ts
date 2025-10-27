import api from '@/lib/axios';

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  isActive: boolean;
  tag?: string;
  imageUrl?: string;
  avatarPublicId?: string;
}

export interface NewsResponse {
  success: boolean;
  message: string;
  data: NewsItem[];
  timestamp?: string;
}

export async function getAllActiveNews(): Promise<NewsResponse> {
  const resp = await api.get<NewsResponse>('/News/GetAllActiveNews');
  return resp.data;
}

export interface NewsByIdResponse {
  success: boolean;
  message: string;
  data: NewsItem | null;
  timestamp?: string;
}

export async function getNewsById(id: number): Promise<NewsByIdResponse> {
  const resp = await api.get<NewsByIdResponse>(`/News/${id}`);
  return resp.data;
}

export interface CreateNewsRequest {
  title: string;
  content: string;
  tag?: string;
  // optional image file to upload when creating the news
  imageFile?: File | null;
}

export interface CreateNewsResponse {
  success: boolean;
  message: string;
  data: NewsItem;
  timestamp?: string;
}

export interface UpdateNewsRequest {
  title?: string;
  content?: string;
  tag?: string;
  imageFile?: File | null;
}

export interface UpdateNewsResponse {
  success: boolean;
  message: string;
  data: NewsItem;
  timestamp?: string;
}

export interface DeleteNewsResponse {
  // Some APIs return 204 No Content; others return a success message.
  success?: boolean;
  message?: string;
  timestamp?: string;
}

export async function createNews(
  body: CreateNewsRequest
): Promise<CreateNewsResponse> {
  // If an image file is provided, send as multipart/form-data
  if (body.imageFile) {
    const form = new FormData();
    form.append('Title', body.title);
    form.append('Content', body.content);
    if (body.tag) form.append('Tag', body.tag);
    form.append('ImageFile', body.imageFile);

    const resp = await api.post<CreateNewsResponse>('/News/create', form, {
      headers: {
        // Let the browser set Content-Type with boundary; axios will handle it.
      },
    });
    return resp.data;
  }

  // Fallback: send JSON when no file is attached
  const resp = await api.post<CreateNewsResponse>('/News/create', {
    title: body.title,
    content: body.content,
    tag: body.tag,
  });
  return resp.data;
}

export async function updateNews(
  id: number,
  body: UpdateNewsRequest
): Promise<UpdateNewsResponse> {
  // If an image file is provided, send as multipart/form-data
  if (body.imageFile) {
    const form = new FormData();
    if (body.title) form.append('Title', body.title);
    if (body.content) form.append('Content', body.content);
    if (body.tag) form.append('Tag', body.tag);
    form.append('ImageFile', body.imageFile);

    const resp = await api.put<UpdateNewsResponse>(`/News/${id}`, form, {
      headers: {
        // Let axios/browser set Content-Type with boundary
      },
    });
    return resp.data;
  }

  // Fallback: send JSON when no file is attached
  const resp = await api.put<UpdateNewsResponse>(`/News/${id}`, {
    title: body.title,
    content: body.content,
    tag: body.tag,
  });
  return resp.data;
}

export async function deleteNews(id: number): Promise<DeleteNewsResponse> {
  // Many servers return 204 No Content for DELETE.
  // We'll attempt to call DELETE and return resp.data if present.
  const resp = await api.delete<DeleteNewsResponse>(`/News/${id}`);
  return resp.data ?? {};
}

export const newsService = {
  getAllActiveNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
};

export default newsService;
