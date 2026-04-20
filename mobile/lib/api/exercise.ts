import apiClient from './client';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  exercise_type: {
    id: string;
    name: string;
    slug: string;
  };
  difficulty: string;
  question_count: number;
  pass_score: number;
  time_limit_seconds?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
}

export interface Question {
  id: string;
  question_text: string;
  question_type: string;
  hint_text: string;
  explanation: string;
  order_index: number;
  answers: Answer[];
}

export interface Answer {
  id: string;
  answer_text: string;
  is_correct: boolean;
  order_index: number;
}

export interface TestSession {
  id: string;
  exercise: Exercise;
  questions: Question[];
  started_at: string;
  status: string;
  total_questions: number;
  correct_answers?: number;
  score?: number;
  time_spent_seconds?: number;
}

export const exerciseApi = {
  getCategories: async (): Promise<{ categories: Category[] }> => {
    const response = await apiClient.get('/exercises/categories');
    return response.data;
  },

  getExercises: async (params?: {
    category_id?: string;
    difficulty?: string;
    page?: number;
    limit?: number;
  }): Promise<{ exercises: Exercise[]; page: number; limit: number }> => {
    const response = await apiClient.get('/exercises', { params });
    return response.data;
  },

  getExerciseById: async (id: string): Promise<Exercise> => {
    const response = await apiClient.get(`/exercises/${id}`);
    return response.data;
  },

  startTest: async (data: {
    exercise_id: string;
    device_info?: Record<string, any>;
  }): Promise<{ message: string; session: TestSession }> => {
    const response = await apiClient.post('/exercises/start', data);
    return response.data;
  },

  submitAnswer: async (
    sessionId: string,
    data: {
      question_id: string;
      answer_id?: string;
      answer_text?: string;
      is_hint_used: boolean;
      hint_type?: string;
      time_spent_seconds?: number;
    }
  ): Promise<{
    message: string;
    result: {
      test_answer: any;
      is_correct: boolean;
      correct_answer: Answer;
      explanation: string;
    };
  }> => {
    const response = await apiClient.post(`/exercises/${sessionId}/answer`, data);
    return response.data;
  },

  completeTest: async (data: {
    test_session_id: string;
  }): Promise<{ message: string; session: Partial<TestSession> }> => {
    const response = await apiClient.post('/exercises/complete', data);
    return response.data;
  },
};
