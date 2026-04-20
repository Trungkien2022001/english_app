import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '../api/auth';

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  level: string;
  total_xp: number;
  streak_days: number;
  is_verified: boolean;
  created_at: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (
    tokens: { access_token: string; refresh_token: string },
    user: User
  ) => Promise<void>;
  setUser: (user: User) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    full_name?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,

  setAuth: async (tokens, user) => {
    try {
      await SecureStore.setItemAsync('access_token', tokens.access_token);
      await SecureStore.setItemAsync('refresh_token', tokens.refresh_token);
    } catch (error) {
      console.error('Error saving tokens to secure store:', error);
    }

    set({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      user,
      isAuthenticated: true,
    });
  },

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login({ email, password });
      await get().setAuth(response.tokens, response.user);
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email, password, full_name) => {
    set({ isLoading: true });
    try {
      await authApi.register({ email, password, full_name });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      try {
        await SecureStore.deleteItemAsync('access_token');
        await SecureStore.deleteItemAsync('refresh_token');
      } catch (error) {
        console.error('Error clearing tokens:', error);
      }
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    }
  },

  loadUser: async () => {
    const { accessToken } = get();
    if (!accessToken) return;

    set({ isLoading: true });
    try {
      const user = await authApi.getCurrentUser();
      set({ user, isAuthenticated: true });
    } catch (error) {
      // Token might be expired, clear auth
      try {
        await SecureStore.deleteItemAsync('access_token');
        await SecureStore.deleteItemAsync('refresh_token');
      } catch (e) {
        console.error('Error clearing tokens:', e);
      }
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
