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

export interface TaskFormData {
  title: string;
  estimatedPomodoros: number;
  notes?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ValidationRules {
  title: {
    required: true;
    minLength: 1;
    maxLength: 100;
  };
  estimatedPomodoros: {
    min: 1;
    max: 20;
    default: 4;
  };
  notes: {
    maxLength: 500;
    optional: true;
  };
}

export interface TaskProgress {
  taskId: string;
  progress: number; // 0-100
  isCompleted: boolean;
}
