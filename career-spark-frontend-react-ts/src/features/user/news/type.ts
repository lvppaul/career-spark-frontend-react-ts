export const NewsTag = {
  DoiSong: 'Đời sống',
  KhoaHocCongNghe: 'Khoa học công nghệ',
  ThoiSu: 'Thời sự',
  KinhDoanh: 'Kinh doanh',
  TheGioi: 'Thế giới',
} as const;

export type NewsTag = keyof typeof NewsTag;

export const NEWS_TAG_OPTIONS = [
  { value: NewsTag.DoiSong, label: 'Đời sống' },
  { value: NewsTag.KhoaHocCongNghe, label: 'Khoa học công nghệ' },
  { value: NewsTag.ThoiSu, label: 'Thời sự' },
  { value: NewsTag.KinhDoanh, label: 'Kinh doanh' },
  { value: NewsTag.TheGioi, label: 'Thế giới' },
];
