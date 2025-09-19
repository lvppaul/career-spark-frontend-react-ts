// Types for RIASEC Question Test
export type QuestionType =
  | 'Realistic'
  | 'Investigative'
  | 'Artistic'
  | 'Social'
  | 'Enterprising'
  | 'Conventional';

export interface RiasecQuestion {
  id: number;
  content: string;
  description: string | null;
  questionType: QuestionType;
  createAt: string; // ISO date
  updateAt: string | null; // ISO date or null
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp?: string;
}
