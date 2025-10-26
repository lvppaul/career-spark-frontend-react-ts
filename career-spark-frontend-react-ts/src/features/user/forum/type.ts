export const BlogTag = {
  HuongNghiep: 'HuongNghiep',
  TongQuanNganh: 'TongQuanNganh',
  LoTrinhNgheNghiep: 'LoTrinhNgheNghiep',
  XuHuongNghe: 'XuHuongNghe',
  MoiTruongLamViec: 'MoiTruongLamViec',
  LoTrinhHocTap: 'LoTrinhHocTap',
  KyNangMem: 'KyNangMem',
  KyNangChuyenMon: 'KyNangChuyenMon',
  GiaoTiep: 'GiaoTiep',
  GiaiQuyetVanDe: 'GiaiQuyetVanDe',
  TimViec: 'TimViec',
  PhongVan: 'PhongVan',
  VietCV: 'VietCV',
  ThucTap: 'ThucTap',
  KinhNghiemLamViec: 'KinhNghiemLamViec',
  DongLuc: 'DongLuc',
  HieuSuat: 'HieuSuat',
  LanhDao: 'LanhDao',
  QuanLyThoiGian: 'QuanLyThoiGian',
  TuDuyPhatTrien: 'TuDuyPhatTrien',
  CongNgheAI: 'CongNgheAI',
  DuLieuVaPhanTich: 'DuLieuVaPhanTich',
  LamViecTuXa: 'LamViecTuXa',
  Freelancer: 'Freelancer',
  TuongLaiNgheNghiep: 'TuongLaiNgheNghiep',
} as const;

export type BlogTag = keyof typeof BlogTag;

export const BLOG_TAG_OPTIONS = [
  { value: BlogTag.HuongNghiep, label: 'Định hướng nghề nghiệp' },
  { value: BlogTag.TongQuanNganh, label: 'Tổng quan ngành nghề' },
  { value: BlogTag.LoTrinhNgheNghiep, label: 'Lộ trình nghề nghiệp' },
  { value: BlogTag.XuHuongNghe, label: 'Xu hướng nghề nghiệp' },
  { value: BlogTag.MoiTruongLamViec, label: 'Môi trường làm việc' },

  { value: BlogTag.LoTrinhHocTap, label: 'Lộ trình học tập' },
  { value: BlogTag.KyNangMem, label: 'Kỹ năng mềm' },
  { value: BlogTag.KyNangChuyenMon, label: 'Kỹ năng chuyên môn' },
  { value: BlogTag.GiaoTiep, label: 'Giao tiếp' },
  { value: BlogTag.GiaiQuyetVanDe, label: 'Giải quyết vấn đề' },

  { value: BlogTag.TimViec, label: 'Tìm việc làm' },
  { value: BlogTag.PhongVan, label: 'Phỏng vấn' },
  { value: BlogTag.VietCV, label: 'Viết CV & Hồ sơ' },
  { value: BlogTag.ThucTap, label: 'Thực tập & Cơ hội nghề nghiệp' },
  { value: BlogTag.KinhNghiemLamViec, label: 'Kinh nghiệm làm việc thực tế' },

  { value: BlogTag.DongLuc, label: 'Động lực & Cảm hứng' },
  { value: BlogTag.HieuSuat, label: 'Hiệu suất làm việc' },
  { value: BlogTag.LanhDao, label: 'Kỹ năng lãnh đạo' },
  { value: BlogTag.QuanLyThoiGian, label: 'Quản lý thời gian' },
  { value: BlogTag.TuDuyPhatTrien, label: 'Tư duy phát triển bản thân' },

  { value: BlogTag.CongNgheAI, label: 'Công nghệ & Trí tuệ nhân tạo' },
  { value: BlogTag.DuLieuVaPhanTich, label: 'Dữ liệu & Phân tích' },
  { value: BlogTag.LamViecTuXa, label: 'Làm việc từ xa' },
  { value: BlogTag.Freelancer, label: 'Freelancer & Nghề tự do' },
  { value: BlogTag.TuongLaiNgheNghiep, label: 'Tương lai nghề nghiệp' },
];

// Types for blog API
export interface BlogItem {
  id: number;
  authorId: number;
  authorName?: string;
  authorAvatarUrl?: string;
  title: string;
  tag: BlogTag | string;
  content: string;
  createAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface Pagination {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PublishedResponse {
  success: boolean;
  message?: string;
  data: BlogItem[];
  pagination: Pagination;
  timestamp?: string;
}

// Create blog request/response
export interface CreateBlogRequest {
  title: string;
  tag: string;
  content: string;
}

export interface CreateBlogResponse {
  success: boolean;
  message?: string;
  data: BlogItem;
  timestamp?: string;
}
