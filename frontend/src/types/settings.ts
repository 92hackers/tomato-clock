// 设置相关类型定义

export interface TimerSettings {
  workDuration: number; // 专注时长（秒）
  shortBreakDuration: number; // 短休息时长（秒）
  longBreakDuration: number; // 长休息时长（秒）
}

export interface NotificationSettings {
  timeEndAlert: boolean; // 时间结束提醒
  breakReminder: boolean; // 休息提醒
}

export interface ThemeSettings {
  darkMode: boolean; // 深色模式
}

export interface SettingsState {
  timers: TimerSettings;
  notifications: NotificationSettings;
  theme: ThemeSettings;
}

export interface SettingsActions {
  updateTimerSettings: (settings: Partial<TimerSettings>) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  updateThemeSettings: (settings: Partial<ThemeSettings>) => void;
  resetToDefaults: () => void;
}

export type SettingsStore = SettingsState & SettingsActions;

// 默认设置值
export const DEFAULT_SETTINGS: SettingsState = {
  timers: {
    workDuration: 25 * 60, // 25分钟
    shortBreakDuration: 5 * 60, // 5分钟
    longBreakDuration: 15 * 60, // 15分钟
  },
  notifications: {
    timeEndAlert: true, // 默认开启时间结束提醒
    breakReminder: false, // 默认关闭休息提醒
  },
  theme: {
    darkMode: false, // 默认浅色模式
  },
};
