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
  questionType: QuestionType;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp?: string;
}

// Session info returned when starting a test
export interface TestSession {
  sessionId: number;
  startAt: string; // ISO datetime string
}

// Submit answer types
export interface RiasecAnswer {
  questionId: number;
  isSelected: boolean;
}

export interface SubmitRequest {
  userId: number;
  sessionId: number;
  answers: RiasecAnswer[];
}

export interface SuggestedCareerField {
  id: number;
  name: string;
  description?: string;
}

export interface SubmitResponse {
  r: number;
  i: number;
  a: number;
  s: number;
  e: number;
  c: number;
  r_Normalized: number;
  i_Normalized: number;
  a_Normalized: number;
  s_Normalized: number;
  e_Normalized: number;
  c_Normalized: number;
  suggestedCareerFields: SuggestedCareerField[];
}

// History types
export interface HistoryAnswer {
  questionId: number;
  questionContent: string;
  questionType: QuestionType;
  isSelected: boolean;
}

export interface TestHistory {
  sessionId: number;
  userId: number;
  startAt: string;
  answers: HistoryAnswer[];
}

// Session summary for sessions list (no answers)
export interface SessionSummary {
  sessionId: number;
  startAt: string;
}

export type SessionList = SessionSummary[];
