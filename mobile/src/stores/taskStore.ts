import { create } from 'zustand';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { useAuthStore } from './authStore';

export interface TaskItem {
  _id: string;
  title: string;
  description?: string;
  dueDateTime?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  createdAt: string;
}

interface TaskState {
  tasks: TaskItem[];
  loading: boolean;
  filters: 'all' | 'pending' | 'completed';
  fetchTasks: () => Promise<void>;
  createTask: (payload: Partial<TaskItem>) => Promise<void>;
  updateTask: (id: string, updates: Partial<TaskItem>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFilter: (filter: 'all' | 'pending' | 'completed') => void;
  flushQueue?: () => Promise<void>;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.8:5000';

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  filters: 'all',
  fetchTasks: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ tasks: response.data });
      // flush queued tasks if any
      try {
        await (get().flushQueue?.() as any);
      } catch (err) {
        console.error('flushQueue failed', err);
      }
    } catch (error) {
      console.error('fetchTasks failed', error);
    } finally {
      set({ loading: false });
    }
  },
  createTask: async (payload) => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    try {
      const response = await axios.post(`${API_URL}/api/tasks`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ tasks: [response.data, ...get().tasks] });
      // schedule notification if dueDateTime
      if (response.data.dueDateTime) {
        try {
          const triggerDate = new Date(response.data.dueDateTime);
          if (triggerDate > new Date()) {
            await Notifications.scheduleNotificationAsync({ content: { title: 'Task due', body: response.data.title }, trigger: triggerDate });
          }
        } catch (err) {
          console.error('scheduling notification failed', err);
        }
      }
    } catch (err) {
      // offline or failed — queue the task locally
      try {
        const raw = await SecureStore.getItemAsync('taskQueue');
        const queue = raw ? JSON.parse(raw) : [];
        queue.push(payload);
        await SecureStore.setItemAsync('taskQueue', JSON.stringify(queue));
      } catch (e) {
        console.error('queue save failed', e);
      }
    }
  },
  updateTask: async (id, updates) => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    const response = await axios.patch(`${API_URL}/api/tasks/${id}`, updates, {
      headers: { Authorization: `Bearer ${token}` }
    });
    set({ tasks: get().tasks.map((task) => (task._id === id ? response.data : task)) });
  },
  deleteTask: async (id) => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    await axios.delete(`${API_URL}/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    set({ tasks: get().tasks.filter((task) => task._id !== id) });
  },
  setFilter: (filter) => set({ filters: filter }),
  clearTasks: () => set({ tasks: [] }),
  flushQueue: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    try {
      const raw = await SecureStore.getItemAsync('taskQueue');
      if (!raw) return;
      const queue: any[] = JSON.parse(raw);
      for (const item of queue) {
        try {
          const resp = await axios.post(`${API_URL}/api/tasks`, item, { headers: { Authorization: `Bearer ${token}` } });
          set({ tasks: [resp.data, ...get().tasks] });
        } catch (e) {
          console.error('flush item failed', e);
        }
      }
      await SecureStore.deleteItemAsync('taskQueue');
    } catch (err) {
      console.error('flushQueue error', err);
    }
  }
}));
