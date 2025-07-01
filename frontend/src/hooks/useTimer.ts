import { useEffect, useCallback } from 'react';
import { useTimerStore } from '../store/timerStore';
import type { TimerMode } from '../types/timer';
import { formatTime, calculateProgress } from '../utils/timeFormatter';

/**
 * Custom hook for timer functionality
 * Provides a clean interface for timer operations and computed values
 */
export const useTimer = () => {
  const {
    // State
    currentMode,
    status,
    remainingTime,
    duration,
    currentSessionId,
    sessionsCompleted,
    settings,
    currentTask,
    todayWorkTime,
    todayCompletedSessions,

    // Actions
    startTimer,
    pauseTimer,
    resetTimer,
    completeSession,
    switchMode,
    updateSettings,
    loadFromStorage,
    saveToStorage,
  } = useTimerStore();

  // Load data from storage on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Auto-save periodically
  useEffect(() => {
    const interval = setInterval(() => {
      saveToStorage();
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [saveToStorage]);

  // Computed values
  const formattedTime = formatTime(remainingTime);
  const progress = calculateProgress(duration - remainingTime, duration);
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isIdle = status === 'idle';
  const isCompleted = status === 'completed';

  // Mode-specific information
  const modeInfo = {
    work: {
      label: '专注',
      duration: settings.workDuration,
      color: 'orange',
      description: '专注工作时间',
    },
    shortBreak: {
      label: '短休息',
      duration: settings.shortBreakDuration,
      color: 'green',
      description: '短暂休息时间',
    },
    longBreak: {
      label: '长休息',
      duration: settings.longBreakDuration,
      color: 'blue',
      description: '长时间休息',
    },
  };

  const currentModeInfo = modeInfo[currentMode];

  // Timer control functions with better UX
  const handleStart = useCallback(() => {
    if (isCompleted) {
      // If completed, start a new session
      resetTimer();
      setTimeout(startTimer, 100);
    } else {
      startTimer();
    }
  }, [isCompleted, resetTimer, startTimer]);

  const handlePause = useCallback(() => {
    pauseTimer();
  }, [pauseTimer]);

  const handleReset = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  const handleModeSwitch = useCallback(
    (mode: TimerMode) => {
      switchMode(mode);
    },
    [switchMode],
  );

  // Auto-suggest next mode based on session count
  const suggestedNextMode = (): TimerMode => {
    if (currentMode === 'work') {
      const workSessionsInCycle = sessionsCompleted % settings.sessionsUntilLongBreak;
      return workSessionsInCycle === settings.sessionsUntilLongBreak - 1
        ? 'longBreak'
        : 'shortBreak';
    }
    return 'work';
  };

  // Notification helpers
  const shouldShowNotification = (): boolean => {
    return settings.notificationsEnabled && isCompleted;
  };

  const getNotificationMessage = (): string => {
    switch (currentMode) {
      case 'work':
        return '专注时间结束！该休息一下了。';
      case 'shortBreak':
        return '短休息结束！准备开始下一个专注时段。';
      case 'longBreak':
        return '长休息结束！精力充沛地开始新的专注周期吧！';
      default:
        return '时间到！';
    }
  };

  // Session statistics
  const sessionStats = {
    todayPomodoros: todayCompletedSessions,
    todayWorkTime: todayWorkTime,
    currentSessionProgress: progress,
    totalSessions: sessionsCompleted,
    currentCycleProgress: (sessionsCompleted % settings.sessionsUntilLongBreak) + 1,
    sessionsUntilLongBreak: settings.sessionsUntilLongBreak,
  };

  return {
    // Timer state
    currentMode,
    status,
    remainingTime,
    duration,
    formattedTime,
    progress,
    currentSessionId,

    // Mode information
    currentModeInfo,
    modeInfo,

    // Status checks
    isRunning,
    isPaused,
    isIdle,
    isCompleted,

    // Timer controls
    start: handleStart,
    pause: handlePause,
    reset: handleReset,
    complete: completeSession,
    switchMode: handleModeSwitch,

    // Settings
    settings,
    updateSettings,

    // Current task
    currentTask,

    // Statistics
    sessionStats,

    // Utilities
    suggestedNextMode,
    shouldShowNotification,
    getNotificationMessage,

    // Storage
    loadFromStorage,
    saveToStorage,
  };
};

export default useTimer;
