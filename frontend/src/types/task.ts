export interface Task {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  completed: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskCreateRequest {
  title: string;
  estimatedPomodoros: number;
  notes?: string;
}

export interface TaskUpdateRequest {
  title?: string;
  estimatedPomodoros?: number;
  completedPomodoros?: number;
  completed?: boolean;
  notes?: string;
}

export interface TaskProgress {
  taskId: string;
  progress: number; // 0-100
  isCompleted: boolean;
} 