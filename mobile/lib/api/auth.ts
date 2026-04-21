import apiClient from './client';
import { useLocalDatabase } from '../config/dataSource';
import { localDatabase } from '../data/localDatabase';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface AuthResponse {
  tokens: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  };
  user: {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string;
    level: string;
    total_xp: number;
    streak_days: number;
    is_verified: boolean;
    created_at: string;
  };
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    if (useLocalDatabase) {
      return localDatabase.login(data.email, data.password);
    }

    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<any> => {
    if (useLocalDatabase) {
      return localDatabase.register(data.email, data.password, data.full_name);
    }

    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<any> => {
    if (useLocalDatabase) {
      return localDatabase.getCurrentUser();
    }

    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<any> => {
    const response = await apiClient.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  logout: async (): Promise<any> => {
    if (useLocalDatabase) {
      return localDatabase.logout();
    }

    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};
