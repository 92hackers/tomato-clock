import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  SettingsStore,
  SettingsState,
  DEFAULT_SETTINGS,
  TimerSettings,
  NotificationSettings,
  ThemeSettings,
} from '../types/settings';

export const useSettingsStore = create<SettingsStore>()(
  persist(
    set => ({
      // 初始状态
      ...DEFAULT_SETTINGS,

      // 更新计时器设置
      updateTimerSettings: (settings: Partial<TimerSettings>) =>
        set(state => ({
          timers: { ...state.timers, ...settings },
        })),

      // 更新通知设置
      updateNotificationSettings: (settings: Partial<NotificationSettings>) =>
        set(state => ({
          notifications: { ...state.notifications, ...settings },
        })),

      // 更新主题设置
      updateThemeSettings: (settings: Partial<ThemeSettings>) =>
        set(state => ({
          theme: { ...state.theme, ...settings },
        })),

      // 重置为默认设置
      resetToDefaults: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'pomodoro-settings', // localStorage key
      partialize: state => ({
        timers: state.timers,
        notifications: state.notifications,
        theme: state.theme,
      }),
    }
  )
);
