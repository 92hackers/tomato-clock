import React from 'react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsPage } from '../SettingsPage';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock settings store
const mockSettingsStore = {
  timers: {
    workDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
  },
  notifications: {
    timeEndAlert: true,
    breakReminder: false,
  },
  theme: {
    darkMode: false,
  },
  updateTimerSettings: jest.fn(),
  updateNotificationSettings: jest.fn(),
  updateThemeSettings: jest.fn(),
};

jest.mock('../../store/settingsStore', () => ({
  useSettingsStore: () => mockSettingsStore,
}));

describe('SettingsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render settings page with all sections', () => {
      render(<SettingsPage />);

      expect(screen.getByTestId('settings-page')).toBeInTheDocument();
      expect(screen.getByTestId('settings-header')).toBeInTheDocument();
      expect(screen.getByText('设置')).toBeInTheDocument();

      // 检查三个设置分组
      expect(screen.getByTestId('time-settings')).toBeInTheDocument();
      expect(screen.getByTestId('notification-settings')).toBeInTheDocument();
      expect(screen.getByTestId('theme-settings')).toBeInTheDocument();
    });

    it('should display current timer settings values', () => {
      render(<SettingsPage />);

      expect(screen.getByText('25分钟')).toBeInTheDocument(); // 专注时长
      expect(screen.getByText('5分钟')).toBeInTheDocument(); // 短休息时长
      expect(screen.getByText('15分钟')).toBeInTheDocument(); // 长休息时长
    });

    it('should display toggle switches with correct states', () => {
      render(<SettingsPage />);

      const timeEndAlertToggle = screen.getByTestId('time-end-alert-toggle');
      const breakReminderToggle = screen.getByTestId('break-reminder-toggle');
      const darkModeToggle = screen.getByTestId('dark-mode-toggle');

      expect(timeEndAlertToggle).toHaveAttribute('aria-checked', 'true');
      expect(breakReminderToggle).toHaveAttribute('aria-checked', 'false');
      expect(darkModeToggle).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Navigation', () => {
    it('should navigate back when back button is clicked', () => {
      render(<SettingsPage />);

      const backButton = screen.getByTestId('back-button');
      fireEvent.click(backButton);

      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('Toggle Interactions', () => {
    it('should update notification settings when toggles are clicked', () => {
      render(<SettingsPage />);

      const timeEndAlertToggle = screen.getByTestId('time-end-alert-toggle');
      fireEvent.click(timeEndAlertToggle);

      expect(mockSettingsStore.updateNotificationSettings).toHaveBeenCalledWith(
        {
          timeEndAlert: false,
        }
      );

      const breakReminderToggle = screen.getByTestId('break-reminder-toggle');
      fireEvent.click(breakReminderToggle);

      expect(mockSettingsStore.updateNotificationSettings).toHaveBeenCalledWith(
        {
          breakReminder: true,
        }
      );
    });

    it('should update theme settings when dark mode toggle is clicked', () => {
      render(<SettingsPage />);

      const darkModeToggle = screen.getByTestId('dark-mode-toggle');
      fireEvent.click(darkModeToggle);

      expect(mockSettingsStore.updateThemeSettings).toHaveBeenCalledWith({
        darkMode: true,
      });
    });
  });

  describe('Timer Settings', () => {
    it('should allow clicking on timer setting items', () => {
      // Mock window.prompt
      const originalPrompt = window.prompt;
      window.prompt = jest.fn().mockReturnValue('30');

      render(<SettingsPage />);

      const workDurationSetting = screen.getByTestId('work-duration-setting');
      fireEvent.click(workDurationSetting);

      expect(window.prompt).toHaveBeenCalled();
      expect(mockSettingsStore.updateTimerSettings).toHaveBeenCalledWith({
        workDuration: 30 * 60,
      });

      // Restore original prompt
      window.prompt = originalPrompt;
    });
  });
});
