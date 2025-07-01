import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../testUtils';
import { PomodoroTimer } from '../PomodoroTimer';
import { useTimer } from '../../../hooks/useTimer';

// Mock the useTimer hook
jest.mock('../../../hooks/useTimer');
const mockUseTimer = useTimer as jest.MockedFunction<typeof useTimer>;

describe('PomodoroTimer Component', () => {
  const mockTimerHook = {
    // Timer state
    currentMode: 'work' as const,
    status: 'idle' as const,
    remainingTime: 1500,
    duration: 1500,
    formattedTime: '25:00',
    progress: 0,
    currentSessionId: null,
    
    // Mode info
    currentModeInfo: {
      label: '专注',
      duration: 1500,
      color: 'orange',
      description: '专注工作时间',
    },
    modeInfo: {
      work: {
        label: '专注',
        duration: 1500,
        color: 'orange',
        description: '专注工作时间',
      },
      shortBreak: {
        label: '短休息',
        duration: 300,
        color: 'green',
        description: '短暂休息时间',
      },
      longBreak: {
        label: '长休息',
        duration: 900,
        color: 'blue',
        description: '长时间休息',
      },
    },
    
    // Status checks
    isRunning: false,
    isPaused: false,
    isIdle: true,
    isCompleted: false,
    
    // Timer controls
    start: jest.fn(),
    pause: jest.fn(),
    reset: jest.fn(),
    complete: jest.fn(),
    switchMode: jest.fn(),
    
    // Settings
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
    updateSettings: jest.fn(),
    
    // Statistics
    sessionStats: {
      todayPomodoros: 0,
      todayWorkTime: 0,
      currentSessionProgress: 0,
      totalSessions: 0,
      currentCycleProgress: 1,
      sessionsUntilLongBreak: 4,
    },
    
    // Current task
    currentTask: null,
    
    // Utility functions
    suggestedNextMode: jest.fn(() => 'shortBreak' as const),
    shouldShowNotification: jest.fn(() => false),
    getNotificationMessage: jest.fn(() => '时间到！'),
    
    // Storage functions
    loadFromStorage: jest.fn(),
    saveToStorage: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTimer.mockReturnValue(mockTimerHook);
  });

  describe('Timer Display', () => {
    it('should render timer with formatted time', () => {
      render(<PomodoroTimer />);
      
      expect(screen.getByText('25:00')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: '专注' })).toBeInTheDocument();
      expect(screen.getByText('专注工作时间')).toBeInTheDocument();
    });

    it('should display progress circle', () => {
      mockUseTimer.mockReturnValue({
        ...mockTimerHook,
        progress: 50,
      });

      render(<PomodoroTimer />);
      
      const progressElement = screen.getByRole('progressbar');
      expect(progressElement).toBeInTheDocument();
      expect(progressElement).toHaveAttribute('aria-valuenow', '50');
    });

    it('should show current mode color theme', () => {
      render(<PomodoroTimer />);
      
      const timerElement = screen.getByTestId('timer-display');
      expect(timerElement).toHaveClass('text-orange-600');
    });
  });

  describe('Mode Switching', () => {
    it('should render mode tabs for work, short break, and long break', () => {
      render(<PomodoroTimer />);
      
      expect(screen.getByRole('button', { name: /专注/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /短休息/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /长休息/i })).toBeInTheDocument();
    });

    it('should highlight active mode tab', () => {
      render(<PomodoroTimer />);
      
      const workTab = screen.getByRole('button', { name: /专注/i });
      expect(workTab).toHaveClass('bg-orange-600', 'text-white');
    });

    it('should switch mode when tab is clicked', () => {
      render(<PomodoroTimer />);
      
      const shortBreakTab = screen.getByRole('button', { name: /短休息/i });
      fireEvent.click(shortBreakTab);
      
      expect(mockTimerHook.switchMode).toHaveBeenCalledWith('shortBreak');
    });

    it('should not allow mode switching when timer is running', () => {
      mockUseTimer.mockReturnValue({
        ...mockTimerHook,
        status: 'running',
        isRunning: true,
        isIdle: false,
      });

      render(<PomodoroTimer />);
      
      const shortBreakTab = screen.getByRole('button', { name: /短休息/i });
      expect(shortBreakTab).toBeDisabled();
    });
  });

  describe('Timer Controls', () => {
    it('should render start button when timer is idle', () => {
      render(<PomodoroTimer />);
      
      const startButton = screen.getByRole('button', { name: /开始/i });
      expect(startButton).toBeInTheDocument();
      expect(startButton).not.toBeDisabled();
    });

    it('should start timer when start button is clicked', () => {
      render(<PomodoroTimer />);
      
      const startButton = screen.getByRole('button', { name: /开始/i });
      fireEvent.click(startButton);
      
      expect(mockTimerHook.start).toHaveBeenCalled();
    });

    it('should render pause button when timer is running', () => {
      mockUseTimer.mockReturnValue({
        ...mockTimerHook,
        status: 'running',
        isRunning: true,
        isIdle: false,
      });

      render(<PomodoroTimer />);
      
      const pauseButton = screen.getByRole('button', { name: /暂停/i });
      expect(pauseButton).toBeInTheDocument();
    });

    it('should pause timer when pause button is clicked', () => {
      mockUseTimer.mockReturnValue({
        ...mockTimerHook,
        status: 'running',
        isRunning: true,
        isIdle: false,
      });

      render(<PomodoroTimer />);
      
      const pauseButton = screen.getByRole('button', { name: /暂停/i });
      fireEvent.click(pauseButton);
      
      expect(mockTimerHook.pause).toHaveBeenCalled();
    });

    it('should render resume button when timer is paused', () => {
      mockUseTimer.mockReturnValue({
        ...mockTimerHook,
        status: 'paused',
        isPaused: true,
        isIdle: false,
      });

      render(<PomodoroTimer />);
      
      const resumeButton = screen.getByRole('button', { name: /继续/i });
      expect(resumeButton).toBeInTheDocument();
    });

    it('should render reset button', () => {
      render(<PomodoroTimer />);
      
      const resetButton = screen.getByRole('button', { name: /重置/i });
      expect(resetButton).toBeInTheDocument();
    });

    it('should reset timer when reset button is clicked', () => {
      render(<PomodoroTimer />);
      
      const resetButton = screen.getByRole('button', { name: /重置/i });
      fireEvent.click(resetButton);
      
      expect(mockTimerHook.reset).toHaveBeenCalled();
    });
  });

  describe('Timer Completion', () => {
    it('should show completion state', () => {
      mockUseTimer.mockReturnValue({
        ...mockTimerHook,
        status: 'completed',
        isCompleted: true,
        isIdle: false,
        remainingTime: 0,
        formattedTime: '00:00',
        progress: 100,
      });

      render(<PomodoroTimer />);
      
      expect(screen.getByText('完成！')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /开始新会话/i })).toBeInTheDocument();
    });

    it('should suggest next mode when session completes', () => {
      mockUseTimer.mockReturnValue({
        ...mockTimerHook,
        status: 'completed',
        isCompleted: true,
        isIdle: false,
        suggestedNextMode: jest.fn(() => 'shortBreak'),
      });

      render(<PomodoroTimer />);
      
      expect(screen.getByText(/建议：短休息/i)).toBeInTheDocument();
    });

    it('should show notification when completed and enabled', () => {
      mockUseTimer.mockReturnValue({
        ...mockTimerHook,
        status: 'completed',
        isCompleted: true,
        shouldShowNotification: jest.fn(() => true),
        getNotificationMessage: jest.fn(() => '专注时间结束！该休息一下了。'),
      });

      render(<PomodoroTimer />);
      
      expect(screen.getByText('专注时间结束！该休息一下了。')).toBeInTheDocument();
    });
  });

  describe('Statistics Display', () => {
    it('should show today statistics', () => {
      mockUseTimer.mockReturnValue({
        ...mockTimerHook,
        sessionStats: {
          ...mockTimerHook.sessionStats,
          todayPomodoros: 3,
          todayWorkTime: 4500, // 75 minutes
        },
      });

      render(<PomodoroTimer />);
      
      expect(screen.getByText('今日完成')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('个番茄钟')).toBeInTheDocument();
    });

    it('should show cycle progress', () => {
      mockUseTimer.mockReturnValue({
        ...mockTimerHook,
        sessionStats: {
          ...mockTimerHook.sessionStats,
          currentCycleProgress: 2,
          sessionsUntilLongBreak: 4,
        },
      });

      render(<PomodoroTimer />);
      
      expect(screen.getByText('周期进度')).toBeInTheDocument();
      expect(screen.getByText('2/4')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should apply responsive classes', () => {
      render(<PomodoroTimer />);
      
      const container = screen.getByTestId('pomodoro-timer');
      expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'space-y-8');
    });

    it('should have proper mobile layout', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<PomodoroTimer />);
      
      const timerDisplay = screen.getByTestId('timer-display');
      expect(timerDisplay).toHaveClass('text-6xl', 'md:text-8xl');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<PomodoroTimer />);
      
      const timer = screen.getByRole('timer');
      expect(timer).toHaveAttribute('aria-label', '番茄钟计时器');
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-label', '计时进度');
    });

    it('should have keyboard navigation support', () => {
      render(<PomodoroTimer />);
      
      const startButton = screen.getByRole('button', { name: /开始/i });
      expect(startButton).toHaveAttribute('tabIndex', '0');
    });

    it('should announce timer state changes', async () => {
      const { rerender } = render(<PomodoroTimer />);
      
      // Start timer
      mockUseTimer.mockReturnValue({
        ...mockTimerHook,
        status: 'running',
        isRunning: true,
        isIdle: false,
      });
      
      rerender(<PomodoroTimer />);
      
      await waitFor(() => {
        const announcement = screen.getByRole('status', { hidden: true });
        expect(announcement).toHaveTextContent('计时器已开始');
      });
    });
  });
}); 