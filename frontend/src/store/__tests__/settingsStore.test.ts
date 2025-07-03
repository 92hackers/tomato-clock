import { describe, it, expect, beforeEach } from '@jest/globals';
import { useSettingsStore } from '../settingsStore';
import { DEFAULT_SETTINGS } from '../../types/settings';

describe('SettingsStore', () => {
  beforeEach(() => {
    // 重置store状态
    useSettingsStore.getState().resetToDefaults();
  });

  describe('Initial State', () => {
    it('should initialize with default settings', () => {
      const state = useSettingsStore.getState();
      
      expect(state.timers).toEqual(DEFAULT_SETTINGS.timers);
      expect(state.notifications).toEqual(DEFAULT_SETTINGS.notifications);
      expect(state.theme).toEqual(DEFAULT_SETTINGS.theme);
    });
  });

  describe('Timer Settings', () => {
    it('should update work duration', () => {
      const { updateTimerSettings } = useSettingsStore.getState();
      
      updateTimerSettings({ workDuration: 30 * 60 }); // 30分钟
      
      const state = useSettingsStore.getState();
      expect(state.timers.workDuration).toBe(30 * 60);
      // 其他设置应该保持不变
      expect(state.timers.shortBreakDuration).toBe(DEFAULT_SETTINGS.timers.shortBreakDuration);
      expect(state.timers.longBreakDuration).toBe(DEFAULT_SETTINGS.timers.longBreakDuration);
    });

    it('should update multiple timer settings at once', () => {
      const { updateTimerSettings } = useSettingsStore.getState();
      
      updateTimerSettings({
        workDuration: 45 * 60,
        shortBreakDuration: 15 * 60,
      });
      
      const state = useSettingsStore.getState();
      expect(state.timers.workDuration).toBe(45 * 60);
      expect(state.timers.shortBreakDuration).toBe(15 * 60);
      expect(state.timers.longBreakDuration).toBe(DEFAULT_SETTINGS.timers.longBreakDuration);
    });
  });

  describe('Notification Settings', () => {
    it('should update notification settings', () => {
      const { updateNotificationSettings } = useSettingsStore.getState();
      
      updateNotificationSettings({ timeEndAlert: false });
      
      const state = useSettingsStore.getState();
      expect(state.notifications.timeEndAlert).toBe(false);
      expect(state.notifications.breakReminder).toBe(DEFAULT_SETTINGS.notifications.breakReminder);
    });
  });

  describe('Theme Settings', () => {
    it('should update dark mode setting', () => {
      const { updateThemeSettings } = useSettingsStore.getState();
      
      updateThemeSettings({ darkMode: true });
      
      const state = useSettingsStore.getState();
      expect(state.theme.darkMode).toBe(true);
    });
  });

  describe('Reset Settings', () => {
    it('should reset all settings to defaults', () => {
      const { updateTimerSettings, resetToDefaults } = useSettingsStore.getState();
      
      // 修改设置
      updateTimerSettings({ workDuration: 50 * 60 });
      
      // 验证设置已修改
      let state = useSettingsStore.getState();
      expect(state.timers.workDuration).toBe(50 * 60);
      
      // 重置
      resetToDefaults();
      
      // 验证已重置为默认值
      state = useSettingsStore.getState();
      expect(state.timers).toEqual(DEFAULT_SETTINGS.timers);
    });
  });
}); 