import { describe, it, expect, beforeEach } from '@jest/globals';
import { useTimerStore } from '../timerStore';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('TimerStore (New Architecture)', () => {
  beforeEach(() => {
    // Reset store before each test
    useTimerStore.setState({
      timeLeft: 25 * 60,
      currentMode: 'work',
      isRunning: false,
      isPaused: false,
      isCompleted: false,
      currentSession: 1,
      sessionsUntilLongBreak: 4,
      completedCycles: 0,
      todayPomodoros: 0,
      todayWorkTime: 0,
    });

    // Clear localStorage mocks
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();

    // Clear all timers
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Timer Controls', () => {
    it('should start timer and change to running state', () => {
      const store = useTimerStore.getState();
      
      store.startTimer();

      const updatedStore = useTimerStore.getState();
      expect(updatedStore.isRunning).toBe(true);
      expect(updatedStore.isPaused).toBe(false);
      expect(updatedStore.isCompleted).toBe(false);
    });

    it('should pause timer and change to paused state', () => {
      const store = useTimerStore.getState();
      
      // Start timer first
      store.startTimer();
      expect(useTimerStore.getState().isRunning).toBe(true);

      // Then pause it
      store.pauseTimer();

      const pausedStore = useTimerStore.getState();
      expect(pausedStore.isRunning).toBe(false);
      expect(pausedStore.isPaused).toBe(true);
    });

    it('should reset timer to initial state', () => {
      const store = useTimerStore.getState();
      
      // Start and modify state
      store.startTimer();
      store.setState({ timeLeft: 1000 }); // Simulate some time passed

      // Reset timer
      store.resetTimer();

      const resetStore = useTimerStore.getState();
      expect(resetStore.isRunning).toBe(false);
      expect(resetStore.isPaused).toBe(false);
      expect(resetStore.isCompleted).toBe(false);
      expect(resetStore.timeLeft).toBe(25 * 60); // Reset to work duration
    });

    it('should complete timer and change to completed state', () => {
      const store = useTimerStore.getState();
      
      store.completeTimer();

      const completedStore = useTimerStore.getState();
      expect(completedStore.isCompleted).toBe(true);
      expect(completedStore.isRunning).toBe(false);
    });
  });

  describe('Mode Switching', () => {
    it('should switch to short break mode', () => {
      const store = useTimerStore.getState();
      
      store.switchMode('shortBreak');

      const updatedStore = useTimerStore.getState();
      expect(updatedStore.currentMode).toBe('shortBreak');
      expect(updatedStore.timeLeft).toBe(5 * 60); // 5 minutes
    });

    it('should switch to long break mode', () => {
      const store = useTimerStore.getState();
      
      store.switchMode('longBreak');

      const updatedStore = useTimerStore.getState();
      expect(updatedStore.currentMode).toBe('longBreak');
      expect(updatedStore.timeLeft).toBe(15 * 60); // 15 minutes
    });

    it('should not switch mode when timer is running', () => {
      const store = useTimerStore.getState();
      
      // Start timer
      store.startTimer();
      const initialMode = useTimerStore.getState().currentMode;

      // Try to switch mode
      store.switchMode('shortBreak');

      // Mode should not change
      const updatedStore = useTimerStore.getState();
      expect(updatedStore.currentMode).toBe(initialMode);
    });
  });

  describe('Session Management', () => {
    it('should increment completed cycles when work session completed', () => {
      const store = useTimerStore.getState();
      
      // Set to work mode and complete
      store.switchMode('work');
      store.completeTimer();

      const updatedStore = useTimerStore.getState();
      expect(updatedStore.completedCycles).toBe(1);
      expect(updatedStore.todayPomodoros).toBe(1);
    });

    it('should switch to short break after work completion', () => {
      const store = useTimerStore.getState();
      
      // Complete work session
      store.switchMode('work');
      store.completeTimer();

      const updatedStore = useTimerStore.getState();
      expect(updatedStore.currentMode).toBe('shortBreak');
      expect(updatedStore.timeLeft).toBe(5 * 60);
    });

    it('should switch to long break after configured work sessions', () => {
      const store = useTimerStore.getState();
      
      // Set to 4 sessions (max before long break)
      store.setState({ currentSession: 4 });
      store.switchMode('work');
      store.completeTimer();

      const updatedStore = useTimerStore.getState();
      expect(updatedStore.currentMode).toBe('longBreak');
      expect(updatedStore.currentSession).toBe(1); // Reset to 1
    });

    it('should switch back to work after break completion', () => {
      const store = useTimerStore.getState();
      
      // Complete short break
      store.switchMode('shortBreak');
      store.completeTimer();

      const updatedStore = useTimerStore.getState();
      expect(updatedStore.currentMode).toBe('work');
      expect(updatedStore.timeLeft).toBe(25 * 60);
    });
  });

  describe('Settings Management', () => {
    it('should update settings and reset timer duration', () => {
      const store = useTimerStore.getState();
      
      // Update work duration
      store.updateSettings({ workDuration: 30 * 60 }); // 30 minutes

      const updatedStore = useTimerStore.getState();
      expect(updatedStore.settings.workDuration).toBe(30 * 60);
      expect(updatedStore.timeLeft).toBe(30 * 60); // Timer should update
    });

    it('should not update timer duration when running', () => {
      const store = useTimerStore.getState();
      
      // Start timer
      store.startTimer();
      const initialTime = useTimerStore.getState().timeLeft;
      
      // Update settings
      store.updateSettings({ workDuration: 30 * 60 });

      const updatedStore = useTimerStore.getState();
      expect(updatedStore.settings.workDuration).toBe(30 * 60);
      expect(updatedStore.timeLeft).toBe(initialTime); // Should not change
    });
  });

  describe('Progress Calculation', () => {
    it('should calculate current progress correctly', () => {
      const store = useTimerStore.getState();
      
      // Set half time remaining for 15 minute mode (short break)
      store.switchMode('shortBreak'); // 5 * 60 = 300 seconds
      const halfTime = 5 * 60 / 2; // 150 seconds
      store.setState({ timeLeft: halfTime });

      const progress = store.getCurrentProgress();
      expect(progress).toBe(50);
    });

    it('should return 0 progress for full time', () => {
      const store = useTimerStore.getState();
      
      // Reset to full time
      store.resetTimer();
      const progress = store.getCurrentProgress();
      expect(progress).toBe(0);
    });

    it('should return 100 progress for zero time', () => {
      const store = useTimerStore.getState();
      
      store.setState({ timeLeft: 0 });
      const progress = store.getCurrentProgress();
      expect(progress).toBe(100);
    });
  });

  describe('Timer State Getter', () => {
    it('should return complete timer state', () => {
      const store = useTimerStore.getState();
      
      const timerState = store.getTimerState();
      
      expect(timerState).toHaveProperty('timeLeft');
      expect(timerState).toHaveProperty('currentMode');
      expect(timerState).toHaveProperty('isRunning');
      expect(timerState).toHaveProperty('isPaused');
      expect(timerState).toHaveProperty('isIdle');
      expect(timerState).toHaveProperty('isCompleted');
      expect(timerState).toHaveProperty('settings');
    });

    it('should calculate isIdle correctly', () => {
      const store = useTimerStore.getState();
      
      const timerState = store.getTimerState();
      expect(timerState.isIdle).toBe(true);
      
      store.startTimer();
      const runningState = store.getTimerState();
      expect(runningState.isIdle).toBe(false);
    });
  });

  describe('Work Time Statistics', () => {
    it('should track today work time when completing work sessions', () => {
      const store = useTimerStore.getState();
      
      // Set initial work time and complete session
      const initialWorkTime = store.todayWorkTime;
      store.completeTimer();

      const updatedStore = useTimerStore.getState();
      // Work time should increase when completing work session
      expect(updatedStore.todayWorkTime).toBeGreaterThan(initialWorkTime);
    });

    it('should not add break time to work statistics', () => {
      const store = useTimerStore.getState();
      
      // Complete a break session
      store.switchMode('shortBreak');
      const initialWorkTime = useTimerStore.getState().todayWorkTime;
      store.completeTimer();

      const updatedStore = useTimerStore.getState();
      expect(updatedStore.todayWorkTime).toBe(initialWorkTime); // Should not change
    });
  });
});

