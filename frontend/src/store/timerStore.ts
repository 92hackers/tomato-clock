import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  TimerStore,
  TimerMode,
  TimerSettings,
  Session,
  Task,
} from '../types/timer';
import { isToday } from '../utils/timeFormatter';

interface TimerState {
  // Core timer state
  timeLeft: number;
  currentMode: TimerMode;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  
  // Session tracking
  currentSession: number;
  sessionsUntilLongBreak: number;
  completedCycles: number;
  
  // Statistics
  todayPomodoros: number;
  todayWorkTime: number;
  
  // Settings
  settings: TimerSettings;
  
  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  completeTimer: () => void;
  switchMode: (mode: TimerMode) => void;
  updateSettings: (settings: Partial<TimerSettings>) => void;
  
  // Internal state management
  setState: (updates: Partial<TimerState>) => void;
  
  // Getters
  getTimerState: () => TimerStore;
  getCurrentProgress: () => number;
}

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25 * 60, // 25 minutes
  shortBreakDuration: 5 * 60, // 5 minutes
  longBreakDuration: 15 * 60, // 15 minutes
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
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

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      // Initial state
      timeLeft: DEFAULT_SETTINGS.workDuration,
      currentMode: 'work',
      isRunning: false,
      isPaused: false,
      isCompleted: false,
      currentSession: 1,
      sessionsUntilLongBreak: DEFAULT_SETTINGS.sessionsUntilLongBreak,
      completedCycles: 0,
      todayPomodoros: 0,
      todayWorkTime: 0,
      settings: DEFAULT_SETTINGS,

      // Actions
      startTimer: () => {
        set((state) => ({
          isRunning: true,
          isPaused: false,
          isCompleted: false,
        }));
      },

      pauseTimer: () => {
        set((state) => ({
          isRunning: false,
          isPaused: true,
        }));
      },

      resetTimer: () => {
        const state = get();
        const duration = 
          state.currentMode === 'work' ? state.settings.workDuration :
          state.currentMode === 'shortBreak' ? state.settings.shortBreakDuration :
          state.settings.longBreakDuration;

        set({
          timeLeft: duration,
          isRunning: false,
          isPaused: false,
          isCompleted: false,
        });
      },

      completeTimer: () => {
        const state = get();
        let updates: Partial<TimerState> = {
          isRunning: false,
          isPaused: false,
          isCompleted: true,
        };

        if (state.currentMode === 'work') {
          // Completed a work session
          updates.todayPomodoros = state.todayPomodoros + 1;
          updates.todayWorkTime = state.todayWorkTime + (state.settings.workDuration - state.timeLeft);
          updates.completedCycles = state.completedCycles + 1;
          
          // Automatically switch to break
          if (state.currentSession >= state.settings.sessionsUntilLongBreak) {
            updates.currentMode = 'longBreak';
            updates.timeLeft = state.settings.longBreakDuration;
            updates.currentSession = 1;
            updates.sessionsUntilLongBreak = state.settings.sessionsUntilLongBreak;
          } else {
            updates.currentMode = 'shortBreak';
            updates.timeLeft = state.settings.shortBreakDuration;
            updates.currentSession = state.currentSession + 1;
            updates.sessionsUntilLongBreak = state.sessionsUntilLongBreak - 1;
          }
        } else {
          // Completed a break session, switch back to work
          updates.currentMode = 'work';
          updates.timeLeft = state.settings.workDuration;
        }

        set(updates);
        
        // Auto-start next session if enabled
        if (
          (state.currentMode === 'work' && state.settings.autoStartBreaks) ||
          (state.currentMode !== 'work' && state.settings.autoStartPomodoros)
        ) {
          setTimeout(() => {
            get().startTimer();
          }, 1000);
        }
      },

      switchMode: (mode: TimerMode) => {
        const state = get();
        if (state.isRunning) return; // Don't allow switching while running

        const duration = 
          mode === 'work' ? state.settings.workDuration :
          mode === 'shortBreak' ? state.settings.shortBreakDuration :
          state.settings.longBreakDuration;

        set({
          currentMode: mode,
          timeLeft: duration,
          isRunning: false,
          isPaused: false,
          isCompleted: false,
        });
      },

      updateSettings: (newSettings: Partial<TimerSettings>) => {
        const state = get();
        const updatedSettings = { ...state.settings, ...newSettings };
        
        set((state) => ({
          settings: updatedSettings,
          // Update current timer if not running
          ...((!state.isRunning) && {
            timeLeft: 
              state.currentMode === 'work' ? updatedSettings.workDuration :
              state.currentMode === 'shortBreak' ? updatedSettings.shortBreakDuration :
              updatedSettings.longBreakDuration
          })
        }));
      },

      setState: (updates: Partial<TimerState>) => {
        set((state) => ({ ...state, ...updates }));
      },

      // Getters
      getTimerState: (): TimerStore => {
        const state = get();
        return {
          timeLeft: state.timeLeft,
          currentMode: state.currentMode,
          isRunning: state.isRunning,
          isPaused: state.isPaused,
          isIdle: !state.isRunning && !state.isPaused && !state.isCompleted,
          isCompleted: state.isCompleted,
          currentSession: state.currentSession,
          sessionsUntilLongBreak: state.sessionsUntilLongBreak,
          completedCycles: state.completedCycles,
          todayPomodoros: state.todayPomodoros,
          todayWorkTime: state.todayWorkTime,
          settings: state.settings,
        };
      },

      getCurrentProgress: (): number => {
        const state = get();
        const totalDuration = 
          state.currentMode === 'work' ? state.settings.workDuration :
          state.currentMode === 'shortBreak' ? state.settings.shortBreakDuration :
          state.settings.longBreakDuration;
        
        return ((totalDuration - state.timeLeft) / totalDuration) * 100;
      },
    }),
    {
      name: 'timer-storage',
      partialize: (state) => ({
        currentMode: state.currentMode,
        currentSession: state.currentSession,
        sessionsUntilLongBreak: state.sessionsUntilLongBreak,
        completedCycles: state.completedCycles,
        todayPomodoros: state.todayPomodoros,
        todayWorkTime: state.todayWorkTime,
        settings: state.settings,
      }),
    }
  )
);
