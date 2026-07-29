import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://internship-task-7bqo.onrender.com';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    const { accessToken, user } = response.data;
    await SecureStore.setItemAsync('token', accessToken);
    set({ user, token: accessToken, isAuthenticated: true, loading: false });
  },
  register: async (email, password, name?: string) => {
    const response = await axios.post(`${API_URL}/api/auth/register`, { email, password, name });
    const { accessToken, user } = response.data;
    await SecureStore.setItemAsync('token', accessToken);
    set({ user, token: accessToken, isAuthenticated: true, loading: false });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    set({ user: null, token: null, isAuthenticated: false, loading: false });
  },
  hydrate: async () => {
    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      set({ loading: false, isAuthenticated: false });
      return;
    }
    try {
      set({ token });
      const response = await axios.get(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      set({ user: response.data.user, isAuthenticated: true, loading: false });
    } catch (error: any) {
      console.warn('hydrate failed', error?.response?.status || error?.message || error);
      await SecureStore.deleteItemAsync('token');
      set({ user: null, token: null, isAuthenticated: false, loading: false });
    }
  }
}));

// add updateProfile via mutate
export const updateProfile = async (updates: { name?: string; email?: string; password?: string; avatarUrl?: string }) => {
  const token = useAuthStore.getState().token;
  if (!token) throw new Error('Not authenticated');
  const response = await axios.patch(`${API_URL}/api/auth/me`, updates, { headers: { Authorization: `Bearer ${token}` } });
  useAuthStore.setState({ user: response.data.user });
};
