import type { RiasecQuestion } from '../types';
import type { AxiosResponse } from 'axios';
import api from '@/lib/axios';

// New API endpoint (absolute) provided by backend
const QUESTIONS_URL = '/Test/questions';

export async function getRiasecQuestions(): Promise<RiasecQuestion[]> {
  try {
    // The backend now returns an array of questions directly
    const response: AxiosResponse<RiasecQuestion[]> =
      await api.get(QUESTIONS_URL);
    const payload = response.data;

    if (Array.isArray(payload)) return payload as RiasecQuestion[];

    return [];
  } catch (error: unknown) {
    console.error('Failed to fetch RIASEC questions', error);
    throw error;
  }
}

const service = {
  getRiasecQuestions,
  startTest,
  submitTest,
  getTestDetail,
  getRoadmap,
  getSessionsByUser,
};

export default service;

// Submit test answers
export async function submitTest(
  payload: import('../types').SubmitRequest
): Promise<import('../types').SubmitResponse> {
  try {
    const response = await api.post('/Test/submit', payload);
    return response.data as import('../types').SubmitResponse;
  } catch (error: unknown) {
    console.error('Failed to submit RIASEC test', error);
    throw error;
  }
}

// Start a new test session for a user
export async function startTest(
  userId: number
): Promise<import('../types').TestSession> {
  try {
    // Use relative path; axios instance already has baseURL configured via env
    const response = await api.post('/Test/start', { userId });
    return response.data as import('../types').TestSession;
  } catch (error: unknown) {
    console.error('Failed to start RIASEC test', error);
    throw error;
  }
}

// Get test detail by sessionId and userId
export async function getTestDetail(
  sessionId: number,
  userId: number
): Promise<import('../types').TestHistory> {
  try {
    const response = await api.get(`/Test/history/${sessionId}/${userId}`);
    return response.data as import('../types').TestHistory;
  } catch (error: unknown) {
    console.error('Failed to fetch RIASEC test history', error);
    throw error;
  }
}

// Get roadmap for a session and user
export async function getRoadmap(
  sessionId: number,
  userId: number
): Promise<{
  careerField: { id: number; name: string; description?: string };
  paths: Array<{
    id: number;
    title: string;
    description?: string;
    careerFieldId: number;
    roadmaps: Array<{
      id: number;
      stepOrder: number;
      title: string;
      description?: string;
      skillFocus?: string;
      difficultyLevel?: string;
      durationWeeks?: number;
      suggestedCourseUrl?: string;
    }>;
  }>;
}> {
  try {
    const response = await api.get(`/Test/${sessionId}/roadmap/${userId}`);
    // Backend now returns careerField object and paths with roadmaps array
    return response.data;
  } catch (error: unknown) {
    console.error('Failed to fetch roadmap', error);
    throw error;
  }
}

// Get sessions list for a user (no answers)
export async function getSessionsByUser(
  userId: number
): Promise<import('../types').SessionList> {
  try {
    const response = await api.get(`/Test/sessions/${userId}`);
    return response.data as import('../types').SessionList;
  } catch (error: unknown) {
    console.error('Failed to fetch RIASEC sessions', error);
    throw error;
  }
}
