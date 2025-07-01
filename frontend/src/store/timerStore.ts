import { create } from 'zustand';
import type {
  TimerStore,
  TimerMode,
  TimerSettings,
  Session,
  Task,
} from '../types/timer';
import { isToday } from '../utils/timeFormatter';

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 1500,
  shortBreakDuration: 300,
  longBreakDuration: 900,
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartWork: false,
  soundEnabled: true,
  notificationsEnabled: true,
};

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const STORAGE_KEY = 'pomodoro-timer-state';

let timerInterval: NodeJS.Timeout | null = null;

const getDurationForMode = (
  mode: TimerMode,
  settings: TimerSettings
): number => {
  switch (mode) {
    case 'work':
      return settings.workDuration;
    case 'shortBreak':
      return settings.shortBreakDuration;
    case 'longBreak':
      return settings.longBreakDuration;
    default:
      return settings.workDuration;
  }
};

const clearExistingTimer = (): void => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

const recalculateStatistics = (
  sessions: Session[]
): {
  todayWorkTime: number;
  todayCompletedSessions: number;
  totalWorkTime: number;
} => {
  const todaySessions = sessions.filter(
    session => isToday(session.completedAt) && session.mode === 'work'
  );

  const todayWorkTime = todaySessions.reduce(
    (total, session) => total + session.duration,
    0
  );
  const todayCompletedSessions = todaySessions.length;
  const totalWorkTime = sessions
    .filter(session => session.mode === 'work')
    .reduce((total, session) => total + session.duration, 0);

  return { todayWorkTime, todayCompletedSessions, totalWorkTime };
};

export const useTimerStore = create<TimerStore>((set, get) => ({
  // Initial state
  currentMode: 'work',
  status: 'idle',
  remainingTime: 1500,
  duration: 1500,
  currentSessionId: null,
  sessionsCompleted: 0,
  settings: DEFAULT_SETTINGS,
  completedSessions: [],
  currentTask: null,
  tasks: [],
  todayWorkTime: 0,
  totalWorkTime: 0,
  todayCompletedSessions: 0,

  // Timer controls
  startTimer: () => {
    const state = get();

    if (state.status === 'running') return;

    const sessionId = state.currentSessionId || generateId();

    set({
      status: 'running',
      currentSessionId: sessionId,
    });

    clearExistingTimer();

    // Start countdown
    timerInterval = setInterval(() => {
      const currentState = get();

      if (currentState.status !== 'running') {
        clearExistingTimer();
        return;
      }

      const newRemainingTime = currentState.remainingTime - 1;

      if (newRemainingTime <= 0) {
        // Auto-complete session when timer reaches zero
        get().completeSession();
      } else {
        set({ remainingTime: newRemainingTime });
      }
    }, 1000);
  },

  pauseTimer: () => {
    clearExistingTimer();
    set({ status: 'paused' });
  },

  resetTimer: () => {
    clearExistingTimer();

    const state = get();
    const duration = getDurationForMode(state.currentMode, state.settings);

    set({
      status: 'idle',
      remainingTime: duration,
      currentSessionId: null,
    });
  },

  completeSession: () => {
    clearExistingTimer();

    const state = get();

    if (!state.currentSessionId) return;

    const session: Session = {
      id: state.currentSessionId,
      mode: state.currentMode,
      duration: state.duration,
      completedAt: new Date(),
      taskId: state.currentTask?.id,
    };

    const newCompletedSessions = [...state.completedSessions, session];
    const newSessionsCompleted = state.sessionsCompleted + 1;

    // Calculate work time statistics
    const stats = recalculateStatistics(newCompletedSessions);

    // Update task progress if there's a current task
    let updatedTasks = state.tasks;
    if (state.currentTask && state.currentMode === 'work') {
      updatedTasks = state.tasks.map(task =>
        task.id === state.currentTask?.id
          ? { ...task, completedPomodoros: task.completedPomodoros + 1 }
          : task
      );
    }

    set({
      status: 'completed',
      completedSessions: newCompletedSessions,
      sessionsCompleted: newSessionsCompleted,
      todayWorkTime: stats.todayWorkTime,
      totalWorkTime: stats.totalWorkTime,
      todayCompletedSessions: stats.todayCompletedSessions,
      tasks: updatedTasks,
      currentSessionId: null,
    });

    // Auto-save to storage
    setTimeout(() => get().saveToStorage(), 0);
  },

  switchMode: (mode: TimerMode) => {
    clearExistingTimer();

    const state = get();
    const duration = getDurationForMode(mode, state.settings);

    set({
      currentMode: mode,
      status: 'idle',
      remainingTime: duration,
      duration: duration,
      currentSessionId: null,
    });
  },

  // Settings
  updateSettings: (newSettings: Partial<TimerSettings>) => {
    const state = get();
    const updatedSettings = { ...state.settings, ...newSettings };

    // Update current timer duration if mode settings changed
    const updates: {
      settings: TimerSettings;
      duration?: number;
      remainingTime?: number;
    } = { settings: updatedSettings };

    const currentModeDurationKey =
      state.currentMode === 'work'
        ? 'workDuration'
        : state.currentMode === 'shortBreak'
          ? 'shortBreakDuration'
          : 'longBreakDuration';

    if (newSettings[currentModeDurationKey] !== undefined) {
      const newDuration = newSettings[currentModeDurationKey]!;
      updates.duration = newDuration;
      if (state.status === 'idle') {
        updates.remainingTime = newDuration;
      }
    }

    set(updates);

    // Auto-save to storage
    setTimeout(() => get().saveToStorage(), 0);
  },

  // Task management
  addTask: taskData => {
    const state = get();
    const newTask: Task = {
      id: generateId(),
      title: taskData.title,
      estimatedPomodoros: taskData.estimatedPomodoros,
      completedPomodoros: 0,
      completed: false,
      notes: taskData.notes,
      createdAt: new Date(),
    };

    set({
      tasks: [...state.tasks, newTask],
    });

    // Auto-save to storage
    setTimeout(() => get().saveToStorage(), 0);
  },

  updateTask: (taskId: string, updates: Partial<Task>) => {
    const state = get();
    const updatedTasks = state.tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );

    // Update current task if it's the one being updated
    const updatedCurrentTask =
      state.currentTask?.id === taskId
        ? { ...state.currentTask, ...updates }
        : state.currentTask;

    set({
      tasks: updatedTasks,
      currentTask: updatedCurrentTask,
    });

    // Auto-save to storage
    setTimeout(() => get().saveToStorage(), 0);
  },

  deleteTask: (taskId: string) => {
    const state = get();
    const filteredTasks = state.tasks.filter(task => task.id !== taskId);

    // Clear current task if it's the one being deleted
    const updatedCurrentTask =
      state.currentTask?.id === taskId ? null : state.currentTask;

    set({
      tasks: filteredTasks,
      currentTask: updatedCurrentTask,
    });

    // Auto-save to storage
    setTimeout(() => get().saveToStorage(), 0);
  },

  setCurrentTask: (taskId: string | null) => {
    const state = get();
    const task = taskId ? state.tasks.find(t => t.id === taskId) || null : null;

    set({
      currentTask: task,
    });

    // Auto-save to storage
    setTimeout(() => get().saveToStorage(), 0);
  },

  completeTask: (taskId: string) => {
    get().updateTask(taskId, { completed: true });
  },

  // Data persistence
  saveToStorage: () => {
    try {
      const state = get();
      const dataToSave = {
        settings: state.settings,
        tasks: state.tasks,
        completedSessions: state.completedSessions,
        totalWorkTime: state.totalWorkTime,
        todayWorkTime: state.todayWorkTime,
        todayCompletedSessions: state.todayCompletedSessions,
        sessionsCompleted: state.sessionsCompleted,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  loadFromStorage: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const data = JSON.parse(saved);

      // Convert date strings back to Date objects
      const completedSessions = (data.completedSessions || []).map(
        (session: {
          id: string;
          mode: TimerMode;
          duration: number;
          completedAt: string;
          taskId?: string;
        }) => ({
          ...session,
          completedAt: new Date(session.completedAt),
        })
      );

      const tasks = (data.tasks || []).map(
        (task: {
          id: string;
          title: string;
          estimatedPomodoros: number;
          completedPomodoros: number;
          completed: boolean;
          notes?: string;
          createdAt: string;
        }) => ({
          ...task,
          createdAt: new Date(task.createdAt),
        })
      );

      // Recalculate today's stats in case the date has changed
      const stats = recalculateStatistics(completedSessions);

      set({
        settings: { ...DEFAULT_SETTINGS, ...data.settings },
        tasks,
        completedSessions,
        totalWorkTime: data.totalWorkTime || stats.totalWorkTime,
        todayWorkTime: stats.todayWorkTime,
        todayCompletedSessions: stats.todayCompletedSessions,
        sessionsCompleted: data.sessionsCompleted || 0,
      });
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      // Don't throw - gracefully handle invalid data
    }
  },
}));
