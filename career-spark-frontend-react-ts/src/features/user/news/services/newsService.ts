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

export const newsService = {
  getAllActiveNews,
  getNewsById,
};

export default newsService;
