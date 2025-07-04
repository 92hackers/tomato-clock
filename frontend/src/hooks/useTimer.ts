import { useEffect, useRef } from 'react';
import { useTimerStore } from '../store/timerStore';
import { formatDuration } from '../utils/timeFormatter';
import type { TimerMode } from '../types/timer';

/**
 * Custom hook for timer functionality
 * Provides a clean interface for timer operations and computed values
 */
export function useTimer() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    timeLeft,
    currentMode,
    isRunning,
    isPaused,
    isCompleted,
    currentSession,
    sessionsUntilLongBreak,
    completedCycles,
    todayPomodoros,
    todayWorkTime,
    settings,
    startTimer,
    pauseTimer,
    resetTimer,
    completeTimer,
    switchMode,
    updateSettings,
    setState,
    getCurrentProgress,
  } = useTimerStore();

  // Timer countdown effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        const currentTimeLeft = useTimerStore.getState().timeLeft;

        if (currentTimeLeft <= 1) {
          // Timer completed
          useTimerStore.getState().completeTimer();
        } else {
          // Decrement time
          useTimerStore.getState().setState({ timeLeft: currentTimeLeft - 1 });
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeLeft]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Derived state
  const isIdle = !isRunning && !isPaused && !isCompleted;
  const currentCycleProgress = getCurrentProgress();

  // Mode-specific information
  const modeInfo = {
    work: {
      label: '专注工作',
      duration: settings.workDuration,
      color: '#FF9500',
      description: '专注完成当前任务',
    },
    shortBreak: {
      label: '短休息',
      duration: settings.shortBreakDuration,
      color: '#34C759',
      description: '短暂休息，恢复精力',
    },
    longBreak: {
      label: '长休息',
      duration: settings.longBreakDuration,
      color: '#007AFF',
      description: '长时间休息，彻底放松',
    },
  };

  const currentModeInfo = modeInfo[currentMode];

  // Timer control functions
  const handleStart = () => {
    if (isCompleted) {
      // If completed, reset and start new session
      resetTimer();
      setTimeout(() => startTimer(), 100);
    } else {
      startTimer();
    }
  };

  const handlePause = () => {
    pauseTimer();
  };

  const handleReset = () => {
    resetTimer();
  };

  const handleModeSwitch = (mode: TimerMode) => {
    if (!isRunning) {
      switchMode(mode);
    }
  };

  // Auto-suggest next mode based on session count
  const suggestedNextMode = (): TimerMode => {
    if (currentMode === 'work') {
      return currentSession >= settings.sessionsUntilLongBreak
        ? 'longBreak'
        : 'shortBreak';
    }
    return 'work';
  };

  // Notification helpers
  const shouldShowNotification = () => {
    return settings.notificationsEnabled && isCompleted;
  };

  const getNotificationMessage = () => {
    if (currentMode === 'work') {
      return '专注时间结束！是时候休息一下了。';
    }
    return '休息时间结束！准备开始下一个专注时间。';
  };

  // Session statistics
  const sessionStats = {
    todayPomodoros,
    todayWorkTime,
    currentSessionProgress: currentCycleProgress,
    totalSessions: completedCycles,
    currentCycleProgress,
    sessionsUntilLongBreak,
  };

  return {
    // Timer state
    timeLeft,
    currentMode,
    isRunning,
    isPaused,
    isIdle,
    isCompleted,

    // Session tracking
    currentSession,
    sessionsUntilLongBreak,
    completedCycles,
    currentCycleProgress,

    // Statistics
    todayPomodoros,
    todayWorkTime,
    sessionStats,

    // Settings
    settings,

    // Actions
    startTimer: handleStart,
    pauseTimer: handlePause,
    resetTimer: handleReset,
    completeTimer,
    switchMode: handleModeSwitch,
    updateSettings,

    // Mode information
    currentModeInfo,
    modeInfo,

    // Utilities
    suggestedNextMode,
    shouldShowNotification,
    getNotificationMessage,
  };
}

export default useTimer;
