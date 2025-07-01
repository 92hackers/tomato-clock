/**
 * 通用类型定义
 */

// 用户相关类型
export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  timezone: string;
  created_at: Date;
  updated_at: Date;
}

// 任务相关类型
export interface Task {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  estimated_pomodoros: number;
  completed_pomodoros: number;
  status: 'pending' | 'in_progress' | 'completed' | 'archived';
  priority: number;
  tags: string[];
  due_date?: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// 计时器相关类型
export interface TimerSession {
  id: number;
  user_id: number;
  task_id?: number;
  session_type: 'focus' | 'short_break' | 'long_break';
  duration: number;
  completed_duration: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  started_at: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// 统计相关类型
export interface DailyStats {
  date: Date;
  user_id: number;
  completed_pomodoros: number;
  focus_time: number;
  completed_tasks: number;
  break_time: number;
  efficiency_score: number;
}

// 成就相关类型
export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  type: 'daily' | 'weekly' | 'milestone' | 'streak';
  points: number;
  created_at: Date;
}

export interface UserAchievement {
  id: number;
  user_id: number;
  achievement_id: number;
  unlocked_at: Date;
  achievement: Achievement;
}

// 表单相关类型
export interface CreateTaskRequest {
  title: string;
  description?: string;
  estimated_pomodoros: number;
  priority?: number;
  tags?: string[];
  due_date?: Date;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  estimated_pomodoros?: number;
  priority?: number;
  tags?: string[];
  due_date?: Date;
  status?: 'pending' | 'in_progress' | 'completed' | 'archived';
}

// 计时器模式类型
export type TimerMode = 'focus' | 'short_break' | 'long_break';

// 计时器状态类型
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

// 用户设置类型
export interface UserSettings {
  focus_duration: number;
  short_break_duration: number;
  long_break_duration: number;
  long_break_interval: number;
  auto_start_breaks: boolean;
  auto_start_focus: boolean;
  sound_enabled: boolean;
  sound_volume: number;
  notifications_enabled: boolean;
  theme: 'light' | 'dark' | 'auto';
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}
