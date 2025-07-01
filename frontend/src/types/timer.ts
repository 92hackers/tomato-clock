export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface Session {
  id: string;
  mode: TimerMode;
  duration: number; // in seconds
  completedAt: Date;
  taskId?: string;
}

export interface Task {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  completed: boolean;
  notes?: string;
  createdAt: Date;
}

export interface TimerSettings {
  workDuration: number; // in seconds (default: 1500 = 25 minutes)
  shortBreakDuration: number; // in seconds (default: 300 = 5 minutes)
  longBreakDuration: number; // in seconds (default: 900 = 15 minutes)
  sessionsUntilLongBreak: number; // default: 4
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface TimerState {
  // Current timer state
  currentMode: TimerMode;
  status: TimerStatus;
  remainingTime: number; // in seconds
  duration: number; // current session duration in seconds

  // Session tracking
  currentSessionId: string | null;
  sessionsCompleted: number;

  // Settings
  settings: TimerSettings;

  // History and stats
  completedSessions: Session[];
  currentTask: Task | null;
  tasks: Task[];

  // Computed stats
  todayWorkTime: number; // in seconds
  totalWorkTime: number; // in seconds
  todayCompletedSessions: number;
}

export interface TimerActions {
  // Timer controls
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  completeSession: () => void;
  switchMode: (mode: TimerMode) => void;

  // Settings
  updateSettings: (settings: Partial<TimerSettings>) => void;

  // Tasks
  addTask: (
    task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedPomodoros'>
  ) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  setCurrentTask: (taskId: string | null) => void;
  completeTask: (taskId: string) => void;

  // Data management
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

export type TimerStore = TimerState & TimerActions;
