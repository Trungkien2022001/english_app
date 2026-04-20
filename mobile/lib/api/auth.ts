import apiClient from './client';

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
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<any> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<any> => {
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
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};
