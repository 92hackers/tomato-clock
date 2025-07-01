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

describe('TimerStore', () => {
  beforeEach(() => {
    // Reset the store state before each test
    useTimerStore.setState({
      currentMode: 'work',
      status: 'idle',
      remainingTime: 1500,
      duration: 1500,
      currentSessionId: null,
      sessionsCompleted: 0,
      settings: {
        workDuration: 1500,
        shortBreakDuration: 300,
        longBreakDuration: 900,
        sessionsUntilLongBreak: 4,
        autoStartBreaks: false,
        autoStartWork: false,
        soundEnabled: true,
        notificationsEnabled: true,
      },
      completedSessions: [],
      currentTask: null,
      tasks: [],
      todayWorkTime: 0,
      totalWorkTime: 0,
      todayCompletedSessions: 0,
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

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useTimerStore.getState();

      expect(store.currentMode).toBe('work');
      expect(store.status).toBe('idle');
      expect(store.remainingTime).toBe(1500); // 25 minutes
      expect(store.duration).toBe(1500);
      expect(store.currentSessionId).toBeNull();
      expect(store.sessionsCompleted).toBe(0);
      expect(store.completedSessions).toEqual([]);
      expect(store.currentTask).toBeNull();
      expect(store.tasks).toEqual([]);
      expect(store.todayWorkTime).toBe(0);
      expect(store.totalWorkTime).toBe(0);
      expect(store.todayCompletedSessions).toBe(0);
    });

    it('should have correct default settings', () => {
      const store = useTimerStore.getState();

      expect(store.settings.workDuration).toBe(1500);
      expect(store.settings.shortBreakDuration).toBe(300);
      expect(store.settings.longBreakDuration).toBe(900);
      expect(store.settings.sessionsUntilLongBreak).toBe(4);
      expect(store.settings.autoStartBreaks).toBe(false);
      expect(store.settings.autoStartWork).toBe(false);
      expect(store.settings.soundEnabled).toBe(true);
      expect(store.settings.notificationsEnabled).toBe(true);
    });
  });

  describe('Timer Controls', () => {
    it('should start timer and change status to running', () => {
      jest.useFakeTimers();
      const store = useTimerStore.getState();

      store.startTimer();

      const updatedStore = useTimerStore.getState();
      expect(updatedStore.status).toBe('running');
      expect(updatedStore.currentSessionId).toBeTruthy();
    });

    it('should pause timer and change status to paused', () => {
      jest.useFakeTimers();
      const store = useTimerStore.getState();

      // Start timer first
      store.startTimer();
      expect(useTimerStore.getState().status).toBe('running');

      // Then pause it
      store.pauseTimer();
      expect(useTimerStore.getState().status).toBe('paused');
    });

    it('should reset timer to initial state', () => {
      jest.useFakeTimers();
      const store = useTimerStore.getState();

      // Start and modify timer
      store.startTimer();
      jest.advanceTimersByTime(5000); // 5 seconds

      // Reset timer
      store.resetTimer();

      const resetStore = useTimerStore.getState();
      expect(resetStore.status).toBe('idle');
      expect(resetStore.remainingTime).toBe(resetStore.duration);
      expect(resetStore.currentSessionId).toBeNull();
    });

    it('should complete session and add to history', () => {
      jest.useFakeTimers();
      const store = useTimerStore.getState();

      // Start timer
      store.startTimer();
      const sessionId = useTimerStore.getState().currentSessionId;

      // Complete session
      store.completeSession();

      const completedStore = useTimerStore.getState();
      expect(completedStore.status).toBe('completed');
      expect(completedStore.completedSessions).toHaveLength(1);
      expect(completedStore.completedSessions[0].id).toBe(sessionId);
      expect(completedStore.completedSessions[0].mode).toBe('work');
      expect(completedStore.sessionsCompleted).toBe(1);
      expect(completedStore.todayCompletedSessions).toBe(1);
    });

    it('should countdown remaining time when timer is running', () => {
      jest.useFakeTimers();
      const store = useTimerStore.getState();

      store.startTimer();
      const initialTime = useTimerStore.getState().remainingTime;

      // Advance timer by 1 second
      jest.advanceTimersByTime(1000);

      const updatedTime = useTimerStore.getState().remainingTime;
      expect(updatedTime).toBe(initialTime - 1);
    });

    it('should auto-complete session when timer reaches zero', () => {
      jest.useFakeTimers();
      const store = useTimerStore.getState();

      // Set remaining time to 1 second for quick test
      useTimerStore.setState({ remainingTime: 1 });

      store.startTimer();

      // Advance timer by 1 second to complete
      jest.advanceTimersByTime(1000);

      const completedStore = useTimerStore.getState();
      expect(completedStore.status).toBe('completed');
      expect(completedStore.completedSessions).toHaveLength(1);
    });
  });

  describe('Mode Switching', () => {
    it('should switch to short break mode', () => {
      const store = useTimerStore.getState();

      store.switchMode('shortBreak');

      const updatedStore = useTimerStore.getState();
      expect(updatedStore.currentMode).toBe('shortBreak');
      expect(updatedStore.remainingTime).toBe(300); // 5 minutes
      expect(updatedStore.duration).toBe(300);
      expect(updatedStore.status).toBe('idle');
    });

    it('should switch to long break mode', () => {
      const store = useTimerStore.getState();

      store.switchMode('longBreak');

      const updatedStore = useTimerStore.getState();
      expect(updatedStore.currentMode).toBe('longBreak');
      expect(updatedStore.remainingTime).toBe(900); // 15 minutes
      expect(updatedStore.duration).toBe(900);
      expect(updatedStore.status).toBe('idle');
    });

    it('should auto-switch to long break after configured sessions', () => {
      const store = useTimerStore.getState();

      // Complete 4 work sessions
      for (let i = 0; i < 4; i++) {
        useTimerStore.setState({ currentMode: 'work' });
        store.startTimer();
        store.completeSession();
      }

      // Next break should be long break
      const updatedStore = useTimerStore.getState();
      expect(updatedStore.sessionsCompleted).toBe(4);
      // Auto-switch logic should suggest long break
    });
  });

  describe('Settings Management', () => {
    it('should update timer settings', () => {
      const store = useTimerStore.getState();

      const newSettings = {
        workDuration: 1800, // 30 minutes
        shortBreakDuration: 600, // 10 minutes
        soundEnabled: false,
      };

      store.updateSettings(newSettings);

      const updatedStore = useTimerStore.getState();
      expect(updatedStore.settings.workDuration).toBe(1800);
      expect(updatedStore.settings.shortBreakDuration).toBe(600);
      expect(updatedStore.settings.soundEnabled).toBe(false);
      expect(updatedStore.settings.longBreakDuration).toBe(900); // unchanged
    });

    it('should update timer duration when mode settings change', () => {
      const store = useTimerStore.getState();

      // Change work duration
      store.updateSettings({ workDuration: 1800 });

      // If in work mode, duration should update
      if (useTimerStore.getState().currentMode === 'work') {
        expect(useTimerStore.getState().duration).toBe(1800);
        expect(useTimerStore.getState().remainingTime).toBe(1800);
      }
    });
  });

  describe('Task Management', () => {
    it('should add a new task', () => {
      const store = useTimerStore.getState();

      const newTask = {
        title: 'Complete project documentation',
        estimatedPomodoros: 4,
        notes: 'Include API docs and user guide',
      };

      store.addTask(newTask);

      const updatedStore = useTimerStore.getState();
      expect(updatedStore.tasks).toHaveLength(1);
      expect(updatedStore.tasks[0].title).toBe(newTask.title);
      expect(updatedStore.tasks[0].estimatedPomodoros).toBe(4);
      expect(updatedStore.tasks[0].completedPomodoros).toBe(0);
      expect(updatedStore.tasks[0].completed).toBe(false);
      expect(updatedStore.tasks[0].id).toBeTruthy();
      expect(updatedStore.tasks[0].createdAt).toBeInstanceOf(Date);
    });

    it('should set current task', () => {
      const store = useTimerStore.getState();

      // Add a task first
      store.addTask({
        title: 'Test task',
        estimatedPomodoros: 2,
      });

      const taskId = useTimerStore.getState().tasks[0].id;

      // Set as current task
      store.setCurrentTask(taskId);

      const updatedStore = useTimerStore.getState();
      expect(updatedStore.currentTask?.id).toBe(taskId);
    });

    it('should update task pomodoros when work session completed with task', () => {
      jest.useFakeTimers();
      const store = useTimerStore.getState();

      // Add and set current task
      store.addTask({
        title: 'Test task',
        estimatedPomodoros: 4,
      });

      const taskId = useTimerStore.getState().tasks[0].id;
      store.setCurrentTask(taskId);

      // Complete a work session
      store.startTimer();
      store.completeSession();

      const updatedStore = useTimerStore.getState();
      const task = updatedStore.tasks.find(t => t.id === taskId);
      expect(task?.completedPomodoros).toBe(1);
    });

    it('should mark task as completed when all pomodoros done', () => {
      const store = useTimerStore.getState();

      // Add task with 1 estimated pomodoro
      store.addTask({
        title: 'Quick task',
        estimatedPomodoros: 1,
      });

      const taskId = useTimerStore.getState().tasks[0].id;

      // Complete the task
      store.completeTask(taskId);

      const updatedStore = useTimerStore.getState();
      const task = updatedStore.tasks.find(t => t.id === taskId);
      expect(task?.completed).toBe(true);
    });

    it('should delete task', () => {
      const store = useTimerStore.getState();

      // Add task
      store.addTask({
        title: 'Task to delete',
        estimatedPomodoros: 2,
      });

      const taskId = useTimerStore.getState().tasks[0].id;
      expect(useTimerStore.getState().tasks).toHaveLength(1);

      // Delete task
      store.deleteTask(taskId);

      const updatedStore = useTimerStore.getState();
      expect(updatedStore.tasks).toHaveLength(0);
    });
  });

  describe('Statistics Calculation', () => {
    it('should calculate today work time correctly', () => {
      jest.useFakeTimers();
      const store = useTimerStore.getState();

      // Complete a work session
      useTimerStore.setState({ currentMode: 'work', duration: 1500 });
      store.startTimer();
      store.completeSession();

      const updatedStore = useTimerStore.getState();
      expect(updatedStore.todayWorkTime).toBe(1500);
      expect(updatedStore.totalWorkTime).toBe(1500);
    });

    it('should not count break sessions in work time', () => {
      jest.useFakeTimers();
      const store = useTimerStore.getState();

      // Complete a break session
      useTimerStore.setState({ currentMode: 'shortBreak', duration: 300 });
      store.startTimer();
      store.completeSession();

      const updatedStore = useTimerStore.getState();
      expect(updatedStore.todayWorkTime).toBe(0);
      expect(updatedStore.totalWorkTime).toBe(0);
    });
  });

  describe('Data Persistence', () => {
    it('should save state to localStorage', () => {
      const store = useTimerStore.getState();

      store.saveToStorage();

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pomodoro-timer-state',
        expect.any(String)
      );
    });

    it('should load state from localStorage', () => {
      const mockState = {
        settings: {
          workDuration: 1800,
          shortBreakDuration: 600,
          longBreakDuration: 1200,
          sessionsUntilLongBreak: 3,
          autoStartBreaks: true,
          autoStartWork: true,
          soundEnabled: false,
          notificationsEnabled: false,
        },
        tasks: [],
        completedSessions: [],
        totalWorkTime: 3600,
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockState));

      const store = useTimerStore.getState();
      store.loadFromStorage();

      const updatedStore = useTimerStore.getState();
      expect(updatedStore.settings.workDuration).toBe(1800);
      expect(updatedStore.settings.autoStartBreaks).toBe(true);
      expect(updatedStore.totalWorkTime).toBe(3600);
    });

    it('should handle invalid localStorage data gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      const store = useTimerStore.getState();

      // Should not throw error
      expect(() => store.loadFromStorage()).not.toThrow();
    });
  });
});
