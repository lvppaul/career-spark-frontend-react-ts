import api from '../../../../lib/axios';
import type { RiasecQuestion, ApiResponse } from '../types';
import type { AxiosResponse } from 'axios';

const BASE_URL = '/QuestionTest';

export async function getRiasecQuestions(): Promise<RiasecQuestion[]> {
  try {
    const response: AxiosResponse<
      ApiResponse<RiasecQuestion[]> | RiasecQuestion[]
    > = await api.get(BASE_URL);

    const payload = response.data;

    // If the backend returns an object with a data field
    if (
      typeof payload === 'object' &&
      payload !== null &&
      'data' in payload &&
      Array.isArray((payload as ApiResponse<RiasecQuestion[]>).data)
    ) {
      return (payload as ApiResponse<RiasecQuestion[]>).data;
    }

    // If the backend returns the array directly
    if (Array.isArray(payload)) return payload as RiasecQuestion[];

    return [];
  } catch (error: unknown) {
    // Keep logging style consistent
    console.error('Failed to fetch RIASEC questions', error);
    throw error;
  }
}

export default {
  getRiasecQuestions,
};
