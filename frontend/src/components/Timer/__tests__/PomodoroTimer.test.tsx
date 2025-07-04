import React from 'react';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PomodoroTimer } from '../PomodoroTimer';
import { useTimer } from '../../../hooks/useTimer';
import { useTaskStore } from '../../../store/taskStore';

// Mock the hooks
jest.mock('../../../hooks/useTimer', () => ({
  useTimer: jest.fn(),
}));

jest.mock('../../../store/taskStore', () => ({
  useTaskStore: jest.fn(),
}));

describe('PomodoroTimer Component', () => {
  const mockUseTimer = {
    currentMode: 'work',
    timeLeft: 1500, // 25 minutes
    isRunning: false,
    isPaused: false,
    todayPomodoros: 2,
    todayWorkTime: 3000, // 50 minutes
    startTimer: jest.fn(),
    pauseTimer: jest.fn(),
    resetTimer: jest.fn(),
    switchMode: jest.fn(),
  };

  const mockUseTaskStore = {
    tasks: [
      {
        id: '1',
        title: '完成番茄时钟设计',
        estimatedPomodoros: 4,
        completedPomodoros: 2,
        completed: false,
        notes: '按照设计稿实现',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: '阅读一章书',
        estimatedPomodoros: 2,
        completedPomodoros: 0,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    addTask: jest.fn(),
    completeTask: jest.fn(),
    getActiveTasks: jest.fn().mockReturnValue([
      {
        id: '1',
        title: '完成番茄时钟设计',
        estimatedPomodoros: 4,
        completedPomodoros: 2,
        completed: false,
      },
      {
        id: '2',
        title: '阅读一章书',
        estimatedPomodoros: 2,
        completedPomodoros: 0,
        completed: false,
      },
    ]),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTimer as jest.Mock).mockReturnValue(mockUseTimer);
    (useTaskStore as jest.Mock).mockReturnValue(mockUseTaskStore);
  });

  describe('Basic Rendering', () => {
    it('should render main container', () => {
      render(<PomodoroTimer />);

      expect(screen.getByTestId('pomodoro-timer')).toBeInTheDocument();
    });

    it('should render header with title and settings button', () => {
      render(<PomodoroTimer />);

      expect(screen.getByText('专注时钟')).toBeInTheDocument();
      expect(screen.getByText('⚙️')).toBeInTheDocument();
    });

    it('should display timer with correct format when idle', () => {
      render(<PomodoroTimer />);

      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('minutes')).toBeInTheDocument();
    });

    it('should display timer in MM:SS format when running', () => {
      const runningTimer = { ...mockUseTimer, isRunning: true };
      (useTimer as jest.Mock).mockReturnValue(runningTimer);

      render(<PomodoroTimer />);

      expect(screen.getByText('25:00')).toBeInTheDocument();
    });

    it('should render mode tabs', () => {
      render(<PomodoroTimer />);

      expect(screen.getByText('专注')).toBeInTheDocument();
      expect(screen.getByText('短休息')).toBeInTheDocument();
      expect(screen.getByText('长休息')).toBeInTheDocument();
    });

    it('should render control buttons', () => {
      render(<PomodoroTimer />);

      expect(screen.getByText('▶')).toBeInTheDocument(); // Play button
      expect(screen.getByText('↻')).toBeInTheDocument(); // Reset button
    });
  });

  describe('Timer Controls', () => {
    it('should call startTimer when play button clicked', () => {
      render(<PomodoroTimer />);

      const playButton = screen.getByText('▶');
      fireEvent.click(playButton);

      expect(mockUseTimer.startTimer).toHaveBeenCalledTimes(1);
    });

    it('should call pauseTimer when pause button clicked and timer is running', () => {
      const runningTimer = { ...mockUseTimer, isRunning: true };
      (useTimer as jest.Mock).mockReturnValue(runningTimer);

      render(<PomodoroTimer />);

      const pauseButton = screen.getByText('⏸');
      fireEvent.click(pauseButton);

      expect(mockUseTimer.pauseTimer).toHaveBeenCalledTimes(1);
    });

    it('should call resetTimer when reset button clicked', () => {
      render(<PomodoroTimer />);

      const resetButton = screen.getByText('↻');
      fireEvent.click(resetButton);

      expect(mockUseTimer.resetTimer).toHaveBeenCalledTimes(1);
    });
  });

  describe('Mode Switching', () => {
    it('should highlight active mode', () => {
      render(<PomodoroTimer />);

      const workTab = screen.getByText('专注');
      expect(workTab).toHaveClass('active');
    });

    it('should call switchMode when mode tab clicked', () => {
      render(<PomodoroTimer />);

      const shortBreakTab = screen.getByText('短休息');
      fireEvent.click(shortBreakTab);

      expect(mockUseTimer.switchMode).toHaveBeenCalledWith('shortBreak');
    });

    it('should show correct active mode for short break', () => {
      const shortBreakTimer = { ...mockUseTimer, currentMode: 'shortBreak' };
      (useTimer as jest.Mock).mockReturnValue(shortBreakTimer);

      render(<PomodoroTimer />);

      const shortBreakTab = screen.getByText('短休息');
      expect(shortBreakTab).toHaveClass('active');
    });
  });

  describe('Task Management', () => {
    it('should render tasks section', () => {
      render(<PomodoroTimer />);

      expect(screen.getByText('今日任务')).toBeInTheDocument();
      expect(screen.getByText('+')).toBeInTheDocument();
    });

    it('should display active tasks', () => {
      render(<PomodoroTimer />);

      expect(screen.getByText('完成番茄时钟设计')).toBeInTheDocument();
      expect(screen.getByText('阅读一章书')).toBeInTheDocument();
      expect(screen.getByText('2/4')).toBeInTheDocument();
      expect(screen.getByText('0/2')).toBeInTheDocument();
    });

    it('should show add task form when add button clicked', async () => {
      render(<PomodoroTimer />);

      const addButton = screen.getByText('+');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('输入任务名称')).toBeInTheDocument();
        expect(screen.getByText('保存')).toBeInTheDocument();
        expect(screen.getByText('取消')).toBeInTheDocument();
      });
    });

    it('should call addTask when form submitted', async () => {
      render(<PomodoroTimer />);

      const addButton = screen.getByText('+');
      fireEvent.click(addButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText('输入任务名称');
        fireEvent.change(input, { target: { value: '新任务' } });

        const saveButton = screen.getByText('保存');
        fireEvent.click(saveButton);

        expect(mockUseTaskStore.addTask).toHaveBeenCalledWith({
          title: '新任务',
          estimatedPomodoros: 4,
        });
      });
    });

    it('should close form when cancel clicked', async () => {
      render(<PomodoroTimer />);

      const addButton = screen.getByText('+');
      fireEvent.click(addButton);

      await waitFor(() => {
        const cancelButton = screen.getByText('取消');
        fireEvent.click(cancelButton);

        expect(
          screen.queryByPlaceholderText('输入任务名称')
        ).not.toBeInTheDocument();
      });
    });

    it('should show empty message when no tasks', () => {
      const emptyTaskStore = {
        ...mockUseTaskStore,
        getActiveTasks: jest.fn().mockReturnValue([]),
      };
      (useTaskStore as jest.Mock).mockReturnValue(emptyTaskStore);

      render(<PomodoroTimer />);

      expect(screen.getByText('暂无任务，点击 + 添加任务')).toBeInTheDocument();
    });
  });

  describe('Statistics Display', () => {
    it('should render statistics section', () => {
      render(<PomodoroTimer />);

      expect(screen.getByText('今日统计')).toBeInTheDocument();
    });

    it('should display today pomodoros', () => {
      render(<PomodoroTimer />);

      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('完成番茄')).toBeInTheDocument();
    });

    it('should display work time in minutes', () => {
      render(<PomodoroTimer />);

      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('专注分钟')).toBeInTheDocument();
    });

    it('should display completed tasks count', () => {
      render(<PomodoroTimer />);

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('完成任务')).toBeInTheDocument();
    });

    it('should handle undefined values gracefully', () => {
      const undefinedTimer = {
        ...mockUseTimer,
        todayPomodoros: undefined,
        todayWorkTime: undefined,
      };
      (useTimer as jest.Mock).mockReturnValue(undefinedTimer);

      render(<PomodoroTimer />);

      // Should default to 0 - check specific stat cards
      const statCards = screen.getAllByText('0');
      expect(statCards).toHaveLength(3); // All three stats should show 0
      expect(screen.getByText('完成番茄')).toBeInTheDocument();
      expect(screen.getByText('专注分钟')).toBeInTheDocument();
      expect(screen.getByText('完成任务')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels for buttons', () => {
      render(<PomodoroTimer />);

      const playButton = screen.getByLabelText('开始');
      const resetButton = screen.getByLabelText('重置');

      expect(playButton).toBeInTheDocument();
      expect(resetButton).toBeInTheDocument();
    });

    it('should update aria label when running', () => {
      const runningTimer = { ...mockUseTimer, isRunning: true };
      (useTimer as jest.Mock).mockReturnValue(runningTimer);

      render(<PomodoroTimer />);

      const pauseButton = screen.getByLabelText('暂停');
      expect(pauseButton).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing timeLeft gracefully', () => {
      const brokenTimer = { ...mockUseTimer, timeLeft: undefined };
      (useTimer as jest.Mock).mockReturnValue(brokenTimer);

      render(<PomodoroTimer />);

      // Should show default time
      expect(screen.getByText('25')).toBeInTheDocument();
    });
  });
});
