'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSettingsStore } from '../store/settingsStore';

// iOS-style settings styles matching the home page design
const styles = `
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
  }

  .title {
    font-size: 20px;
    font-weight: 600;
    color: #333;
  }

  .back-button {
    margin-right: 10px;
    font-size: 20px;
    background: none;
    border: none;
    cursor: pointer;
    color: #007aff;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .back-button:hover {
    background-color: #f0f0f0;
  }

  .settings-group {
    margin-bottom: 30px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 15px;
  }

  .setting-item {
    padding: 15px 0;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s;
    border-radius: 8px;
    margin-bottom: 2px;
  }

  .setting-item:hover {
    background-color: #f8f9fa;
  }

  .setting-item:last-child {
    border-bottom: none;
  }

  .setting-label {
    font-size: 16px;
    color: #333;
    flex: 1;
  }

  .setting-value {
    color: #999;
    font-size: 16px;
    margin-right: 10px;
  }

  .toggle {
    position: relative;
    width: 50px;
    height: 28px;
    border-radius: 14px;
    background-color: #ddd;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .toggle.active {
    background-color: #007aff;
  }

  .toggle:hover {
    background-color: #e8e8e8;
  }

  .toggle.active:hover {
    background-color: #0056d6;
  }

  .toggle-handle {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: white;
    transition: transform 0.2s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  .toggle.active .toggle-handle {
    transform: translateX(22px);
  }

  .clickable-setting {
    cursor: pointer;
  }

  .clickable-setting:active {
    background-color: #e8e8e8;
  }
`;

// Toggle Switch Component
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  'data-testid'?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  'data-testid': testId,
}) => (
  <div
    className={`toggle ${checked ? 'active' : ''}`}
    onClick={() => onChange(!checked)}
    data-testid={testId}
    role="switch"
    aria-checked={checked}
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onChange(!checked);
      }
    }}
  >
    <div className="toggle-handle" />
  </div>
);

// Setting Item Component
interface SettingItemProps {
  label: string;
  value?: string;
  onClick?: () => void;
  toggle?: React.ReactNode;
  'data-testid'?: string;
}

const SettingItem: React.FC<SettingItemProps> = ({
  label,
  value,
  onClick,
  toggle,
  'data-testid': testId,
}) => (
  <div
    className={`setting-item ${onClick ? 'clickable-setting' : ''}`}
    onClick={onClick}
    data-testid={testId}
  >
    <span className="setting-label">{label}</span>
    {value && <span className="setting-value">{value}</span>}
    {toggle}
  </div>
);

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
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div data-testid='settings-page'>
        {/* Header */}
        <div className='header'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className='back-button' onClick={handleBack}>
              ←
            </button>
            <div className='title'>设置</div>
          </div>
        </div>

        {/* Data Statistics Section */}
        <div className='settings-group'>
          <div className='section-title'>数据统计</div>
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
        </div>

        {/* Time Settings Section */}
        <div className='settings-group'>
          <div className='section-title'>时间设置</div>
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
        </div>

        {/* Notification Settings Section */}
        <div className='settings-group'>
          <div className='section-title'>通知</div>
          <SettingItem
            label='时间结束提醒'
            toggle={
              <ToggleSwitch
                checked={notifications.timeEndAlert}
                onChange={checked =>
                  updateNotificationSettings({ timeEndAlert: checked })
                }
                data-testid='time-end-alert-toggle'
              />
            }
            data-testid='time-end-alert-setting'
          />
          <SettingItem
            label='休息提醒'
            toggle={
              <ToggleSwitch
                checked={notifications.breakReminder}
                onChange={checked =>
                  updateNotificationSettings({ breakReminder: checked })
                }
                data-testid='break-reminder-toggle'
              />
            }
            data-testid='break-reminder-setting'
          />
        </div>

        {/* Theme Settings Section */}
        <div className='settings-group'>
          <div className='section-title'>主题</div>
          <SettingItem
            label='深色模式'
            toggle={
              <ToggleSwitch
                checked={theme.darkMode}
                onChange={checked => updateThemeSettings({ darkMode: checked })}
                data-testid='dark-mode-toggle'
              />
            }
            data-testid='dark-mode-setting'
          />
        </div>
      </div>
    </>
  );
};
