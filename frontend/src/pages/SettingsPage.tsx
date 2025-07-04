'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSettingsStore } from '../store/settingsStore';
import { SettingsHeader } from '../components/Settings/SettingsHeader';
import { SettingsSection } from '../components/Settings/SettingsSection';
import { SettingItem } from '../components/Settings/SettingItem';
import { ToggleSwitch } from '../components/Settings/ToggleSwitch';

export const SettingsPage: React.FC = () => {
  const router = useRouter();
  const {
    timers,
    notifications,
    theme,
    updateTimerSettings,
    updateNotificationSettings,
    updateThemeSettings,
  } = useSettingsStore();

  const handleBack = () => {
    router.push('/');
  };

  // 格式化时间显示（秒转分钟）
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}分钟`;
  };

  // 时间设置处理（这里可以扩展为弹窗编辑）
  const handleTimeSettingClick = (
    setting: 'work' | 'shortBreak' | 'longBreak'
  ) => {
    // 临时实现：弹窗输入
    const currentValue =
      setting === 'work'
        ? timers.workDuration / 60
        : setting === 'shortBreak'
          ? timers.shortBreakDuration / 60
          : timers.longBreakDuration / 60;

    const newValue = prompt(
      `请输入${setting === 'work' ? '专注' : setting === 'shortBreak' ? '短休息' : '长休息'}时长（分钟）：`,
      currentValue.toString()
    );

    if (newValue && !isNaN(parseInt(newValue))) {
      const minutes = parseInt(newValue);
      if (minutes > 0 && minutes <= 120) {
        // 限制1-120分钟
        const seconds = minutes * 60;
        if (setting === 'work') {
          updateTimerSettings({ workDuration: seconds });
        } else if (setting === 'shortBreak') {
          updateTimerSettings({ shortBreakDuration: seconds });
        } else {
          updateTimerSettings({ longBreakDuration: seconds });
        }
      } else {
        alert('请输入1-120之间的数字');
      }
    }
  };

  // 跳转到统计页面
  const handleViewStatistics = () => {
    router.push('/statistics');
  };

  return (
    <div data-testid='settings-page'>
      <SettingsHeader
        title='设置'
        onBack={handleBack}
        data-testid='settings-header'
      />

      <SettingsSection title='数据统计' data-testid='data-statistics'>
        <SettingItem
          label='查看统计数据'
          value='专注时间、任务完成率等'
          onClick={handleViewStatistics}
          data-testid='view-statistics-setting'
        />
        <SettingItem
          label='导出数据'
          value='CSV 格式'
          onClick={() => alert('导出功能开发中...')}
          data-testid='export-data-setting'
        />
      </SettingsSection>

      <SettingsSection title='时间设置' data-testid='time-settings'>
        <SettingItem
          label='专注时长'
          value={formatDuration(timers.workDuration)}
          onClick={() => handleTimeSettingClick('work')}
          data-testid='work-duration-setting'
        />
        <SettingItem
          label='短休息时长'
          value={formatDuration(timers.shortBreakDuration)}
          onClick={() => handleTimeSettingClick('shortBreak')}
          data-testid='short-break-duration-setting'
        />
        <SettingItem
          label='长休息时长'
          value={formatDuration(timers.longBreakDuration)}
          onClick={() => handleTimeSettingClick('longBreak')}
          data-testid='long-break-duration-setting'
        />
      </SettingsSection>

      <SettingsSection title='通知' data-testid='notification-settings'>
        <SettingItem label='时间结束提醒' data-testid='time-end-alert-setting'>
          <ToggleSwitch
            checked={notifications.timeEndAlert}
            onChange={checked =>
              updateNotificationSettings({ timeEndAlert: checked })
            }
            data-testid='time-end-alert-toggle'
          />
        </SettingItem>
        <SettingItem label='休息提醒' data-testid='break-reminder-setting'>
          <ToggleSwitch
            checked={notifications.breakReminder}
            onChange={checked =>
              updateNotificationSettings({ breakReminder: checked })
            }
            data-testid='break-reminder-toggle'
          />
        </SettingItem>
      </SettingsSection>

      <SettingsSection title='主题' data-testid='theme-settings'>
        <SettingItem label='深色模式' data-testid='dark-mode-setting'>
          <ToggleSwitch
            checked={theme.darkMode}
            onChange={checked => updateThemeSettings({ darkMode: checked })}
            data-testid='dark-mode-toggle'
          />
        </SettingItem>
      </SettingsSection>
    </div>
  );
};
