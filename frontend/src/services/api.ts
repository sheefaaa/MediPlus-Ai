import axios from "axios";

import type {
  AnalyticsData,
  AuthResponse,
  DashboardData,
  Medicine,
  Reminder,
  StatisticsData,
  User,
} from "../lib/types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const authService = {
  register: async (payload: {
    full_name: string;
    email: string;
    password: string;
    age?: number;
    gender?: string;
  }) => (await api.post<AuthResponse>("/register", payload)).data,
  login: async (payload: { email: string; password: string }) =>
    (await api.post<AuthResponse>("/login", payload)).data,
  profile: async () => (await api.get<User>("/profile")).data,
  updateProfile: async (payload: Record<string, unknown>) =>
    (await api.put<User>("/profile", payload)).data,
};

export const medicineService = {
  list: async (params?: { search?: string; category?: string; status?: string }) =>
    (await api.get<Medicine[]>("/medicines", { params })).data,
  create: async (payload: Omit<Medicine, "id" | "user_id" | "created_at">) =>
    (await api.post<Medicine>("/medicines", payload)).data,
  update: async (id: number, payload: Partial<Medicine>) =>
    (await api.put<Medicine>(`/medicines/${id}`, payload)).data,
  remove: async (id: number) => api.delete(`/medicines/${id}`),
};

export const reminderService = {
  list: async () => (await api.get<Reminder[]>("/reminders")).data,
  create: async (payload: {
    medicine_id: number;
    reminder_time: string;
    schedule_type: string;
    notification_status: string;
    completed: boolean;
  }) => (await api.post<Reminder>("/reminders", payload)).data,
  update: async (id: number, payload: Partial<Reminder>) =>
    (await api.put<Reminder>(`/reminders/${id}`, payload)).data,
  remove: async (id: number) => api.delete(`/reminders/${id}`),
};

export const analyticsService = {
  dashboard: async () => (await api.get<DashboardData>("/dashboard")).data,
  analytics: async () => (await api.get<AnalyticsData>("/analytics")).data,
  statistics: async () => (await api.get<StatisticsData>("/statistics")).data,
};
