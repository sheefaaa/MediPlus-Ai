export interface User {
  id: number;
  full_name: string;
  email: string;
  age?: number | null;
  gender?: string | null;
  avatar_url?: string | null;
  notification_enabled: boolean;
  theme: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Medicine {
  id: number;
  user_id: number;
  medicine_name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string | null;
  reminder_time: string;
  category: string;
  notes?: string | null;
  status: string;
  created_at: string;
}

export interface Reminder {
  id: number;
  medicine_id: number;
  reminder_time: string;
  schedule_type: string;
  notification_status: string;
  completed: boolean;
  created_at: string;
  medicine_name?: string | null;
}

export interface DashboardData {
  today_count: number;
  missed_count: number;
  upcoming_count: number;
  active_medicines: number;
  completion_rate: number;
  today_medicines: Array<{
    id: number;
    medicine_name: string;
    dosage: string;
    reminder_time: string;
    status: string;
    category: string;
  }>;
  upcoming_reminders: Array<{
    id: number;
    medicine_id: number;
    medicine_name: string;
    reminder_time: string;
    completed: boolean;
    schedule_type: string;
  }>;
}

export interface AnalyticsData {
  completion_rate: number;
  active_medicines: number;
  missed_count: number;
  streak_counter: number;
  weekly_chart: Array<{ label: string; value: number }>;
  monthly_chart: Array<{ label: string; value: number }>;
}

export interface StatisticsData {
  users: number;
  medicines: number;
  reminders: number;
  completed_reminders: number;
}
