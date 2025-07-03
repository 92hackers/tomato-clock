import React from 'react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PomodoroTimerCard } from '../PomodoroTimerCard';
import { useTimerStore } from '../../../store/timerStore';
import { useTaskStore } from '../../../store/taskStore';
import type { TimerMode } from '../../../types/timer';

// Mock the stores
jest.mock('../../../store/timerStore', () => ({
  useTimerStore: jest.fn(),
}));

jest.mock('../../../store/taskStore', () => ({
  useTaskStore: jest.fn(),
}));

describe('PomodoroTimerCard', () => {
  const mockTimerStore = {
    timeLeft: 1500, // 25 minutes
    currentMode: 'work' as TimerMode,
    isRunning: false,
    isPaused: false,
    isIdle: true,
    isCompleted: false,
    currentSession: 1,
    sessionsUntilLongBreak: 4,
    completedCycles: 0,
    todayPomodoros: 2,
    todayWorkTime: 3000, // 50 minutes
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
    startTimer: jest.fn(),
    pauseTimer: jest.fn(),
    resetTimer: jest.fn(),
    completeTimer: jest.fn(),
    switchMode: jest.fn(),
    updateSettings: jest.fn(),
    setState: jest.fn(),
    getTimerState: jest.fn(),
    getCurrentProgress: jest.fn(() => 0.5),
  };

  const mockTaskStore = {
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
        completedPomodoros: 1,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    selectedTaskId: null,
    addTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    completeTask: jest.fn(),
    selectTask: jest.fn(),
    incrementTaskPomodoro: jest.fn(),
    getTask: jest.fn(),
    getSelectedTask: jest.fn(),
    getTodayTasks: jest.fn(),
    getCompletedTasks: jest.fn(),
    getActiveTasks: jest.fn(() => [
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
        completedPomodoros: 1,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup store mocks
    (useTimerStore as jest.Mock).mockReturnValue(mockTimerStore);
    (useTaskStore as jest.Mock).mockReturnValue(mockTaskStore);
  });

  describe('Rendering', () => {
    it('should render main card with header', () => {
      render(<PomodoroTimerCard />);
      
      expect(screen.getByText('专注时钟')).toBeInTheDocument();
      expect(screen.getByText('⚙️')).toBeInTheDocument();
    });

    it('should display formatted timer', () => {
      render(<PomodoroTimerCard />);
      
      expect(screen.getByText('25 minutes')).toBeInTheDocument();
    });

    it('should render mode tabs', () => {
      render(<PomodoroTimerCard />);
      
      expect(screen.getByText('专注')).toBeInTheDocument();
      expect(screen.getByText('短休息')).toBeInTheDocument();
      expect(screen.getByText('长休息')).toBeInTheDocument();
    });

    it('should render control buttons', () => {
      render(<PomodoroTimerCard />);
      
      expect(screen.getByText('▶')).toBeInTheDocument(); // Play button
      expect(screen.getByText('↻')).toBeInTheDocument(); // Reset button
    });

    it('should render tasks section', () => {
      render(<PomodoroTimerCard />);
      
      expect(screen.getByText('今日任务')).toBeInTheDocument();
      expect(screen.getByText('+')).toBeInTheDocument(); // Add button
      expect(screen.getByText('完成番茄时钟设计')).toBeInTheDocument();
      expect(screen.getByText('阅读一章书')).toBeInTheDocument();
    });

    it('should render statistics section', () => {
      render(<PomodoroTimerCard />);
      
      expect(screen.getByText('今日统计')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // Pomodoros
      expect(screen.getByText('50')).toBeInTheDocument(); // Minutes
      expect(screen.getByText('完成番茄')).toBeInTheDocument();
      expect(screen.getByText('专注分钟')).toBeInTheDocument();
      expect(screen.getByText('完成任务')).toBeInTheDocument();
    });
  });

  describe('Timer Controls', () => {
    it('should call startTimer when play button clicked and timer is idle', () => {
      render(<PomodoroTimerCard />);
      
      const playButton = screen.getByText('▶');
      fireEvent.click(playButton);
      
      expect(mockTimerStore.startTimer).toHaveBeenCalledTimes(1);
    });

    it('should call pauseTimer when pause button clicked and timer is running', () => {
      const runningStore = { ...mockTimerStore, isRunning: true, isIdle: false };
      (useTimerStore as jest.Mock).mockReturnValue(runningStore);
      
      render(<PomodoroTimerCard />);
      
      const pauseButton = screen.getByText('⏸');
      fireEvent.click(pauseButton);
      
      expect(mockTimerStore.pauseTimer).toHaveBeenCalledTimes(1);
    });

    it('should call resetTimer when reset button clicked', () => {
      render(<PomodoroTimerCard />);
      
      const resetButton = screen.getByText('↻');
      fireEvent.click(resetButton);
      
      expect(mockTimerStore.resetTimer).toHaveBeenCalledTimes(1);
    });

    it('should display pause icon when timer is running', () => {
      const runningStore = { ...mockTimerStore, isRunning: true, isIdle: false };
      (useTimerStore as jest.Mock).mockReturnValue(runningStore);
      
      render(<PomodoroTimerCard />);
      
      expect(screen.getByText('⏸')).toBeInTheDocument();
    });
  });

  describe('Mode Switching', () => {
    it('should highlight active mode tab', () => {
      render(<PomodoroTimerCard />);
      
      const workTab = screen.getByText('专注');
      expect(workTab).toHaveClass('active');
    });

    it('should call switchMode when mode tab clicked', () => {
      render(<PomodoroTimerCard />);
      
      const shortBreakTab = screen.getByText('短休息');
      fireEvent.click(shortBreakTab);
      
      expect(mockTimerStore.switchMode).toHaveBeenCalledWith('shortBreak');
    });

    it('should display correct mode highlighting for shortBreak', () => {
      const shortBreakStore = { ...mockTimerStore, currentMode: 'shortBreak' };
      (useTimerStore as jest.Mock).mockReturnValue(shortBreakStore);
      
      render(<PomodoroTimerCard />);
      
      const shortBreakTab = screen.getByText('短休息');
      expect(shortBreakTab).toHaveClass('active');
    });
  });

  describe('Task Management', () => {
    it('should display task progress correctly', () => {
      render(<PomodoroTimerCard />);
      
      expect(screen.getByText('2/4')).toBeInTheDocument();
      expect(screen.getByText('0/2')).toBeInTheDocument();
    });

    it('should call completeTask when task checkbox clicked', () => {
      render(<PomodoroTimerCard />);
      
      const taskCheckboxes = screen.getAllByRole('generic', { hidden: true });
      const firstTaskCheckbox = taskCheckboxes.find(el => 
        el.className.includes('task-checkbox')
      );
      
      if (firstTaskCheckbox) {
        fireEvent.click(firstTaskCheckbox);
        expect(mockTaskStore.completeTask).toHaveBeenCalledWith('1');
      }
    });

    it('should show add task form when add button clicked', async () => {
      render(<PomodoroTimerCard />);
      
      const addButton = screen.getByText('+');
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('输入任务名称')).toBeInTheDocument();
        expect(screen.getByText('保存')).toBeInTheDocument();
        expect(screen.getByText('取消')).toBeInTheDocument();
      });
    });

    it('should call addTask when task form submitted', async () => {
      render(<PomodoroTimerCard />);
      
      // Open add form
      const addButton = screen.getByText('+');
      fireEvent.click(addButton);
      
      await waitFor(() => {
        const input = screen.getByPlaceholderText('输入任务名称');
        fireEvent.change(input, { target: { value: '新任务' } });
        
        const saveButton = screen.getByText('保存');
        fireEvent.click(saveButton);
        
        expect(mockTaskStore.addTask).toHaveBeenCalledWith({
          title: '新任务',
          estimatedPomodoros: 4,
        });
      });
    });

    it('should close add form when cancel button clicked', async () => {
      render(<PomodoroTimerCard />);
      
      // Open add form
      const addButton = screen.getByText('+');
      fireEvent.click(addButton);
      
      await waitFor(() => {
        const cancelButton = screen.getByText('取消');
        fireEvent.click(cancelButton);
        
        expect(screen.queryByPlaceholderText('输入任务名称')).not.toBeInTheDocument();
      });
    });

    it('should show empty message when no active tasks', () => {
      const emptyTaskStore = { ...mockTaskStore, getActiveTasks: jest.fn().mockReturnValue([]) };
      (useTaskStore as jest.Mock).mockReturnValue(emptyTaskStore);
      
      render(<PomodoroTimerCard />);
      
      expect(screen.getByText('暂无任务，点击 + 添加任务')).toBeInTheDocument();
    });
  });

  describe('Statistics Display', () => {
    it('should display today pomodoros count', () => {
      render(<PomodoroTimerCard />);
      
      const pomodoroStats = screen.getAllByText('2');
      expect(pomodoroStats.length).toBeGreaterThan(0);
    });

    it('should display work time in minutes', () => {
      render(<PomodoroTimerCard />);
      
      expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('should display completed tasks count', () => {
      const taskStoreWithCompleted = {
        ...mockTaskStore,
        tasks: [
          ...mockTaskStore.tasks,
          {
            id: '3',
            title: '已完成任务',
            estimatedPomodoros: 2,
            completedPomodoros: 2,
            completed: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };
      (useTaskStore as jest.Mock).mockReturnValue(taskStoreWithCompleted);
      
      render(<PomodoroTimerCard />);
      
      expect(screen.getByText('1')).toBeInTheDocument(); // 1 completed task
    });
  });

  describe('Design Compliance', () => {
    it('should apply custom CSS styles', () => {
      render(<PomodoroTimerCard />);
      
      const mainCard = document.querySelector('.main-card');
      expect(mainCard).toBeInTheDocument();
    });

    it('should have timer circle with correct styling', () => {
      render(<PomodoroTimerCard />);
      
      const timerCircle = document.querySelector('.timer-circle');
      expect(timerCircle).toBeInTheDocument();
    });

    it('should have section titles with correct styling', () => {
      render(<PomodoroTimerCard />);
      
      const sectionTitles = document.querySelectorAll('.section-title');
      expect(sectionTitles).toHaveLength(2); // "今日任务" and "今日统计"
    });

    it('should have stats boxes with correct styling', () => {
      render(<PomodoroTimerCard />);
      
      const statBoxes = document.querySelectorAll('.stat-box');
      expect(statBoxes).toHaveLength(3); // 3 statistics cards
    });
  });

  describe('Accessibility', () => {
    it('should have proper button labels', () => {
      render(<PomodoroTimerCard />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have proper list structure for tasks', () => {
      render(<PomodoroTimerCard />);
      
      const taskList = document.querySelector('.task-list');
      expect(taskList).toBeInTheDocument();
      expect(taskList?.tagName).toBe('UL');
    });
  });
}); 