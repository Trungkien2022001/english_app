import apiClient from './client';
import CONFIG from '../config';
import { localDataService } from './localData';
import { sqliteDB } from '../database/sqlite';

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

export interface TestHistoryItem {
  id: string;
  exercise: {
    id: string;
    title: string;
  };
  category_name: string;
  exercise_type: string;
  started_at: string;
  completed_at: string;
  total_questions: number;
  correct_answers: number;
  score: number;
  status: string;
}

export interface TestDetail {
  id: string;
  exercise: {
    title: string;
  };
  category_name: string;
  exercise_type: string;
  started_at: string;
  completed_at: string;
  total_questions: number;
  correct_answers: number;
  score: number;
  answers: Array<{
    question: {
      question_text: string;
      vocabulary?: {
        word: string;
        meaning: string;
        pronunciation: string;
        example_sentence: string;
      };
    };
    answer: {
      answer_text: string;
      is_correct: boolean;
    };
    is_correct: boolean;
    is_hint_used: boolean;
    time_spent_seconds: number;
    answered_at: string;
  }>;
}

export const exerciseApi = {
  getCategories: async (): Promise<{ categories: Category[] }> => {
    if (CONFIG.USE_LOCAL_DB) {
      await sqliteDB.init();
      const categories = await localDataService.getCategories();
      return { categories };
    }

    const response = await apiClient.get('/exercises/categories');
    return response.data;
  },

  getExercises: async (params?: {
    category_id?: string;
    difficulty?: string;
    page?: number;
    limit?: number;
  }): Promise<{ exercises: Exercise[]; page: number; limit: number }> => {
    if (CONFIG.USE_LOCAL_DB) {
      await sqliteDB.init();
      const exercises = await localDataService.getExercises();
      return { exercises, page: 1, limit: exercises.length };
    }

    const response = await apiClient.get('/exercises', { params });
    return response.data;
  },

  getExerciseById: async (id: string): Promise<Exercise> => {
    if (CONFIG.USE_LOCAL_DB) {
      await sqliteDB.init();
      const exercise = await localDataService.getExerciseById(id);
      return exercise;
    }

    const response = await apiClient.get(`/exercises/${id}`);
    return response.data;
  },

  startTest: async (data: {
    exercise_id: string;
    device_info?: Record<string, any>;
  }): Promise<{ message: string; session: TestSession }> => {
    if (CONFIG.USE_LOCAL_DB) {
      await sqliteDB.init();
      const session = await localDataService.createTestSession(data.exercise_id);
      return { message: 'Test started', session };
    }

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
    if (CONFIG.USE_LOCAL_DB) {
      const result = await localDataService.submitAnswer(
        sessionId,
        data.question_id,
        data.answer_id || '',
        data.is_hint_used
      );
      return { message: 'Answer submitted', result };
    }

    const response = await apiClient.post(`/exercises/${sessionId}/answer`, data);
    return response.data;
  },

  completeTest: async (data: {
    test_session_id: string;
  }): Promise<{ message: string; session: Partial<TestSession> }> => {
    if (CONFIG.USE_LOCAL_DB) {
      const result = await localDataService.completeTestSession(data.test_session_id);
      return { message: 'Test completed', session: result.session };
    }

    const response = await apiClient.post('/exercises/complete', data);
    return response.data;
  },

  getHistoryTests: async (): Promise<{ history: TestHistoryItem[] }> => {
    if (CONFIG.USE_LOCAL_DB) {
      await sqliteDB.init();
      const history = await localDataService.getTestHistory();
      return { history };
    }

    const response = await apiClient.get('/history/tests');
    return response.data;
  },

  getHistoryDetail: async (sessionId: string): Promise<TestDetail> => {
    if (CONFIG.USE_LOCAL_DB) {
      await sqliteDB.init();
      const detail = await localDataService.getTestSessionDetail(sessionId);
      return detail;
    }

    const response = await apiClient.get(`/history/tests/${sessionId}`);
    return response.data;
  },
};
